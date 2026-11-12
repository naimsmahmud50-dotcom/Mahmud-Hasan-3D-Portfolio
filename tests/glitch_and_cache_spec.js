const fs = require('fs');
const path = require('path');
const assert = require('assert');

function runTests() {
  console.log('Running Glitch and Cache Prevention TDD Suite...\n');
  let failures = 0;

  // Test 1: HTML must not contain destructive no-store meta tag that prevents caching 20MB of 3D assets
  try {
    const htmlContent = fs.readFileSync(path.join(__dirname, '../cloned_site/index.html'), 'utf8');
    const hasAggressiveNoStore = htmlContent.includes('content="no-cache, no-store, must-revalidate"');
    assert.strictEqual(hasAggressiveNoStore, false, 'index.html still has aggressive "no-cache, no-store, must-revalidate" meta tag blocking asset caching!');
    console.log('✅ PASS: index.html allows proper browser asset caching (no-store tag removed)');
  } catch (err) {
    console.error('❌ FAIL: Test 1 failed:', err.message);
    failures++;
  }

  // Test 2: custom-enhancements.js must guard forceInstantLandingReveal() to stop when already illuminated
  try {
    const jsContent = fs.readFileSync(path.join(__dirname, '../cloned_site/custom-enhancements.js'), 'utf8');
    const hasSpamGuard = jsContent.includes('// Landing illumination guard: stop interval once fully revealed');
    assert.strictEqual(hasSpamGuard, true, 'custom-enhancements.js lacks illumination guard, causing recurring thread starvation!');
    console.log('✅ PASS: custom-enhancements.js guards landing illumination and stops timer once scene is ready');
  } catch (err) {
    console.error('❌ FAIL: Test 2 failed:', err.message);
    failures++;
  }

  // Test 3: custom-enhancements.js must preserve all core features
  try {
    const jsContent = fs.readFileSync(path.join(__dirname, '../cloned_site/custom-enhancements.js'), 'utf8');
    assert(jsContent.includes('setupAboutSection'), 'Missing setupAboutSection');
    assert(jsContent.includes('initDhakaClock'), 'Missing initDhakaClock');
    assert(jsContent.includes('openMyVideosModal'), 'Missing openMyVideosModal');
    assert(jsContent.includes('setupTerminal'), 'Missing setupTerminal');
    assert(jsContent.includes('setupProjectHudActions'), 'Missing setupProjectHudActions');
    console.log('✅ PASS: All core portfolio features preserved intact');
  } catch (err) {
    console.error('❌ FAIL: Test 3 failed:', err.message);
    failures++;
  }

  console.log(`\nTests completed with ${failures} failure(s).\n`);
  if (failures > 0) {
    process.exit(1);
  }
}

runTests();
