# Spec Kit Bug Assessment: Project Slide View Navigation Conflict & Camera Desync

- **Slug**: lite-slide-view-navigation-conflict
- **Reported Date**: 2026-11-08
- **Verdict**: Confirmed Defect & Architectural Timing Conflict

---

## 1. Problem Description
When a user is on the **PROJECT SLIDE VIEW** (`/lite`) page and clicks any other navigation button in the top navbar (`PROJECTS`, `ABOUT`, `CONTACT`, etc.):
1. The site forcefully reloads the entire root homepage (`/?variant=full&glide=...`), throwing the user back to the initial `MAHMUD AI ARCHITECT` loader gate instead of smoothly transitioning.
2. After loading the root page, the auto-glide routine desynchronizes the window scroll offset (`scrollY = 5200`) before the 3D camera and route state machine have finished initializing.
3. When the user enters the 3D experience, the camera violently shakes and glitches between the stone arch (`landing`) and the projects cylinder (`scene2`), leaving the viewport in a broken state with erratic camera jitter ("kapakapi").

---

## 2. Root Cause Analysis

### Root Cause 1: Hard Full-Page Location Assignment
In [cloned_site/custom-enhancements.js](file:///home/mahmud-hasan/Naims%20Project/3d%20portfolio/cloned_site/custom-enhancements.js#L1859):
```javascript
// Button: PROJECTS
if (isRoot3D) {
  dispatch3DRoute('PROJECTS', fallbackY);
} else {
  window.location.assign(base + '/?variant=full&glide=projects');
}
```
Since `/lite` is a standalone route without `#scene1`, `isRoot3D` evaluates to `false`. Clicking `PROJECTS`, `ABOUT`, or `CONTACT` triggers `window.location.assign()`. This completely unmounts the app and forces a full browser refresh to `/`, re-triggering the entire 3D loading lifecycle and intro screen.

### Root Cause 2: Premature Interval Timeout in `setupRouteAutoGlide()`
In [cloned_site/custom-enhancements.js](file:///home/mahmud-hasan/Naims%20Project/3d%20portfolio/cloned_site/custom-enhancements.js#L1263-L1298):
```javascript
const interval = setInterval(() => {
  attempts++;
  ...
  // Auto click loader-enter
  const cta = document.querySelector('button[data-testid="loader-enter"], .y9w63G_cta');
  if (cta) { cta.disabled = false; cta.click(); }
  ...
  if (attempts >= 60 || (routed && attempts >= 15)) {
    clearInterval(interval);
    if (!routed) {
      const y = getFallbackTargetY();
      if (y > 0) window.scrollTo(0, y);
    }
  }
}, 80);
```
- Total timeout is $60 \times 80\text{ms} = 4.8\text{s}$.
- During initial load, React disables the `loader-enter` button until 3D textures, geometries, and Draco modules finish loading (often 2.5–5s on average connections).
- React ignores `.click()` on disabled elements because the click synthetic event listener is inert.
- At 4.8s, `attempts >= 60` clears the interval before assets finish loading.

### Root Cause 3: Premature Scroll Injection (Camera Desync)
When the interval times out without `routed == true`, line 1294 runs:
```javascript
window.scrollTo(0, 5200); // For PROJECTS
```
- This sets `window.scrollY = 5200` while the user is still staring at the `MAHMUD AI ARCHITECT` loader gate with the camera locked at `scene: 'landing'` (origin 0,0,0).
- When the user finally clicks `ENTER IN THE EXPERIENCE`, the 3D camera controller tries to play the arrival sequence from `scene: 'landing'` while `window.scrollY` is already at 5200px.
- The scroll listener, Lenis smooth scroll, and Three.js camera position solver immediately enter a race condition, causing the 3D scene to shake violently ("kapakapi").

---

## 3. Recommended Remediation Plan
1. **Intelligent In-Page Handling on `/lite`**:
   - If the user is on `/lite` and clicks `PROJECTS`, they are already viewing projects. It should smoothly scroll to top (`0`) or navigate to project #1 rather than rebooting the entire site.
   - For `ABOUT` and `CONTACT`, provide either:
     - Direct in-page sliding sections / modal drawers so the user doesn't need to reload the heavy 3D engine.
     - OR, if switching to the 3D version, ensure the transition uses a smooth preloader curtain that waits for 3D readiness before dispatching `__mhRouteStore.request(PROJECTS)` cleanly without raw `window.scrollTo` desync.
2. **Eliminate Raw `window.scrollTo` during Loader**:
   - Never scroll `window.scrollTo(0, y)` while `.y9w63G_loaderContainer` is visible.
   - Only execute route transitions through `window.__mhRouteStore.getState().request(route, 'deeplink')` after the arrival scene has completed.
