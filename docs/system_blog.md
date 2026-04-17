# Slashdot Blog System Documentation (2026)

Technical reference for the Blog section at `/blog` — covering the MDX pipeline, grid layout, interactive components, freshness badges, fallback covers, and search integration.

---

## Table of Contents
1. [Architecture Overview](#1-architecture-overview)
2. [Content Schema](#2-content-schema)
3. [Card Grid Layout](#3-card-grid-layout)
4. [Freshness Badge System](#4-freshness-badge-system)
5. [Tag Explorer Portal](#5-tag-explorer-portal)
6. [AuthorPill — Author Search](#6-authorpill--author-search)
7. [Fallback Cover System](#7-fallback-cover-system)
8. [Detail Page (MDX Rendering)](#8-detail-page-mdx-rendering)
9. [Search Integration](#9-search-integration)
10. [Content Creation Guide](#10-content-creation-guide)
11. [Maintenance Guidelines](#11-maintenance-guidelines)

---

## 1. Architecture Overview

```
app/blog/
│
├── page.tsx                  ← Server: reads content/blog/*.md, sorts by date desc
│   └── <BlogGrid />          ← Client: grid with freshness badges, tag portals
│       └── <BlogCard />      ← Client: individual card with localStorage visited state
│
└── [slug]/
    └── page.tsx              ← Server: MDX rendering + related posts
```

All blog content is parsed with `gray-matter` (frontmatter) and compiled with `next-mdx-remote/rsc` (body). Since the project uses `output: 'export'`, all pages are pre-rendered at build time.

---

## 2. Content Schema

Create `.md` or `.mdx` files in `content/blog/`. The slug is the filename without extension.

```yaml
---
title: "The Future of Tech Clubs"
date: "2026-04-15"             # YYYY-MM-DD — used for sorting and freshness
excerpt: "A short summary shown in the card preview..."
author: "Anuprovo Debnath"     # Displayed via AuthorPill; indexed for @-search
authorEmail: "mailto:slashdot@iiserkol.ac.in"  # Optional
tags:
  - "WebDev"
  - "Design"
  - "Open Source"
coverImage: "/images/blog/my-cover.jpg"  # Optional; falls back to SVG pattern
---
Full article body in Markdown or MDX here...
```

### Field Reference

| Field | Type | Required | Notes |
| :--- | :--- | :--- | :--- |
| `title` | String | ✅ | Card heading (weight 1.0 in search) |
| `date` | String | ✅ | Sort key + freshness calculation |
| `excerpt` | String | ✅ | Body preview on card + search description |
| `author` | String | ✅ | Displayed via AuthorPill; enables `@` search |
| `tags` | String[] | ✅ | Rendered as `TagPill` chips; searchable |
| `coverImage` | String | Optional | If omitted, uses `SlashdotFallbackCover` |
| `authorEmail` | String | Optional | Linked from the author's name on detail page |

---

## 3. Card Grid Layout

### Geometry — "Matrix Grid"
Blog cards are fixed at **450px height** across all breakpoints:

| Zone | Height |
| :--- | :--- |
| Cover Image / Fallback | 180px |
| Tag Zone | 44px (scrollHeight > 30px → overflow trigger) |
| Text Area (Title + Excerpt) | Remaining (~226px) |

### Multi-Breakpoint Columns
| Breakpoint | Columns | `line-clamp` |
| :--- | :--- | :--- |
| Mobile | 1 | `line-clamp-4` |
| Tablet (`sm:`) | 2 | `line-clamp-5` |
| Standard Desktop (`lg:`) | 3 | `line-clamp-5` |
| Ultrawide (`xl:`) | 3+ | `line-clamp-6` |

### Hover Physics  
All hover animations use `transform-gpu` to promote the card to its own GPU compositor layer:
- **Card lift**: `hover:-translate-y-2` (8px upward)
- **Ring glow**: `hover:ring-[var(--color-primary)]/80`
- **Shadow**: `hover:shadow-[0_20px_50px_rgba(var(--color-primary-rgb),0.4)]`
- **Image zoom**: `group-hover:scale-110` on the `<img>` inside the cover zone
- **Title color**: `group-hover:text-[var(--color-primary)]`

All hover effects have mirrored `:active` rules and `.touch-nav-active` rules in `globals.css` for touch devices.

---

## 4. Freshness Badge System

Three badge states are determined at runtime using `localStorage` and the post's `date`:

| Badge | Display When | Color |
| :--- | :--- | :--- |
| **Latest** | The **first** post (most recent), not yet visited | Orange/Red |
| **New** | Any post less than 7 days old | Green |
| *(none)* | Post is older than 7 days OR has been seen | — |

### Logic Flow
```
Has post been visited? (slashdot_visited_blogs in localStorage)
  ├── YES → Show nothing
  └── NO → Is it the first (most recent) post?
              ├── YES → Show "LATEST" badge
              └── NO → Is it < 7 days old?
                         ├── YES → Show "NEW" badge
                         └── NO → Show nothing
```

Once the user clicks into the "Latest" post, its slug is added to `slashdot_visited_blogs`. On next visit, the badge disappears.

> [!IMPORTANT]
> All `localStorage` reads are gated behind a `mounted` state flag to prevent Next.js hydration mismatches. The server renders no badge; the client hydrates and then applies badges after mount.

---

## 5. Tag Explorer Portal

When a blog card has more tags than fit in the 44px tag zone (detected via `scrollHeight > 30px`), an overflow management system activates:

### Components
- **`TagSystem.tsx`**: Wraps `TagPill` components with overflow detection.
- **Trigger**: A `...` button appears pinned to the right of the tag row.
- **Portal Dialog**: Rendered via `ReactDOM.createPortal` to escape card `overflow: hidden` clipping.

### Portal Dialog Specs
| Property | Value |
| :--- | :--- |
| **Backdrop** | 60% black + `backdrop-blur-[12px]` |
| **Position** | Anchored to the bottom-right corner of the calling card |
| **Close button** | Red `×` with asymmetrical border-radius (Windows-style) |
| **Tags** | Full list of all `TagPill` components from the post |

Clicking any `TagPill` in the portal still dispatches `slashdot:open-search` with `all/ #TagName`, maintaining the zero-context-break discovery paradigm.

---

## 6. AuthorPill — Author Search

The `AuthorPill` component is rendered on:
- The **BlogCard** footer (next to date)
- The **Blog Detail Page** header

**Click behavior**: Dispatches `slashdot:open-search` with `all/ @AuthorName`. This triggers:
- A `document.startViewTransition` wrapping `flushSync` for a smooth animation.
- The Search Overlay opens with a **sky-blue `@` chip** in the input.
- A banner appears: **"Posts by [Author Name]"** above the results.
- Fuse.js searches with `author: 1.0` weight, `threshold: 0.25`.

---

## 7. Fallback Cover System

`src/components/ui/SlashdotFallbackCover.tsx` — used when no `coverImage` is provided.

### SVG Matrix Pattern
- **Base tile**: 80×240px, tiled seamlessly.
- **Tan=3 Slant (71°)**: Two sets of opposing slash strokes create a woven diagonal pattern.
- **Pulse Dots**: A 40×40 grid of `<circle>` elements animate their `r` (radius) and `opacity` with a `pulseScale` CSS keyframe, producing a living, breathing texture.
- **Center Badge**: A circular `<circle>` background with the `/. ` brand mark centered in `font-heading` (Arista Pro Bold), colored in `var(--color-primary)`.

### Uniqueness
The fallback cover looks identical for all posts but is always brand-consistent. This is intentional — it creates a cohesive visual identity even for posts without custom artwork. If desired, a `variant` prop can shift the hue.

---

## 8. Detail Page (MDX Rendering)

`app/blog/[slug]/page.tsx` is a **Server Component** that:
1. Reads the `.md` file with `gray-matter`.
2. Compiles the body with `next-mdx-remote/rsc` using a custom component map.
3. Renders the full article with:
   - **Hero image or fallback cover**
   - **Metadata row**: date, reading time (estimated from body length), `AuthorPill`
   - **Body**: MDX with code highlighting, images, callouts
   - **Tags**: `TagPill` row at the bottom
   - **Related Posts**: 3 posts sharing the most tags

### Reading Time Estimation
```ts
const words = body.split(/\s+/).length;
const readingMinutes = Math.ceil(words / 200);
```
Displayed as "X min read" in the metadata row.

---

## 9. Search Integration

Blog posts are indexed as `type: "blog"`:

| Frontmatter Field | Index Key | Fuse Weight (Normal) |
| :--- | :--- | :--- |
| `title` | `title` | 1.0 |
| `tags` | `tags` | 0.7 |
| `excerpt` | `description` | 0.4 |
| `author` | `author` | 0.3 |

### `blog/` Scope
Typing `blog/` in the search bar narrows Fuse.js to only `type === "blog"` items.

### `@Author` Mode
Typing `@AuthorName` (or clicking `AuthorPill`) sets `author: 1.0` weight and `threshold: 0.25`. The author is also indexed for team member cross-referencing — so `@Anuprovo Debnath` returns both blog posts AND the team member card.

---

## 10. Content Creation Guide

### Minimum Viable Post
```markdown
---
title: "My First Post"
date: "2026-04-17"
excerpt: "What this post is about."
author: "Your Name"
tags: ["Tag1", "Tag2"]
---

## Introduction

Your article content here...
```

### Images in the Body
- Store images in `public/images/blog/`.
- Reference them in MDX: `![Alt text](/images/blog/filename.jpg)`
- Next.js `basePath` (`/slashdot-website-2026`) is prepended automatically by `<Image>` components.

---

## 11. Maintenance Guidelines

> [!CAUTION]
> The card height lock (450px) is shared with the Projects grid. Any changes to internal element heights must be carefully balanced.

- **The 3:1 Slant**: `SlashdotFallbackCover` uses a `tan=3` (71°) slant. All new brand patterns must respect this angle.
- **No Hardcoded Colors**: Use only CSS variables from `globals.css`. `#0291B2` should never appear in component JSX.
- **`mounted` Guard**: Freshness badges, tag overflow detection, and any other `localStorage`/browser-API usage must check `mounted` state first.
- **MDX Custom Components**: To extend the MDX component map (e.g., add a custom `<Callout>` component), update the `components` object passed to `MDXRemote` in the detail page.
- **Sorting**: Posts are sorted by `date` descending in `app/blog/page.tsx`. The `date` field must always be in `YYYY-MM-DD` format.
