# Bug Assessment: Loader Duration Reduction & Premature Auto-Enter Elimination

- **Slug**: loader-timing-and-autoenter-fix
- **Created**: 2026-11-02T14:52:00+06:00
- **Source**: pasted text
- **Verdict**: valid
- **Severity**: high

## Report (verbatim or summarized)
The user reported two major issues on visiting the 3D portfolio:
1. Loading time is excessively long ("loading time onk beshi hoy"), and should be reduced while maintaining an elegant, smooth loading experience ("loading time ta komai diba aktu sundor vabe loading howya cai").
2. The portfolio automatically navigates/transitions into the home page before the user clicks the "ENTER IN THE EXPERIENCE" button ("enter click korar purbei amr home page a dhuke jacche").

## Symptom
1. When loading the site, the loader screen remained stuck in asset transcoding/shader warmup simulation for over 13-15 seconds due to inflated artificial setTimeout delays in the AssetPreloader warmup step array (`lv`).
2. Once the loader reached 100% ("Ready" / "Gate"), a premature watchdog timer in `cloned_site/custom-enhancements.js` auto-clicked the "ENTER IN THE EXPERIENCE" button after only 800ms, and a global `document.addEventListener('click')` handler triggered entry on any background click, robbing the user of the chance to view the gate and deliberately click Enter themselves.

## Reproduction
1. Start local server (`node server_hubuhu.js`).
2. Navigate to `http://localhost:3001/?variant=full` in a browser.
3. Observe that the progress counter and warmup status labels advance very slowly (~13.3s total simulated delay in `lv`).
4. Once the progress hits 100% and displays the gate, wait ~800ms without touching anything: notice the page immediately triggers enter and glides into the home page automatically before the user clicks the Enter button.

## Suspected Code Paths
- `cloned_site/custom-enhancements.js:1148-1187`: Global document click handler and `gateTimer` timeout (800ms) that calls `btn.click()` automatically.
- `cloned_site/_next/static/chunks/2vs2yctr590c-.js`: Artificial delay array `lv` with durations totaling 13,300ms (1.5s, 1.2s, 1.1s, 1.5s, 1.4s, 2.6s, 2.2s, 1.8s) for status text updates.
- `cloned_site/_next/static/chunks/3-0-2h2vnc5wo.js`: Progress interpolation rate `n = z.current ? .16 : .08` which causes slow number incrementing.

## Root Cause Hypothesis
1. **Premature Auto-Enter**: An intentional but poorly tuned failsafe watchdog timer was configured with an 800ms timeout (`setTimeout(() => btn.click(), 800)`), causing an automated button click almost immediately upon gate readiness. Additionally, a global click listener on `document` fired `btn.click()` if the user clicked anywhere on the viewport.
2. **Excessive Loading Duration**: The warmup phase in `2vs2yctr590c-.js` sequenced through an artificial delay table (`lv`) adding 13.3 seconds of purely simulated latency across 8 steps before dispatching `Ready`. Furthermore, the visual progress easing parameter in `3-0-2h2vnc5wo.js` was dampened at `0.08`, requiring many frames for the percentage counter to reach 100.

## Proposed Remediation
**Preferred**:
1. In `cloned_site/custom-enhancements.js`:
   - Remove the automated watchdog timeout (`gateTimer`) so the page never auto-enters without user intent.
   - Constrain the click listener so that entry is ONLY initiated when the user deliberately clicks the "ENTER IN THE EXPERIENCE" button (`[data-testid="loader-enter"]` / `.y9w63G_cta`) or presses `Enter`/`Space` on the keyboard.
   - Maintain the audio context gesture unlock when the user clicks the button.
2. In `cloned_site/_next/static/chunks/2vs2yctr590c-.js`:
   - Optimize the simulated status step array `lv` to swift, futuristic timings (~120ms - 200ms per step, ~1.2s total), allowing real GPU/WebGL warmup to proceed without artificial delay.
3. In `cloned_site/_next/static/chunks/3-0-2h2vnc5wo.js`:
   - Tune progress easing factor `n` (e.g. from `.08` to `.25` / `.30`), allowing the percentage counter to smoothly, fluidly, and dynamically count from 0 to 100% in ~1.5 - 2.5 seconds.

**Files likely to change**:
- `cloned_site/custom-enhancements.js`
- `cloned_site/_next/static/chunks/2vs2yctr590c-.js`
- `cloned_site/_next/static/chunks/3-0-2h2vnc5wo.js`

**Tests to add or update**:
- Automated test script validating that:
  - Loader reaches 100% in under 3.5 seconds.
  - Gate screen remains active without auto-entering for at least 5 seconds.
  - Clicking `[data-testid="loader-enter"]` properly and smoothly executes the 2.2s cinematic transition into the 3D scene.

## Risks & Considerations
- Retain proper WebGL/WebGPU context initialization and audio context resumption.
- Ensure the character roll kinetic typing animations on hover remain fully intact.

## Open Questions
- None; the requirements and technical root causes are fully identified.
