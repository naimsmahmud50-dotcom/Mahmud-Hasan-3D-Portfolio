const { spawn } = require('child_process');
const fs = require('fs');

const URLS = [
  'http://127.0.0.1:3001/',
  'https://naimsmahmud50-dotcom.github.io/'
];

async function checkTiming(url) {
  console.log(`\n========================================`);
  console.log(`PROBING TIMING & LOGS ON: ${url}`);
  console.log(`========================================\n`);

  const tmpDir = fs.mkdtempSync('/tmp/chrome-probe-');
  const chrome = spawn('google-chrome', [
    '--headless=new',
    '--remote-debugging-port=9493',
    '--remote-allow-origins=*',
    `--user-data-dir=${tmpDir}`,
    '--no-sandbox',
    '--disable-extensions',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 1500));
  try {
    const res = await fetch('http://127.0.0.1:9493/json');
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

    const logs = [];
    ws.addEventListener('message', (e) => {
      const m = JSON.parse(e.data);
      if (m.method === 'Runtime.consoleAPICalled') {
        const text = m.params.args.map(a => a.value !== undefined ? a.value : (a.description || '')).join(' ');
        logs.push(`[${m.params.type}] ${text}`);
      }
      if (m.method === 'Runtime.exceptionThrown') {
        logs.push(`[EXCEPTION] ${m.params.exceptionDetails?.exception?.description || m.params.exceptionDetails?.text}`);
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

    const t0 = Date.now();
    await call('Page.navigate', { url });

    for (let step = 1; step <= 8; step++) {
      await new Promise(r => setTimeout(r, 500));
      const elapsed = Date.now() - t0;
      const resEval = await call('Runtime.evaluate', {
        expression: `(() => {
          const l = document.querySelector('.y9w63G_loaderContainer');
          const canvas = document.querySelector('canvas');
          const percent = document.querySelector('.y9w63G_bigPercent span')?.textContent;
          const status = document.querySelector('.y9w63G_status')?.textContent;
          const enterBtn = document.querySelector('button[data-testid="loader-enter"]');
          const landingScene = window.__mhScenes?.landing?.scene;
          const projectsScene = window.__mhScenes?.projects?.scene;
          const landingCtx = window.__mhLandingContext;

          return {
            elapsed: ${elapsed},
            hasCanvas: !!canvas,
            canvasSize: canvas ? [canvas.width, canvas.height] : null,
            loader: l ? {
              display: window.getComputedStyle(l).display,
              opacity: window.getComputedStyle(l).opacity,
              classes: Array.from(l.classList)
            } : null,
            percent,
            status,
            enterBtn: enterBtn ? { disabled: enterBtn.disabled } : null,
            landingVisible: landingScene ? landingScene.visible : false,
            projectsVisible: projectsScene ? projectsScene.visible : false,
            exposure: landingCtx?.h?.value
          };
        })()`,
        returnByValue: true
      });
      console.log(`[t=${elapsed}ms]`, JSON.stringify(resEval.result.value));
    }

    console.log('\nRecent page logs:');
    logs.slice(-15).forEach(l => console.log(' ', l));

    ws.close();
  } finally {
    chrome.kill('SIGKILL');
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

async function run() {
  await checkTiming(URLS[0]);
  await checkTiming(URLS[1]);
}

run().catch(console.error);
