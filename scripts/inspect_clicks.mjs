import fs from 'fs';

async function main() {
  const res = await fetch('http://127.0.0.1:9232/json');
  const tabs = await res.json();
  const tab = tabs.find(t => t.type === 'page');
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

  const inspectClicks = await call('Runtime.evaluate', {
    expression: JSON.stringify(`(() => {
      const clickable = [];
      document.querySelectorAll('a, button, [onclick]').forEach(el => {
        const text = (el.innerText || el.textContent || '').trim().replace(/\\s+/g, ' ');
        if (text.length > 0) {
          clickable.push({
            tag: el.tagName,
            text: text.slice(0, 60),
            href: el.getAttribute('href'),
            classes: el.className
          });
        }
      });
      return clickable;
    })()`),
    returnByValue: false
  });

  // Evaluate directly
  const evalDirect = await call('Runtime.evaluate', {
    expression: `
      Array.from(document.querySelectorAll('a, button')).map(el => ({
        tag: el.tagName,
        text: (el.innerText || el.textContent || '').trim().replace(/\\s+/g, ' ').slice(0, 50),
        href: el.getAttribute('href'),
        classes: el.className
      })).filter(x => x.text.length > 0)
    `,
    returnByValue: true
  });

  console.log('Clickable elements count:', evalDirect.result.value.length);
  console.log('Sample:', JSON.stringify(evalDirect.result.value, null, 2));

  ws.close();
}

main().catch(console.error);
