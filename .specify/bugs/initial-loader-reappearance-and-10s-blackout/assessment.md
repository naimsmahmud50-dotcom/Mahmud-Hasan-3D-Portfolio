# Bug Assessment: Initial Loader Reappearance and 10-Second Blackout

## 1. Overview & Symptom Description
- **Reported by User**:
  > "suno kno feature a hat diba r prothom j page asto seta abr astache r loading ta hoccche sathe black hoye thake pray 10 second ar moto matha thanda koro pera nai aste dhire onno kno feature a hat diba na karon ta khuje ber kore ano"
- **Observed Symptoms**:
  1. **Loader Screen Reappearance**: On fresh visits (no pre-existing `sessionStorage`), the initial landing enter interface (`.y9w63G_loaderContainer` with MAHMUD AI ARCHITECT, ticket card, 0% percentage counter, and ENTER button) is rendered on screen.
  2. **10-Second Blackout**: Shortly after page load, the screen turns pitch black and remains dark for ~10 seconds before the 3D scene suddenly appears.
  3. **Visual Jank / Glitch**: The transition between the static HTML loader, `#mh-fast-init-loader`, and the Three.js WebGL canvas creates an abrupt blackout.

---

## 2. Root Cause Analysis

### Cause 1: Conditional Session Bypass in Static HTML
In `cloned_site/index.html`:
```html
<script id="mh-early-session-check">
(function() {
  try {
    var hasEntered = sessionStorage.getItem('mh_entered_experience') === 'true';
    var params = new URLSearchParams(window.location.search || '');
    var hasTarget = params.has('target') || params.has('glide');
    if (hasEntered || hasTarget) {
      document.documentElement.classList.add('mh-bypass-loader');
    }
  } catch(e) {}
})();
</script>
```
- On a fresh visit, `hasEntered` is `false` and `hasTarget` is `false`.
- Therefore, `document.documentElement.classList.add('mh-bypass-loader')` is **never executed**.
- As a result, CSS rule `.mh-bypass-loader .y9w63G_loaderContainer { display: none !important; }` does **not apply**.
- The static HTML in `index.html` line 36 immediately renders `.y9w63G_loaderContainer` with the ticket card, percentage counter, and enter button.

### Cause 2: React Asset Preloader Dependency (`"done" === t`)
In `_next/static/chunks/15rpswwaw33xn.js`:
- The Three.js canvas (`lb.f`) and 3D scene components are conditionally mounted:
  `"done" === t && <Canvas>...`
- `t` represents React loader status (`window.__mhLoaderStore.status`).
- It only transitions to `"done"` after `lC` downloads non-KTX2 and KTX2 assets across all scenes:
  - `envMap5.v2.ktx2` (6.95 MB)
  - `rockNormal.v2.bc7.ktx2` (4.73 MB)
  - `plantsNormal.v2.bc7.ktx2` (1.89 MB)
  - `plants.v2.bc7.ktx2` (1.80 MB)
  - `envMap10.v2.ktx2` (1.57 MB)
  - Audio and WASM files (~5 MB)
  Total asset payload: **20-25 MB**.
- On network connections with 20-30 Mbps bandwidth, downloading 25 MB takes **7 to 10 seconds**.

### Cause 3: Premature Disconnect Between Custom Loader and Three.js Readiness
In `custom-enhancements.js`:
- `MH_BYPASS_INITIAL_ENTER_SCREEN` forcefully hides `.y9w63G_loaderContainer` and displays `#mh-fast-init-loader` (a `#111318` radial gradient overlay).
- But because React's `"done" === t` has not occurred yet, the canvas behind `#mh-fast-init-loader` does not exist.
- When `#mh-fast-init-loader` is dismissed (or during the gap), the user stares at a pitch-black screen for the remaining 6-8 seconds while textures download.

---

## 3. Remediation Strategy (Zero Feature Disruption)

1. **Permanently Hide the Initial Enter Screen by Default (Configurable)**:
   - Ensure `html` gets `.mh-bypass-loader` unconditionally on root load while keeping `MH_BYPASS_INITIAL_ENTER_SCREEN` as a toggle in `custom-enhancements.js` so it can be re-enabled instantly whenever requested.
2. **Smooth, Informative Preload Experience (No Pure Black Hole)**:
   - Rather than an empty 10-second blackout, provide a polished, lightweight cyber-minimalist status indicator ("INITIALIZING 3D UNIVERSE", brand badge) that stays active until the canvas is actually rendered and illuminated (`exposure >= 1`).
   - Smoothly fade out the veil once `hasCanvas` and `landingVisible` are confirmed, eliminating the abrupt black drop.
3. **Preserve All 7 Features Intact**:
   - 3D Nature Home scene (Arch, pond, waterlily, rocks, tree, spotIntensity)
   - Projects 3D scene (Curved cylinder carousel, discover button, slide view)
   - About Mahmud details (Photo, 6-item cyber skills matrix, bio)
   - Vertical navbar (All 7 links)
   - Dhaka Real-time Clock (BST)
   - Sound toggle & Terminal (Cmd+K)
   - Video modal
