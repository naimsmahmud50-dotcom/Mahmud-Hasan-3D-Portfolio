# Technical Implementation Plan: 010-mobile-vertical-navbar-menu

- **Feature Slug**: 010-mobile-vertical-navbar-menu
- **Target Viewports**: Screen width $\le 768\text{px}$ (mobile portrait/landscape)
- **Status**: Proposed / Awaiting User Confirmation

---

## 1. Architectural Strategy

Currently:
- On desktop, navbar uses `flex-direction: row` with items arranged:
  `[Logo]` | `[HOME PROJECTS ABOUT CONTACT EXTRA SKILLS PROJECT SLIDE VIEW GITHUB REPO]` | `[Sound]` | `[AVAILABLE]`
- On mobile ($\le 768\text{px}$), the links are set to `flex-direction: row` with `overflow-x: auto` and `max-width: calc(100vw - 190px)`, causing them to be cut off, hidden, or squished horizontally next to Sound & Available.

Proposed:
- On desktop ($> 768\text{px}$): **No changes whatsoever**. The horizontal layout from Image 1 remains 100% intact.
- On mobile ($\le 768\text{px}$, Image 2):
  1. The top bar header holds:
     - `Logo` on top-left.
     - `Sound` and `AVAILABLE` badges on top-right.
  2. The navigation links (`div._rHu7W_menuPanel`) will anchor directly below the header as a clean vertical cyber HUD menu list:
     - `flex-direction: column !important`
     - `align-items: flex-start !important`
     - Sequenced vertically from top to bottom:
       1. `HOME`
       2. `PROJECTS`
       3. `ABOUT`
       4. `CONTACT`
       5. `EXTRA SKILLS`
       6. `PROJECT SLIDE VIEW`
       7. `GITHUB REPO`
  3. Visual Treatment:
     - Sleek semi-transparent dark glass background (`background: rgba(10, 12, 16, 0.75)`, `backdrop-filter: blur(8px)`)
     - Subtle neon border / left accent indicator (`border-left: 2px solid rgba(0, 229, 255, 0.4)`)
     - Comfortable touch padding (`padding: 6px 12px`) with hover/tap glow
     - Non-intrusive placement that doesn't block the 3D scene elements unnecessarily.

---

## 2. Exact Changes Breakdown

### 1. `cloned_site/custom-enhancements.css`
Update `@media (max-width: 768px)`:
```css
@media (max-width: 768px) {
  nav._rHu7W_nav {
    flex-wrap: wrap !important;
  }
  div._rHu7W_menuPanel {
    position: relative !important;
    order: 10 !important;
    width: 100% !important;
    max-width: none !important;
    margin: 12px 0 0 0 !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: flex-start !important;
    background: rgba(10, 14, 20, 0.65) !important;
    backdrop-filter: blur(12px) !important;
    -webkit-backdrop-filter: blur(12px) !important;
    border-radius: 8px !important;
    border: 1px solid rgba(255, 255, 255, 0.08) !important;
    padding: 8px 12px !important;
    box-sizing: border-box !important;
  }
  ul._rHu7W_links {
    display: flex !important;
    flex-direction: column !important;
    align-items: flex-start !important;
    gap: 8px !important;
    width: 100% !important;
  }
  li._rHu7W_linkItem {
    width: 100% !important;
    display: flex !important;
  }
  a._rHu7W_link {
    width: 100% !important;
    display: flex !important;
    font-size: 0.82rem !important;
    padding: 6px 8px !important;
    letter-spacing: 0.04em !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.04) !important;
  }
  a._rHu7W_link:last-child {
    border-bottom: none !important;
  }
}
```

### 2. `cloned_site/custom-enhancements.js`
In `setupMenuLabelSync()`, adapt dynamic flex direction based on screen width:
```javascript
const isMobile = window.innerWidth <= 768;
menuPanel.style.setProperty('flex-direction', isMobile ? 'column' : 'row', 'important');
menuPanel.style.setProperty('align-items', isMobile ? 'flex-start' : 'center', 'important');
```

### 3. `cloned_site/index.html` & other HTML entry files
Update `@media (max-width: 768px)` inside `<style id="mh-navbar-hard-permanent-rules">` to match.
