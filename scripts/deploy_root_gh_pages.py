#!/usr/bin/env python3
import os
import shutil
import subprocess
import re
import time

REPO_NAME = "naimsmahmud50-dotcom.github.io"
BASE_PATH = ""
SRC_DIR = "/home/mahmud-hasan/Naims Project/3d portfolio/cloned_site"
EXPORT_DIR = "/tmp/root-gh-pages-export"

print(f"🚀 Preparing Root GitHub Pages deployment for {REPO_NAME} (https://naimsmahmud50-dotcom.github.io/)...")

if os.path.exists(EXPORT_DIR):
    shutil.rmtree(EXPORT_DIR)

shutil.copytree(SRC_DIR, EXPORT_DIR)
print(f"✓ Copied static files to {EXPORT_DIR}")

# 1. Create .nojekyll so GitHub Pages does not ignore _next directory
with open(os.path.join(EXPORT_DIR, ".nojekyll"), "w") as f:
    f.write("")
print("✓ Created .nojekyll")

# 2. Transform HTML files for root domain (no subpath)
html_files = []
for root, _, files in os.walk(EXPORT_DIR):
    for f in files:
        if f.endswith(".html") or f in ["about", "contact", "projects", "lite", "legal-notice"]:
            html_files.append(os.path.join(root, f))

BUILD_TS = int(time.time())

base_script = f"""<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
<meta http-equiv="Pragma" content="no-cache" />
<meta http-equiv="Expires" content="0" />
<script>
  window.__REPO_BASE__ = '';
  window.TURBOPACK_CHUNK_BASE_PATH = '/_next/';
</script>"""

for fpath in html_files:
    try:
        with open(fpath, "r", encoding="utf-8") as f:
            content = f.read()

        # Inject base script and cache headers right after <head>
        if "<head>" in content and "window.TURBOPACK_CHUNK_BASE_PATH" not in content:
            content = content.replace("<head>", f"<head>\n{base_script}", 1)

        # Cache bust modified scripts to guarantee browsers never serve stale cached code
        content = re.sub(
            r"(3-0-2h2vnc5wo\.js|2vs2yctr590c[^\s'\"]*\.js|402p77n-ks3lc\.js|1ce4v9de-32bk\.js|15rpswwaw33xn\.js|custom-enhancements\.js|custom-enhancements\.css)(?:\?v=[^\s'\"]+)?",
            rf"\1?v={BUILD_TS}",
            content
        )

        with open(fpath, "w", encoding="utf-8") as f:
            f.write(content)
    except Exception as e:
        print(f"Warning processing {fpath}: {e}")

print(f"✓ Adapted all HTML files for root domain with cache-busted chunks (v={BUILD_TS})")

# 3. Create 404.html (copy of transformed index.html) for SPA fallback
index_path = os.path.join(EXPORT_DIR, "index.html")
shutil.copy2(index_path, os.path.join(EXPORT_DIR, "404.html"))
print("✓ Created 404.html SPA router fallback")

# 4. Create directory indexes for clean subroutes & project slugs
project_slugs = [
    "madrasah-ecosystem", "secure-my-pc", "maijrun-store", "maijrun-tech",
    "travel-with-maijrun", "arabic-language-club", "student-life-circle",
    "facebook-automation", "linkedin-automation", "presti", "grandir",
    "w3r-one", "cgtrader", "reaali", "currency"
]
all_subroutes = ["lite", "about", "projects", "contact", "legal-notice"] + [f"projects/{s}" for s in project_slugs]

for subroute in all_subroutes:
    route_dir = os.path.join(EXPORT_DIR, subroute)
    src_file = os.path.join(EXPORT_DIR, f"{subroute}.html")
    if os.path.isfile(route_dir):
        os.remove(route_dir)
    os.makedirs(route_dir, exist_ok=True)
    if os.path.exists(src_file):
        shutil.copy2(src_file, os.path.join(route_dir, "index.html"))
    else:
        shutil.copy2(index_path, os.path.join(route_dir, "index.html"))
print(f"✓ Created {len(all_subroutes)} subroute index.html files (clean routes + project slugs)")

# 5. Create root asset mirrors for 3D engine (models/, textures/, datas/, envMap/)
for asset_folder in ["models", "textures", "datas", "envMap"]:
    src = os.path.join(EXPORT_DIR, "assets", asset_folder)
    dst = os.path.join(EXPORT_DIR, asset_folder)
    if os.path.exists(src) and not os.path.exists(dst):
        shutil.copytree(src, dst)
print("✓ Created root 3D asset mirrors (models/, textures/, datas/, envMap/)")

# 6. Initialize git and push to main branch of naimsmahmud50-dotcom.github.io
print(f"📤 Pushing to main branch of https://github.com/naimsmahmud50-dotcom/{REPO_NAME}...")
subprocess.run(["git", "init"], cwd=EXPORT_DIR, check=True)
subprocess.run(["git", "config", "user.name", "Mahmud Hasan"], cwd=EXPORT_DIR, check=True)
subprocess.run(["git", "config", "user.email", "naimsmahmud50@gmail.com"], cwd=EXPORT_DIR, check=True)
subprocess.run(["git", "add", "-A"], cwd=EXPORT_DIR, check=True)
subprocess.run(["git", "commit", "-m", f"deploy: updated sub-2s 3D portfolio on root domain ({REPO_NAME})"], cwd=EXPORT_DIR, check=True)
subprocess.run(["git", "remote", "add", "origin", f"https://github.com/naimsmahmud50-dotcom/{REPO_NAME}.git"], cwd=EXPORT_DIR, check=True)
subprocess.run(["git", "push", "origin", "HEAD:main", "--force"], cwd=EXPORT_DIR, check=True)

print(f"🎉 Successfully deployed updated 3D portfolio to root domain https://naimsmahmud50-dotcom.github.io/!")
