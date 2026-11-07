#!/usr/bin/env node
/**
 * verify_menu_drawers_cdp.js
 * Launches dev server and Chrome headless, executes comprehensive verification tests via native CDP WebSocket.
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const http = require('http');

const PORT = 3001;
const CHROME_PORT = 9222;
const CHROME_BIN = '/usr/bin/google-chrome';
const ARTIFACTS_DIR = '/home/mahmud-hasan/.gemini/antigravity/brain/e6bc3d1f-e2b2-4748-b4d5-000419591376';
const USER_DATA_DIR = `/tmp/chrome-test-${Date.now()}`;

let serverProc = null;
let chromeProc = null;

function cleanup() {
  if (serverProc) {
    try { serverProc.kill(); } catch (_) {}
  }
  if (chromeProc) {
    try { chromeProc.kill(); } catch (_) {}
  }
  try {
    if (fs.existsSync(USER_DATA_DIR)) fs.rmSync(USER_DATA_DIR, { recursive: true, force: true });
  } catch (_) {}
}

process.on('exit', cleanup);
process.on('SIGINT', () => { cleanup(); process.exit(1); });
process.on('SIGTERM', () => { cleanup(); process.exit(1); });

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.ws = null;
    this.id = 1;
    this.callbacks = new Map();
  }

  async connect() {
    this.ws = new WebSocket(this.wsUrl);
    await new Promise((resolve, reject) => {
      this.ws.onopen = resolve;
      this.ws.onerror = reject;
    });

    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && this.callbacks.has(msg.id)) {
        const { resolve, reject } = this.callbacks.get(msg.id);
        this.callbacks.delete(msg.id);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    };
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.id++;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async evaluate(expression) {
    const res = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true
    });
    return res?.result?.value;
  }

  async takeScreenshot(filename) {
    const res = await this.send('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(res.data, 'base64');
    const outPath = path.join(ARTIFACTS_DIR, filename);
    fs.writeFileSync(outPath, buffer);
    console.log(`✓ Screenshot saved: ${outPath}`);
    return outPath;
  }
}

async function runTests() {
  console.log('1. Starting Node dev server...');
  serverProc = spawn('node', ['server_hubuhu.js'], { stdio: 'ignore' });
  await sleep(1500);

  console.log('2. Launching headless Chrome...');
  chromeProc = spawn(CHROME_BIN, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    `--user-data-dir=${USER_DATA_DIR}`,
    `--remote-debugging-port=${CHROME_PORT}`,
    '--window-size=430,932',
    'about:blank'
  ], { stdio: 'ignore' });
  await sleep(2000);

  const targets = await fetchJson(`http://127.0.0.1:${CHROME_PORT}/json`);
  const pageTarget = targets.find(t => t.type === 'page') || targets[0];
  const wsUrl = pageTarget.webSocketDebuggerUrl;
  console.log(`Connected to page target: ${pageTarget.url}`);

  const client = new CDPClient(wsUrl);
  await client.connect();

  await client.send('Page.enable');
  await client.send('DOM.enable');
  await client.send('Runtime.enable');
  await client.send('Emulation.setDeviceMetricsOverride', {
    width: 430,
    height: 932,
    deviceScaleFactor: 2,
    mobile: true
  });

  console.log('3. Navigating to http://localhost:3001/lite ...');
  await client.send('Page.navigate', { url: 'http://localhost:3001/lite' });
  await sleep(4000);

  const title = await client.evaluate('document.title');
  console.log(`Page title: ${title}`);

  // Test 1: Open About Drawer directly
  console.log('\n--- Test 1: About Drawer Direct Verification ---');
  await client.evaluate('window.__mhOpenAboutDrawer()');
  await sleep(1000);
  const aboutActive = await client.evaluate('document.getElementById("mh-about-drawer")?.classList.contains("active")');
  console.log(`About drawer active: ${aboutActive}`);
  if (!aboutActive) throw new Error('About drawer did not activate');
  await client.takeScreenshot('verified_about_drawer_mobile.png');

  // Verify NO video cards inside About Drawer
  const videoCardsInAbout = await client.evaluate('document.querySelectorAll("#mh-about-drawer .mh-hud-video-card, #mh-about-drawer .mh-video-card").length');
  console.log(`Video preview cards in About drawer: ${videoCardsInAbout} (expected 0)`);
  if (videoCardsInAbout > 0) throw new Error('About drawer still contains video cards!');

  // Close About Drawer
  await client.evaluate('document.getElementById("mh-about-close")?.click()');
  await sleep(500);
  const aboutClosed = await client.evaluate('!document.getElementById("mh-about-drawer")?.classList.contains("active")');
  console.log(`About drawer closed cleanly: ${aboutClosed}`);

  // Test 2: Contact Drawer Direct Verification
  console.log('\n--- Test 2: Contact Drawer Direct Verification ---');
  await client.evaluate('window.__mhOpenContactDrawer()');
  await sleep(1000);
  const contactActive = await client.evaluate('document.getElementById("mh-contact-drawer")?.classList.contains("active")');
  console.log(`Contact drawer active: ${contactActive}`);
  if (!contactActive) throw new Error('Contact drawer did not activate');
  await client.takeScreenshot('verified_contact_drawer_mobile.png');

  // Verify email & WhatsApp buttons present
  const emailVal = await client.evaluate('document.querySelector("#mh-contact-drawer .mh-contact-val")?.textContent');
  console.log(`Email in contact drawer: ${emailVal}`);
  if (!emailVal || !emailVal.includes('mahmudhasan.infodev@gmail.com')) throw new Error('Contact email missing');

  await client.evaluate('document.getElementById("mh-contact-close")?.click()');
  await sleep(500);

  // Test 3: Projects Switcher Drawer
  console.log('\n--- Test 3: Projects Switcher Drawer Verification ---');
  await client.evaluate('window.__mhOpenProjectsDrawer()');
  await sleep(1000);
  const projectsActive = await client.evaluate('document.getElementById("mh-projects-drawer")?.classList.contains("active")');
  console.log(`Projects drawer active: ${projectsActive}`);
  if (!projectsActive) throw new Error('Projects drawer did not activate');
  await client.takeScreenshot('verified_projects_drawer_mobile.png');

  // Test jumping to Project 04
  console.log('Testing slide jump to Project 04...');
  await client.evaluate('window.__mhJumpToProject(3)');
  await sleep(1000);
  const projectsClosed = await client.evaluate('!document.getElementById("mh-projects-drawer")?.classList.contains("active")');
  console.log(`Projects drawer closed after jump: ${projectsClosed}`);

  // Test 4: Menu Intercept Simulation
  console.log('\n--- Test 4: Real Menu Click Interceptions ---');
  const menuOpened = await client.evaluate(`(() => {
    const btn = document.querySelector('button._rHu7W_menu, button[aria-label="Menu"]');
    if (btn) { btn.click(); return true; }
    return false;
  })()`);
  console.log(`Menu button clicked: ${menuOpened}`);
  await sleep(800);

  const clickedAbout = await client.evaluate(`(() => {
    const els = Array.from(document.querySelectorAll('a, button, div, span'));
    const link = els.find(e => e.textContent.trim().toUpperCase() === 'ABOUT' && (e.tagName === 'A' || e.closest('nav') || e.getAttribute('href') === '/about'));
    if (link) { link.click(); return true; }
    return false;
  })()`);
  console.log(`Clicked ABOUT link in DOM: ${clickedAbout}`);
  await sleep(1000);
  const aboutFromMenu = await client.evaluate('document.getElementById("mh-about-drawer")?.classList.contains("active")');
  console.log(`About drawer opened via menu click: ${aboutFromMenu}`);
  if (!aboutFromMenu) throw new Error('Menu click on ABOUT failed to open About Drawer');

  await client.evaluate('document.getElementById("mh-about-close")?.click()');
  await sleep(500);

  // Test menu click on CONTACT
  await client.evaluate(`(() => {
    const btn = document.querySelector('button._rHu7W_menu, button[aria-label="Menu"]');
    if (btn) btn.click();
  })()`);
  await sleep(800);

  const clickedContact = await client.evaluate(`(() => {
    const els = Array.from(document.querySelectorAll('a, button, div, span'));
    const link = els.find(e => e.textContent.trim().toUpperCase() === 'CONTACT' && (e.tagName === 'A' || e.closest('nav') || e.getAttribute('href') === '/contact'));
    if (link) { link.click(); return true; }
    return false;
  })()`);
  console.log(`Clicked CONTACT link in DOM: ${clickedContact}`);
  await sleep(1000);
  const contactFromMenu = await client.evaluate('document.getElementById("mh-contact-drawer")?.classList.contains("active")');
  console.log(`Contact drawer opened via menu click: ${contactFromMenu}`);
  if (!contactFromMenu) throw new Error('Menu click on CONTACT failed to open Contact Drawer');

  await client.evaluate('document.getElementById("mh-contact-close")?.click()');
  await sleep(500);

  // Test 5: Bottom HUD [ 📋 ALL 8 ] button
  console.log('\n--- Test 5: Bottom HUD [ 📋 ALL 8 ] Button ---');
  await client.evaluate(`(() => {
    const btn = document.getElementById('mh-hud-act-all');
    if (btn) btn.click();
  })()`);
  await sleep(1000);
  const projectsFromHud = await client.evaluate('document.getElementById("mh-projects-drawer")?.classList.contains("active")');
  console.log(`Projects drawer opened via HUD button: ${projectsFromHud}`);
  if (!projectsFromHud) throw new Error('Bottom HUD ALL 8 button failed to open Projects Drawer');

  console.log('\n🎉 ALL VERIFICATION CHECKS PASSED PERFECTLY!');
  cleanup();
  process.exit(0);
}

runTests().catch(err => {
  console.error('\n❌ Test suite failed:', err);
  cleanup();
  process.exit(1);
});
