const { spawn } = require('child_process');
const fs = require('fs');

const CHROME_PORT = 9290;

async function test() {
  const tmpDir = fs.mkdtempSync('/tmp/chrome-quick-');
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

    await call('Runtime.enable');
    await call('Page.enable');
    await call('Emulation.setDeviceMetricsOverride', {
      width: 1280,
      height: 800,
      deviceScaleFactor: 1,
      mobile: false
    });

    console.log('--- 1. Initial State Check ---');
    await new Promise(r => setTimeout(r, 3500));

    const init = await call('Runtime.evaluate', {
      expression: `(() => {
        const s1 = document.getElementById('scene1');
        const sa = document.getElementById('sceneAbout');
        const sc = document.getElementById('sceneContactReveal');
        return {
          scrollY: window.scrollY,
          s1Target: s1 ? Math.round(s1.offsetTop + s1.offsetHeight * 0.5755) : null,
          saTarget: sa ? Math.round(sa.offsetTop + sa.offsetHeight * 0.8) : null,
          scTarget: sc ? Math.round(sc.offsetTop + sc.offsetHeight * 0.7286) : null,
        };
      })()`,
      returnByValue: true
    });
    console.log('Computed Targets:', init.result.value);

    // Click PROJECTS
    console.log('\n--- 2. Clicking PROJECTS ---');
    await call('Runtime.evaluate', {
      expression: `(() => {
        const a = Array.from(document.querySelectorAll('a._rHu7W_link')).find(el => el.textContent.includes('PROJECTS'));
        if (a) a.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 1200));
    const projY = await call('Runtime.evaluate', { expression: 'window.scrollY', returnByValue: true });
    console.log('ScrollY after PROJECTS click:', projY.result.value);

    // Click ABOUT
    console.log('\n--- 3. Clicking ABOUT ---');
    await call('Runtime.evaluate', {
      expression: `(() => {
        const a = Array.from(document.querySelectorAll('a._rHu7W_link')).find(el => el.textContent.includes('ABOUT'));
        if (a) a.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 1200));
    const aboutY = await call('Runtime.evaluate', { expression: 'window.scrollY', returnByValue: true });
    console.log('ScrollY after ABOUT click:', aboutY.result.value);

    // Click CONTACT
    console.log('\n--- 4. Clicking CONTACT ---');
    await call('Runtime.evaluate', {
      expression: `(() => {
        const a = Array.from(document.querySelectorAll('a._rHu7W_link')).find(el => el.textContent.includes('CONTACT'));
        if (a) a.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 1200));
    const contactY = await call('Runtime.evaluate', { expression: 'window.scrollY', returnByValue: true });
    console.log('ScrollY after CONTACT click:', contactY.result.value);

    // Click HOME
    console.log('\n--- 5. Clicking HOME ---');
    await call('Runtime.evaluate', {
      expression: `(() => {
        const a = Array.from(document.querySelectorAll('a._rHu7W_link')).find(el => el.textContent.trim().startsWith('HOME'));
        if (a) a.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 1000));
    const homeY = await call('Runtime.evaluate', { expression: 'window.scrollY', returnByValue: true });
    console.log('ScrollY after HOME click:', homeY.result.value);

    ws.close();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    chrome.kill();
    try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch (_) {}
  }
}

test();
