# Spec Kit Bug Fix: Navbar Inline Links & 3D Navigation Overhaul

## 1. Applied Changes

### A. `cloned_site/custom-enhancements.css`
1. Replaced all occurrences of `._rHu7W_iconButton._rHu7W_menu` with `display: none !important; pointer-events: none !important; visibility: hidden !important; width: 0 !important; height: 0 !important; margin: 0 !important; padding: 0 !important; opacity: 0 !important;`.
2. Ensured `div._rHu7W_menuPanel` is permanently displayed inline with `display: flex !important; flex-direction: row !important; align-items: center !important; position: static !important;`.
3. Preserved responsive horizontal scrolling (`overflow-x: auto`) for screens under 768px without showing any hamburger / 3-dot button.

### B. `cloned_site/custom-enhancements.js`
1. Implemented unified capture-phase click handler on `document.addEventListener('click', ..., true)`:
   - **HOME**: In 3D root, exits interior and scrolls to `0`; elsewhere routes to `/?variant=full`.
   - **PROJECTS**: In 3D root, exits interior and scrolls to `scene1` (`window.innerHeight * 1.0` or offsetTop); from `/lite`, navigates to `/?variant=full&glide=projects`.
   - **ABOUT**: In 3D root, exits interior and scrolls to `sceneAbout` (`5867px` or `Math.round(h * 11.9)`); from `/lite`, navigates to `/?variant=full&glide=about`.
   - **CONTACT**: In 3D root, exits interior and scrolls to `sceneContactReveal` (`14080px` or `Math.round(h * 28.56)`); from `/lite`, navigates to `/?variant=full&glide=contact`.
   - **EXTRA SKILLS**: Directly opens `openMyVideosModal()` on all pages with no dead `#` hash traps or blank tabs.
   - **PROJECT SLIDE VIEW**: Scrolls to top on `/lite`; from 3D Home navigates to `/lite`.
   - **GITHUB REPO**: Opens `https://github.com/naimsmahmud50-dotcom` in new tab.
2. Implemented `scroll3DTarget(targetY)` with automatic 150ms fallback to ensure deterministic scroll coordinate positioning.
3. Added auto-redirect for static fallbacks (`/about`, `/contact`, `/projects`) to redirect to `/?variant=full&glide=...`.
