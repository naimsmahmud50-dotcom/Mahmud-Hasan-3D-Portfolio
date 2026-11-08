import fs from 'fs';
import { spawn } from 'child_process';

const CHROME_PORT = 9268;

async function run() {
  const tmpDir = fs.mkdtempSync('/tmp/chrome-test-');
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
    if (!tab) {
      console.error('Tab not found');
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

    await call('Runtime.enable');

    console.log('Waiting 3.5s for page to mount...');
    await new Promise(r => setTimeout(r, 3500));

    // Check menu button state
    const menuBtn = await call('Runtime.evaluate', {
      expression: `(() => {
        const btn = document.querySelector('button._rHu7W_menu, button[aria-label="Menu"]');
        return {
          exists: !!btn,
          computedDisplay: btn ? window.getComputedStyle(btn).display : 'NOT_IN_DOM'
        };
      })()`,
      returnByValue: true
    });
    console.log('3-Dot Menu Button state:', menuBtn.result.value);

    // List links
    const linkList = await call('Runtime.evaluate', {
      expression: `(() => {
        const links = Array.from(document.querySelectorAll('nav a, [class*="_rHu7W_nav"] a, [class*="_rHu7W_menuPanel"] a'));
        return links.map(a => a.textContent.trim());
      })()`,
      returnByValue: true
    });
    console.log('Navbar links:', linkList.result.value);

    // Trigger click on PROJECTS link
    const clickRes = await call('Runtime.evaluate', {
      expression: `(() => {
        const links = Array.from(document.querySelectorAll('nav a, [class*="_rHu7W_nav"] a, [class*="_rHu7W_menuPanel"] a'));
        const proj = links.find(a => (a.textContent || '').trim().startsWith('PROJECTS'));
        if (proj) {
          proj.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
          return { clicked: true, text: proj.textContent.trim() };
        }
        return { clicked: false };
      })()`,
      returnByValue: true
    });
    console.log('Click result:', clickRes.result.value);

    await new Promise(r => setTimeout(r, 800));

    const finalState = await call('Runtime.evaluate', {
      expression: `(() => {
        return {
          scrollY: window.scrollY,
          innerHeight: window.innerHeight,
          scene1Height: document.getElementById('scene1')?.offsetHeight
        };
      })()`,
      returnByValue: true
    });
    console.log('Final State:', finalState.result.value);

    ws.close();
  } finally {
    chrome.kill();
    try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch (_) {}
  }
}

run();
