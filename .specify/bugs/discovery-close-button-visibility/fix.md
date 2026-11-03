# Bug Fix: Discovery Project Close Button Visibility & Usability Enhancement

- **Slug**: discovery-close-button-visibility
- **Fixed At**: 2026-11-03T10:28:00+06:00
- **Assessment Reference**: [.specify/bugs/discovery-close-button-visibility/assessment.md](file:///home/mahmud-hasan/Naims%20Project/3d%20portfolio/.specify/bugs/discovery-close-button-visibility/assessment.md)
- **Status**: Verified & Ready for Deployment

---

## 1. Summary of Changes

To resolve the low visibility of the discovery close button reported by the user across all project interiors, a unified dual-layer remediation was implemented without altering or corrupting any unrelated paths in the codebase:

1. **3D WebGPU / Three.js Discovery Canvas Mesh (`2vs2yctr590c-.js`)**:
   - Replaced the bare, faint white canvas text (`r.fillText("CLOSE"...)`) with a high-contrast cyber pill.
   - Rendered a solid dark background fill (`rgba(6, 12, 24, 0.96)`) with rounded corners (`r.roundRect` / arc fallback).
   - Added a crisp glowing cyan border (`#00e5ff`, width 2px).
   - Rendered a bold, geometric `✕` cross icon with rounded line caps to the left of the label.
   - Set text to bold 13px white `CLOSE` with clean vertical centering.
   - Expanded canvas size from `168x88` to `220x96` and mesh plane from `84x44` to `110x48`, increasing both visual presence and clickable raycast hit target.

2. **Top-Left HTML Cyber HUD Overlay (`custom-enhancements.js` & `custom-enhancements.css`)**:
   - Updated `#mh-interior-exit-hud` to position at `top: 26px; left: 28px; z-index: 99999` (matching the user's discovery interior layout).
   - Formatted the button content to `<span class="mh-exit-icon">✕</span> <span class="mh-exit-label">CLOSE</span> <span class="mh-exit-badge">ESC</span>`.
   - Enhanced hover and active states with glowing cyan drop-shadows and rotating `✕` icon.
   - Added mobile responsive sizing (`top: 16px; left: 16px; padding: 8px 16px`).

3. **2D / Lite Slide View Close Button Decoration (`custom-enhancements.js` & `custom-enhancements.css`)**:
   - Added automated enhancement for any `button._3nxWKG_control` or `[data-control="close"]` element in the 2D slide view to include the cyan `✕` prefix and high-contrast pill styling.

4. **Safe Store Accessibility (`15rpswwaw33xn.js`)**:
   - Exported `window.__mhProjectStore = o` within module `910476` to ensure the HTML HUD can trigger `snapToExterior()` / `exitInterior()` smoothly.

---

## 2. Modified Files & Verification

- `cloned_site/_next/static/chunks/2vs2yctr590c-.js`: Syntax validated with `node -c`.
- `cloned_site/_next/static/chunks/15rpswwaw33xn.js`: Syntax validated with `node -c`.
- `cloned_site/custom-enhancements.js`: Syntax validated with `node -c`.
- `cloned_site/custom-enhancements.css`: Validated with CSS parsers and headless browser checks.

---

## 3. Visual & Functional Verification

- Visual artifacts confirmed:
  - `sample_close_pill_centered.png`: Visual mockup of the 3D canvas cyber pill texture.
  - `lite_madrasah_close_btn.png`: Headless browser capture of the decorated `✕ CLOSE` control button in the project view.
- Click actions correctly trigger `exitInterior()` and `snapToExterior()`.
