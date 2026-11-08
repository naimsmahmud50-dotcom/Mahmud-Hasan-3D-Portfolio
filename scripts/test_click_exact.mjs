import { spawn } from 'child_process';
import fs from 'fs';

const CHROME_PORT = 9480;
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function main() {
  const tmpDir = fs.mkdtempSync('/tmp/chrome-exact-');
  const chrome = spawn('google-chrome', [
    '--headless=new',
    `--remote-debugging-port=${CHROME_PORT}`,
    '--remote-allow-origins=*',
    `--user-data-dir=${tmpDir}`,
    '--no-sandbox',
    '--disable-gpu',
    'http://127.0.0.1:3001/?variant=full'
  ]);

  await sleep(2000);

  try {
    const res = await fetch(`http://127.0.0.1:${CHROME_PORT}/json`);
    const tabs = await res.json();
    const tab = tabs.find(t => t.url && t.url.includes('3001'));
    const ws = new WebSocket(tab.webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);

    let id = 1;
    function sendCdp(method, params = {}) {
      return new Promise((resolve, reject) => {
        const curId = id++;
        const onMsg = (event) => {
          try {
            const msg = JSON.parse(event.data);
            if (msg.id === curId) {
              ws.removeEventListener('message', onMsg);
              if (msg.error) reject(msg.error);
              else resolve(msg.result);
            }
          } catch (_) {}
        };
        ws.addEventListener('message', onMsg);
        ws.send(JSON.stringify({ id: curId, method, params }));
      });
    }

    await sendCdp('Runtime.enable');
    await sendCdp('Page.enable');
    await sendCdp('Emulation.setDeviceMetricsOverride', {
      width: 1280,
      height: 800,
      deviceScaleFactor: 1,
      mobile: false
    });

    console.log('Waiting 3.5s for 3D page mount...');
    await sleep(3500);

    // Test click with detailed instrumentation
    const clickResult = await sendCdp('Runtime.evaluate', {
      expression: `(() => {
        window.__testLogs = [];
        const logger = (...args) => window.__testLogs.push(args.join(' '));
        
        const links = Array.from(document.querySelectorAll('a._rHu7W_link, [class*="_rHu7W_menuPanel"] a'));
        const proj = links.find(a => (a.innerText || a.textContent || '').trim().startsWith('PROJECTS'));
        
        if (!proj) return { error: 'Projects link not found' };

        const pathBefore = window.location.pathname;
        const scrollBefore = window.scrollY;
        
        // Dispatch click
        const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
        const dispatched = proj.dispatchEvent(clickEvent);

        return {
          pathBefore,
          scrollBefore,
          dispatched,
          defaultPrevented: clickEvent.defaultPrevented,
          hasLenis: !!window.__lenis,
          targetScene1: !!document.getElementById('scene1'),
          scene1Height: document.getElementById('scene1')?.offsetHeight,
          scene1Offset: document.getElementById('scene1')?.offsetTop
        };
      })()`,
      returnByValue: true
    });
    console.log('Click execution info:', clickResult.result?.value);

    // Wait 500ms
    await sleep(500);
    const scroll500 = await sendCdp('Runtime.evaluate', {
      expression: `({
        scrollY: window.scrollY,
        lenisScroll: window.__lenis?.animatedScroll,
        lenisTarget: window.__lenis?.targetScroll,
        lenisStopped: window.__lenis?.isStopped,
        lenisLocked: window.__lenis?.isLocked,
        pathname: window.location.pathname
      })`,
      returnByValue: true
    });
    console.log('State after 500ms:', scroll500.result?.value);

    // Wait another 1500ms
    await sleep(1500);
    const scroll2s = await sendCdp('Runtime.evaluate', {
      expression: `({
        scrollY: window.scrollY,
        lenisScroll: window.__lenis?.animatedScroll,
        lenisTarget: window.__lenis?.targetScroll,
        pathname: window.location.pathname
      })`,
      returnByValue: true
    });
    console.log('State after 2000ms:', scroll2s.result?.value);

    ws.close();
  } catch (err) {
    console.error('Error in test:', err);
  } finally {
    chrome.kill();
    try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch (_) {}
  }
}

main();
