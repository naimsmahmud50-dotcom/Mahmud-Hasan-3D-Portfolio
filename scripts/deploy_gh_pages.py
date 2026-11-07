#!/usr/bin/env python3
import os
import shutil
import subprocess
import re

REPO_NAME = "Mahmud-Hasan-3D-Portfolio"
BASE_PATH = f"/{REPO_NAME}"
SRC_DIR = "/home/mahmud-hasan/Naims Project/3d portfolio/cloned_site"
EXPORT_DIR = "/tmp/gh-pages-export"

print(f"🚀 Preparing GitHub Pages deployment for {REPO_NAME}...")

if os.path.exists(EXPORT_DIR):
    shutil.rmtree(EXPORT_DIR)

shutil.copytree(SRC_DIR, EXPORT_DIR)
print(f"✓ Copied static files to {EXPORT_DIR}")

# 1. Create .nojekyll so GitHub Pages does not ignore _next directory
with open(os.path.join(EXPORT_DIR, ".nojekyll"), "w") as f:
    f.write("")
print("✓ Created .nojekyll")

# 2. Transform HTML files to adapt base path
html_files = []
for root, _, files in os.walk(EXPORT_DIR):
    for f in files:
        if f.endswith(".html") or f in ["about", "contact", "projects", "lite", "legal-notice"]:
            html_files.append(os.path.join(root, f))

import time
BUILD_TS = int(time.time())

base_script = f"""<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
<meta http-equiv="Pragma" content="no-cache" />
<meta http-equiv="Expires" content="0" />
<script>
  window.__REPO_BASE__ = '{BASE_PATH}';
  window.TURBOPACK_CHUNK_BASE_PATH = '{BASE_PATH}/_next/';
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
            r"(3-0-2h2vnc5wo\.js|2vs2yctr590c[^\s'\"]*\.js|402p77n-ks3lc\.js|1ce4v9de-32bk\.js|custom-enhancements\.js|custom-enhancements\.css)(?:\?v=[^\s'\"]+)?",
            rf"\1?v={BUILD_TS}",
            content
        )

        # Replace root references
        replacements = [
            ('"/_next/', f'"{BASE_PATH}/_next/'),
            ("'/_next/", f"'{BASE_PATH}/_next/"),
            ('"/assets/', f'"{BASE_PATH}/assets/'),
            ("'/_next/", f"'{BASE_PATH}/_next/"),
            ('"/draco/', f'"{BASE_PATH}/draco/'),
            ('"/fonts/', f'"{BASE_PATH}/fonts/'),
            ('"/images/', f'"{BASE_PATH}/images/'),
            ('"/manifest.webmanifest"', f'"{BASE_PATH}/manifest.webmanifest"'),
            ('"/favicon.ico', f'"{BASE_PATH}/favicon.ico'),
            ('"/icon.svg', f'"{BASE_PATH}/icon.svg'),
            ('"/apple-icon.png', f'"{BASE_PATH}/apple-icon.png'),
            ('href="/lite"', f'href="{BASE_PATH}/lite"'),
            ('href="/about"', f'href="{BASE_PATH}/?glide=about"'),
            ('href="/projects"', f'href="{BASE_PATH}/?glide=projects"'),
            ('href="/contact"', f'href="{BASE_PATH}/?glide=contact"'),
            ('href="/legal-notice"', f'href="{BASE_PATH}/legal-notice"'),
            ('href="/"', f'href="{BASE_PATH}/"'),
        ]

        for old, new in replacements:
            content = content.replace(old, new)

        with open(fpath, "w", encoding="utf-8") as f:
            f.write(content)
    except Exception as e:
        print(f"Warning processing {fpath}: {e}")

print(f"✓ Adapted all HTML files with subpath, cache headers, and cache-busted chunks (v={BUILD_TS})")

# 3. Create 404.html (copy of transformed index.html) for SPA fallback
index_path = os.path.join(EXPORT_DIR, "index.html")
shutil.copy2(index_path, os.path.join(EXPORT_DIR, "404.html"))
print("✓ Created 404.html SPA router fallback")

# 4. Create directory indexes for clean subroutes
for subroute in ["lite", "about", "projects", "contact", "legal-notice"]:
    route_dir = os.path.join(EXPORT_DIR, subroute)
    src_file = os.path.join(EXPORT_DIR, f"{subroute}.html")
    if os.path.isfile(route_dir):
        # Move the extensionless file or remove it in favor of dir/index.html
        os.remove(route_dir)
    os.makedirs(route_dir, exist_ok=True)
    if os.path.exists(src_file):
        shutil.copy2(src_file, os.path.join(route_dir, "index.html"))
    else:
        shutil.copy2(index_path, os.path.join(route_dir, "index.html"))
print("✓ Created subroute index.html files (lite/, about/, projects/, contact/, legal-notice/)")

# 5. Adapt manifest.webmanifest
manifest_path = os.path.join(EXPORT_DIR, "manifest.webmanifest")
if os.path.exists(manifest_path):
    with open(manifest_path, "r", encoding="utf-8") as f:
        m_content = f.read()
    m_content = m_content.replace('"id":"/"', f'"id":"{BASE_PATH}/"')
    m_content = m_content.replace('"start_url":"/"', f'"start_url":"{BASE_PATH}/"')
    m_content = m_content.replace('"/icon', f'"{BASE_PATH}/icon')
    with open(manifest_path, "w", encoding="utf-8") as f:
        f.write(m_content)
    print("✓ Updated manifest.webmanifest")

# 5.1 Create root asset mirrors for 3D engine (models/, textures/, datas/, envMap/)
for asset_folder in ["models", "textures", "datas", "envMap"]:
    src = os.path.join(EXPORT_DIR, "assets", asset_folder)
    dst = os.path.join(EXPORT_DIR, asset_folder)
    if os.path.exists(src) and not os.path.exists(dst):
        shutil.copytree(src, dst)
print("✓ Created root 3D asset mirrors (models/, textures/, datas/, envMap/)")

# 6. Initialize git and push to gh-pages branch
print("📤 Pushing to gh-pages branch on GitHub...")
subprocess.run(["git", "init"], cwd=EXPORT_DIR, check=True)
subprocess.run(["git", "config", "user.name", "Mahmud Hasan"], cwd=EXPORT_DIR, check=True)
subprocess.run(["git", "config", "user.email", "naimsmahmud50@gmail.com"], cwd=EXPORT_DIR, check=True)
subprocess.run(["git", "add", "-A"], cwd=EXPORT_DIR, check=True)
subprocess.run(["git", "commit", "-m", f"deploy: 3D portfolio live on GitHub Pages ({REPO_NAME})"], cwd=EXPORT_DIR, check=True)
subprocess.run(["git", "remote", "add", "origin", f"https://github.com/naimsmahmud50-dotcom/{REPO_NAME}.git"], cwd=EXPORT_DIR, check=True)
subprocess.run(["git", "push", "origin", "HEAD:gh-pages", "--force"], cwd=EXPORT_DIR, check=True)

print(f"🎉 Successfully built and pushed gh-pages branch to {REPO_NAME}!")
