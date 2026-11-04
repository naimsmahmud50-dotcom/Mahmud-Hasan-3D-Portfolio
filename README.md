# Mahmud Hasan - 3D Interactive Portfolio

An interactive 3D WebGL developer portfolio built with Three.js, Next.js, and TypeScript. The application showcases full-stack engineering, AI automation systems, and software security projects through real-time 3D graphics, procedural audio, and a lightweight mobile fallback.

Live deployments:
- Desktop 3D Version: https://naimsmahmud50-dotcom.github.io/
- Mobile Lite Version: https://naimsmahmud50-dotcom.github.io/lite

---

## Overview

This repository contains the source code, 3D asset pipeline, and deployment configurations for Mahmud Hasan's personal portfolio. 

The site uses a dual-architecture design:
- 3D Experience (Desktop): Built on WebGL and WebGPU using Three.js. Includes interactive project carousel navigation, custom post-processing, and spatial audio feedback.
- Lite Mode (Mobile / Low-Power Devices): A clean, fast 2D layout optimized for low data usage, touch navigation, and smooth performance on mobile browsers without requiring a dedicated GPU.

---

## Technical Features

- 3D Project Carousel: Built with Three.js r173, utilizing Draco geometry compression and custom shader materials for fluid project inspection.
- Interactive Command Terminal: Built-in interface allowing visitors to run diagnostics, view background architecture, and inspect system details.
- Procedural Audio: Interactive UI sound cues driven by the Web Audio API with a persistent mute toggle.
- Responsive Routing: Seamless switching between the 3D desktop view and the 2D lite view based on screen size or user preference.
- Production Optimization: Compressed KTX2/WebP assets, preloaded critical font weights, and static caching for sub-second page loads.

---

## Tech Stack

- 3D & Graphics: Three.js (r173), WebGL2, WebGPU, Draco Decompressor
- Frontend Framework: Next.js 14, React 18, TypeScript
- Styling & Layout: Tailwind CSS, CSS Modules
- Animation: GSAP (GreenSock)
- Audio: Web Audio API
- Hosting & Delivery: GitHub Pages, Vercel

---

## Project Structure

```text
.
├── cloned_site/       # Production static build deployed to GitHub Pages
│   ├── assets/        # Optimized 3D models (.glb), textures, and audio files
│   ├── index.html     # Primary 3D desktop entry point
│   ├── lite.html      # Responsive 2D entry point for mobile devices
│   ├── custom-enhancements.js   # Client-side interactions and routing
│   └── custom-enhancements.css  # Component styles and UI transitions
├── app/               # Next.js App Router source directory
├── components/        # Reusable React components (3D canvas, navigation, HUD)
├── lib/               # Utility functions, sound controllers, and data definitions
├── presentation/      # Standalone 16:9 interactive presentation deck
├── scripts/           # Deployment automation and verification scripts
└── specs/             # Spec Kit engineering specifications and design records
```

---

## Featured Projects

1. Madrasah Management System
   - Cloud management platform for institutional academic records, attendance tracking, and administrative workflows.
   - Repository: https://github.com/naimsmahmud50-dotcom/Madrasha-Managemant-Softaware

2. MindPulse (Secure My PC)
   - Windows security utility focused on process inspection, memory verification, and system defense.
   - Repository: https://github.com/naimsmahmud50-dotcom/MindPulse

3. MAIJRUN Tech Store
   - E-commerce platform for computer hardware and custom PC builds, featuring real-time payment gateway integration and courier tracking.
   - Repository: https://github.com/naimsmahmud50-dotcom/Maijrun-Teach

4. Travel with Maijrun
   - Tour booking and travel management web application with dynamic itinerary handling.
   - Repository: https://github.com/naimsmahmud50-dotcom/Travel-WIth-Maijrun

5. Arabic Language & Cultural Club
   - Educational platform for language learning curriculum, resources, and event updates.
   - Repository: https://github.com/naimsmahmud50-dotcom/Arabic-Langualge-and-Cultural-Club

6. Student Life Circle
   - Academic community portal for campus resources and student collaboration.
   - Repository: https://github.com/naimsmahmud50-dotcom/Student-Life-Circle

7. Social Automation Tools
   - Automated workflow scripts and data utilities for web-based productivity.
   - Repository: https://github.com/naimsmahmud50-dotcom/Facebook-Automation-

---

## Local Development

### Prerequisites

- Node.js (version 18 or later recommended)
- npm, pnpm, or yarn

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/naimsmahmud50-dotcom/Mahmud-Hasan-3D-Portfolio.git
cd Mahmud-Hasan-3D-Portfolio
npm install
```

### Running the Local Server

To run the local production server:

```bash
node server_hubuhu.js
```

The application will be accessible at:
- Full 3D version: http://localhost:3000
- Mobile lite version: http://localhost:3000/lite

---

## Contact

- Author: Mahmud Hasan
- GitHub: https://github.com/naimsmahmud50-dotcom
- LinkedIn: https://www.linkedin.com/in/mahmud-hasan-687908269
- Email: mahmudhasan.infodev@gmail.com

---

## License

This project is open-source and available under the MIT License.
