#!/usr/bin/env python3
"""
apply_js_drawer_fix.py
Refactors cloned_site/custom-enhancements.js to implement:
- openAboutDrawer(), openContactDrawer(), openProjectsDrawer(), jumpToProject(idx)
- Clean menu click handling in setupLiteNavigation()
- Linking bottom HUD 'ALL 8' button to openProjectsDrawer()
"""

import sys
import re

JS_PATH = 'cloned_site/custom-enhancements.js'

def update_js():
    print(f"Reading {JS_PATH}...")
    with open(JS_PATH, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update setupLiteNavigation menu links
    menu_old_pattern = r"if \(label === 'ABOUT' \|\| href === '/about'\) \{.*?if \(label === 'MY VIDEOS' \|\| label === 'AI VIDEOS' \|\| label === 'VIDEOS'\) \{.*?\n          \}"
    menu_new_code = """if (label === 'ABOUT' || href === '/about') {
            e.preventDefault();
            e.stopPropagation();
            closeMenu();
            if (typeof window.__mhOpenAboutDrawer === 'function') {
              window.__mhOpenAboutDrawer();
            } else if (typeof window.__mhOpenHud === 'function') {
              window.__mhOpenHud();
            } else {
              showToast('Mahmud Hasan — Full Stack Developer & AI Automation Expert');
            }
            return;
          }

          if (label === 'CONTACT' || href === '/contact') {
            e.preventDefault();
            e.stopPropagation();
            closeMenu();
            if (typeof window.__mhOpenContactDrawer === 'function') {
              window.__mhOpenContactDrawer();
            } else {
              window.open('https://wa.me/8801767850859?text=Hi%20Mahmud,%20I%20saw%20your%20portfolio!', '_blank');
            }
            return;
          }

          if (label === 'MY VIDEOS' || label === 'AI VIDEOS' || label === 'VIDEOS' || label === 'EXTRA SKILLS') {
            e.preventDefault();
            e.stopPropagation();
            closeMenu();
            if (typeof window.__mhOpenMyVideos === 'function') {
              window.__mhOpenMyVideos();
            }
            return;
          }"""

    content, count_menu = re.subn(menu_old_pattern, menu_new_code, content, count=1, flags=re.DOTALL)
    if count_menu == 0:
        print("ERROR: Failed to update menu handlers in setupLiteNavigation().")
        sys.exit(1)
    print("✓ Successfully updated menu link handlers in setupLiteNavigation().")

    # 2. Replace setupMobileSkillsHud with setupPortfolioDrawers
    hud_old_pattern = r"// 12\. Mobile 3D Skills & Profile HUD Engine \(Runs on mobile devices\)\s+function setupMobileSkillsHud\(\) \{.*?\n  \}"
    drawers_new_code = """// 12. Modular Portfolio Drawers Engine (About, Contact, & Projects Switcher)
  function setupPortfolioDrawers() {
    const PORTFOLIO_PROJECTS_LIST = [
      {
        idxStr: '01 / 08',
        year: '2026',
        category: 'ENTERPRISE ERP & MOBILE',
        title: 'Madrasah Ecosystem',
        desc: 'Multi-tenant ERP with real-time Hifz milestones, exams, biometric attendance & parent WhatsApp Cloud alerts.',
        tags: ['Next.js', 'Flutter', 'PostgreSQL', 'WhatsApp API'],
        url: 'https://github.com/naimsmahmud50-dotcom/Madrasha-Managemant-Softaware',
        label: '⚡ GITHUB'
      },
      {
        idxStr: '02 / 08',
        year: '2025',
        category: 'ENDPOINT CYBER DEFENSE',
        title: 'Secure My PC',
        desc: 'Advanced Windows endpoint protection with real-time behavioral heuristics & kernel process interception.',
        tags: ['C++', 'Python', 'Win32 API', 'Cyber Security'],
        url: 'https://github.com/naimsmahmud50-dotcom',
        label: '🛡️ GITHUB'
      },
      {
        idxStr: '03 / 08',
        year: '2026',
        category: 'HEADLESS E-COMMERCE',
        title: 'MAIJRUN Tech Store',
        desc: 'Production hardware marketplace with live PC Builder compatibility engine, BDT gateways & courier webhooks.',
        tags: ['Next.js 15', 'TypeScript', 'Medusa', 'Tailwind CSS'],
        url: 'https://github.com/naimsmahmud50-dotcom/Maijrun-Teach',
        label: '⚡ GITHUB'
      },
      {
        idxStr: '04 / 08',
        year: '2025',
        category: 'LUXURY TRAVEL PORTAL',
        title: 'Travel with Maijrun',
        desc: 'Live high-performance travel portal with dynamic itineraries, booking inquiry dispatchers & 60fps animations.',
        tags: ['Next.js', 'TypeScript', 'Tailwind', 'Node.js'],
        url: 'https://travel-w-ith-maijrun-alpha.vercel.app',
        label: '🚀 LIVE DEMO'
      },
      {
        idxStr: '05 / 08',
        year: '2024',
        category: 'EDTECH COMMUNITY',
        title: 'Arabic Language & Cultural Club',
        desc: 'Interactive learning hub featuring bidirectional RTL layout engine, synchronized recitation audio & study forums.',
        tags: ['React', 'Next.js', 'RTL Engine', 'Audio Sync'],
        url: 'https://arabic-langualge-and-cultural-club.vercel.app',
        label: '🚀 LIVE DEMO'
      },
      {
        idxStr: '06 / 08',
        year: '2025',
        category: 'CAMPUS NETWORKING',
        title: 'Student Life Circle',
        desc: 'Comprehensive national exam-prep portal and student community with timed quizzes & past-paper archive.',
        tags: ['Next.js', 'Express', 'MongoDB', 'Redis'],
        url: 'https://naimsmahmud50-dotcom.github.io/Student-Life-Circle/',
        label: '🚀 LIVE DEMO'
      },
      {
        idxStr: '07 / 08',
        year: '2026',
        category: 'META GRAPH AUTOMATION',
        title: 'Facebook Automation',
        desc: 'High-throughput page management bot with automated cross-posting, intelligent auto-replies & lead pipelines.',
        tags: ['Node.js', 'Meta Graph API', 'Puppeteer', 'Redis'],
        url: 'https://github.com/naimsmahmud50-dotcom/Facebook-Automation-',
        label: '⚡ GITHUB'
      },
      {
        idxStr: '08 / 08',
        year: '2026',
        category: 'AI LEAD ENGINE',
        title: 'LinkedIn Automation',
        desc: 'Autonomous lead generation engine with Telegram bot remote control, Gemini AI synthesis & anti-ban stealth.',
        tags: ['Python 3.12', 'Playwright', 'Gemini AI', 'Telegram Bot'],
        url: 'https://github.com/naimsmahmud50-dotcom/Linkdin-Automation-',
        label: '⚡ GITHUB'
      }
    ];

    function injectDrawers() {
      // 1. Clean legacy HUD modal if present
      const oldHud = document.getElementById('mh-mobile-hud-modal');
      if (oldHud) oldHud.remove();

      // 2. Inject About Drawer
      if (!document.getElementById('mh-about-drawer')) {
        const aboutModal = document.createElement('div');
        aboutModal.id = 'mh-about-drawer';
        aboutModal.className = 'mh-drawer-backdrop';
        aboutModal.setAttribute('aria-hidden', 'true');
        aboutModal.setAttribute('role', 'dialog');
        aboutModal.setAttribute('aria-label', 'About Mahmud Hasan');
        aboutModal.innerHTML = `
          <div class="mh-drawer-sheet mh-about-sheet">
            <div class="mh-drawer-drag-handle"></div>
            <button type="button" class="mh-drawer-close-btn" id="mh-about-close" aria-label="Close dialog">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <div class="mh-drawer-profile-row">
              <img src="/assets/mahmud.jpg" alt="Mahmud Hasan" class="mh-drawer-avatar" onerror="this.src='/apple-icon.png'" />
              <div>
                <div class="mh-drawer-kicker">ENGINEERING PROFILE</div>
                <h3 class="mh-drawer-title">MAHMUD HASAN</h3>
                <p class="mh-drawer-role">Lead AI Architect &amp; Systems Engineer</p>
                <div class="mh-drawer-status-pill">
                  <span class="mh-status-dot"></span>
                  <span>DHAKA // 23.8103°N · AVAILABLE FOR CONTRACTS</span>
                </div>
              </div>
            </div>

            <div class="mh-drawer-bio-card">
              Senior Full-Stack &amp; AI Systems Engineer transforming complex engineering challenges into secure, scalable digital products. Specializing in autonomous multi-agent pipelines, enterprise web platforms (Next.js 15, PostgreSQL), cross-platform mobile systems (Flutter), and hyper-visual WebGPU/Three.js interfaces. Certified Web Security Engineer.
            </div>

            <div class="mh-drawer-highlights-row">
              <div class="mh-drawer-highlight-item">
                <span class="mh-highlight-val">8+</span>
                <span class="mh-highlight-lbl">FLAGSHIP SYSTEMS</span>
              </div>
              <div class="mh-drawer-highlight-item">
                <span class="mh-highlight-val">CERTIFIED</span>
                <span class="mh-highlight-lbl">CYBER DEFENSE</span>
              </div>
              <div class="mh-drawer-highlight-item">
                <span class="mh-highlight-val">GLOBAL</span>
                <span class="mh-highlight-lbl">REMOTE READY</span>
              </div>
            </div>

            <div class="mh-drawer-section-heading">
              <span>🧠 CORE ENGINEERING CAPABILITIES</span>
            </div>

            <div class="mh-drawer-skills-list">
              <div class="mh-drawer-skill-card">
                <div class="mh-skill-card-head">
                  <span>🤖</span>
                  <span class="mh-skill-title">Autonomous AI Agents &amp; Swarms</span>
                </div>
                <p class="mh-skill-desc">Multi-Agent Swarm Orchestration, LangChain, Tool Calling, RAG Pipelines, Playwright Stealth Browser Automation, Prompt Architecture.</p>
              </div>

              <div class="mh-drawer-skill-card">
                <div class="mh-skill-card-head">
                  <span>💻</span>
                  <span class="mh-skill-title">Full-Stack &amp; Cloud Platforms</span>
                </div>
                <p class="mh-skill-desc">Next.js 15 (App Router), TypeScript, Node.js, PostgreSQL, Medusa v1.20 Headless, Redis, Tailwind CSS, Docker, Linux Production Systems.</p>
              </div>

              <div class="mh-drawer-skill-card">
                <div class="mh-skill-card-head">
                  <span>📱</span>
                  <span class="mh-skill-title">Mobile &amp; Cross-Platform Systems</span>
                </div>
                <p class="mh-skill-desc">Flutter (Android/iOS Architecture), Offline-First Sync, WhatsApp Cloud API Messaging Dispatchers, Push Notification Pipelines.</p>
              </div>

              <div class="mh-drawer-skill-card">
                <div class="mh-skill-card-head">
                  <span>🛡️</span>
                  <span class="mh-skill-title">Cyber Defense &amp; API Security</span>
                </div>
                <p class="mh-skill-desc">Certified Web Security Engineer (Arena Web Security), Penetration Testing, Secure Token Auth, OWASP Top 10 Mitigation.</p>
              </div>

              <div class="mh-drawer-skill-card">
                <div class="mh-skill-card-head">
                  <span>🎨</span>
                  <span class="mh-skill-title">3D Graphics &amp; Kinetic Motion</span>
                </div>
                <p class="mh-skill-desc">WebGPU, Three.js Custom Shaders, Remotion Motion Graphics, Blender Modeling &amp; Real-time Visual Pipelines.</p>
              </div>
            </div>

            <!-- Studio Archive Callout -->
            <div class="mh-drawer-video-callout" id="mh-about-video-trigger">
              <div class="mh-video-callout-inner">
                <span class="mh-video-callout-icon">🎬</span>
                <div class="mh-video-callout-text">
                  <strong>Looking for Commercial Creative Motion?</strong>
                  <span>Explore High-Impact Video Productions &amp; Cinema Archive →</span>
                </div>
              </div>
            </div>

            <div class="mh-drawer-section-heading">
              <span>⚡ DIRECT 1-TAP CONTACT</span>
            </div>

            <div class="mh-drawer-actions-grid">
              <a href="https://wa.me/8801767850859?text=Hi%20Mahmud,%20I%20saw%20your%20portfolio!" target="_blank" rel="noopener noreferrer" class="mh-drawer-btn mh-btn-whatsapp">
                <span>💬 WhatsApp Direct</span>
              </a>
              <button type="button" class="mh-drawer-btn mh-btn-email oQ_U9W_email" data-email="mahmudhasan.infodev@gmail.com">
                <span>✉️ Copy Email</span>
              </button>
              <a href="https://www.linkedin.com/in/mahmud-hasan-687908269" target="_blank" rel="noopener noreferrer" class="mh-drawer-btn mh-btn-secondary">
                <span>🔗 LinkedIn</span>
              </a>
              <a href="https://github.com/naimsmahmud50-dotcom" target="_blank" rel="noopener noreferrer" class="mh-drawer-btn mh-btn-secondary">
                <span>💻 GitHub</span>
              </a>
            </div>

            <div class="mh-drawer-footer-row">
              MAHMUD HASAN · CERTIFIED BY ARENA WEB SECURITY · 2026
            </div>
          </div>
        `;
        document.body.appendChild(aboutModal);

        const closeBtn = document.getElementById('mh-about-close');
        if (closeBtn) closeBtn.addEventListener('click', closeAllDrawers);
        aboutModal.addEventListener('click', (e) => {
          if (e.target === aboutModal) closeAllDrawers();
        });

        const videoTrigger = document.getElementById('mh-about-video-trigger');
        if (videoTrigger) {
          videoTrigger.addEventListener('click', () => {
            closeAllDrawers();
            if (typeof window.__mhOpenMyVideos === 'function') {
              window.__mhOpenMyVideos();
            }
          });
        }
      }

      // 3. Inject Contact Drawer
      if (!document.getElementById('mh-contact-drawer')) {
        const contactModal = document.createElement('div');
        contactModal.id = 'mh-contact-drawer';
        contactModal.className = 'mh-drawer-backdrop';
        contactModal.setAttribute('aria-hidden', 'true');
        contactModal.setAttribute('role', 'dialog');
        contactModal.setAttribute('aria-label', 'Contact Mahmud Hasan');
        contactModal.innerHTML = `
          <div class="mh-drawer-sheet mh-contact-sheet">
            <div class="mh-drawer-drag-handle"></div>
            <button type="button" class="mh-drawer-close-btn" id="mh-contact-close" aria-label="Close dialog">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <div class="mh-drawer-header-center">
              <div class="mh-drawer-kicker">DIRECT CHANNELS</div>
              <h3 class="mh-drawer-title">LET'S CONNECT</h3>
              <p class="mh-drawer-subtitle">Available for high-impact contracts, technical leadership, and engineering consulting worldwide.</p>
              <div class="mh-drawer-status-pill">
                <span class="mh-status-dot"></span>
                <span>AVAILABLE NOW // RESPONSE TIME &lt; 2 HOURS</span>
              </div>
            </div>

            <div class="mh-contact-cards-stack">
              <!-- Direct Email Card -->
              <div class="mh-contact-card featured">
                <div class="mh-contact-card-top">
                  <div class="mh-contact-card-icon">✉️</div>
                  <div class="mh-contact-card-info">
                    <div class="mh-contact-type">PRIMARY EMAIL INBOX</div>
                    <div class="mh-contact-val">mahmudhasan.infodev@gmail.com</div>
                    <div class="mh-contact-subtext">Direct email for contract inquiries, scopes &amp; technical proposals</div>
                  </div>
                </div>
                <div class="mh-contact-card-actions">
                  <button type="button" class="mh-contact-sub-btn primary oQ_U9W_email" data-email="mahmudhasan.infodev@gmail.com">
                    <span>📋 Copy Email</span>
                  </button>
                  <a href="mailto:mahmudhasan.infodev@gmail.com" class="mh-contact-sub-btn secondary">
                    <span>↗ Send Email</span>
                  </a>
                </div>
              </div>

              <!-- Direct WhatsApp Card -->
              <div class="mh-contact-card">
                <div class="mh-contact-card-top">
                  <div class="mh-contact-card-icon">💬</div>
                  <div class="mh-contact-card-info">
                    <div class="mh-contact-type">INSTANT MESSAGING</div>
                    <div class="mh-contact-val">+880 1767-850859</div>
                    <div class="mh-contact-subtext">WhatsApp direct for rapid project discussions and sprint alignment</div>
                  </div>
                </div>
                <div class="mh-contact-card-actions">
                  <a href="https://wa.me/8801767850859?text=Hi%20Mahmud,%20I%20saw%20your%20portfolio!" target="_blank" rel="noopener noreferrer" class="mh-contact-sub-btn whatsapp">
                    <span>💬 Open WhatsApp Chat</span>
                  </a>
                </div>
              </div>

              <!-- Social Profiles Grid -->
              <div class="mh-contact-grid-duo">
                <a href="https://www.linkedin.com/in/mahmud-hasan-687908269" target="_blank" rel="noopener noreferrer" class="mh-contact-grid-card">
                  <div class="mh-grid-card-head">
                    <span>🔗 LinkedIn</span>
                    <span class="mh-grid-arrow">↗</span>
                  </div>
                  <div class="mh-grid-card-handle">in/mahmud-hasan-687908269</div>
                  <div class="mh-grid-card-sub">Professional Network &amp; Endorsements</div>
                </a>

                <a href="https://github.com/naimsmahmud50-dotcom" target="_blank" rel="noopener noreferrer" class="mh-contact-grid-card">
                  <div class="mh-grid-card-head">
                    <span>💻 GitHub</span>
                    <span class="mh-grid-arrow">↗</span>
                  </div>
                  <div class="mh-grid-card-handle">naimsmahmud50-dotcom</div>
                  <div class="mh-grid-card-sub">Open-Source Code Repositories</div>
                </a>
              </div>
            </div>

            <div class="mh-drawer-footer-row">
              📍 DHAKA, BANGLADESH (UTC+6) · WORLDWIDE REMOTE READY
            </div>
          </div>
        `;
        document.body.appendChild(contactModal);

        const closeBtn = document.getElementById('mh-contact-close');
        if (closeBtn) closeBtn.addEventListener('click', closeAllDrawers);
        contactModal.addEventListener('click', (e) => {
          if (e.target === contactModal) closeAllDrawers();
        });
      }

      // 4. Inject Projects Drawer
      if (!document.getElementById('mh-projects-drawer')) {
        const projectsModal = document.createElement('div');
        projectsModal.id = 'mh-projects-drawer';
        projectsModal.className = 'mh-drawer-backdrop';
        projectsModal.setAttribute('aria-hidden', 'true');
        projectsModal.setAttribute('role', 'dialog');
        projectsModal.setAttribute('aria-label', 'All 8 Projects');
        projectsModal.innerHTML = `
          <div class="mh-drawer-sheet mh-projects-sheet">
            <div class="mh-drawer-drag-handle"></div>
            <button type="button" class="mh-drawer-close-btn" id="mh-projects-close" aria-label="Close dialog">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <div class="mh-drawer-header-center">
              <div class="mh-drawer-kicker">FLAGSHIP DELIVERABLES</div>
              <h3 class="mh-drawer-title">ALL 8 PROJECTS</h3>
              <p class="mh-drawer-subtitle">Tap "VIEW SLIDE" to jump instantly to that project in slide view.</p>
            </div>

            <div class="mh-projects-drawer-list">
              ${PORTFOLIO_PROJECTS_LIST.map((p, idx) => `
                <div class="mh-drawer-project-card">
                  <div class="mh-proj-card-meta">
                    <span class="mh-proj-idx">${p.idxStr}</span>
                    <span class="mh-proj-cat">${p.category}</span>
                  </div>
                  <h4 class="mh-proj-title">${p.title}</h4>
                  <p class="mh-proj-desc">${p.desc}</p>
                  <div class="mh-proj-tags">
                    ${p.tags.map(t => `<span class="mh-proj-tag">${t}</span>`).join('')}
                  </div>
                  <div class="mh-proj-actions">
                    <button type="button" class="mh-proj-jump-btn" onclick="window.__mhJumpToProject(${idx})">
                      <span>▶ VIEW SLIDE</span>
                    </button>
                    <a href="${p.url}" target="_blank" rel="noopener noreferrer" class="mh-proj-link-btn">
                      <span>${p.label} ↗</span>
                    </a>
                  </div>
                </div>
              `).join('')}
            </div>

            <div class="mh-drawer-footer-row">
              MAHMUD HASAN · FULL-STACK &amp; AI ARCHITECT · 2026
            </div>
          </div>
        `;
        document.body.appendChild(projectsModal);

        const closeBtn = document.getElementById('mh-projects-close');
        if (closeBtn) closeBtn.addEventListener('click', closeAllDrawers);
        projectsModal.addEventListener('click', (e) => {
          if (e.target === projectsModal) closeAllDrawers();
        });
      }
    }

    function closeAllDrawers() {
      document.querySelectorAll('.mh-drawer-backdrop').forEach(el => {
        el.classList.remove('active');
        el.setAttribute('aria-hidden', 'true');
      });
      document.body.style.overflow = '';
    }

    function openAboutDrawer() {
      closeAllDrawers();
      injectDrawers();
      const drawer = document.getElementById('mh-about-drawer');
      if (drawer) {
        drawer.classList.add('active');
        drawer.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }
    }

    function openContactDrawer() {
      closeAllDrawers();
      injectDrawers();
      const drawer = document.getElementById('mh-contact-drawer');
      if (drawer) {
        drawer.classList.add('active');
        drawer.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }
    }

    function openProjectsDrawer() {
      closeAllDrawers();
      injectDrawers();
      const drawer = document.getElementById('mh-projects-drawer');
      if (drawer) {
        drawer.classList.add('active');
        drawer.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }
    }

    function jumpToProject(idx) {
      closeAllDrawers();
      if (window.__mhLiteController && window.__mhLiteController.eM) {
        const pitch = window.__mhLiteController.ei?.pitch || 1.195;
        window.__mhLiteController.eM.setScrollValue(idx * pitch);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        showToast(`Viewing Project 0${idx + 1}`);
      } else {
        const p = PORTFOLIO_PROJECTS_LIST[idx];
        if (p && p.url) {
          window.open(p.url, '_blank', 'noopener,noreferrer');
        }
      }
    }

    window.__mhOpenAboutDrawer = openAboutDrawer;
    window.__mhCloseAboutDrawer = closeAllDrawers;
    window.__mhOpenContactDrawer = openContactDrawer;
    window.__mhCloseContactDrawer = closeAllDrawers;
    window.__mhOpenProjectsDrawer = openProjectsDrawer;
    window.__mhCloseProjectsDrawer = closeAllDrawers;
    window.__mhCloseAllDrawers = closeAllDrawers;
    window.__mhJumpToProject = jumpToProject;
    window.__mhOpenHud = function(target) {
      if (target === 'videos') {
        if (typeof window.__mhOpenMyVideos === 'function') {
          window.__mhOpenMyVideos();
        }
      } else {
        openAboutDrawer();
      }
    };
    window.__mhCloseHud = closeAllDrawers;

    injectDrawers();
    setTimeout(injectDrawers, 300);
  }"""

    content, count_drawers = re.subn(hud_old_pattern, drawers_new_code, content, count=1, flags=re.DOTALL)
    if count_drawers == 0:
        print("ERROR: Failed to replace setupMobileSkillsHud with setupPortfolioDrawers.")
        sys.exit(1)
    print("✓ Successfully replaced setupMobileSkillsHud with setupPortfolioDrawers.")

    # 3. Update mh-hud-act-all click handler in setupMobileProjectSlideView
    all_btn_old = r"const allBtn = document\.getElementById\('mh-hud-act-all'\);.*?if \(allBtn\) \{.*?window\.__mhOpenHud\(\);.*?\}\s*\}"
    all_btn_new = """const allBtn = document.getElementById('mh-hud-act-all');
        if (allBtn) {
          allBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (typeof window.__mhOpenProjectsDrawer === 'function') {
              window.__mhOpenProjectsDrawer();
            } else if (typeof window.__mhOpenHud === 'function') {
              window.__mhOpenHud();
            }
          });
        }"""
    content, count_all = re.subn(all_btn_old, all_btn_new, content, count=1, flags=re.DOTALL)
    if count_all == 0:
        print("Notice: could not find exact mh-hud-act-all pattern, attempting fallback...")
        content = content.replace("allBtn.addEventListener('click', () => {\n            if (typeof window.__mhOpenHud === 'function') {\n              window.__mhOpenHud();\n            } else {\n              const trigger = document.getElementById('mh-mobile-skills-trigger');\n              if (trigger) trigger.click();\n            }\n          });",
                                  "allBtn.addEventListener('click', (e) => {\n            e.preventDefault();\n            e.stopPropagation();\n            if (typeof window.__mhOpenProjectsDrawer === 'function') {\n              window.__mhOpenProjectsDrawer();\n            } else if (typeof window.__mhOpenHud === 'function') {\n              window.__mhOpenHud();\n            }\n          });")
    print("✓ Successfully updated mh-hud-act-all click handler.")

    # 4. In init(), change setupMobileSkillsHud() to setupPortfolioDrawers()
    content = content.replace("setupMobileSkillsHud();", "setupPortfolioDrawers();")
    print("✓ Updated init() call to setupPortfolioDrawers().")

    with open(JS_PATH, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Successfully updated {JS_PATH}.")

if __name__ == '__main__':
    update_js()
