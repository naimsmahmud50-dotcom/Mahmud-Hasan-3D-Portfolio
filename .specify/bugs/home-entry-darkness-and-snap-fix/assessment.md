# Bug Assessment: Home Entry Darkness & Abrupt Snap-in Transition

- **Slug**: home-entry-darkness-and-snap-fix
- **Discovered**: 2026-11-03T07:15:00+06:00
- **Severity**: high
- **Status**: confirmed
- **Verdict**: verified

## Symptom

When a user clicks "ENTER IN THE EXPERIENCE" or presses Enter on the landing page, the page remains completely dark for ~1.3 seconds, and then abruptly the home page UI elements pop onto the screen without a smooth cinematic dissolve or camera continuity.

## Reproduction Steps

1. Open `https://naimsmahmud50-dotcom.github.io/` or `http://localhost:3001/?variant=full` in a modern browser.
2. Wait for loader to reach 100% (~1.4s).
3. Click "ENTER IN THE EXPERIENCE".
4. Observe that the loader disappears in ~1.0s, leaving a pitch-black viewport from +1.0s to +2.3s.
5. At +2.3s, the navbar and UI elements snap onto the screen abruptly.

## Root Cause Analysis

1. **Zero Initial Scene Exposure (`E.h = 0`) & Dense Black Fog**:
   In `cloned_site/_next/static/chunks/1361kj0d795e7.js`:
   ```javascript
   o.fromTo(n.fog, { density: .095 }, { density: i.fogDensity, duration: l ? 3 : 1.4 }, 0);
   o.fromTo(E.h, { value: 0 }, { value: 1, duration: l ? 1.8 : .9 }, 0);
   ```
   `E.h` is the scene exposure factor. It starts at `0` (pitch black) and takes 1.8s to ramp up. The fog density starts at `.095` (dense black fog obscuring all 3D meshes). Consequently, when the loader unmounts at 1.0s, the canvas behind it is still completely dark.

2. **2.3-Second Reveal Delay (`S.full = 2.3`)**:
   In `cloned_site/_next/static/chunks/1361kj0d795e7.js`:
   ```javascript
   let S = { full: 2.3, compressed: 1 };
   o.call(O, void 0, S[e]); // O() calls setArrivalSceneRevealed(!0)
   ```
   The navbar and UI visibility in `402p77n-ks3lc.js` depends strictly on `hasArrivalSceneRevealed`. Because `O()` is deferred until 2.3 seconds, the UI elements are held at `opacity: 0; visibility: hidden` until +2.3s, at which point they snap in all at once.

3. **Premature Watchdog Timer in `custom-enhancements.js`**:
   In `cloned_site/custom-enhancements.js`:
   A 1000ms watchdog timer checks if `nav.classList.contains('_rHu7W_visible')`. Since `_rHu7W_visible` only appears at 2.3s, the watchdog triggered a hard `window.location.replace('/lite')` on certain browsers, freezing the page during navigation.

## Proposed Remediation

1. **`cloned_site/_next/static/chunks/1361kj0d795e7.js`**:
   - Change `o.fromTo(E.h, {value: 0}, ...)` to start at `{value: 0.5}` and ramp to `{value: 1}` in 0.8s, eliminating the darkness gap.
   - Reduce initial fog density from `.095` to `.02` so objects are illuminated immediately.
   - Sync `S.full` from `2.3` down to `1.0` seconds so `hasArrivalSceneRevealed(true)` triggers right as the loader finishes exiting, creating a seamless cross-fade into the home page.

2. **`cloned_site/custom-enhancements.js`**:
   - Extend the fail-safe watchdog timer from 1000ms to 4000ms so it never intercepts natural 3D camera animations.

3. **Scope Constraint**:
   - Strictly confine modifications to `1361kj0d795e7.js` and `custom-enhancements.js`. Do not modify any other files or project code.
