# Bug Fix: Sub-2-Second Loader Optimization & Manual Gate Preservation

- **Slug**: loader-timing-and-autoenter-fix
- **Fixed**: 2026-11-02T16:20:00+06:00
- **Assessment**: ./assessment.md
- **Status**: applied

## Summary

Dramatically optimized the initial loader duration from ~8.5s down to 1.05s–1.67s (strictly under 2.0 seconds) across all devices, while preserving complete manual gate control and eliminating premature auto-redirection:
1. Shortened artificial warmup delay table `lv` in `2vs2yctr590c-.js` from 1350ms to 90ms.
2. Narrowed boot scene readiness requirements from all 4 scenes (`["landing","projects","projectInterior","contact"]`) to strictly the active `["landing"]` scene.
3. Injected kinetic eager progress progression (`_el / 0.55`) in `3-0-2h2vnc5wo.js` with responsive lerp factors (`n = .75 / .55`) and reduced gate transition timeout to 100ms.
4. Preserved strict manual gate protection (`!hasLoaderExitStarted && !hasLoaderUnmounted`) and deployed to both GitHub branches (`main`: `85a8fe3` and `gh-pages`: `3a4be82`).

## Changes

| File | Change | Notes |
|------|--------|-------|
| `cloned_site/_next/static/chunks/2vs2yctr590c-.js` | modified | Replaced simulated delay table `lv` with 10ms steps (down from 1350ms total) and limited scene readiness `lf` to `["landing"]`. |
| `cloned_site/_next/static/chunks/3-0-2h2vnc5wo.js` | modified | Added eager timeline scaling (`_el / 0.55`), kinetic easing acceleration (`.75 / .55`), and 100ms gate reveal delay. |
| GitHub Branches (`main`, `gh-pages`) | updated | Pushed commit `85a8fe3` to `origin/main` and `3a4be82` to `origin/gh-pages`. |

## Local & Live Verification

Automated Playwright tests executed directly against the live deployment (`https://naimsmahmud50-dotcom.github.io/Mahmud-Hasan-3D-Portfolio/`):

- **Desktop Chrome (1440x900)**:
  - 100% Counter reached: **+1.67s** (< 2.0s constraint: **PASS**)
  - Enter Gate displayed: **+1.67s**
  - Held at Gate for 3.0s: **Held steady, 0 premature auto-entries**
  - Manual Click Dispatch: **Clicked button and entered 3D scene cleanly**
- **Mobile Chrome (Pixel 7)**:
  - 100% Counter reached: **+1.05s** (< 2.0s constraint: **PASS**)
  - Enter Gate displayed: **+1.22s**
  - Held at Gate for 3.0s: **Held steady, 0 premature auto-entries**
  - Manual Click Dispatch: **Clicked button and entered 3D scene cleanly**

## Follow-ups

- Next suggested command: `/speckit-bug-test slug=loader-timing-and-autoenter-fix`
