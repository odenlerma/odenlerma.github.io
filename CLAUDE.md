# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website for Audruey Gana, built with React 18 + Vite. Deployed to GitHub Pages at odenlerma.github.io via GitHub Actions on push to `main`.

## Commands

- `npm run dev` — Start dev server with HMR
- `npm run build` — Production build to `dist/`
- `npm run lint` — ESLint (strict: max-warnings 0)
- `npm run preview` — Preview production build

No test framework is configured.

## Architecture

**Single-page app** with three scroll-tracked sections managed by `react-intersection-observer`:

```
App.jsx → HomePage → IntroLayout (hero/parallax)
                    → WorksLayout (projects showcase)
                    → AboutLayout (bio & tech stack)
                    → Footer
```

**Path aliases** (defined in `vite.config.js`):
- `@` → `src/`, `@assets`, `@components`, `@layouts`, `@pages`, `@hooks`
- `custom.scss` → `src/custom.scss` (direct import alias)

**Component barrel exports**: `src/components/index.jsx` re-exports all component folders. Components are imported as `import * as COMPONENTS from '@components'` and used like `<COMPONENTS.CUSTOM_FOOTER />`.

**Custom hooks** (`src/hooks/useScrollProgress.js`): `useScrollProgress`, `useScrollToSection`, `useParallax`, `useElementInView` — all scroll/viewport-related utilities.

## Styling

- SCSS with Bootstrap 5 (imported and customized in `src/custom.scss`)
- Design tokens in `custom.scss`: colors (`$primary: #FC5130`, `$secondary: #4C66FF`, `$light: #FFF5E3`, `$dark: #303036`), typography (Syne, DM Sans, JetBrains Mono), spacing scale, animation timings
- Custom SCSS mixins: `glassmorphism`, `gradient-text`, `gradient-border`, `hover-lift`, `display-text`, `section-padding`, `noise-overlay`, `fluid-type`
- Fluid typography using `clamp()` throughout

## Key Libraries

- **framer-motion** — Animations, parallax, staggered entry effects
- **react-bootstrap** — Grid layout (Container, Row, Col)
- **swiper** — Carousel/slider components
- **react-chrono** — Timeline component
- **file-saver** — Resume download functionality

## Deployment

GitHub Actions (`.github/workflows/deploy.yml`): pushes to `main` trigger build → deploy to GitHub Pages. Uses Node 20 and `npm ci`.
