# Plan: Remove README.md and Verify Full Portfolio Health

## 1. Technical Strategy
1. **File Removal**:
   - Safely remove `README.md` using `git rm README.md`.
   - Remove `specs/008-clean-human-readme/` using `git rm -rf specs/008-clean-human-readme`.
2. **Spec Kit Configuration**:
   - Update `.specify/feature.json` to point to `specs/009-remove-readme-and-verify-portfolio`.
3. **Full Portfolio Verification Protocol**:
   - Verify `cloned_site/` structure: check file count, presence of `index.html`, `lite.html`, `projects.html`, `about.html`, `contact.html`.
   - Verify `cloned_site/assets/`: ensure all 184 assets are intact.
   - Run Node.js syntax checks on `cloned_site/custom-enhancements.js`.
   - Query live HTTP endpoints to guarantee zero downtime or broken asset references.
4. **Git Commit & Sync**:
   - Stage and commit the cleanup in Git following conventional commits (`chore: remove README.md and verify portfolio integrity`).
