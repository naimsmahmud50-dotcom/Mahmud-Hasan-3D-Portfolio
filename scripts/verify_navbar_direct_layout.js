const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const PORT = 8888;
const SITE_DIR = path.resolve(__dirname, '../cloned_site');
const ARTIFACTS_DIR = '/home/mahmud-hasan/.gemini/antigravity/brain/e6bc3d1f-e2b2-4748-b4d5-000419591376';

// 1. Simple static server
const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';
  if (reqPath === '/lite') reqPath = '/lite.html';
  if (reqPath === '/about') reqPath = '/about.html';
  if (reqPath === '/contact') reqPath = '/contact.html';
  if (reqPath === '/projects') reqPath = '/projects.html';

  let filePath = path.join(SITE_DIR, reqPath);
  if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) {
    filePath += '.html';
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    let contentType = 'text/plain';
    if (filePath.endsWith('.html')) contentType = 'text/html';
    else if (filePath.endsWith('.css')) contentType = 'text/css';
    else if (filePath.endsWith('.js')) contentType = 'application/javascript';
    else if (filePath.endsWith('.json')) contentType = 'application/json';
    else if (filePath.endsWith('.png')) contentType = 'image/png';
    else if (filePath.endsWith('.svg')) contentType = 'image/svg+xml';
    else if (filePath.endsWith('.ico')) contentType = 'image/x-icon';

    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(PORT, async () => {
  console.log(`Server listening on http://127.0.0.1:${PORT}`);
  await runVerification();
  server.close();
  process.exit(0);
});

async function runVerification() {
  const CHROME_PORT = 9255;
  const tmpDir = fs.mkdtempSync('/tmp/chrome-direct-nav-');

  const chrome = spawn('google-chrome', [
    '--headless=new',
    `--remote-debugging-port=${CHROME_PORT}`,
    '--remote-allow-origins=*',
    `--user-data-dir=${tmpDir}`,
    '--no-sandbox',
    '--disable-gpu',
    'about:blank'
  ]);

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  await sleep(1500);

  async function openPage(url, viewport = { width: 1280, height: 800 }) {
    const res = await fetch(`http://127.0.0.1:${CHROME_PORT}/json/new`, { method: 'PUT' });
    const target = await res.json();
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

    await sendCdp('Page.enable');
    await sendCdp('Emulation.setDeviceMetricsOverride', {
      width: viewport.width,
      height: viewport.height,
      deviceScaleFactor: 1,
      mobile: viewport.width <= 768
    });

    await sendCdp('Page.navigate', { url });

    async function screenshot(filePath) {
      const { data } = await sendCdp('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(filePath, Buffer.from(data, 'base64'));
      console.log(`Saved screenshot: ${filePath}`);
    }

    async function evaluate(expression) {
      const r = await sendCdp('Runtime.evaluate', {
        expression,
        returnByValue: true,
        awaitPromise: true
      });
      return r.result.value;
    }

    async function close() {
      ws.close();
      await fetch(`http://127.0.0.1:${CHROME_PORT}/json/close/${target.id}`, { method: 'PUT' });
    }

    return { evaluate, screenshot, close, sendCdp };
  }

  try {
    console.log('\n--- 1. Testing Desktop Lite View (Slide View) ---');
    const liteDesktop = await openPage(`http://127.0.0.1:${PORT}/lite.html`, { width: 1366, height: 768 });
    await sleep(2500);

    const desktopState = await liteDesktop.evaluate(`(() => {
      const menuBtn = document.querySelector('button._rHu7W_menu, button[aria-label="Menu"]');
      const menuPanel = document.querySelector('div._rHu7W_menuPanel, [class*="_rHu7W_menuPanel"]');
      const links = Array.from(document.querySelectorAll('a._rHu7W_link, [class*="_rHu7W_menuPanel"] a')).map(a => ({
        text: (a.textContent || '').trim().replace(/\\s+/g, ' '),
        href: a.getAttribute('href'),
        visible: a.offsetWidth > 0 && a.offsetHeight > 0,
        rect: { x: Math.round(a.getBoundingClientRect().x), y: Math.round(a.getBoundingClientRect().y), w: Math.round(a.getBoundingClientRect().width), h: Math.round(a.getBoundingClientRect().height) }
      }));
      const soundBtn = document.querySelector('._rHu7W_sound');
      const availWrap = document.querySelector('._rHu7W_availabilityWrap');

      return {
        menuBtnDisplay: menuBtn ? window.getComputedStyle(menuBtn).display : 'not_found',
        menuPanelDisplay: menuPanel ? window.getComputedStyle(menuPanel).display : 'not_found',
        linksCount: links.length,
        links,
        soundRect: soundBtn ? { x: Math.round(soundBtn.getBoundingClientRect().x), y: Math.round(soundBtn.getBoundingClientRect().y) } : null,
        availRect: availWrap ? { x: Math.round(availWrap.getBoundingClientRect().x), y: Math.round(availWrap.getBoundingClientRect().y) } : null
      };
    })()`);

    console.log('Desktop Lite State:', JSON.stringify(desktopState, null, 2));
    await liteDesktop.screenshot(path.join(ARTIFACTS_DIR, 'desktop_lite_direct_navbar.png'));
    await liteDesktop.close();

    console.log('\n--- 2. Testing Mobile Lite View ---');
    const liteMobile = await openPage(`http://127.0.0.1:${PORT}/lite.html`, { width: 412, height: 915 });
    await sleep(2500);

    const mobileState = await liteMobile.evaluate(`(() => {
      const menuBtn = document.querySelector('button._rHu7W_menu, button[aria-label="Menu"]');
      const menuPanel = document.querySelector('div._rHu7W_menuPanel, [class*="_rHu7W_menuPanel"]');
      const links = Array.from(document.querySelectorAll('a._rHu7W_link, [class*="_rHu7W_menuPanel"] a')).map(a => ({
        text: (a.textContent || '').trim().replace(/\\s+/g, ' '),
        href: a.getAttribute('href'),
        visible: a.offsetWidth > 0 && a.offsetHeight > 0,
        rect: { x: Math.round(a.getBoundingClientRect().x), y: Math.round(a.getBoundingClientRect().y), w: Math.round(a.getBoundingClientRect().width), h: Math.round(a.getBoundingClientRect().height) }
      }));

      return {
        menuBtnDisplay: menuBtn ? window.getComputedStyle(menuBtn).display : 'not_found',
        linksCount: links.length,
        links
      };
    })()`);

    console.log('Mobile Lite State:', JSON.stringify(mobileState, null, 2));
    await liteMobile.screenshot(path.join(ARTIFACTS_DIR, 'mobile_lite_direct_navbar.png'));
    await liteMobile.close();

    console.log('\n--- 3. Testing Desktop Home Direct Navbar ---');
    const homeDesktop = await openPage(`http://127.0.0.1:${PORT}/index.html`, { width: 1366, height: 768 });
    await sleep(3500);

    const homeDesktopState = await homeDesktop.evaluate(`(() => {
      const menuBtn = document.querySelector('button._rHu7W_menu, button[aria-label="Menu"]');
      const links = Array.from(document.querySelectorAll('a._rHu7W_link, [class*="_rHu7W_menuPanel"] a')).map(a => ({
        text: (a.textContent || '').trim().replace(/\\s+/g, ' '),
        href: a.getAttribute('href'),
        visible: a.offsetWidth > 0 && a.offsetHeight > 0,
        rect: { x: Math.round(a.getBoundingClientRect().x), y: Math.round(a.getBoundingClientRect().y), w: Math.round(a.getBoundingClientRect().width), h: Math.round(a.getBoundingClientRect().height) }
      }));

      return {
        menuBtnDisplay: menuBtn ? window.getComputedStyle(menuBtn).display : 'not_found',
        linksCount: links.length,
        links
      };
    })()`);

    console.log('Home Desktop State:', JSON.stringify(homeDesktopState, null, 2));
    await homeDesktop.screenshot(path.join(ARTIFACTS_DIR, 'desktop_home_direct_navbar.png'));

    console.log('\n--- 4. Testing Direct 3D Navigation from Lite to About ---');
    // Simulate clicking ABOUT from lite view:
    // Lite view link for ABOUT is /?variant=full&glide=about
    const directAboutPage = await openPage(`http://127.0.0.1:${PORT}/?variant=full&glide=about`, { width: 1366, height: 768 });
    await sleep(3500);
    const aboutSceneState = await directAboutPage.evaluate(`(() => {
      const sceneAbout = document.getElementById('sceneAbout');
      const intro = document.getElementById('landing-intro');
      const shield = document.getElementById('mh-direct-glide-shield');
      return {
        sceneAboutFound: !!sceneAbout,
        sceneAboutTop: sceneAbout ? Math.round(sceneAbout.getBoundingClientRect().top) : null,
        introDisplay: intro ? window.getComputedStyle(intro).display : null,
        shieldDisplay: shield ? window.getComputedStyle(shield).display : null,
        scrollY: window.scrollY
      };
    })()`);
    console.log('Direct About 3D State:', JSON.stringify(aboutSceneState, null, 2));
    await directAboutPage.screenshot(path.join(ARTIFACTS_DIR, 'direct_about_3d_verified.png'));
    await directAboutPage.close();

    console.log('\n--- 5. Testing Direct 3D Navigation from Lite to Contact ---');
    const directContactPage = await openPage(`http://127.0.0.1:${PORT}/?variant=full&glide=contact`, { width: 1366, height: 768 });
    await sleep(3500);
    const contactSceneState = await directContactPage.evaluate(`(() => {
      const sceneContact = document.getElementById('sceneContactReveal') || document.getElementById('sceneContact');
      const intro = document.getElementById('landing-intro');
      return {
        sceneContactFound: !!sceneContact,
        sceneContactTop: sceneContact ? Math.round(sceneContact.getBoundingClientRect().top) : null,
        introDisplay: intro ? window.getComputedStyle(intro).display : null,
        scrollY: window.scrollY
      };
    })()`);
    console.log('Direct Contact 3D State:', JSON.stringify(contactSceneState, null, 2));
    await directContactPage.screenshot(path.join(ARTIFACTS_DIR, 'direct_contact_3d_verified.png'));
    await directContactPage.close();

    await homeDesktop.close();
  } catch (err) {
    console.error('Test error:', err);
  } finally {
    chrome.kill('SIGKILL');
  }
}
