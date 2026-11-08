import { spawn } from 'child_process';
import fs from 'fs';

const CHROME_PORT = 9298;

async function test() {
  const tmpDir = fs.mkdtempSync('/tmp/chrome-cip-');
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

    console.log('Waiting 3.5s for load...');
    await new Promise(r => setTimeout(r, 3500));

    // Dispatch a real mouse click on the PROJECTS link
    const clickResult = await call('Runtime.evaluate', {
      expression: `(() => {
        const a = Array.from(document.querySelectorAll('a._rHu7W_link')).find(el => el.textContent.includes('PROJECTS'));
        if (!a) return { error: 'not found' };
        // Trigger pointerdown, mouseup, click
        const evt = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
        a.dispatchEvent(evt);
        return { clicked: true, text: a.textContent.trim() };
      })()`,
      returnByValue: true
    });
    console.log('Click dispatch result:', clickResult.result.value);

    // Wait 2 seconds for smooth scroll
    await new Promise(r => setTimeout(r, 2000));

    const finalScroll = await call('Runtime.evaluate', {
      expression: `(() => {
        const s1 = document.getElementById('scene1');
        return {
          scrollY: window.scrollY,
          expected: s1 ? Math.round(s1.offsetTop + s1.offsetHeight * 0.5755) : null
        };
      })()`,
      returnByValue: true
    });
    console.log('Scroll Result after click:', finalScroll.result.value);

    ws.close();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    chrome.kill();
    try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch (_) {}
  }
}

test();
