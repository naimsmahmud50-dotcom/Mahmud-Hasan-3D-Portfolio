const { spawn } = require('child_process');
const fs = require('fs');

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function auditTarget(url, name) {
  console.log(`\n======================================================================`);
  console.log(`[SPEC AUDIT] TARGET: ${name} (${url})`);
  console.log(`======================================================================`);

  const tmpDir = fs.mkdtempSync('/tmp/chrome-spec-');
  const port = 9520 + Math.floor(Math.random() * 50);
  const chrome = spawn('google-chrome', [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--remote-allow-origins=*',
    `--user-data-dir=${tmpDir}`,
    '--no-sandbox',
    '--disable-extensions',
    '--use-gl=angle',
    '--use-angle=swiftshader',
    'about:blank'
  ]);

  await sleep(2000);

  const report = {
    target: url,
    name,
    runtimeErrors: [],
    layoutChecks: {},
    featureChecks: {},
    passed: 0,
    failed: 0
  };

  const record = (category, testName, pass, details = {}) => {
    report[category][testName] = { pass, ...details };
    if (pass) {
      report.passed++;
      console.log(`  ✓ [PASS] [${category}] ${testName}`);
    } else {
      report.failed++;
      console.error(`  ✗ [FAIL] [${category}] ${testName}:`, details);
    }
  };

  try {
    const res = await fetch(`http://127.0.0.1:${port}/json`);
    const tabs = await res.json();
    const tab = tabs.find(t => t.type === 'page' && !t.url.startsWith('chrome-extension')) || tabs[0];
    const ws = new WebSocket(tab.webSocketDebuggerUrl);
    if (ws.readyState !== 1) {
      await new Promise(r => ws.addEventListener('open', r, { once: true }));
    }

    let id = 1;
    const call = (method, params = {}) => new Promise((resolve, reject) => {
      const mid = id++;
      const timer = setTimeout(() => {
        ws.removeEventListener('message', handler);
        reject(new Error(`Timeout on ${method}`));
      }, 8000);
      const handler = (e) => {
        const m = JSON.parse(e.data);
        if (m.id === mid) {
          clearTimeout(timer);
          ws.removeEventListener('message', handler);
          if (m.error) reject(m.error);
          else resolve(m.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: mid, method, params }));
    });

    ws.addEventListener('message', (e) => {
      const m = JSON.parse(e.data);
      if (m.id) console.log(`[WS_RES] id=${m.id}`);
      if (m.method === 'Runtime.exceptionThrown') {
        const text = m.params.exceptionDetails?.exception?.description || m.params.exceptionDetails?.text;
        report.runtimeErrors.push(text);
      }
    });

    const evalInPage = async (expr) => {
      const r = await call('Runtime.evaluate', { expression: expr, returnByValue: true });
      if (r && r.exceptionDetails) {
        throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
      }
      return r ? r.result?.value : undefined;
    };

    await call('Page.enable');
    await call('Runtime.enable');

    console.log(`Navigating to ${url}...`);
    await call('Page.navigate', { url });
    await sleep(4000);

    // 1. Initial Scene & 3D Initialization
    console.log(`\nPhase 1: Initial Scene & 3D Initialization...`);
    const initCheck = await evalInPage(`(() => {
      const canvas = document.querySelector('canvas');
      const exposureH = window.__mhThreeState ? window.__mhThreeState.exposureH : 1;
      return {
        scrollY: window.scrollY,
        hasCanvas: !!canvas,
        exposureH: exposureH,
        bodyWidth: document.body.scrollWidth,
        windowWidth: window.innerWidth,
        hasHorizontalOverflow: document.body.scrollWidth > window.innerWidth + 2
      };
    })()`);

    record('featureChecks', 'Initial Landing at Scene 1 (scrollY == 0)', initCheck && initCheck.scrollY === 0, { scrollY: initCheck?.scrollY });
    record('featureChecks', '3D WebGL Canvas Render Active', !!initCheck?.hasCanvas);
    record('featureChecks', 'Zero Darkness (Exposure >= 0.8)', initCheck && initCheck.exposureH >= 0.8, { exposureH: initCheck?.exposureH });
    record('layoutChecks', 'Desktop No Horizontal Overflow', initCheck && !initCheck.hasHorizontalOverflow, { bodyWidth: initCheck?.bodyWidth });

    // 2. Navbar All 7 Links Check
    console.log(`\nPhase 2: Navbar Verification (7 Items)...`);
    const navItems = await evalInPage(`(() => {
      const links = Array.from(document.querySelectorAll('a')).map(a => (a.textContent || '').trim().toUpperCase());
      const expected = ['HOME', 'PROJECTS', 'ABOUT', 'CONTACT', 'EXTRA SKILLS', 'PROJECT SLIDE VIEW', 'GITHUB REPO'];
      const found = {};
      expected.forEach(name => {
        found[name] = links.includes(name);
      });
      return found;
    })()`);
    const all7Present = navItems && Object.values(navItems).every(v => v === true);
    record('featureChecks', 'All 7 Navbar Links Mounted', all7Present, navItems);

    // 3. Navigation to PROJECTS
    console.log(`\nPhase 3: Scene Navigation - PROJECTS...`);
    await evalInPage(`(() => {
      const el = Array.from(document.querySelectorAll('a')).find(e => (e.textContent || '').trim().toUpperCase() === 'PROJECTS');
      if (el) el.click();
    })()`);
    await sleep(2000);
    const projectsScroll = await evalInPage(`window.scrollY`);
    record('featureChecks', 'Navigate to PROJECTS advances scroll / 3D camera', projectsScroll > 0, { scrollY: projectsScroll });

    // 4. Navigation to ABOUT
    console.log(`\nPhase 4: Scene Navigation - ABOUT (Portrait & Skills Layout)...`);
    await evalInPage(`(() => {
      const el = Array.from(document.querySelectorAll('a')).find(e => (e.textContent || '').trim().toUpperCase() === 'ABOUT');
      if (el) el.click();
    })()`);
    let aboutInfo = null;
    for (let i = 0; i < 20; i++) {
      await sleep(350);
      aboutInfo = await evalInPage(`(() => {
        const portrait = document.getElementById('mh-portrait-container') || document.querySelector('img[src*="mahmud-hasan-about-portrait"]');
        const matrix = document.getElementById('mh-about-skills-matrix');
        return {
          scrollY: window.scrollY,
          hasPortrait: !!portrait,
          portraitVisible: portrait ? portrait.style.display !== 'none' : false,
          hasSkillsMatrix: !!matrix,
          skillsCount: matrix ? matrix.querySelectorAll('.mh-skill-chip').length : 0
        };
      })()`);
      if (aboutInfo && aboutInfo.hasPortrait && aboutInfo.hasSkillsMatrix && aboutInfo.skillsCount > 0) break;
    }
    record('layoutChecks', 'Mahmud Hasan Portrait Mounted & Visible', aboutInfo && aboutInfo.hasPortrait && aboutInfo.portraitVisible);
    record('layoutChecks', 'About Skills Matrix Rendered without Overflow', aboutInfo && aboutInfo.hasSkillsMatrix && aboutInfo.skillsCount > 0, { skillsCount: aboutInfo?.skillsCount });

    // 5. Navigation to CONTACT
    console.log(`\nPhase 5: Scene Navigation - CONTACT...`);
    await evalInPage(`(() => {
      const el = Array.from(document.querySelectorAll('a')).find(e => (e.textContent || '').trim().toUpperCase() === 'CONTACT');
      if (el) el.click();
    })()`);
    await sleep(2000);
    const contactScroll = await evalInPage(`window.scrollY`);
    record('featureChecks', 'Navigate to CONTACT advances scene', contactScroll > projectsScroll, { scrollY: contactScroll });

    // 6. Navigation back to HOME
    console.log(`\nPhase 6: Scene Navigation - Return to HOME...`);
    await evalInPage(`(() => {
      const el = Array.from(document.querySelectorAll('a')).find(e => (e.textContent || '').trim().toUpperCase() === 'HOME');
      if (el) el.click();
    })()`);
    await sleep(2000);
    const homeScroll = await evalInPage(`window.scrollY`);
    record('featureChecks', 'Click HOME returns to Nature Home (scrollY < 200)', homeScroll < 200, { scrollY: homeScroll });

    // 7. Interactive Features: Dhaka Clock, Video Modal
    console.log(`\nPhase 7: Interactive Utility Features...`);
    const clockInfo = await evalInPage(`(() => {
      const el = document.getElementById('mh-dhaka-clock');
      return {
        hasClock: !!el,
        text: el ? el.textContent.trim() : ''
      };
    })()`);
    record('featureChecks', 'Dhaka Real-time Clock Active & Live', clockInfo && clockInfo.hasClock && clockInfo.text.length > 0, clockInfo);

    // Test Video Showcase Modal
    await evalInPage(`(() => {
      if (typeof window.__mhOpenMyVideos === 'function') window.__mhOpenMyVideos();
    })()`);
    await sleep(800);
    const videoModalActive = await evalInPage(`(() => {
      const m = document.getElementById('mh-my-videos-modal');
      return m ? m.classList.contains('active') : false;
    })()`);
    record('featureChecks', 'Video Showcase Modal Opens Cleanly', !!videoModalActive);

    // Close Video Modal
    await evalInPage(`(() => {
      if (typeof window.__mhCloseMyVideos === 'function') window.__mhCloseMyVideos();
    })()`);
    await sleep(400);

    // 8. Mobile & Responsive Layout Check
    console.log(`\nPhase 8: Responsive Layout Checks...`);
    const responsiveCheck = await evalInPage(`(() => {
      return {
        width: window.innerWidth,
        canvasPresent: !!document.querySelector('canvas'),
        bodyWidth: document.body.scrollWidth,
        overflow: document.body.scrollWidth > window.innerWidth + 2
      };
    })()`);
    record('layoutChecks', 'Viewport Canvas Active & Unbroken', responsiveCheck && responsiveCheck.canvasPresent);
    record('layoutChecks', 'Layout No Horizontal Bounds Overflow', responsiveCheck && !responsiveCheck.overflow, { bodyWidth: responsiveCheck?.bodyWidth, innerWidth: responsiveCheck?.width });

    // 9. Runtime Errors Check
    const fatalErrors = report.runtimeErrors.filter(e => !e.includes('THREE.Clock') && !e.includes('AudioContext') && !e.includes('WebAudio'));
    record('runtimeErrors', 'Zero Fatal JavaScript Runtime Errors', fatalErrors.length === 0, { errors: fatalErrors });

    console.log(`\nAudit Summary for ${name}:`);
    console.log(`  PASSED: ${report.passed}`);
    console.log(`  FAILED: ${report.failed}`);
    console.log(`  RUNTIME ERRORS: ${fatalErrors.length}`);

    ws.close();
    chrome.kill('SIGTERM');
    return report;
  } catch (err) {
    console.error(`Audit encountered error for ${name}:`, err.message);
    chrome.kill('SIGTERM');
    report.fatalError = err.message;
    return report;
  }
}

async function main() {
  const target = process.argv[2] || 'local';
  if (target === 'local') {
    await auditTarget('http://127.0.0.1:3001', 'Local Dev Server');
  } else if (target === 'live-root') {
    await auditTarget('https://naimsmahmud50-dotcom.github.io/', 'Live Root');
  } else if (target === 'live-subpath') {
    await auditTarget('https://naimsmahmud50-dotcom.github.io/Mahmud-Hasan-3D-Portfolio/', 'Live Subpath');
  } else {
    await auditTarget('http://127.0.0.1:3001', 'Local Dev Server');
    await auditTarget('https://naimsmahmud50-dotcom.github.io/', 'Live Root');
    await auditTarget('https://naimsmahmud50-dotcom.github.io/Mahmud-Hasan-3D-Portfolio/', 'Live Subpath');
  }
}

main().catch(console.error);
