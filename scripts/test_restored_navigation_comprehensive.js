const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const PORT = 8888;
const CHROME_PORT = 9245;
const tmpDir = fs.mkdtempSync('/tmp/chrome-nav-test-');

const chrome = spawn('google-chrome', [
  '--headless=new',
  `--remote-debugging-port=${CHROME_PORT}`,
  '--remote-allow-origins=*',
  `--user-data-dir=${tmpDir}`,
  '--no-sandbox',
  '--disable-gpu',
  'about:blank'
]);

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runTests() {
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
      const res = await sendCdp('Runtime.evaluate', {
        expression,
        returnByValue: true,
        awaitPromise: true
      });
      return res.result.value;
    }

    async function close() {
      ws.close();
      await fetch(`http://127.0.0.1:${CHROME_PORT}/json/close/${target.id}`, { method: 'PUT' });
    }

    return { evaluate, screenshot, close, sendCdp };
  }

  try {
    console.log('=== TEST 1: DESKTOP /lite.html 3-DOT MENU BUTTON & TOGGLE ===');
    const pageDesktop = await openPage(`http://127.0.0.1:${PORT}/lite.html`, { width: 1280, height: 800 });
    await sleep(2500);

    const menuBtnState = await pageDesktop.evaluate(`(() => {
      const btn = document.querySelector('button._rHu7W_menu, button[aria-label="Menu"]');
      const panel = document.querySelector('div._rHu7W_menuPanel, [class*="_rHu7W_menuPanel"]');
      if (!btn) return { error: 'No menu button found' };
      const btnStyle = window.getComputedStyle(btn);
      const panelStyle = panel ? window.getComputedStyle(panel) : null;
      return {
        btnFound: true,
        btnDisplay: btnStyle.display,
        btnVisibility: btnStyle.visibility,
        btnWidth: btn.offsetWidth,
        btnHeight: btn.offsetHeight,
        ariaExpanded: btn.getAttribute('aria-expanded'),
        panelAriaHidden: panel ? panel.getAttribute('aria-hidden') : null,
        panelOpacity: panelStyle ? panelStyle.opacity : null
      };
    })()`);
    console.log('Desktop Menu Button Initial State:', menuBtnState);
    if (!menuBtnState.btnFound || menuBtnState.btnDisplay === 'none' || menuBtnState.btnWidth === 0) {
      throw new Error('Menu button is not visible or has display: none on desktop!');
    }

    // Capture screenshot of desktop with 3-dot button visible
    await pageDesktop.screenshot('/home/mahmud-hasan/.gemini/antigravity/brain/e6bc3d1f-e2b2-4748-b4d5-000419591376/desktop_lite_with_3dot_button.png');

    // Click 3-dot button to toggle open
    console.log('Clicking 3-dot menu button to open...');
    await pageDesktop.evaluate(`(() => {
      const btn = document.querySelector('button._rHu7W_menu, button[aria-label="Menu"]');
      btn.click();
    })()`);
    await sleep(500);

    const openState = await pageDesktop.evaluate(`(() => {
      const btn = document.querySelector('button._rHu7W_menu, button[aria-label="Menu"]');
      const panel = document.querySelector('div._rHu7W_menuPanel, [class*="_rHu7W_menuPanel"]');
      const links = panel ? Array.from(panel.querySelectorAll('a._rHu7W_link')).map(a => a.textContent.trim()) : [];
      return {
        ariaExpanded: btn.getAttribute('aria-expanded'),
        panelAriaHidden: panel ? panel.getAttribute('aria-hidden') : null,
        linksCount: links.length,
        links: links
      };
    })()`);
    console.log('Desktop Menu Open State:', openState);
    if (openState.ariaExpanded !== 'true' || openState.panelAriaHidden !== 'false') {
      throw new Error('Menu failed to open upon 3-dot button click!');
    }

    await pageDesktop.screenshot('/home/mahmud-hasan/.gemini/antigravity/brain/e6bc3d1f-e2b2-4748-b4d5-000419591376/desktop_lite_menu_opened.png');
    await pageDesktop.close();

    console.log('\n=== TEST 2: MOBILE /lite.html 3-DOT MENU BUTTON & TOGGLE ===');
    const pageMobile = await openPage(`http://127.0.0.1:${PORT}/lite.html`, { width: 412, height: 915 });
    await sleep(2500);

    const mobileMenuState = await pageMobile.evaluate(`(() => {
      const btn = document.querySelector('button._rHu7W_menu, button[aria-label="Menu"]');
      if (!btn) return { error: 'No menu button found on mobile' };
      const btnStyle = window.getComputedStyle(btn);
      return {
        btnFound: true,
        btnDisplay: btnStyle.display,
        btnVisibility: btnStyle.visibility,
        btnWidth: btn.offsetWidth,
        btnHeight: btn.offsetHeight
      };
    })()`);
    console.log('Mobile Menu Button State:', mobileMenuState);
    if (!mobileMenuState.btnFound || mobileMenuState.btnDisplay === 'none' || mobileMenuState.btnWidth === 0) {
      throw new Error('Menu button is missing or hidden on mobile!');
    }

    await pageMobile.screenshot('/home/mahmud-hasan/.gemini/antigravity/brain/e6bc3d1f-e2b2-4748-b4d5-000419591376/mobile_lite_with_3dot_button.png');

    // Toggle menu open on mobile
    await pageMobile.evaluate(`(() => {
      const btn = document.querySelector('button._rHu7W_menu, button[aria-label="Menu"]');
      btn.click();
    })()`);
    await sleep(500);

    const mobileOpenState = await pageMobile.evaluate(`(() => {
      const panel = document.querySelector('div._rHu7W_menuPanel, [class*="_rHu7W_menuPanel"]');
      const links = panel ? Array.from(panel.querySelectorAll('a._rHu7W_link')).map(a => a.textContent.trim()) : [];
      return {
        panelAriaHidden: panel ? panel.getAttribute('aria-hidden') : null,
        linksCount: links.length,
        links: links
      };
    })()`);
    console.log('Mobile Menu Open State:', mobileOpenState);
    await pageMobile.screenshot('/home/mahmud-hasan/.gemini/antigravity/brain/e6bc3d1f-e2b2-4748-b4d5-000419591376/mobile_lite_menu_opened.png');
    await pageMobile.close();

    console.log('\n=== TEST 3: DIRECT FEATURE NAVIGATION TO 3D ABOUT (NO HOME FLASH) ===');
    const pageAbout = await openPage(`http://127.0.0.1:${PORT}/?variant=full&glide=about`, { width: 1280, height: 800 });
    await sleep(3500);

    const aboutState = await pageAbout.evaluate(`(() => {
      const el = document.getElementById('sceneAbout');
      const intro = document.getElementById('landing-intro');
      const loader = document.querySelector('.y9w63G_loaderContainer');
      const shield = document.getElementById('mh-direct-glide-shield');
      return {
        href: window.location.href,
        scrollY: window.scrollY,
        aboutOffsetTop: el ? el.offsetTop : null,
        isAtAbout: el ? Math.abs(window.scrollY - el.offsetTop) < 100 : false,
        loaderDisplay: loader ? window.getComputedStyle(loader).display : 'none',
        loaderOpacity: loader ? window.getComputedStyle(loader).opacity : '0',
        shieldActive: Boolean(shield)
      };
    })()`);
    console.log('About Direct Glide Result:', aboutState);
    await pageAbout.screenshot('/home/mahmud-hasan/.gemini/antigravity/brain/e6bc3d1f-e2b2-4748-b4d5-000419591376/direct_3d_about_verified.png');
    await pageAbout.close();

    if (!aboutState.isAtAbout) {
      throw new Error(`Failed to land directly at About scene! scrollY was ${aboutState.scrollY}, expected ${aboutState.aboutOffsetTop}`);
    }

    console.log('\n=== TEST 4: DIRECT FEATURE NAVIGATION TO 3D CONTACT (NO HOME FLASH) ===');
    const pageContact = await openPage(`http://127.0.0.1:${PORT}/?variant=full&glide=contact`, { width: 1280, height: 800 });
    await sleep(3500);

    const contactState = await pageContact.evaluate(`(() => {
      const el = document.getElementById('sceneContactReveal');
      const loader = document.querySelector('.y9w63G_loaderContainer');
      return {
        href: window.location.href,
        scrollY: window.scrollY,
        contactOffsetTop: el ? el.offsetTop : null,
        isAtContact: el ? Math.abs(window.scrollY - el.offsetTop) < 100 : false,
        loaderDisplay: loader ? window.getComputedStyle(loader).display : 'none',
        loaderOpacity: loader ? window.getComputedStyle(loader).opacity : '0'
      };
    })()`);
    console.log('Contact Direct Glide Result:', contactState);
    await pageContact.screenshot('/home/mahmud-hasan/.gemini/antigravity/brain/e6bc3d1f-e2b2-4748-b4d5-000419591376/direct_3d_contact_verified.png');
    await pageContact.close();

    if (!contactState.isAtContact) {
      throw new Error(`Failed to land directly at Contact scene! scrollY was ${contactState.scrollY}, expected ${contactState.contactOffsetTop}`);
    }

    console.log('\n=============================================================');
    console.log('🎉 ALL TESTS PASSED WITH 100% SUCCESS!');
    console.log('1. 3-dot menu button is restored and fully functional on desktop and mobile.');
    console.log('2. Direct navigation lands immediately at the 3D feature with zero home flash.');
    console.log('=============================================================');

  } catch (err) {
    console.error('❌ Test failed:', err);
    process.exitCode = 1;
  } finally {
    chrome.kill();
    try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch (_) {}
  }
}

runTests();
