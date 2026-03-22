@AGENTS.md

# vbarrai Website

## Overview
This is the official website for **vbarrai**, a GitHub organization that produces open-source AI tools. The site is built with Next.js 16, React 19, Tailwind CSS 4, and TypeScript.

## Architecture

### Tech Stack
- **Framework**: Next.js 16 (App Router)
- **UI**: React 19 + Tailwind CSS 4
- **Language**: TypeScript
- **Package Manager**: pnpm
- **Testing**: Vitest + React Testing Library

### Project Structure
```
app/
├── layout.tsx              # Root layout with Geist fonts, metadata
├── page.tsx                # Homepage — assembles all sections
├── globals.css             # Global styles, animations, CSS variables
└── components/
    ├── Navbar.tsx           # Fixed top navbar with scroll effect
    ├── HeroSection.tsx      # Hero banner with typing effect + terminal preview
    ├── NeuralBackground.tsx # Interactive canvas neural network animation
    ├── FeaturesSection.tsx  # 4 feature cards with glassmorphism
    ├── StatsSection.tsx     # Animated counters (stars, contributors, etc.)
    ├── ProjectsSection.tsx  # 6 project cards linking to GitHub repos
    └── Footer.tsx           # Footer with links and branding
```

### Design System
- **Theme**: Dark-first (background `#050508`)
- **Accent colors**: Indigo (`#6366f1`), Cyan (`#22d3ee`), Violet (`#8b5cf6`), Emerald (`#34d399`)
- **Effects**: Glassmorphism cards, gradient mesh blobs, floating particles, neural network canvas, typing animation, scan line effect, shimmer buttons
- **Fonts**: Geist Sans + Geist Mono

### Key Features
1. **Interactive Neural Network Background** — Canvas-based particle system that reacts to mouse movement
2. **Typing Animation** — Cycles through taglines with typewriter effect
3. **Animated Counters** — Numbers count up on scroll using IntersectionObserver
4. **Glassmorphism Cards** — Frosted glass effect with hover animations
5. **Terminal Preview** — Simulated CLI in the hero section
6. **Gradient Mesh Blobs** — Floating animated gradient blobs for depth

## Commands
- `pnpm dev` — Start development server
- `pnpm build` — Production build
- `pnpm test` — Run tests with Vitest
- `pnpm lint` — Run ESLint
