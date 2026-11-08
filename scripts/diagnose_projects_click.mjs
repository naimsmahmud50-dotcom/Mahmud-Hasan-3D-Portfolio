import { spawn } from 'child_process';
import fs from 'fs';

const CHROME_PORT = 9460;
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function main() {
  const tmpDir = fs.mkdtempSync('/tmp/chrome-diag-');
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
          const msg = JSON.parse(event.data);
          if (msg.id === curId) {
            ws.removeEventListener('message', onMsg);
            if (msg.error) reject(msg.error);
            else resolve(msg.result);
          }
        };
        ws.addEventListener('message', onMsg);
        ws.send(JSON.stringify({ id: curId, method, params }));
      });
    }

    ws.addEventListener('message', (event) => {
      const msg = JSON.parse(event.data);
      if (msg.method === 'Runtime.consoleAPICalled') {
        const text = msg.params.args.map(a => a.value ?? a.description ?? '').join(' ');
        console.log('[BROWSER CONSOLE]', text);
      }
      if (msg.method === 'Runtime.exceptionThrown') {
        console.error('[BROWSER EXCEPTION]', msg.params.exceptionDetails);
      }
    });

    await sendCdp('Runtime.enable');
    await sendCdp('Page.enable');
    await sendCdp('Emulation.setDeviceMetricsOverride', {
      width: 1280,
      height: 800,
      deviceScaleFactor: 1,
      mobile: false
    });

    console.log('Waiting 3.5s for 3D experience...');
    await sleep(3500);

    const diag = await sendCdp('Runtime.evaluate', {
      expression: `(() => {
        const links = Array.from(document.querySelectorAll('a._rHu7W_link, [class*="_rHu7W_menuPanel"] a, a'));
        const proj = links.find(a => (a.textContent || '').trim().startsWith('PROJECTS'));
        const s1 = document.getElementById('scene1');
        return {
          foundProj: !!proj,
          projTag: proj?.tagName,
          projClasses: proj?.className,
          projHref: proj?.getAttribute('href'),
          projText: proj?.textContent?.trim(),
          scene1H: s1?.offsetHeight,
          scene1Top: s1?.offsetTop,
          currentScrollY: window.scrollY
        };
      })()`,
      returnByValue: true
    });
    console.log('Diagnostic probe:', diag.result?.value);

    console.log('Triggering click on PROJECTS link...');
    const clickProbe = await sendCdp('Runtime.evaluate', {
      expression: `(() => {
        const links = Array.from(document.querySelectorAll('a._rHu7W_link, [class*="_rHu7W_menuPanel"] a, a'));
        const proj = links.find(a => (a.textContent || '').trim().startsWith('PROJECTS'));
        if (proj) {
          proj.click();
          return { clicked: true };
        }
        return { clicked: false };
      })()`,
      returnByValue: true
    });
    console.log('Click probe result:', clickProbe.result?.value);

    await sleep(1000);
    const scroll1s = await sendCdp('Runtime.evaluate', { expression: 'window.scrollY', returnByValue: true });
    console.log('ScrollY after 1000ms:', scroll1s.result?.value);

    await sleep(1500);
    const scroll25s = await sendCdp('Runtime.evaluate', { expression: 'window.scrollY', returnByValue: true });
    console.log('ScrollY after 2500ms:', scroll25s.result?.value);

    ws.close();
  } catch (err) {
    console.error('Error in diag:', err);
  } finally {
    chrome.kill();
    try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch (_) {}
  }
}

main();
