# Slashdot Projects System Documentation (2026)

Technical reference for the Projects section at `/projects`, covering the card grid, content schema, search integration, status badges, and the TypePill discovery system.

---

## Table of Contents
1. [Architecture Overview](#1-architecture-overview)
2. [Content Schema](#2-content-schema)
3. [Card Grid Layout](#3-card-grid-layout)
4. [Status Badge System](#4-status-badge-system)
5. [TypePill — Project Type Search](#5-typepill--project-type-search)
6. [Fallback Cover System](#6-fallback-cover-system)
7. [Detail Page](#7-detail-page)
8. [Search Integration](#8-search-integration)
9. [Content Creation Guide](#9-content-creation-guide)
10. [Maintenance Guidelines](#10-maintenance-guidelines)

---

## 1. Architecture Overview

```
app/projects/
│
├── page.tsx                  ← Server: reads content/projects/*.md
│   └── <ProjectGrid />       ← Client: grid, filtering, search dispatch
│       └── <ProjectCard />   ← Client: individual card with visited state
│
└── [slug]/
    └── page.tsx              ← Server: detail page with MDX body
```

All project content is MDX-based, meaning each project page can contain full interactive React components inside the markdown body if needed.

---

## 2. Content Schema

Create `.md` (or `.mdx`) files in `content/projects/`. The `slug` is the filename without the extension.

```yaml
---
title: "Slashdot Website 2026"
description: "The official high-fidelity website for the Slashdot club's 2026 season."
category: "Internal_Tools"    # Internal_Tools | Member_Spotlight | Other
status: "Active"              # Active | Maintained | Archived
tech_stack:
  - "Next.js 15"
  - "TypeScript"
  - "Tailwind CSS v4"
  - "Fuse.js"
links:
  github: "https://github.com/anuprovo-debnath/slashdot-website-2026"
  demo: "https://anuprovo-debnath.github.io/slashdot-website-2026/"
  youtube: "https://youtube.com/..."   # Optional
coverImage: "/images/projects/slashdot-2026.jpg"  # Optional
date: "2026-04-01"
---
Full project description in Markdown / MDX...
```

### Field Reference

| Field | Type | Required | Notes |
| :--- | :--- | :--- | :--- |
| `title` | String | ✅ | Card heading |
| `description` | String | ✅ | Card body text, 200-char search excerpt |
| `category` | Enum | ✅ | Drives `TypePill` and `type:` search |
| `status` | Enum | ✅ | Drives status badge color |
| `tech_stack` | String[] | ✅ | Rendered as `TagPill` components |
| `links.github` | URL | Recommended | Shown as external link chip |
| `links.demo` | URL | Optional | Live demo button |
| `links.youtube` | URL | Optional | Video walkthrough chip |
| `coverImage` | String | Optional | Falls back to `SlashdotFallbackCover` |
| `date` | String | ✅ | Used for sorting (descending) |

---

## 3. Card Grid Layout

### Geometry
All project cards are fixed at **450px height** across all breakpoints to maintain the visual consistency of the "Matrix grid" pattern shared with the Blog section:

| Zone | Height |
| :--- | :--- |
| Cover Image / Fallback | 180px |
| Status + Tech Stack Row | 44px |
| Description Text Area | Remaining (~226px) |

### Multi-Breakpoint Columns
| Breakpoint | Columns | `line-clamp` |
| :--- | :--- | :--- |
| Mobile | 1 | `line-clamp-4` |
| Tablet (`sm:`) | 2 | `line-clamp-5` |
| Desktop (`lg:`) | 3 | `line-clamp-5` |
| Ultrawide (`xl:`) | 3+ | `line-clamp-6` |

### Hover Effects
- **Card lift**: `hover:-translate-y-2` (8px upward shift)
- **Ring glow**: `hover:ring-[var(--color-primary)]/80`
- **Shadow expansion**: `hover:shadow-[0_20px_50px_rgba(var(--color-primary-rgb),0.4)]`
- **Title color**: `group-hover:text-primary`
- **Image zoom**: `group-hover:scale-110` on the `<img>` inside the card thumbnail

All hover effects are mirrored for touch devices via the global touch-parity CSS in `globals.css`.

---

## 4. Status Badge System

Status is rendered as a pill badge, styled entirely from `globals.css` tokens:

| Status | Background | Text | Border |
| :--- | :--- | :--- | :--- |
| **Active** | `bg-primary/10` | `text-primary` | `border-primary/20` |
| **Maintained** | `bg-foreground/5` | `text-foreground/70` | `border-foreground/10` |
| **Archived** | `bg-foreground/5` | `text-foreground/40` | `border-foreground/5` |

The badges have no inline colors — they adapt automatically when the theme toggles between light and dark mode.

---

## 5. TypePill — Project Type Search

Each project card has a `TypePill` that displays the `category` (e.g., "Internal_Tools"):
- **Icon**: A `📁` folder emoji prefix.
- **Color**: Violet accent (`bg-violet-500`).
- **Click Behavior**: Dispatches `slashdot:open-search` with query `projects/ type:CategoryName`.

In the Search Overlay, this pre-fills the input, activates `type:` mode (Fuse key `projectType: 1.0`, threshold `0.25`), and shows a violet input chip labeling the active filter.

---

## 6. Fallback Cover System

When no `coverImage` is provided, `SlashdotFallbackCover.tsx` renders a branded SVG cover.

### SVG Matrix Pattern
- **Grid**: An 80×240 base tile, tiled seamlessly with `patternUnits="userSpaceOnUse"`.
- **Tan=3 Slant**: Slash patterns run at 71° (`tan⁻¹(3)`) — two opposing stagger directions ("weave").
- **Dot Grid**: A 40×40 grid of circles that animate in `r` (radius) and `opacity` via CSS keyframes.
- **Center Badge**: A circular branded badge containing the `/. ` mark in `font-heading` (Arista Pro Bold) at `var(--color-primary)`.

The fallback renders a unique color variant based on `category` when that variant configuration is active.

---

## 7. Detail Page

`app/projects/[slug]/page.tsx` is a Server Component that:
1. Reads the specific `.md` file with `gray-matter`.
2. Compiles the MDX body with `next-mdx-remote/rsc`.
3. Renders the full page with:
   - **Project header**: title, description, status badge, tech stack pills, external links.
   - **MDX body**: full article content with code blocks, images, custom components.
   - **Related Projects**: 3 most-recent other projects (by date).

### Link Chips on Detail Page
The `links` object renders as interactive chips:
- `github` → GitHub-style chip (dark, monospace icon)
- `demo` → Primary-color chip with external link icon
- `youtube` → Red chip with YouTube play icon

---

## 8. Search Integration

Projects are indexed as `type: "project"` with these field mappings:

| Frontmatter Field | Index Key | Fuse Weight (Normal Mode) |
| :--- | :--- | :--- |
| `title` | `title` | 1.0 |
| `tech_stack` + `category` | `tags` | 0.7 |
| `description` | `description` | 0.4 |
| `category` | `projectType` | Used only in `type:` mode |

### `type:` Search Mode
Triggered by the `TypePill` or by manually typing `projects/ type:Internal_Tools` in the search bar:
- Fuse.js rebuilds with `projectType: 1.0` weight and `threshold: 0.25`.
- The `type:Internal_Tools` prefix is stripped before searching: `Internal_Tools` → Fuse.
- A violet input chip appears: `📁 Internal Tools`.

---

## 9. Content Creation Guide

1. **Create the file**: `content/projects/my-project-name.md`
2. **Fill frontmatter**: All required fields (title, description, category, status, tech_stack, date).
3. **Add a cover image** (optional but recommended): Place in `public/images/projects/` and reference as `/images/projects/filename.jpg`.
4. **Write the body**: Standard Markdown. MDX components accepted.
5. **Re-run the dev server**: `npm run dev` regenerates the search index automatically.

---

## 10. Maintenance Guidelines

> [!IMPORTANT]
> The 450px card height is a **non-negotiable constraint** shared with the Blog grid. Adjusting internal element heights must be balanced so the total `Cover + Status + Description` equals exactly 450px.

- **No Hardcoded Colors**: Use `var(--color-primary)`, `var(--color-live)`, etc. Never use raw hex values inside component JSX.
- **Hydration Guards**: Any `localStorage` usage (e.g., for tracking viewed projects) must be behind a `mounted` state check.
- **Type Categories**: Only `Internal_Tools | Member_Spotlight | Other` are official `category` values. Custom values will not match `TypePill` searches from the index.
- **GitHub Pages Subpath**: Asset paths in frontmatter must start with `/images/` (not full repo path). The `next.config.ts` `basePath` prepends `/slashdot-website-2026` automatically for all internal `<Image>` and `<Link>` components.
