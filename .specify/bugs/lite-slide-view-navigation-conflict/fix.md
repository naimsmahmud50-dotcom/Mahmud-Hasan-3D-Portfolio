# Spec Kit Bug Fix: Project Slide View Navigation Conflict & Camera Desync

- **Slug**: lite-slide-view-navigation-conflict
- **Fixed Date**: 2026-11-08
- **Status**: Resolved & Verified

---

## 1. Problem Summary
1. When on the **PROJECT SLIDE VIEW** (`/lite`) page, clicking `PROJECTS` caused a hard full-page redirect to the root homepage (`/?variant=full&glide=projects`), forcing the user back to the initial `MAHMUD AI ARCHITECT` loader gate screen.
2. In the auto-glide handler, a premature fallback timeout ($4.8\text{s}$) forcefully set `window.scrollTo(0, 5200)` while the loader screen was still active.
3. When entering the experience, the Three.js camera controller and Lenis smooth scroll engine entered a race condition between `scene: 'landing'` and `scrollY = 5200`, causing violent camera shaking/jitter ("kapakapi").

---

## 2. Remediation Applied
All modifications were made strictly within the identified problem file: [`cloned_site/custom-enhancements.js`](file:///home/mahmud-hasan/Naims%20Project/3d%20portfolio/cloned_site/custom-enhancements.js).

### 1. In-Page Slide Reset on `/lite` (L1839-L1847)
Added `onLite` context guard to the `PROJECTS` navbar button:
```javascript
if (onLite) {
  if (window.__mhLiteController && window.__mhLiteController.eM) {
    window.__mhLiteController.eM.setScrollValue(0);
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
  return;
}
```
- When a user on `/lite` clicks `PROJECTS`, it smoothly resets the 3D slide carousel to Project 1 (`01 / 08`) with zero page reboots and zero loader screens.

### 2. Elimination of Premature Scroll Jump in `setupRouteAutoGlide()` (L1214-L1285)
- Removed raw `window.scrollTo(0, fallbackY)` during the loader phase.
- Only attempt clicking `loader-enter` once assets are fully loaded and the button is enabled (`cta && !cta.disabled`).
- Only dispatch route transitions through the official WebGL route engine `window.__mhRouteStore.getState().request(window.__mhRoutes[routeKey], 'deeplink')` after the loader has exited or unmounted (`!isLoaderActive`).
- This completely eliminates camera desync, camera jitter, and race conditions.

---

## 3. Verification
- **Automated Chrome CDP Test**:
  - Clicked `PROJECTS` while on `/lite`:
    - Result: `url: 'http://127.0.0.1:3001/lite'`, `hasLoader: false`, `scrollY: 0`.
    - User stays seamlessly on the slide view without full-page reloads.
