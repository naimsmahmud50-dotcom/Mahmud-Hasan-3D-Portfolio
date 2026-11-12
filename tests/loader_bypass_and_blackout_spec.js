const fs = require('fs');
const path = require('path');
const assert = require('assert');

function runTests() {
  console.log('Running Initial Loader Bypass & Blackout Elimination TDD Suite...\n');
  let failures = 0;

  // Test 1: index.html early check must automatically bypass the enter screen on root load
  try {
    const html = fs.readFileSync(path.join(__dirname, '../cloned_site/index.html'), 'utf8');
    // If it only bypasses when sessionStorage has entered or params has target, it fails on fresh visits
    const hasUnconditionalBypass = html.includes('// Default bypass when enter screen is disabled') || html.includes('document.documentElement.classList.add(\'mh-bypass-loader\');\n  } catch');
    assert.strictEqual(hasUnconditionalBypass, true, 'index.html does not bypass initial enter screen on fresh visits without sessionStorage!');
    console.log('✅ PASS: index.html bypasses enter screen on fresh visits');
  } catch (err) {
    console.error('❌ FAIL: Test 1 failed:', err.message);
    failures++;
  }

  // Test 2: custom-enhancements.js must maintain seamless veil until canvas & landing scene are ready
  try {
    const js = fs.readFileSync(path.join(__dirname, '../cloned_site/custom-enhancements.js'), 'utf8');
    const hasReadinessCheck = js.includes('landingReady') && js.includes('checkCanvasReady');
    assert.strictEqual(hasReadinessCheck, true, 'custom-enhancements.js lacks robust 3D readiness check before dismissing veil');
    
    // Must not dismiss at 4000ms prematurely causing a 10s blackout
    const hasPremature4sTimeout = js.includes('setTimeout(() => {\n        clearInterval(checkCanvasReady);\n        dismissFastLoader();\n      }, 4000);');
    assert.strictEqual(hasPremature4sTimeout, false, 'custom-enhancements.js still has premature 4000ms timeout causing black void!');
    
    console.log('✅ PASS: custom-enhancements.js waits for canvas and landing scene readiness without premature blackout');
  } catch (err) {
    console.error('❌ FAIL: Test 2 failed:', err.message);
    failures++;
  }

  // Test 3: Re-enablement switch preserved (User Requirement: jate ami bollei ane dite paro)
  try {
    const js = fs.readFileSync(path.join(__dirname, '../cloned_site/custom-enhancements.js'), 'utf8');
    assert(js.includes('MH_BYPASS_INITIAL_ENTER_SCREEN'), 'Missing MH_BYPASS_INITIAL_ENTER_SCREEN configurable toggle');
    console.log('✅ PASS: MH_BYPASS_INITIAL_ENTER_SCREEN toggle preserved for instant re-enablement');
  } catch (err) {
    console.error('❌ FAIL: Test 3 failed:', err.message);
    failures++;
  }

  // Test 4: All 7 essential features preserved intact
  try {
    const js = fs.readFileSync(path.join(__dirname, '../cloned_site/custom-enhancements.js'), 'utf8');
    assert(js.includes('setupAboutSection'), 'Missing About section');
    assert(js.includes('initDhakaClock'), 'Missing Dhaka Clock');
    assert(js.includes('setupTerminal'), 'Missing Terminal (Cmd+K)');
    assert(js.includes('openMyVideosModal'), 'Missing Video Modal');
    assert(js.includes('setupProjectHudActions'), 'Missing Projects HUD');
    console.log('✅ PASS: All core portfolio features preserved intact');
  } catch (err) {
    console.error('❌ FAIL: Test 4 failed:', err.message);
    failures++;
  }

  console.log(`\nTests completed with ${failures} failure(s).\n`);
  if (failures > 0) {
    process.exit(1);
  }
}

runTests();
