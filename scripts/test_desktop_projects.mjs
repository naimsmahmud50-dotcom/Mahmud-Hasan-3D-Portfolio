import fs from 'fs';

async function main() {
  const res = await fetch('http://127.0.0.1:9232/json');
  const tabs = await res.json();
  const tab = tabs.find(t => t.type === 'page');
  if (!tab) {
    console.log('No page tab found');
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
  await call('Emulation.setDeviceMetricsOverride', {
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
    mobile: false
  });

  console.log('Navigating to http://127.0.0.1:3001/lite ...');
  await call('Page.navigate', { url: 'http://127.0.0.1:3001/lite' });
  await new Promise(r => setTimeout(r, 2500));

  const liteData = await call('Runtime.evaluate', {
    expression: `(() => {
      // Find cards and links
      const cards = Array.from(document.querySelectorAll('article, [class*="card"]')).map(el => {
        const title = el.querySelector('h2, h3, h4')?.innerText || '';
        const links = Array.from(el.querySelectorAll('a, button')).map(a => ({
          text: a.innerText.trim(),
          href: a.getAttribute('href')
        }));
        return { title, links };
      });
      return { cardsCount: cards.length, sampleCards: cards.slice(0, 5) };
    })()`,
    returnByValue: true
  });
  console.log('Lite Data:', JSON.stringify(liteData.result.value, null, 2));

  // Now inspect the 3D desktop site
  console.log('Navigating to http://127.0.0.1:3001/projects ...');
  await call('Page.navigate', { url: 'http://127.0.0.1:3001/projects' });
  await new Promise(r => setTimeout(r, 3500));

  const hudInfo = await call('Runtime.evaluate', {
    expression: `(() => {
      const enterBtn = document.querySelector('button[data-testid="loader-enter"], .y9w63G_cta');
      if (enterBtn) enterBtn.click();
      return { hasEnter: !!enterBtn };
    })()`,
    returnByValue: true
  });
  console.log('Clicked enter:', hudInfo.result.value);

  await new Promise(r => setTimeout(r, 2500));

  const hudCheck = await call('Runtime.evaluate', {
    expression: `(() => {
      const hud = document.querySelector('.zaNkXW_root, [class*="zaNkXW_root"]');
      const title = document.querySelector('.zaNkXW_title, [class*="zaNkXW_title"]');
      const discoverBtn = document.querySelector('.zaNkXW_button, [class*="zaNkXW_button"]');
      const quick = document.getElementById('mh-hud-quick-actions');
      const quickBtns = quick ? Array.from(quick.querySelectorAll('a')).map(a => ({
        text: a.innerText.trim(),
        href: a.href,
        display: window.getComputedStyle(a).display,
        pointerEvents: window.getComputedStyle(a).pointerEvents
      })) : [];

      return {
        hudFound: !!hud,
        title: title ? title.innerText.trim() : null,
        discoverBtn: discoverBtn ? {
          text: discoverBtn.innerText.trim(),
          display: window.getComputedStyle(discoverBtn).display,
          opacity: window.getComputedStyle(discoverBtn).opacity
        } : null,
        quickFound: !!quick,
        quickBtns
      };
    })()`,
    returnByValue: true
  });
  console.log('3D HUD State:', JSON.stringify(hudCheck.result.value, null, 2));

  const scr = await call('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('/home/mahmud-hasan/.gemini/antigravity/brain/e6bc3d1f-e2b2-4748-b4d5-000419591376/desktop_projects_screen.png', Buffer.from(scr.data, 'base64'));
  console.log('Saved screenshot desktop_projects_screen.png');

  ws.close();
}

main().catch(console.error);
