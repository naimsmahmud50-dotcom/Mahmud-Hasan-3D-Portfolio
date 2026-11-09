# Spec Kit Bug Fix: Project Slide View Navigation Conflict & Camera Desync

- **Slug**: lite-slide-view-navigation-conflict
- **Fixed Date**: 2026-11-09
- **Status**: Completely Resolved & End-to-End Verified

---

## 1. Problem Summary & User Requirements
1. **Feature Separation**:
   - `PROJECT SLIDE VIEW` (`/lite`) is a dedicated 2D slide view feature.
   - `PROJECTS` in the navigation bar is the 3D Projects Cylinder feature (`scene2`).
   - Clicking `PROJECTS` from `/lite` must transition the user directly to the 3D Projects Cylinder without trapping them on the slide view.
   - Clicking `ABOUT` must transition to 3D About (`sceneAbout`).
   - Clicking `CONTACT` must transition to 3D Contact (`sceneContactReveal`).
   - Clicking `HOME` must transition to 3D Home (`landing` arch).
   - Clicking `PROJECT SLIDE VIEW` from the 3D experience must transition back to `/lite`.
2. **Strict Loader Rule**:
   - The initial `MAHMUD AI ARCHITECT` loader gate with "ENTER IN THE EXPERIENCE" must appear **ONLY ONCE** upon initial arrival in a browsing session.
   - It must **NEVER** re-appear when transitioning between `/lite` and the 3D experience or navigating between sections.
3. **Camera Stability**:
   - Zero camera desync, zero flickering, and zero jitter ("kapakapi").

---

## 2. Root Cause & Architectural Resolution

### 1. Persistent Session Bypass & Loader Unmount Guard
- **In [`cloned_site/_next/static/chunks/3-0-2h2vnc5wo.js`](file:///home/mahmud-hasan/Naims%20Project/3d%20portfolio/cloned_site/_next/static/chunks/3-0-2h2vnc5wo.js)**:
  - Augmented the loader render guard `L`:
    ```javascript
    L = "lite" === e || ("u" < typeof window && (
      window.location.pathname.startsWith("/lite") ||
      window.location.search.includes("variant=lite") ||
      (function(){
        try {
          return sessionStorage.getItem("mh_entered_experience") === "true" ||
                 new URLSearchParams(window.location.search).has("target") ||
                 new URLSearchParams(window.location.search).has("glide") ||
                 !!sessionStorage.getItem("mh_target_scene");
        } catch(_) { return false; }
      })()
    ));
    ```
  - When `L` is true, the React component immediately runs `ei(!0), en(!0), es(u.f.loader), eo(!0)` and returns `null`. The loader DOM elements are never rendered.
  - When the user clicks the CTA on their first visit, `sessionStorage.setItem("mh_entered_experience", "true")` is permanently set for the session.

- **In [`cloned_site/_next/static/chunks/402p77n-ks3lc.js`](file:///home/mahmud-hasan/Naims%20Project/3d%20portfolio/cloned_site/_next/static/chunks/402p77n-ks3lc.js)**:
  - Module `222903` (the loader store) initializes with `isExperienceInteractive: true`, `hasLoaderExitStarted: true`, `hasLoaderUnmounted: true`, `hasArrivalSceneRevealed: true` whenever the session bypass is active.

### 2. Pre-Mount Route Resolution
- **In [`cloned_site/_next/static/chunks/402p77n-ks3lc.js`](file:///home/mahmud-hasan/Naims%20Project/3d%20portfolio/cloned_site/_next/static/chunks/402p77n-ks3lc.js)** & **[`cloned_site/_next/static/chunks/2c6pwbjah8t60.js`](file:///home/mahmud-hasan/Naims%20Project/3d%20portfolio/cloned_site/_next/static/chunks/2c6pwbjah8t60.js)**:
  - Updated the route resolver `h(e)` / `g(e)` in module `332761` to parse `window.location.search` (`target=` or `glide=`) and `sessionStorage.getItem("mh_target_scene")`.
  - When navigating to `/?variant=full&target=projects`, `__mhRouteStore` initializes with `route = PROJECTS` on store construction.
  - When the 3D Canvas component mounts in `2vs2yctr590c-v2.js`:
    ```javascript
    t = eo.f.getState().route;
    "landing" !== t.scene && e(t);
    eo.f.getState().settle(t);
    ```
    Since `t.scene === "projects"`, `e(t)` runs immediately, positioning the camera and scroll sink at `#scene2` with Three.js shaders already awakened. No transition race condition occurs.

### 3. Unified Navigation Click Handlers
- **In [`cloned_site/custom-enhancements.js`](file:///home/mahmud-hasan/Naims%20Project/3d%20portfolio/cloned_site/custom-enhancements.js)**:
  - Handlers for `HOME`, `PROJECTS`, `ABOUT`, `CONTACT`, and `PROJECT SLIDE VIEW`:
    - On 3D page (`isRoot3D`): dispatches smooth camera transition via `dispatch3DRoute(...)` without reloading.
    - On `/lite`: sets `mh_entered_experience = 'true'` and target scene in `sessionStorage`, then navigates directly to `/?variant=full&target=<destination>`.
    - `PROJECT SLIDE VIEW`: on `/lite`, smoothly scrolls to top 0; on 3D root page, navigates to `/lite`.

---

## 3. Automated Test Verification Results
All 6 core navigation transitions were verified in Google Chrome via Chrome DevTools Protocol:
1. **Visit `/lite`**: All navbar links (`HOME`, `PROJECTS`, `ABOUT`, `CONTACT`, `PROJECT SLIDE VIEW`) present and functional.
2. **Click `PROJECTS` from `/lite`**:
   - Navigates to `/?variant=full&target=projects`.
   - `loaderContainer` display is `'none'` (0 flash, no loader gate).
   - 3D route scene is `'projects'` (3D Projects Cylinder).
3. **Click `ABOUT` from `/lite`**:
   - Navigates to `/?variant=full&target=about`.
   - Loader is bypassed.
   - 3D route scene is `'about'` (3D portrait reveal).
4. **Click `CONTACT` from `/lite`**:
   - Navigates to `/?variant=full&target=contact`.
   - Loader is bypassed.
   - 3D route scene is `'contact'` (3D contact sphere).
5. **Click `HOME` from `/lite`**:
   - Navigates to `/?variant=full&target=home`.
   - Loader is bypassed.
   - 3D route scene is `'landing'` (3D stone arch).
6. **Click `PROJECT SLIDE VIEW` from 3D Home**:
   - Navigates to `/lite` smoothly.
