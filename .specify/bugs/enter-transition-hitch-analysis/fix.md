# Bug Fix: Synchronized 60 FPS Enter Transition (Zero Hitch, Zero Abrupt Drop)

## Target Bug
- Freezing / hanging hitch on clicking Enter ("বাইজা যাওয়া")
- Abrupt camera slam / sudden pop-in ("ধপ কইরা একসাথে ঢোকা")

## Root Causes Identified
1. **Opaque Curtain Duration Mismatch**: `LOADER_EXIT_TO_REVEAL_MS` and `--loader-exit-duration` were set to 2200ms with a slow cubic-bezier. This kept the black container opaque for ~1.5 seconds, giving the appearance of a frozen / stalled page.
2. **Hidden High-Velocity Camera Acceleration**: Behind the black curtain, the 3D landing camera timeline (`duration: 2.85s`) was running unseen. By the time the screen cleared at ~1.8s, the camera was already traveling at peak velocity, causing an abrupt drop/slam sensation.
3. **Hardcoded 2.3s Arrival Stalling**: `S = { full: 2.3 }` in `1361kj0d795e7.js` and `setTimeout(2300)` kept UI and unmounting delayed until 2.3 seconds, causing sudden simultaneous UI popping.

## Applied Remediation
1. `cloned_site/_next/static/chunks/3-0-2h2vnc5wo.js`:
   - Reduced exit duration from 2200ms to 750ms.
   - Reduced unmount timeout from 2300ms to 800ms.
2. `cloned_site/_next/static/chunks/1361kj0d795e7.js`:
   - Updated `S = { full: 0.8, compressed: 1 }` so `setArrivalSceneRevealed(true)` fires in exact harmony with loader unmount.
3. `cloned_site/custom-enhancements.css`:
   - Added GPU-accelerated smooth transition on `.y9w63G_loaderContainer.y9w63G_exiting` with `0.75s cubic-bezier(0.16, 1, 0.3, 1)`.
