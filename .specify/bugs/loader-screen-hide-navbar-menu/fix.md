# Spec Kit Bug Fix: Hide Navbar Menu on "Mahmud AI Architect" Loader Screen

- **Slug**: loader-screen-hide-navbar-menu
- **Fixed Date**: 2026-11-08
- **Status**: Resolved & Verified

---

## 1. Problem Summary
On initial load, the intro/loader screen displaying `MAHMUD AI ARCHITECT` was showing the top navbar menu buttons (`HOME`, `PROJECTS`, `ABOUT`, `CONTACT`, `EXTRA SKILLS`, `PROJECT SLIDE VIEW`, `GITHUB REPO`, and `AVAILABLE`).
The user required: **No menu buttons should be visible on the "Mahmud AI Architect" loader screen.** All menu buttons must remain strictly hidden until the user enters the experience.

---

## 2. Root Cause
1. In `custom-enhancements.css` and the inlined style block `<style id="mh-navbar-hard-permanent-rules">`, an unconditional rule:
   ```css
   nav._rHu7W_nav, [class*="_rHu7W_nav"] {
     display: flex !important;
     opacity: 1 !important;
     visibility: visible !important;
     transform: translateY(0) !important;
     pointer-events: auto !important;
   }
   ```
   overrode React's internal visibility state (`_rHu7W_visible` is withheld by React until `hasArrivalSceneRevealed` is true).
2. In `custom-enhancements.js`, `setupMenuLabelSync().applySync()` executed every 120ms and immediately added `nav.classList.add('_rHu7W_visible')` and forced `nav.style.setProperty('opacity', '1', 'important')` regardless of whether the loader container `.y9w63G_loaderContainer` was active.

---

## 3. Remediation Details
1. **CSS Selector Scoping**:
   - Explicitly hide navbar when `.y9w63G_loaderContainer:not(.y9w63G_exiting)` is present:
     ```css
     .y9w63G_loaderContainer:not(.y9w63G_exiting) ~ nav._rHu7W_nav,
     .y9w63G_loaderContainer:not(.y9w63G_exiting) ~ [data-navbar],
     body:has(.y9w63G_loaderContainer:not(.y9w63G_exiting)) nav._rHu7W_nav,
     body:has(.y9w63G_loaderContainer:not(.y9w63G_exiting)) [class*="_rHu7W_nav"],
     nav._rHu7W_nav:not(._rHu7W_visible),
     [class*="_rHu7W_nav"]:not([class*="_rHu7W_visible"]) {
       display: none !important;
       opacity: 0 !important;
       visibility: hidden !important;
       pointer-events: none !important;
     }
     ```
   - Only apply `display: flex !important; opacity: 1 !important; visibility: visible !important;` when `nav._rHu7W_nav._rHu7W_visible` is applied.
2. **JavaScript Loader Guard**:
   - Added `isLoaderActive()` check in `custom-enhancements.js`:
     ```javascript
     function isLoaderActive() {
       const loader = document.querySelector('.y9w63G_loaderContainer, [class*="loaderContainer"]');
       if (!loader) return false;
       if (loader.classList.contains('y9w63G_exiting') || loader.classList.contains('exiting')) return false;
       try {
         const style = window.getComputedStyle(loader);
         if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false;
       } catch (_) {}
       return true;
     }
     ```
   - If `isLoaderActive()` is true, force `display: none !important`, `opacity: 0 !important`, `visibility: hidden !important`, remove `_rHu7W_visible`, and exit early.
   - Once `isLoaderActive()` becomes false (loader dismissed or unmounted), restore `nav.classList.add('_rHu7W_visible')` with full horizontal inline layout.
3. **Template Synchronization**:
   - Updated `<style id="mh-navbar-hard-permanent-rules">` in:
     - `cloned_site/index.html`
     - `cloned_site/about`
     - `cloned_site/contact`
     - `cloned_site/projects`
     - `cloned_site/lite`

---

## 4. Verification Proof
- **Automated Chrome CDP Test**:
  - Loader Screen Check:
    ```json
    {
      "hasLoader": true,
      "loaderDisplay": "block",
      "loaderOpacity": "1",
      "hasNav": true,
      "navDisplay": "none",
      "navOpacity": "0",
      "navVisibility": "hidden"
    }
    ```
  - Visual Screenshot: `loader_screen_no_menu_buttons.png` confirms `MAHMUD AI ARCHITECT` loader screen displays cleanly with zero menu buttons.
  - Post-Enter Check:
    ```json
    {
      "hasNav": true,
      "navDisplay": "flex",
      "navOpacity": "1",
      "navVisibility": "visible"
    }
    ```
    Confirms navbar cleanly reveals with horizontal layout once the experience begins.
