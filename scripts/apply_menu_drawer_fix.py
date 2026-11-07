#!/usr/bin/env python3
"""
apply_menu_drawer_fix.py
Refactors menu navigation, fixes broken CSS comment, and implements
modular About, Contact, and Projects drawers.
"""

import sys
import re

CSS_PATH = 'cloned_site/custom-enhancements.css'
JS_PATH = 'cloned_site/custom-enhancements.js'

def update_css():
    print(f"Reading {CSS_PATH}...")
    with open(CSS_PATH, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the malformed comment block between line 1405 and line 1681
    marker_start = "/* ==========================================================================\nbody.is-lite ._rHu7W_nav,"
    marker_end = "/* ==========================================================================\n   16. MOBILE PROJECT SLIDE VIEW CYBER-HUD & NAVIGATION CONTROLS"

    if marker_start not in content or marker_end not in content:
        # Fallback search with regex
        pattern = re.compile(r'/\*\s*={20,}\s*\nbody\.is-lite \._rHu7W_nav,.*?/\*\s*={20,}\s*\n\s*16\.\s*MOBILE PROJECT SLIDE VIEW', re.DOTALL)
        match = pattern.search(content)
        if not match:
            print("ERROR: Could not locate target CSS block for replacement.")
            sys.exit(1)
        start_idx = match.start()
        # Find where section 16 begins
        end_idx = content.find("/* ==========================================================================\n   16. MOBILE PROJECT SLIDE VIEW", start_idx)
    else:
        start_idx = content.find(marker_start)
        end_idx = content.find(marker_end)

    new_css_block = """/* ==========================================================================
   15. MODULAR PORTFOLIO DRAWERS & CYBER HUD SYSTEM
   (About Drawer, Contact Drawer, Projects Switcher & Universal Close Controls)
   ========================================================================== */

body.is-lite ._rHu7W_nav,
.is-lite ._rHu7W_nav {
  opacity: 1 !important;
  visibility: visible !important;
  transform: translateY(0) !important;
}

.mh-mobile-hud-pill {
  display: inline-flex !important;
  align-items: center !important;
  gap: 6px !important;
  padding: 5px 12px !important;
  background: rgba(0, 229, 255, 0.12) !important;
  border: 1px solid rgba(0, 229, 255, 0.4) !important;
  border-radius: 9999px !important;
  color: #00e5ff !important;
  font-family: 'JetBrains Mono', monospace !important;
  font-size: 10.5px !important;
  font-weight: 700 !important;
  letter-spacing: 0.06em !important;
  cursor: pointer !important;
  backdrop-filter: blur(12px) !important;
  -webkit-backdrop-filter: blur(12px) !important;
  transition: all 0.25s ease !important;
  box-shadow: 0 0 12px rgba(0, 229, 255, 0.2) !important;
}

.mh-mobile-hud-pill:active {
  transform: scale(0.96) !important;
  background: rgba(0, 229, 255, 0.25) !important;
}

/* --- Universal Drawer Backdrop --- */
.mh-drawer-backdrop {
  position: fixed !important;
  inset: 0 !important;
  z-index: 999999 !important;
  background: rgba(4, 8, 16, 0.84) !important;
  backdrop-filter: blur(24px) !important;
  -webkit-backdrop-filter: blur(24px) !important;
  display: flex !important;
  align-items: flex-end !important;
  justify-content: center !important;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1) !important;
}

.mh-drawer-backdrop.active {
  opacity: 1 !important;
  pointer-events: auto !important;
}

/* --- Drawer Sheet Structure --- */
.mh-drawer-sheet {
  position: relative !important;
  width: 100% !important;
  max-width: 560px !important;
  max-height: 86vh !important;
  background: linear-gradient(180deg, rgba(13, 22, 38, 0.98) 0%, rgba(6, 12, 22, 0.99) 100%) !important;
  border-top: 1.5px solid rgba(0, 229, 255, 0.45) !important;
  border-left: 1px solid rgba(0, 229, 255, 0.2) !important;
  border-right: 1px solid rgba(0, 229, 255, 0.2) !important;
  border-radius: 28px 28px 0 0 !important;
  padding: 18px 20px 32px 20px !important;
  overflow-y: auto !important;
  -webkit-overflow-scrolling: touch !important;
  box-shadow: 0 -12px 40px rgba(0, 0, 0, 0.85), 0 0 35px rgba(0, 229, 255, 0.2) !important;
  transform: translateY(100%);
  transition: transform 0.38s cubic-bezier(0.16, 1, 0.3, 1) !important;
}

.mh-drawer-backdrop.active .mh-drawer-sheet {
  transform: translateY(0) !important;
}

@media screen and (min-width: 769px) {
  .mh-drawer-backdrop {
    align-items: center !important;
  }
  .mh-drawer-sheet {
    border-radius: 24px !important;
    border: 1.5px solid rgba(0, 229, 255, 0.4) !important;
    transform: scale(0.95) translateY(20px);
    transition: transform 0.32s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.32s ease !important;
    max-height: 82vh !important;
  }
  .mh-drawer-backdrop.active .mh-drawer-sheet {
    transform: scale(1) translateY(0) !important;
  }
}

/* --- Drag Handle & Header Controls --- */
.mh-drawer-drag-handle {
  width: 44px;
  height: 4px;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 9999px;
  margin: 0 auto 16px auto;
}

.mh-drawer-close-btn {
  position: absolute !important;
  top: 16px !important;
  right: 16px !important;
  width: 36px !important;
  height: 36px !important;
  border-radius: 50% !important;
  background: rgba(255, 255, 255, 0.08) !important;
  border: 1px solid rgba(255, 255, 255, 0.18) !important;
  color: #ffffff !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  cursor: pointer !important;
  z-index: 10 !important;
  transition: all 0.25s ease !important;
  padding: 0 !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
}

.mh-drawer-close-btn:hover {
  background: rgba(0, 229, 255, 0.25) !important;
  border-color: #00e5ff !important;
  color: #00e5ff !important;
  box-shadow: 0 0 16px rgba(0, 229, 255, 0.45) !important;
  transform: scale(1.08) !important;
}

.mh-drawer-close-btn:active {
  transform: scale(0.92) !important;
}

/* --- Typography & Badges in Drawers --- */
.mh-drawer-kicker {
  font-size: 10px;
  font-weight: 800;
  color: #00e5ff;
  letter-spacing: 0.14em;
  font-family: 'JetBrains Mono', monospace;
  text-transform: uppercase;
  margin-bottom: 4px;
}

.mh-drawer-title {
  font-size: 22px;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.01em;
  margin: 0 0 4px 0;
  line-height: 1.15;
}

.mh-drawer-subtitle {
  font-size: 12.5px;
  color: #94a3b8;
  line-height: 1.45;
  margin: 0 0 14px 0;
}

.mh-drawer-role {
  font-size: 11.5px;
  font-weight: 700;
  color: #00e5ff;
  letter-spacing: 0.06em;
  font-family: 'JetBrains Mono', monospace;
  text-transform: uppercase;
  margin: 0 0 6px 0;
}

.mh-drawer-status-pill {
  font-size: 10px;
  color: #00ff88;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: 'JetBrains Mono', monospace;
  letter-spacing: 0.04em;
  padding: 3px 8px;
  background: rgba(0, 255, 136, 0.08);
  border: 1px solid rgba(0, 255, 136, 0.25);
  border-radius: 9999px;
}

.mh-drawer-status-pill .mh-status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #00ff88;
  display: inline-block;
  box-shadow: 0 0 6px #00ff88;
}

.mh-drawer-profile-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-right: 40px; /* clear close button */
}

.mh-drawer-avatar {
  width: 64px;
  height: 64px;
  border-radius: 18px;
  border: 1.5px solid #00e5ff;
  object-fit: cover;
  box-shadow: 0 0 16px rgba(0, 229, 255, 0.35);
  flex-shrink: 0;
}

.mh-drawer-bio-card {
  background: rgba(0, 229, 255, 0.05);
  border: 1px solid rgba(0, 229, 255, 0.2);
  border-radius: 14px;
  padding: 12px 14px;
  margin-bottom: 16px;
  font-size: 12.5px;
  color: #e2e8f0;
  line-height: 1.55;
}

.mh-drawer-highlights-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 18px;
}

.mh-drawer-highlight-item {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 10px 8px;
  text-align: center;
}

.mh-highlight-val {
  display: block;
  font-size: 15px;
  font-weight: 800;
  color: #00e5ff;
  font-family: 'JetBrains Mono', monospace;
  margin-bottom: 2px;
}

.mh-highlight-lbl {
  display: block;
  font-size: 8.5px;
  font-weight: 700;
  color: #94a3b8;
  letter-spacing: 0.06em;
  font-family: 'JetBrains Mono', monospace;
  text-transform: uppercase;
}

.mh-drawer-section-heading {
  font-size: 11px;
  font-weight: 800;
  color: #94a3b8;
  letter-spacing: 0.1em;
  font-family: 'JetBrains Mono', monospace;
  text-transform: uppercase;
  margin: 16px 0 10px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* --- Skills List --- */
.mh-drawer-skills-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 18px;
}

.mh-drawer-skill-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 10px 12px;
  transition: all 0.2s ease;
}

.mh-drawer-skill-card:hover {
  background: rgba(0, 229, 255, 0.05);
  border-color: rgba(0, 229, 255, 0.3);
}

.mh-skill-card-head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.mh-skill-title {
  font-size: 12px;
  font-weight: 700;
  color: #ffffff;
}

.mh-skill-desc {
  font-size: 11px;
  color: #94a3b8;
  line-height: 1.45;
  margin: 0;
}

/* --- Callout Box for Studio Videos --- */
.mh-drawer-video-callout {
  background: linear-gradient(135deg, rgba(0, 229, 255, 0.12) 0%, rgba(99, 102, 241, 0.12) 100%);
  border: 1px solid rgba(0, 229, 255, 0.35);
  border-radius: 14px;
  padding: 12px 14px;
  margin-bottom: 18px;
  cursor: pointer;
  transition: all 0.25s ease;
}

.mh-drawer-video-callout:hover {
  background: linear-gradient(135deg, rgba(0, 229, 255, 0.2) 0%, rgba(99, 102, 241, 0.2) 100%);
  border-color: #00e5ff;
  box-shadow: 0 0 18px rgba(0, 229, 255, 0.25);
  transform: translateY(-1px);
}

.mh-video-callout-inner {
  display: flex;
  align-items: center;
  gap: 12px;
}

.mh-video-callout-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.mh-video-callout-text strong {
  display: block;
  font-size: 12px;
  color: #ffffff;
  margin-bottom: 2px;
}

.mh-video-callout-text span {
  display: block;
  font-size: 10.5px;
  color: #00e5ff;
  font-family: 'JetBrains Mono', monospace;
}

/* --- Actions Grid & Buttons --- */
.mh-drawer-actions-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 14px;
}

.mh-drawer-btn {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 8px !important;
  height: 42px !important;
  border-radius: 10px !important;
  font-size: 11.5px !important;
  font-weight: 700 !important;
  font-family: 'JetBrains Mono', monospace !important;
  text-decoration: none !important;
  cursor: pointer !important;
  transition: all 0.2s ease !important;
  border: none !important;
  padding: 0 12px !important;
}

.mh-btn-whatsapp {
  background: #25d366 !important;
  color: #042410 !important;
  box-shadow: 0 0 14px rgba(37, 211, 102, 0.35) !important;
}
.mh-btn-whatsapp:hover {
  background: #2fe772 !important;
  box-shadow: 0 0 20px rgba(37, 211, 102, 0.5) !important;
}

.mh-btn-email {
  background: #00e5ff !important;
  color: #03141f !important;
  box-shadow: 0 0 14px rgba(0, 229, 255, 0.35) !important;
}
.mh-btn-email:hover {
  background: #38edff !important;
  box-shadow: 0 0 20px rgba(0, 229, 255, 0.5) !important;
}

.mh-btn-secondary {
  background: rgba(255, 255, 255, 0.06) !important;
  color: #ffffff !important;
  border: 1px solid rgba(255, 255, 255, 0.15) !important;
}
.mh-btn-secondary:hover {
  background: rgba(255, 255, 255, 0.12) !important;
  border-color: rgba(255, 255, 255, 0.3) !important;
  color: #ffffff !important;
}

.mh-drawer-footer-row {
  text-align: center;
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 10px;
  color: #64748b;
  font-family: 'JetBrains Mono', monospace;
  letter-spacing: 0.06em;
}

/* --- Contact Drawer Specifics --- */
.mh-drawer-header-center {
  text-align: center;
  padding: 6px 36px 14px 36px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  margin-bottom: 16px;
}

.mh-contact-cards-stack {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 16px;
}

.mh-contact-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 14px;
  padding: 14px;
  transition: all 0.25s ease;
}

.mh-contact-card.featured {
  background: rgba(0, 229, 255, 0.05);
  border-color: rgba(0, 229, 255, 0.3);
  box-shadow: 0 0 20px rgba(0, 229, 255, 0.1);
}

.mh-contact-card-top {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
}

.mh-contact-card-icon {
  font-size: 22px;
  line-height: 1;
}

.mh-contact-type {
  font-size: 9.5px;
  font-weight: 800;
  color: #00e5ff;
  letter-spacing: 0.12em;
  font-family: 'JetBrains Mono', monospace;
  margin-bottom: 3px;
}

.mh-contact-val {
  font-size: 13.5px;
  font-weight: 700;
  color: #ffffff;
  word-break: break-all;
}

.mh-contact-subtext {
  font-size: 11px;
  color: #94a3b8;
  margin-top: 3px;
}

.mh-contact-card-actions {
  display: flex;
  gap: 8px;
}

.mh-contact-sub-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 38px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 700;
  font-family: 'JetBrains Mono', monospace;
  text-decoration: none;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
}

.mh-contact-sub-btn.primary {
  background: #00e5ff;
  color: #03141f;
  box-shadow: 0 0 12px rgba(0, 229, 255, 0.3);
}
.mh-contact-sub-btn.primary:hover {
  background: #4beaff;
}

.mh-contact-sub-btn.secondary {
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.16);
}
.mh-contact-sub-btn.secondary:hover {
  background: rgba(255, 255, 255, 0.15);
}

.mh-contact-sub-btn.whatsapp {
  background: #25d366;
  color: #042410;
  box-shadow: 0 0 12px rgba(37, 211, 102, 0.3);
}
.mh-contact-sub-btn.whatsapp:hover {
  background: #34e474;
}

.mh-contact-grid-duo {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.mh-contact-grid-card {
  display: block;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 12px;
  padding: 12px;
  text-decoration: none;
  transition: all 0.2s ease;
}

.mh-contact-grid-card:hover {
  background: rgba(0, 229, 255, 0.06);
  border-color: rgba(0, 229, 255, 0.35);
  transform: translateY(-2px);
}

.mh-grid-card-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 4px;
}

.mh-grid-arrow {
  color: #00e5ff;
}

.mh-grid-card-handle {
  font-size: 11px;
  color: #00e5ff;
  font-family: 'JetBrains Mono', monospace;
  margin-bottom: 3px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mh-grid-card-sub {
  font-size: 9.5px;
  color: #94a3b8;
  line-height: 1.3;
}

/* --- Projects Drawer Specifics --- */
.mh-projects-drawer-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 16px;
}

.mh-drawer-project-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 14px;
  padding: 12px 14px;
  transition: all 0.2s ease;
}

.mh-drawer-project-card:hover {
  background: rgba(0, 229, 255, 0.05);
  border-color: rgba(0, 229, 255, 0.35);
}

.mh-proj-card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.mh-proj-idx {
  font-size: 10px;
  font-weight: 800;
  color: #00e5ff;
  font-family: 'JetBrains Mono', monospace;
  background: rgba(0, 229, 255, 0.12);
  padding: 2px 6px;
  border-radius: 4px;
}

.mh-proj-cat {
  font-size: 9.5px;
  font-weight: 700;
  color: #94a3b8;
  letter-spacing: 0.08em;
  font-family: 'JetBrains Mono', monospace;
  text-transform: uppercase;
}

.mh-proj-title {
  font-size: 14px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 4px 0;
}

.mh-proj-desc {
  font-size: 11px;
  color: #cbd5e1;
  line-height: 1.45;
  margin: 0 0 8px 0;
}

.mh-proj-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 10px;
}

.mh-proj-tag {
  font-size: 9.5px;
  color: #00e5ff;
  background: rgba(0, 229, 255, 0.08);
  border: 1px solid rgba(0, 229, 255, 0.2);
  border-radius: 4px;
  padding: 2px 6px;
  font-family: 'JetBrains Mono', monospace;
}

.mh-proj-actions {
  display: flex;
  gap: 8px;
}

.mh-proj-jump-btn {
  flex: 1.2;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 34px;
  background: #00e5ff;
  color: #03141f;
  border-radius: 8px;
  font-size: 10.5px;
  font-weight: 800;
  font-family: 'JetBrains Mono', monospace;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
  box-shadow: 0 0 10px rgba(0, 229, 255, 0.25);
}

.mh-proj-jump-btn:hover {
  background: #3bedff;
  box-shadow: 0 0 16px rgba(0, 229, 255, 0.45);
}

.mh-proj-link-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  height: 34px;
  background: rgba(255, 255, 255, 0.07);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 8px;
  font-size: 10.5px;
  font-weight: 700;
  font-family: 'JetBrains Mono', monospace;
  text-decoration: none;
  transition: all 0.2s ease;
}

.mh-proj-link-btn:hover {
  background: rgba(255, 255, 255, 0.14);
  border-color: rgba(255, 255, 255, 0.3);
}

"""

    updated_content = content[:start_idx] + new_css_block + content[end_idx:]
    with open(CSS_PATH, 'w', encoding='utf-8') as f:
        f.write(updated_content)
    print(f"Successfully updated {CSS_PATH} (clean modular drawer architecture).")

if __name__ == '__main__':
    update_css()
