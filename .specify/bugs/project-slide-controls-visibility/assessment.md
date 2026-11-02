# Bug Assessment: Project Slide View Controls Contrast and Affordance Upgrade

- **Slug**: project-slide-controls-visibility
- **Created**: 2026-11-02T18:25:00+06:00
- **Source**: pasted text & user screenshot (`media_1793621186920_4c4afd7e.png`)
- **Verdict**: valid
- **Severity**: high

## Report (verbatim or summarized)
The user reported that inside the project slide view (when a project card is opened from the 3D scene):
"project slide a amon kno button ache project a click korar por ai button gula dekho dekha jay na akhn amk bolo aita kivabe aro valo vabe upgrade korte pari jate karon slide view te dekhai jay na jotokkhon cursor oitar upor na jay clint tho r jante na amr button kothay akhn asob button gula kon path a rakhcho?"

Accompanying screenshot (`media_1793621186920_4c4afd7e.png`) demonstrates:
- The project detail sheet (`_3nxWKG_sheet`) has a white/light-grey background (`--lite-stock: #f0f0f0`).
- The control buttons (`CLOSE`, `PREVIOUS`, `NEXT`, and `LIVE LINK`) have a light cyan border, but their text color is hardcoded to `#ffffff` with an ultra-faint translucent background (`rgba(0, 229, 255, 0.15)`).
- Result: On unhovered buttons (`CLOSE`, `NEXT`, `LIVE LINK`), the white text on a white/light-grey background has a contrast ratio of ~1.1:1, rendering the button labels completely unreadable.
- Only when the pointer is actively hovered over a button (e.g. `PREVIOUS`) does it fill with cyan and dark text, meaning clients have zero visual affordance or clue that interactive buttons are present until they stumble over them with a cursor (and on touch/mobile devices, hover doesn't exist).

## Symptom
1. When opening any project modal/slide view, the control buttons (`CLOSE`, `PREVIOUS`, `NEXT`, `LIVE LINK`) appear as faint, washed-out outlines with invisible white text on an off-white background.
2. Users and clients cannot discern what the buttons say or where the clickable actions are.
3. Mobile visitors cannot hover, making navigation and closing the slide extremely difficult.

## Reproduction
1. Open the portfolio site at `http://localhost:3001` (or live `https://naimsmahmud50-dotcom.github.io/`).
2. Click **ENTER IN THE EXPERIENCE**.
3. Open any project detail card (e.g. Maijrun Tech Store).
4. Observe the project hero navigation controls in the top-left/top-right (`CLOSE`, `PREVIOUS`, `NEXT`) and bottom right (`LIVE LINK`).
5. Notice that without cursor hover, the text is pure `#ffffff` on an off-white sheet background and cannot be read.

## Suspected Code Paths
1. `cloned_site/custom-enhancements.css:591-613`:
   - `._3nxWKG_action`: sets `background: linear-gradient(135deg, rgba(0, 229, 255, 0.15) 0%, rgba(0, 110, 255, 0.25) 100%) !important;` and `color: #ffffff !important;`.
   - On a light background sheet (`--lite-stock`), white text on light cyan tint causes complete contrast failure.
2. `cloned_site/_next/static/chunks/1g4_rbq7oliu6.js`:
   - Module `563715` defines class mappings:
     - `action: "_3nxWKG_action"`
     - `control: "_3nxWKG_control"`
     - `link: "_3nxWKG_link"`
     - `heroControls: "_3nxWKG_heroControls"`
   - Function `tp(action, text, style)` instantiates `tp("close", "CLOSE", "control")`, `tp("previous", "PREVIOUS", "control")`, `tp("next", "NEXT", "control")`.
   - Function `nF`:
     `case "control": { let t = document.createElement(null === e.href ? "button" : "a"); t.className = tK(e.style); t.setAttribute(tO, e.action); ... }`
3. `cloned_site/_next/static/chunks/27ghc9cd1reb0.css`:
   - Default core CSS sets:
     - `._3nxWKG_control { color: var(--lite-control); }`
     - `._3nxWKG_link { color: var(--lite-control); }`
     - `--lite-control: color-mix(in srgb, var(--lite-ink) 80%, var(--lite-stock));`

## Root Cause Hypothesis
The root cause is a color contrast breakdown in `cloned_site/custom-enhancements.css`:
The global selector `._3nxWKG_action` was styled with `color: #ffffff !important` and a 15% opacity cyan background (`rgba(0, 229, 255, 0.15)`). While white text works on dark 3D backgrounds, the project slide sheet (`_3nxWKG_sheet`) is rendered with a light background (`--lite-stock: #f0f0f0`). Pure white text on an off-white background results in severe WCAG contrast failure (< 1.2:1). Furthermore, the buttons lacked an opaque or dark-glass container backing, so the white background showed straight through.

## Proposed Remediation
**Preferred**:
Upgrade the styling in `cloned_site/custom-enhancements.css` with a high-contrast **Cyberpunk Luxury Dark-Glass Pill** aesthetic that works flawlessly on light and dark backgrounds:
1. **Container / Background**:
   - Give `._3nxWKG_action`, `._3nxWKG_control`, `._3nxWKG_link`, and `[data-control]` an opaque dark-glass background:
     `background: rgba(10, 16, 28, 0.92) !important;` with `backdrop-filter: blur(12px) !important;`.
   - Crisp border: `1.5px solid var(--mh-cyan, #00e5ff) !important;`.
   - Modern pill geometry: `border-radius: 9999px !important;`, comfortable padding `10px 22px !important;`.
2. **Typography & Readability**:
   - Unhovered text color: High-contrast bright cyan `#00e5ff !important;` (or `#ffffff !important;` on the dark-glass pill background). Both guarantee an AAA contrast ratio (> 12:1) against `#0a101c` and clearly stand out against the white sheet!
   - Font: `font-family: var(--font-navbar-display, 'Space Grotesk', sans-serif) !important; font-weight: 700 !important; letter-spacing: 0.12em !important; text-transform: uppercase !important; font-size: 13px !important;`.
   - Icon styling: Arrow icons in `LIVE LINK` and marks inherit `currentColor` (`#00e5ff`) with glowing drop shadow.
3. **Interactive Hover State**:
   - Invert to solid neon cyan: `background: #00e5ff !important; color: #000000 !important;`
   - Glowing halo: `box-shadow: 0 0 24px rgba(0, 229, 255, 0.8), 0 4px 12px rgba(0,0,0,0.5) !important;`.
   - Slight scale: `transform: translateY(-2px) scale(1.05) !important;`.
4. **Specific Controls**:
   - `[data-control="close"]`: Add a red/coral hover accent option or clear close indicator.
   - `[data-control="live"]`: Distinct cyan gradient pill with arrow animation to indicate external link.

**Alternatives**:
- *Solid Inverted Minimalist*: Dark charcoal `#111111` pill with `#ffffff` text, inverting to `#00e5ff` on hover.
- *Light Sheet Adaptive*: Dark text `#111111` directly on the white sheet. (Rejected because it loses the cyberpunk portfolio identity).

**Files likely to change**:
- `cloned_site/custom-enhancements.css`
- `cloned_site/_next/static/chunks/1g4_rbq7oliu6.js` (if SVG icon styling or DOM attributes need direct tuning)

**Tests to add or update**:
- Automated Playwright screenshot test capturing project slide view with unhovered and hovered button states.
- Contrast ratio verification (> 7:1 WCAG AAA standard).

## Risks & Considerations
- Retain existing click event listeners in `1g4_rbq7oliu6.js` (`data-control="close"`, `data-control="previous"`, `data-control="next"`, `data-control="live"`).
- Maintain responsive layout on mobile where `previous` and `next` are hidden by default in `heroControls`.

## Open Questions
- None; user uploaded visual evidence showing the exact issue and requested file paths and upgrade solution.
