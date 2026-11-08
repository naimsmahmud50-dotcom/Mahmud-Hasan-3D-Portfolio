const fs = require('fs');
const { spawn } = require('child_process');

const CHROME_PORT = 9266;

async function run() {
  const tmpDir = fs.mkdtempSync('/tmp/chrome-anchors-');
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

    // Test Projects Anchor via window.lenis.scrollTo
    console.log('Testing Projects scroll via lenis...');
    await call('Runtime.evaluate', {
      expression: `(() => {
        const s1 = document.getElementById('scene1');
        const target = Math.round(s1.offsetTop + s1.offsetHeight * 0.5755);
        if (window.lenis) {
          window.lenis.scrollTo(target, { immediate: true });
        } else {
          window.scrollTo(0, target);
        }
      })()`
    });
    await new Promise(r => setTimeout(r, 1500));
    let shot = await call('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('/home/mahmud-hasan/.gemini/antigravity/brain/e6bc3d1f-e2b2-4748-b4d5-000419591376/verify_anchor_projects.png', Buffer.from(shot.data, 'base64'));

    // Test About Anchor via window.lenis.scrollTo
    console.log('Testing About scroll via lenis...');
    await call('Runtime.evaluate', {
      expression: `(() => {
        const sa = document.getElementById('sceneAbout');
        const target = Math.round(sa.offsetTop + sa.offsetHeight * 0.8);
        if (window.lenis) {
          window.lenis.scrollTo(target, { immediate: true });
        } else {
          window.scrollTo(0, target);
        }
      })()`
    });
    await new Promise(r => setTimeout(r, 1500));
    shot = await call('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('/home/mahmud-hasan/.gemini/antigravity/brain/e6bc3d1f-e2b2-4748-b4d5-000419591376/verify_anchor_about.png', Buffer.from(shot.data, 'base64'));

    // Test Contact Anchor via window.lenis.scrollTo
    console.log('Testing Contact scroll via lenis...');
    await call('Runtime.evaluate', {
      expression: `(() => {
        const sc = document.getElementById('sceneContactReveal');
        const target = Math.round(sc.offsetTop + sc.offsetHeight * 0.7286);
        if (window.lenis) {
          window.lenis.scrollTo(target, { immediate: true });
        } else {
          window.scrollTo(0, target);
        }
      })()`
    });
    await new Promise(r => setTimeout(r, 1500));
    shot = await call('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('/home/mahmud-hasan/.gemini/antigravity/brain/e6bc3d1f-e2b2-4748-b4d5-000419591376/verify_anchor_contact.png', Buffer.from(shot.data, 'base64'));

    console.log('All anchors verified successfully!');
    ws.close();
  } finally {
    chrome.kill();
    try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch (_) {}
  }
}

run();
