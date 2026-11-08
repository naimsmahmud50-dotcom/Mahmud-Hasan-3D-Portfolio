const fs = require('fs');
const { spawn } = require('child_process');

const CHROME_PORT = 9267;

async function run() {
  const tmpDir = fs.mkdtempSync('/tmp/chrome-click-');
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

    console.log('Waiting 4s for initial load...');
    await new Promise(r => setTimeout(r, 4000));

    // Evaluate clicking the PROJECTS navbar link directly in the page
    console.log('Clicking PROJECTS navbar link...');
    const clickResult = await call('Runtime.evaluate', {
      expression: `(() => {
        const links = Array.from(document.querySelectorAll('a, button'));
        const projBtn = links.find(el => el.innerText && el.innerText.trim() === 'PROJECTS');
        if (!projBtn) return { error: 'PROJECTS button not found' };
        projBtn.click();
        return { success: true, text: projBtn.innerText };
      })()`,
      returnByValue: true
    });
    console.log('Click result:', clickResult.result.value);

    // Wait 2.5s for smooth glide
    await new Promise(r => setTimeout(r, 2500));

    const scrollState = await call('Runtime.evaluate', {
      expression: `({ scrollY: window.scrollY, lenisScroll: window.lenis ? window.lenis.scroll : null })`,
      returnByValue: true
    });
    console.log('Scroll state after click:', scrollState.result.value);

    const shot = await call('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('/home/mahmud-hasan/.gemini/antigravity/brain/e6bc3d1f-e2b2-4748-b4d5-000419591376/verify_after_projects_click.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved verify_after_projects_click.png');

    ws.close();
  } finally {
    chrome.kill();
    try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch (_) {}
  }
}

run();
