# Spec Kit Bug Assessment: Projects Button 3D Scene Navigation Fix

- **Slug**: projects-button-3d-navigation-fix
- **Reported Date**: 2026-11-08
- **Verdict**: Confirmed Defect

---

## 1. Problem Description & User Impact
When clicking the `PROJECTS` button in the navbar (or navigating to `/?variant=full&glide=projects` / `/projects`), the 3D WebGL camera was failing to reach the interactive rotating cards cylinder (`scene2`). Instead, users were presented with:
1. Floating stone ruins suspended in darkness.
2. Violent camera shaking / screen quake ("kapakapi").
3. The projects carousel HUD never mounted or displayed project details.

---

## 2. Root Cause Analysis
1. **Suppression of Native 3D State Transition**:
   - Next.js and Three.js rely on an internal Zustand route coordinator (`module 332761`) and route enum (`module 878046`).
   - The 3D project cylinder scene is rendered **conditionally**:
     `eo.f.getState().route.scene === "projects"`
   - In `custom-enhancements.js`, a capture-phase click interceptor was calling `e.stopImmediatePropagation()`. This halted React's click listener before it could invoke `(0, f.f)(m.p.PROJECTS)`.
   - As a result, `route.scene` remained `"landing"`.

2. **Flawed Scroll Calculation in Scene 1**:
   - The click interceptor attempted to calculate the projects scroll position as:
     `scene1.offsetTop + scene1.offsetHeight * 0.5755` ($\approx 2993\text{px}$ to $5479\text{px}$).
   - In `scene: "landing"`, this scroll offset corresponds to the GSAP intro timeline where the stone archway breaks apart into floating debris and `sfxLandingQuake` is triggered.
   - The actual 3D projects carousel is hosted at `#scene2` (offset 5200px), requiring the 3D scene machine to be in `"projects"` mode to be visible.

3. **Missing Global Bridge to Route Store**:
   - The route store (`eo.f`) and route definitions (`es` / `m.p`) were not exposed to global scope, making it impossible for external click handlers and deeplink glides to instruct the WebGL engine directly.

---

## 3. Proposed Remediation
1. **Expose 3D Route Engine Hooks**:
   - In `cloned_site/_next/static/chunks/1ce4v9de-32bk.js`, expose:
     `window.__mhNavigate = f.f; window.__mhRoutes = m.p;`
   - In `cloned_site/_next/static/chunks/2vs2yctr590c-v2.js`, expose:
     `window.__mhRouteStore = eo.f; window.__mhRouteEnum = es;`
2. **Dispatch Direct Route Requests in Click Handlers**:
   - In `cloned_site/custom-enhancements.js`, update the `PROJECTS`, `ABOUT`, `CONTACT`, and `HOME` handlers.
   - When on the 3D canvas, immediately trigger:
     `window.__mhRouteStore.getState().request(window.__mhRoutes.PROJECTS, 'deeplink')`
   - This cleanly switches `route.scene` to `"projects"`, automatically scrolls to `scene2.offsetTop` (5200px), mounts the HUD, and awakens the cylinder carousel without camera shake.
3. **Update Auto-Glide Logic**:
   - In `setupRouteAutoGlide`, poll for `window.__mhRouteStore` and invoke the deeplink route transition for `glide=projects`, `glide=about`, and `glide=contact`.
4. **Deploy Updates**:
   - Build and verify locally on port 3001, then deploy to GitHub Pages (both root and project repos).

---

## 4. Files Likely to Change
- `cloned_site/_next/static/chunks/1ce4v9de-32bk.js`
- `cloned_site/_next/static/chunks/2vs2yctr590c-v2.js`
- `cloned_site/custom-enhancements.js`
- Deployment bundles (`naimsmahmud50-dotcom.github.io` and `Mahmud-Hasan-3D-Portfolio`)

---

## 5. Verification Criteria
- Clicking `PROJECTS` button transitions `route.scene` to `"projects"` and `phase` to `"idle"`.
- `scrollY` advances to 5200px.
- The 3D project HUD (`zaNkXW_root`) mounts with "Madrasah Ecosystem".
- No screen quake or broken stone ruins visible.
