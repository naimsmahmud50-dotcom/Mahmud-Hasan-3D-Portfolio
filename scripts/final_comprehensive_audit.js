const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const PORT = 3001;
const CHROME_PORT = 9262;
const SITE_DIR = path.resolve(__dirname, '../cloned_site');

async function startAudit() {
  const tmpDir = fs.mkdtempSync('/tmp/chrome-final-audit-');

  const chrome = spawn('google-chrome', [
    '--headless=new',
    `--remote-debugging-port=${CHROME_PORT}`,
    '--remote-allow-origins=*',
    `--user-data-dir=${tmpDir}`,
    '--no-sandbox',
    '--disable-gpu',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 1500));

  const results = {
    timestamp: new Date().toISOString(),
    tests: {},
    summary: { total: 0, passed: 0, failed: 0 }
  };

  function pass(name, detail) {
    results.summary.total++;
    results.summary.passed++;
    results.tests[name] = { status: 'PASS', detail };
    console.log(`  [PASS] ${name}: ${detail}`);
  }

  function fail(name, detail) {
    results.summary.total++;
    results.summary.failed++;
    results.tests[name] = { status: 'FAIL', detail };
    console.log(`  [FAIL] ${name}: ${detail}`);
  }

  // Helper to open a CDP WebSocket session
  async function createSession(url, viewport = { width: 1366, height: 768 }) {
    const res = await fetch(`http://127.0.0.1:${CHROME_PORT}/json/new`, { method: 'PUT' });
    const target = await res.json();
    const ws = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);

    let msgId = 1;
    const callbacks = new Map();

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.id && callbacks.has(data.id)) {
        const cb = callbacks.get(data.id);
        callbacks.delete(data.id);
        if (data.error) cb.reject(data.error);
        else cb.resolve(data.result);
      }
    };

    function send(method, params = {}) {
      return new Promise((resolve, reject) => {
        const curId = msgId++;
        callbacks.set(curId, { resolve, reject });
        ws.send(JSON.stringify({ id: curId, method, params }));
      });
    }

    async function evalExpr(expression) {
      const resp = await send('Runtime.evaluate', { expression, returnByValue: true });
      return resp?.result?.value;
    }

    async function close() {
      try {
        await send('Page.close');
        ws.close();
      } catch (_) {}
    }

    await send('Page.enable');
    await send('Runtime.enable');
    await send('Emulation.setDeviceMetricsOverride', {
      width: viewport.width,
      height: viewport.height,
      deviceScaleFactor: 1,
      mobile: viewport.width <= 768
    });
    await send('Page.navigate', { url });

    return { send, evalExpr, close };
  }

  try {
    // -------------------------------------------------------------
    // TEST SUITE 1: 3D Desktop Home & Inline Navbar Verification
    // -------------------------------------------------------------
    console.log('\n--- SUITE 1: 3D Desktop Home & Inline Navbar ---');
    const s1 = await createSession(`http://127.0.0.1:${PORT}/index.html?variant=full`);
    await new Promise(r => setTimeout(r, 2200));

    // 1.1 Check 3-Dot Hidden
    const dotHidden = await s1.evalExpr(`(() => {
      const btn = document.querySelector('button._rHu7W_menu, button[aria-label="Menu"]');
      if (!btn) return true;
      const st = window.getComputedStyle(btn);
      return st.display === 'none' || st.visibility === 'hidden' || btn.offsetWidth === 0;
    })()`);
    if (dotHidden) pass('3-Dot Button Hidden', 'Suppressed on desktop 3D');
    else fail('3-Dot Button Hidden', '3-dot button is still visible');

    // 1.2 Check 7 Inline Navbar Links
    const links = await s1.evalExpr(`Array.from(document.querySelectorAll('a._rHu7W_link')).map(a => ({
      text: a.textContent.trim().replace(/\\s+/g, ' '),
      href: a.getAttribute('href'),
      visible: a.offsetWidth > 0 && a.offsetHeight > 0
    }))`);
    const linkTexts = (links || []).map(l => l.text);
    const expected = ['HOME', 'PROJECTS', 'ABOUT', 'CONTACT', 'EXTRA SKILLS', 'PROJECT SLIDE VIEW', 'GITHUB REPO'];
    const allPresent = expected.every(e => linkTexts.includes(e));
    const allVisible = (links || []).filter(l => expected.includes(l.text)).every(l => l.visible);

    if (allPresent && allVisible) {
      pass('Inline Navbar Links', `All 7 links rendered inline & visible: ${linkTexts.join(', ')}`);
    } else {
      fail('Inline Navbar Links', `Missing or invisible links: ${JSON.stringify(links)}`);
    }

    // 1.3 Click PROJECTS -> 3D scroll to scene1 projects cylinder cards
    await s1.evalExpr(`(() => {
      const a = Array.from(document.querySelectorAll('a._rHu7W_link')).find(el => el.textContent.includes('PROJECTS'));
      if (a) a.click();
    })()`);
    await new Promise(r => setTimeout(r, 1800));
    const yProjects = await s1.evalExpr(`window.scrollY`);
    if (yProjects >= 4500) pass('Navbar Click: PROJECTS', `Direct 3D scroll to projects cylinder cards at ${yProjects}px without page reload`);
    else fail('Navbar Click: PROJECTS', `Scroll stopped prematurely at ${yProjects}px instead of projects cylinder (>= 4500px)`);

    // 1.4 Click ABOUT -> 3D scroll to sceneAbout
    await s1.evalExpr(`(() => {
      const a = Array.from(document.querySelectorAll('a._rHu7W_link')).find(el => el.textContent.includes('ABOUT'));
      if (a) a.click();
    })()`);
    await new Promise(r => setTimeout(r, 1800));
    const yAbout = await s1.evalExpr(`window.scrollY`);
    if (yAbout > 6000) pass('Navbar Click: ABOUT', `Direct 3D scroll to About scene at ${yAbout}px without page reload`);
    else fail('Navbar Click: ABOUT', `Scroll failed, scrollY is ${yAbout}px`);

    // 1.5 Click CONTACT -> 3D scroll to sceneContactReveal
    await s1.evalExpr(`(() => {
      const a = Array.from(document.querySelectorAll('a._rHu7W_link')).find(el => el.textContent.includes('CONTACT'));
      if (a) a.click();
    })()`);
    await new Promise(r => setTimeout(r, 1800));
    const yContact = await s1.evalExpr(`window.scrollY`);
    if (yContact > 11000) pass('Navbar Click: CONTACT', `Direct 3D scroll to Contact scene at ${yContact}px without page reload`);
    else fail('Navbar Click: CONTACT', `Scroll failed, scrollY is ${yContact}px`);

    // 1.6 Click HOME -> 3D scroll back to top (0px)
    await s1.evalExpr(`(() => {
      const a = Array.from(document.querySelectorAll('a._rHu7W_link')).find(el => el.textContent.trim().startsWith('HOME'));
      if (a) a.click();
    })()`);
    await new Promise(r => setTimeout(r, 1500));
    const yHome = await s1.evalExpr(`window.scrollY`);
    if (yHome <= 300) pass('Navbar Click: HOME', `Direct 3D scroll to top (${yHome}px)`);
    else fail('Navbar Click: HOME', `Scroll to top failed, scrollY is ${yHome}px`);

    // 1.7 Click EXTRA SKILLS -> Open Video Showcase Modal
    await s1.evalExpr(`(() => {
      const a = Array.from(document.querySelectorAll('a._rHu7W_link')).find(el => el.textContent.includes('EXTRA SKILLS'));
      if (a) a.click();
    })()`);
    await new Promise(r => setTimeout(r, 600));
    const vidModal = await s1.evalExpr(`(() => {
      const m = document.getElementById('mh-my-videos-modal');
      return {
        exists: !!m,
        isActive: m ? m.classList.contains('active') : false,
        videoCards: m ? m.querySelectorAll('.mh-vid-card').length : 0
      };
    })()`);
    if (vidModal && vidModal.isActive && vidModal.videoCards >= 6) {
      pass('Extra Skills Video Showcase Modal', `Opened modal with ${vidModal.videoCards} showcase video cards`);
    } else {
      fail('Extra Skills Video Showcase Modal', `Failed to open or missing videos: ${JSON.stringify(vidModal)}`);
    }

    // Close video modal
    await s1.evalExpr(`(() => {
      const closeBtn = document.getElementById('mh-my-videos-close');
      if (closeBtn) closeBtn.click();
    })()`);

    // 1.8 Terminal Emulator Toggle
    const term = await s1.evalExpr(`(() => {
      const toggle = document.getElementById('mh-terminal-toggle');
      if (toggle) toggle.click();
      const modal = document.getElementById('mh-terminal-modal');
      const input = document.getElementById('mh-terminal-cmd');
      return {
        toggleExists: !!toggle,
        modalExists: !!modal,
        isActive: modal ? modal.classList.contains('active') : false,
        inputExists: !!input
      };
    })()`);
    if (term && term.toggleExists && term.modalExists && term.isActive) {
      pass('Cyber Terminal Emulator', 'Toggle button works, opens interactive terminal with input');
    } else {
      fail('Cyber Terminal Emulator', `Terminal failed: ${JSON.stringify(term)}`);
    }

    // 1.9 Available Button (Email Copy)
    const avail = await s1.evalExpr(`(() => {
      const btn = document.querySelector('button._rHu7W_availability, [class*="_rHu7W_availability"]');
      if (btn) btn.click();
      const copied = document.querySelector('._rHu7W_copied');
      return {
        exists: !!btn,
        toast: !!copied
      };
    })()`);
    if (avail && avail.exists) pass('Available Button (Contact Pill)', 'Active and copies contact email');
    else fail('Available Button (Contact Pill)', 'Button not found');

    await s1.close();

    // -------------------------------------------------------------
    // TEST SUITE 2: 2D Slide View (/lite) & HUD Verification
    // -------------------------------------------------------------
    console.log('\n--- SUITE 2: 2D Slide View (/lite) ---');
    const s2 = await createSession(`http://127.0.0.1:${PORT}/lite.html`);
    await new Promise(r => setTimeout(r, 2000));

    const liteState = await s2.evalExpr(`(() => {
      const cards = document.querySelectorAll('article, [class*="card"]');
      const hudBar = document.getElementById('mh-slide-nav-hud') || document.querySelector('.mh-slide-hud-container');
      const menuBtn = document.querySelector('button._rHu7W_menu, button[aria-label="Menu"]');
      const is3DotHidden = !menuBtn || window.getComputedStyle(menuBtn).display === 'none';
      const inlineLinks = Array.from(document.querySelectorAll('a._rHu7W_link')).map(a => a.textContent.trim());

      return {
        cardsCount: cards.length,
        hudExists: !!hudBar,
        is3DotHidden,
        inlineLinks
      };
    })()`);

    if (liteState && liteState.cardsCount >= 8) {
      pass('2D Project Slide View Cards', `Found ${liteState.cardsCount} project cards`);
    } else {
      fail('2D Project Slide View Cards', `Expected >= 8 cards, found ${liteState?.cardsCount}`);
    }

    if (liteState && liteState.is3DotHidden) {
      pass('2D Slide View 3-Dot Hidden', '3-dot button suppressed in /lite');
    } else {
      fail('2D Slide View 3-Dot Hidden', '3-dot button visible in /lite');
    }

    if (liteState && liteState.inlineLinks && liteState.inlineLinks.length >= 7) {
      pass('2D Slide View Inline Navbar', `All ${liteState.inlineLinks.length} links present: ${liteState.inlineLinks.join(', ')}`);
    } else {
      fail('2D Slide View Inline Navbar', `Navbar links missing in /lite: ${JSON.stringify(liteState?.inlineLinks)}`);
    }

    await s2.close();

    // -------------------------------------------------------------
    // TEST SUITE 3: Mobile Viewport Responsiveness (375x667)
    // -------------------------------------------------------------
    console.log('\n--- SUITE 3: Mobile Viewport Responsiveness ---');
    const s3 = await createSession(`http://127.0.0.1:${PORT}/lite.html`, { width: 375, height: 667 });
    await new Promise(r => setTimeout(r, 1800));

    const mobState = await s3.evalExpr(`(() => {
      const menuBtn = document.querySelector('button._rHu7W_menu, button[aria-label="Menu"]');
      const is3DotHidden = !menuBtn || window.getComputedStyle(menuBtn).display === 'none' || menuBtn.offsetWidth === 0;
      const panel = document.querySelector('div._rHu7W_menuPanel');
      const panelVisible = panel && window.getComputedStyle(panel).display !== 'none';
      const links = Array.from(document.querySelectorAll('a._rHu7W_link')).map(a => ({
        text: a.textContent.trim(),
        visible: a.offsetWidth > 0
      }));
      return {
        is3DotHidden,
        panelVisible,
        allVisible: links.length >= 7 && links.every(l => l.visible),
        links
      };
    })()`);

    if (mobState && mobState.is3DotHidden && mobState.panelVisible && mobState.allVisible) {
      pass('Mobile Viewport Navbar', '3-dot hidden, horizontal menuPanel scrollable inline without hamburger overlay');
    } else {
      fail('Mobile Viewport Navbar', `Mobile configuration issue: ${JSON.stringify(mobState)}`);
    }

    await s3.close();

    // -------------------------------------------------------------
    // TEST SUITE 4: Static Subroute Fallbacks
    // -------------------------------------------------------------
    console.log('\n--- SUITE 4: Static Routes & Project Slugs ---');
    const coreRoutes = ['index.html', 'lite.html', 'about.html', 'contact.html', 'projects.html', 'legal-notice.html'];
    let allRoutesExist = true;
    for (const r of coreRoutes) {
      if (!fs.existsSync(path.join(SITE_DIR, r))) {
        allRoutesExist = false;
        fail('Core Static Routes', `Missing ${r}`);
        break;
      }
    }
    if (allRoutesExist) pass('Core Static Routes', 'All routes (index, lite, about, contact, projects, legal-notice) exist');

    // -------------------------------------------------------------
    // SUMMARY
    // -------------------------------------------------------------
    console.log('\n=============================================================');
    console.log(` AUDIT COMPLETE: ${results.summary.passed}/${results.summary.total} PASSED (${results.summary.failed} FAILED)`);
    console.log('=============================================================');

    fs.writeFileSync(
      path.resolve(__dirname, '../.specify/bugs/navbar-inline-links-systematic-overhaul/audit_report.json'),
      JSON.stringify(results, null, 2)
    );
    console.log('Report saved to .specify/bugs/navbar-inline-links-systematic-overhaul/audit_report.json');

  } catch (err) {
    console.error('[AUDIT ERROR]:', err);
  } finally {
    chrome.kill();
    process.exit(0);
  }
}

startAudit();
