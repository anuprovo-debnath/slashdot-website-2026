# Slashdot Website 2026

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![GitHub Pages](https://img.shields.io/badge/Deployed-GitHub_Pages-222?style=flat-square&logo=github)](https://anuprovo-debnath.github.io/slashdot-website-2026/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

> **Slashdot IISER Kolkata** — The premier coding, designing, and technology club of IISER Kolkata. This is the official high-fidelity website for the 2026 season.

---

## ✨ Overview

The **Slashdot Website 2026** is a premium, cinematic web experience built for the community at IISER Kolkata. It features a terminal-style boot sequence, a mathematically-driven interactive hero, a global fuzzy search engine (`Ctrl+K`), a real-time events calendar with a live status heartbeat, and a horizontal navigation architecture that blends technical maturity with modern aesthetics.

---

## 🚀 Key Features

### 🎬 Boot & Loading System
- **Terminal Boot Sequence**: A character-by-character typing animation that reveals "Welcome to Slashdot" with a procedural `/` → `/ .` → `/ ..` → `/ ...` dot progression.
- **Session-Aware Skip**: Returning visitors (within 10 minutes) skip the animation entirely for an instant experience.
- **Cinematic Brand Handoff**: The loader transitions into the hero via a physical morph — the brand text flies from center-screen into the Navbar logo position.
- **Route Awareness**: Sub-pages (blog, events, etc.) trigger a "flight path" morph; the home page uses a scroll-driven lerp animation instead.

### 🖥️ Interactive Hero Canvas
- **600-Particle Engine**: Renders mathematical/code symbols (∫, ∂, ψ, `</>`, `=>`, ⏣) floating on a `<canvas>` element.
- **Vivid Spectrum Palette**: Each particle is colored using the full HSL spectrum (`hsl(0-360, 100%, 50%)`), creating a vibrant, energetic texture.
- **Gaussian "Flashlight" Ring**: The ring near the cursor uses a breathing sine wave cycle and 3D Simplex Noise to create organic, non-circular illumination — the "blobs" effect.
- **Inverse-Proportion Depth**: Larger symbols have lower opacity (`opacity = k / size`), simulating a faux-parallax 3D depth field.
- **Adaptive Performance Culling**: Monitors frame time; if sustained below 30fps, automatically reduces the particle count to maintain smoothness.

### 🪄 Scroll-Linked Brand Morphing
- **Physical Fly Animation**: Scrolling the home page causes the hero "Slashdot /." logo to physically translate and scale into the fixed Navbar logo via a `requestAnimationFrame` lerp loop (factor: `0.12`).
- **Dead Zone**: The first 40px of scroll have no effect, preventing accidental triggers.
- **`position: fixed` Switch**: The element is detached from document flow at the exact moment it begins moving, preventing jitter.
- **Tagline Fade**: The "The Coding & Designing Club of IISER Kolkata" subtitle fades out over the first 30% of the scroll range.

### 🔍 Global Search — `Ctrl + K`
- **Universal Overlay**: Press `Ctrl+K` (or `Cmd+K`) from any page to open a modal search hub.
- **Static Fuse.js Engine**: All content (blog, events, projects, funzone, team) is pre-indexed at build time into `public/search-index.json`. No API calls at runtime.
- **Scoped Search**: Prefix queries with a scope to narrow results (`blog/`, `events/`, `projects/`, `funzone/`, `team/`).
- **Query Prefixes**:
  - `#Tag` — Tag-first mode, highlights the tag chip in the input.
  - `@Author` — Author mode, surfaces blog authors and team members.
  - `type:Category` — Project type filter.
- **Keyboard Navigation**: `↑`/`↓` arrows cycle results; `Enter` navigates; `Escape` closes.
- **Recent History**: The last 3 searches are persisted to `localStorage` and shown on open (FIFO with deduplication).
- **View Transitions**: Scope changes and overlay open/close are wrapped in `document.startViewTransition` for fluid animations.

### 📅 Events System
- **Floating Calendar Sidebar**: A multi-modal `InteractiveCalendar` (Month / Week / Year views) tracks events. Clicking a date filters the event feed.
- **Real-Time Live Status**: Event status (Live / Upcoming / Past) is computed at runtime using IST (UTC+5:30)-aware time math — no manual status updates needed.
- **Date Range Support**: Single days (`2026-04-17`), continuous multi-day ranges (`2026-04-17 - 2026-04-19`), and custom session schedules are all supported.
- **Oscillating Lifecycle**: Multi-session events flip between **Live** and **Upcoming** between sessions instead of going straight to **Past**.
- **Global Heartbeat**: The Navbar fetches the event index every 30 seconds. If any event is Live, a pulsing red dot appears next to "Events" site-wide.
- **3-Phase Morphing Search Bar**: The events page search bar morphs between three states as the user scrolls (Full Right → Full Width → Docked Left).
- **Resource Hub**: Events can link to GitHub, YouTube, and external websites via frontmatter; chips are rendered on cards automatically.
- **Mobile Calendar**: A dedicated fixed `translate3d`-composited weekly calendar bar appears below the Navbar on mobile for instant date navigation.

### 🌓 Circular Theme Toggle (Dark / Light Mode)
- **Circular Clip-Path Reveal**: Switching themes triggers a `document.startViewTransition` + a `circle()` clip-path `animate()` that expands from the toggle button's position.
- **Mobile Viewport Correction**: Uses `100lvh` vs `visualViewport.height` to compute the system bar offset, ensuring the circle fills the full screen without misalignment.
- **Instant Fallback**: Gracefully falls back to an instant swap if the View Transitions API is unsupported.

### 📱 Touch-Parity System
- **Desktop Hover Mirroring**: All hover effects (card lifts, color reveals, icon animations) are replicated on touch devices via a global CSS ruleset targeting `@media (hover: none) and (pointer: coarse)`.
- **Android 250ms Nav Delay**: On Android, `TouchNavDelay.tsx` intercepts link clicks in the capture phase and delays `router.push()` by 250ms, allowing card animations to complete before the page unmounts.
- **`.touch-nav-active` Class**: Applied on `touchstart` to the `.group` ancestor so animations fire immediately — not just on `:active`.

### 🎨 Design System
- **Arista Pro Bold Typography**: The brand font with a `unicode-range` fallback for digits 0–9 and `@` (which render from system fonts to avoid malformed glyphs).
- **CSS Variables**: `--color-primary` (#0291B2 teal), `--color-live` (red), `--color-upcoming` (emerald) — all mapped into Tailwind v4's `@theme` layer.
- **Invisible Scrollbar**: Hidden across all browsers (Firefox, Chrome, Safari, IE/Edge) globally.
- **Horizontal Fade Masks**: `.mask-horizontal-faded` utility applies `mask-image` gradients to scrollable strips, creating clean edge fades.
- **Tan=3 Brand Slant**: All brand geometric patterns (fallback covers, timelines, SVG backgrounds) use a 71° slant angle (`tan⁻¹(3)`) for visual identity consistency.

### 📑 Content Sections
| Section | Route | Description |
| :--- | :--- | :--- |
| **Home** | `/` | Hero canvas, horizontal preview strips |
| **Blog** | `/blog` | MDX articles with author & tag system |
| **Projects** | `/projects` | Portfolio grid with status & tech stack |
| **Events** | `/events` | Live calendar, hackathons & workshops |
| **Fun Zone** | `/fun-zone` | Memes, games & generative art gallery |
| **Team** | `/team` | Flip-card grid with Alumni toggle |

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | [Next.js 15 (App Router)](https://nextjs.org/) | SSG, routing, Server Components |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) | Type safety throughout |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Utility-first with CSS variable design tokens |
| **Content** | [MDX / gray-matter](https://github.com/jonschlinkert/gray-matter) | Markdown-driven blog, events, projects, funzone |
| **Search** | [Fuse.js](https://fusejs.io/) | Client-side fuzzy search (lazy-loaded) |
| **Noise** | [simplex-noise](https://github.com/jwagner/simplex-noise) | Organic canvas animations |
| **Icons** | [Lucide React](https://lucide.dev/) + [React Icons FA6](https://react-icons.github.io/react-icons/) | UI icons & social brands |
| **Theming** | [next-themes](https://github.com/pacocoursey/next-themes) + View Transitions API | Circular dark/light toggle |
| **Deployment** | [GitHub Actions](https://github.com/features/actions) → GitHub Pages | Automated static export |

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `Ctrl + K` / `Cmd + K` | Open the Global Search Overlay |
| `↑` / `↓` | Navigate search results |
| `Enter` | Navigate to selected result |
| `Escape` | Close the Search Overlay |

---

## 📖 Documentation

The full project architecture is documented in the `/docs` directory. Click any link below to explore a specific subsystem:

### 🔩 Core Systems
| Document | Description |
| :--- | :--- |
| **[Implementation Summary](docs/implementation_summary.md)** | Boot sequence, fonts, deployment, mobile UX, event bus architecture |
| **[Home System](docs/system_home.md)** | Hero canvas engine, scroll-fly morph, horizontal strips |
| **[Navbar System](docs/system_navbar.md)** | Glassmorphism states, live heartbeat, search trigger, mobile drawer |
| **[Footer System](docs/system_footer.md)** | 24-column grid, social icon system, Touch-Parity |

### 🎛️ Feature Systems
| Document | Description |
| :--- | :--- |
| **[Search System](docs/system_search.md)** | `Ctrl+K` overlay, Fuse.js engine, scopes, and query prefixes |
| **[Events System](docs/system_events.md)** | Interactive calendar, Live status engine, mobile scroll-sync |
| **[Blog System](docs/system_blog.md)** | MDX pipeline, card grid, freshness badges, fallback covers |
| **[Projects System](docs/system_projects.md)** | Portfolio grid, status badges, TypePill search integration |
| **[Fun Zone System](docs/system_funzone.md)** | Memes, games, generative art viewer, scroll gradients |
| **[Team System](docs/system_team.md)** | Flip-card grid, alumni toggle, Journey timeline |

---

## 🏁 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v20 or higher
- [npm](https://www.npmjs.com/)

### Installation & Development

```bash
# 1. Clone the repository
git clone https://github.com/anuprovo-debnath/slashdot-website-2026.git
cd slashdot-website-2026

# 2. Install dependencies
npm install

# 3. Start the dev server (also regenerates the search index)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Note**: `npm run dev` automatically runs `scripts/generate-search-index.js` as a `predev` hook, so the search index is always up to date.

### Build for Production

```bash
npm run build
```

This runs `prebuild` (search index generation) then `next build` with `output: 'export'` to produce a fully static site in `out/`.

---

## 📁 Project Structure

```
slashdot-website-2026/
├── content/                  # Markdown-driven content
│   ├── blog/                 # Blog post .md files
│   ├── events/               # Event .md files
│   ├── projects/             # Project .md files
│   ├── funzone/              # Fun Zone item .md files
│   └── team/                 # Team member .md files
│
├── docs/                     # Architecture documentation
│   ├── implementation_summary.md
│   ├── system_home.md
│   ├── system_navbar.md
│   ├── system_footer.md
│   ├── system_search.md
│   ├── system_events.md
│   ├── system_blog.md
│   ├── system_projects.md
│   ├── system_funzone.md
│   └── system_team.md
│
├── public/                   # Static assets (fonts, images, search-index.json)
│   └── search-index.json     # ⚠️ Auto-generated — do not edit manually
│
├── scripts/
│   └── generate-search-index.js  # Build-time search index generator
│
├── src/
│   ├── app/                  # Next.js App Router pages
│   │   ├── globals.css       # Design tokens, font faces, touch-parity rules
│   │   ├── layout.tsx        # Root layout (Navbar, Footer, TouchNavDelay)
│   │   ├── page.tsx          # Home page (Server Component)
│   │   ├── blog/
│   │   ├── events/
│   │   ├── fun-zone/
│   │   ├── projects/
│   │   └── team/
│   │
│   ├── components/           # Shared React components
│   │   ├── LoadingScreen.tsx      # Terminal boot sequence
│   │   ├── Navbar.tsx             # Global navigation bar
│   │   ├── Footer.tsx             # Global footer
│   │   ├── ThemeToggle.tsx        # Circular View Transition theme switcher
│   │   ├── TouchNavDelay.tsx      # Android touch animation system
│   │   ├── InteractiveCalendar.tsx
│   │   ├── EventsSystem.tsx
│   │   ├── EventCard.tsx
│   │   ├── BlogGrid.tsx / BlogCard.tsx
│   │   ├── ProjectGrid.tsx / ProjectCard.tsx
│   │   ├── home/                  # HomeHero, HeroCanvas, HomeStrip
│   │   ├── fun-zone/              # FunZoneCards, ArtViewerClient, HeroArt
│   │   └── ui/                    # SearchOverlay, TagPill, AuthorPill, TypePill, MemberFlipCard...
│   │
│   └── lib/                  # Server-side utilities
│       ├── eventUtils.ts          # IST-aware Live/Upcoming/Past calculator
│       ├── events.ts              # Server-side event data loader
│       └── markdown.ts            # gray-matter + MDX pipeline
│
├── next.config.ts            # basePath, output: 'export'
└── package.json              # Scripts: predev, prebuild hooks
```

---

## 🌐 Deployment

The site is configured for **Static Export** (`output: 'export'`) and hosted on **GitHub Pages**.

- **Live URL**: [https://anuprovo-debnath.github.io/slashdot-website-2026/](https://anuprovo-debnath.github.io/slashdot-website-2026/)
- **Workflow**: Automated via GitHub Actions (`.github/workflows/deploy.yml`) on push to `main`.
- **Base Path**: All assets and routes are prefixed with `/slashdot-website-2026/`.

---

## ✍️ Adding Content

### New Blog Post
Create `content/blog/my-post.md` with:
```yaml
---
title: "My Post Title"
date: "2026-04-17"
excerpt: "A short summary..."
author: "Your Name"
tags: ["Design", "WebDev"]
coverImage: "/images/blog/my-cover.jpg"  # optional
---
Post body in Markdown here...
```

### New Event
Create `content/events/my-event.md` with:
```yaml
---
title: "Spring Hackathon"
date: "2026-05-10 - 2026-05-12"   # single day OR range
time: "09:00 - 22:00 IST"
category: "Hackathon"
status: "Upcoming"                  # used as fallback only; auto-computed at runtime
resources:
  github: "https://github.com/..."
  youtube: "https://youtube.com/..."
---
Event description here...
```

### New Team Member
Create `content/team/first-last.md` with:
```yaml
---
name: "First Last"
position: "Frontend Developer"
bio: "Short bio..."
image: "/images/team/first-last.jpg"
committee: "Dev"          # Dev | Design | PR | Lead
tenure: "2025-2026"
tech_stack: ["React", "TypeScript", "Figma"]
isAlumni: false
socials:
  github: "https://github.com/..."
  linkedin: "https://linkedin.com/in/..."
---
```

---

## 🤝 Credits

Developed by:

- [Anuprovo Debnath](https://github.com/anuprovo-debnath) — Lead Developer
- [Sattwik Pradhan](https://github.com/sattwik-pradhan) — Co-Developer

&copy; 2026 Slashdot Club, IISER Kolkata.
