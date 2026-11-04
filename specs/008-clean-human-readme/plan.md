# Technical Plan: Clean Human-Authored README

- **Feature Directory**: `specs/008-clean-human-readme`
- **Related Spec**: `specs/008-clean-human-readme/spec.md`

## 1. Architecture & Content Structure

The new `README.md` will follow standard high-reputation open-source repository documentation structure:

1. **Title & Summary**: Simple project title (`# Mahmud Hasan - 3D Interactive Portfolio`) followed by a concise 2-sentence summary of what the project is (an interactive 3D WebGL developer portfolio built using Three.js and Next.js).
2. **Live Links**:
   - Production 3D Experience: `https://naimsmahmud50-dotcom.github.io/`
   - Responsive Lite Version: `https://naimsmahmud50-dotcom.github.io/lite`
3. **Overview**: Clear description of the dual-architecture approach (full 3D WebGL/WebGPU desktop version and lightweight 2D version for mobile/low-power devices).
4. **Core Features**: Bulleted breakdown of actual technical components (Three.js cylinder carousel, interactive terminal, Web Audio sound effects, GLTF/Draco asset pipeline).
5. **Tech Stack**: Table or list of technologies actually used (Three.js, Next.js, React, TypeScript, Tailwind CSS, GSAP, Web Audio API).
6. **Project Structure**: Clean textual tree showing the key directories (`cloned_site`, `app`, `components`, `lib`, `scripts`, `specs`).
7. **Featured Projects**: Clean list of real projects and repository links.
8. **Local Development**: Exact step-by-step instructions to clone, install, and run locally via Node.
9. **Contact & Profile**: Professional developer links (GitHub, LinkedIn, professional email).
10. **License**: MIT.

## 2. Guardrails & Audit Rules
- **Regex Emoji Check**: Run a Python script checking against Unicode emoji ranges (`[\U00010000-\U0010ffff]` and common emoji code blocks) to guarantee 0 emojis.
- **Privacy Audit**: Scan against sensitive substrings (`8801`, `/home/`, `token`, `secret`, `key`, `password`, `drive.google.com`).
- **Style Review**: Check for forbidden AI adjectives: `revolutionary`, `groundbreaking`, `next-gen`, `award-winning`, `agency-grade`, `hyper-`, `cutting-edge`.

## 3. Verification Strategy
- Execute automated Python scanner to verify zero emojis and zero leaks.
- Run git diff to ensure clean formatting.
