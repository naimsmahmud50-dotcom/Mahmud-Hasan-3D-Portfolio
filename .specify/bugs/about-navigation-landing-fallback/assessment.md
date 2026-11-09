# Spec Kit Bug Assessment: ABOUT Navigation Scrolls to Subtitles Tunnel Instead of About Section

- **Slug**: about-navigation-landing-fallback
- **Reported Date**: 2026-11-09
- **Status**: Root Cause Located & Verified
- **Severity**: High (Broken Primary Navigation)

---

## 1. Symptom Summary
When the user clicks the **`ABOUT`** button in the top navigation bar:
- The screen lands on a dark background showing blue particle wave trails on the left, and a single subtitle line at the bottom center:
  > *"I architect autonomous systems that think and build"*
- The expected About section—including **Mahmud Hasan's portrait**, the **"Full Stack Developer & AI Automation Expert"** bio card, experience plate, and skill badges—does **not** appear.

---

## 2. Code Paths Responsible

### Primary Problem Path: [`cloned_site/custom-enhancements.js`](file:///home/mahmud-hasan/Naims%20Project/3d%20portfolio/cloned_site/custom-enhancements.js)

1. **Incorrect Spacer Anchor Calculation (L1957–L1961)**:
   ```javascript
   // Button: ABOUT
   if (isRoot3D) {
     const el = document.getElementById('sceneAbout');
     const fallbackY = (el && el.offsetHeight > 0)
       ? Math.round(el.offsetTop + el.offsetHeight * 0.8)
       : 6738;
     dispatch3DRoute('ABOUT', fallbackY);
   }
   ```
   - `custom-enhancements.js` calculates the target Y using `#sceneAbout` at `frac: 0.8` (approx $6,738\text{px}$).
   - However, in the DOM layout, `#sceneAbout` is only $440\text{vh}$ tall and represents the **introductory subtitle tunnel** (`"I architect autonomous systems..."`).

2. **Hard Fallback in `setupRouteAutoGlide()` (L1270–L1272)**:
   ```javascript
   if (targetKey === 'ABOUT') {
     const el = document.getElementById('sceneAbout');
     return (el && el.offsetHeight > 0) ? Math.round(el.offsetTop + el.offsetHeight * 0.8) : 6738;
   }
   ```
   - Auto-glide also uses this erroneous $6,738\text{px}$ calculation, dropping the camera into the subtitle tunnel instead of the About plate.

3. **Forceful Scroll Override in `dispatch3DRoute()` (L1893–L1910)**:
   ```javascript
   const dispatch3DRoute = (routeKey, fallbackY) => {
     safelyExit3DInterior();
     if (window.__mhRouteStore && window.__mhRoutes && window.__mhRoutes[routeKey]) {
       try {
         window.__mhRouteStore.getState().request(window.__mhRoutes[routeKey], 'deeplink');
         scroll3DTarget(fallbackY); // <-- FORCES SCROLL TO WRONG FALLBACK Y (6738px)
         return;
       } catch (_) {}
     }
     ...
     scroll3DTarget(fallbackY);
   };
   ```
   - Although `__mhRouteStore.request('ABOUT', 'deeplink')` invokes the native Three.js `scrollSink`, `scroll3DTarget(fallbackY)` immediately overrides the window position, pulling the scroll back up by ~14,000px into the subtitle tunnel!

---

## 3. Underlying Engine Layout & True About Coordinates

In [`cloned_site/_next/static/chunks/402p77n-ks3lc.js`](file:///home/mahmud-hasan/Naims%20Project/3d%20portfolio/cloned_site/_next/static/chunks/402p77n-ks3lc.js):
- **Module `332761`**:
  `u = { scene: "about", path: "/about", ... resolveOffset: () => (0, i.r)(), ... }`
- **Module `668320`**:
  `resolveOffset: () => (0, i.q)(t.B) + (0, i.g)(t.T)`
  - `t.B` = `{ section: "sceneAboutSurvey", frac: .2236 }`
  - `t.T` = `174.6725` ($1.746725\text{vh}$)

### DOM Spacers Sequence:
| Spacer ID | Height (CSS) | Purpose |
| :--- | :--- | :--- |
| `#scene1` | $1190\text{vh}$ | Landing Stone Arch & Entrance |
| `#scene2` | $0\text{vh}$ | 3D Projects Cylinder |
| `#sceneAbout` | $440\text{vh}$ | Subtitles Tunnel ("I architect autonomous systems...") |
| `#sceneAboutTravel` | $660\text{vh}$ | Subtitles Tunnel ("Intelligence born from deterministic rules...") |
| **`#sceneAboutSurvey`** | $226\text{vh}$ | **True About Section (Portrait, Bio Card, ID Plate, Skills)** |

**Mathematical Target**:
- The real About section is anchored at `#sceneAboutSurvey`, which begins at:
  $$1190\text{vh} + 440\text{vh} + 660\text{vh} = 2290\text{vh}$$
- At $900\text{px}$ viewport height, the real About position is approximately:
  $$\approx 21,080\text{px}$$
- The old code was scrolling to $6,738\text{px}$ ($1542\text{vh}$), leaving the viewport over **$14,000\text{px}$ short** of the About section!

---

## 4. Proposed Remediation Plan
1. In [`cloned_site/custom-enhancements.js`](file:///home/mahmud-hasan/Naims%20Project/3d%20portfolio/cloned_site/custom-enhancements.js):
   - Replace the incorrect `#sceneAbout * 0.8` calculation with a dynamic resolver targeting `#sceneAboutSurvey`:
     ```javascript
     const getAboutTargetY = () => {
       try {
         if (window.__mhRoutes && window.__mhRoutes.ABOUT && typeof window.__mhRoutes.ABOUT.resolveOffset === 'function') {
           const y = window.__mhRoutes.ABOUT.resolveOffset();
           if (y > 0) return y;
         }
       } catch (_) {}
       const survey = document.getElementById('sceneAboutSurvey');
       if (survey && survey.offsetHeight > 0) {
         return Math.round(survey.offsetTop + survey.offsetHeight * 0.2236 + window.innerHeight * 1.746725);
       }
       const sAbout = document.getElementById('sceneAbout');
       if (sAbout && sAbout.offsetTop > 0) {
         return Math.round(sAbout.offsetTop + window.innerHeight * (4.4 + 6.6 + 2.26 * 0.2236 + 0.0175));
       }
       return 21080;
     };
     ```
   - In `dispatch3DRoute`: Allow `__mhRouteStore.request(..., 'deeplink')` and `scrollSink` to handle the transition naturally without forcing an outdated `fallbackY`.
2. Do not touch or modify any unrelated code files.
