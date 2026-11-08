import { spawn } from 'child_process';

async function test() {
  const chrome = spawn('google-chrome-stable', [
    '--headless',
    '--disable-gpu',
    '--window-size=1280,800',
    '--remote-debugging-port=9240',
    'http://localhost:3001/?variant=full'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const res = await fetch('http://127.0.0.1:9240/json');
    const tabs = await res.json();
    const tab = tabs.find(t => t.url.includes('localhost'));
    if (!tab) {
      console.error('No tab found!');
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

    await call('Runtime.enable');
    await call('Page.enable');

    // Wait 3 seconds for loader exit
    console.log('Waiting 3.5s for initial load...');
    await new Promise(r => setTimeout(r, 3500));

    const sceneInfo = await call('Runtime.evaluate', {
      expression: `(() => {
        const s1 = document.getElementById('scene1');
        const s2 = document.getElementById('scene2');
        const sa = document.getElementById('sceneAbout');
        const sc = document.getElementById('sceneContactReveal');
        return {
          windowHeight: window.innerHeight,
          totalScrollHeight: document.documentElement.scrollHeight,
          scene1: s1 ? { top: s1.offsetTop, height: s1.offsetHeight } : null,
          scene2: s2 ? { top: s2.offsetTop, height: s2.offsetHeight } : null,
          sceneAbout: sa ? { top: sa.offsetTop, height: sa.offsetHeight } : null,
          sceneContact: sc ? { top: sc.offsetTop, height: sc.offsetHeight } : null,
          hasLenis: !!window.lenis || !!window.__lenis
        };
      })()`,
      returnByValue: true
    });

    console.log('Scene Information:', JSON.stringify(sceneInfo.result.value, null, 2));

    ws.close();
  } catch (err) {
    console.error('Test error:', err);
  } finally {
    chrome.kill();
  }
}

test();
