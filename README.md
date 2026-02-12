# Beux.Design

Human-centered design agency website built with Vite + React, featuring an immersive 3D crowd scene, GSAP animations, and a deep blue design system.

## Quick Start

```bash
npm install
npm run dev       # → http://localhost:3000
```

## Build & Deploy

```bash
npm run build     # outputs to dist/
npm run preview   # preview production build locally
```

### Deploying to GoDaddy (or any static host)

1. Run `npm run build`
2. Upload the entire contents of the `dist/` folder to your hosting root
3. Ensure your server serves `index.html` for all routes (SPA fallback)
4. No server-side rendering required — it's fully static

### For GoDaddy specifically:
- Use **File Manager** or **FTP** to upload `dist/` contents to `public_html/`
- If using a subdirectory, update `base` in `vite.config.js`:
  ```js
  base: '/your-subdirectory/',
  ```

## Project Structure

```
src/
├── main.jsx                    # React entry point
├── App.jsx                     # Root component (Lenis + GSAP setup)
├── index.css                   # Design system, tokens, global styles
├── components/
│   ├── CrowdScene.jsx          # 3D crowd (Three.js, GLB + fallback)
│   ├── GradientBackground.jsx  # Animated gradient orbs
│   ├── GradientBackground.module.css
│   ├── Navigation.jsx          # Fixed nav with mobile menu
│   └── Navigation.module.css
└── sections/
    ├── Hero.jsx / .module.css         # Hero with 3D scene + CTAs
    ├── About.jsx / .module.css        # Philosophy section
    ├── Capabilities.jsx / .module.css # Service cards grid
    ├── CaseStudies.jsx / .module.css  # Featured projects
    └── Contact.jsx / .module.css      # Contact form + footer
```

## Design System

CSS custom properties defined in `src/index.css`:

- **Colors**: Deep mindful blue palette (`--c-bg`, `--c-primary`, `--c-highlight`, etc.)
- **Typography**: Fluid scale with `clamp()` (`--text-sm` through `--text-hero`)
- **Spacing**: Fluid scale (`--space-xs` through `--space-3xl`)
- **Easings**: Premium curves (`--ease-out-expo`, `--ease-out-quart`)

## Key Technologies

- **Vite** — fast builds, HMR
- **React 18** — component architecture
- **Three.js** — 3D crowd scene with GLB model
- **GSAP + ScrollTrigger** — scroll-based animations
- **Lenis** — smooth scrolling
- **CSS Modules** — scoped component styles

## Customization

- **Colors**: Edit CSS variables in `src/index.css` under `:root`
- **Content**: Edit text directly in section components under `src/sections/`
- **3D Model**: Replace `public/final-crows-test.glb` with your own GLB
- **Case Studies**: Update the `PROJECTS` array in `src/sections/CaseStudies.jsx`
- **Services**: Update the `SERVICES` array in `src/sections/Capabilities.jsx`
- **Fonts**: Add/replace font files in `public/assets/fonts/` and update `@font-face` in `src/index.css`

## 3D Scene

The crowd scene (`src/components/CrowdScene.jsx`) loads `final-crows-test.glb` from the public directory. If the model fails to load, it falls back to a procedural instanced-mesh crowd with atmospheric particles.

The scene responds to mouse movement — the crowd follows the cursor horizontally with smooth easing.
