import { spawn } from 'child_process';
import fs from 'fs';

async function main() {
  const chrome = spawn('google-chrome-stable', [
    '--headless',
    '--disable-gpu',
    '--window-size=1280,900',
    '--remote-debugging-port=9232',
    'http://localhost:3001/lite.html#extra-skills'
  ]);

  await new Promise(r => setTimeout(r, 1500));

  try {
    const res = await fetch('http://127.0.0.1:9232/json');
    const tabs = await res.json();
    const tab = tabs.find(t => t.url.includes('localhost'));
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
    await new Promise(r => setTimeout(r, 1200));

    // Inspect the modal DOM
    const checkDom = await call('Runtime.evaluate', {
      expression: `(() => {
        const modal = document.getElementById('mh-my-videos-modal');
        if (!modal) return { error: 'Modal not found' };

        const driveLinks = Array.from(modal.querySelectorAll('a')).filter(a => (a.href && a.href.includes('drive.google.com')) || (a.textContent && a.textContent.includes('DRIVE')));
        const card4 = modal.querySelector('[data-video-id="ai-vid-4"]');
        const card4Title = card4 ? card4.querySelector('.mh-vid-title')?.textContent : null;
        const card4Tags = card4 ? Array.from(card4.querySelectorAll('.mh-vid-tool-tag')).map(t => t.textContent) : [];
        const card4Desc = card4 ? card4.querySelector('.mh-vid-desc')?.textContent : null;
        const playBtns = Array.from(modal.querySelectorAll('.mh-vid-play-btn')).map(b => b.offsetWidth);

        return {
          modalActive: modal.classList.contains('active'),
          driveLinksCount: driveLinks.length,
          card4Title,
          card4Tags,
          card4Desc,
          playBtnsCount: playBtns.length,
          playBtnWidthSample: playBtns[0]
        };
      })()`,
      returnByValue: true
    });

    console.log('DOM Verification Result:', JSON.stringify(checkDom.result.value, null, 2));

    // Capture clean modal screenshot
    const screenshot = await call('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('/home/mahmud-hasan/.gemini/antigravity/brain/e6bc3d1f-e2b2-4748-b4d5-000419591376/extra_skills_clean_privacy.png', Buffer.from(screenshot.data, 'base64'));
    console.log('Saved extra_skills_clean_privacy.png successfully!');

    ws.close();
  } finally {
    chrome.kill();
  }
}

main().catch(console.error);
