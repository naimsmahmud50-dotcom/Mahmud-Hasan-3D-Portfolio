# Feature Specification: 006-portfolio-presentation-and-tech-breakdown

## Executive Summary
This feature delivers an interactive, high-impact HTML slide presentation and a comprehensive technical documentation guide for Mahmud Hasan's 3D Portfolio. It meticulously details which programming languages, frameworks, shaders, and runtime technologies power every aspect of the portfolio, alongside a professional presentation script in both Bengali and English.

---

## User Stories

### P1: Comprehensive Tech Stack Mapping (Where & Which Languages)
**As a** presenter and developer,  
**I want** an exact breakdown of every programming language and tool used across the portfolio,  
**So that** I can accurately explain the technical architecture to technical interviewers, professors, clients, and audiences.

### P2: Interactive 16:9 Presentation Deck
**As a** presenter,  
**I want** a standalone, sleek, dark-themed HTML slide deck that runs directly in any browser with keyboard controls (`←` `→`, Space, Fullscreen),  
**So that** I can give a smooth, interactive live presentation without relying on external PowerPoint software.

### P3: Structured Presentation Script & Speaker Notes
**As a** presenter,  
**I want** a bilingual slide-by-slide speaking script (Bengali + English) with key talking points, time allocations, and Q&A answers,  
**So that** I can deliver my speech with confidence, clarity, and authority.

---

## Technical Scope & Architecture Breakdown

### 1. 3D Graphics & Rendering Layer
- **Three.js (`^0.173.0`)**: 3D scene graphs, perspective cameras, scene graph transforms, quaternion rotations.
- **WebGPU & WebGL2**: GPU-accelerated rendering pipelines, hardware vertex processing.
- **GLSL / WGSL Custom Shaders**: Volumetric fog, procedural stone textures, glow passes, particle displacement, glitch post-processing.
- **Draco & KTX2 Compression**: Ultra-compact 3D mesh geometry and GPU-compressed textures for near-instant loading.

### 2. Frontend Framework & State Management
- **Next.js (`14.2.24` / `15.x`)**: Server-Side Generation (SSG), routing, Turbopack bundling, image optimization.
- **React (`^18.3.1`)**: Component lifecycle, memoized hooks (`useMemo`, `useCallback`, `useRef`), state management.
- **TypeScript (`^5.7.3`)**: Static typing, interface definitions for project stores and scene parameters.

### 3. Animation, Motion & Physics
- **GSAP (`^3.12.5`) & ScrollTrigger**: Smooth timeline choreographies, camera fly-through paths, scene scrub animations.
- **Lenis (`^1.1.20`)**: Kinetic inertial scrolling, scroll dampening, modal touch/wheel event forwarding.

### 4. Custom Styling & Visual Architecture
- **Modern CSS3**: Custom CSS Variables (`--font-navbar-display`, `--color-background`), Glassmorphism (`backdrop-filter: blur(20px)`), CSS Grid / Flexbox layouts.
- **Responsive Dual Engine**: Automatic fallback from Heavy 3D WebGPU (Desktop) to Light Project Slide View (Mobile / Low-spec devices).

### 5. Custom Engineering Enhancements
- **Web Audio API**: Real-time procedural sound synthesizer for UI clicks, glitch effects, and ambient feedback.
- **Interactive AI Terminal**: Embedded command-line interface emulating a Linux/Cyberpunk terminal with interactive commands.

---

## Deliverables
1. `presentation/index.html`: Fully interactive, responsive HTML slide deck with 12 slides, keyboard navigation, full-screen toggle, and speaker notes drawer.
2. Complete bilingual speaking script and tech documentation artifact.
