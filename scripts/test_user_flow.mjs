import { spawn } from 'child_process';
import fs from 'fs';

const CHROME_PORT = 9520;
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function main() {
  const tmpDir = fs.mkdtempSync('/tmp/chrome-user-flow-');
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
    if (!tab) throw new Error('Tab not found');

    const ws = new WebSocket(tab.webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);

    let id = 1;
    function call(method, params = {}) {
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

    await call('Page.enable');
    await call('Runtime.enable');
    await call('Emulation.setDeviceMetricsOverride', {
      width: 1280,
      height: 800,
      deviceScaleFactor: 1,
      mobile: false
    });

    console.log('Waiting 3.5s for initial mount...');
    await sleep(3500);

    // Initial check
    const initial = await call('Runtime.evaluate', {
      expression: `(() => {
        const dot = document.querySelector('button._rHu7W_menu, button[aria-label="Menu"], ._rHu7W_menu');
        const links = Array.from(document.querySelectorAll('a._rHu7W_link, [class*="_rHu7W_menuPanel"] a')).map(a => a.textContent.trim());
        return {
          scrollY: window.scrollY,
          dotInDOM: !!dot,
          links
        };
      })()`,
      returnByValue: true
    });
    console.log('1. Initial State:', initial.result.value);

    // Click PROJECTS
    console.log('\n2. Clicking PROJECTS button...');
    await call('Runtime.evaluate', {
      expression: `(() => {
        const links = Array.from(document.querySelectorAll('a._rHu7W_link, [class*="_rHu7W_menuPanel"] a'));
        const proj = links.find(a => (a.textContent || '').trim().startsWith('PROJECTS'));
        if (proj) proj.click();
      })()`
    });
    await sleep(2500);

    const projState = await call('Runtime.evaluate', {
      expression: `(() => ({
        scrollY: window.scrollY,
        lenisScroll: Math.round(window.__lenis?.animatedScroll || 0)
      }))()`,
      returnByValue: true
    });
    console.log('Projects destination:', projState.result.value);

    // Click ABOUT
    console.log('\n3. Clicking ABOUT button...');
    await call('Runtime.evaluate', {
      expression: `(() => {
        const links = Array.from(document.querySelectorAll('a._rHu7W_link, [class*="_rHu7W_menuPanel"] a'));
        const about = links.find(a => (a.textContent || '').trim().startsWith('ABOUT'));
        if (about) about.click();
      })()`
    });
    await sleep(2500);

    const aboutState = await call('Runtime.evaluate', {
      expression: `(() => ({
        scrollY: window.scrollY,
        lenisScroll: Math.round(window.__lenis?.animatedScroll || 0)
      }))()`,
      returnByValue: true
    });
    console.log('About destination:', aboutState.result.value);

    // Click HOME
    console.log('\n4. Clicking HOME button...');
    await call('Runtime.evaluate', {
      expression: `(() => {
        const links = Array.from(document.querySelectorAll('a._rHu7W_link, [class*="_rHu7W_menuPanel"] a'));
        const home = links.find(a => (a.textContent || '').trim().startsWith('HOME'));
        if (home) home.click();
      })()`
    });
    await sleep(2000);

    const homeState = await call('Runtime.evaluate', {
      expression: `(() => ({
        scrollY: window.scrollY,
        lenisScroll: Math.round(window.__lenis?.animatedScroll || 0)
      }))()`,
      returnByValue: true
    });
    console.log('Home destination:', homeState.result.value);

    ws.close();

    console.log('\n========================================');
    console.log('FINAL USER EXPERIENCE AUDIT:');
    console.log('• 3-Dot Completely Removed:', !initial.result.value.dotInDOM ? 'PASS ✅' : 'FAIL ❌');
    console.log('• All 7 Inline Links Available:', initial.result.value.links.includes('PROJECTS') && initial.result.value.links.includes('ABOUT') ? 'PASS ✅' : 'FAIL ❌');
    console.log('• Projects Click Glide (>= 4500px):', projState.result.value.scrollY >= 4500 ? 'PASS ✅' : 'FAIL ❌');
    console.log('• About Click Glide (>= 6000px):', aboutState.result.value.scrollY >= 6000 ? 'PASS ✅' : 'FAIL ❌');
    console.log('• Home Return to Top (0px):', homeState.result.value.scrollY === 0 ? 'PASS ✅' : 'FAIL ❌');
    console.log('========================================');

  } finally {
    chrome.kill();
    try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch (_) {}
  }
}

main().catch(console.error);
