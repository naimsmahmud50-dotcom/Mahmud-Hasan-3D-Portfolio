# Spec Kit Bug Test: Navbar Inline Links & 3D Navigation Overhaul

## Verification Steps & Results
1. **Desktop 3D Experience**:
   - `HOME`: Successfully scrolled to `0`.
   - `PROJECTS`: Successfully scrolled to `scene1` (offset ~768px).
   - `ABOUT`: Successfully scrolled to `sceneAbout` (offset ~5867px).
   - `CONTACT`: Successfully scrolled to `sceneContactReveal` (offset ~14080px).
   - `EXTRA SKILLS`: Successfully triggered modal popup containing 7 Studio Archive videos.
   - `PROJECT SLIDE VIEW`: Navigates to `/lite`.
   - `GITHUB REPO`: Navigates to GitHub repository.
2. **Mobile Lite View**:
   - Verified 3-dot button is permanently hidden (`display: none !important`).
   - Verified all 7 navigation links are displayed inline and horizontally scrollable.
   - Verified `EXTRA SKILLS` opens modal popup without routing away.
3. **Automated Headless CDP Tests**:
   - Validated via automated headless Chrome CDP testing scripts.
