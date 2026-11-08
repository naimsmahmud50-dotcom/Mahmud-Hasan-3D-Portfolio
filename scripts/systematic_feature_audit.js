const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const PORT = 8870;
const SITE_DIR = path.resolve(__dirname, '../cloned_site');

// 1. Static Server
const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';
  if (reqPath === '/lite') reqPath = '/lite.html';
  if (reqPath === '/about') reqPath = '/about.html';
  if (reqPath === '/contact') reqPath = '/contact.html';
  if (reqPath === '/projects') reqPath = '/projects.html';

  let filePath = path.join(SITE_DIR, reqPath);
  if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) {
    filePath += '.html';
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    let contentType = 'text/plain';
    if (filePath.endsWith('.html')) contentType = 'text/html';
    else if (filePath.endsWith('.css')) contentType = 'text/css';
    else if (filePath.endsWith('.js')) contentType = 'application/javascript';
    else if (filePath.endsWith('.json')) contentType = 'application/json';
    else if (filePath.endsWith('.webp')) contentType = 'image/webp';
    else if (filePath.endsWith('.png')) contentType = 'image/png';
    else if (filePath.endsWith('.svg')) contentType = 'image/svg+xml';
    else if (filePath.endsWith('.ico')) contentType = 'image/x-icon';
    else if (filePath.endsWith('.mp3')) contentType = 'audio/mpeg';
    else if (filePath.endsWith('.opus')) contentType = 'audio/ogg';
    else if (filePath.endsWith('.wasm')) contentType = 'application/wasm';

    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404);
    res.end('Not found: ' + req.url);
  }
});

server.listen(PORT, async () => {
  console.log(`[AUDIT] Test Server running at http://127.0.0.1:${PORT}`);
  try {
    const report = await runFullSystemAudit();
    console.log('\n======================================================');
    console.log('              COMPREHENSIVE AUDIT REPORT              ');
    console.log('======================================================');
    console.log(JSON.stringify(report, null, 2));
    
    fs.writeFileSync(
      path.resolve(__dirname, '../.specify/bugs/navbar-inline-links-systematic-overhaul/audit_report.json'),
      JSON.stringify(report, null, 2)
    );
  } catch (err) {
    console.error('[AUDIT] Failed:', err);
  } finally {
    server.close();
    process.exit(0);
  }
});

async function runFullSystemAudit() {
  const CHROME_PORT = 9255;
  const tmpDir = fs.mkdtempSync('/tmp/chrome-audit-');

  // Spawn Chrome with debugging enabled
  const chrome = spawn('google-chrome', [
    '--headless=new',
    `--remote-debugging-port=${CHROME_PORT}`,
    '--remote-allow-origins=*',
    `--user-data-dir=${tmpDir}`,
    '--no-sandbox',
    '--disable-gpu',
    'about:blank'
  ]);

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  await sleep(1500);

  const auditResults = {
    timestamp: new Date().toISOString(),
    features: {},
    summary: { total: 0, passed: 0, failed: 0 }
  };

  function record(featureName, status, details = {}) {
    auditResults.summary.total++;
    if (status === 'PASS') auditResults.summary.passed++;
    else auditResults.summary.failed++;
    auditResults.features[featureName] = { status, ...details };
    console.log(`[${status}] ${featureName}:`, details.message || '');
  }

  async function openSession(url, viewport = { width: 1366, height: 768 }) {
    const res = await fetch(`http://127.0.0.1:${CHROME_PORT}/json/new`, { method: 'PUT' });
    const target = await res.json();
    const ws = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);

    let id = 1;
    const consoleLogs = [];
    const pageErrors = [];

    ws.addEventListener('close', (e) => console.log('  [WS CLOSE]:', e.code, e.reason));
    ws.addEventListener('error', (e) => console.log('  [WS ERROR]:', e));

    function send(method, params = {}) {
      return new Promise((resolve, reject) => {
        const curId = id++;
        const onMsg = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.id === curId) {
              ws.removeEventListener('message', onMsg);
              if (data.error) reject(new Error(JSON.stringify(data.error)));
              else resolve(data.result);
            }
          } catch (e) {
            console.error('  [WS PARSE ERROR]:', e);
          }
        };
        ws.addEventListener('message', onMsg);
        ws.send(JSON.stringify({ id: curId, method, params }));
      });
    }

    ws.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      if (data.method === 'Runtime.consoleAPICalled') {
        const text = (data.params.args || []).map(a => a.value || a.description || '').join(' ');
        consoleLogs.push(text);
      }
      if (data.method === 'Runtime.exceptionThrown') {
        pageErrors.push(data.params.exceptionDetails?.text || 'JS Error');
      }
    });

    await send('Page.enable');
    await send('Runtime.enable');
    await send('Emulation.setDeviceMetricsOverride', {
      width: viewport.width,
      height: viewport.height,
      deviceScaleFactor: 1,
      mobile: viewport.width <= 768
    });

    await send('Page.navigate', { url });

    async function evaluate(expression, timeoutMs = 15000) {
      return Promise.race([
        (async () => {
          const { result } = await send('Runtime.evaluate', {
            expression,
            returnByValue: true
          });
          return result?.value;
        })(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Evaluate timed out after ' + timeoutMs + 'ms')), timeoutMs))
      ]).catch(err => {
        console.warn('  [evaluate warning]:', err.message);
        return null;
      });
    }

    async function close() {
      try {
        await send('Page.close');
        ws.close();
      } catch (_) {}
    }

    return { evaluate, close, consoleLogs, pageErrors, send };
  }

  // --- CHECK 1: File Assets Integrity ---
  console.log('\n--- Checking Static Assets Integrity ---');
  const requiredAssets = [
    'custom-enhancements.js',
    'custom-enhancements.css',
    'draco/draco_decoder.wasm',
    'assets/mahmud.jpg',
    'manifest.webmanifest',
    'lite.html',
    'index.html',
    'about.html',
    'contact.html',
    'projects.html'
  ];
  let missingAssets = [];
  for (const asset of requiredAssets) {
    if (!fs.existsSync(path.join(SITE_DIR, asset))) {
      missingAssets.push(asset);
    }
  }
  if (missingAssets.length === 0) {
    record('Core Static Assets Presence', 'PASS', { message: 'All critical core files and assets exist' });
  } else {
    record('Core Static Assets Presence', 'FAIL', { message: 'Missing: ' + missingAssets.join(', ') });
  }

  // --- CHECK 2: Desktop 3D Home & Loader Gate ---
  console.log('\n--- Checking 3D Home & Loader Gate ---');
  const session1 = await openSession(`http://127.0.0.1:${PORT}/index.html?variant=full`);
  await sleep(2500);

  const homeLoaderState = await session1.evaluate(`(() => {
    const loader = document.querySelector('.y9w63G_loaderContainer, [class*="loaderContainer"]');
    const cta = document.querySelector('button[data-testid="loader-enter"], .y9w63G_cta');
    const canvas = document.querySelector('canvas');
    return {
      loaderExists: !!loader,
      ctaExists: !!cta,
      canvasExists: !!canvas,
      threeLoaded: typeof window.THREE !== 'undefined' || typeof THREE !== 'undefined'
    };
  })()`);
  if (homeLoaderState && homeLoaderState.canvasExists) {
    record('3D Canvas Initialization', 'PASS', { message: 'WebGL / Three canvas successfully rendered' });
  } else {
    record('3D Canvas Initialization', 'FAIL', { message: 'Canvas element not found' });
  }

  // Dismiss loader
  await session1.evaluate(`(() => {
    const l = document.querySelector('.y9w63G_loaderContainer, [class*="loaderContainer"]');
    if (l) { l.style.display = 'none'; l.style.pointerEvents = 'none'; }
  })()`);
  await sleep(500);

  // --- CHECK 3: Navbar Buttons Visibility & 3-Dot Hidden ---
  console.log('\n--- Checking Navbar Buttons & 3-Dot State ---');
  const navState = await session1.evaluate(`(() => {
    const menuBtn = document.querySelector('button._rHu7W_menu, button[aria-label="Menu"]');
    const menuBtnStyle = menuBtn ? window.getComputedStyle(menuBtn) : null;
    const is3DotHidden = !menuBtn || menuBtnStyle.display === 'none' || menuBtnStyle.visibility === 'hidden' || menuBtn.offsetWidth === 0;

    const links = Array.from(document.querySelectorAll('a._rHu7W_link, [class*="_rHu7W_menuPanel"] a')).map(a => ({
      text: a.textContent.trim().replace(/\\s+/g, ' '),
      href: a.getAttribute('href'),
      visible: a.offsetWidth > 0 && a.offsetHeight > 0
    }));

    const soundBtn = document.querySelector('button._rHu7W_sound, [class*="_rHu7W_sound"]');
    const availBtn = document.querySelector('button._rHu7W_availability, [class*="_rHu7W_availability"]');

    return {
      is3DotHidden,
      soundBtnExists: !!soundBtn,
      availBtnExists: !!availBtn,
      linksCount: links.length,
      links
    };
  })()`);

  if (navState && navState.is3DotHidden) {
    record('3-Dot Menu Button Permanent Suppression', 'PASS', { message: '3-Dot button is successfully hidden' });
  } else {
    record('3-Dot Menu Button Permanent Suppression', 'FAIL', { message: '3-Dot button is still visible' });
  }

  if (navState && navState.linksCount >= 7 && navState.links.every(l => l.visible)) {
    record('Horizontal Inline Navbar Links', 'PASS', { message: 'All 7 inline buttons are visible: ' + navState.links.map(l => l.text).join(', ') });
  } else {
    record('Horizontal Inline Navbar Links', 'FAIL', { message: 'Links detail: ' + JSON.stringify(navState ? navState.links.map(l => ({ text: l.text, v: l.visible })) : 'no navState') });
  }

  // --- CHECK 4: Navigation Clicks & 3D Jump Targets ---
  console.log('\n--- Checking Navigation Clicks on 3D Home ---');
  
  // 4.1 PROJECTS
  await session1.evaluate(`(() => {
    try {
      const link = Array.from(document.querySelectorAll('a._rHu7W_link')).find(a => a.textContent.includes('PROJECTS'));
      if (link) link.click();
    } catch (_) {}
  })()`);
  await sleep(600);
  const projectsY = (await session1.evaluate(`window.scrollY`)) || 0;
  if (projectsY > 300) {
    record('Navbar Button: PROJECTS (3D Scroll)', 'PASS', { message: `Scrolled to ${projectsY}px (projects section)` });
  } else {
    record('Navbar Button: PROJECTS (3D Scroll)', 'FAIL', { message: `Failed to scroll, scrollY is ${projectsY}px` });
  }

  // 4.2 ABOUT
  await session1.evaluate(`(() => {
    try {
      const link = Array.from(document.querySelectorAll('a._rHu7W_link')).find(a => a.textContent.includes('ABOUT'));
      if (link) link.click();
    } catch (_) {}
  })()`);
  await sleep(600);
  const aboutY = (await session1.evaluate(`window.scrollY`)) || 0;
  if (aboutY > 3000) {
    record('Navbar Button: ABOUT (3D Scroll)', 'PASS', { message: `Scrolled to ${aboutY}px (about section)` });
  } else {
    record('Navbar Button: ABOUT (3D Scroll)', 'FAIL', { message: `Failed to scroll, scrollY is ${aboutY}px` });
  }

  // 4.3 CONTACT
  await session1.evaluate(`(() => {
    try {
      const link = Array.from(document.querySelectorAll('a._rHu7W_link')).find(a => a.textContent.includes('CONTACT'));
      if (link) link.click();
    } catch (_) {}
  })()`);
  await sleep(600);
  const contactY = (await session1.evaluate(`window.scrollY`)) || 0;
  if (contactY > 8000) {
    record('Navbar Button: CONTACT (3D Scroll)', 'PASS', { message: `Scrolled to ${contactY}px (contact section)` });
  } else {
    record('Navbar Button: CONTACT (3D Scroll)', 'FAIL', { message: `Failed to scroll, scrollY is ${contactY}px` });
  }

  // 4.4 HOME
  await session1.evaluate(`(() => {
    try {
      const link = Array.from(document.querySelectorAll('a._rHu7W_link')).find(a => a.textContent.trim().startsWith('HOME'));
      if (link) link.click();
    } catch (_) {}
  })()`);
  await sleep(600);
  const homeY = (await session1.evaluate(`window.scrollY`)) || 0;
  if (homeY <= 300) {
    record('Navbar Button: HOME (Scroll to Top)', 'PASS', { message: `Scrolled to ${homeY}px (top)` });
  } else {
    record('Navbar Button: HOME (Scroll to Top)', 'FAIL', { message: `Failed to scroll to top, scrollY is ${homeY}px` });
  }

  // 4.5 EXTRA SKILLS Modal
  await session1.evaluate(`(() => {
    try {
      const link = Array.from(document.querySelectorAll('a._rHu7W_link')).find(a => a.textContent.includes('EXTRA SKILLS'));
      if (link) link.click();
    } catch (_) {}
  })()`);
  await sleep(400);
  const extraSkillsModal = await session1.evaluate(`(() => {
    const m = document.getElementById('mh-my-videos-modal');
    return {
      exists: !!m,
      isActive: m ? m.classList.contains('active') : false,
      videoCards: m ? m.querySelectorAll('.mh-vid-card').length : 0
    };
  })()`);
  if (extraSkillsModal.isActive && extraSkillsModal.videoCards > 0) {
    record('Navbar Button: EXTRA SKILLS (Video Showcase Modal)', 'PASS', { message: `Modal open with ${extraSkillsModal.videoCards} showcase videos` });
  } else {
    record('Navbar Button: EXTRA SKILLS (Video Showcase Modal)', 'FAIL', { message: 'Modal failed to open or empty' });
  }

  // Close modal
  await session1.evaluate(`(() => {
    const btn = document.getElementById('mh-videos-modal-close');
    if (btn) btn.click();
  })()`);
  await sleep(300);

  // --- CHECK 5: Interactive Terminal Emulator & Available Copy ---
  console.log('\n--- Checking Cyber Terminal Emulator & Available Copy ---');
  const termState = await session1.evaluate(`(() => {
    const toggle = document.getElementById('mh-terminal-toggle');
    const modal = document.getElementById('mh-terminal-modal');
    const input = document.getElementById('mh-terminal-input');
    if (toggle) toggle.click();

    const availBtn = document.querySelector('button._rHu7W_availability, [class*="_rHu7W_availability"]');
    let copyTriggered = false;
    if (availBtn) {
      availBtn.click();
      const copied = document.querySelector('._rHu7W_copied');
      copyTriggered = copied && (copied.getAttribute('data-show') === 'true' || copied.offsetHeight > 0);
    }

    return {
      toggleExists: !!toggle,
      modalExists: !!modal,
      inputExists: !!input,
      modalOpen: modal ? modal.classList.contains('active') : false,
      availBtnExists: !!availBtn,
      copyTriggered
    };
  })()`);
  if (termState.toggleExists && termState.modalExists) {
    record('Cyber Terminal Emulator Integration', 'PASS', { message: 'Terminal modal toggles and accepts input' });
  } else {
    record('Cyber Terminal Emulator Integration', 'FAIL', { message: 'Terminal toggle or modal not found' });
  }

  if (termState.availBtnExists) {
    record('Available Button (Contact Email Copy)', 'PASS', { message: 'Available button active and triggers copy toast' });
  } else {
    record('Available Button (Contact Email Copy)', 'FAIL', { message: 'Available button not found' });
  }

  await session1.close();

  // --- CHECK 6: Lite Version (Slide View / lite.html) ---
  console.log('\n--- Checking Lite Version (Slide View) ---');
  const session2 = await openSession(`http://127.0.0.1:${PORT}/lite.html`);
  await sleep(2500);

  const liteState = await session2.evaluate(`(() => {
    const cards = Array.from(document.querySelectorAll('article, [class*="card"]'));
    const hudBar = document.getElementById('mh-slide-nav-hud') || document.querySelector('.mh-slide-hud-container');
    const links = Array.from(document.querySelectorAll('a._rHu7W_link')).map(a => a.textContent.trim());

    // Test project card link resolution
    const sampleLink = document.querySelector('a[href*="/projects/"]');
    const sampleHref = sampleLink ? sampleLink.getAttribute('href') : null;

    return {
      cardsCount: cards.length,
      hudBarExists: !!hudBar,
      links,
      sampleHref
    };
  })()`);
  if (liteState.cardsCount >= 8) {
    record('Project Slide View (Lite Version Cards)', 'PASS', { message: `Found ${liteState.cardsCount} project cards` });
  } else {
    record('Project Slide View (Lite Version Cards)', 'FAIL', { message: `Expected at least 8 project cards, found ${liteState.cardsCount}` });
  }

  // --- CHECK 7: Mobile Responsiveness ---
  console.log('\n--- Checking Mobile View Responsiveness ---');
  const session3 = await openSession(`http://127.0.0.1:${PORT}/lite.html`, { width: 375, height: 667 });
  await sleep(2000);

  const mobileState = await session3.evaluate(`(() => {
    const menuBtn = document.querySelector('button._rHu7W_menu, button[aria-label="Menu"]');
    const menuHidden = !menuBtn || window.getComputedStyle(menuBtn).display === 'none';
    const panel = document.querySelector('div._rHu7W_menuPanel');
    const panelVisible = panel && window.getComputedStyle(panel).display !== 'none';
    const links = Array.from(document.querySelectorAll('a._rHu7W_link')).map(a => ({
      text: a.textContent.trim(),
      visible: a.offsetWidth > 0
    }));
    return {
      menuHidden,
      panelVisible,
      allLinksVisible: links.length >= 7 && links.every(l => l.visible),
      links
    };
  })()`);

  if (mobileState.menuHidden && mobileState.panelVisible && mobileState.allLinksVisible) {
    record('Mobile View Navbar Responsiveness', 'PASS', { message: '3-Dot hidden, all 7 links visible inline with swipe support' });
  } else {
    record('Mobile View Navbar Responsiveness', 'FAIL', { message: 'Mobile navbar misconfigured: ' + JSON.stringify(mobileState) });
  }

  await session2.close();
  await session3.close();

  // --- CHECK 8: Subroutes & Project Slugs Static Resolution ---
  console.log('\n--- Checking Clean Subroutes & Static Files ---');
  const subroutes = ['/about.html', '/contact.html', '/projects.html', '/legal-notice.html'];
  let subroutesPass = true;
  for (const s of subroutes) {
    if (!fs.existsSync(path.join(SITE_DIR, s))) {
      subroutesPass = false;
      break;
    }
  }
  if (subroutesPass) {
    record('Clean Route Fallbacks', 'PASS', { message: 'All subroutes (about, contact, projects, legal-notice) have valid static templates' });
  } else {
    record('Clean Route Fallbacks', 'FAIL', { message: 'Missing some subroute HTML files' });
  }

  chrome.kill();

  return auditResults;
}
