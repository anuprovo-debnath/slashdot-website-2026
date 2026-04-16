# Slashdot Blog System Documentation

This document outlines the architecture, design logic, and technical implementation of the high-performance blog grid and interactive UI system developed for the Slashdot website (2026).

---

## 1. Responsive Card Grid
The blog grid is built for strict visual uniformity across all resolutions while maximizing content density.

### Core Proportions
- **Total Height:** Strictly fixed at **450px** across all devices to maintain a clean "Matrix" grid.
- **Image Height:** **180px** (210px was previous, reduced to optimize for text).
- **Tag Zone:** **44px** (Height-locked with a robust 30px overflow threshold).
- **Text Area:** Rebalances dynamically using a **"Greedy Clamping"** strategy.

### Multi-Breakpoint Line Clamping
To eliminate "dead space" as cards get wider on larger screens, the `line-clamp` logic is responsive:
- **Mobile (1-col):** `line-clamp-4` (Optimized for narrow containers).
- **Tablet/Small Desktop (2-col):** `sm:line-clamp-5` (Aggressive fill for wider containers).
- **Desktop (Standard 3-col):** `lg:line-clamp-5`.
- **Ultrawide:** `xl:line-clamp-6` (Maximum story density).

---

## 2. Interactive UI Components

### Tag Explorer Portal
A sophisticated system for managing many tags within a small vertical budget.
- **Overflow Detection:** Uses a `scrollHeight > 30px` check to detect if tags have wrapped to a second row.
- **Trigger:** A stylized `...` button appears pinned to the right when overflow is detected.
- **Dialogue:** Renders via **React Portal** to escape container clipping.
    - **Backdrop:** 60% black with 12px blur (Glassmorphism).
    - **Closing Mechanism:** A red "Windows-style" `×` button with asymmetrical rounding.
    - **Anchoring:** Dynamically positioned and anchored to the bottom-right of the calling card.

### Badge FRESHNESS Logic
- **Latest (Orange/Red):** Shows only for the first (most recent) post if it has never been visited.
- **New (Green):** Shows for any post less than 7 days old.
- **Logic:** Once the "Latest" post is read (tracked via `localStorage`), it automatically switches to a "New" badge until its freshness expires.

---

## 3. Brand Fallback Covers (`SlashdotFallbackCover.tsx`)
A dynamic fallback for blog posts lacking a featured image, designed with high brand fidelity.

### SVG Matrix Pattern
- **Grid Strategy:** A mathematically seamless **80x240 matrix**.
- **The "Weave":** Staggered groups of slashes moving in opposing diagonal directions along a **Tan=3 slope** (71-degree angle).
- **Pulsation:** A fixed 40x40 grid of dots that pulsate in radius and opacity to add "tech texture."
- **Center Logo:** A circular badge containing the stylized **"/. "** mark, utilizing the brand's primary color and typography.

---

## 4. Design System Integration

### Centralized Theming
All colors are synchronized with `src/app/globals.css` variables:
- **Primary:** `var(--color-primary)` (#0291B2).
- **Background:** `var(--color-background)` (Dynamic light/dark mode).
- **Fonts:** Custom **'Arista Pro'** brand font is mapped to the `font-heading` utility for all titles and brand elements.

### Performance & Hydration
- **SSG Ready:** Optimized for Static Site Generation with `mounted` state guards to prevent hydration mismatches on client-driven UI elements (like time-based badges and patterns).
- **Zero Hardcoded Colors:** 100% logic-driven styling for effortless theme switching.

---

## 5. File Manifest
- `src/components/BlogGrid.tsx`: Main architecture and responsive logic.
- `src/components/ui/SlashdotFallbackCover.tsx`: The brand patterns and SVG animations.
- `src/app/globals.css`: Centralized variables and font mappings.
- `src/lib/markdown.ts`: Server-side markdown processing logic.

---

## 6. Content Creation Guide

To add a new blog post, follow these steps:

1.  **Create File:** Navigate to `content/blog/` and create a new `.md` or `.mdx` file (e.g., `new-feature.md`).
2.  **Add Frontmatter:** Every post requires a valid YAML frontmatter block at the top:
    ```yaml
    ---
    title: "The Future of Slashdot: 2026"
    date: "2026-04-10"
    excerpt: "A summary of our new digital presence..."
    author: "Core Team"
    authorEmail: "mailto:slashdot@iiserkol.ac.in"
    tags: ["Web3", "NextJS", "Design"]
    coverImage: "/blog/cover-1.jpg" # Optional - Fallback pattern used if omitted
    ---
    ```
3.  **Images:** Store featured images in `public/blog/` and reference them using absolute paths starting from `/`.

---

## 7. Technical Deep Dive

### Data Architecture
- **Parsing:** Uses `gray-matter` for robust frontmatter extraction and `next-mdx-remote/rsc` for server-side MDX rendering.
- **Fetching:** The `getMarkdownFiles` function (`src/lib/markdown.ts`) reads files directly from the filesystem during the build step.
- **Sorting:** Posts are automatically sorted by the `date` frontmatter field in descending order (newest first).

### Performance Optimizations
- **Static Export:** The project is configured for `output: 'export'`, generating a fully static site where every blog post is pre-rendered for maximum Lighthouse scores.
- **Responsive Clamping Logic:**
    - Uses CSS `line-clamp` within a `flex-col` structure.
    - Explicitly sets `min-h-0` on container parents to prevent layout breaks when increasing content density in 2-column mode.
- **Memory Tracking:** Employs `localStorage` on the client-side to track `visitedSlugs`, enabling the dynamic "Read vs. New" badge logic without requiring a backend database.

---

## 8. Maintainer & AI Agent Guidelines

If you are a developer or an AI agent working on this system, you **must** follow these strict architectural rules:

### 1. The "100% Theme Sync" Rule
- **NEVER** use hardcoded hex colors (e.g., `#0291B2`).
- **ALWAYS** use CSS variables from `globals.css`:
    - Use `var(--color-primary)` for brand teal.
    - Use `var(--background)` or `bg-background` for theme-aware backgrounds.

### 2. Grid Geometry & Constraints
- The blog grid rely on **Pixel-Perfect Alignment**.
- The card height is locked at **450px**. If you adjust internal child heights, ensure the total `Content Zone + Tag Zone` still equals 450px.
- **Ratio Anchor:** The fallback SVG patterns use a **3:1 slant ratio** (71 degrees). Any new brand patterns should respect this specific angle.

### 3. Hydration-First Logic
- All components utilizing browser-only APIs (`window`, `localStorage`, `Math.random` in SVGs) must use the `mounted` state check pattern.
- Failing to do so will cause **Next.js Hydration Mismatches** during the static export process.

### 4. GitHub Pages Asset Pathing
- This project is deployed at a sub-path (`/slashdot-website-2026`).
- Always use absolute paths starting with `/slashdot-website-2026/` for assets (fonts, images) in `globals.css` or when using standard `<img>` tags.
- The `SlashdotFallbackCover` uses a `basePath` variable for image assets when applicable.
