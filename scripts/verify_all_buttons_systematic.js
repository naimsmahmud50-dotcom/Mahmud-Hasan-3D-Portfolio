const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const PORT = 8892;
const SITE_DIR = path.resolve(__dirname, '../cloned_site');
const ARTIFACTS_DIR = '/home/mahmud-hasan/.gemini/antigravity/brain/e6bc3d1f-e2b2-4748-b4d5-000419591376';

// Static Server
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
  console.log(`Test Server running at http://127.0.0.1:${PORT}`);
  try {
    await runVerification();
    console.log('\n========================================');
    console.log('✅ ALL BUTTON VERIFICATION TESTS PASSED!');
    console.log('========================================');
  } catch (err) {
    console.error('❌ Verification failed:', err);
    process.exitCode = 1;
  } finally {
    server.close();
    process.exit(process.exitCode || 0);
  }
});

async function runVerification() {
  const CHROME_PORT = 9260;
  const tmpDir = fs.mkdtempSync('/tmp/chrome-btn-test-');

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

  async function openPage(url, viewport = { width: 1366, height: 768 }) {
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
    await sendCdp('Runtime.enable');
    await sendCdp('Emulation.setDeviceMetricsOverride', {
      width: viewport.width,
      height: viewport.height,
      deviceScaleFactor: 1,
      mobile: viewport.width <= 768
    });

    await sendCdp('Page.navigate', { url });

    async function evaluate(expression) {
      const { result } = await sendCdp('Runtime.evaluate', {
        expression,
        returnByValue: true
      });
      return result?.value;
    }

    async function screenshot(filePath) {
      const { data } = await sendCdp('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(filePath, Buffer.from(data, 'base64'));
    }

    async function close() {
      try {
        await sendCdp('Page.close');
        ws.close();
      } catch (_) {}
    }

    return { evaluate, screenshot, close, sendCdp };
  }

  // TEST SUITE 1: 3D HOME NAVIGATION
  console.log('\n--- TEST SUITE 1: 3D Home Navbar Buttons ---');
  const home = await openPage(`http://127.0.0.1:${PORT}/index.html?variant=full`, { width: 1366, height: 768 });
  await sleep(2500);

  // Auto-dismiss loader overlay so page is interactive without GPU audio lockup
  await home.evaluate(`(() => {
    const loader = document.querySelector('.y9w63G_loaderContainer, [class*="loaderContainer"]');
    if (loader) {
      loader.style.display = 'none';
      loader.style.pointerEvents = 'none';
    }
  })()`);
  await sleep(500);

  // Check all 7 buttons exist and are visible
  const navSummary = await home.evaluate(`(() => {
    const links = Array.from(document.querySelectorAll('a._rHu7W_link, [class*="_rHu7W_menuPanel"] a')).map(a => ({
      text: (a.textContent || '').trim().replace(/\\s+/g, ' '),
      href: a.getAttribute('href'),
      visible: a.offsetWidth > 0 && a.offsetHeight > 0
    }));
    return { count: links.length, links };
  })()`);
  console.log('Navbar link summary on 3D Home:', JSON.stringify(navSummary, null, 2));
  if (navSummary.count < 7) throw new Error('Expected at least 7 navbar links!');

  // 1.1 Click PROJECTS in 3D Home -> should scroll down to scene1, NOT navigate to /projects
  console.log('\nTesting click on PROJECTS on 3D Home...');
  const projectsRes = await home.evaluate(`(() => {
    const link = Array.from(document.querySelectorAll('a._rHu7W_link, [class*="_rHu7W_menuPanel"] a')).find(a => (a.textContent || '').includes('PROJECTS'));
    if (!link) return { error: 'PROJECTS link not found' };
    const evt = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
    link.dispatchEvent(evt);
    return { clicked: true, defaultPrevented: evt.defaultPrevented };
  })()`);
  console.log('PROJECTS click dispatched:', projectsRes);
  await sleep(1500);
  const projectsScroll = await home.evaluate(`(() => ({
    scrollY: window.scrollY,
    pathname: window.location.pathname
  }))()`);
  console.log('After clicking PROJECTS:', projectsScroll);
  if (projectsScroll.pathname.includes('/projects')) throw new Error('Clicking PROJECTS routed away from 3D Home!');
  if (projectsScroll.scrollY < 300) throw new Error('Clicking PROJECTS did not scroll to projects section!');

  // 1.2 Click ABOUT in 3D Home -> should scroll down to sceneAbout (~9139px)
  console.log('\nTesting click on ABOUT on 3D Home...');
  const aboutRes = await home.evaluate(`(() => {
    const link = Array.from(document.querySelectorAll('a._rHu7W_link, [class*="_rHu7W_menuPanel"] a')).find(a => (a.textContent || '').includes('ABOUT'));
    if (!link) return { error: 'ABOUT not found' };
    const evt = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
    link.dispatchEvent(evt);
    return { clicked: true };
  })()`);
  console.log('ABOUT click dispatched:', aboutRes);
  await sleep(1500);
  const aboutScroll = await home.evaluate(`(() => ({
    scrollY: window.scrollY,
    pathname: window.location.pathname
  }))()`);
  console.log('After clicking ABOUT:', aboutScroll);
  if (aboutScroll.pathname.includes('/about')) throw new Error('Clicking ABOUT routed away from 3D Home!');
  if (aboutScroll.scrollY < 4000) throw new Error('Clicking ABOUT did not scroll to about section!');

  // 1.3 Click CONTACT in 3D Home -> should scroll down to sceneContactReveal (~21934px)
  console.log('\nTesting click on CONTACT on 3D Home...');
  const contactRes = await home.evaluate(`(() => {
    const link = Array.from(document.querySelectorAll('a._rHu7W_link, [class*="_rHu7W_menuPanel"] a')).find(a => (a.textContent || '').includes('CONTACT'));
    if (!link) return { error: 'CONTACT not found' };
    const evt = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
    link.dispatchEvent(evt);
    return { clicked: true };
  })()`);
  console.log('CONTACT click dispatched:', contactRes);
  await sleep(1500);
  const contactScroll = await home.evaluate(`(() => ({
    scrollY: window.scrollY,
    pathname: window.location.pathname
  }))()`);
  console.log('After clicking CONTACT:', contactScroll);
  if (contactScroll.pathname.includes('/contact')) throw new Error('Clicking CONTACT routed away from 3D Home!');
  if (contactScroll.scrollY < 10000) throw new Error('Clicking CONTACT did not scroll to contact section!');

  // 1.4 Click HOME in 3D Home -> should scroll back to top (0)
  console.log('\nTesting click on HOME on 3D Home...');
  const homeRes = await home.evaluate(`(() => {
    const link = Array.from(document.querySelectorAll('a._rHu7W_link, [class*="_rHu7W_menuPanel"] a')).find(a => (a.textContent || '').trim().startsWith('HOME'));
    if (!link) return { error: 'HOME not found' };
    const evt = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
    link.dispatchEvent(evt);
    return { clicked: true };
  })()`);
  console.log('HOME click dispatched:', homeRes);
  await sleep(1500);
  const homeScroll = await home.evaluate(`(() => ({
    scrollY: window.scrollY,
    pathname: window.location.pathname
  }))()`);
  console.log('After clicking HOME:', homeScroll);
  if (homeScroll.scrollY > 500) throw new Error('Clicking HOME did not scroll back to top!');

  // 1.5 Click EXTRA SKILLS in 3D Home -> should open modal popup
  console.log('\nTesting click on EXTRA SKILLS on 3D Home...');
  await home.evaluate(`(() => {
    const link = Array.from(document.querySelectorAll('a._rHu7W_link, [class*="_rHu7W_menuPanel"] a')).find(a => (a.textContent || '').includes('EXTRA SKILLS'));
    const evt = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
    link.dispatchEvent(evt);
  })()`);
  await sleep(500);
  const modalStatus = await home.evaluate(`(() => {
    const m = document.getElementById('mh-my-videos-modal');
    return {
      modalFound: !!m,
      isActive: m ? m.classList.contains('active') : false,
      videosCount: m ? m.querySelectorAll('.mh-vid-card').length : 0
    };
  })()`);
  console.log('After clicking EXTRA SKILLS:', modalStatus);
  if (!modalStatus.isActive || modalStatus.videosCount === 0) throw new Error('Extra Skills modal did not open!');

  // Close modal
  await home.evaluate(`(() => {
    const closeBtn = document.getElementById('mh-videos-modal-close');
    if (closeBtn) closeBtn.click();
  })()`);
  await sleep(300);

  await home.close();

  // TEST SUITE 2: LITE VIEW (PROJECT SLIDE VIEW) NAVIGATION
  console.log('\n--- TEST SUITE 2: Lite View (Slide View) Navbar Buttons ---');
  const lite = await openPage(`http://127.0.0.1:${PORT}/lite.html`, { width: 1366, height: 768 });
  await sleep(2500);

  // 2.1 Click EXTRA SKILLS on Lite -> should open modal without redirecting
  console.log('Testing click on EXTRA SKILLS on Lite View...');
  await lite.evaluate(`(() => {
    const link = Array.from(document.querySelectorAll('a._rHu7W_link, [class*="_rHu7W_menuPanel"] a')).find(a => (a.textContent || '').includes('EXTRA SKILLS'));
    link.click();
  })()`);
  await sleep(500);
  const liteModalStatus = await lite.evaluate(`(() => {
    const m = document.getElementById('mh-my-videos-modal');
    return {
      modalFound: !!m,
      isActive: m ? m.classList.contains('active') : false,
      pathname: window.location.pathname
    };
  })()`);
  console.log('Lite View EXTRA SKILLS modal status:', liteModalStatus);
  if (!liteModalStatus.isActive) throw new Error('Extra Skills modal failed to open on Lite View!');
  if (!liteModalStatus.pathname.includes('/lite')) throw new Error('Lite View navigated away on EXTRA SKILLS click!');

  // Close modal
  await lite.evaluate(`(() => {
    const closeBtn = document.getElementById('mh-videos-modal-close');
    if (closeBtn) closeBtn.click();
  })()`);
  await sleep(300);

  // 2.2 Click PROJECT SLIDE VIEW while on Lite -> should stay on Lite, scroll to 0
  console.log('Testing click on PROJECT SLIDE VIEW on Lite View...');
  await lite.evaluate(`(() => {
    const link = Array.from(document.querySelectorAll('a._rHu7W_link, [class*="_rHu7W_menuPanel"] a')).find(a => (a.textContent || '').includes('PROJECT SLIDE VIEW'));
    link.click();
  })()`);
  await sleep(500);
  const liteSelfStatus = await lite.evaluate(`(() => ({
    scrollY: window.scrollY,
    pathname: window.location.pathname
  }))()`);
  console.log('After clicking PROJECT SLIDE VIEW on Lite:', liteSelfStatus);
  if (!liteSelfStatus.pathname.includes('/lite')) throw new Error('Clicking PROJECT SLIDE VIEW left /lite!');

  await lite.close();

  // TEST SUITE 3: MOBILE LITE VIEW
  console.log('\n--- TEST SUITE 3: Mobile Lite View Responsive Navbar ---');
  const mobileLite = await openPage(`http://127.0.0.1:${PORT}/lite.html`, { width: 375, height: 667 });
  await sleep(2500);
  const mobileNav = await mobileLite.evaluate(`(() => {
    const menuBtn = document.querySelector('button._rHu7W_menu, button[aria-label="Menu"]');
    const links = Array.from(document.querySelectorAll('a._rHu7W_link, [class*="_rHu7W_menuPanel"] a')).map(a => ({
      text: (a.textContent || '').trim().replace(/\\s+/g, ' '),
      visible: a.offsetWidth > 0 && a.offsetHeight > 0
    }));
    return {
      menuBtnHidden: menuBtn ? window.getComputedStyle(menuBtn).display === 'none' : true,
      linksCount: links.length,
      allVisible: links.every(l => l.visible)
    };
  })()`);
  console.log('Mobile Navbar Status:', mobileNav);
  if (!mobileNav.menuBtnHidden) throw new Error('3-dot menu button is not hidden on mobile!');
  if (mobileNav.linksCount < 7) throw new Error('Expected 7 links on mobile!');

  // Click EXTRA SKILLS on mobile
  await mobileLite.evaluate(`(() => {
    const link = Array.from(document.querySelectorAll('a._rHu7W_link, [class*="_rHu7W_menuPanel"] a')).find(a => (a.textContent || '').includes('EXTRA SKILLS'));
    link.click();
  })()`);
  await sleep(500);
  const mobileModal = await mobileLite.evaluate(`(() => {
    const m = document.getElementById('mh-my-videos-modal');
    return {
      isActive: m ? m.classList.contains('active') : false
    };
  })()`);
  console.log('Mobile Extra Skills modal active:', mobileModal.isActive);
  if (!mobileModal.isActive) throw new Error('Extra skills modal failed to open on mobile!');

  await mobileLite.close();
  chrome.kill();
}
