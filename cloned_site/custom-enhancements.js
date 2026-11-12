/**
 * MAHMUD HASAN — CYBER-LUXURY TECH PORTFOLIO ENHANCEMENT ENGINE
 * Pillars Implemented:
 * - Pillar 1: Interactive AI Agent Terminal (Cmd+K / Floating Badge)
 * - Pillar 2: Arena Web Security Verification & Skills Matrix
 * - Pillar 3: Project HUD Quick Actions (Live Demo / GitHub)
 * - Pillar 4: High-Conversion Contact Hub (WhatsApp 1-Click, Live Dhaka Clock, Email Toast)
 */

(function () {
  'use strict';

  // =========================================================================
  // INITIAL ENTER SCREEN PRESERVATION CONFIGURATION
  // To re-enable the original MAHMUD AI ARCHITECT enter screen (with 0-100% counter
  // and ENTER button), set MH_BYPASS_INITIAL_ENTER_SCREEN = false.
  // When true, the enter button is automatically bypassed for instant entry.
  // =========================================================================
  const MH_BYPASS_INITIAL_ENTER_SCREEN = true;

  // Anti-Stall Cache Sanitation: Prevents outdated cache files & broken storage from freezing the 3D engine
  (function setupCacheSanitation() {
    if (typeof window === 'undefined') return;
    try {
      // Invalidate legacy service worker caches if any were ever registered
      if ('caches' in window) {
        caches.keys().then((names) => {
          names.forEach((name) => {
            if (name.includes('mahmud') || name.includes('portfolio') || name.includes('next') || name.includes('workbox')) {
              caches.delete(name);
            }
          });
        }).catch(() => {});
      }
      // Clean lingering navigation overrides from sessionStorage on fresh landing visits
      if (typeof sessionStorage !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search || '');
        if (!urlParams.get('glide') && !urlParams.get('target')) {
          sessionStorage.removeItem('mh_target_scene');
        }
      }
    } catch (_) {}
  })();

  // 0. Hard Permanent CSS Injection for 3-Dot Menu Elimination & Inline Horizontal Navbar
  (function injectPermanentNavbarStyles() {
    if (typeof document === 'undefined') return;
    const styleId = 'mh-navbar-hard-permanent-rules';
    if (document.getElementById(styleId)) return;
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      /* 1. PERMANENTLY SUPPRESS 3-DOT MENU BUTTON ON ALL DEVICES, ORIENTATIONS, AND VIEWPORTS */
      button._rHu7W_menu,
      button[aria-label="Menu"],
      button[class*="_rHu7W_menu"],
      ._rHu7W_menu {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
        width: 0 !important;
        height: 0 !important;
        min-width: 0 !important;
        min-height: 0 !important;
        margin: 0 !important;
        padding: 0 !important;
        border: none !important;
        position: absolute !important;
        left: -99999px !important;
        top: -99999px !important;
      }

      /* 2. DIRECT NAVBAR VISIBILITY (NO HIDING DELAY) */
      nav._rHu7W_nav,
      [class*="_rHu7W_nav"] {
        display: flex !important;
        opacity: 1 !important;
        visibility: visible !important;
        pointer-events: auto !important;
      }

      /* 3. PERMANENTLY KEEP ALL 7 NAVBAR LINKS VISIBLE AND VERTICALLY STACKED UNDER SOUND & AVAILABLE */
      nav._rHu7W_nav._rHu7W_visible,
      [class*="_rHu7W_nav"][class*="_rHu7W_visible"] {
        display: flex !important;
        flex-direction: row !important;
        align-items: center !important;
        justify-content: flex-start !important;
        opacity: 1 !important;
        visibility: visible !important;
        transform: translateY(0) !important;
        pointer-events: auto !important;
        width: 100% !important;
        box-sizing: border-box !important;
        z-index: 100 !important;
      }

      button._rHu7W_logoWrap {
        order: 1 !important;
      }
      button._rHu7W_sound,
      [class*="_rHu7W_sound"] {
        order: 2 !important;
        margin-left: auto !important;
        flex-shrink: 0 !important;
      }
      ._rHu7W_availabilityWrap,
      [class*="_rHu7W_availabilityWrap"] {
        order: 3 !important;
        margin-left: 1.25vw !important;
        flex-shrink: 0 !important;
      }

      div._rHu7W_menuPanel,
      [class*="_rHu7W_menuPanel"] {
        display: flex !important;
        flex-direction: column !important;
        align-items: flex-end !important;
        visibility: visible !important;
        opacity: 1 !important;
        pointer-events: auto !important;
        position: absolute !important;
        top: calc(100% + 8px) !important;
        right: 2.5vw !important;
        left: auto !important;
        bottom: auto !important;
        margin: 0 !important;
        padding: 0 !important;
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        clip-path: none !important;
        -webkit-clip-path: none !important;
        transform: none !important;
        width: auto !important;
        max-width: 320px !important;
        height: auto !important;
        overflow: visible !important;
        order: 10 !important;
        z-index: 101 !important;
      }

      ul._rHu7W_links,
      [class*="_rHu7W_links"] {
        display: flex !important;
        flex-direction: column !important;
        align-items: flex-end !important;
        gap: 0.55rem !important;
        margin: 0 !important;
        padding: 0 !important;
        list-style: none !important;
        pointer-events: auto !important;
      }

      li._rHu7W_linkItem,
      li[class*="_rHu7W_linkItem"] {
        display: flex !important;
        justify-content: flex-end !important;
        width: 100% !important;
        clip-path: none !important;
        -webkit-clip-path: none !important;
        opacity: 1 !important;
        visibility: visible !important;
        transform: none !important;
      }

      a._rHu7W_link,
      a[class*="_rHu7W_link"] {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: flex-end !important;
        pointer-events: auto !important;
        cursor: pointer !important;
        opacity: 0.9 !important;
        visibility: visible !important;
        font-family: var(--font-navbar-body, system-ui, sans-serif) !important;
        letter-spacing: 0.05em !important;
        font-weight: 700 !important;
        font-size: 0.92rem !important;
        text-transform: uppercase !important;
        color: #ebebeb !important;
        text-decoration: none !important;
        white-space: nowrap !important;
        padding: 4px 6px !important;
        transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
        text-shadow: 0 2px 8px rgba(0, 0, 0, 0.85) !important;
      }

      a._rHu7W_link:hover,
      a[class*="_rHu7W_link"]:hover {
        color: #00e5ff !important;
        opacity: 1 !important;
        transform: translateX(-4px) !important;
        text-shadow: 0 0 12px rgba(0, 229, 255, 0.7) !important;
      }

      @media (max-width: 768px) {
        nav._rHu7W_nav,
        [class*="_rHu7W_nav"] {
          padding-block: 0.9rem !important;
          padding-inline: 16px !important;
        }
        div._rHu7W_menuPanel,
        [class*="_rHu7W_menuPanel"] {
          right: 16px !important;
          top: calc(100% + 6px) !important;
        }
        ul._rHu7W_links,
        [class*="_rHu7W_links"] {
          gap: 0.4rem !important;
        }
        a._rHu7W_link,
        a[class*="_rHu7W_link"] {
          font-size: 0.8rem !important;
          padding: 3px 4px !important;
        }
      }
    `;
    const target = document.head || document.documentElement;
    if (target) {
      target.appendChild(style);
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        (document.head || document.documentElement).appendChild(style);
      });
    }
  })();

  // Early Direct-Glide Shield & Scroll Lock (Zero Home Page Landing Flash)
  (function initEarlyDirectGlide() {
    if (typeof window === 'undefined') return;
    try {
      const params = new URLSearchParams(window.location.search || '');
      const glide = params.get('glide') || '';
      const path = window.location.pathname || '';
      const base = (window.__REPO_BASE__) || (path.startsWith('/Mahmud-Hasan-3D-Portfolio') ? '/Mahmud-Hasan-3D-Portfolio' : '');

      // Handle project subroutes cleanly
      if (path.includes('/projects/') && !path.endsWith('/projects/') && !path.endsWith('/projects')) {
        window.location.replace(base + '/?variant=full&glide=projects');
        return;
      }

      const isGlide = Boolean(glide || path.endsWith('/about') || path.endsWith('/about.html') || path.endsWith('/contact') || path.endsWith('/contact.html') || path.endsWith('/projects') || path.endsWith('/projects.html'));
      if (isGlide) {
        document.documentElement.setAttribute('data-mh-glide', glide || 'direct');
        let shield = document.getElementById('mh-direct-glide-shield');
        if (!shield) {
          shield = document.createElement('div');
          shield.id = 'mh-direct-glide-shield';
          shield.style.cssText = 'position:fixed;inset:0;background:radial-gradient(circle at center,#111318 0%,#08090c 100%);z-index:999999;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#00e5ff;font-family:monospace;letter-spacing:2px;font-size:12px;pointer-events:all;transition:opacity 0.25s ease-out;';
          shield.innerHTML = '<div style="display:flex;flex-direction:column;align-items:center;gap:14px;padding:22px 28px;border:1px solid rgba(0,229,255,0.22);border-radius:12px;background:rgba(13,14,18,0.85);backdrop-filter:blur(8px);box-shadow:0 0 30px rgba(0,229,255,0.12);"><div style="display:flex;align-items:center;gap:12px;"><div style="width:20px;height:20px;border:2px solid rgba(0,229,255,0.2);border-top-color:#00e5ff;border-radius:50%;animation:mh-spin 0.7s linear infinite;"></div><span style="font-weight:700;letter-spacing:2px;font-size:11px;color:#ebebeb;">INITIALIZING 3D ENVIRONMENT</span></div><div style="font-size:10px;color:#888;letter-spacing:1.5px;">MAHMUD HASAN // PORTFOLIO</div></div><style>@keyframes mh-spin{to{transform:rotate(360deg)}}</style>';
          if (document.body) {
            document.body.appendChild(shield);
          } else {
            document.addEventListener('DOMContentLoaded', () => {
              if (!document.getElementById('mh-direct-glide-shield')) {
                document.body.appendChild(shield);
              }
            });
          }
        }
      }
    } catch (_) {}
  })();

  // Universal Static Asset Resolver for GitHub Pages and Subpath Deployments
  (function setupUniversalAssetResolver() {
    const base = (typeof window !== 'undefined' && window.__REPO_BASE__) || 
                 (typeof window !== 'undefined' && window.location.pathname.startsWith('/Mahmud-Hasan-3D-Portfolio') ? '/Mahmud-Hasan-3D-Portfolio' : '');
    
    function resolveAssetUrl(u) {
      if (typeof u !== 'string') return u;
      if (u.startsWith('/models/') || u.startsWith('/textures/') || u.startsWith('/datas/') || u.startsWith('/envMap/')) {
        return base + '/assets' + u;
      }
      if (base && !u.startsWith(base) && (u.startsWith('/assets/') || u.startsWith('/draco/') || u.startsWith('/fonts/') || u.startsWith('/images/'))) {
        return base + u;
      }
      return u;
    }

    if (typeof window !== 'undefined' && window.fetch) {
      const origFetch = window.fetch;
      window.fetch = function(input, init) {
        if (typeof input === 'string') {
          return origFetch.call(this, resolveAssetUrl(input), init);
        } else if (input && typeof input.url === 'string') {
          try {
            const reqUrl = new URL(input.url, window.location.origin);
            const rewritten = resolveAssetUrl(reqUrl.pathname);
            if (rewritten !== reqUrl.pathname) {
              const newUrl = reqUrl.origin + rewritten + reqUrl.search;
              return origFetch.call(this, new Request(newUrl, input));
            }
          } catch (_) {}
        }
        return origFetch.apply(this, arguments);
      };
    }

    if (typeof window !== 'undefined' && window.XMLHttpRequest) {
      const origOpen = window.XMLHttpRequest.prototype.open;
      window.XMLHttpRequest.prototype.open = function(method, url, ...rest) {
        if (typeof url === 'string') {
          url = resolveAssetUrl(url);
        }
        return origOpen.call(this, method, url, ...rest);
      };
    }
  })();

  // Note: Loader progression (0% -> 100% in 1.4s) is natively driven by the React loader engine in 3-0-2h2vnc5wo.js

  // Smart WebGPU Enter Guardian: Guarantees user NEVER gets trapped in a black screen
  (function setupSmartEnterGuardian() {
    function getBase() {
      return (typeof window !== 'undefined' && window.__REPO_BASE__) || 
             (typeof window !== 'undefined' && window.location.pathname.startsWith('/Mahmud-Hasan-3D-Portfolio') ? '/Mahmud-Hasan-3D-Portfolio' : '');
    }

    // Fail-Safe Watchdog: If 3D canvas fails or unrecoverably hangs for >6s, smoothly fallback to /lite
    let watchdogTimer = null;
    let watchdogInterval = null;
    function checkSceneProgress() {
      // If canvas is already rendered and interactive, stop checking immediately to save CPU
      if (document.querySelector('canvas')) {
        if (watchdogInterval) {
          clearInterval(watchdogInterval);
          watchdogInterval = null;
        }
        return;
      }
      const base = getBase();
      const currentPath = window.location.pathname;
      if (currentPath.includes('/lite')) return;
      if (window.location.search.includes('variant=full')) return;

      const loader = document.querySelector('.y9w63G_loaderContainer');
      const isExiting = loader && loader.classList.contains('y9w63G_exiting');
      const isGone = !loader || loader.style.display === 'none';

      if (isExiting || isGone) {
        if (!watchdogTimer) {
          watchdogTimer = setTimeout(function() {
            const nav = document.querySelector('nav');
            const hasRevealed = nav && nav.classList.contains('_rHu7W_visible');
            const hasCanvas = !!document.querySelector('canvas');
            if (!hasRevealed && !hasCanvas) {
              console.warn('⚠️ 3D scene canvas failed to initialize. Auto-transitioning to /lite view...');
              window.location.replace(base + '/lite');
            }
          }, 6000);
        }
      }
    }
    watchdogInterval = setInterval(checkSceneProgress, 300);
  })();


  // Project URLs database
  const PROJECTS_DB = {
    'madrasah ecosystem': {
      title: 'Madrasah Ecosystem',
      demo: 'https://github.com/naimsmahmud50-dotcom/Madrasha-Managemant-Softaware',
      github: 'https://github.com/naimsmahmud50-dotcom/Madrasha-Managemant-Softaware',
      isLive: false,
      category: 'Enterprise Web & Mobile'
    },
    'secure my pc': {
      title: 'Secure My PC',
      demo: 'https://github.com/naimsmahmud50-dotcom',
      github: 'https://github.com/naimsmahmud50-dotcom',
      isLive: false,
      isPrivate: true,
      category: 'Cybersecurity & Win32 (Private Repo)'
    },
    'maijrun store': {
      title: 'MAIJRUN Tech Store',
      demo: 'https://naimsmahmud50-dotcom.github.io/Maijrun-Teach/',
      github: 'https://github.com/naimsmahmud50-dotcom/Maijrun-Teach',
      isLive: true,
      category: 'Enterprise E-Commerce & PC Builder'
    },
    'maijrun tech': {
      title: 'MAIJRUN Tech Store',
      demo: 'https://naimsmahmud50-dotcom.github.io/Maijrun-Teach/',
      github: 'https://github.com/naimsmahmud50-dotcom/Maijrun-Teach',
      isLive: true,
      category: 'Enterprise E-Commerce & PC Builder'
    },
    'autonomous ai agent': {
      title: 'MAIJRUN Tech Store',
      demo: 'https://github.com/naimsmahmud50-dotcom/Maijrun-Teach',
      github: 'https://github.com/naimsmahmud50-dotcom/Maijrun-Teach',
      isLive: false,
      category: 'Enterprise E-Commerce & PC Builder'
    },
    'travel with maijrun': {
      title: 'Travel with Maijrun',
      demo: 'https://travel-w-ith-maijrun-alpha.vercel.app',
      github: 'https://github.com/naimsmahmud50-dotcom/Travel-WIth-Maijrun',
      isLive: true,
      category: 'Halal Luxury Travel Platform (Live on Vercel)'
    },
    'arabic language & cultural club': {
      title: 'Arabic Language & Cultural Club',
      demo: 'https://arabic-langualge-and-cultural-club.vercel.app',
      github: 'https://github.com/naimsmahmud50-dotcom/Arabic-Langualge-and-Cultural-Club',
      isLive: true,
      category: 'Production EdTech Web Platform (Live on Vercel)'
    },
    'student life circle': {
      title: 'Student Life Circle',
      demo: 'https://naimsmahmud50-dotcom.github.io/Student-Life-Circle/',
      github: 'https://github.com/naimsmahmud50-dotcom/Student-Life-Circle',
      isLive: true,
      category: 'Campus Networking & EdTech Platform (Live on GitHub Pages)'
    },
    'facebook automation': {
      title: 'Facebook Automation',
      demo: 'https://github.com/naimsmahmud50-dotcom/Facebook-Automation-',
      github: 'https://github.com/naimsmahmud50-dotcom/Facebook-Automation-',
      isLive: false,
      category: 'AI & Bot Automation'
    },
    'linkedin automation': {
      title: 'LinkedIn Automation',
      demo: 'https://github.com/naimsmahmud50-dotcom/Linkdin-Automation-',
      github: 'https://github.com/naimsmahmud50-dotcom/Linkdin-Automation-',
      isLive: false,
      category: 'Autonomous AI Growth & Lead Engine'
    }
  };

  const PROJECTS_LIST = [
    PROJECTS_DB['madrasah ecosystem'],
    PROJECTS_DB['secure my pc'],
    PROJECTS_DB['maijrun store'],
    PROJECTS_DB['travel with maijrun'],
    PROJECTS_DB['arabic language & cultural club'],
    PROJECTS_DB['student life circle'],
    PROJECTS_DB['facebook automation'],
    PROJECTS_DB['linkedin automation']
  ];

  // =========================================================================
  // EXTRA SKILLS: CREATIVE MEDIA & VIDEO PRODUCTIONS SHOWCASE
  // Instructions: To add your own videos:
  // 1. Video Source: Paste file ID or share link in 'driveUrl':
  //    e.g. driveUrl: 'https://drive.google.com/file/d/YOUR_FILE_ID/view?usp=sharing'
  // 2. YouTube: Paste your YouTube video ID or link in 'youtubeId':
  //    e.g. youtubeId: 'L_LUpnjgPso'
  // 3. Direct File: Paste direct MP4 URL in 'videoUrl'
  // =========================================================================
  const AI_VIDEOS_CONFIG = [
    {
      id: 'ai-vid-1',
      badge: '5-STAR PROMOTIONAL FILM',
      accentColor: '#00ff88',
      title: 'As-Sunnah Foundation: High-Impact Promotional Film',
      category: 'BRAND CAMPAIGN & PROMOTIONAL DIRECTION',
      tools: ['Premiere Pro', 'After Effects', 'Cinematic Sound Design', '4K Color Grading'],
      desc: 'Flagship promotional brand film engineered for As-Sunnah Foundation featuring high-impact visual pacing, compelling emotional narrative, dynamic audio sync, and broadcast-grade polish.',
      driveUrl: 'https://drive.google.com/file/d/1YfTn4LIyoX7vUcb0kkTFHkVgA8F56TRx/view?usp=sharing',
      youtubeId: '',
      videoUrl: '',
      ratio: '16:9'
    },
    {
      id: 'ai-vid-2',
      badge: 'ROYAL ISLAMIC CINEMATIC 1080P',
      accentColor: '#eab308',
      title: 'Royal Islamic Heritage: Cinematic Visual Showcase',
      category: 'ISLAMIC MEDIA & ROYAL DIRECTION',
      tools: ['Motion Graphics', 'After Effects', 'Islamic Visual Arts', 'Studio Audio Mastering'],
      desc: 'Atmospheric and regal Islamic promotional showcase featuring traditional aesthetic elegance, geometric motifs, royal color grading, and heartfelt devotional cinematography.',
      driveUrl: 'https://drive.google.com/file/d/1tU-9vTS6K4j76e02M2AkT8Di9DMVvlJT/view?usp=sharing',
      youtubeId: '',
      videoUrl: '',
      ratio: '16:9'
    },
    {
      id: 'ai-vid-3',
      badge: 'AI AGENT MOTION GRAPHICS',
      accentColor: '#00e5ff',
      title: 'Autonomous AI Agents: Kinetic Motion Explainer',
      category: 'AI AUTOMATION & MOTION DESIGN',
      tools: ['Kinetic Motion Graphics', 'Autonomous Agents Flow', 'Remotion & After Effects', 'Cyberpunk VFX'],
      desc: 'Futuristic kinetic motion breakdown demonstrating the core mechanics, multi-agent coordination, and real-time execution pipelines of autonomous AI systems.',
      driveUrl: 'https://drive.google.com/file/d/1JuNz6zA5_Yp5vFte5iRTbT4zHLgbwwwC/view?usp=sharing',
      youtubeId: '',
      videoUrl: '',
      ratio: '16:9'
    },
    {
      id: 'ai-vid-4',
      badge: 'COMMERCIAL NARRATIVE & MOTION',
      accentColor: '#a78bfa',
      title: 'Creative Brand Storytelling: Visual Production',
      category: 'COMMERCIAL NARRATIVE & VISUAL DIRECTION',
      tools: ['Cinematic Direction', 'Motion Graphics', 'Sound Design', 'Storyboarding'],
      desc: 'High-impact commercial storytelling combining bespoke cinematic narration with synchronized kinetic motion design, dynamic pacing, and broadcast audio engineering.',
      driveUrl: 'https://drive.google.com/file/d/1ats_4U8ZtcWlxrv0bCxoVdJzstwzcvUM/view?usp=sharing',
      youtubeId: '',
      videoUrl: '',
      ratio: '16:9'
    },
    {
      id: 'ai-vid-5',
      badge: 'TECH THOUGHT LEADERSHIP',
      accentColor: '#f43f5e',
      title: 'Vibe Coding vs Agentic Engineering: The Paradigm Shift',
      category: 'SOFTWARE ENGINEERING & AI ARCHITECTURE',
      tools: ['AI System Architecture', 'Kinetic Typography', 'Technical Narration', 'Visual Storytelling'],
      desc: 'In-depth conceptual breakdown contrasting fast vibe coding with production-grade agentic engineering, structured specifications, and deterministic code systems.',
      driveUrl: 'https://drive.google.com/file/d/1GtOJMEeEMpaWcoQ0tqADP0B8d6Pr7CZs/view?usp=sharing',
      youtubeId: '',
      videoUrl: '',
      ratio: '16:9'
    },
    {
      id: 'ai-vid-6',
      badge: 'EDUCATIONAL & ROADMAP',
      accentColor: '#38bdf8',
      title: 'Learn AI: Next-Gen Artificial Intelligence Roadmap',
      category: 'AI EDUCATION & VISUAL LEARNING',
      tools: ['Educational Storyboarding', 'AI Concept Visualization', 'Video Post-Processing', 'Audio Narration'],
      desc: 'Comprehensive visual roadmap outlining key learning milestones in modern artificial intelligence, deep learning models, automation frameworks, and agent design.',
      driveUrl: 'https://drive.google.com/file/d/1B65700qcb7Z_kGjFNnSlV-Y0sFbGVbOI/view?usp=sharing',
      youtubeId: '',
      videoUrl: '',
      ratio: '16:9'
    }
  ];

  // Helper to resolve video stream/embed source (Google Drive, YouTube, direct MP4)
  function resolveVideoSource(video) {
    if (!video) return { type: 'youtube', embedUrl: 'https://www.youtube-nocookie.com/embed/L_LUpnjgPso?autoplay=1&rel=0' };

    const candidateUrl = video.driveUrl || video.videoUrl || (video.youtubeId && video.youtubeId.includes('drive.google.com') ? video.youtubeId : '');
    
    // 1. Google Drive Link Parsing
    if (candidateUrl && candidateUrl.includes('drive.google.com')) {
      const driveMatch = candidateUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || 
                         candidateUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/) ||
                         candidateUrl.match(/drive\.google\.com\/.*\/([a-zA-Z0-9_-]{20,})/);
      const fileId = driveMatch ? driveMatch[1] : '';
      if (fileId) {
        return {
          type: 'drive',
          embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
          fileId: fileId
        };
      }
    }

    // 2. Direct HTML5 video (.mp4, .webm, .ogg)
    if (video.videoUrl && (/\.(mp4|webm|ogg)($|\?)/i.test(video.videoUrl))) {
      return {
        type: 'html5',
        videoUrl: video.videoUrl,
        embedUrl: video.videoUrl
      };
    }

    // 3. YouTube link or ID
    let ytId = video.youtubeId || '';
    if (ytId.includes('youtube.com') || ytId.includes('youtu.be')) {
      const ytMatch = ytId.match(/(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*)/);
      if (ytMatch && ytMatch[1] && ytMatch[1].length === 11) {
        ytId = ytMatch[1];
      }
    }
    if (!ytId) {
      ytId = 'L_LUpnjgPso';
    }

    return {
      type: 'youtube',
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`,
      youtubeId: ytId
    };
  }

  // AI Video Player Modal Functions
  function openVideoPlayer(videoId) {
    const video = AI_VIDEOS_CONFIG.find(v => v.id === videoId) || AI_VIDEOS_CONFIG[0];
    if (!video) return;

    let modal = document.getElementById('mh-video-player-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'mh-video-player-modal';
      modal.className = 'mh-video-modal-backdrop';
      modal.innerHTML = `
        <div class="mh-video-modal-card">
          <div class="mh-video-modal-header">
            <div class="mh-video-modal-titles">
              <span class="mh-video-badge" id="mh-vmodal-badge">4K AI CINEMATIC</span>
              <h3 class="mh-video-modal-title" id="mh-vmodal-title">Video Title</h3>
              <p class="mh-video-modal-sub" id="mh-vmodal-sub">AI DIRECTION &amp; CINEMATOGRAPHY</p>
            </div>
            <button type="button" class="mh-video-modal-close" id="mh-vmodal-close" aria-label="Close Video">✕</button>
          </div>
          <div class="mh-video-player-container" id="mh-vmodal-player"></div>
          <div class="mh-video-modal-info">
            <p class="mh-video-modal-desc" id="mh-vmodal-desc"></p>
            <div class="mh-video-modal-tools" id="mh-vmodal-tools"></div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      modal.querySelector('#mh-vmodal-close').addEventListener('click', closeVideoPlayer);
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeVideoPlayer();
      });
    }

    // Set title and badges
    document.getElementById('mh-vmodal-badge').textContent = video.badge;
    document.getElementById('mh-vmodal-title').textContent = video.title;
    document.getElementById('mh-vmodal-sub').textContent = video.category;
    document.getElementById('mh-vmodal-desc').textContent = video.desc;
    document.getElementById('mh-vmodal-tools').innerHTML = video.tools.map(t => `<span class="mh-vtool-pill">${t}</span>`).join('');

    // Setup player
    const playerWrap = document.getElementById('mh-vmodal-player');
    const srcInfo = resolveVideoSource(video);

    if (srcInfo.type === 'drive') {
      playerWrap.innerHTML = `
        <iframe 
          src="${srcInfo.embedUrl}" 
          title="${video.title}" 
          class="mh-video-iframe"
          frameborder="0" 
          allow="autoplay; fullscreen" 
          allowfullscreen>
        </iframe>
      `;
    } else if (srcInfo.type === 'html5') {
      playerWrap.innerHTML = `
        <video controls autoplay playsinline class="mh-video-element">
          <source src="${srcInfo.videoUrl}" type="video/mp4">
          Your browser does not support HTML5 video.
        </video>
      `;
    } else {
      playerWrap.innerHTML = `
        <iframe 
          src="${srcInfo.embedUrl}" 
          title="${video.title}" 
          class="mh-video-iframe"
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          allowfullscreen>
        </iframe>
      `;
    }

    modal.classList.add('active');
    document.body.classList.add('mh-modal-open');
  }

  function closeVideoPlayer() {
    const modal = document.getElementById('mh-video-player-modal');
    if (modal) {
      modal.classList.remove('active');
      const playerWrap = document.getElementById('mh-vmodal-player');
      if (playerWrap) playerWrap.innerHTML = '';
    }
    document.body.classList.remove('mh-modal-open');
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeVideoPlayer();
      closeMyVideosModal();
            return;
    }
    const modal = document.getElementById('mh-my-videos-modal');
    if (modal && modal.classList.contains('active')) {
      const dialog = modal.querySelector('.mh-videos-modal-dialog');
      if (dialog) {
        if (e.key === 'ArrowDown') {
          dialog.scrollTop += 60;
          e.preventDefault();
        } else if (e.key === 'ArrowUp') {
          dialog.scrollTop -= 60;
          e.preventDefault();
        } else if (e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey)) {
          dialog.scrollTop += dialog.clientHeight * 0.8;
          e.preventDefault();
        } else if (e.key === 'PageUp' || (e.key === ' ' && e.shiftKey)) {
          dialog.scrollTop -= dialog.clientHeight * 0.8;
          e.preventDefault();
        }
      }
    }
  });

  window.__mhOpenVideoPlayer = openVideoPlayer;
  window.__mhCloseVideoPlayer = closeVideoPlayer;

  // Dedicated Extra Skills & Videos Showcase Modal Controller
  function openMyVideosModal() {
    let modal = document.getElementById('mh-my-videos-modal');
    if (modal) {
      modal.remove(); // recreate with fresh human-crafted design
    }
    modal = document.createElement('div');
    modal.id = 'mh-my-videos-modal';
    modal.className = 'mh-videos-modal-backdrop';
    modal.setAttribute('data-lenis-prevent', 'true');
    modal.setAttribute('data-lenis-prevent-wheel', 'true');
    modal.setAttribute('data-lenis-prevent-touch', 'true');
    modal.innerHTML = `
      <div class="mh-videos-modal-dialog" data-lenis-prevent="true" data-lenis-prevent-wheel="true" data-lenis-prevent-touch="true" tabindex="-1">
        <div class="mh-videos-modal-header">
          <div class="mh-videos-modal-titles">
            <div class="mh-videos-live-kicker">
              <span class="mh-kicker-dot"></span>
              <span class="mh-kicker-text">STUDIO ARCHIVE · CREATIVE DIRECTION</span>
            </div>
            <h3 class="mh-videos-headline">
              <svg class="mh-header-film-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <rect width="20" height="20" x="2" y="2" rx="3"></rect>
                <path d="M7 2v20M17 2v20M2 12h20M2 7h5M2 17h5M17 7h5M17 17h5"></path>
              </svg>
              Creative Media &amp; Video Productions
            </h3>
            <p class="mh-videos-subline">High-craft commercial direction, kinetic motion graphics, system explainers, and cinematic post-production.</p>
          </div>
          <div class="mh-videos-header-actions">
            <button type="button" class="mh-videos-modal-close" id="mh-videos-modal-close" aria-label="Close Production Showcase">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
        <div class="mh-videos-cards-grid">
          ${AI_VIDEOS_CONFIG.map(v => {
            return `
            <article class="mh-vid-card" data-video-id="${v.id}" style="--card-accent: ${v.accentColor};">
              <div class="mh-vid-card-banner">
                <div class="mh-vid-banner-glow"></div>
                <div class="mh-vid-banner-content">
                  <span class="mh-vid-badge" style="border-color: ${v.accentColor}; color: ${v.accentColor}; background: rgba(0, 0, 0, 0.4);">${v.badge}</span>
                  <span class="mh-vid-cat">${v.category}</span>
                </div>
              </div>
              <div class="mh-vid-card-body">
                <h4 class="mh-vid-title">${v.title}</h4>
                <p class="mh-vid-desc">${v.desc}</p>
                <div class="mh-vid-tools">
                  ${v.tools.map(t => `<span class="mh-vid-tool-tag">${t}</span>`).join('')}
                </div>
                <div class="mh-vid-actions-row">
                  <button type="button" class="mh-vid-play-btn" onclick="window.__mhOpenVideoPlayer('${v.id}')">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M8 5v14l11-7z"></path>
                    </svg>
                    <span>WATCH PREVIEW</span>
                  </button>
                </div>
              </div>
            </article>
          `;
          }).join('')}
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    const dialogEl = modal.querySelector('.mh-videos-modal-dialog');

    // Universal wheel scrolling: scroll dialog whether cursor is on card, header, or backdrop margin
    modal.addEventListener('wheel', (e) => {
      e.stopPropagation();
      if (dialogEl && !dialogEl.contains(e.target)) {
        dialogEl.scrollTop += e.deltaY;
        if (e.cancelable) e.preventDefault();
      }
    }, { passive: false });

    // Touch scroll support for trackpads and touchscreens
    let touchStartY = 0;
    modal.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches.length === 1) {
        touchStartY = e.touches[0].clientY;
      }
    }, { passive: true });

    modal.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches.length === 1) {
        const touchY = e.touches[0].clientY;
        const deltaY = touchStartY - touchY;
        touchStartY = touchY;
        if (dialogEl && !dialogEl.contains(e.target)) {
          dialogEl.scrollTop += deltaY;
        }
      }
    }, { passive: true });

    modal.querySelector('#mh-videos-modal-close').addEventListener('click', closeMyVideosModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeMyVideosModal();
    });

    modal.classList.add('active');
    document.body.classList.add('mh-modal-open');
    if (dialogEl) {
      setTimeout(() => {
        try { dialogEl.focus(); } catch (_) {}
      }, 100);
    }
  }

  function closeMyVideosModal() {
    const modal = document.getElementById('mh-my-videos-modal');
    if (modal) {
      modal.classList.remove('active');
    }
    const playerModal = document.getElementById('mh-video-player-modal');
    if (!playerModal || !playerModal.classList.contains('active')) {
      document.body.classList.remove('mh-modal-open');
    }
  }

  window.__mhOpenMyVideos = openMyVideosModal;
  window.__mhCloseMyVideos = closeMyVideosModal;
  window.__mhOpenExtraSkills = openMyVideosModal;
  window.__mhCloseExtraSkills = closeMyVideosModal;

  // 1. Toast Notification Helper
  function showToast(message) {
    let toast = document.getElementById('mh-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'mh-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  // 2. Email Copy with Animated Toast
  function setupEmailCopy() {
    document.addEventListener('click', (e) => {
      const emailLink = e.target.closest('a[href^="mailto:"], .oQ_U9W_email');
      if (emailLink) {
        const email = 'mahmudhasan.infodev@gmail.com';
        navigator.clipboard.writeText(email).then(() => {
          showToast('✓ Email copied: ' + email);
        }).catch(() => {
          showToast('Email: ' + email);
        });
      }
    });
  }

  // 3. Live Dhaka Time Clock (GMT+6)
  function initDhakaClock() {
    function getDhakaTime() {
      const now = new Date();
      const options = {
        timeZone: 'Asia/Dhaka',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      return new Intl.DateTimeFormat('en-US', options).format(now);
    }

    function ensureClockElement() {
      if (!document.body) return null;
      let clockSpan = document.getElementById('mh-dhaka-clock');
      if (!clockSpan) {
        const container = document.createElement('div');
        container.id = 'mh-dhaka-clock-container';
        container.style.cssText = 'position:fixed; bottom:18px; left:20px; z-index:90; font-family:"SF Mono",Menlo,monospace; font-size:11px; letter-spacing:1px; color:rgba(255,255,255,0.7); display:flex; align-items:center; gap:6px; pointer-events:none; background:rgba(10,16,28,0.75); padding:4px 10px; border-radius:9999px; border:1px solid rgba(255,255,255,0.1); backdrop-filter:blur(8px); -webkit-backdrop-filter:blur(8px);';
        container.innerHTML = '<span style="width:6px; height:6px; border-radius:50%; background:#00e5ff; box-shadow:0 0 8px #00e5ff; display:inline-block;"></span><span>DHAKA: <span id="mh-dhaka-clock" style="color:#00e5ff; font-weight:600;">' + getDhakaTime() + '</span></span>';
        document.body.appendChild(container);
        clockSpan = document.getElementById('mh-dhaka-clock');
      }
      return clockSpan;
    }

    ensureClockElement();
    setInterval(() => {
      const clockSpan = document.getElementById('mh-dhaka-clock') || ensureClockElement();
      if (clockSpan) {
        clockSpan.textContent = getDhakaTime();
      }
    }, 1000);
  }

  // 4. Interactive AI Agent Terminal (Pillar 1)
  function ensureTerminalInDom() {
    if (!document.body) return;

    // Inject Toggle Button
    let toggle = document.getElementById('mh-terminal-toggle');
    if (!toggle) {
      toggle = document.createElement('button');
      toggle.id = 'mh-terminal-toggle';
      toggle.innerHTML = '<span class="terminal-dot"></span><span>&gt;_ AI TERMINAL</span>';
      toggle.setAttribute('aria-label', 'Open AI Agent Console');
      document.body.appendChild(toggle);
      toggle.addEventListener('click', toggleTerminal);
    }

    // Hide if loader is still visible on screen
    const loader = document.querySelector('.y9w63G_loaderContainer, [class*="loaderContainer"]');
    const isLoaderActive = loader && 
      window.getComputedStyle(loader).display !== 'none' && 
      window.getComputedStyle(loader).opacity !== '0' && 
      !loader.classList.contains('y9w63G_exiting') &&
      !loader.classList.contains('exiting');

    if (isLoaderActive) {
      toggle.style.opacity = '0';
      toggle.style.pointerEvents = 'none';
    } else {
      toggle.style.opacity = '1';
      toggle.style.pointerEvents = 'auto';
    }

    // Clean up any overlapping contact hub elements immediately
    const leftoverHub = document.getElementById('mh-contact-hub-enhanced');
    if (leftoverHub && leftoverHub.parentNode) {
      leftoverHub.parentNode.removeChild(leftoverHub);
    }

    // Inject Terminal Modal
    if (!document.getElementById('mh-terminal-modal')) {
      const modal = document.createElement('div');
      modal.id = 'mh-terminal-modal';
      modal.innerHTML = `
        <div class="mh-terminal-window">
          <div class="mh-terminal-header">
            <div class="mh-terminal-controls">
              <span class="mh-terminal-dot red"></span>
              <span class="mh-terminal-dot yellow"></span>
              <span class="mh-terminal-dot green"></span>
            </div>
            <div class="mh-terminal-title">agent@mahmud-hasan:~$ [v2.4-RELEASE]</div>
            <button class="mh-terminal-close" id="mh-terminal-close-btn" aria-label="Close terminal">✕</button>
          </div>
          <div class="mh-terminal-body" id="mh-terminal-output">
            <div style="color: #00e5ff; font-weight: bold; margin-bottom: 8px;">
========================================================================<br>
⚡ MAHMUD HASAN — AI AGENT &amp; DEFENSE-GRADE SYSTEMS RUNTIME<br>
========================================================================
            </div>
            <div style="color: #94a3b8; margin-bottom: 12px;">
              System: Linux x86_64 | Security: Arena Web Security Certified<br>
              Specialties: Autonomous Agents, Full-Stack Next.js, Android, Penetration Testing<br>
              Type <span style="color:#00ff88; font-weight:bold;">help</span> to inspect autonomous capabilities.
            </div>
            <div id="mh-terminal-history"></div>
            <div class="mh-terminal-prompt">
              <span>agent@mahmud:~$</span>
              <input type="text" id="mh-terminal-cmd" class="mh-terminal-input" autofocus autocomplete="off" spellcheck="false" />
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      const closeBtn = document.getElementById('mh-terminal-close-btn');
      if (closeBtn) closeBtn.addEventListener('click', closeTerminal);
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeTerminal();
      });

      const cmdInput = document.getElementById('mh-terminal-cmd');
      if (cmdInput) cmdInput.addEventListener('keydown', handleCommand);
    }
  }

  function setupTerminal() {
    // Initial run immediately and recurring guardian
    ensureTerminalInDom();
    setTimeout(ensureTerminalInDom, 400);
    setInterval(ensureTerminalInDom, 2500);

    // Keyboard shortcut: Cmd+K / Ctrl+K
    window.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        toggleTerminal();
      }
      if (e.key === 'Escape') {
        closeTerminal();
      }
    });
  }

  function toggleTerminal() {
    const modal = document.getElementById('mh-terminal-modal');
    if (modal) {
      modal.classList.toggle('active');
      if (modal.classList.contains('active')) {
        setTimeout(() => {
          const input = document.getElementById('mh-terminal-cmd');
          if (input) input.focus();
        }, 100);
      }
    }
  }

  function closeTerminal() {
    const modal = document.getElementById('mh-terminal-modal');
    if (modal) modal.classList.remove('active');
  }

  function handleCommand(e) {
    if (e.key !== 'Enter') return;
    const input = e.target;
    const rawCmd = input.value.trim();
    const cmd = rawCmd.toLowerCase();
    input.value = '';

    const history = document.getElementById('mh-terminal-history');
    const line = document.createElement('div');
    line.style.marginBottom = '12px';

    const promptEcho = document.createElement('div');
    promptEcho.innerHTML = `<span style="color:#00e5ff; font-weight:bold;">agent@mahmud:~$</span> ${escapeHtml(rawCmd)}`;
    line.appendChild(promptEcho);

    const response = document.createElement('div');
    response.style.marginTop = '4px';

    switch (cmd) {
      case 'help':
        response.innerHTML = `
          <div style="color:#e0e6ed;">Available Commands:</div>
          <div style="margin-left:14px; margin-top:4px;">
            <div><span style="color:#00ff88; font-weight:bold;">skills</span>          - Display AI, Web, Android &amp; Security capabilities</div>
            <div><span style="color:#c084fc; font-weight:bold;">videos</span>          - Launch AI Video Productions &amp; Motion Showcase</div>
            <div><span style="color:#00ff88; font-weight:bold;">security-scan</span>   - Run live heuristic penetration audit simulation</div>
            <div><span style="color:#00ff88; font-weight:bold;">projects</span>        - List all 7 enterprise &amp; AI projects</div>
            <div><span style="color:#00ff88; font-weight:bold;">contact</span>         - One-click launch WhatsApp / Email inquiry</div>
            <div><span style="color:#00ff88; font-weight:bold;">whoami</span>          - Display Mahmud Hasan identity credentials</div>
            <div><span style="color:#00ff88; font-weight:bold;">clear</span>           - Clear console screen</div>
            <div><span style="color:#00ff88; font-weight:bold;">exit</span>            - Close terminal console</div>
          </div>
        `;
        break;

      case 'videos':
      case 'video':
        response.innerHTML = `
          <div style="color:#c084fc; font-weight:bold; margin-bottom:6px;">── CREATIVE MEDIA &amp; MOTION SHOWCASE ──</div>
          <div style="color:#00ff88; font-weight:bold;">[🎬 4K CINEMATIC COMMERCIAL] Neon Odyssey</div>
          <div style="color:#94a3b8; margin-left:14px; margin-bottom:4px;">Cinematic Direction · Storyboarding · Premiere Pro · Sound Design</div>
          <div style="color:#00e5ff; font-weight:bold;">[⚡ KINETIC MOTION VFX] Cyber Pulse</div>
          <div style="color:#94a3b8; margin-left:14px; margin-bottom:4px;">Kinetic Typography · 3D Motion Design · After Effects · Remotion</div>
          <div style="color:#a78bfa; font-weight:bold;">[🎭 CHARACTER NARRATIVE] Echoes of Tomorrow</div>
          <div style="color:#94a3b8; margin-left:14px; margin-bottom:4px;">Character Storytelling · Dynamic Visual Pacing · Studio Audio Mastering</div>
          <div style="color:#f59e0b; font-weight:bold;">[💻 TECH PRODUCT DEMO] Nexus Core</div>
          <div style="color:#94a3b8; margin-left:14px; margin-bottom:8px;">Technical Product Narrative · VFX Compositing · 4K Mastering · Sound Architecture</div>
          <div style="margin-top:6px;">
            <a href="javascript:void(0)" onclick="if(window.__mhOpenMyVideos)window.__mhOpenMyVideos()" style="color:#00e5ff; text-decoration:underline; font-weight:bold;">[▶ LAUNCH INTERACTIVE VIDEO SHOWCASE]</a>
          </div>
        `;
        break;

      case 'skills':
        response.innerHTML = `
          <div style="color:#00e5ff; font-weight:bold; margin-bottom:6px;">── TECHNICAL SUPERPOWERS MATRIX ──</div>
          <div style="color:#00ff88; font-weight:bold;">[🤖 AI &amp; AUTONOMOUS SYSTEMS]</div>
          <div style="color:#94a3b8; margin-left:14px; margin-bottom:6px;">LangChain, Autonomous Agent Swarms, OpenAI/Claude API, Meta Graph API, WhatsApp Bot Automation, Puppeteer Web Scraping</div>
          
          <div style="color:#c084fc; font-weight:bold;">[🎬 CREATIVE MEDIA &amp; MOTION PRODUCTIONS]</div>
          <div style="color:#94a3b8; margin-left:14px; margin-bottom:6px;">Commercial Visual Direction, Kinetic Typography, 3D Motion Graphics, After Effects, Remotion, Studio Sound Architecture</div>

          <div style="color:#00e5ff; font-weight:bold;">[🌐 WEB &amp; CLOUD ARCHITECTURE]</div>
          <div style="color:#94a3b8; margin-left:14px; margin-bottom:6px;">Next.js (App Router), React, Node.js, TypeScript, PostgreSQL, MongoDB, REST &amp; GraphQL APIs, Docker</div>
          
          <div style="color:#a78bfa; font-weight:bold;">[📱 MOBILE ENGINEERING]</div>
          <div style="color:#94a3b8; margin-left:14px; margin-bottom:6px;">Flutter, Native Android SDK, Java/Kotlin, Reactive State Architecture</div>
          
          <div style="color:#f59e0b; font-weight:bold;">[🛡️ CYBERSECURITY &amp; SYSTEM DEFENSE]</div>
          <div style="color:#94a3b8; margin-left:14px;">Arena Web Security Certified, OWASP Top 10 Defense, Penetration Testing, Win32 System Protection</div>
        `;
        break;

      case 'security-scan':
        response.innerHTML = `
          <div style="color:#00e5ff;">[*] Initializing heuristic penetration audit...</div>
          <div style="color:#94a3b8;">[+] Scanning target: mahmudhasan.dev</div>
          <div style="color:#00ff88;">[✓] Port audit: Zero exposed attack surfaces [PASS]</div>
          <div style="color:#00ff88;">[✓] SQL Injection &amp; XSS Defense: Rigorous input sanitization active [PASS]</div>
          <div style="color:#00ff88;">[✓] Memory Integrity &amp; Process Isolation: Verified [PASS]</div>
          <div style="color:#00ff88;">[✓] CSP &amp; Cryptographic Transport: Strict TLS 1.3 enforced [PASS]</div>
          <div style="color:#f59e0b; margin-top:6px; font-weight:bold;">
            🛡️ RESULT: DEFENSE-GRADE HARDENED • ARENA WEB SECURITY CERTIFIED
          </div>
        `;
        break;

      case 'projects':
        response.innerHTML = `
          <div style="color:#00e5ff; font-weight:bold; margin-bottom:6px;">── 8 PRODUCTION PROJECTS ──</div>
          <div>1. <a href="https://github.com/naimsmahmud50-dotcom/Madrasha-Managemant-Softaware" target="_blank" style="color:#00ff88; text-decoration:underline;">Madrasah Ecosystem</a> - Multi-tenant institution management platform</div>
          <div>2. <a href="https://github.com/naimsmahmud50-dotcom" target="_blank" style="color:#00ff88; text-decoration:underline;">Secure My PC</a> <span style="color:#00e5ff; font-size:11px; margin-left:4px; border:1px solid rgba(0,229,255,0.4); padding:1px 6px; border-radius:4px;">[Private Enterprise Repo]</span> - Defensive desktop security &amp; authorization platform</div>
          <div>3. <a href="https://github.com/naimsmahmud50-dotcom/Maijrun-Teach" target="_blank" style="color:#00ff88; text-decoration:underline;">MAIJRUN Tech Store</a> - Enterprise tech e-commerce &amp; custom PC builder platform</div>
          <div>4. <a href="https://travel-w-ith-maijrun-alpha.vercel.app" target="_blank" style="color:#00ff88; text-decoration:underline;">Travel with Maijrun</a> - Live enterprise travel booking portal</div>
          <div>5. <a href="https://arabic-langualge-and-cultural-club.vercel.app" target="_blank" style="color:#00ff88; text-decoration:underline;">Arabic Language &amp; Cultural Club</a> - Interactive learning community platform</div>
          <div>6. <a href="https://naimsmahmud50-dotcom.github.io/Student-Life-Circle/" target="_blank" style="color:#00ff88; text-decoration:underline;">Student Life Circle</a> - Campus networking &amp; productivity ecosystem (Live)</div>
          <div>7. <a href="https://github.com/naimsmahmud50-dotcom/Facebook-Automation-" target="_blank" style="color:#00ff88; text-decoration:underline;">Facebook Automation</a> - Meta Graph API automated marketing bot</div>
          <div>8. <a href="https://github.com/naimsmahmud50-dotcom/Linkdin-Automation-" target="_blank" style="color:#00ff88; text-decoration:underline;">LinkedIn Automation</a> - Autonomous AI growth, lead generation &amp; Telegram bot control</div>
        `;
        break;

      case 'contact':
        response.innerHTML = `
          <div style="color:#00ff88; font-weight:bold;">Dispatched Contact Gateway:</div>
          <div>WhatsApp: <a href="https://wa.me/8801767850859?text=Hi%20Mahmud,%20I%20saw%20your%20portfolio%20and%20would%20like%20to%20discuss%20a%20project!" target="_blank" style="color:#00e5ff; text-decoration:underline;">+880 1767 850859 (Instant Chat)</a></div>
          <div>Email: <a href="mailto:mahmudhasan.infodev@gmail.com" style="color:#00e5ff; text-decoration:underline;">mahmudhasan.infodev@gmail.com</a></div>
        `;
        break;

      case 'whoami':
        response.innerHTML = `
          <div style="color:#ffffff;">
            <strong>Mahmud Hasan</strong> — AI Automation Architect &amp; Certified Web Security Engineer.<br>
            Location: Dhaka, Bangladesh (GMT+6)<br>
            Email: mahmudhasan.infodev@gmail.com<br>
            GitHub: github.com/naimsmahmud50-dotcom<br>
            Status: Available for High-Impact Autonomous AI &amp; Enterprise Web Roles.
          </div>
        `;
        break;

      case 'clear':
        history.innerHTML = '';
        return;

      case 'exit':
      case 'quit':
        closeTerminal();
        return;

      case '':
        break;

      default:
        response.innerHTML = `<span style="color:#f87171;">Command not found: "${escapeHtml(rawCmd)}". Type <span style="color:#00ff88; font-weight:bold;">help</span> for available commands.</span>`;
    }

    line.appendChild(response);
    history.appendChild(line);

    const body = document.getElementById('mh-terminal-output');
    body.scrollTop = body.scrollHeight;
  }

  function escapeHtml(str) {
    return str.replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  }

  // 5. 3D Scene HUD Direct Action Buttons (Pillar 3)
  function setupProjectHudActions() {
    setInterval(() => {
      // Do not mutate DOM during initial loader & React hydration
      if (document.querySelector('button[data-testid="loader-enter"]')) return;

      const hudRoot = document.querySelector('.zaNkXW_root, [class*="zaNkXW_root"]');
      if (!hudRoot) return;

      let matchedProject = null;
      try {
        if (window.__mhProjectStore && typeof window.__mhProjectStore.getState === 'function') {
          const idx = window.__mhProjectStore.getState().currentProjectIndex;
          if (typeof idx === 'number' && PROJECTS_LIST[idx]) {
            matchedProject = PROJECTS_LIST[idx];
          }
        }
      } catch (_) {}

      if (!matchedProject) {
        const titleEl = hudRoot.querySelector('.zaNkXW_title, [class*="zaNkXW_title"]');
        if (titleEl) {
          const titleText = titleEl.textContent.trim().toLowerCase();
          for (const [key, proj] of Object.entries(PROJECTS_DB)) {
            if (titleText.includes(key) || key.includes(titleText)) {
              matchedProject = proj;
              break;
            }
          }
        }
      }

      let actionsWrap = document.getElementById('mh-hud-quick-actions');
      if (!actionsWrap) {
        actionsWrap = document.createElement('div');
        actionsWrap.id = 'mh-hud-quick-actions';
        actionsWrap.style.display = 'inline-flex';
        actionsWrap.style.gap = '10px';
        actionsWrap.style.marginLeft = '12px';
        actionsWrap.style.verticalAlign = 'middle';

        const discoverBtn = hudRoot.querySelector('.zaNkXW_button, [class*="zaNkXW_button"]');
        if (discoverBtn && discoverBtn.parentNode) {
          discoverBtn.parentNode.insertBefore(actionsWrap, discoverBtn.nextSibling);
        }
      }

      if (matchedProject) {
        const isLive = Boolean(matchedProject.isLive);
        const isPrivate = Boolean(matchedProject.isPrivate);
        const liveIndicator = isLive 
          ? '<span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:#00ff88;box-shadow:0 0 8px #00ff88;margin-right:2px;"></span>' 
          : isPrivate
          ? '<span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:#00e5ff;box-shadow:0 0 8px #00e5ff;margin-right:2px;"></span>'
          : '<span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:#8c8c8c;margin-right:2px;"></span>';
        const demoLabel = isPrivate ? 'PRIVATE REPO' : (isLive ? 'LIVE DEMO' : 'GITHUB DEMO');
        const demoBorder = isLive ? '1.5px solid #00ff88' : (isPrivate ? '1.5px solid rgba(0, 229, 255, 0.45)' : '1.5px solid rgba(255, 255, 255, 0.25)');
        const demoGlow = isLive ? '0 4px 18px rgba(0, 255, 136, 0.3)' : (isPrivate ? '0 4px 18px rgba(0, 229, 255, 0.35)' : '0 4px 14px rgba(0, 0, 0, 0.5)');
        const gitLabel = isPrivate ? 'GITHUB PROFILE' : 'GITHUB REPO';

        actionsWrap.innerHTML = `
          <a href="${matchedProject.demo}" target="_blank" rel="noopener noreferrer" class="mh-hud-pill-demo" style="
            pointer-events: auto;
            cursor: pointer;
            color: #ffffff;
            font-family: var(--font-navbar-display, 'League Spartan', sans-serif);
            font-weight: 700;
            font-size: 13px;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            background: linear-gradient(135deg, rgba(14, 22, 36, 0.95) 0%, rgba(20, 34, 58, 0.88) 100%);
            border: ${demoBorder};
            border-radius: 9999px;
            padding: 10px 20px;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            box-shadow: ${demoGlow};
            text-decoration: none;
            transition: all 0.25s ease;
          ">${liveIndicator}↗ ${demoLabel}</a>
          <a href="${matchedProject.github}" target="_blank" rel="noopener noreferrer" class="mh-hud-pill-git" style="
            pointer-events: auto;
            cursor: pointer;
            color: #ffffff;
            font-family: var(--font-navbar-display, 'League Spartan', sans-serif);
            font-weight: 700;
            font-size: 13px;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            background: rgba(14, 22, 36, 0.88);
            border: 1.5px solid rgba(255, 255, 255, 0.25);
            border-radius: 9999px;
            padding: 10px 20px;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            box-shadow: 0 4px 14px rgba(0, 0, 0, 0.5);
            text-decoration: none;
            transition: all 0.25s ease;
          ">&lt; &gt; ${gitLabel}</a>
        `;
      }
    }, 500);
  }

  // 6. Contact Hub removed to prevent any UI collisions with MH logo
  const getRepoBase = () => {
    if (typeof window !== 'undefined') {
      if (window.__REPO_BASE__) return window.__REPO_BASE__;
      if (window.location.pathname.startsWith('/Mahmud-Hasan-3D-Portfolio')) return '/Mahmud-Hasan-3D-Portfolio';
    }
    return '';
  };

  // 6.0 Instant Home Venue / Landing Scene Revelation & Illumination
  function forceInstantLandingReveal() {
    try {
      if (typeof window.__mhRevealLanding === 'function') {
        window.__mhRevealLanding();
      }
      if (window.__mhLandingContext) {
        const { m, y, h, d } = window.__mhLandingContext;
        if (h) h.value = 1;
        if (d) d.value = 1;
        if (m) {
          if (m.spot) {
            m.spot.intensity = (y && y.spotIntensity != null) ? y.spotIntensity : 314;
            if (y && y.spotAngle != null) m.spot.angle = y.spotAngle;
          }
          if (m.directional) {
            m.directional.intensity = (y && y.directionalIntensity != null) ? y.directionalIntensity : 2.6;
          }
          if (m.fog) {
            m.fog.density = (y && y.fogDensity != null) ? y.fogDensity : 0.05;
          }
          if (m.volumetric) {
            if (y && y.volOpacity != null && m.volumetric.opacity) m.volumetric.opacity.value = y.volOpacity;
            if (y && y.volEmissive != null && m.volumetric.emissiveIntensity) m.volumetric.emissiveIntensity.value = y.volEmissive;
          }
          if (m.beamDust && y && y.beamDustReveal != null && m.beamDust.reveal) {
            m.beamDust.reveal.value = y.beamDustReveal;
          }
          if (m.waterGlow) {
            if (y && y.glowIntensity != null && m.waterGlow.glowIntensity) m.waterGlow.glowIntensity.value = y.glowIntensity;
            if (y && y.glowRadius != null && m.waterGlow.glowRadius) m.waterGlow.glowRadius.value = y.glowRadius;
          }
          if (m.drift && m.drift.position) {
            m.drift.position.y = 0;
          }
        }
      }
      if (window.__mhStargate && window.__mhStargate.openProgress) {
        window.__mhStargate.openProgress.value = 0;
      }
      if (window.__mhScenes) {
        if (window.__mhScenes.landing && window.__mhScenes.landing.scene) {
          window.__mhScenes.landing.scene.visible = true;
        }
        if (window.__mhScenes.projects && window.__mhScenes.projects.scene) {
          window.__mhScenes.projects.scene.visible = false;
        }
      }
      if (window.__mhLoaderStore && typeof window.__mhLoaderStore.getState === 'function') {
        const ls = window.__mhLoaderStore.getState();
        if (!ls.hasArrivalSceneRevealed && typeof ls.setArrivalSceneRevealed === 'function') {
          ls.setArrivalSceneRevealed(true);
        }
      }
    } catch (_) {}
  }

  // 6.1 Initial Direct Route Auto-Glide & Instant Positioning
  function setupRouteAutoGlide() {
    try {
      const base = getRepoBase();
      const rawPath = window.location.pathname;
      const path = (base && rawPath.startsWith(base)) ? (rawPath.slice(base.length) || '/') : rawPath;
      const params = new URLSearchParams(window.location.search || '');
      const glide = params.get('glide') || params.get('target') || '';

      const isRoot = (path === '/' || path === '/index.html' || path === '');
      if (isRoot && !glide) {
        try { sessionStorage.removeItem('mh_target_scene'); } catch (_) {}
      }

      let storedTarget = '';
      try { storedTarget = sessionStorage.getItem('mh_target_scene') || ''; } catch (_) {}
      const effective = (glide || (isRoot ? '' : storedTarget) || '').toLowerCase();

      const isExplicitGlide = Boolean(glide || path === '/about' || path === '/about.html' || path === '/contact' || path === '/contact.html' || path === '/projects' || path === '/projects.html');

      const routeKey = (path === '/about' || path === '/about.html' || effective === 'about') ? 'ABOUT' :
                       (path === '/contact' || path === '/contact.html' || effective === 'contact') ? 'CONTACT' :
                       (path === '/projects' || path === '/projects.html' || (isExplicitGlide && effective === 'projects')) ? 'PROJECTS' : 'LANDING';

      const isNonLanding = (routeKey !== 'LANDING');

      if (isNonLanding) {
        document.documentElement.classList.add('mh-bypass-loader');
        document.documentElement.setAttribute('data-mh-bypassing-loader', 'true');
        document.documentElement.setAttribute('data-mh-glide', (glide || routeKey).toLowerCase());

        let shield = document.getElementById('mh-direct-glide-shield');
        if (!shield) {
          shield = document.createElement('div');
          shield.id = 'mh-direct-glide-shield';
          shield.style.cssText = 'position:fixed;inset:0;background:radial-gradient(circle at center,#111318 0%,#08090c 100%);z-index:9999999;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#00e5ff;font-family:monospace;letter-spacing:2px;font-size:12px;pointer-events:all;transition:opacity 0.25s ease-out;';
          shield.innerHTML = '<div style="display:flex;flex-direction:column;align-items:center;gap:14px;padding:22px 28px;border:1px solid rgba(0,229,255,0.22);border-radius:12px;background:rgba(13,14,18,0.85);backdrop-filter:blur(8px);box-shadow:0 0 30px rgba(0,229,255,0.12);"><div style="display:flex;align-items:center;gap:12px;"><div style="width:20px;height:20px;border:2px solid rgba(0,229,255,0.2);border-top-color:#00e5ff;border-radius:50%;animation:mh-spin 0.7s linear infinite;"></div><span style="font-weight:700;letter-spacing:2px;font-size:11px;color:#ebebeb;">INITIALIZING 3D ENVIRONMENT</span></div><div style="font-size:10px;color:#888;letter-spacing:1.5px;">MAHMUD HASAN // PORTFOLIO</div></div><style>@keyframes mh-spin{to{transform:rotate(360deg)}}</style>';
          (document.body || document.documentElement).appendChild(shield);
        }

        const targetKey = routeKey;
        const tryRouteRequest = () => {
          if (window.__mhRouteStore && window.__mhRoutes && window.__mhRoutes[targetKey]) {
            try {
              window.__mhRouteStore.getState().request(window.__mhRoutes[targetKey], 'deeplink');
              return true;
            } catch (_) {}
          }
          return false;
        };

        const getTargetY = () => {
          if (targetKey === 'PROJECTS') {
            const s2 = document.getElementById('scene2');
            return (s2 && s2.offsetTop > 0) ? s2.offsetTop : 5200;
          }
          if (targetKey === 'ABOUT') {
            try {
              if (window.__mhRoutes && window.__mhRoutes.ABOUT && typeof window.__mhRoutes.ABOUT.resolveOffset === 'function') {
                const y = window.__mhRoutes.ABOUT.resolveOffset();
                if (y > 0) return y;
              }
            } catch (_) {}
            const survey = document.getElementById('sceneAboutSurvey');
            if (survey && survey.offsetHeight > 0) {
              return Math.round(survey.offsetTop + survey.offsetHeight * 0.2236 + window.innerHeight * 1.746725);
            }
            const sAbout = document.getElementById('sceneAbout');
            if (sAbout && sAbout.offsetTop > 0) {
              return Math.round(sAbout.offsetTop + window.innerHeight * (4.4 + 6.6 + 2.26 * 0.2236 + 0.0175));
            }
            return 21080;
          }
          if (targetKey === 'CONTACT') {
            const el = document.getElementById('sceneContactReveal');
            return (el && el.offsetHeight > 0) ? Math.round(el.offsetTop + el.offsetHeight * 0.7286) : 13500;
          }
          return 0;
        };

        let routed = false;
        let attempts = 0;
        const maxAttempts = 14;

        const interval = setInterval(() => {
          attempts++;

          if (window.__mhLoaderStore && typeof window.__mhLoaderStore.getState === 'function') {
            try {
              const ls = window.__mhLoaderStore.getState();
              if (!ls.hasLoaderExitStarted && typeof ls.setLoaderExitStarted === 'function') ls.setLoaderExitStarted(true);
              if (!ls.hasLoaderUnmounted && typeof ls.setLoaderUnmounted === 'function') ls.setLoaderUnmounted(true);
              if (!ls.isExperienceInteractive && typeof ls.setExperienceInteractive === 'function') ls.setExperienceInteractive(true);
              if (!ls.hasArrivalSceneRevealed && typeof ls.setArrivalSceneRevealed === 'function') ls.setArrivalSceneRevealed(true);
            } catch (_) {}
          }

          const cta = document.querySelector('button[data-testid="loader-enter"], .y9w63G_cta');
          if (cta) {
            cta.disabled = false;
            cta.removeAttribute('disabled');
            try { cta.click(); } catch (_) {}
          }

          if (!routed && tryRouteRequest()) {
            routed = true;
          }

          if (routed) {
            const targetY = getTargetY();
            try {
              window.scrollTo(0, targetY);
              if (window.__lenis && typeof window.__lenis.scrollTo === 'function') {
                window.__lenis.scrollTo(targetY, { immediate: true });
              }
            } catch (_) {}

            try {
              sessionStorage.setItem('mh_target_scene', targetKey.toLowerCase());
              sessionStorage.setItem('mh_entered_experience', 'true');
            } catch (_) {}

            if (shield && shield.style.opacity !== '0') {
              shield.style.transition = 'opacity 0.15s ease-out';
              shield.style.opacity = '0';
              shield.style.pointerEvents = 'none';
              setTimeout(() => { try { shield.remove(); } catch (_) {} }, 200);
            }
          }

          if (attempts >= maxAttempts || routed) {
            clearInterval(interval);
            if (shield) {
              shield.style.transition = 'opacity 0.15s ease-out';
              shield.style.opacity = '0';
              shield.style.pointerEvents = 'none';
              setTimeout(() => { try { shield.remove(); } catch (_) {} }, 200);
            }
          }
        }, 80);
      } else {
        // Pure Home Landing: Ensure zero scroll, no shield, instant illumination!
        try {
          window.scrollTo(0, 0);
          if (window.__lenis && typeof window.__lenis.scrollTo === 'function') {
            window.__lenis.scrollTo(0, { immediate: true });
          }
          sessionStorage.removeItem('mh_target_scene');
        } catch (_) {}
        forceInstantLandingReveal();
      }
    } catch (err) {
      console.warn('Glide handler notice:', err);
    }
  }

  // 7. Initialize All Modules
  
  // 8. About Section: Full Stack Developer & AI Automation Expert + Portrait Scroll Reveal
  function setupAboutSection() {
    function alignPortraitBelowPlate() {
      const plate = document.querySelector("._5tgptW_plate, [class*='_5tgptW_plate']");
      const pane = document.querySelector("._5tgptW_portraitPane, [class*='_5tgptW_portraitPane']");
      if (plate && pane) {
        const plateRect = plate.getBoundingClientRect();
        if (plateRect.bottom > 50) {
          const targetTop = Math.round(plateRect.bottom + 14);
          pane.style.setProperty('top', targetTop + 'px', 'important');
          const maxAvailHeight = Math.max(260, window.innerHeight - targetTop - 65);
          pane.style.setProperty('max-height', maxAvailHeight + 'px', 'important');
        }

        // Active Portrait Image Assurance: Render Mahmud Hasan's real photo
        let img = pane.querySelector("img");
        if (!img) {
          img = document.createElement("img");
          img.className = "_5tgptW_portrait mh-portrait-img";
          img.alt = "Mahmud Hasan - Full Stack Developer & AI Automation Expert";
          img.src = "/assets/mahmud.jpg";
          pane.appendChild(img);
        } else {
          if (img.hasAttribute("srcset")) {
            img.removeAttribute("srcset");
          }
          if (!img.src || !img.src.includes("/assets/mahmud.jpg")) {
            img.src = "/assets/mahmud.jpg";
          }
        }
        img.style.setProperty('display', 'block', 'important');
        img.style.setProperty('opacity', '1', 'important');
        img.style.setProperty('visibility', 'visible', 'important');
        img.style.setProperty('object-fit', 'cover', 'important');
        img.style.setProperty('object-position', 'center top', 'important');
        img.style.setProperty('width', '100%', 'important');
        img.style.setProperty('height', '100%', 'important');

        // Do NOT force opacity: 1 !important or clip-path: none !important here.
        // Let Three.js and GSAP naturally drive the scroll reveal as 'UNSEEN' transitions to 'NOISE'!
        pane.style.setProperty('background', '#080d16', 'important');
      }
    }

    let isEnhancing = false;
    let aboutObserver = null;
    function checkAndEnhanceAbout() {
      if (isEnhancing) return;
      // Do not mutate DOM during initial loader & React hydration
      if (document.querySelector('button[data-testid="loader-enter"]')) return;

      const aboutRoot = document.querySelector("._5tgptW_root, [class*='_5tgptW_root']");
      if (aboutRoot) {
        isEnhancing = true;
        try {
          // 1. Update Subtitle to Full Stack Developer & AI Automation Expert
          const subtitle = aboutRoot.querySelector("._5tgptW_subtitle, [class*='_5tgptW_subtitle']");
          if (subtitle && !subtitle.textContent.includes("FULL STACK")) {
            subtitle.textContent = "FULL STACK DEVELOPER • AI AUTOMATION EXPERT";
          }

          // 2. Update Lead Text cleanly with Mahmud's Core Focus
          const lead = aboutRoot.querySelector("._5tgptW_lead, [class*='_5tgptW_lead']");
          const targetLead = "Specializing in end-to-end full stack web platforms, autonomous AI agent workflows, and resilient mobile application engineering. Dedicated to transforming complex engineering challenges into secure, scalable digital products.";
          if (lead && lead.textContent !== targetLead) {
            lead.textContent = targetLead;
          }

          // 3. Render clean, emoji-free, cyber-editorial skills matrix
          if (!document.getElementById("mh-about-skills-matrix")) {
            const oldSeal = document.getElementById("mh-about-security-seal");
            if (oldSeal) oldSeal.remove();
            const oldContainer = document.getElementById("mh-about-skills-container");
            if (oldContainer) oldContainer.remove();

            const skillsContainer = document.createElement("div");
            skillsContainer.id = "mh-about-skills-matrix";
            skillsContainer.style.pointerEvents = "auto";
            skillsContainer.style.marginTop = "10px";
            skillsContainer.style.marginBottom = "4px";
            skillsContainer.innerHTML = `
              <div class="mh-skills-grid">
                <div class="mh-skill-chip">
                  <span class="chip-accent">//</span>
                  <span class="chip-lead">FULL STACK DEV</span>
                  <span class="chip-sep">/</span>
                  <span class="chip-detail">NEXT.JS · NODE.JS · REACT · TYPESCRIPT</span>
                </div>
                <div class="mh-skill-chip">
                  <span class="chip-accent">//</span>
                  <span class="chip-lead">AI AUTOMATION</span>
                  <span class="chip-sep">/</span>
                  <span class="chip-detail">LANGCHAIN · AUTONOMOUS AGENTS · PYTHON</span>
                </div>
                <div class="mh-skill-chip">
                  <span class="chip-accent">//</span>
                  <span class="chip-lead">MEDIA &amp; MOTION</span>
                  <span class="chip-sep">/</span>
                  <span class="chip-detail">CREATIVE DIRECTION · MOTION VFX · SOUND</span>
                </div>
                <div class="mh-skill-chip">
                  <span class="chip-accent">//</span>
                  <span class="chip-lead">MOBILE APPS</span>
                  <span class="chip-sep">/</span>
                  <span class="chip-detail">FLUTTER · ANDROID SDK · CROSS-PLATFORM</span>
                </div>
                <div class="mh-skill-chip">
                  <span class="chip-accent">//</span>
                  <span class="chip-lead">INTEGRATIONS</span>
                  <span class="chip-sep">/</span>
                  <span class="chip-detail">WHATSAPP CLOUD API · WEBHOOKS · BOTS</span>
                </div>
                <div class="mh-skill-chip">
                  <span class="chip-accent">//</span>
                  <span class="chip-lead">CYBER SECURITY</span>
                  <span class="chip-sep">/</span>
                  <span class="chip-detail">OWASP TOP 10 · PENETRATION TESTING</span>
                </div>
              </div>
            `;
            if (lead) {
              lead.parentNode.insertBefore(skillsContainer, lead.nextSibling);
            }
          }
          alignPortraitBelowPlate();
          if (aboutObserver && document.getElementById('mh-about-skills-matrix')) {
            aboutObserver.disconnect();
            aboutObserver = null;
          }
        } finally {
          isEnhancing = false;
        }
      }
    }

    checkAndEnhanceAbout();
    aboutObserver = new MutationObserver(() => {
      checkAndEnhanceAbout();
    });
    if (document.body) {
      aboutObserver.observe(document.body, { childList: true, subtree: true });
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        if (aboutObserver && document.body) {
          aboutObserver.observe(document.body, { childList: true, subtree: true });
        }
      });
    }

    let scrollRaf = null;
    window.addEventListener('scroll', () => {
      if (!scrollRaf) {
        scrollRaf = requestAnimationFrame(() => {
          checkAndEnhanceAbout();
          scrollRaf = null;
        });
      }
    }, { passive: true });
    window.addEventListener('resize', alignPortraitBelowPlate, { passive: true });
  }

  // 9. Footer Cleanup (Remove Legal notice & Lab) & Authentic WhatsApp Direct Integration
  function setupFooterAndSocialsClean() {
    function cleanElements() {
      // 1. Remove Legal Notice and Lab from footers
      document.querySelectorAll('._8VLL1W_legal, ._8VLL1W_lab, a[href*="legal-notice"], a[href$="/legal-notice"]').forEach(el => {
        el.remove();
      });

      // 2. Remove any Twitter / X links
      document.querySelectorAll('a[href*="twitter.com"], a[href*="x.com"]').forEach(el => {
        el.remove();
      });

      // 3. Ensure authentic WhatsApp link & icon
      const waLinks = document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp"]');
      const waSvgPath = "M128,24A104,104,0,0,0,36.18,176.88L24.83,218.35a16,16,0,0,0,19.5,19.5l41.47-11.35A104,104,0,1,0,128,24Zm0,192a87.87,87.87,0,0,1-44.06-11.81,8,8,0,0,0-6-1.07l-35.32,9.66,9.66-35.32a8,8,0,0,0-1.07-6A88,88,0,1,1,128,216Zm45.27-60.77-17.5-8.24a16.07,16.07,0,0,0-16.15,2.15l-6.84,5.47a56.4,56.4,0,0,1-24.36-24.36l5.47-6.84a16.07,16.07,0,0,0,2.15-16.15l-8.24-17.5A16,16,0,0,0,93.41,86a24,24,0,0,0-19.14,24c1,54.81,45.47,99.28,100.28,100.28a24,24,0,0,0,24-19.14A16,16,0,0,0,173.27,155.23Z";

      waLinks.forEach(link => {
        link.classList.add('mh-whatsapp-link');
        link.setAttribute('aria-label', 'WhatsApp (+8801767850859)');
        link.setAttribute('title', 'Chat on WhatsApp: +8801767850859');
        link.setAttribute('href', 'https://wa.me/8801767850859');

        const svg = link.querySelector('svg');
        if (svg) {
          svg.setAttribute('viewBox', '0 0 256 256');
          const path = svg.querySelector('path');
          if (path && path.getAttribute('d') !== waSvgPath) {
            path.setAttribute('d', waSvgPath);
          }
        }
      });
    }

    cleanElements();
    setTimeout(cleanElements, 400);
    setTimeout(cleanElements, 1200);
    setTimeout(cleanElements, 3000);
    window.addEventListener('popstate', cleanElements, { passive: true });
  }

  // 7. Contact 3D Cinematic Interaction Engine
  function setupContact3DInteractivity() {
    window.__mhContactHoverTarget = 0.0;
    window.__mhMouse = { x: 0, y: 0 };

    window.addEventListener('mousemove', function(e) {
      window.__mhMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      window.__mhMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    }, { passive: true });

    function attachContactHover() {
      const selectors = [
        'a[href^="mailto:"]',
        'a[href^="https://wa.me"]',
        'a[href^="tel:"]',
        '._7ZPv2G_socialLink',
        '[class*="_7ZPv2G_socialLink"]',
        '#mh-terminal-toggle',
        '.mh-whatsapp-btn',
        'button[class*="terminal"]',
        '.mh-hud-btn',
        'footer a'
      ];
      const elements = document.querySelectorAll(selectors.join(','));
      elements.forEach(function(el) {
        if (el.__mhHoverAttached) return;
        el.__mhHoverAttached = true;
        el.addEventListener('mouseenter', function() {
          window.__mhContactHoverTarget = 1.0;
        }, { passive: true });
        el.addEventListener('mouseleave', function() {
          window.__mhContactHoverTarget = 0.0;
        }, { passive: true });
      });
    }

    attachContactHover();
    if (typeof MutationObserver !== 'undefined') {
      const observer = new MutationObserver(attachContactHover);
      observer.observe(document.body, { childList: true, subtree: true });
    }
  }

  // 8. Bulletproof Cinematic Enter Experience & Authentic Motion System
  function setupEnterButtonFailsafe() {
    let isEntering = false;
    let hasPlayedEntranceWave = false;

    // Purge AI-vibe elements & ensure clean authentic motion button
    function sanitizeEnterButton() {
      // Purge any lingering AI badge elements
      document.querySelectorAll('.mh-cta-beacon, .mh-cta-arrow').forEach(el => el.remove());

      const loader = document.querySelector('.y9w63G_loaderContainer');
      const isGate = loader && loader.classList.contains('y9w63G_gate');
      const btn = document.querySelector('button[data-testid="loader-enter"], .y9w63G_cta');
      if (btn && isGate) {
        btn.disabled = false;
        btn.removeAttribute('disabled');
        btn.setAttribute('tabindex', '0');
        btn.setAttribute('aria-hidden', 'false');
      }
    }

    sanitizeEnterButton();
    const enterObserver = new MutationObserver(sanitizeEnterButton);
    if (document.body) {
      enterObserver.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
    }

    // Audio gesture unlock on deliberate Enter button click
    document.addEventListener('click', function(e) {
      const targetBtn = e.target.closest('button[data-testid="loader-enter"], .y9w63G_cta');
      if (targetBtn && !isEntering) {
        isEntering = true;
        try {
          sessionStorage.setItem('mh_entered_experience', 'true');
        } catch (_) {}
        try {
          if (window.__aengel_audioEngine && window.__aengel_audioEngine.ctx && window.__aengel_audioEngine.ctx.state === 'suspended') {
            window.__aengel_audioEngine.ctx.resume();
          }
        } catch (_) {}
      }
    }, false);

    // Keyboard support: pressing Enter or Space when on the loader screen triggers click
    window.addEventListener('keydown', function(e) {
      const loader = document.querySelector('.y9w63G_loaderContainer, [class*="loaderContainer"]');
      if (loader && !loader.classList.contains('y9w63G_exiting') && loader.style.display !== 'none') {
        if (e.key === 'Enter' || e.key === ' ') {
          const tag = (document.activeElement?.tagName || '').toLowerCase();
          if (tag !== 'input' && tag !== 'textarea') {
            const btn = document.querySelector('button[data-testid="loader-enter"], .y9w63G_cta');
            if (btn) {
              e.preventDefault();
              isEntering = true;
              btn.click();
            }
          }
        }
      }
    }, true);
  }

  // 9. Project Cylinder Carousel HUD Exit Engine (Back to Projects / Home)
  function setupProjectInteriorExitHud() {
    function exitCurrentInterior() {
      try {
        if (window.__mhProjectStore && typeof window.__mhProjectStore.getState === 'function') {
          const state = window.__mhProjectStore.getState();
          if (typeof state.exitInterior === 'function') {
            state.exitInterior();
          }
          setTimeout(() => {
            if (window.__mhProjectStore && window.__mhProjectStore.getState().interiorStatus !== 'exterior') {
              if (typeof window.__mhProjectStore.getState().snapToExterior === 'function') {
                window.__mhProjectStore.getState().snapToExterior();
              }
            }
          }, 1400);
          return;
        }
      } catch (e) {}

      // Fallback: Dispatch Escape keydown event
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', keyCode: 27, bubbles: true }));
    }

    function syncExitHudState() {
      // Remove any DOM overlay exit button (relying exclusively on the 3D scene mesh close button)
      const hud = document.getElementById('mh-interior-exit-hud');
      if (hud) {
        hud.remove();
      }
      let isInterior = false;
      try {
        if (window.__mhProjectStore && typeof window.__mhProjectStore.getState === 'function') {
          const s = window.__mhProjectStore.getState().interiorStatus;
          isInterior = s === 'interior' || s === 'entering';
        }
      } catch (_) {}
      if (!isInterior) return;

      // Also decorate any 2D slide view CLOSE buttons with X icon
      document.querySelectorAll('button._3nxWKG_control, a._3nxWKG_control, [data-control]').forEach(btn => {
        if (btn.textContent.trim() === 'CLOSE' && !btn.querySelector('.mh-ctrl-icon')) {
          btn.innerHTML = `<span class="mh-ctrl-icon" style="color:var(--mh-cyan, #00e5ff);font-weight:900;margin-right:6px;font-size:14px">✕</span>CLOSE`;
        }
      });
    }

    setInterval(syncExitHudState, 600);

    // Escape key listener for immediate exit
    window.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        let isInterior = false;
        try {
          if (window.__mhProjectStore && typeof window.__mhProjectStore.getState === 'function') {
            const s = window.__mhProjectStore.getState().interiorStatus;
            isInterior = s === 'interior' || s === 'entering';
          }
        } catch (err) {}
        if (isInterior) {
          exitCurrentInterior();
        }
      }
    }, true);
  }

  // 10. Direct Instant Lite Version Experience Engine & Unified Navigation Bridge
  function setupLiteNavigation() {
    const base = getRepoBase();

    // Auto-redirect static fallback pages to the full 3D experience
    try {
      const p = window.location.pathname;
      const cleanP = (base && p.startsWith(base)) ? (p.slice(base.length) || '/') : p;
      if (cleanP === '/about' || cleanP === '/about.html') {
        try {
          sessionStorage.setItem('mh_entered_experience', 'true');
          sessionStorage.setItem('mh_target_scene', 'ABOUT');
        } catch (_) {}
        window.location.replace(base + '/?variant=full&target=about');
        return;
      }
      if (cleanP === '/contact' || cleanP === '/contact.html') {
        try {
          sessionStorage.setItem('mh_entered_experience', 'true');
          sessionStorage.setItem('mh_target_scene', 'CONTACT');
        } catch (_) {}
        window.location.replace(base + '/?variant=full&target=contact');
        return;
      }
      if (cleanP === '/projects' || cleanP === '/projects.html') {
        try {
          sessionStorage.setItem('mh_entered_experience', 'true');
          sessionStorage.setItem('mh_target_scene', 'PROJECTS');
        } catch (_) {}
        window.location.replace(base + '/?variant=full&target=projects');
        return;
      }
    } catch (_) {}

    const isLite = window.location.pathname.includes('/lite');
    if (isLite) {
      document.body.classList.add('is-lite');
      const hideLoader = () => {
        const l = document.querySelector('.y9w63G_loaderContainer, [class*="loaderContainer"]');
        if (l) {
          l.style.setProperty('display', 'none', 'important');
          l.style.setProperty('opacity', '0', 'important');
          l.style.setProperty('pointer-events', 'none', 'important');
        }
      };
      hideLoader();
      requestAnimationFrame(hideLoader);
      setTimeout(hideLoader, 50);
      setTimeout(hideLoader, 300);
    }

    // Helper to safely exit interior on 3D home
    const safelyExit3DInterior = () => {
      try {
        if (window.__mhProjectStore && typeof window.__mhProjectStore.getState === 'function') {
          const s = window.__mhProjectStore.getState();
          if (s?.interiorStatus === 'interior' || s?.interiorStatus === 'entering') {
            if (typeof s.exitInterior === 'function') {
              s.exitInterior();
            }
          }
        }
      } catch (_) {}
    };

    // Helper to keep navbar panel visible and interactive
    const ensureMenuVisible = () => {
      const menuPanel = document.querySelector('div._rHu7W_menuPanel, [class*="_rHu7W_menuPanel"]');
      if (menuPanel) {
        menuPanel.setAttribute('aria-hidden', 'false');
      }
    };

    // UNIFIED CAPTURE-PHASE CLICK HANDLER FOR ALL BUTTONS
    window.addEventListener('click', (e) => {
      // 1. Logo Click: If in 3D, exit interior and smoothly scroll to landing; else go to 3D home
      const logoBtn = e.target.closest('button._rHu7W_logoWrap, [class*="_rHu7W_logoWrap"]');
      if (logoBtn) {
        e.preventDefault();
        e.stopPropagation();
        if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
        const p = window.location.pathname;
        const cleanP = (base && p.startsWith(base)) ? (p.slice(base.length) || '/') : p;
        const in3D = !cleanP.startsWith('/lite') && (!!document.getElementById('scene1') || !!document.querySelector('canvas') || cleanP === '/' || cleanP === '/index.html' || cleanP === '/projects' || cleanP === '/about' || cleanP === '/contact');
        ensureMenuVisible();
        if (in3D) {
          dispatch3DRoute('LANDING', 0);
        } else {
          try {
            sessionStorage.setItem('mh_entered_experience', 'true');
            sessionStorage.setItem('mh_target_scene', 'LANDING');
          } catch (_) {}
          window.location.assign(base + '/?variant=full&target=home');
        }
        return;
      }

      // 2. Direct standalone lite-switcher buttons (e.g. loader screen lite button)
      const liteTrigger = e.target.closest('a[href="/lite"], a[href$="/lite"], button[class*="y9w63G_lite"], .y9w63G_lite');
      if (liteTrigger && !liteTrigger.closest('._rHu7W_menuPanel, ._rHu7W_links')) {
        e.preventDefault();
        e.stopPropagation();
        if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
        window.location.assign(base + '/lite');
        return;
      }

      // 3. Navigation Links (Menu Panel, Header, Direct Items)
      const navLink = e.target.closest('a._rHu7W_link, [class*="_rHu7W_menuPanel"] a, #mh-menu-item-extra-skills a, ._8VLL1W_legal, [class*="_8VLL1W_legal"]');
      if (!navLink) return;

      const rawHref = navLink.getAttribute('href') || '';
      const href = (base && rawHref.startsWith(base)) ? (rawHref.slice(base.length) || '/') : rawHref;
      const label = (navLink.innerText || navLink.textContent || '').trim().toUpperCase();

      // Button: GITHUB REPO
      if (label.includes('GITHUB') || href.includes('github.com')) {
        e.preventDefault();
        e.stopPropagation();
        if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
        window.open('https://github.com/naimsmahmud50-dotcom', '_blank', 'noopener,noreferrer');
        return;
      }

      // Button: EXTRA SKILLS
      if (label.includes('EXTRA SKILLS') || label.includes('VIDEOS') || href === '#extra-skills' || href.endsWith('#extra-skills')) {
        e.preventDefault();
        e.stopPropagation();
        if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
        ensureMenuVisible();
        if (typeof window.__mhOpenMyVideos === 'function') {
          window.__mhOpenMyVideos();
        } else if (typeof openMyVideosModal === 'function') {
          openMyVideosModal();
        }
        return;
      }

      // Resolve current route at click-time dynamically
      const curPath = (base && window.location.pathname.startsWith(base))
        ? (window.location.pathname.slice(base.length) || '/')
        : window.location.pathname;
      const onLite = curPath.startsWith('/lite');
      const isRoot3D = !onLite && (!!document.getElementById('scene1') || !!document.querySelector('canvas') || curPath === '/' || curPath === '/index.html' || curPath === '/projects' || curPath === '/about' || curPath === '/contact');

      // Button: PROJECT SLIDE VIEW
      if (label.includes('PROJECT SLIDE VIEW') || label.includes('LITE') || href === '/lite' || href.endsWith('/lite')) {
        e.preventDefault();
        e.stopPropagation();
        if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
        ensureMenuVisible();
        if (onLite) {
          if (window.__mhLiteController && window.__mhLiteController.eM) {
            window.__mhLiteController.eM.setScrollValue(0);
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          window.location.assign(base + '/lite');
        }
        return;
      }

      // Helper to scroll reliably and smoothly to any 3D section
      let activeScrollInterval = null;
      const scroll3DTarget = (targetY) => {
        try {
          if (activeScrollInterval) {
            clearInterval(activeScrollInterval);
            activeScrollInterval = null;
          }

          if (targetY === 0) {
            try {
              if (window.__lenis && typeof window.__lenis.scrollTo === 'function') {
                window.__lenis.scrollTo(0, { immediate: true });
              }
              if (window.lenis && typeof window.lenis.scrollTo === 'function') {
                window.lenis.scrollTo(0, { immediate: true });
              }
            } catch (_) {}
            window.scrollTo(0, 0);
            forceInstantLandingReveal();
            return;
          }

          if (window.__lenis && typeof window.__lenis.scrollTo === 'function') {
            if (window.__lenis.isStopped) window.__lenis.start();
            window.__lenis.scrollTo(targetY, { duration: 0.55, force: true });
            return;
          }
          if (window.lenis && typeof window.lenis.scrollTo === 'function') {
            if (window.lenis.isStopped) window.lenis.start();
            window.lenis.scrollTo(targetY, { duration: 0.55, force: true });
            return;
          }

          window.scrollTo({ top: targetY, behavior: 'smooth' });
        } catch (err) {
          console.error('[MH SCROLL3DTARGET ERROR]', err);
          window.scrollTo(0, targetY);
        }
      };

      // Helper to dispatch 3D route transition directly into WebGL state machine
      const dispatch3DRoute = (routeKey, fallbackY) => {
        safelyExit3DInterior();
        if (routeKey === 'LANDING') {
          try {
            sessionStorage.removeItem('mh_target_scene');
            const homePath = (base && window.location.pathname.startsWith(base)) ? (base + '/') : '/';
            if (window.location.pathname !== homePath && !window.location.pathname.includes('/lite')) {
              window.history.pushState(null, '', homePath);
            }
          } catch (_) {}
          forceInstantLandingReveal();
        }
        if (window.__mhRouteStore && window.__mhRoutes && window.__mhRoutes[routeKey]) {
          try {
            window.__mhRouteStore.getState().request(window.__mhRoutes[routeKey], 'deeplink');
            scroll3DTarget(fallbackY);
            if (routeKey === 'LANDING') {
              forceInstantLandingReveal();
              setTimeout(forceInstantLandingReveal, 120);
              setTimeout(forceInstantLandingReveal, 350);
            }
            return;
          } catch (_) {}
        }
        if (window.__mhNavigate && window.__mhRoutes && window.__mhRoutes[routeKey]) {
          try {
            window.__mhNavigate(window.__mhRoutes[routeKey]);
            scroll3DTarget(fallbackY);
            if (routeKey === 'LANDING') {
              forceInstantLandingReveal();
              setTimeout(forceInstantLandingReveal, 120);
              setTimeout(forceInstantLandingReveal, 350);
            }
            return;
          } catch (_) {}
        }
        scroll3DTarget(fallbackY);
        if (routeKey === 'LANDING') {
          forceInstantLandingReveal();
          setTimeout(forceInstantLandingReveal, 120);
          setTimeout(forceInstantLandingReveal, 350);
        }
      };

      // Button: HOME
      if (label === 'HOME' || href === '/' || href === '') {
        e.preventDefault();
        e.stopPropagation();
        if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
        ensureMenuVisible();
        try { sessionStorage.removeItem('mh_target_scene'); } catch (_) {}
        if (isRoot3D) {
          dispatch3DRoute('LANDING', 0);
          forceInstantLandingReveal();
        } else {
          try {
            sessionStorage.setItem('mh_entered_experience', 'true');
            sessionStorage.removeItem('mh_target_scene');
          } catch (_) {}
          window.location.assign(base + '/?variant=full&target=home');
        }
        return;
      }

      // Button: PROJECTS
      if (label === 'PROJECTS' || label.startsWith('PROJECTS') || href === '/projects' || href.includes('glide=projects') || href.includes('target=projects')) {
        e.preventDefault();
        e.stopPropagation();
        if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
        ensureMenuVisible();
        if (isRoot3D) {
          const s2 = document.getElementById('scene2');
          const fallbackY = (s2 && s2.offsetTop > 0) ? s2.offsetTop : 5200;
          dispatch3DRoute('PROJECTS', fallbackY);
        } else {
          try {
            sessionStorage.setItem('mh_entered_experience', 'true');
            sessionStorage.setItem('mh_target_scene', 'PROJECTS');
          } catch (_) {}
          window.location.assign(base + '/?variant=full&target=projects');
        }
        return;
      }

      // Button: ABOUT
      if (label === 'ABOUT' || label.startsWith('ABOUT') || href === '/about' || href.includes('glide=about') || href.includes('target=about')) {
        e.preventDefault();
        e.stopPropagation();
        if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
        ensureMenuVisible();
        if (isRoot3D) {
          let fallbackY = 0;
          try {
            if (window.__mhRoutes && window.__mhRoutes.ABOUT && typeof window.__mhRoutes.ABOUT.resolveOffset === 'function') {
              fallbackY = window.__mhRoutes.ABOUT.resolveOffset();
            }
          } catch (_) {}
          if (!fallbackY) {
            const survey = document.getElementById('sceneAboutSurvey');
            if (survey && survey.offsetHeight > 0) {
              fallbackY = Math.round(survey.offsetTop + survey.offsetHeight * 0.2236 + window.innerHeight * 1.746725);
            } else {
              const sAbout = document.getElementById('sceneAbout');
              if (sAbout && sAbout.offsetTop > 0) {
                fallbackY = Math.round(sAbout.offsetTop + window.innerHeight * (4.4 + 6.6 + 2.26 * 0.2236 + 0.0175));
              } else {
                fallbackY = 21080;
              }
            }
          }
          dispatch3DRoute('ABOUT', fallbackY);
        } else {
          try {
            sessionStorage.setItem('mh_entered_experience', 'true');
            sessionStorage.setItem('mh_target_scene', 'ABOUT');
          } catch (_) {}
          window.location.assign(base + '/?variant=full&target=about');
        }
        return;
      }

      // Button: CONTACT
      if (label === 'CONTACT' || label.startsWith('CONTACT') || href === '/contact' || href.includes('glide=contact') || href.includes('target=contact')) {
        e.preventDefault();
        e.stopPropagation();
        if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
        ensureMenuVisible();
        if (isRoot3D) {
          const el = document.getElementById('sceneContactReveal');
          const fallbackY = (el && el.offsetHeight > 0)
            ? Math.round(el.offsetTop + el.offsetHeight * 0.7286)
            : 13500;
          dispatch3DRoute('CONTACT', fallbackY);
        } else {
          try {
            sessionStorage.setItem('mh_entered_experience', 'true');
            sessionStorage.setItem('mh_target_scene', 'CONTACT');
          } catch (_) {}
          window.location.assign(base + '/?variant=full&target=contact');
        }
        return;
      }

      // Project Card Links across ALL views -> open live demo or github
      const cleanProjHref = href ? href.replace(base, '') : '';
      if (cleanProjHref.startsWith('/projects/') && cleanProjHref !== '/projects/' && cleanProjHref !== '/projects') {
        e.preventDefault();
        e.stopPropagation();
        if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
        const slug = cleanProjHref.replace('/projects/', '').replace(/-/g, ' ').toLowerCase().trim();
        let matched = null;
        for (const [k, p] of Object.entries(PROJECTS_DB)) {
          if (slug.includes(k) || k.includes(slug)) {
            matched = p;
            break;
          }
        }
        const destination = matched?.demo || matched?.github || 'https://github.com/naimsmahmud50-dotcom';
        window.open(destination, '_blank', 'noopener,noreferrer');
        return;
      }
    }, true);
  }

  function setupMenuLabelSync() {
    function isLoaderActive() {
      const loader = document.querySelector('.y9w63G_loaderContainer, [class*="loaderContainer"]');
      if (!loader) return false;
      if (loader.classList.contains('y9w63G_exiting') || loader.classList.contains('exiting')) return false;
      try {
        const style = window.getComputedStyle(loader);
        if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false;
      } catch (_) {}
      return true;
    }

    function applySync() {
      const nav = document.querySelector('nav._rHu7W_nav, [class*="_rHu7W_nav"]');
      if (isLoaderActive()) {
        if (nav) {
          nav.style.setProperty('display', 'none', 'important');
          nav.style.setProperty('opacity', '0', 'important');
          nav.style.setProperty('visibility', 'hidden', 'important');
          nav.style.setProperty('pointer-events', 'none', 'important');
          nav.classList.remove('_rHu7W_visible');
        }
        return;
      }

      // 0. Ensure nav is visible and interactive once experience is active
      if (nav) {
        nav.style.removeProperty('display');
        nav.classList.add('_rHu7W_visible');
        nav.style.setProperty('opacity', '1', 'important');
        nav.style.setProperty('visibility', 'visible', 'important');
        nav.style.setProperty('pointer-events', 'auto', 'important');
        nav.style.setProperty('transform', 'translateY(0)', 'important');
      }

      // 1. Permanently delete 3-dot menu button from DOM completely
      const menuBtns = document.querySelectorAll('button._rHu7W_menu, button[aria-label="Menu"], button[class*="_rHu7W_menu"]');
      menuBtns.forEach(btn => {
        try { btn.remove(); } catch (_) {
          btn.style.setProperty('display', 'none', 'important');
          btn.style.setProperty('pointer-events', 'none', 'important');
          btn.style.setProperty('visibility', 'hidden', 'important');
          btn.style.setProperty('width', '0', 'important');
          btn.style.setProperty('height', '0', 'important');
          btn.style.setProperty('margin', '0', 'important');
          btn.style.setProperty('padding', '0', 'important');
          btn.setAttribute('aria-hidden', 'true');
        }
      });

      // 2. Keep menuPanel links permanently visible, unclipped, and clickable vertically under sound/available
      const menuPanel = document.querySelector('div._rHu7W_menuPanel, [class*="_rHu7W_menuPanel"]');
      if (menuPanel) {
        const isMobileNav = window.innerWidth <= 768;
        menuPanel.style.setProperty('display', 'flex', 'important');
        menuPanel.style.setProperty('flex-direction', 'column', 'important');
        menuPanel.style.setProperty('align-items', 'flex-end', 'important');
        menuPanel.style.setProperty('visibility', 'visible', 'important');
        menuPanel.style.setProperty('opacity', '1', 'important');
        menuPanel.style.setProperty('pointer-events', 'auto', 'important');
        menuPanel.style.setProperty('position', 'absolute', 'important');
        menuPanel.style.setProperty('top', isMobileNav ? 'calc(100% + 6px)' : 'calc(100% + 8px)', 'important');
        menuPanel.style.setProperty('right', isMobileNav ? '16px' : '2.5vw', 'important');
        menuPanel.style.setProperty('left', 'auto', 'important');
        menuPanel.style.setProperty('bottom', 'auto', 'important');
        menuPanel.style.setProperty('width', 'auto', 'important');
        menuPanel.style.setProperty('height', 'auto', 'important');
        menuPanel.setAttribute('aria-hidden', 'false');
        menuPanel.querySelectorAll('li._rHu7W_linkItem, li[class*="_rHu7W_linkItem"]').forEach(li => {
          li.style.setProperty('clip-path', 'none', 'important');
          li.style.setProperty('-webkit-clip-path', 'none', 'important');
          li.style.setProperty('opacity', '1', 'important');
          li.style.setProperty('visibility', 'visible', 'important');
          li.style.setProperty('transform', 'none', 'important');
          li.style.setProperty('display', 'flex', 'important');
          li.style.setProperty('justify-content', 'flex-end', 'important');
          li.style.setProperty('width', '100%', 'important');
        });
        menuPanel.querySelectorAll('a._rHu7W_link, a[class*="_rHu7W_link"]').forEach(a => {
          a.setAttribute('tabindex', '0');
          a.style.setProperty('pointer-events', 'auto', 'important');
          a.style.setProperty('cursor', 'pointer', 'important');
        });
      }

      const menuLinks = document.querySelectorAll('a._rHu7W_link, [class*="_rHu7W_menuPanel"] a');
      menuLinks.forEach(link => {
        const labelSpan = link.querySelector('._rHu7W_linkLabel') || link;
        const text = (labelSpan.innerText || labelSpan.textContent || '').trim().toUpperCase();
        const href = link.getAttribute('href') || '';

        if (text === 'LAB' || href.includes('lab.aengel.io') || href.includes('lab.mahmudhasan.dev')) {
          labelSpan.textContent = 'GITHUB REPO';
          link.setAttribute('href', 'https://github.com/naimsmahmud50-dotcom');
          link.setAttribute('target', '_blank');
          link.setAttribute('rel', 'noopener noreferrer');
        } else if (text === 'LITE VERSION') {
          labelSpan.textContent = 'PROJECT SLIDE VIEW';
          link.setAttribute('href', '/lite');
        }
      });

      const sizers = document.querySelectorAll('._rHu7W_linkSizerLabel');
      sizers.forEach(sizer => {
        const txt = (sizer.innerText || sizer.textContent || '').trim().toUpperCase();
        if (txt === 'LAB') {
          sizer.textContent = 'GITHUB REPO';
        } else if (txt === 'LITE VERSION') {
          sizer.textContent = 'PROJECT SLIDE VIEW';
        }
      });

      // Bind click handler for native or rendered EXTRA SKILLS link
      const extraSkillLinks = document.querySelectorAll('a[href="#extra-skills"], a[href$="#extra-skills"]');
      extraSkillLinks.forEach(link => {
        if (!link.dataset.mhBound) {
          link.dataset.mhBound = 'true';
          link.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (typeof window.__mhOpenMyVideos === 'function') {
              window.__mhOpenMyVideos();
            }
          });
        }
      });

      // Fallback: If React didn't render EXTRA SKILLS, inject into menu links
      const linksContainer = document.querySelector('ul._rHu7W_links, [class*="_rHu7W_links"]');
      const hasExtraSkill = document.querySelector('a[href="#extra-skills"], #mh-menu-item-extra-skills');
      if (linksContainer && !hasExtraSkill) {
        const extraLi = document.createElement('li');
        extraLi.className = '_rHu7W_linkItem';
        extraLi.id = 'mh-menu-item-extra-skills';
        extraLi.innerHTML = `
          <a href="#extra-skills" class="_rHu7W_link" tabindex="0" id="mh-menu-link-extra-skills">
            <span class="_rHu7W_linkLabel">EXTRA SKILLS</span>
            <svg width="64" height="64" viewBox="96 96 64 64" fill="currentColor" xmlns="http://www.w3.org/2000/svg" class="_rHu7W_linkHoverDot" aria-hidden="true"><circle cx="128" cy="128" r="32"></circle></svg>
          </a>
        `;

        let refNode = null;
        const items = linksContainer.querySelectorAll('li');
        for (const item of items) {
          const t = (item.textContent || '').trim().toUpperCase();
          if (t.includes('PROJECT SLIDE VIEW') || t.includes('LITE VERSION')) {
            refNode = item;
            break;
          }
        }
        if (refNode) {
          linksContainer.insertBefore(extraLi, refNode);
        } else {
          linksContainer.appendChild(extraLi);
        }

        const linkA = extraLi.querySelector('a');
        if (linkA) {
          linkA.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (typeof window.__mhOpenMyVideos === 'function') {
              window.__mhOpenMyVideos();
            }
          });
        }
      }

      // Ensure linkSizer accommodates "EXTRA SKILLS"
      const linkSizer = document.querySelector('span._rHu7W_linkSizer, [class*="_rHu7W_linkSizer"]');
      const hasSizer = Array.from(document.querySelectorAll('._rHu7W_linkSizerLabel')).some(s => s.textContent.trim().toUpperCase() === 'EXTRA SKILLS');
      if (linkSizer && !hasSizer && !document.getElementById('mh-menu-sizer-extra-skills')) {
        const sizerSpan = document.createElement('span');
        sizerSpan.id = 'mh-menu-sizer-extra-skills';
        sizerSpan.className = '_rHu7W_linkSizerLabel';
        sizerSpan.textContent = 'EXTRA SKILLS';
        linkSizer.appendChild(sizerSpan);
      }
    }

    let throttleTimeout = null;
    const throttledApplySync = () => {
      if (throttleTimeout) return;
      throttleTimeout = setTimeout(() => {
        throttleTimeout = null;
        applySync();
      }, 150);
    };

    applySync();
    let syncInterval = setInterval(() => {
      applySync();
      if (!isLoaderActive() && document.getElementById('mh-menu-item-extra-skills')) {
        clearInterval(syncInterval);
        syncInterval = setInterval(applySync, 2000);
      }
    }, 250);

    document.addEventListener('click', () => {
      setTimeout(applySync, 10);
      setTimeout(applySync, 80);
    }, true);

    const observer = new MutationObserver(() => {
      throttledApplySync();
    });
    if (document.body) {
      observer.observe(document.body, { childList: true, subtree: true });
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        observer.observe(document.body, { childList: true, subtree: true });
      });
    }
  }

  // 11. Error Boundary Auto-Recovery Guardian
  function setupErrorRecoveryGuardian() {
    function checkError() {
      const errorRoot = document.querySelector('.mbP0PG_root, [class*="mbP0PG_root"]');
      if (errorRoot) {
        const loader = document.querySelector('.y9w63G_loaderContainer');
        const isLoaderActive = loader && !loader.classList.contains('y9w63G_exiting') && loader.style.display !== 'none';
        if (isLoaderActive) return; // Do not abort if user is still on loader/gate!
        const shield = document.getElementById('mh-direct-glide-shield');
        if (shield) return; // Do not abort while direct-gliding!

        console.warn('⚠️ Error screen detected. Auto-recovering to stable view...');
        const base = getRepoBase();
        const target = base + '/lite';
        window.location.replace(target);
      }
    }
    setInterval(checkError, 400);
  }

  // 12. Modular Portfolio Drawers removed (user requested original 3D routes)

  
  // 13. Mobile Project Slide View Cyber-HUD & Navigation Engine (Runs on mobile / lite)
  function setupMobileProjectSlideView() {
    const isLite = window.location.pathname.includes('/lite') || document.body.classList.contains('is-lite');
    if (!isLite) return;

    const LITE_PROJECTS_DATA = [
      {
        idxStr: '01 / 08',
        year: '2026',
        category: 'ENTERPRISE ERP & MOBILE',
        title: 'Madrasah Ecosystem',
        desc: 'Multi-tenant ERP with real-time Hifz milestones, exams, biometric attendance & parent WhatsApp Cloud alerts.',
        tags: ['Next.js', 'Flutter', 'PostgreSQL', 'WhatsApp API'],
        url: 'https://github.com/naimsmahmud50-dotcom/Madrasha-Managemant-Softaware',
        label: '⚡ GITHUB REPO',
        isLive: false
      },
      {
        idxStr: '02 / 08',
        year: '2025',
        category: 'ENDPOINT CYBER DEFENSE',
        title: 'Secure My PC',
        desc: 'Advanced Windows endpoint protection with real-time behavioral heuristics & kernel process interception.',
        tags: ['C++', 'Python', 'Win32 API', 'Cyber Security'],
        url: 'https://github.com/naimsmahmud50-dotcom',
        label: '🛡️ PRIVATE REPO',
        isLive: false
      },
      {
        idxStr: '03 / 08',
        year: '2026',
        category: 'HEADLESS E-COMMERCE',
        title: 'MAIJRUN Tech Store',
        desc: 'Production hardware marketplace with live PC Builder compatibility engine, BDT gateways & courier webhooks.',
        tags: ['Next.js 15', 'TypeScript', 'Medusa', 'Tailwind CSS'],
        url: 'https://github.com/naimsmahmud50-dotcom/Maijrun-Teach',
        label: '⚡ GITHUB REPO',
        isLive: false
      },
      {
        idxStr: '04 / 08',
        year: '2025',
        category: 'LUXURY TRAVEL PORTAL',
        title: 'Travel with Maijrun',
        desc: 'Live high-performance travel portal with dynamic itineraries, booking inquiry dispatchers & 60fps animations.',
        tags: ['Next.js', 'TypeScript', 'Tailwind', 'Node.js'],
        url: 'https://travel-w-ith-maijrun-alpha.vercel.app',
        label: '🚀 LIVE DEMO',
        isLive: true
      },
      {
        idxStr: '05 / 08',
        year: '2024',
        category: 'EDTECH COMMUNITY',
        title: 'Arabic Language & Cultural Club',
        desc: 'Interactive learning hub featuring bidirectional RTL layout engine, synchronized recitation audio & study forums.',
        tags: ['React', 'Next.js', 'RTL Engine', 'Audio Sync'],
        url: 'https://arabic-langualge-and-cultural-club.vercel.app',
        label: '🚀 LIVE DEMO',
        isLive: true
      },
      {
        idxStr: '06 / 08',
        year: '2025',
        category: 'CAMPUS NETWORKING',
        title: 'Student Life Circle',
        desc: 'Comprehensive national exam-prep portal and student community with timed quizzes & past-paper archive.',
        tags: ['Next.js', 'Express', 'MongoDB', 'Redis'],
        url: 'https://naimsmahmud50-dotcom.github.io/Student-Life-Circle/',
        label: '🚀 LIVE DEMO',
        isLive: true
      },
      {
        idxStr: '07 / 08',
        year: '2026',
        category: 'META GRAPH AUTOMATION',
        title: 'Facebook Automation',
        desc: 'High-throughput page management bot with automated cross-posting, intelligent auto-replies & lead pipelines.',
        tags: ['Node.js', 'Meta Graph API', 'Puppeteer', 'Redis'],
        url: 'https://github.com/naimsmahmud50-dotcom/Facebook-Automation-',
        label: '⚡ GITHUB REPO',
        isLive: false
      },
      {
        idxStr: '08 / 08',
        year: '2026',
        category: 'AI LEAD ENGINE',
        title: 'LinkedIn Automation',
        desc: 'Autonomous lead generation engine with Telegram bot remote control, Gemini AI synthesis & anti-ban stealth.',
        tags: ['Python 3.12', 'Playwright', 'Gemini AI', 'Telegram Bot'],
        url: 'https://github.com/naimsmahmud50-dotcom/Linkdin-Automation-',
        label: '⚡ GITHUB REPO',
        isLive: false
      }
    ];

    let currentSyncedIdx = -1;

    function injectSlideViewElements() {
      if (!document.body) return;

      // 1. Top hint pill
      if (!document.getElementById('mh-mobile-hint-pill')) {
        const hint = document.createElement('div');
        hint.id = 'mh-mobile-hint-pill';
        hint.innerHTML = '<span>‹ SWIPE 3D CARDS OR TAP ARROWS ›</span>';
        document.body.appendChild(hint);
      }

      // 2. Navigation Chevrons
      if (!document.getElementById('mh-lite-prev')) {
        const prevBtn = document.createElement('button');
        prevBtn.id = 'mh-lite-prev';
        prevBtn.type = 'button';
        prevBtn.className = 'mh-lite-nav-btn prev';
        prevBtn.setAttribute('aria-label', 'Previous Project');
        prevBtn.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>';
        prevBtn.addEventListener('click', () => {
          if (window.__mhLiteController && window.__mhLiteController.eM) {
            window.__mhLiteController.eM.pageBy(-1);
          }
        });
        document.body.appendChild(prevBtn);
      }

      if (!document.getElementById('mh-lite-next')) {
        const nextBtn = document.createElement('button');
        nextBtn.id = 'mh-lite-next';
        nextBtn.type = 'button';
        nextBtn.className = 'mh-lite-nav-btn next';
        nextBtn.setAttribute('aria-label', 'Next Project');
        nextBtn.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>';
        nextBtn.addEventListener('click', () => {
          if (window.__mhLiteController && window.__mhLiteController.eM) {
            window.__mhLiteController.eM.pageBy(1);
          }
        });
        document.body.appendChild(nextBtn);
      }

      // 3. Bottom Project HUD Card
      if (!document.getElementById('mh-mobile-project-hud')) {
        const hud = document.createElement('div');
        hud.id = 'mh-mobile-project-hud';
        hud.innerHTML = `
          <div class="mh-hud-meta-row">
            <span class="mh-hud-badge-idx" id="mh-hud-idx">PROJECT 01 / 08</span>
            <span class="mh-hud-badge-cat" id="mh-hud-cat">ENTERPRISE ERP &amp; MOBILE</span>
          </div>
          <h3 class="mh-hud-card-title" id="mh-hud-title">Madrasah Ecosystem</h3>
          <p class="mh-hud-card-desc" id="mh-hud-desc">Multi-tenant ERP with real-time Hifz milestones, exams, biometric attendance &amp; parent WhatsApp Cloud alerts.</p>
          <div class="mh-hud-tags-row" id="mh-hud-tags">
            <span class="mh-hud-tag">Next.js</span>
            <span class="mh-hud-tag">Flutter</span>
            <span class="mh-hud-tag">PostgreSQL</span>
            <span class="mh-hud-tag">WhatsApp API</span>
          </div>
          <div class="mh-hud-actions-row">
            <a id="mh-hud-act-primary" href="https://github.com/naimsmahmud50-dotcom/Madrasha-Managemant-Softaware" target="_blank" rel="noopener noreferrer" class="mh-hud-act-btn primary">
              <span id="mh-hud-act-text">⚡ GITHUB REPO</span>
            </a>
            <button id="mh-hud-act-video" type="button" class="mh-hud-act-btn video">
              <span>🎬 My Videos</span>
            </button>
            <button id="mh-hud-act-all" type="button" class="mh-hud-act-btn secondary">
              <span>📋 ALL 8</span>
            </button>
          </div>
        `;
        document.body.appendChild(hud);

        const vidBtn = document.getElementById('mh-hud-act-video');
        if (vidBtn) {
          vidBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (typeof window.__mhOpenMyVideos === 'function') {
              window.__mhOpenMyVideos();
            }
          });
        }

        const allBtn = document.getElementById('mh-hud-act-all');
        if (allBtn) {
          allBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const base = getRepoBase();
            window.location.assign(base + '/?variant=full&glide=projects');
          });
        }
      }
    }

    function updateHudCard(idx) {
      const p = LITE_PROJECTS_DATA[idx];
      if (!p) return;

      const idxEl = document.getElementById('mh-hud-idx');
      const catEl = document.getElementById('mh-hud-cat');
      const titleEl = document.getElementById('mh-hud-title');
      const descEl = document.getElementById('mh-hud-desc');
      const tagsEl = document.getElementById('mh-hud-tags');
      const actBtn = document.getElementById('mh-hud-act-primary');
      const actText = document.getElementById('mh-hud-act-text');

      if (idxEl) idxEl.textContent = `PROJECT ${p.idxStr}`;
      if (catEl) catEl.textContent = p.category;
      if (titleEl) titleEl.textContent = p.title;
      if (descEl) descEl.textContent = p.desc;
      if (tagsEl) {
        tagsEl.innerHTML = p.tags.map(t => `<span class="mh-hud-tag">${t}</span>`).join('');
      }
      if (actBtn && actText) {
        actBtn.href = p.url;
        actText.textContent = p.label;
      }
    }

    function syncCarouselHUD() {
      injectSlideViewElements();

      let targetIdx = 0;
      if (window.__mhLiteController && window.__mhLiteController.eM) {
        const scrollVal = window.__mhLiteController.eM.scrollValue;
        const pitch = window.__mhLiteController.ei?.pitch || 1.195;
        const raw = Math.round(scrollVal / pitch);
        targetIdx = ((raw % 8) + 8) % 8;
      }

      if (targetIdx !== currentSyncedIdx) {
        currentSyncedIdx = targetIdx;
        updateHudCard(targetIdx);
      }
    }

    setInterval(syncCarouselHUD, 120);
    syncCarouselHUD();
  }

  // 14. Direct 3D Animation & Continuous Scroll Engine
  function setupDirectScrollEngine() {
    function showFastInitLoader() {
      if (!MH_BYPASS_INITIAL_ENTER_SCREEN) return;
      if (document.getElementById('mh-fast-init-loader') || document.getElementById('mh-direct-glide-shield')) return;
      const fLoader = document.createElement('div');
      fLoader.id = 'mh-fast-init-loader';
      fLoader.innerHTML = '<div style="display:flex;flex-direction:column;align-items:center;gap:14px;padding:22px 28px;border:1px solid rgba(0,229,255,0.22);border-radius:12px;background:rgba(13,14,18,0.85);backdrop-filter:blur(8px);box-shadow:0 0 30px rgba(0,229,255,0.12);"><div style="display:flex;align-items:center;gap:12px;"><div style="width:20px;height:20px;border:2px solid rgba(0,229,255,0.2);border-top-color:#00e5ff;border-radius:50%;animation:mh-spin 0.7s linear infinite;"></div><span style="font-weight:700;letter-spacing:2px;font-size:11px;color:#ebebeb;">INITIALIZING 3D ENVIRONMENT</span></div><div style="font-size:10px;color:#888;letter-spacing:1.5px;">MAHMUD HASAN // PORTFOLIO</div></div><style>@keyframes mh-spin{to{transform:rotate(360deg)}}</style>';
      (document.body || document.documentElement).appendChild(fLoader);

      const dismissFastLoader = () => {
        const el = document.getElementById('mh-fast-init-loader');
        if (el && el.style.opacity !== '0') {
          el.style.transition = 'opacity 0.25s ease-out';
          el.style.opacity = '0';
          setTimeout(() => { try { el.remove(); } catch (_) {} }, 280);
        }
      };

      const checkCanvasReady = setInterval(() => {
        const cv = document.querySelector('canvas');
        const landingScene = window.__mhScenes?.landing?.scene;
        const landingReady = !!(landingScene && landingScene.visible);
        if (cv && cv.offsetWidth > 0 && cv.offsetHeight > 0) {
          forceInstantLandingReveal();
          if (landingReady || (window.__mhScenes?.landing?.scene?.visible)) {
            clearInterval(checkCanvasReady);
            setTimeout(dismissFastLoader, 150);
          }
        }
      }, 60);

      // Failsafe timeout: keep visual initialization feedback active until 3D assets finish downloading
      setTimeout(() => {
        clearInterval(checkCanvasReady);
        forceInstantLandingReveal();
        dismissFastLoader();
      }, 16000);
    }

    function unlockAndStartScroll() {
      if (!MH_BYPASS_INITIAL_ENTER_SCREEN) return;

      if (window.scrollY < 100) {
        forceInstantLandingReveal();
      }

      try {
        if (window.__mhScrollLockStore && typeof window.__mhScrollLockStore.getState === 'function') {
          const s = window.__mhScrollLockStore.getState();
          if (s && s.owners && s.owners.has('loader')) {
            s.unlock('loader');
          }
        }
      } catch (_) {}

      try {
        if (window.__mhLoaderStore && typeof window.__mhLoaderStore.getState === 'function') {
          const l = window.__mhLoaderStore.getState();
          if (!l.hasLoaderUnmounted && typeof l.setLoaderUnmounted === 'function') l.setLoaderUnmounted(true);
          if (!l.hasLoaderExitStarted && typeof l.setLoaderExitStarted === 'function') l.setLoaderExitStarted(true);
          if (!l.isExperienceInteractive && typeof l.setExperienceInteractive === 'function') l.setExperienceInteractive(true);
          if (!l.hasArrivalSceneRevealed && typeof l.setArrivalSceneRevealed === 'function') l.setArrivalSceneRevealed(true);
        }
      } catch (_) {}

      try {
        const lenis = window.__lenis || window.lenis;
        if (lenis && lenis.isStopped && typeof lenis.start === 'function') {
          lenis.start();
        }
      } catch (_) {}

      try {
        const loader = document.querySelector('.y9w63G_loaderContainer, [class*="loaderContainer"]');
        if (loader && !loader.classList.contains('y9w63G_exiting')) {
          loader.classList.add('y9w63G_exiting');
          loader.style.setProperty('pointer-events', 'none', 'important');
          loader.style.setProperty('display', 'none', 'important');
        }
      } catch (_) {}
    }

    showFastInitLoader();
    unlockAndStartScroll();
    const unlockTimer = setInterval(unlockAndStartScroll, 200);
    setTimeout(() => clearInterval(unlockTimer), 16000);

    // Landing illumination guard: stop interval once fully revealed
    const revealLandingInterval = setInterval(() => {
      if (window.scrollY < 100) {
        forceInstantLandingReveal();
        const ctx = window.__mhLandingContext;
        const landingScene = window.__mhScenes?.landing?.scene;
        if (ctx && ctx.h && ctx.h.value >= 1 && landingScene && landingScene.visible) {
          clearInterval(revealLandingInterval);
        }
      } else {
        clearInterval(revealLandingInterval);
      }
    }, 120);
    setTimeout(() => clearInterval(revealLandingInterval), 16000);

    window.addEventListener('wheel', unlockAndStartScroll, { passive: true, capture: true });
    window.addEventListener('touchstart', unlockAndStartScroll, { passive: true, capture: true });
    window.addEventListener('touchmove', unlockAndStartScroll, { passive: true, capture: true });
    window.addEventListener('keydown', unlockAndStartScroll, { passive: true, capture: true });
  }

  function init() {
    setupDirectScrollEngine();
    setupErrorRecoveryGuardian();
    setupLiteNavigation();
    setupMenuLabelSync();
    setupEnterButtonFailsafe();
    setupProjectInteriorExitHud();
    setupAboutSection();
    setupFooterAndSocialsClean();
    setupEmailCopy();
    initDhakaClock();
    setupTerminal();
        setupMobileProjectSlideView();
    setupProjectHudActions();
    setupContact3DInteractivity();
    setupRouteAutoGlide();
    
    // Deep-link check for #extra-skills, #videos, or ?modal=extra-skills
    if (window.location.hash === '#extra-skills' || window.location.hash === '#videos' || (window.location.search && window.location.search.includes('modal=extra-skills'))) {
      setTimeout(() => {
        openMyVideosModal();
      }, 350);
    }
    window.addEventListener('hashchange', () => {
      if (window.location.hash === '#extra-skills' || window.location.hash === '#videos') {
        openMyVideosModal();
      }
    });

    console.log('⚡ Mahmud Hasan Cyber Enhancement Engine Active');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
