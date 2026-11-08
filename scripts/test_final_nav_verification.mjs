import { spawn } from 'child_process';
import fs from 'fs';

const CHROME_PORT = 9310;

async function test() {
  const tmpDir = fs.mkdtempSync('/tmp/chrome-final-nav-');
  const chrome = spawn('google-chrome', [
    '--headless=new',
    `--remote-debugging-port=${CHROME_PORT}`,
    '--remote-allow-origins=*',
    `--user-data-dir=${tmpDir}`,
    '--no-sandbox',
    '--disable-gpu',
    'http://127.0.0.1:3001/?variant=full'
  ]);

  await new Promise(r => setTimeout(r, 2500));

  try {
    const res = await fetch(`http://127.0.0.1:${CHROME_PORT}/json`);
    const tabs = await res.json();
    const tab = tabs.find(t => t.url && t.url.includes('3001'));
    if (!tab) throw new Error('Could not find active tab on port 3001');

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

    console.log('Waiting 3.5s for 3D experience to mount...');
    await new Promise(r => setTimeout(r, 3500));

    // 1. Initial State Check
    const navState = await call('Runtime.evaluate', {
      expression: `(() => {
        const dot = document.querySelector('button._rHu7W_menu, button[aria-label="Menu"], ._rHu7W_menu');
        const dotComputed = dot ? window.getComputedStyle(dot) : null;
        const dotHidden = !dot || dotComputed.display === 'none' || dotComputed.visibility === 'hidden' || dot.offsetWidth === 0;

        const links = Array.from(document.querySelectorAll('a._rHu7W_link, [class*="_rHu7W_menuPanel"] a')).map(a => a.innerText.trim());

        return {
          scrollY: window.scrollY,
          dotPresent: Boolean(dot),
          dotHidden,
          dotDisplay: dotComputed ? dotComputed.display : 'none',
          dotWidth: dot ? dot.offsetWidth : 0,
          links
        };
      })()`,
      returnByValue: true
    });
    console.log('--- Initial Nav State ---', navState.result.value);

    // 2. Click PROJECTS button
    console.log('\n--- Clicking PROJECTS button ---');
    const clickProj = await call('Runtime.evaluate', {
      expression: `(() => {
        const links = Array.from(document.querySelectorAll('a._rHu7W_link'));
        const proj = links.find(a => a.innerText.includes('PROJECTS'));
        if (proj) {
          proj.click();
          return { found: true, text: proj.innerText };
        }
        return { found: false };
      })()`,
      returnByValue: true
    });
    console.log('Projects click result:', clickProj.result.value);

    // Wait 2.5s for smooth glide
    await new Promise(r => setTimeout(r, 2500));

    const projPos = await call('Runtime.evaluate', {
      expression: `(() => {
        const s1 = document.getElementById('scene1');
        return {
          scrollY: window.scrollY,
          scene1Height: s1 ? s1.offsetHeight : 0,
          expectedMin: 4500
        };
      })()`,
      returnByValue: true
    });
    console.log('Projects glide scroll position:', projPos.result.value);

    // 3. Click ABOUT button
    console.log('\n--- Clicking ABOUT button ---');
    await call('Runtime.evaluate', {
      expression: `(() => {
        const links = Array.from(document.querySelectorAll('a._rHu7W_link'));
        const about = links.find(a => a.innerText.includes('ABOUT'));
        if (about) about.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 2500));

    const aboutPos = await call('Runtime.evaluate', {
      expression: '({ scrollY: window.scrollY })',
      returnByValue: true
    });
    console.log('About glide scroll position:', aboutPos.result.value);

    // 4. Click HOME button
    console.log('\n--- Clicking HOME button ---');
    await call('Runtime.evaluate', {
      expression: `(() => {
        const links = Array.from(document.querySelectorAll('a._rHu7W_link'));
        const home = links.find(a => a.innerText.startsWith('HOME'));
        if (home) home.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 2000));

    const homePos = await call('Runtime.evaluate', {
      expression: '({ scrollY: window.scrollY })',
      returnByValue: true
    });
    console.log('Home glide scroll position:', homePos.result.value);

    ws.close();

    console.log('\n--- VERDICT ---');
    console.log('1. 3-Dot Hidden:', navState.result.value.dotHidden ? 'PASS ✅' : 'FAIL ❌');
    console.log('2. Projects Destination (>= 4500px):', projPos.result.value.scrollY >= 4500 ? 'PASS ✅' : 'FAIL ❌');
    console.log('3. About Destination (>= 6000px):', aboutPos.result.value.scrollY >= 6000 ? 'PASS ✅' : 'FAIL ❌');
    console.log('4. Home Return (0px):', homePos.result.value.scrollY === 0 ? 'PASS ✅' : 'FAIL ❌');
    console.log('5. All 7 Links Active:', navState.result.value.links.length >= 7 ? 'PASS ✅' : 'FAIL ❌');

  } catch (err) {
    console.error('Test error:', err);
  } finally {
    chrome.kill();
    try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch (_) {}
  }
}

test();
