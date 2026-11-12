const { spawn } = require('child_process');
const fs = require('fs');

async function testUrlFlow(targetUrl, label) {
  console.log(`\n======================================================`);
  console.log(`TESTING FLOW FOR ${label}: ${targetUrl}`);
  console.log(`======================================================`);

  const tmpDir = fs.mkdtempSync('/tmp/chrome-pure-');
  const chrome = spawn('google-chrome', [
    '--headless=new',
    '--remote-debugging-port=9488',
    '--remote-allow-origins=*',
    `--user-data-dir=${tmpDir}`,
    '--no-sandbox',
    '--disable-extensions',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 1500));
  try {
    const res = await fetch('http://127.0.0.1:9488/json');
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
    });

    const call = (method, params = {}) => new Promise((resolve, reject) => {
      const mid = id++;
      pendingCalls.set(mid, { resolve, reject });
      ws.send(JSON.stringify({ id: mid, method, params }));
    });

    ws.addEventListener('message', (e) => {
      const m = JSON.parse(e.data);
      if (m.method === 'Runtime.consoleAPICalled') {
        const text = m.params.args.map(a => a.value !== undefined ? a.value : (a.description || '')).join(' ');
        if (!text.includes('THREE.Clock')) {
          console.log(`[${label} CONSOLE]`, text.slice(0, 140));
        }
      }
    });

    await call('Page.enable');
    await call('Runtime.enable');

    console.log(`Phase 1: Navigate to ${targetUrl}...`);
    await call('Page.navigate', { url: targetUrl });

    // Measure at 1.5s
    await new Promise(r => setTimeout(r, 1500));
    const s1 = await call('Runtime.evaluate', {
      expression: `(() => ({
        href: window.location.href,
        pathname: window.location.pathname,
        shieldPresent: !!document.getElementById('mh-direct-glide-shield'),
        hasCanvas: !!document.querySelector('canvas')
      }))()`,
      returnByValue: true
    });
    console.log(`State at 1.5s:`, JSON.stringify(s1.result.value));

    // Wait until 4.5s for scene load
    await new Promise(r => setTimeout(r, 3000));
    const s2 = await call('Runtime.evaluate', {
      expression: `(() => {
        const scenes = window.__mhScenes;
        const stargate = window.__mhStargate;
        const landingCtx = window.__mhLandingContext;
        return {
          href: window.location.href,
          pathname: window.location.pathname,
          scrollY: window.scrollY,
          hasCanvas: !!document.querySelector('canvas'),
          landingSceneVisible: scenes?.landing?.scene?.visible,
          projectsSceneVisible: scenes?.projects?.scene?.visible,
          stargateOpenProgress: stargate?.openProgress?.value,
          exposureH: landingCtx?.h?.value,
          spotIntensity: landingCtx?.m?.spot?.intensity
        };
      })()`,
      returnByValue: true
    });
    console.log(`State at 4.5s (Home 3D Scene):`, JSON.stringify(s2.result.value, null, 2));

    // Phase 2: Simulate moving to PROJECTS
    console.log(`Phase 2: Navigating to Projects...`);
    await call('Runtime.evaluate', {
      expression: `(() => {
        const pBtn = document.querySelector('[data-mh-anchor="projects"]') ||
                     Array.from(document.querySelectorAll('a, button')).find(el => el.textContent.trim().toUpperCase() === 'PROJECTS');
        if (pBtn) pBtn.click();
        else window.scrollTo({ top: 5000, behavior: 'instant' });
      })()`
    });
    await new Promise(r => setTimeout(r, 1500));

    const sProjects = await call('Runtime.evaluate', {
      expression: `(() => {
        const scenes = window.__mhScenes;
        const stargate = window.__mhStargate;
        return {
          scrollY: window.scrollY,
          landingSceneVisible: scenes?.landing?.scene?.visible,
          projectsSceneVisible: scenes?.projects?.scene?.visible,
          stargateOpenProgress: stargate?.openProgress?.value
        };
      })()`,
      returnByValue: true
    });
    console.log(`State at Projects:`, JSON.stringify(sProjects.result.value, null, 2));

    // Phase 3: Click HOME button
    console.log(`Phase 3: Clicking HOME button...`);
    const tClick = Date.now();
    await call('Runtime.evaluate', {
      expression: `(() => {
        const hBtn = document.querySelector('[data-mh-anchor="home"]') ||
                     Array.from(document.querySelectorAll('a, button')).find(el => el.textContent.trim().toUpperCase() === 'HOME');
        if (hBtn) hBtn.click();
      })()`
    });

    // Check at 150ms, 400ms, 800ms
    for (const delay of [150, 400, 800]) {
      await new Promise(r => setTimeout(r, delay - (Date.now() - tClick)));
      const sAfterHome = await call('Runtime.evaluate', {
        expression: `(() => {
          const scenes = window.__mhScenes;
          const stargate = window.__mhStargate;
          const landingCtx = window.__mhLandingContext;
          return {
            delayMs: ${delay},
            scrollY: window.scrollY,
            shieldPresent: !!document.getElementById('mh-direct-glide-shield'),
            landingVisible: scenes?.landing?.scene?.visible,
            projectsVisible: scenes?.projects?.scene?.visible,
            stargateOpen: stargate?.openProgress?.value,
            spotIntensity: landingCtx?.m?.spot?.intensity
          };
        })()`,
        returnByValue: true
      });
      console.log(`Check at ${delay}ms after HOME:`, JSON.stringify(sAfterHome.result.value));
    }

    ws.close();
  } finally {
    chrome.kill('SIGKILL');
  }
}

async function run() {
  await testUrlFlow('https://naimsmahmud50-dotcom.github.io/', 'LIVE_ROOT');
  await testUrlFlow('http://127.0.0.1:3001/', 'LOCAL_DEV');
}

run().catch(console.error);
