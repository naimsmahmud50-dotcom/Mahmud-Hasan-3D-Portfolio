# Feature Specification: 010-mobile-vertical-navbar-menu

- **Feature**: Mobile Vertical Navbar Menu Navigation
- **Created**: 2026-11-09
- **Status**: Proposed / Pending User Approval

---

## 1. Objective & User Requirements
- **Desktop View (Image 1)**:
  - All 7 navigation buttons (`HOME`, `PROJECTS`, `ABOUT`, `CONTACT`, `EXTRA SKILLS`, `PROJECT SLIDE VIEW`, `GITHUB REPO`) remain horizontally aligned in a single line across the top navbar, alongside the audio toggle and `AVAILABLE` badge.
  - Zero changes to desktop presentation.
- **Mobile / Portrait View (Image 2)**:
  - When the screen width is narrow (mobile devices / portrait screens, $\le 768\text{px}$), the buttons should no longer be squished horizontally or overflowed off-screen.
  - Instead, the buttons must be stacked vertically—ordered sequentially from top to bottom ("সিরিয়াল বাই নিচে নিচে থাকুক, উপর থেকে নিচে").
  - The vertical stack should look polished and deliberate (Cyber-minimalist HUD theme), with clean typography, clear spacing, and touch-friendly targets.
  - Sound and `AVAILABLE` status badges remain cleanly positioned at the top header without collision.

---

## 2. Invariants & Constraints
1. **Approval Gate**: Do NOT touch or modify any production code until the user explicitly reviews and commands execution.
2. **Strict Code Isolation**:
   - Zero changes to Three.js camera rigs, WebGL shaders, sound engines, or slide view logic.
   - Only modify CSS rules and navbar responsive flexbox layout handling.
3. **No 3-Dot Hamburger Regression**:
   - The 3-dot popup/dropdown menu remains disabled as originally designed; the navigation buttons exist directly on screen in clean vertical order.

---

## 3. Required Modifications & Target Files

### File 1: [`cloned_site/custom-enhancements.css`](file:///home/mahmud-hasan/Naims%20Project/3d%20portfolio/cloned_site/custom-enhancements.css)
- **Target Section**: `@media (max-width: 768px)`
- **Changes**:
  1. Set `div._rHu7W_menuPanel` on mobile to:
     - `position: absolute` or flex column container below top header.
     - `flex-direction: column !important`.
     - `align-items: flex-start !important`.
     - `width: auto !important`, `max-width: 90vw !important`.
  2. Set `ul._rHu7W_links` on mobile to:
     - `flex-direction: column !important`.
     - `align-items: flex-start !important`.
     - `gap: 10px !important`.
  3. Style `a._rHu7W_link` on mobile:
     - `display: block !important`.
     - `font-size: 0.82rem !important`.
     - `padding: 6px 10px !important`.
     - Cyber border/backdrop indicator for legibility over 3D canvas.

### File 2: [`cloned_site/custom-enhancements.js`](file:///home/mahmud-hasan/Naims%20Project/3d%20portfolio/cloned_site/custom-enhancements.js)
- **Target Sections**:
  1. `injectPermanentNavbarStyles()` (around line 145):
     - In the embedded `@media (max-width: 768px)` rules, change mobile `menuPanel` and `_rHu7W_links` from `flex-direction: row` to `flex-direction: column`.
  2. `setupMenuLabelSync()` (around line 2095):
     - Check `window.innerWidth <= 768`:
       - If mobile: apply `flex-direction: column !important`.
       - If desktop: apply `flex-direction: row !important`.

### File 3: HTML Templates (`cloned_site/index.html`, `lite.html`, `projects`, etc.)
- In `<style id="mh-navbar-hard-permanent-rules">`:
  - Update mobile media query `@media (max-width: 768px)` to ensure vertical column display takes effect immediately before JS executes.
