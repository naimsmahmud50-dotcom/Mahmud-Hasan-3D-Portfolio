# Spec Kit Bug Assessment: Hide Navbar Menu on "Mahmud AI Architect" Loader Screen

- **Slug**: loader-screen-hide-navbar-menu
- **Reported Date**: 2026-11-08
- **Verdict**: Confirmed Defect

---

## 1. Problem Description & User Impact
On initial page load, the intro/loader screen displays the large brand typography:
`MAHMUD AI ARCHITECT` along with the progress counter and the "ENTER IN THE EXPERIENCE" button.

However, the top navbar containing all menu buttons (`HOME`, `PROJECTS`, `ABOUT`, `CONTACT`, `EXTRA SKILLS`, `PROJECT SLIDE VIEW`, `GITHUB REPO`, and `AVAILABLE`) is currently rendered directly on top of the loader screen.
User requirement: **On the "Mahmud AI Architect" loader screen, no menu buttons should be visible.** The menu buttons must only reveal after the user enters the experience (or after the loader dismisses).

---

## 2. Root Cause Analysis
1. **Unconditional Global CSS Injections**:
   - In `<style id="mh-navbar-hard-permanent-rules">` (inlined into HTML and dynamically created in `custom-enhancements.js`), the rule:
     ```css
     nav._rHu7W_nav, [class*="_rHu7W_nav"] {
       display: flex !important;
       opacity: 1 !important;
       visibility: visible !important;
       transform: translateY(0) !important;
       pointer-events: auto !important;
     }
     ```
     forces the navbar to be fully opaque and visible regardless of whether the loader is active.
   - Similarly, in `custom-enhancements.css`:
     ```css
     nav._rHu7W_nav, ._rHu7W_nav {
       opacity: 1 !important;
       visibility: visible !important;
     }
     ```
     bypasses React's conditional visibility logic (`._rHu7W_visible`).

2. **JavaScript Aggressive Class Assignment**:
   - In `custom-enhancements.js`, `setupMenuLabelSync().applySync()` runs on a 120ms interval and on every mutation:
     ```javascript
     const nav = document.querySelector('nav._rHu7W_nav, [class*="_rHu7W_nav"]');
     if (nav) {
       nav.classList.add('_rHu7W_visible');
       nav.style.setProperty('opacity', '1', 'important');
       nav.style.setProperty('visibility', 'visible', 'important');
     }
     ```
     This immediately adds `_rHu7W_visible` and sets inline `opacity: 1 !important` while `.y9w63G_loaderContainer` is still visible.

---

## 3. Remediation Strategy
1. **CSS Loader Guard**:
   - Update CSS rules so that while `.y9w63G_loaderContainer:not(.y9w63G_exiting)` is present in the DOM:
     - `nav._rHu7W_nav` has `display: none !important; opacity: 0 !important; visibility: hidden !important; pointer-events: none !important;`.
   - Update `nav._rHu7W_nav` styling so that horizontal inline styles apply **only when `._rHu7W_visible` is present** and the loader is not active.
2. **JavaScript Sync Guard**:
   - In `custom-enhancements.js`, check whether the loader container is active:
     ```javascript
     const isLoaderActive = () => {
       const loader = document.querySelector('.y9w63G_loaderContainer, [class*="loaderContainer"]');
       if (!loader) return false;
       return !loader.classList.contains('y9w63G_exiting') && window.getComputedStyle(loader).display !== 'none';
     };
     ```
   - If loader is active, hide the navbar and do not add `_rHu7W_visible`.
   - When the loader exits or unmounts, reveal the navbar with full inline horizontal layout.
3. **Apply & Deploy**:
   - Update `custom-enhancements.js`, `custom-enhancements.css`, and HTML templates.
   - Re-deploy to GitHub Pages (both project and root repositories).
