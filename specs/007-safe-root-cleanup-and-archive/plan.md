# Implementation Plan: 007-safe-root-cleanup-and-archive

## Architecture Blueprint

```text
Before Cleanup:
/home/mahmud-hasan/Naims Project/3d portfolio/
├── 89 scattered test .png files (takes 35 MB)
├── 17 test_*.py scripts & dumps
├── package.json, next.config.mjs, etc. (buried in clutter)
└── cloned_site/, presentation/, etc.

After Safe Archiving:
/home/mahmud-hasan/Naims Project/3d portfolio/
├── archive/
│   ├── test_screenshots/    <- (89 test PNGs safely organized here)
│   └── test_scripts/        <- (test_*.py and scratch dumps organized here)
├── cloned_site/             <- (100% untouched)
├── presentation/            <- (100% untouched)
├── components/              <- (100% untouched)
├── scripts/                 <- (100% untouched)
├── package.json, next.config.mjs, server_hubuhu.js, ... (pristine & visible)
```

## Execution Steps
1. Create dedicated script `scripts/safe_archive_root.py` with programmatic assertions.
2. Execute migration with file-level auditing.
3. Verify directory contents post-migration.
4. Update tasks and git tracking.
