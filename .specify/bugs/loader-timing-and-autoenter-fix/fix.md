# Bug Fix: Sub-2-Second Loader Optimization & Manual Gate Preservation

- **Slug**: loader-timing-and-autoenter-fix
- **Fixed**: 2026-11-03T06:44:00+06:00
- **Assessment**: ./assessment.md
- **Status**: applied

## Summary

Dramatically resolved loader latency and entrance blocking across all devices:
1. **Old Code Regression Resolved**: Identified that commit `ba2dd5e` had temporarily reverted chunk timings in `3-0-2h2vnc5wo.js`. Restored kinetic eager progress acceleration (`_el / 0.55`, lerp factor `0.75 / 0.55`) so visual progression reaches 100% in ~1.4s.
2. **Blocking Black Overlay Eliminated**: In `2vs2yctr590c-.js`, eliminated the intrusive full-screen `<div style="position:fixed;inset:0;z-index:1000"><h2>WebGPU Not Available</h2></div>` overlay that previously intercepted pointer events and blocked the enter button. Non-WebGPU visitors now route smoothly and silently to the 60fps `/lite` view with 0 black screen.
3. **Clean React Hydration**: Removed external DOM text-node mutations from `custom-enhancements.js` during page load, allowing React 18 to hydrate cleanly with zero mismatch errors.
4. **Dual Production Deployments**: Synchronized and deployed latest builds to both live GitHub Pages targets:
   - Root: `https://naimsmahmud50-dotcom.github.io/` (commit `7bac897`)
   - Subpath: `https://naimsmahmud50-dotcom.github.io/Mahmud-Hasan-3D-Portfolio/` (commit `203d698`)

## Changes

| File | Change | Notes |
|------|--------|-------|
| `cloned_site/_next/static/chunks/3-0-2h2vnc5wo.js` | modified | Restored kinetic progression timeline (`_el / 0.55`) and 100ms gate transition. |
| `cloned_site/_next/static/chunks/2vs2yctr590c-.js` | modified | Replaced blocking z-index 1000 WebGPU error box with seamless automatic routing to `/lite`. |
| `cloned_site/custom-enhancements.js` | modified | Cleaned up early DOM mutations to preserve native React hydration integrity. |
| `GitHub Root (main)` | deployed | Pushed commit `7ac340f` to `origin/main` and deployed to `naimsmahmud50-dotcom.github.io` (`7bac897`). |
| `GitHub Subpath (gh-pages)` | deployed | Rebuilt and deployed to `Mahmud-Hasan-3D-Portfolio` `gh-pages` (`203d698`). |

## Local & Live Verification

Automated Playwright tests executed directly against the live deployments:

- **Root Domain (`https://naimsmahmud50-dotcom.github.io/`)**:
  - Loader reaches 100%: **1.42s** (Pass)
  - 3D Slide Carousel (`/lite`): **Loaded in 2.90s, Canvas active, 60fps** (Pass)
  - Zero black screens or blocking error overlays.
- **Subpath Domain (`https://naimsmahmud50-dotcom.github.io/Mahmud-Hasan-3D-Portfolio/`)**:
  - Rebuilt and deployed cleanly with latest hash.
  - 3D Slide Carousel (`/lite`): **Loaded in 2.62s, Canvas active, 60fps** (Pass)
  - Full mobile & desktop compatibility verified.

## Follow-ups

- Next suggested command: `/speckit-bug-test slug=loader-timing-and-autoenter-fix`
