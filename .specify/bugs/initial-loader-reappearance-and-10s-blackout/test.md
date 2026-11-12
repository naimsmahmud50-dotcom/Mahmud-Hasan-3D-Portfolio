# Bug Verification Report: Initial Loader Reappearance & 10s Blackout Elimination

**Bug Identifier**: `initial-loader-reappearance-and-10s-blackout`  
**Date**: November 12, 2026  
**Status**: VERIFIED & RESOLVED  

---

## 1. Summary of Bug Symptoms
1. **Initial Enter Screen Reappearance ("prothom j page asto seta abr astache")**:
   - Visiting the portfolio on fresh browser sessions/new tabs caused the static "MAHMUD AI ARCHITECT" enter screen (with ticket card, 0% counter, and "ENTER IN THE EXPERIENCE" button) to briefly appear before JavaScript could dismiss it.
2. **10-Second Blackout Void ("loading ta hoccche sathe black hoye thake pray 10 second ar moto")**:
   - When assets took ~7-10 seconds over real-world mobile/broadband network to download 25MB of 3D KTX2 textures and Draco geometries, the `#mh-fast-init-loader` prematurely vanished at 4.0s (`setTimeout(..., 4000)`).
   - This left the user staring at a pitch black `#141414` uninformative void for 5-6 seconds before 3D rendering kicked in.

---

## 2. Root Cause Analysis
1. In `cloned_site/index.html`:
   - Line 26 checked `var hasEntered = sessionStorage.getItem('mh_entered_experience') === 'true';`.
   - On cold/initial visits, `sessionStorage` has no entry and URL has no `?target=` or `?glide=`.
   - Hence `html.mh-bypass-loader` was not added early in `<head>`, permitting `.y9w63G_loaderContainer` static DOM to render.
2. In `cloned_site/custom-enhancements.js`:
   - Hardcoded 4000ms timeout dismissed `#mh-fast-init-loader` before Three.js canvas finished texture compilation and warmup.
   - `revealLandingInterval` stopped at 4000ms, halting illumination checks before heavy asset download completed.

---

## 3. Remediations Applied
1. **Configurable Bypass in `cloned_site/index.html`**:
   - Added `enterScreenEnabled = false;` toggle directly in early `<head>` script.
   - Automatically injects `mh-bypass-loader` on root visit if `!enterScreenEnabled`.
   - Toggle switch preserved: setting `enterScreenEnabled = true` instantly restores the original enter screen when requested.
2. **Elimination of Premature Blackout in `cloned_site/custom-enhancements.js`**:
   - Replaced arbitrary 4000ms dismiss timeout with continuous canvas/scene readiness polling and generous 16s failsafe.
   - Extended `revealLandingInterval` and `unlockTimer` to 16s to ensure illumination fires as soon as Three.js renders.
   - Created root asset mirrors (`models/`, `textures/`, `datas/`, `envMap/`) for zero-proxy local asset resolution.

---

## 4. Test Results (TDD Suite)
- Test Suite: `tests/loader_bypass_and_blackout_spec.js`
- Executed via `node tests/loader_bypass_and_blackout_spec.js`:
  - ✅ **PASS**: `index.html` bypasses enter screen on fresh visits
  - ✅ **PASS**: `custom-enhancements.js` waits for canvas and landing scene readiness without premature blackout
  - ✅ **PASS**: `MH_BYPASS_INITIAL_ENTER_SCREEN` toggle preserved for instant re-enablement
  - ✅ **PASS**: All core portfolio features preserved intact (Scene 1, Projects carousel, About matrix, Navbar, Clock, Terminal, Video modal)
- Total Failures: 0
