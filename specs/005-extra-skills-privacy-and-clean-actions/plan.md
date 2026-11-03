# Implementation Plan: Extra Skills Privacy & Clean Actions

## Architecture & Code Changes

### 1. `cloned_site/custom-enhancements.js`
- **In `AI_VIDEOS_CONFIG`**:
  - Update Card 4:
    - `badge: 'COMMERCIAL NARRATIVE & MOTION'`
    - `category: 'COMMERCIAL NARRATIVE & VISUAL DIRECTION'`
    - `title: 'Creative Brand Storytelling: Visual Production'`
    - `tools: ['Cinematic Direction', 'Motion Graphics', 'Sound Design', 'Storyboarding']`
    - `desc: 'High-impact commercial storytelling combining bespoke cinematic narration with synchronized kinetic motion design, dynamic pacing, and broadcast audio engineering.'`
- **In `openMyVideosModal()`**:
  - Remove `<a class="mh-videos-folder-btn" ...>` from the modal header.
  - Remove `<a class="mh-vid-drive-btn" ...>` from the card actions row.
  - Update modal subline to remove "neural voice synthesis" -> "High-craft commercial direction, kinetic motion graphics, system explainers, and cinematic post-production."
- **In Terminal / HUD / About**:
  - Replace references to "Runway", "Kling", "Luma", "Sora", "ElevenLabs" with "Creative Direction", "Motion Design", "VFX", "Sound Design".

### 2. `cloned_site/custom-enhancements.css`
- Update `.mh-vid-play-btn` and `.mh-vid-actions-row` to ensure `WATCH PREVIEW` spans 100% width cleanly.
- Remove obsolete `.mh-videos-folder-btn` and `.mh-vid-drive-btn` styles.

### 3. Verification & Deployment
- Test with headless Chrome script to verify no Drive links and no leaked tool names exist in the DOM.
- Bump asset cache version in HTML files.
- Commit to git `main` and deploy to both GitHub Pages targets.
