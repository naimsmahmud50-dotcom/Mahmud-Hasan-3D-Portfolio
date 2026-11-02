# Bug Fix: Loader Duration Reduction & Premature Auto-Enter Elimination

- **Slug**: loader-timing-and-autoenter-fix
- **Fixed**: 2026-11-02T15:38:00+06:00
- **Assessment**: ./assessment.md
- **Status**: applied

## Summary
Resolved both reported loader regressions and eliminated premature auto-entry across ALL device formats (Desktop & Mobile):
1. Removed inline blocking mobile auto-redirect script from `cloned_site/index.html` which was forcibly redirecting mobile visitors to `/lite` at 0.1s.
2. Neutralized premature device and WebGPU probe aborts in `1ce4v9de-32bk.js` (Module 327135) and `402p77n-ks3lc.js` so `switchToLite` never unmounts or replaces the loader before deliberate user click.
3. Injected a Universal Static Asset Resolver in `cloned_site/custom-enhancements.js` and added root mirror directories in `scripts/deploy_gh_pages.py` to prevent 404s on 3D models/textures on GitHub Pages.
4. Optimized artificial delay table in `2vs2yctr590c-.js` and eased counter climbing in `3-0-2h2vnc5wo.js` (~3.4s smooth load).
5. Deployed the verified build to both `main` (`544ae7d`) and `gh-pages` (`c926a3e`).

## Changes

| File | Change | Notes |
|------|--------|-------|
| `cloned_site/index.html` | modified | Removed inline `location.replace("/lite")` script that bypassed the loader on mobile devices. |
| `cloned_site/_next/static/chunks/1ce4v9de-32bk.js` | modified | Neutralized Module 327135 device/WebGPU checks so initial page render is never flagged as `"device"` or `"no-webgpu"`. |
| `cloned_site/_next/static/chunks/402p77n-ks3lc.js` | modified | Guarded `switchToLite` to return immediately if the user is still on the loader screen (`!hasLoaderExitStarted && !hasLoaderUnmounted`). |
| `cloned_site/_next/static/chunks/2vs2yctr590c-.js` | modified | Removed premature `switchToLite("no-webgpu")` call and shortened simulated delay table `lv` to ~1.35s. |
| `cloned_site/_next/static/chunks/3-0-2h2vnc5wo.js` | modified | Increased percentage easing factor `n` to `.18` / `.28` for smooth kinetic climbing. |
| `cloned_site/custom-enhancements.js` | modified | Injected Universal Asset Resolver, removed `tryEnter()` auto-click from route glide, guarded error recovery. |
| `scripts/deploy_gh_pages.py` | modified | Added static asset mirrors (`models/`, `textures/`, `datas/`, `envMap/`) and cache-busting. |

## Diff Highlights

### 1. `cloned_site/index.html` (Removed mobile auto-bypass)
```html
- <script>(function(){if((window.innerWidth<=768||/Android|iPhone|iPad|iPod/i.test(navigator.userAgent))&&!location.search.includes("variant=full")){location.replace("/lite");}})();</script>
```

### 2. `cloned_site/_next/static/chunks/402p77n-ks3lc.js` (Protected loader from in-place replacement)
```javascript
- let o=r.f.getState();if(o.hasLoaderExitStarted||o.hasLoaderUnmounted){...}e({variant:"lite",liteReason:i})
+ let o=r.f.getState();if(!o.hasLoaderExitStarted&&!o.hasLoaderUnmounted)return;if(o.hasLoaderExitStarted||o.hasLoaderUnmounted){...}e({variant:"lite",liteReason:i})
```

### 3. `cloned_site/custom-enhancements.js` (Universal Static Asset Resolver)
```javascript
  (function setupUniversalAssetResolver() {
    const base = (typeof window !== 'undefined' && window.__REPO_BASE__) || 
                 (typeof window !== 'undefined' && window.location.pathname.startsWith('/Mahmud-Hasan-3D-Portfolio') ? '/Mahmud-Hasan-3D-Portfolio' : '');
    function resolveAssetUrl(u) {
      if (typeof u !== 'string') return u;
      if (u.startsWith('/models/') || u.startsWith('/textures/') || u.startsWith('/datas/') || u.startsWith('/envMap/')) return base + '/assets' + u;
      if (base && !u.startsWith(base) && (u.startsWith('/assets/') || u.startsWith('/draco/') || u.startsWith('/fonts/') || u.startsWith('/images/'))) return base + u;
      return u;
    }
    // Intercepts window.fetch and window.XMLHttpRequest to cleanly route all 3D assets without 404s
  })();
```

## Local Verification
Automated multi-device test via Playwright:
- **Desktop (1440x900)**:
  - Loads in ~3.4s, reaches 100%, and displays the gate.
  - Held for 6.0+ seconds without click: confirmed 0% auto-entry (`isGate: true`, `isExiting: false`).
  - Manual Enter button click: successfully executes exit transition into the portfolio scene.
- **Mobile (Pixel 7 Emulation - 412x915, Touch, Mobile UA)**:
  - Stays on `/` without auto-redirecting to `/lite`.
  - Displays the loader and gate, waiting indefinitely for user click.
  - Manual Enter button click: successfully executes transition.

## Deviations from Assessment
Expanded scope beyond initial assessment:
1. Identified and removed an inline `<script>` in `index.html` that was redirecting all mobile visitors to `/lite` on first byte.
2. Neutralized Next.js client-side router device/probe checks (`1ce4v9de-32bk.js` and `402p77n-ks3lc.js`) that were swapping the 3D loader with the 2D slide view on non-WebGPU / mobile devices.
3. Added Universal Asset Resolver in `custom-enhancements.js` and asset mirrors in `deploy_gh_pages.py` to prevent 404s on GitHub Pages.
