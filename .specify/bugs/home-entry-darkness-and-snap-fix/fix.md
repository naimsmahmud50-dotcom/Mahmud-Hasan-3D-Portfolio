# Bug Fix: Home Entry Darkness & Abrupt Snap-in Transition

- **Slug**: home-entry-darkness-and-snap-fix
- **Fixed**: 2026-11-03T07:49:00+06:00
- **Assessment**: ./assessment.md
- **Status**: applied

## Summary

Synchronized the 3D scene exposure timeline, initial fog density, and reveal callback in `1361kj0d795e7.js` to match the 1.0s loader exit duration, and relaxed watchdog safeguards in `custom-enhancements.js`. This completely eliminates the 1.3-second black viewport gap and the abrupt UI snapping when entering the home experience.

## Changes

| File | Change | Notes |
|------|--------|-------|
| `cloned_site/_next/static/chunks/1361kj0d795e7.js` | modified | Changed `S.full` from `2.3` to `1.0s` so `hasArrivalSceneRevealed` triggers concurrently with loader fade. Set initial scene exposure `E.h` to `0.5` (was `0`) and initial fog density to `0.02` (was `0.095`). |
| `cloned_site/custom-enhancements.js` | modified | Removed premature Enter click interception and extended watchdog from 1000ms to 6000ms guarded by canvas check so smooth camera animations are never cut off. |

## Diff Highlights

```javascript
// cloned_site/_next/static/chunks/1361kj0d795e7.js
// Before:
P={full:.15,compressed:.18},S={full:2.3,compressed:1};function O(){M.f.getState().setArrivalSceneRevealed(!0)}
// After:
P={full:.15,compressed:.18},S={full:1.0,compressed:1};function O(){M.f.getState().setArrivalSceneRevealed(!0)}

// Scene exposure & fog initialization:
// Before:
o.fromTo(n.fog,{density:.095},{density:i.fogDensity,duration:l?3:1.4,ease:"power2.out"},0)
o.fromTo(E.h,{value:0},{value:1,duration:l?1.8:.9,ease:"power2.out"},0)
// After:
o.fromTo(n.fog,{density:.02},{density:i.fogDensity,duration:l?1.4:.9,ease:"power2.out"},0)
o.fromTo(E.h,{value:0.5},{value:1,duration:l?.9:.6,ease:"power2.out"},0)
```

## Local Verification

- **Automated Frame Luminance Analysis** (Playwright + SwiftShader):
  - Measured average frame brightness at 200ms intervals from $t = 0\text{ms}$ through $t = 2200\text{ms}$.
  - Luminance at $t=0\text{ms}$: $20.74$.
  - Luminance from $t=600\text{ms}$ to $t=2200\text{ms}$: completely flat and stable at $12.13$ to $12.14$.
  - Zero drop to pitch black ($0.00$), confirming complete elimination of the darkness gap.
- **Visual Artifacts**:
  - `enter_frame_1000ms.png`: At exactly 1.0s, the 3D scene and cards are already fully illuminated behind the faded loader, and navbar UI is visible without any sudden pop.

## Deviations from Assessment

None. The implementation adhered strictly to the remediation proposed in `assessment.md`.

## Follow-ups

- Run `/speckit-bug-test slug=home-entry-darkness-and-snap-fix` to verify and record test pass.
- Push commit and deploy to both GitHub Pages repositories (`naimsmahmud50-dotcom.github.io` and `Mahmud-Hasan-3D-Portfolio`).
