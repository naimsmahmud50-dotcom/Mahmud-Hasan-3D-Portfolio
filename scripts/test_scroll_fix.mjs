import { spawn } from 'child_process';

async function main() {
  const chrome = spawn('google-chrome-stable', [
    '--headless',
    '--disable-gpu',
    '--window-size=1280,850',
    '--remote-debugging-port=9230',
    'http://localhost:3001/lite.html#extra-skills'
  ]);

  await new Promise(r => setTimeout(r, 1500));

  try {
    const res = await fetch('http://127.0.0.1:9230/json');
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

    // Inject the fix
    await call('Runtime.evaluate', {
      expression: `(() => {
        const modal = document.getElementById('mh-my-videos-modal');
        const dialog = document.querySelector('.mh-videos-modal-dialog');
        modal.setAttribute('data-lenis-prevent', 'true');
        modal.setAttribute('data-lenis-prevent-wheel', 'true');
        modal.setAttribute('data-lenis-prevent-touch', 'true');
        dialog.setAttribute('data-lenis-prevent', 'true');
        dialog.setAttribute('data-lenis-prevent-wheel', 'true');
        dialog.setAttribute('data-lenis-prevent-touch', 'true');

        modal.addEventListener('wheel', (e) => {
          e.stopPropagation();
          if (!dialog.contains(e.target)) {
            dialog.scrollTop += e.deltaY;
            if (e.cancelable) e.preventDefault();
          }
        }, { passive: false });
      })()`
    });

    // 1. Wheel on backdrop (x: 50, y: 50)
    await call('Input.dispatchMouseEvent', {
      type: 'mouseWheel',
      x: 50,
      y: 50,
      deltaX: 0,
      deltaY: 250
    });
    await new Promise(r => setTimeout(r, 300));

    const st1 = await call('Runtime.evaluate', {
      expression: 'document.querySelector(".mh-videos-modal-dialog").scrollTop',
      returnByValue: true
    });
    console.log('ScrollTop after wheel on backdrop (WITH FIX):', st1.result.value);

    // 2. Wheel on card inside dialog (x: 400, y: 300)
    await call('Input.dispatchMouseEvent', {
      type: 'mouseWheel',
      x: 400,
      y: 300,
      deltaX: 0,
      deltaY: 250
    });
    await new Promise(r => setTimeout(r, 300));

    const st2 = await call('Runtime.evaluate', {
      expression: 'document.querySelector(".mh-videos-modal-dialog").scrollTop',
      returnByValue: true
    });
    console.log('ScrollTop after wheel on card (WITH FIX):', st2.result.value);

    ws.close();
  } finally {
    chrome.kill();
  }
}

main().catch(console.error);
