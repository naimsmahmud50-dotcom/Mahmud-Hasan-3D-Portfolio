const fs = require('fs');
const { spawn } = require('child_process');

const CHROME_PORT = 9300;

async function run() {
  const tmpDir = fs.mkdtempSync('/tmp/chrome-prog-');
  const chrome = spawn('google-chrome', [
    '--headless=new',
    `--remote-debugging-port=${CHROME_PORT}`,
    '--remote-allow-origins=*',
    `--user-data-dir=${tmpDir}`,
    '--no-sandbox',
    '--disable-gpu',
    'http://127.0.0.1:3001/?variant=full'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const res = await fetch(`http://127.0.0.1:${CHROME_PORT}/json`);
    const tabs = await res.json();
    const tab = tabs.find(t => t.url && t.url.includes('3001'));
    const ws = new WebSocket(tab.webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);

    let id = 1;
    const call = (method, params = {}) => new Promise((resolve, reject) => {
      const mid = id++;
      const handler = (e) => {
        const m = JSON.parse(e.data);
        if (m.id === mid) {
          ws.removeEventListener('message', handler);
          if (m.error) reject(m.error);
          else resolve(m.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: mid, method, params }));
    });

    await call('Page.enable');
    await call('Runtime.enable');
    await call('Emulation.setDeviceMetricsOverride', {
      width: 1280,
      height: 800,
      deviceScaleFactor: 1,
      mobile: false
    });

    console.log('Waiting 3.5s for load...');
    await new Promise(r => setTimeout(r, 3500));

    // Get expected target
    const targetInfo = await call('Runtime.evaluate', {
      expression: `(() => {
        const s1 = document.getElementById('scene1');
        return {
          s1Top: s1.offsetTop,
          s1Height: s1.offsetHeight,
          expectedTarget: Math.round(s1.offsetTop + s1.offsetHeight * 0.5755),
          initialScroll: window.scrollY
        };
      })()`,
      returnByValue: true
    });
    console.log('Target calculation:', targetInfo.result.value);

    // Click PROJECTS button
    console.log('Clicking PROJECTS button...');
    await call('Runtime.evaluate', {
      expression: `(() => {
        const a = Array.from(document.querySelectorAll('a._rHu7W_link')).find(el => el.textContent.includes('PROJECTS'));
        if (a) a.click();
      })()`
    });

    // Track scroll over 3 seconds
    const scrollLog = [];
    for (let i = 0; i < 15; i++) {
      await new Promise(r => setTimeout(r, 200));
      const s = await call('Runtime.evaluate', {
        expression: `({ scrollY: window.scrollY, lenisScroll: window.lenis ? Math.round(window.lenis.scroll) : null })`,
        returnByValue: true
      });
      scrollLog.push({ t: (i + 1) * 200, ...s.result.value });
    }

    console.log('Scroll progression:', scrollLog);
    const finalY = scrollLog[scrollLog.length - 1].scrollY;
    const exp = targetInfo.result.value.expectedTarget;
    console.log(`Final scrollY = ${finalY}, Expected = ${exp}`);

    if (Math.abs(finalY - exp) < 100) {
      console.log('SUCCESS: Scrolled smoothly and accurately to projects cylinder carousel!');
    } else {
      console.error('FAILURE: Final scroll position did not reach expected target.');
    }

    ws.close();
  } finally {
    chrome.kill();
    try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch (_) {}
  }
}

run();
