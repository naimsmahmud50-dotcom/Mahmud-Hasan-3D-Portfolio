# Bug Fix: Project Slide View Controls Contrast and Affordance Upgrade

- **Slug**: project-slide-controls-visibility
- **Fixed**: 2026-11-02T18:25:35+06:00
- **Assessment**: ./assessment.md
- **Status**: applied

## Summary

Upgraded the project slide view controls (`CLOSE`, `PREVIOUS`, `NEXT`, and `LIVE LINK`) from washed-out, invisible white text on an off-white background to high-contrast **Cyberpunk Luxury Dark-Glass Capsule Pills**:
1. Applied opaque dark gradient backing (`#090e17` to `#0d1829`) with backdrop blur so the buttons never wash out against light or dark project sheet backgrounds.
2. Injected neon cyan borders (`1.5px solid #00e5ff`) and bright luminous cyan typography (`#00e5ff`, font-weight: 800, letter-spacing: 0.14em, uppercase) with WCAG AAA contrast ratio (> 12:1).
3. Engineered responsive hover interaction: inverted solid cyan fill (`#00e5ff`) with pitch-black typography (`#000000`) and glowing halo (`box-shadow: 0 0 28px rgba(0, 229, 255, 0.95)`).
4. Styled distinct states for `CLOSE` (coral/red glowing accent on hover) and `LIVE LINK` (deep ocean gradient pill with external indicator).

## Changes

| File | Change | Notes |
|------|--------|-------|
| `cloned_site/custom-enhancements.css` | modified | Replaced under-contrasted `._3nxWKG_action` with comprehensive, high-specificity rules for `._3nxWKG_action`, `._3nxWKG_control`, `._3nxWKG_link`, and `[data-control]`. |

## Diff Highlights

```css
._3nxWKG_action,
._3nxWKG_control,
._3nxWKG_link,
[data-control] {
  appearance: none !important;
  box-sizing: border-box !important;
  height: 42px !important;
  min-width: 108px !important;
  padding: 0 20px !important;
  margin: 6px 0 !important;
  border-radius: 9999px !important;
  background: linear-gradient(135deg, #070d18 0%, #0d1829 100%) !important;
  border: 1.5px solid var(--mh-cyan, #00e5ff) !important;
  font-family: var(--font-navbar-display, 'Space Grotesk', -apple-system, sans-serif) !important;
  font-weight: 800 !important;
  font-size: 13px !important;
  letter-spacing: 0.14em !important;
  text-transform: uppercase !important;
  color: #00e5ff !important;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.6), 0 0 14px rgba(0, 229, 255, 0.35) !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 10px !important;
  cursor: pointer !important;
  pointer-events: auto !important;
  z-index: 50 !important;
  transition: all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1) !important;
}

._3nxWKG_action:hover,
._3nxWKG_control:hover,
._3nxWKG_link:hover,
[data-control]:hover {
  background: var(--mh-cyan, #00e5ff) !important;
  color: #000000 !important;
  fill: #000000 !important;
  border-color: #ffffff !important;
  box-shadow: 0 0 28px rgba(0, 229, 255, 0.95), 0 8px 24px rgba(0, 0, 0, 0.6) !important;
  transform: translateY(-2px) scale(1.06) !important;
}
```

## Local Verification

- Playwright automated check verifies that `CLOSE`, `PREVIOUS`, `NEXT`, `LIVE LINK` render with solid dark backing and high-contrast `#00e5ff` cyan text without requiring hover.
- Contrast ratio computed against sheet background: > 12:1 (exceeds WCAG AAA requirement of 7:1).

## Follow-ups

- Run `/speckit-bug-test slug=project-slide-controls-visibility`.
- Deploy updates to both root domain repository (`naimsmahmud50-dotcom.github.io`) and subpath repository (`Mahmud-Hasan-3D-Portfolio`).
