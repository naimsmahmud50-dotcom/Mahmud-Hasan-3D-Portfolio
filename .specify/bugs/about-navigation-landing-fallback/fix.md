# Spec Kit Bug Fix: ABOUT Navigation Scrolls to Subtitles Tunnel Instead of About Section

- **Slug**: about-navigation-landing-fallback
- **Fixed Date**: 2026-11-09
- **Status**: Resolved & Verified
- **Severity**: High (Broken Primary Navigation)

---

## 1. Problem Summary
When clicking the **`ABOUT`** button in the top navigation bar, the camera landed on a pitch-black screen with blue particle waves on the left and a subtitle text at the bottom center:
> *"I architect autonomous systems that think and build"*

The actual About section—featuring Mahmud Hasan's bio ("AI Automation Expert & Web Architect"), skills node network, experience timeline, and ID card—was nowhere to be seen.

---

## 2. Root Cause Analysis
1. **Wrong Anchor Section Used in Fallback Calculation**:
   - In [`cloned_site/custom-enhancements.js`](file:///home/mahmud-hasan/Naims%20Project/3d%20portfolio/cloned_site/custom-enhancements.js), the `ABOUT` navigation logic was calculating the target coordinate using:
     ```javascript
     const el = document.getElementById('sceneAbout');
     const fallbackY = Math.round(el.offsetTop + el.offsetHeight * 0.8); // ~6,738px
     ```
   - In Three.js and DOM layout:
     - `#sceneAbout` ($440\text{vh}$) is solely the introductory subtitle tunnel (rendering *"I architect autonomous systems that think and build"*).
     - `#sceneAboutTravel` ($660\text{vh}$) is the second subtitle tunnel.
     - **`#sceneAboutSurvey`** ($226\text{vh}$) is the true About section anchor where Mahmud Hasan's bio card, skills network, and experience plate live.
   - Targeting `#sceneAbout * 0.8` left the camera stranded at $\approx 6,738\text{px}$, which is $>14,000\text{px}$ short of the actual About section at $\approx 21,080\text{px}$!

2. **Forceful Scroll Override**:
   - `dispatch3DRoute('ABOUT', fallbackY)` was calling `scroll3DTarget(fallbackY)` immediately after requesting the deeplink transition, overriding the Three.js route store camera and forcing the page to $6,738\text{px}$.

---

## 3. Code Modifications Applied

### 1. [`cloned_site/custom-enhancements.js`](file:///home/mahmud-hasan/Naims%20Project/3d%20portfolio/cloned_site/custom-enhancements.js)
- **Updated `getTargetY()` in `setupRouteAutoGlide()`**:
  Dynamically queries `window.__mhRoutes.ABOUT.resolveOffset()`, falling back to `#sceneAboutSurvey` offset calculation ($\approx 21,080\text{px}$):
  ```javascript
  if (targetKey === 'ABOUT') {
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
  }
  ```

- **Updated `Button: ABOUT` Navbar Click Handler**:
  Replaced the erroneous `#sceneAbout` ($6,738\text{px}$) calculation with the true About anchor resolver targeting `#sceneAboutSurvey`.

---

## 4. Verification Results
- Executed headless browser automation and simulated clicking `ABOUT`.
- **Result**: Viewport successfully traveled to `#sceneAboutSurvey`.
- **Render Verification**: Mahmud Hasan's About card displayed with full clarity:
  - Header: `"I RENDER THE UNSEEN"`
  - Subhead: `"AI AUTOMATION EXPERT & WEB ARCHITECT"`
  - Bio: `"Specializing in end-to-end full stack web platforms, autonomous AI agent workflows..."`
  - Radar nodes: `"FREELANCER"`, `"from bangladesh"`, `"based in dhaka"`, `">_ AI TERMINAL"`.
- Verified artifact screenshot: `verify_about_click_fixed.png`.
