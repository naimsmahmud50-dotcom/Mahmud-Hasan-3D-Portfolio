# Bug Assessment: Extra Skills Modal Scroll Failure

- **Slug**: extra-skills-scroll
- **Created**: 2026-11-03T13:21:00+06:00
- **Source**: "amr ai page ta dekho ami jokhn ai page a thaki and scroll kori tkhn amr ai page ta scroll hoy na"
- **Verdict**: valid
- **Severity**: high

## Report (verbatim or summarized)
> "amr ai page ta dekho ami jokhn ai page a thaki and scroll kori tkhn amr ai page ta scroll hoy na"
The user reported that when the "Extra Skills & Video Productions" modal is open, scrolling the page/modal does not work. Content cards 5 and 6 remain hidden below the fold and unreachable.

## Symptom
When the Extra Skills modal is opened, attempting to scroll with the mouse wheel, trackpad, touch swipe, or keyboard does not scroll the modal or reveals erratic behavior. Specifically:
1. When the cursor is on the backdrop padding/margins outside the dialog, wheel events hit the backdrop which had no `overflow-y: auto`, resulting in zero scroll (`scrollTop: 0`).
2. Global scroll managers (Lenis / Three.js event listeners) can intercept or cancel wheel/touch events if elements lack `data-lenis-prevent` attributes.
3. Lack of explicit wheel propagation stopper (`e.stopPropagation()`) allowed background listeners to interfere.

## Reproduction
1. Open the portfolio site (either root 3D experience or `/lite`).
2. Click "EXTRA SKILLS" in the top navbar.
3. Attempt to scroll down using mouse wheel while hovering over the backdrop or margins, or swipe on touch.
4. Observe that the modal does not scroll and cards 5 & 6 are not visible.

## Suspected Code Paths
- `cloned_site/custom-enhancements.css`: `.mh-videos-modal-backdrop` and `.mh-videos-modal-dialog` overflow and flexbox rules.
- `cloned_site/custom-enhancements.js`: `openMyVideosModal()` modal DOM creation and event listener bindings.

## Root Cause Hypothesis
Confidence: High.
1. The modal backdrop was styled with `display: flex; align-items: center; justify-content: center;` without `overflow-y: auto`. Any wheel event landing outside the inner dialog box did not scroll.
2. The modal elements lacked Lenis bypass attributes (`data-lenis-prevent="true"`, `data-lenis-prevent-wheel="true"`, `data-lenis-prevent-touch="true"`), allowing smooth-scroll handlers to intercept wheel/touch events.
3. Missing wheel & touch propagation handlers to direct all user scroll gestures across the overlay to the dialog's `scrollTop`.

## Proposed Remediation
**Preferred**:
1. In `cloned_site/custom-enhancements.css`:
   - Set `.mh-videos-modal-backdrop` to `overflow-y: auto !important; -webkit-overflow-scrolling: touch !important; overscroll-behavior: contain !important;` with `justify-content: flex-start !important;` and `padding: 40px 20px !important;`.
   - Set `.mh-videos-modal-dialog` to `margin: auto !important; overscroll-behavior: contain !important; touch-action: pan-y !important;`.
   - Widen custom scrollbar to 7px with clear thumb hover contrast for effortless click & drag.
2. In `cloned_site/custom-enhancements.js`:
   - Add `data-lenis-prevent="true" data-lenis-prevent-wheel="true" data-lenis-prevent-touch="true"` to both modal backdrop and dialog elements.
   - Attach a dedicated `wheel` event listener to `#mh-my-videos-modal` that stops propagation to the window and dynamically scrolls `dialog.scrollTop += e.deltaY`.
   - Attach `touchstart` and `touchmove` listeners for seamless touch/mobile swipe scrolling.
   - Add keyboard scroll handling (`ArrowDown`, `ArrowUp`, `PageDown`, `PageUp`, `Space`) for full accessibility.

## Files likely to change
- `cloned_site/custom-enhancements.css`
- `cloned_site/custom-enhancements.js`
- Cache-busting queries in HTML files.

## Tests to add or update
- Automated Playwright/CDP test `scripts/test_scroll_fix.mjs` verifying wheel scrolling on both backdrop and dialog elements.
