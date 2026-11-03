import { spawn } from 'child_process';

async function main() {
  const chrome = spawn('google-chrome-stable', [
    '--headless',
    '--disable-gpu',
    '--remote-debugging-port=9224',
    'http://localhost:3001/#extra-skills'
  ]);

  // wait for chrome to start
  await new Promise(r => setTimeout(r, 1500));

  try {
    const listRes = await fetch('http://127.0.0.1:9224/json');
    const tabs = await listRes.json();
    console.log('Tabs:', tabs.map(t => ({ title: t.title, url: t.url })));

    const tab = tabs.find(t => t.url.includes('localhost:3001')) || tabs[0];
    if (!tab) throw new Error('No tab found');

    const ws = new WebSocket(tab.webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);

    let msgId = 1;
    function send(method, params = {}) {
      return new Promise((resolve, reject) => {
        const id = msgId++;
        const handler = (event) => {
          const data = JSON.parse(event.data);
          if (data.id === id) {
            ws.removeEventListener('message', handler);
            if (data.error) reject(data.error);
            else resolve(data.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    await send('Runtime.enable');
    await send('DOM.enable');

    // Wait for modal to open
    await new Promise(r => setTimeout(r, 1000));

    const checkResult = await send('Runtime.evaluate', {
      expression: `(() => {
        const modal = document.getElementById('mh-my-videos-modal');
        const dialog = document.querySelector('.mh-videos-modal-dialog');
        if (!dialog) return { error: 'No dialog found' };
        
        const rect = dialog.getBoundingClientRect();
        const style = window.getComputedStyle(dialog);
        const parentStyle = window.getComputedStyle(modal);

        return {
          modalActive: modal.classList.contains('active'),
          dialogRect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
          dialogScroll: {
            scrollHeight: dialog.scrollHeight,
            clientHeight: dialog.clientHeight,
            scrollTop: dialog.scrollTop,
            canScroll: dialog.scrollHeight > dialog.clientHeight
          },
          dialogOverflowY: style.overflowY,
          dialogPointerEvents: style.pointerEvents,
          modalOverflowY: parentStyle.overflowY,
          modalPointerEvents: parentStyle.pointerEvents
        };
      })()`,
      returnByValue: true
    });

    console.log('Modal Check Result:', JSON.stringify(checkResult.result.value, null, 2));

    // Test programmatically scrolling
    const scrollTest = await send('Runtime.evaluate', {
      expression: `(() => {
        const dialog = document.querySelector('.mh-videos-modal-dialog');
        if (!dialog) return null;
        dialog.scrollTop = 150;
        return { afterScrollTop: dialog.scrollTop };
      })()`,
      returnByValue: true
    });
    console.log('Scroll Test (scrollTop = 150):', scrollTest.result.value);

    // Test dispatching a mouseWheel event
    const rect = checkResult.result.value.dialogRect;
    const centerX = Math.round(rect.x + rect.width / 2);
    const centerY = Math.round(rect.y + rect.height / 2);

    console.log(`Dispatching wheel event at (${centerX}, ${centerY})...`);
    await send('Input.dispatchMouseEvent', {
      type: 'mouseWheel',
      x: centerX,
      y: centerY,
      deltaX: 0,
      deltaY: 200
    });

    await new Promise(r => setTimeout(r, 500));

    const wheelCheck = await send('Runtime.evaluate', {
      expression: `(() => {
        const dialog = document.querySelector('.mh-videos-modal-dialog');
        return { scrollTopAfterWheel: dialog ? dialog.scrollTop : null };
      })()`,
      returnByValue: true
    });
    console.log('After Input.dispatchMouseEvent:', wheelCheck.result.value);

    // Check window / document event listeners
    const listenersCheck = await send('Runtime.evaluate', {
      expression: `(() => {
        const events = [];
        // Test what prevents wheel
        let cancelled = false;
        const testEvent = new WheelEvent('wheel', { deltaY: 100, bubbles: true, cancelable: true });
        const dialog = document.querySelector('.mh-videos-modal-dialog');
        const dispatched = dialog.dispatchEvent(testEvent);
        return {
          defaultPrevented: testEvent.defaultPrevented,
          dispatchedResult: dispatched
        };
      })()`,
      returnByValue: true
    });
    console.log('Wheel Event Synthetic Dispatch:', listenersCheck.result.value);

    ws.close();
  } finally {
    chrome.kill();
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
