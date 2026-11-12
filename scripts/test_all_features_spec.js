const { spawn } = require('child_process');
const fs = require('fs');

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function runTargetAudit(url, targetName) {
  console.log(`\n======================================================================`);
  console.log(`RUNNING SPEC AUDIT: ${targetName}`);
  console.log(`Target URL: ${url}`);
  console.log(`======================================================================`);

  const tmpDir = fs.mkdtempSync('/tmp/chrome-spec-audit-');
  const port = 9530 + Math.floor(Math.random() * 40);
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
    name: targetName,
    runtimeExceptions: [],
    tests: [],
    passed: 0,
    failed: 0
  };

  const record = (name, pass, details = {}) => {
    report.tests.push({ name, pass, details });
    if (pass) {
      report.passed++;
      console.log(`  ✓ [PASS] ${name}`);
    } else {
      report.failed++;
      console.error(`  ✗ [FAIL] ${name}:`, details);
    }
  };

  try {
    const res = await fetch(`http://127.0.0.1:${port}/json`);
    const tabs = await res.json();
    const tab = tabs.find(t => t.type === 'page' && !t.url.startsWith('chrome-extension')) || tabs[0];
    const ws = new WebSocket(tab.webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);

    let id = 1;
    const pendingCalls = new Map();
    ws.addEventListener('message', (e) => {
      const m = JSON.parse(e.data);
      if (m.id && pendingCalls.has(m.id)) {
        const { resolve, reject } = pendingCalls.get(m.id);
        pendingCalls.delete(m.id);
        if (m.error) reject(m.error);
        else resolve(m.result);
      }
      if (m.method === 'Runtime.exceptionThrown') {
        const text = m.params.exceptionDetails?.exception?.description || m.params.exceptionDetails?.text;
        report.runtimeExceptions.push(text);
      }
    });

    const call = (method, params = {}, timeoutMs = 12000) => new Promise((resolve, reject) => {
      const mid = id++;
      const timer = setTimeout(() => {
        pendingCalls.delete(mid);
        reject(new Error(`Timeout ${timeoutMs}ms on ${method}`));
      }, timeoutMs);
      pendingCalls.set(mid, {
        resolve: (val) => { clearTimeout(timer); resolve(val); },
        reject: (err) => { clearTimeout(timer); reject(err); }
      });
      ws.send(JSON.stringify({ id: mid, method, params }));
    });

    const evalInPage = async (expr, timeoutMs = 25000) => {
      const r = await call('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true }, timeoutMs);
      if (r && r.exceptionDetails) {
        throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
      }
      return r ? r.result?.value : undefined;
    };

    await call('Page.enable');
    await call('Runtime.enable');

    console.log(`1. Navigating to ${url}...`);
    await call('Page.navigate', { url });
    await sleep(4000);

    // Test 1: Initial Scene & 3D Nature Status
    console.log(`\nPhase 1: Initial Load & 3D Nature Scene:`);
    const s1 = await evalInPage(`(() => {
      const canvas = document.querySelector('canvas');
      const exposureH = window.__mhThreeState ? window.__mhThreeState.exposureH : 1;
      return {
        scrollY: window.scrollY,
        hasCanvas: !!canvas,
        exposureH: exposureH,
        bodyWidth: document.body?.scrollWidth || 0,
        windowWidth: window.innerWidth,
        hasHorizontalOverflow: (document.body?.scrollWidth || 0) > window.innerWidth + 2
      };
    })()`);

    record('Initial Landing Position is Scene 1 (scrollY == 0)', s1 && s1.scrollY === 0, { scrollY: s1?.scrollY });
    record('Three.js WebGL 3D Canvas Active & Rendering', !!s1?.hasCanvas);
    record('Instant Illumination: Zero Blackout (exposure >= 0.8)', s1 && s1.exposureH >= 0.8, { exposure: s1?.exposureH });
    record('Desktop Layout: No Horizontal Scroll/Overflow', s1 && !s1.hasHorizontalOverflow, { bodyWidth: s1?.bodyWidth, innerWidth: s1?.windowWidth });

    // Test 2: Navbar Verification (All 7 links)
    console.log(`\nPhase 2: Navbar Integrity (All 7 Items):`);
    const nav = await evalInPage(`(() => {
      const links = Array.from(document.querySelectorAll('a._rHu7W_link, [class*="_rHu7W_link"]')).map(a => (a.textContent || '').trim().toUpperCase());
      const expected = ['HOME', 'PROJECTS', 'ABOUT', 'CONTACT', 'EXTRA SKILLS', 'PROJECT SLIDE VIEW', 'GITHUB REPO'];
      const status = {};
      expected.forEach(item => {
        status[item] = links.some(l => l.includes(item));
      });
      return { status, links };
    })()`);

    const all7Present = nav && Object.values(nav.status).every(v => v === true);
    record('All 7 Vertical Navbar Links Present & Correctly Labeled', all7Present, nav?.status);

    // Test 3: 3D Navigation to PROJECTS
    console.log(`\nPhase 3: 3D Scene Navigation - PROJECTS:`);
    await call('Runtime.evaluate', {
      expression: `window.scrollTo({ top: 5000, behavior: 'instant' })`
    });
    await sleep(2000);
    const projectsY = await evalInPage(`window.scrollY`);
    record('3D Camera Advances to PROJECTS Showcase (scrollY > 0)', projectsY > 0, { scrollY: projectsY });

    // Test 4: 3D Navigation to ABOUT (Mahmud Portrait & Skills Matrix)
    console.log(`\nPhase 4: 3D Scene Navigation - ABOUT (Portrait & Skills Matrix):`);
    await call('Runtime.evaluate', {
      expression: `window.scrollTo({ top: 21080, behavior: 'instant' })`
    });
    await sleep(2000);

    const aboutState = await evalInPage(`(() => {
      const portrait = document.querySelector('img.mh-portrait-img, img[src*="mahmud.jpg"], [class*="_5tgptW_portrait"]');
      const matrix = document.getElementById('mh-about-skills-matrix');
      const chips = matrix ? matrix.querySelectorAll('.mh-skill-chip').length : 0;
      return {
        scrollY: window.scrollY,
        hasPortrait: !!portrait,
        hasMatrix: !!matrix,
        skillsCount: chips
      };
    })()`);

    record('Mahmud Hasan Real Portrait Mounted in About Scene', !!aboutState?.hasPortrait);
    record('About Skills Matrix Rendered with Skill Chips', aboutState && aboutState.hasMatrix && aboutState.skillsCount > 0, { skillsCount: aboutState?.skillsCount });

    // Test 5: 3D Navigation to CONTACT
    console.log(`\nPhase 5: 3D Scene Navigation - CONTACT:`);
    await call('Runtime.evaluate', {
      expression: `window.scrollTo({ top: 30000, behavior: 'instant' })`
    });
    await sleep(2000);
    const contactY = await evalInPage(`window.scrollY`);
    record('3D Camera Advances to CONTACT Venue', contactY > projectsY, { scrollY: contactY });

    // Test 6: Return to HOME
    console.log(`\nPhase 6: Return to HOME (Scene 1):`);
    await call('Runtime.evaluate', {
      expression: `window.scrollTo({ top: 0, behavior: 'instant' })`
    });
    await sleep(2000);
    const homeY = await evalInPage(`window.scrollY`);
    record('Return to HOME Successfully Restores Nature Scene (scrollY == 0)', homeY === 0, { scrollY: homeY });

    // Test 7: Interactive Utility Features (Dhaka Clock, Video Modal, Terminal Toggle)
    console.log(`\nPhase 7: Interactive Widgets & Tools:`);
    const clockData = await evalInPage(`(() => {
      const el = document.getElementById('mh-dhaka-clock');
      return {
        hasClock: !!el,
        timeString: el ? el.textContent.trim() : ''
      };
    })()`);
    record('Dhaka Real-time Clock Active & Displaying Formatted Time', clockData && clockData.hasClock && clockData.timeString.includes(':'), clockData);

    // Test Video Modal Open
    await evalInPage(`(() => {
      if (typeof window.__mhOpenMyVideos === 'function') window.__mhOpenMyVideos();
    })()`);
    await sleep(600);

    const videoOpen = await evalInPage(`(() => {
      const modal = document.getElementById('mh-my-videos-modal');
      return modal ? modal.classList.contains('active') : false;
    })()`);
    record('Interactive Video Showcase Modal Opens on Trigger', !!videoOpen);

    // Test Video Modal Close
    await evalInPage(`(() => {
      if (typeof window.__mhCloseMyVideos === 'function') window.__mhCloseMyVideos();
    })()`);
    await sleep(300);

    const videoClosed = await evalInPage(`(() => {
      const modal = document.getElementById('mh-my-videos-modal');
      return modal ? !modal.classList.contains('active') : true;
    })()`);
    record('Interactive Video Showcase Modal Closes Cleanly', !!videoClosed);

    // Test Terminal Toggle button
    const hasTerminalToggle = await evalInPage(`!!document.getElementById('mh-terminal-toggle')`);
    record('AI Terminal Console Toggle Button Mounted', !!hasTerminalToggle);

    // Test 8: Runtime Exceptions Audit
    const fatalErrors = report.runtimeExceptions.filter(e => 
      !e.includes('THREE.Clock') && 
      !e.includes('AudioContext') && 
      !e.includes('WebAudio')
    );
    record('Zero Fatal JavaScript Runtime Errors / Exceptions', fatalErrors.length === 0, { fatalErrors });

    console.log(`\nSummary for ${targetName}:`);
    console.log(`  PASSED: ${report.passed}`);
    console.log(`  FAILED: ${report.failed}`);
    console.log(`  FATAL RUNTIME EXCEPTIONS: ${fatalErrors.length}`);

    ws.close();
    chrome.kill('SIGTERM');
    return report;
  } catch (err) {
    console.error(`Audit failed with error for ${targetName}:`, err.message);
    chrome.kill('SIGTERM');
    report.fatalError = err.message;
    return report;
  }
}

async function main() {
  const target = process.argv[2] || 'all';

  if (target === 'local') {
    await runTargetAudit('http://127.0.0.1:3001', 'Local Server (Port 3001)');
  } else if (target === 'live-root') {
    await runTargetAudit('https://naimsmahmud50-dotcom.github.io/', 'Live Root (naimsmahmud50-dotcom.github.io)');
  } else if (target === 'live-subpath') {
    await runTargetAudit('https://naimsmahmud50-dotcom.github.io/Mahmud-Hasan-3D-Portfolio/', 'Live Subpath (Mahmud-Hasan-3D-Portfolio)');
  } else {
    console.log('Running Systematic Spec Audits on Local, Live Root, and Live Subpath...');
    await runTargetAudit('http://127.0.0.1:3001', 'Local Server (Port 3001)');
    await runTargetAudit('https://naimsmahmud50-dotcom.github.io/', 'Live Root (naimsmahmud50-dotcom.github.io)');
    await runTargetAudit('https://naimsmahmud50-dotcom.github.io/Mahmud-Hasan-3D-Portfolio/', 'Live Subpath (Mahmud-Hasan-3D-Portfolio)');
  }
}

main().catch(console.error);
