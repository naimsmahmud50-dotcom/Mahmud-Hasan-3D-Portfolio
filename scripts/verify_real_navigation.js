const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const PORT = 3001;
const CHROME_PORT = 9270;

async function run() {
  const tmpDir = fs.mkdtempSync('/tmp/chrome-nav-real-');
  const chrome = spawn('google-chrome', [
    '--headless=new',
    `--remote-debugging-port=${CHROME_PORT}`,
    '--remote-allow-origins=*',
    `--user-data-dir=${tmpDir}`,
    '--no-sandbox',
    '--disable-gpu',
    `http://127.0.0.1:${PORT}/?variant=full`
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const res = await fetch(`http://127.0.0.1:${CHROME_PORT}/json`);
    const tabs = await res.json();
    const tab = tabs.find(t => t.url && t.url.includes(`${PORT}`));
    if (!tab) {
      console.error('No tab found!');
      return;
    }
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

    console.log('Waiting 3.5s for 3D page hydration...');
    await new Promise(r => setTimeout(r, 3500));

    // 1. Check Navbar and 3-dot suppression
    const navState = await call('Runtime.evaluate', {
      expression: `(() => {
        const dotBtn = document.querySelector('button._rHu7W_menu, button[aria-label="Menu"]');
        const dotVisible = dotBtn ? (window.getComputedStyle(dotBtn).display !== 'none' && dotBtn.offsetWidth > 0) : false;
        const links = Array.from(document.querySelectorAll('a._rHu7W_link')).map(a => ({
          text: a.innerText.trim(),
          visible: a.offsetWidth > 0 && a.offsetHeight > 0
        }));
        return { dotVisible, links };
      })()`,
      returnByValue: true
    });
    console.log('[AUDIT 1] Nav state:', JSON.stringify(navState.result.value));

    // 2. Click PROJECTS
    console.log('\n[AUDIT 2] Clicking PROJECTS...');
    await call('Runtime.evaluate', {
      expression: `(() => {
        const links = Array.from(document.querySelectorAll('a._rHu7W_link'));
        const p = links.find(l => l.innerText.trim() === 'PROJECTS');
        if (p) p.click();
      })()`
    });

    // Wait 2 seconds for Lenis smooth scroll
    await new Promise(r => setTimeout(r, 2000));

    const projectsScroll = await call('Runtime.evaluate', {
      expression: `(() => {
        const s1 = document.getElementById('scene1');
        const expectedY = Math.round(s1.offsetTop + s1.offsetHeight * 0.5755);
        return {
          scrollY: window.scrollY,
          lenisScroll: window.lenis ? Math.round(window.lenis.scroll) : null,
          expectedY: expectedY,
          diff: Math.abs(window.scrollY - expectedY)
        };
      })()`,
      returnByValue: true
    });
    console.log('[AUDIT 2] Projects Scroll Result:', projectsScroll.result.value);

    // 3. Click ABOUT
    console.log('\n[AUDIT 3] Clicking ABOUT...');
    await call('Runtime.evaluate', {
      expression: `(() => {
        const links = Array.from(document.querySelectorAll('a._rHu7W_link'));
        const a = links.find(l => l.innerText.trim() === 'ABOUT');
        if (a) a.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 2000));
    const aboutScroll = await call('Runtime.evaluate', {
      expression: `(() => {
        const sa = document.getElementById('sceneAbout');
        const expectedY = Math.round(sa.offsetTop + sa.offsetHeight * 0.8);
        return {
          scrollY: window.scrollY,
          expectedY: expectedY,
          diff: Math.abs(window.scrollY - expectedY)
        };
      })()`,
      returnByValue: true
    });
    console.log('[AUDIT 3] About Scroll Result:', aboutScroll.result.value);

    // 4. Click CONTACT
    console.log('\n[AUDIT 4] Clicking CONTACT...');
    await call('Runtime.evaluate', {
      expression: `(() => {
        const links = Array.from(document.querySelectorAll('a._rHu7W_link'));
        const c = links.find(l => l.innerText.trim() === 'CONTACT');
        if (c) c.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 2000));
    const contactScroll = await call('Runtime.evaluate', {
      expression: `(() => {
        const sc = document.getElementById('sceneContactReveal');
        const expectedY = Math.round(sc.offsetTop + sc.offsetHeight * 0.7286);
        return {
          scrollY: window.scrollY,
          expectedY: expectedY,
          diff: Math.abs(window.scrollY - expectedY)
        };
      })()`,
      returnByValue: true
    });
    console.log('[AUDIT 4] Contact Scroll Result:', contactScroll.result.value);

    // 5. Click HOME
    console.log('\n[AUDIT 5] Clicking HOME...');
    await call('Runtime.evaluate', {
      expression: `(() => {
        const links = Array.from(document.querySelectorAll('a._rHu7W_link'));
        const h = links.find(l => l.innerText.trim() === 'HOME');
        if (h) h.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 2000));
    const homeScroll = await call('Runtime.evaluate', {
      expression: `({ scrollY: window.scrollY })`,
      returnByValue: true
    });
    console.log('[AUDIT 5] Home Scroll Result:', homeScroll.result.value);

    ws.close();
  } finally {
    chrome.kill();
    try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch (_) {}
  }
}

run();
