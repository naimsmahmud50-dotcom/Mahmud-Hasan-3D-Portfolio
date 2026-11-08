const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const CHROME_PORT = 9265;

async function run() {
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

  await new Promise(r => setTimeout(r, 2000));

  try {
    const res = await fetch(`http://127.0.0.1:${CHROME_PORT}/json`);
    const tabs = await res.json();
    const tab = tabs.find(t => t.url && t.url.includes('3001'));
    if (!tab) {
      console.error('No tab found on 3001');
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
    await call('Page.enable');

    console.log('Waiting 4s for initial 3D load...');
    await new Promise(r => setTimeout(r, 4000));

    const sceneData = await call('Runtime.evaluate', {
      expression: `(() => {
        const s1 = document.getElementById('scene1');
        const s2 = document.getElementById('scene2');
        const sa = document.getElementById('sceneAbout');
        const sc = document.getElementById('sceneContactReveal');
        return {
          windowHeight: window.innerHeight,
          totalHeight: document.documentElement.scrollHeight,
          s1: s1 ? { top: s1.offsetTop, height: s1.offsetHeight } : null,
          s2: s2 ? { top: s2.offsetTop, height: s2.offsetHeight } : null,
          sa: sa ? { top: sa.offsetTop, height: sa.offsetHeight } : null,
          sc: sc ? { top: sc.offsetTop, height: sc.offsetHeight } : null,
          windowLenis: typeof window.lenis,
          window__lenis: typeof window.__lenis,
        };
      })()`,
      returnByValue: true
    });
    console.log('Scene Data:', JSON.stringify(sceneData.result.value, null, 2));

    // Test: Scroll to scene1.offsetTop + scene1.offsetHeight * 0.5755
    const s1 = sceneData.result.value.s1;
    const targetProjects = s1 ? Math.round(s1.top + s1.height * 0.5755) : 5800;
    console.log(`Scrolling window to targetProjects: ${targetProjects}...`);

    await call('Runtime.evaluate', {
      expression: `window.scrollTo(0, ${targetProjects})`
    });

    await new Promise(r => setTimeout(r, 1500));

    // Capture screenshot at projects cylinder
    const shot = await call('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('/home/mahmud-hasan/.gemini/antigravity/brain/e6bc3d1f-e2b2-4748-b4d5-000419591376/diagnose_projects_pos.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved screenshot to diagnose_projects_pos.png');

    // Also test scrolling to scene2.offsetTop
    const s2 = sceneData.result.value.s2;
    if (s2) {
      console.log(`Scrolling window to scene2.top: ${s2.top}...`);
      await call('Runtime.evaluate', {
        expression: `window.scrollTo(0, ${s2.top})`
      });
      await new Promise(r => setTimeout(r, 1500));
      const shot2 = await call('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync('/home/mahmud-hasan/.gemini/antigravity/brain/e6bc3d1f-e2b2-4748-b4d5-000419591376/diagnose_scene2_pos.png', Buffer.from(shot2.data, 'base64'));
      console.log('Saved screenshot to diagnose_scene2_pos.png');
    }

    ws.close();
  } finally {
    chrome.kill();
    try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch (_) {}
  }
}

run();
