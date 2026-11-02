# Bug Fix: Loader Duration Reduction & Premature Auto-Enter Elimination

- **Slug**: loader-timing-and-autoenter-fix
- **Fixed**: 2026-11-02T14:59:00+06:00
- **Assessment**: ./assessment.md
- **Status**: applied

## Summary
Resolved both reported loader regressions: eliminated the premature 800ms auto-enter watchdog and background click triggers in `cloned_site/custom-enhancements.js`, and drastically reduced the artificial loading delay from 13.3+ seconds down to ~3.5 seconds by optimizing the simulated GPU asset warmup delays and easing interpolation in `2vs2yctr590c-.js` and `3-0-2h2vnc5wo.js`.

## Changes

| File | Change | Notes |
|------|--------|-------|
| `cloned_site/custom-enhancements.js` | modified | Removed the 800ms auto-enter watchdog timer and restricted document click listener to the actual Enter button only. |
| `cloned_site/_next/static/chunks/2vs2yctr590c-.js` | modified | Reduced simulated latency table `lv` from 13,300ms down to ~1,350ms for snappy status updates. |
| `cloned_site/_next/static/chunks/3-0-2h2vnc5wo.js` | modified | Increased percentage easing factor `n` from `.08` to `.18` (and `.28` when ready), creating smooth, dynamic counter ascent. |
| `cloned_site/*.html` | modified | Bumped cache-busting timestamp on `custom-enhancements.js?v=...` across all HTML files. |

## Diff Highlights

### 1. `cloned_site/custom-enhancements.js` (Removed premature watchdog and broad click listener)
```javascript
-    // Audio gesture unlock and failsafe: Click ANYWHERE on gate screen to enter
-    document.addEventListener('click', function(e) { ... if (btn) btn.click(); });
-    // Auto-enter watchdog: If user waits on the gate screen for 3.5 seconds, auto-enter into the 3D world
-    let gateTimer = null;
-    setInterval(() => { ... gateTimer = setTimeout(() => { btn.click(); }, 800); }, 300);
+    // Audio gesture unlock on deliberate Enter button click
+    document.addEventListener('click', function(e) {
+      const targetBtn = e.target.closest('button[data-testid="loader-enter"], .y9w63G_cta');
+      if (targetBtn && !isEntering) {
+        isEntering = true;
+        try {
+          if (window.__aengel_audioEngine && window.__aengel_audioEngine.ctx && window.__aengel_audioEngine.ctx.state === 'suspended') {
+            window.__aengel_audioEngine.ctx.resume();
+          }
+        } catch (_) {}
+      }
+    }, false);
```

### 2. `cloned_site/_next/static/chunks/2vs2yctr590c-.js` (Optimized simulated status delays)
```javascript
-let lv=[{label:"Transcoding textures",ms:1500},{label:"Resolving scene graph",ms:1200},{label:"Allocating buffers",ms:1100},{label:"Instancing geometry",ms:1500},{label:"Seeding compute fields",ms:1400},{label:"Compiling shaders",ms:2600},{label:"Linking render graph",ms:2200},{label:"Wiring composite passes",ms:1800},{label:"Warming pipelines",ms:0}];
+let lv=[{label:"Transcoding textures",ms:180},{label:"Resolving scene graph",ms:140},{label:"Allocating buffers",ms:120},{label:"Instancing geometry",ms:160},{label:"Seeding compute fields",ms:150},{label:"Compiling shaders",ms:240},{label:"Linking render graph",ms:200},{label:"Wiring composite passes",ms:160},{label:"Warming pipelines",ms:0}];
```

### 3. `cloned_site/_next/static/chunks/3-0-2h2vnc5wo.js` (Smooth fluid progress easing)
```javascript
-n=z.current?.16:.08
+n=z.current?.28:.18
```

## Local Verification
- Verified via CDP headless Chrome with WebGPU hardware flags:
  - Total time to 100% and Gate readiness reduced from ~15s to **3.48 seconds**.
  - Held on the Gate screen for 5.0+ seconds: confirmed zero premature auto-entry (`isGate: true`, `isExiting: false`).
  - Dispatched click on `[data-testid="loader-enter"]`: confirmed successful curtain exit into the 3D scene (`loaderVisible: false`).
  - Captured artifacts:
    - `verified_gate_waiting_live.png`
    - `verified_entered_scene_live.png`

## Deviations from Assessment
None; all changes directly implemented the preferred remediation.
