# Bug Assessment: Discovery Project Close Button Low Visibility

- **Slug**: discovery-close-button-visibility
- **Created**: 2026-11-03T09:59:00+06:00
- **Source**: User report with screenshot `media_1793677970766_cb103c00.png`
- **Verdict**: valid
- **Severity**: high

## Report

The user reported that across every discovery project view (when clicking "Discover project"), the `CLOSE` button in the top-left is barely visible against the bright, animated caustic background, making it hard for clients to find where to click to exit or return:

> *"project ar discover a thaka close button gula amon vabe ache j dekhai jacche na claint ar cokhe porbe na project ar proti ta discovery project a ai problem ta ache so aigular path gula khuje ber kre ane dew do it /speckit /using-superpowers"*

## Symptom

When a user enters a project's discovery view, the `CLOSE` button in the top-left:
1. Lacks a high-contrast background pill, border, or button container.
2. Lacks a distinct icon (such as `✕` or `←`).
3. Is drawn as plain, thin, semi-transparent white text (`C L O S E`) directly onto a Three.js canvas texture over an animated bright caustic glass background.
4. Clients cannot easily see or interact with it to return to the project carousel.

## Reproduction Steps

1. Open `http://localhost:3001/?variant=full` or `https://naimsmahmud50-dotcom.github.io/`.
2. Click "ENTER IN THE EXPERIENCE".
3. Click "Discover project" on any project card (e.g., Madrasah Ecosystem).
4. Look at the top-left corner above the project title.
5. Notice the bare, low-contrast `CLOSE` text blending into the animated background.

## Identified Code Paths & Root Causes

### 1. Primary 3D Canvas Rendering & Hit-Test Path
- **File**: `cloned_site/_next/static/chunks/2vs2yctr590c-.js`
- **Location**: Character offset ~182,061 (around line 142)
- **Code**:
  ```javascript
  let V = (
      e = z,
      (t = document.createElement("canvas")).width = 168,
      t.height = 88,
      r = t.getContext("2d"),
      (n = () => {
          r.setTransform(1, 0, 0, 1, 0, 0),
          r.clearRect(0, 0, t.width, t.height),
          r.scale(2, 2),
          r.font = aN,
          r.fillStyle = aV,
          r.textBaseline = "middle",
          r.fillText("CLOSE".split("").join(" "), 0, 22)
      })(),
      (a = new j.Nk(t)).colorSpace = j.nj,
      a.magFilter = j.VV,
      o = aB({
          rgb: (l = (0, C.zr)(a)).rgb,
          alpha: l.a,
          shared: e,
          bend: !1,
          grainScale: (0, C.Px)(new j.wq(3, 1))
      }),
      (s = new j.kE(new j.CQ(84 * aw, 44 * aw), o)).position.set((201 - e6.w / 2) * aw, (e6.J / 2 - 207.64) * aw, -12),
      s.layers.set(30),
      s.renderOrder = -999,
      s.frustumCulled = !1,
      { mesh: s, repaint() { n(), a.needsUpdate = !0 }, dispose() { ... } }
  );
  ```
- **Hit Test & Click Handling**:
  ```javascript
  u = (t, r) => (s(t, r), e.intersectObject(A.mesh, !1).length > 0)
  // ...
  if (u(e.clientX, e.clientY)) return void ei.f.getState().exitInterior();
  ```
- **Why it is invisible**: The 2D canvas context draws raw text with `r.fillText(...)` without drawing any filled background rectangle/rounded pill, border, or icon.

### 2. Interior State Management Path
- **File**: `cloned_site/_next/static/chunks/15rpswwaw33xn.js`
- **Location**: Character offset ~47,913
- **Code**:
  ```javascript
  exitInterior: () => {
      let { interiorStatus: t } = r();
      "interior" === t && ((0, n.y)("sfxStoneExit"), e({ interiorStatus: "exiting" }))
  }
  ```
- **Why it matters**: This is the Zustand store action that performs the actual exit animation back to the project list.

### 3. Slide View (2D / `/lite`) Close Button Path
- **File**: `cloned_site/_next/static/chunks/1g4_rbq7oliu6.js`
- **Location**: Character offset ~43,040
- **Code**:
  ```javascript
  tp("close", "CLOSE", "control")
  ```
- **Styled in**: `cloned_site/custom-enhancements.css` lines 500-550 (`._3nxWKG_control`, `[data-control]`).

### 4. Custom Enhancement Overlay HUD Path
- **Files**:
  - `cloned_site/custom-enhancements.js`: Function `setupProjectInteriorExitHud()` lines ~1250–1310
  - `cloned_site/custom-enhancements.css`: `#mh-interior-exit-hud`, `.mh-interior-exit-btn` lines ~1640–1720

## Proposed Remediation

### Preferred Solution (Dual High-Impact Enhancement):
1. **Direct 3D Texture Upgrade in `2vs2yctr590c-.js`**:
   - Update `(n = () => { ... })` in `2vs2yctr590c-.js` to draw a solid, modern, high-contrast dark badge / glowing cyan pill behind the text:
     - Draw rounded rectangle with solid dark fill `rgba(10, 15, 25, 0.95)` and crisp cyan border `rgba(0, 229, 255, 0.9)`.
     - Draw a clean `✕` icon preceding the `CLOSE` label.
     - Increase text contrast and weight.
2. **Synchronized Top-Left Floating HTML Overlay in `custom-enhancements.js`**:
   - Ensure an accessible, high-visibility, glassmorphic `[ ✕ CLOSE ]` pill button is always active in the top-left whenever `interiorStatus === 'interior'`, providing seamless 100% click reliability across all screen sizes and mobile touch.
