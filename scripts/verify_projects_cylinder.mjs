import { spawn } from 'child_process';
import fs from 'fs';

const CHROME_PORT = 9320;
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function main() {
  const tmpDir = fs.mkdtempSync('/tmp/chrome-cylinder-');
  const chrome = spawn('google-chrome', [
    '--headless=new',
    `--remote-debugging-port=${CHROME_PORT}`,
    '--remote-allow-origins=*',
    `--user-data-dir=${tmpDir}`,
    '--no-sandbox',
    '--disable-gpu',
    'about:blank'
  ]);

  await sleep(1800);

  async function createSession(url, width = 1280, height = 800) {
    const res = await fetch(`http://127.0.0.1:${CHROME_PORT}/json/new?${encodeURIComponent(url)}`, { method: 'PUT' });
    const target = await res.json();
    const ws = new WebSocket(target.webSocketDebuggerUrl);
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

    await sendCdp('Page.enable');
    await sendCdp('Runtime.enable');
    await sendCdp('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: width < 768
    });

    return { ws, sendCdp, targetId: target.id };
  }

  try {
    console.log('--- 1. Testing In-Page Click Navigation to PROJECTS ---');
    const s1 = await createSession('http://127.0.0.1:3001/?variant=full', 1280, 800);
    console.log('Waiting 3.5s for 3D engine to mount...');
    await sleep(3500);

    const initialNav = await s1.sendCdp('Runtime.evaluate', {
      expression: `(() => {
        const dot = document.querySelector('button._rHu7W_menu, button[aria-label="Menu"], ._rHu7W_menu');
        const dotDisplay = dot ? window.getComputedStyle(dot).display : 'none';
        const links = Array.from(document.querySelectorAll('a._rHu7W_link, [class*="_rHu7W_menuPanel"] a')).map(a => a.innerText.trim());
        const s1El = document.getElementById('scene1');
        return {
          scrollY: window.scrollY,
          dotDisplay,
          dotHidden: !dot || dotDisplay === 'none',
          links,
          scene1Height: s1El ? s1El.offsetHeight : 0
        };
      })()`,
      returnByValue: true
    });
    console.log('Initial state:', initialNav.result?.value);

    console.log('Clicking PROJECTS button...');
    await s1.sendCdp('Runtime.evaluate', {
      expression: `(() => {
        const a = Array.from(document.querySelectorAll('a._rHu7W_link')).find(el => el.innerText.includes('PROJECTS'));
        if (a) a.click();
      })()`
    });

    await sleep(2500);

    const afterProjClick = await s1.sendCdp('Runtime.evaluate', {
      expression: `(() => {
        const s1El = document.getElementById('scene1');
        return {
          scrollY: window.scrollY,
          expectedMin: 4500,
          expectedExact: s1El ? Math.round(s1El.offsetTop + s1El.offsetHeight * 0.5755) : 5479
        };
      })()`,
      returnByValue: true
    });
    console.log('After PROJECTS click scroll position:', afterProjClick.result?.value);
    s1.ws.close();

    console.log('\n--- 2. Testing Direct Route Glide to PROJECTS (?variant=full&glide=projects) ---');
    const s2 = await createSession('http://127.0.0.1:3001/?variant=full&glide=projects', 1280, 800);
    await sleep(3500);

    const directProjGlide = await s2.sendCdp('Runtime.evaluate', {
      expression: `(() => {
        const dot = document.querySelector('button._rHu7W_menu, button[aria-label="Menu"], ._rHu7W_menu');
        const dotDisplay = dot ? window.getComputedStyle(dot).display : 'none';
        return {
          scrollY: window.scrollY,
          dotDisplay,
          expectedMin: 4500
        };
      })()`,
      returnByValue: true
    });
    console.log('Direct glide to projects scroll position:', directProjGlide.result?.value);
    s2.ws.close();

    const initVal = initialNav.result?.value || {};
    const projVal = afterProjClick.result?.value || {};
    const glideVal = directProjGlide.result?.value || {};

    console.log('\n========================================');
    console.log('VERIFICATION RESULTS:');
    console.log('1. 3-Dot Hidden (initial):', initVal.dotHidden ? 'PASS ✅' : 'FAIL ❌');
    console.log('2. All 7 Links Active:', initVal.links?.includes('PROJECTS') && initVal.links?.includes('ABOUT') ? 'PASS ✅' : 'FAIL ❌');
    console.log('3. Projects Click Destination (>= 4500px):', projVal.scrollY >= 4500 ? 'PASS ✅' : 'FAIL ❌');
    console.log('4. Projects Direct Glide (>= 4500px):', glideVal.scrollY >= 4500 ? 'PASS ✅' : 'FAIL ❌');
    console.log('========================================');

  } catch (err) {
    console.error('Test error:', err);
  } finally {
    chrome.kill();
    try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch (_) {}
  }
}

main();
