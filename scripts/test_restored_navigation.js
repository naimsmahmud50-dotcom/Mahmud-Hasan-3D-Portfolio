#!/usr/bin/env node
const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const PORT = 8091;
const CHROME_PORT = 9232;
const tmpDir = fs.mkdtempSync('/tmp/chrome-test-profile-');

const MIME = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';
  if (reqPath === '/lite') reqPath = '/lite.html';

  const filePath = path.join(__dirname, '../cloned_site', reqPath);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(PORT, async () => {
  const chrome = spawn('google-chrome', [
    '--headless=new',
    `--remote-debugging-port=${CHROME_PORT}`,
    '--remote-allow-origins=*',
    `--user-data-dir=${tmpDir}`,
    '--no-sandbox',
    '--disable-gpu',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 1500));

  async function testLink(linkText, expectedGlide) {
    const createRes = await fetch(`http://127.0.0.1:${CHROME_PORT}/json/new?http://127.0.0.1:${PORT}/lite`, { method: 'PUT' });
    const target = await createRes.json();
    const ws = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);

    let id = 1;
    function sendCdp(method, params = {}) {
      return new Promise((resolve, reject) => {
        const curId = id++;
        const onMsg = (event) => {
          const data = JSON.parse(event.data);
          if (data.id === curId) {
            ws.removeEventListener('message', onMsg);
            if (data.error) reject(data.error);
            else resolve(data.result);
          }
        };
        ws.addEventListener('message', onMsg);
        ws.send(JSON.stringify({ id: curId, method, params }));
      });
    }

    await new Promise(r => setTimeout(r, 2000));

    // Verify drawers absent
    const hasDrawers = await sendCdp('Runtime.evaluate', {
      expression: `Boolean(document.getElementById('mh-about-drawer') || document.getElementById('mh-contact-drawer'))`,
      returnByValue: true
    });
    if (hasDrawers.result.value) {
      throw new Error('Drawers detected in DOM!');
    }

    // Click target link
    const clickRes = await sendCdp('Runtime.evaluate', {
      expression: `(() => {
        const links = Array.from(document.querySelectorAll('a._rHu7W_link, [class*="_rHu7W_menuPanel"] a'));
        const link = links.find(a => (a.innerText || a.textContent || '').trim().toUpperCase() === '${linkText}');
        if (!link) return { found: false };
        link.click();
        return { found: true };
      })()`,
      returnByValue: true
    });
    console.log(`[${linkText}] Click result:`, clickRes.result.value);

    await new Promise(r => setTimeout(r, 2000));
    const urlRes = await sendCdp('Runtime.evaluate', {
      expression: 'window.location.href',
      returnByValue: true
    });
    const finalUrl = urlRes.result.value;
    console.log(`[${linkText}] Destination URL:`, finalUrl);

    ws.close();
    await fetch(`http://127.0.0.1:${CHROME_PORT}/json/close/${target.id}`, { method: 'PUT' });

    if (!finalUrl.includes(expectedGlide)) {
      throw new Error(`Expected ${expectedGlide} but got ${finalUrl}`);
    }
  }

  try {
    console.log('\n--- 1. Testing ABOUT navigation from /lite ---');
    await testLink('ABOUT', 'glide=about');

    console.log('\n--- 2. Testing CONTACT navigation from /lite ---');
    await testLink('CONTACT', 'glide=contact');

    console.log('\n--- 3. Testing PROJECTS navigation from /lite ---');
    await testLink('PROJECTS', 'glide=projects');

    console.log('\n--- 4. Testing HOME navigation from /lite ---');
    await testLink('HOME', 'variant=full');

    console.log('\n======================================================');
    console.log('✅ ALL NAVIGATION & ROUTING TESTS PASSED 100%!');
    console.log('======================================================');
  } catch (err) {
    console.error('Test error:', err);
    process.exitCode = 1;
  } finally {
    chrome.kill();
    server.close();
    try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch (_) {}
  }
});
