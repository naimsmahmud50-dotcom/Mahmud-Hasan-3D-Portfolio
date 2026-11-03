# Feature Specification: Extra Skills Privacy & Clean Actions

- **Feature Directory**: `specs/005-extra-skills-privacy-and-clean-actions`
- **Created**: 2026-11-03T13:40:00+06:00
- **Status**: In Progress

## 1. Problem Statement & User Intent
The user specifically requested two critical adjustments to the "Extra Skills & Video Productions" modal and related site sections:
1. **Remove all Google Drive links**: The user does not want any direct links to their private Google Drive vault or per-video Google Drive share links visible on the website.
2. **Remove revealing voice/video generation tooling**: The user does not want clients or viewers to know which third-party tools or sources were used to generate voice or video (e.g., ElevenLabs, Runway Gen-3, Kling AI, Luma Dream Machine, Sora, Neural Voice Cloning). The work must be presented strictly under professional creative direction, motion design, sound architecture, and cinematic post-production.

## 2. User Stories
- **US1 (Client Privacy & Cleaner UI)**: As the portfolio owner, I want the "DRIVE VAULT" and "DRIVE ↗" buttons removed so that viewers cannot access or see direct Google Drive file/folder links.
- **US2 (Proprietary Production Privacy)**: As the portfolio owner, I want all mentions of third-party voice generators (ElevenLabs) and video generation tools (Runway, Kling, Luma, Sora) replaced with high-craft industry terms (Creative Direction, Motion Design, Sound Architecture) so that my workflow secrets remain private.
- **US3 (Full-Width Action Button)**: As a visitor, I want each video card to have a clear, full-width "WATCH PREVIEW" button that triggers the in-modal video player smoothly.

## 3. Acceptance Criteria
- [ ] No `DRIVE VAULT` or `DRIVE ↗` buttons exist in the Extra Skills modal header or cards.
- [ ] No external Google Drive links are exposed in the DOM.
- [ ] Card 4 title, badge, category, tools, and description are updated to professional creative storytelling without mentioning "ElevenLabs", "AI Video Generation", or "Voice Cloning".
- [ ] Terminal outputs, About chips, and Mobile HUD matrix no longer leak "Runway", "Kling", "Luma", "Sora", or "ElevenLabs".
- [ ] Each card's `WATCH PREVIEW` button is full-width, clean, and interactive.
