# Slashdot Fun Zone System Documentation (2026)

Technical reference for the Fun Zone at `/fun-zone` — a creative playground featuring memes, web games, and generative art, powered by a fully markdown-driven content architecture.

---

## Table of Contents
1. [Architecture Overview](#1-architecture-overview)
2. [Content Architecture — Markdown-Driven](#2-content-architecture--markdown-driven)
3. [Listing Page Layout](#3-listing-page-layout)
4. [Content-Type Cards](#4-content-type-cards)
5. [Detail Page — Branching Renderer](#5-detail-page--branching-renderer)
6. [Generative Art Components](#6-generative-art-components)
7. [Procedural Visual Math](#7-procedural-visual-math)
8. [Navigation & UX Stability](#8-navigation--ux-stability)
9. [Search Integration](#9-search-integration)
10. [Content Creation Guide](#10-content-creation-guide)
11. [Maintenance Guidelines](#11-maintenance-guidelines)

---

## 1. Architecture Overview

```
app/fun-zone/
│
├── page.tsx                      ← Server: fetches all funzone .md files
│   └── <FunZoneClientPage />     ← Client: tab UI, search, scroll gradients
│       ├── <MemeCard />          ← Content card (category: meme)
│       ├── <GameCard />          ← Content card (category: game)
│       └── <ArtCard />           ← Content card (category: art | design)
│
└── [slug]/
    └── page.tsx                  ← Server: reads specific .md file
        ├── Blog-style layout     ← for memes/standard content
        └── <ArtViewerClient />   ← for art/design content
            └── <HeroArt />       ← Canvas-based generative art
            └── <HeroMatrixArt /> ← SVG-based brand matrix art
```

---

## 2. Content Architecture — Markdown-Driven

All Fun Zone items are defined as `.md` files in `content/funzone/`. The content type is determined entirely by the `category` frontmatter field.

### Frontmatter Schema

```yaml
---
title: "My Meme Title"
category: "meme"              # Options: meme | game | art | design
description: "A short blurb"
date: "2026-04-10"
tags: ["programming", "humor"]
coverImage: "/images/funzone/my-meme.jpg"   # Optional for memes/art
url: "https://external-game.com"            # Only for games (external URL)
artType: "canvas"                           # Only for art: "canvas" | "svg"
artComponent: "HeroArt"                     # Only for art: component name to render
---
Markdown body content here (displayed in blog-style layout for memes).
```

### Category → Behavior Mapping

| `category` | Card Type | Detail Page |
| :--- | :--- | :--- |
| `meme` | `MemeCard` | Blog-style article layout |
| `game` | `GameCard` | Opens `url` externally (new tab) OR embedded iframe |
| `art` | `ArtCard` | `ArtViewerClient` with device frame viewer |
| `design` | `ArtCard` | `ArtViewerClient` with device frame viewer |

---

## 3. Listing Page Layout

`FunZoneClientPage.tsx` handles the interactive listing page:

### Tab Navigation
Three tabs filter the grid: **Memes**, **Games**, **Art Gallery**. Tab state is managed locally with `useState`.

### Horizontal Scroll with Edge Fade
Each tab section uses a horizontal scroll container with a fade gradient on both edges (the same `mask-image` technique used in `HomeStrip`):
```css
mask-image: linear-gradient(to right, transparent, black 24px, black calc(100% - 24px), transparent)
```

### Page-Level Search
A text input in the Fun Zone header filters cards by `title`, `description`, and `tags` using a simple client-side `includes()` check — distinct from the global `Ctrl+K` search overlay.

### Scroll Gradient Utilities
The Fun Zone uses the global `.hide-scrollbar` and `.mask-horizontal-faded` utility classes from `globals.css` to hide the scrollbar and apply entry/exit gradients.

---

## 4. Content-Type Cards

All cards in `src/components/fun-zone/FunZoneCards.tsx`.

### MemeCard
- Displays `coverImage` with `object-cover`.
- A hover overlay reveals `description` text.
- Clicking navigates to the blog-style detail page (`/fun-zone/[slug]`).
- Uses `SlashdotFallbackCover` if no `coverImage` is provided.

### GameCard
- Displays a game thumbnail / icon.
- If `url` is set, clicking opens it in a new tab (`target="_blank"`).
- If no external URL, clicking navigates to the detail page for an embedded experience.
- A `🎮` badge overlays the thumbnail to signal interactivity.

### ArtCard
- Displays a procedurally generated preview thumbnail (see [Procedural Visual Math](#7-procedural-visual-math)).
- Badge shows the `artType` (`canvas` or `svg`).
- Clicking navigates to the `ArtViewerClient` detail page.

---

## 5. Detail Page — Branching Renderer

`src/app/fun-zone/[slug]/page.tsx` reads the frontmatter `category` and branches:

### Branch A: Blog-Style (Memes & Standard)
Renders the markdown body in a clean, typography-focused layout:
- Large `coverImage` header
- Centered body text with proper heading hierarchy
- `<TagPill>` chips at the bottom for tag discovery

### Branch B: Art Viewer (`ArtViewerClient`)
For `category: art | design` items, renders in a "device showcase" layout:

```
┌─────────────────────────────────────────────┐
│            Device Frame Selector            │  ← Desktop / Tablet / Mobile
├─────────────────────────────────────────────┤
│                                             │
│          [Generative Art Component]         │  ← HeroArt or HeroMatrixArt
│                                             │
├─────────────────────────────────────────────┤
│         Architectural Data Overlays         │  ← Specs, dimensions, component info
└─────────────────────────────────────────────┘
```

The device frame resizes the inner viewport and shows dimensional overlays (e.g., "1440 × 900px") that update dynamically as the user switches between Desktop / Tablet / Mobile.

---

## 6. Generative Art Components

### `HeroArt.tsx` — Canvas-Based
A Simplex-noise-driven particle field identical in architecture to the Hero Canvas (same CONFIG pattern), but with content-specific tuning:
- Renders brand glyphs from `lib/symbols.ts`
- Can be configured with a `theme` prop to shift color palette
- Uses the same `BackgroundSymbol` class pattern

### `HeroMatrixArt.tsx` — SVG-Based
A high-fidelity brand SVG matrix pattern:
- Built entirely from `<line>` and `<circle>` SVG primitives
- Uses the **Tan=3 slant (71°)** brand geometry — staggered groups of slashes moving in opposing diagonal directions
- A fixed 40×40 grid of dots that animate in radius and opacity to add "tech texture"
- Center badge renders the `/. ` brand mark in `font-heading` (Arista Pro Bold)

---

## 7. Procedural Visual Math

ArtCard thumbnails use a deterministic hash function to generate unique-but-stable visual identities per item.

### `getImprovedHash(slug: string): number`
Converts the item's slug into a pseudo-random integer via a polynomial hash:
```ts
function getImprovedHash(slug: string): number {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash * 31 + slug.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}
```

### Visual Properties Driven by Hash
| Property | Formula | Range |
| :--- | :--- | :--- |
| **Hue Shift** | `60 + (hash % 240)` | 60°–300° (avoids muddy tones) |
| **Base Rotation** | `hash % 360` | 0°–360° |
| **Ring Count** | `3 + (hash % 3)` | 3–5 rings |
| **Opacity Variance** | `0.3 + (hash % 40) / 100` | 0.3–0.70 |

The same `slug` always produces the same visual, so the grid looks consistent across reloads and builds.

---

## 8. Navigation & UX Stability

### `ScrollToTop.tsx`
A zero-render utility component that calls `window.scrollTo(0, 0)` on every route change. This ensures meme detail pages and art viewer pages always begin at the top, regardless of scroll position on the previous page.

### Mobile Tactile Response
- **`touchstart`**: Cards apply an immediate `scale(0.97)` to signal a press.
- **`touchend`**: Scale is released after 200ms.
- **Global Touch-Parity**: The `.touch-nav-active` system (from `TouchNavDelay.tsx`) ensures that card animations are visible before navigation fires.

---

## 9. Search Integration

Fun Zone items are indexed at build time by `scripts/generate-search-index.js`:

| Field | Index Key | Notes |
| :--- | :--- | :--- |
| `title` | `title` | Primary match |
| `description` | `description` | Secondary match |
| `tags` + `category` | `tags` | Category (meme/game/art) is always included |
| `coverImage` | `image` | Used for 40px thumbnail in search results |
| `url` | `url` | External URL for games |

In the Search Overlay (`SearchOverlay.tsx`), Funzone results that have a non-empty `image` field render a **40×40px rounded thumbnail** next to the title — unique to this content type.

Navigation from search: if `url` is set, clicking opens the external URL in a new tab. Otherwise, it navigates to `/fun-zone/[slug]`.

---

## 10. Content Creation Guide

### Adding a Meme
```bash
# 1. Create the content file
touch content/funzone/my-meme-name.md
```
```yaml
---
title: "When the CSS isn't working"
category: "meme"
description: "A relatable backend dev moment"
date: "2026-04-17"
tags: ["CSS", "humor", "webdev"]
coverImage: "/images/funzone/css-meme.jpg"
---
Write any extra context about the meme here.
```

### Adding a Game
```yaml
---
title: "Type Racer Clone"
category: "game"
description: "Test your typing speed!"
date: "2026-04-17"
tags: ["typing", "game", "fun"]
url: "https://external-game-url.com"    # Opens in new tab
---
```

### Adding Generative Art
```yaml
---
title: "Slashdot Matrix"
category: "art"
description: "A procedural SVG brand pattern"
date: "2026-04-17"
tags: ["generative", "art", "design"]
artType: "svg"
artComponent: "HeroMatrixArt"
---
```

---

## 11. Maintenance Guidelines

> [!CAUTION]
> `public/search-index.json` is auto-generated. Never edit it manually — changes will be overwritten on the next `npm run dev` or `npm run build`.

- **Geometry Consistency**: All new generative art components MUST use the **Tan=3 slant (71°)** for any diagonal patterns. This is a core brand constraint.
- **Hash Stability**: Do not change the `getImprovedHash` algorithm. Changing it will alter all existing card appearances.
- **Category Values**: The `category` field drives layout branching. Only use `meme | game | art | design`. Other values will fall back to blog-style layout.
- **External Game URLs**: Always set `target="_blank"` behavior is handled automatically when `url` is set in frontmatter.
- **Image Paths**: Store images in `public/images/funzone/` and reference them as `/images/funzone/filename.jpg` in frontmatter.
