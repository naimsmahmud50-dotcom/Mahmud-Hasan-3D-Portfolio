import { spawn } from 'child_process';

async function main() {
  const chrome = spawn('google-chrome-stable', [
    '--headless',
    '--disable-gpu',
    '--window-size=1280,850',
    '--remote-debugging-port=9231',
    'http://localhost:3001/lite.html#extra-skills'
  ]);

  await new Promise(r => setTimeout(r, 1500));

  try {
    const res = await fetch('http://127.0.0.1:9231/json');
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
    await new Promise(r => setTimeout(r, 1000));

    // Test 1: Wheel on backdrop (x: 50, y: 50)
    console.log('Dispatching wheel event on backdrop (x: 50, y: 50)...');
    await call('Input.dispatchMouseEvent', {
      type: 'mouseWheel',
      x: 50,
      y: 50,
      deltaX: 0,
      deltaY: 250
    });
    await new Promise(r => setTimeout(r, 400));

    const stBackdrop = await call('Runtime.evaluate', {
      expression: 'document.querySelector(".mh-videos-modal-dialog").scrollTop',
      returnByValue: true
    });
    console.log('ScrollTop after backdrop wheel:', stBackdrop.result.value);

    // Test 2: Wheel on card inside dialog (x: 400, y: 300)
    console.log('Dispatching wheel event on card inside dialog (x: 400, y: 300)...');
    await call('Input.dispatchMouseEvent', {
      type: 'mouseWheel',
      x: 400,
      y: 300,
      deltaX: 0,
      deltaY: 250
    });
    await new Promise(r => setTimeout(r, 400));

    const stCard = await call('Runtime.evaluate', {
      expression: 'document.querySelector(".mh-videos-modal-dialog").scrollTop',
      returnByValue: true
    });
    console.log('ScrollTop after card wheel:', stCard.result.value);

    // Test 3: Keyboard ArrowDown
    console.log('Dispatching ArrowDown key...');
    await call('Input.dispatchKeyEvent', {
      type: 'rawKeyDown',
      key: 'ArrowDown',
      code: 'ArrowDown',
      windowsVirtualKeyCode: 40
    });
    await call('Input.dispatchKeyEvent', {
      type: 'keyUp',
      key: 'ArrowDown',
      code: 'ArrowDown',
      windowsVirtualKeyCode: 40
    });
    await new Promise(r => setTimeout(r, 300));

    const stKey = await call('Runtime.evaluate', {
      expression: 'document.querySelector(".mh-videos-modal-dialog").scrollTop',
      returnByValue: true
    });
    console.log('ScrollTop after ArrowDown:', stKey.result.value);

    // Scroll further down to capture cards 5 & 6
    await call('Runtime.evaluate', {
      expression: 'document.querySelector(".mh-videos-modal-dialog").scrollTop = 550;'
    });
    await new Promise(r => setTimeout(r, 400));

    // Take screenshot showing scrolled modal with bottom cards
    const screenshot = await call('Page.captureScreenshot', { format: 'png' });
    import('fs').then(fs => {
      fs.writeFileSync('/home/mahmud-hasan/.gemini/antigravity/brain/e6bc3d1f-e2b2-4748-b4d5-000419591376/extra_skills_scrolled_view.png', Buffer.from(screenshot.data, 'base64'));
      console.log('Saved extra_skills_scrolled_view.png successfully!');
    });

    await new Promise(r => setTimeout(r, 500));
    ws.close();
  } finally {
    chrome.kill();
  }
}

main().catch(console.error);
