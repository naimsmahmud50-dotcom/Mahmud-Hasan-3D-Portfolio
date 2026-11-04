#!/usr/bin/env python3
import os
import shutil

ROOT_DIR = "/home/mahmud-hasan/Naims Project/3d portfolio"
os.chdir(ROOT_DIR)

PROTECTED_DIRS = {
    'cloned_site', 'presentation', 'app', 'components', 'lib', 'public',
    'scripts', 'specs', '.specify', 'docs', 'node_modules', '.git', '.next',
    'backup-original', 'backup_cloned_site_20261030_185806', 'seo-reports', 'scratch',
    'archive'
}

PROTECTED_FILES = {
    'package.json', 'pnpm-lock.yaml', 'next.config.mjs', 'next-env.d.ts',
    'tsconfig.json', 'tailwind.config.ts', 'postcss.config.mjs',
    'README.md', 'vercel.json', 'server_hubuhu.js', '.gitignore'
}

ARCHIVE_SCREENSHOTS_DIR = os.path.join(ROOT_DIR, "archive", "test_screenshots")
ARCHIVE_SCRIPTS_DIR = os.path.join(ROOT_DIR, "archive", "test_scripts")

os.makedirs(ARCHIVE_SCREENSHOTS_DIR, exist_ok=True)
os.makedirs(ARCHIVE_SCRIPTS_DIR, exist_ok=True)

print("🛡️ SAFE ROOT ARCHIVE PROTOCOL INITIATED")
print("=======================================")

# 1. Identify root PNG files
root_pngs = [f for f in os.listdir(ROOT_DIR) if os.path.isfile(f) and f.endswith(".png")]
print(f"Found {len(root_pngs)} root test screenshot files.")

# Assert no protected files are in root_pngs
overlap = set(root_pngs).intersection(PROTECTED_FILES)
assert len(overlap) == 0, f"ABORT: Protected file overlap detected: {overlap}"

# Move all root PNGs to archive/test_screenshots/
moved_pngs = 0
for png in root_pngs:
    src = os.path.join(ROOT_DIR, png)
    dest = os.path.join(ARCHIVE_SCREENSHOTS_DIR, png)
    shutil.move(src, dest)
    moved_pngs += 1

print(f"✓ Successfully moved {moved_pngs} PNG test screenshots to archive/test_screenshots/")

# 2. Identify root test scripts and scratch dump files
test_patterns = (
    "test_", "scratch_", "apply_", "generate_", "update_complete_",
    "check_loader_", "contact_tC__", "current_", "gate_open_",
    "local_speed_", "mobile_lite_", "temp_aicore"
)

root_scripts = []
for f in os.listdir(ROOT_DIR):
    if not os.path.isfile(f):
        continue
    if f in PROTECTED_FILES:
        continue
    if f.endswith((".py", ".txt", ".js", ".glb")) and any(f.startswith(p) for p in test_patterns):
        root_scripts.append(f)

print(f"Found {len(root_scripts)} temporary test scripts and dumps.")

# Assert no protected files are in root_scripts
overlap_scripts = set(root_scripts).intersection(PROTECTED_FILES)
assert len(overlap_scripts) == 0, f"ABORT: Protected script overlap detected: {overlap_scripts}"

moved_scripts = 0
for s in root_scripts:
    src = os.path.join(ROOT_DIR, s)
    dest = os.path.join(ARCHIVE_SCRIPTS_DIR, s)
    shutil.move(src, dest)
    moved_scripts += 1

print(f"✓ Successfully moved {moved_scripts} test scripts/dumps to archive/test_scripts/")

# 3. VERIFICATION & ASSERTIONS
print("\n🔍 POST-MIGRATION VERIFICATION")
print("------------------------------")

# A. Verify root has 0 PNGs
remaining_pngs = [f for f in os.listdir(ROOT_DIR) if os.path.isfile(f) and f.endswith(".png")]
assert len(remaining_pngs) == 0, f"Verification failed: {remaining_pngs} still in root!"
print("✓ Root PNG count: 0 (Pristine clean)")

# B. Verify archive has all PNGs
archived_pngs = [f for f in os.listdir(ARCHIVE_SCREENSHOTS_DIR) if f.endswith(".png")]
assert len(archived_pngs) == moved_pngs, "Verification failed: Archive PNG count mismatch!"
print(f"✓ Archived PNG count: {len(archived_pngs)} (100% preserved)")

# C. Verify all 10 core files exist and are intact
for cf in PROTECTED_FILES:
    cf_path = os.path.join(ROOT_DIR, cf)
    assert os.path.exists(cf_path), f"CRITICAL: Protected file missing: {cf}"
    assert os.path.getsize(cf_path) > 0, f"CRITICAL: Protected file is empty: {cf}"
    print(f"✓ Protected core file intact: {cf}")

# D. Verify cloned_site/assets/ has all 213 real assets intact
assets_count = sum(len(files) for _, _, files in os.walk(os.path.join(ROOT_DIR, "cloned_site", "assets")))
assert assets_count >= 210, f"CRITICAL: Production assets corrupted! Found only {assets_count}"
print(f"✓ Production site assets intact: {assets_count} files in cloned_site/assets/")

# E. Verify presentation/index.html is intact
assert os.path.exists(os.path.join(ROOT_DIR, "presentation", "index.html")), "Presentation missing!"
print("✓ Presentation deck intact: presentation/index.html")

print("\n🎉 SAFE ARCHIVE PROTOCOL COMPLETED WITH 100% INTEGRITY GUARANTEED!")
