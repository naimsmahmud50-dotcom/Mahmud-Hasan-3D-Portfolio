# Spec Kit Bug Assessment: Navbar Inline Links & 3D Navigation Overhaul

## 1. Problem Description
1. User reported that navigation buttons across the portfolio were misbehaving:
   - Clicking ABOUT or CONTACT opened custom overlay modals / drawers instead of navigating directly to the original 3D scenes.
   - The unwanted 3-dot menu button was re-introduced or lingering on certain screen sizes due to conflicting CSS rules (`display: inline-flex !important` having higher specificity than `button._rHu7W_menu { display: none !important }`).
   - PROJECTS was triggering standard router jumps to `/projects.html` instead of smooth scrolling to the in-page 3D projects scene (`#scene1`).
   - EXTRA SKILLS button on `/lite` view was failing to open the Studio Archive Video modal because of early return on `#` hash hrefs.
   - Fallback static routes (`/about`, `/contact`, `/projects`, `/projects/<slug>`) were returning 404 or static raw HTML if directly visited.
   - In `deploy_gh_pages.py`, the `custom-enhancements.css` and `custom-enhancements.js` paths were not prepended with `BASE_PATH`, causing styles to fail when served from the project subdirectory.

## 2. Root Cause Analysis
1. **Conflicting Specificity in `custom-enhancements.css`**:
   - `._rHu7W_iconButton._rHu7W_menu` has a specificity of (0, 2, 0).
   - `button._rHu7W_menu, button[aria-label="Menu"]` has a specificity of (0, 1, 1).
   - Because both used `!important`, the former rule (`display: inline-flex !important`) won in cascading evaluation, causing the 3-dot button to reappear.
2. **Smooth Scrolling vs Instant Scrolling**:
   - Calling `window.scrollTo({ top: targetY, behavior: 'smooth' })` without fallback was stalling or failing to advance in certain browser rendering contexts and when Lenis hooks are present.
   - Needs deterministic fallback `window.scrollTo(0, targetY)` with a 150ms verification timeout.
3. **Event Propagation & Navigation Routes**:
   - Click events were not consistently intercepted in the capture phase for all routes.
   - Static direct visits needed auto-redirects to `/?variant=full&glide=...` to guarantee users always experience the real-time 3D canvas.
4. **Deployment Base Path Incomplete Replacements**:
   - In `scripts/deploy_gh_pages.py`, `custom-enhancements.css` and `custom-enhancements.js` were referenced with root-relative `/custom-enhancements...` without `${BASE_PATH}`, leading to 404 or out-of-sync style loading on GitHub Pages.
5. **Project Slug Subroutes (Static 404)**:
   - Links to `/projects/<slug>` (e.g. `facebook-automation`, `linkedin-automation`) had no static directory indices in GitHub Pages export, causing 404 on direct hit or reload.

## 3. Scope of Fix
- Modify `cloned_site/custom-enhancements.css` to permanently hide the 3-dot button across all screen sizes and keep horizontal navbar links inline.
- Modify `cloned_site/custom-enhancements.js` with unified capture-phase click handler, reliable 3D scroll failsafe, global project link handler, and direct modal opening.
- Synchronize all static route files including `legal-notice.html` with enhancement tags.
- Update `scripts/deploy_gh_pages.py` and `scripts/deploy_root_gh_pages.py` to generate static directories for all project slugs and fix base path references.
- Deploy to root GitHub Pages (`naimsmahmud50-dotcom.github.io`) and project repository (`Mahmud-Hasan-3D-Portfolio` gh-pages branch).
