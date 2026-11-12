const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ARTIFACTS_DIR = '/home/mahmud-hasan/.gemini/antigravity/brain/e6bc3d1f-e2b2-4748-b4d5-000419591376';

async function testColdVisit() {
  console.log('Testing fresh cold visit via Chrome CDP...');
  const tmpDir = fs.mkdtempSync('/tmp/chrome-cold-visit-');
  const chrome = spawn('google-chrome', [
    '--headless=new',
    '--remote-debugging-port=9452',
    '--remote-allow-origins=*',
    `--user-data-dir=${tmpDir}`,
    '--no-sandbox',
    '--disable-extensions',
    '--use-gl=angle',
    '--use-angle=swiftshader',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 2000));
  try {
    const res = await fetch('http://127.0.0.1:9452/json');
    const tabs = await res.json();
    const tab = tabs.find(t => t.type === 'page') || tabs[0];
    const ws = new WebSocket(tab.webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);

    let id = 1;
    const call = (method, params = {}) => new Promise((resolve) => {
      const mid = id++;
      const handler = (e) => {
        const m = JSON.parse(e.data);
        if (m.id === mid) {
          ws.removeEventListener('message', handler);
          resolve(m.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: mid, method, params }));
    });

    await call('Page.enable');
    await call('Runtime.enable');
    await call('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });

    console.log('Navigating to http://127.0.0.1:3000 ...');
    await call('Page.navigate', { url: 'http://127.0.0.1:3000/' });

    for (const waitMs of [500, 1500, 3000]) {
      await new Promise(r => setTimeout(r, waitMs === 500 ? 500 : (waitMs === 1500 ? 1000 : 1500)));
      const evalRes = await call('Runtime.evaluate', {
        expression: `(() => {
          const enterLoader = document.querySelector('.y9w63G_loaderContainer');
          const enterLoaderStyle = enterLoader ? window.getComputedStyle(enterLoader).display : null;
          const enterLoaderOpacity = enterLoader ? window.getComputedStyle(enterLoader).opacity : null;
          const fastLoader = document.getElementById('mh-fast-init-loader');
          const fastLoaderStyle = fastLoader ? window.getComputedStyle(fastLoader).display : null;
          const cv = document.querySelector('canvas');
          const landingScene = window.__mhScenes?.landing?.scene;
          return {
            hasBypassClass: document.documentElement.classList.contains('mh-bypass-loader'),
            enterLoaderDisplay: enterLoaderStyle,
            enterLoaderOpacity: enterLoaderOpacity,
            fastLoaderPresent: !!fastLoader,
            hasCanvas: !!cv,
            canvasWidth: cv ? cv.offsetWidth : 0,
            landingVisible: !!(landingScene && landingScene.visible)
          };
        })()`,
        returnByValue: true
      });
      console.log(`[${waitMs}ms] Browser State:`, evalRes.result.value);

      const shot = await call('Page.captureScreenshot', { format: 'png' });
      const shotPath = path.join(ARTIFACTS_DIR, `cold_visit_${waitMs}ms.png`);
      fs.writeFileSync(shotPath, Buffer.from(shot.data, 'base64'));
      console.log(`Saved screenshot to ${shotPath}`);
    }

    ws.close();
  } finally {
    chrome.kill('SIGKILL');
  }
}

testColdVisit().catch(err => {
  console.error('Error during test:', err);
  process.exit(1);
});
