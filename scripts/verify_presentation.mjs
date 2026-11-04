import { spawn } from 'child_process';
import fs from 'fs';

async function main() {
  const chrome = spawn('google-chrome', [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1920,1080',
    '--remote-debugging-port=9232',
    'file:///home/mahmud-hasan/Naims Project/3d portfolio/presentation/index.html'
  ]);

  await new Promise(r => setTimeout(r, 1500));

  try {
    const res = await fetch('http://127.0.0.1:9232/json');
    const tabs = await res.json();
    const tab = tabs.find(t => t.url.includes('presentation'));
    if (!tab) {
      console.error('Presentation tab not found');
      chrome.kill();
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
    await new Promise(r => setTimeout(r, 1000));

    // Capture Slide 1
    const scr1 = await call('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('/home/mahmud-hasan/.gemini/antigravity/brain/e6bc3d1f-e2b2-4748-b4d5-000419591376/presentation_slide_1.png', Buffer.from(scr1.data, 'base64'));
    console.log('Saved presentation_slide_1.png');

    // Move to Slide 3 (Tech Stack Matrix) and toggle Speaker Notes
    await call('Runtime.evaluate', {
      expression: `(() => {
        updateSlide(3);
        toggleNotes();
      })()`
    });
    await new Promise(r => setTimeout(r, 500));

    const scr3 = await call('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('/home/mahmud-hasan/.gemini/antigravity/brain/e6bc3d1f-e2b2-4748-b4d5-000419591376/presentation_slide_3_notes.png', Buffer.from(scr3.data, 'base64'));
    console.log('Saved presentation_slide_3_notes.png');

    ws.close();
  } catch (err) {
    console.error('Error during verification:', err);
  } finally {
    chrome.kill();
  }
}

main();
