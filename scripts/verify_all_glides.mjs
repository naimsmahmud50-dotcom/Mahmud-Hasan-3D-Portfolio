import { spawn } from 'child_process';
import fs from 'fs';

const CHROME_PORT = 9300;

function createCDPCaller(ws) {
  let id = 1;
  const pending = new Map();
  ws.onmessage = (e) => {
    try {
      const m = JSON.parse(e.data);
      if (m.id && pending.has(m.id)) {
        const p = pending.get(m.id);
        pending.delete(m.id);
        if (m.error) p.reject(m.error);
        else p.resolve(m.result);
      }
    } catch (_) {}
  };
  return (method, params = {}) => new Promise((resolve, reject) => {
    const mid = id++;
    pending.set(mid, { resolve, reject });
    ws.send(JSON.stringify({ id: mid, method, params }));
  });
}

async function testUrl(url, label) {
  const tmpDir = fs.mkdtempSync('/tmp/chrome-glide-');
  const chrome = spawn('google-chrome', [
    '--headless=new',
    `--remote-debugging-port=${CHROME_PORT}`,
    '--remote-allow-origins=*',
    `--user-data-dir=${tmpDir}`,
    '--no-sandbox',
    '--disable-gpu',
    url
  ]);

  await new Promise(r => setTimeout(r, 1800));

  try {
    const res = await fetch(`http://127.0.0.1:${CHROME_PORT}/json`);
    const tabs = await res.json();
    const tab = tabs.find(t => t.url && t.url.includes('3001'));
    if (!tab) throw new Error('No page tab found');
    const ws = new WebSocket(tab.webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);
    const call = createCDPCaller(ws);

    await call('Page.enable');
    await call('Runtime.enable');
    await call('Emulation.setDeviceMetricsOverride', {
      width: 1280,
      height: 800,
      deviceScaleFactor: 1,
      mobile: false
    });

    await new Promise(r => setTimeout(r, 3200));

    const evalResult = await call('Runtime.evaluate', {
      expression: `(() => {
        const dot = document.querySelector('button._rHu7W_menu, button[aria-label="Menu"]');
        const dotVisible = dot ? (window.getComputedStyle(dot).display !== 'none' && dot.offsetWidth > 0) : false;
        const links = Array.from(document.querySelectorAll('a._rHu7W_link')).map(a => a.innerText.trim());
        return {
          scrollY: window.scrollY,
          dotVisible,
          links
        };
      })()`,
      returnByValue: true
    });

    console.log(`[${label}]:`, evalResult.result.value);
    ws.close();
    return evalResult.result.value;
  } finally {
    chrome.kill();
    try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch (_) {}
  }
}

async function main() {
  console.log('Testing all glides and routes systematically...');
  const proj = await testUrl('http://127.0.0.1:3001/?variant=full&glide=projects', 'PROJECTS GLIDE');
  const about = await testUrl('http://127.0.0.1:3001/?variant=full&glide=about', 'ABOUT GLIDE');
  const contact = await testUrl('http://127.0.0.1:3001/?variant=full&glide=contact', 'CONTACT GLIDE');
  const lite = await testUrl('http://127.0.0.1:3001/lite', 'LITE VIEW');

  console.log('\n--- VERIFICATION SUMMARY ---');
  console.log('1. Projects scrollY:', proj.scrollY, '(Expected ~5479px, >= 4500px):', proj.scrollY >= 4500 ? 'PASS' : 'FAIL');
  console.log('2. About scrollY:', about.scrollY, '(Expected >= 6000px):', about.scrollY >= 6000 ? 'PASS' : 'FAIL');
  console.log('3. Contact scrollY:', contact.scrollY, '(Expected >= 12000px):', contact.scrollY >= 12000 ? 'PASS' : 'FAIL');
  console.log('4. 3-Dot Hidden across all:', (!proj.dotVisible && !about.dotVisible && !contact.dotVisible && !lite.dotVisible) ? 'PASS' : 'FAIL');
  console.log('5. Inline Links Present:', proj.links.includes('PROJECTS') && proj.links.includes('ABOUT') && proj.links.includes('CONTACT') ? 'PASS' : 'FAIL');
}

main().catch(console.error);
