# Feature Specification: 007-safe-root-cleanup-and-archive

## Executive Summary
This feature establishes a zero-risk, strictly whitelisted archiving protocol for the project root directory. It safely isolates all 89 temporary automated test screenshots and debugging scripts into structured archive directories (`archive/test_screenshots/` and `archive/test_scripts/`) while ensuring 100% preservation of all source code, production assets, and configuration files.

---

## User Stories

### P1: Zero-Loss Whitelisted Root Cleanup
**As a** project owner and developer,  
**I want** all temporary `.png` test captures and test `.py` scripts removed from the root directory into safe archive folders,  
**So that** my root workspace displays only legitimate source code and project directories without losing a single file.

### P2: Guaranteed Core System Integrity
**As a** developer,  
**I want** core application files (`package.json`, `next.config.mjs`, `server_hubuhu.js`, `cloned_site/`, `presentation/`, etc.) strictly protected with hard programmatic assertions,  
**So that** there is 0% probability of accidentally modifying or deleting any critical project asset.

---

## Strict Whitelist Protocol

### Protected Directories (Never Modified)
- `cloned_site/` (Production 3D website & 213 assets)
- `presentation/` (Interactive presentation deck)
- `components/`, `app/`, `lib/`, `public/`, `docs/`, `specs/`, `scripts/`, `.specify/`, `node_modules/`, `.git/`, `.next/`

### Protected Root Files (Never Modified)
- `package.json`, `next.config.mjs`, `tailwind.config.ts`, `tsconfig.json`
- `postcss.config.mjs`, `README.md`, `server_hubuhu.js`, `vercel.json`
- `pnpm-lock.yaml`, `next-env.d.ts`

### Target Move List
- 89 root `.png` test captures ➔ `archive/test_screenshots/`
- Root temporary scripts (`test_*.py`, `temp_aicore.glb`, `contact_tC__*`) ➔ `archive/test_scripts/`

---

## Acceptance Criteria
1. Root directory contains 0 clutter `.png` files.
2. All 10 core root configuration files remain intact and accessible.
3. Production website (`cloned_site/`) has 0 changes.
4. All archived files remain 100% recoverable if needed.
