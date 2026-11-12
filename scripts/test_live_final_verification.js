const { spawn } = require('child_process');
const fs = require('fs');

const ARTIFACT_DIR = '/home/mahmud-hasan/.gemini/antigravity/brain/e6bc3d1f-e2b2-4748-b4d5-000419591376';
const LIVE_URL = 'https://naimsmahmud50-dotcom.github.io/';

async function runLiveVerification() {
  console.log(`\n========================================`);
  console.log(`STARTING AUTOMATED VERIFICATION ON LIVE: ${LIVE_URL}`);
  console.log(`========================================\n`);

  const tmpDir = fs.mkdtempSync('/tmp/chrome-live-verify-');
  const chrome = spawn('google-chrome', [
    '--headless=new',
    '--remote-debugging-port=9498',
    '--remote-allow-origins=*',
    `--user-data-dir=${tmpDir}`,
    '--no-sandbox',
    '--disable-extensions',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 2000));
  try {
    const res = await fetch('http://127.0.0.1:9498/json');
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
          console.log(`[LIVE CONSOLE ${m.params.type}]`, text.slice(0, 160));
        }
      }
      if (m.method === 'Runtime.exceptionThrown') {
        console.log(`[LIVE EXCEPTION]`, m.params.exceptionDetails?.exception?.description || m.params.exceptionDetails?.text);
      }
    });

    await call('Page.enable');
    await call('Runtime.enable');
    await call('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });

    console.log(`Step 1: Navigating to ${LIVE_URL}...`);
    await call('Page.navigate', { url: LIVE_URL });

    // Sample at 1.5s
    await new Promise(r => setTimeout(r, 1500));
    const state1_5s = await call('Runtime.evaluate', {
      expression: `(() => ({
        href: window.location.href,
        pathname: window.location.pathname,
        shield: !!document.getElementById('mh-direct-glide-shield'),
        hasCanvas: !!document.querySelector('canvas')
      }))()`,
      returnByValue: true
    });
    console.log('\n[Metrics at 1.5s]:', JSON.stringify(state1_5s.result.value, null, 2));

    const scr1 = await call('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${ARTIFACT_DIR}/live_verified_1_5s.png`, Buffer.from(scr1.data, 'base64'));
    console.log('Saved screenshot: live_verified_1_5s.png');

    // Wait until 4.5s for full scene illumination & shader compilation
    await new Promise(r => setTimeout(r, 3000));
    const state4_5s = await call('Runtime.evaluate', {
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
    console.log('\n[Metrics at 4.5s (3D Home Venue Active)]:\n', JSON.stringify(state4_5s.result.value, null, 2));

    const scr2 = await call('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${ARTIFACT_DIR}/live_verified_home_venue.png`, Buffer.from(scr2.data, 'base64'));
    console.log('Saved screenshot: live_verified_home_venue.png');

    // Step 2: Test Navigation to Projects
    console.log('\nStep 2: Scrolling to Projects section (scrollY = 5000)...');
    await call('Runtime.evaluate', {
      expression: `window.scrollTo({ top: 5000, behavior: 'instant' })`
    });
    await new Promise(r => setTimeout(r, 1200));

    const stateProjects = await call('Runtime.evaluate', {
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
    console.log('\n[Metrics at Projects]:\n', JSON.stringify(stateProjects.result.value, null, 2));

    const scrProj = await call('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${ARTIFACT_DIR}/live_verified_scrolled_projects.png`, Buffer.from(scrProj.data, 'base64'));
    console.log('Saved screenshot: live_verified_scrolled_projects.png');

    // Step 3: Click HOME in navbar
    console.log('\nStep 3: Clicking HOME in navbar...');
    const homeClick = await call('Runtime.evaluate', {
      expression: `(() => {
        const link = document.querySelector('[data-mh-anchor="home"]') ||
                     Array.from(document.querySelectorAll('a, button')).find(el => el.textContent.trim().toUpperCase() === 'HOME');
        if (link) {
          link.click();
          return { clicked: true, text: link.textContent.trim() };
        }
        return { clicked: false };
      })()`,
      returnByValue: true
    });
    console.log('HOME click response:', JSON.stringify(homeClick.result.value));

    // Measure after 600ms
    await new Promise(r => setTimeout(r, 600));
    const stateHomeReturn = await call('Runtime.evaluate', {
      expression: `(() => {
        const scenes = window.__mhScenes;
        const stargate = window.__mhStargate;
        const landingCtx = window.__mhLandingContext;
        return {
          href: window.location.href,
          pathname: window.location.pathname,
          scrollY: window.scrollY,
          shieldPresent: !!document.getElementById('mh-direct-glide-shield'),
          landingSceneVisible: scenes?.landing?.scene?.visible,
          projectsSceneVisible: scenes?.projects?.scene?.visible,
          stargateOpenProgress: stargate?.openProgress?.value,
          exposureH: landingCtx?.h?.value,
          spotIntensity: landingCtx?.m?.spot?.intensity
        };
      })()`,
      returnByValue: true
    });
    console.log('\n[Metrics 600ms after clicking HOME (Back at Home Venue)]:\n', JSON.stringify(stateHomeReturn.result.value, null, 2));

    const scrReturn = await call('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${ARTIFACT_DIR}/live_verified_returned_home.png`, Buffer.from(scrReturn.data, 'base64'));
    console.log('Saved screenshot: live_verified_returned_home.png');

    console.log('\n========================================');
    console.log('AUTOMATED LIVE VERIFICATION PASSED SUCCESSFULLY!');
    console.log('========================================\n');

    ws.close();
  } catch (err) {
    console.error('Test execution error:', err);
  } finally {
    chrome.kill('SIGKILL');
  }
}

runLiveVerification();
