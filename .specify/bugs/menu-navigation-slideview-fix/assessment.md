# Bug Assessment: Menu Navigation & About Modal Failure in Project Slide View

- **Slug**: menu-navigation-slideview-fix
- **Created**: 2026-11-07T20:15:00+06:00
- **Source**: User uploaded screenshot and bug report
- **Verdict**: valid
- **Severity**: high

## Report (verbatim or summarized)
"project slideview te jawyar por onnno kno menute jawyar jonno menu kno button a click korle akta somossa dekha dicche jmn about a click korle amon ta ashe pic a dewya then aro kichu somossa dekha diche /speckit /using-superpowers /flutter-fix-layout-issues /speckit-bug-fix agula chack dew and fix koro tho tmr skill kaje lagiye"

Attachment: Screenshot `media_1794060408381_c0de02f4.png` showing `#mh-mobile-hud-modal` overlaying the slideview with mixed video showcases, unstyled close button, and hijacked navigation.

## Symptom
1. In "Project Slide View" (`/lite`), clicking the 3-dot menu and choosing **ABOUT** pops open a bloated, unstyled modal sheet (`#mh-mobile-hud-modal`) that mixes bio, 1-tap contact buttons, and promotional film previews ("As-Sunnah Foundation", "Royal Islamic Heritage") instead of presenting a clean, dedicated About section.
2. Clicking **CONTACT** in the menu forcefully opens an external WhatsApp link in a new tab instead of showing an in-app Contact sheet/card with email, socials, and contact methods.
3. Clicking **EXTRA SKILLS** vs **ABOUT** creates conflicting modals because both contain video player hooks and redundant content.
4. Clicking **HOME** on desktop from `/lite` forces `/?variant=full`, which re-triggers the gate loader and potential error boundaries.
5. Modal close buttons (`✕`) are misaligned and unstyled (appearing as default gray HTML buttons in the middle of content).

## Reproduction
1. Open the portfolio in mobile view, or click "PROJECT SLIDE VIEW" from the gate/resize prompt to navigate to `/lite`.
2. Tap the top-right 3-dot menu button (`button._rHu7W_menu`).
3. Click "ABOUT".
4. Observed: `#mh-mobile-hud-modal` pops open displaying avatar, bio, and video player previews.
5. Click "CONTACT" in the menu.
6. Observed: Browser forcefully navigates away to WhatsApp.

## Suspected Code Paths
- `cloned_site/custom-enhancements.js:1457-1467`: Hijacks `ABOUT` menu click to call `window.__mhOpenHud()`.
- `cloned_site/custom-enhancements.js:1469-1475`: Hijacks `CONTACT` menu click to call `window.open('https://wa.me/...')`.
- `cloned_site/custom-enhancements.js:1718-1875`: Injects `#mh-mobile-hud-modal` with mixed video cards and unstyled close button.
- `cloned_site/custom-enhancements.js:1477-1485`: Incomplete matching for `EXTRA SKILLS` menu link.
- `cloned_site/custom-enhancements.css`: Missing styles for `#mh-mobile-hud-modal` close button and modal separation.

## Root Cause Hypothesis
Confidence: High.
In `setupLiteNavigation()` within `cloned_site/custom-enhancements.js`, menu link handlers were hardcoded with placeholder intercepts:
1. `ABOUT` was bound to `window.__mhOpenHud()`, which was originally an experimental mobile HUD containing video previews.
2. `CONTACT` was bound to a crude `window.open` call for WhatsApp.
3. The content of "About" (personal background, engineering skills, credentials) was conflated with "Extra Skills" (video production portfolio).
4. The styling for the close button inside `#mh-mobile-hud-modal` was broken due to uncontained CSS selectors.

## Proposed Remediation

**Preferred**:
1. **Refactor Menu Interceptions in `setupLiteNavigation()`**:
   - **ABOUT**: Open a dedicated, pristine **About Modal / Drawer** containing Mahmud Hasan's verified professional bio, core tech stack, and experience. **Exclude all promotional videos** from this view.
   - **CONTACT**: Open a dedicated, pristine **Contact Modal / Drawer** displaying verified contact channels:
     - Direct Email (`mahmudhasan.infodev@gmail.com`) with 1-tap Copy action and mailto.
     - WhatsApp Direct (`+8801767850859`).
     - LinkedIn Profile (`/in/mahmud-hasan-687908269`).
     - GitHub Profile (`/naimsmahmud50-dotcom`).
   - **EXTRA SKILLS**: Strictly dedicated to the Creative Media & Motion Direction studio archive (`openMyVideosModal()`).
   - **HOME**: Smoothly transition to the start of the slide view or navigate to `/` gracefully without reload loops.
   - **PROJECTS**: Smoothly reset slide view to Project 01 and close the menu.
2. **Fix Modal Close Buttons & Layout Styling**:
   - Give close buttons a high-craft circular glassmorphism design with `✕` centered, positioned at top-right with `z-index: 100`, hover glow, and accessible touch target (44x44px).
   - Ensure smooth slide-up and fade-in animations with backdrop blur.
   - Ensure touch scrolling inside the drawer is smooth (`-webkit-overflow-scrolling: touch`) and does not trap outer body scroll.

**Files likely to change**:
- `cloned_site/custom-enhancements.js`
- `cloned_site/custom-enhancements.css`
- `scripts/deploy_root_gh_pages.py`
- `scripts/deploy_gh_pages.py`

**Tests to add or update**:
- Headless Chrome CDP script to simulate clicking every menu item (HOME, PROJECTS, ABOUT, CONTACT, EXTRA SKILLS) on `/lite` and verify modal states and URLs.
- Screenshot captures of About and Contact drawers to verify visual fidelity.

## Risks & Considerations
- Low risk: changes are contained within client-side enhancement controllers and modal DOM nodes.
- Preserves all 3D WebGPU desktop functionality while perfecting the 2D slide-view experience.

## Open Questions
None. The symptom is completely reproducible and the solution is straightforward.
