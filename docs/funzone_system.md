# Slashdot Fun Zone System Documentation

This document outlines the architecture, design logic, and technical implementation of the Fun Zone and its interactive UI systems developed for the Slashdot website (2026).

---

## 1. Fun Zone Structure
The Fun Zone is divided into three distinct sub-sections designed for interactive engagement while adhering strictly to the Slashdot design system.

### Core Sections
- **Memes:** A curated stream of tech culture, displayed as a horizontal carousel.
- **Games:** Interactive playable web games utilizing local assets and external URLs.
- **Art Gallery:** Procedurally generated visual expressions (geometric recursion, fluid dynamics).

---

## 2. Refactored Component Architecture
To improve maintainability and visual consistency, the Fun Zone leverages a central configuration and reusable components.

### Centralized Layout Configuration (`STRIP_CONFIG`)
All spacing, padding, and grid geometry is defined in a single `STRIP_CONFIG` constant:
- **`headerPx` & `gridPx` (`px-8`)**: Standardized 32px horizontal padding to geometrically match the card gaps (gap-8 is 32px).
- **`snapPl` (`scroll-pl-8`)**: Synchronizes the scroll-snap start point with the 32px container indentation.
- **`gridLayout`**: Defines the responsive column widths (1-col mobile, 2-col tablet, 3-col desktop) for the horizontal `grid-flow-col` scroller.

### Shared Components
- **`SidelongStrip`**: A wrapper component that encapsulates the Section Header, Navigation Buttons, and the Scroller Container. It features an automated scrolling system (one card at a time with a 4000ms delay) that naturally pauses upon user interaction (mouseenter, touch, etc.). Further, it introduces a 16px CSS `mask-image` linear-gradient to gracefully fade resting cards instead of hard clipping them against the layout padding.
- **`MemeCard` / `GameCard` / `ArtCard`**: Specialized card implementations mapped to the uniform 450px grid system.

---

## 3. Dynamic Viewing & Serialization
To support static exports (`output: 'export'`) with dynamic detailed routes (`/fun-zone/[slug]`), the system employs a **Type-Based Selection Pattern**.

### Serializable Registry Pattern
Next.js prohibits passing raw component functions from Server Components to Client Components. The detail pages resolve this by storing only serializable metadata in the registry:
- **Registry**: `src/app/fun-zone/[slug]/page.tsx`
- **Logic**: The registry maps slugs to a `type` string (e.g., `'meme'`, `'art'`).
- **Resolution**: The Client Component (`ArtViewerClient.tsx`) imports viewer components and selects the appropriate one internally based on this type.

---

## 4. Asset Management & Pathing
To ensure reliability on GitHub Pages (hosted at `/slashdot-website-2026/`), the site uses a centralized pathing system.

### Repository-Aware Pathing (`getImgPath`)
Located in `src/lib/imgUtils.tsx`, the `getImgPath` utility:
- Detects the repository prefix and automatically prepends it to internal paths.
- Ignores external `https://` URLs to allow mixed content sourcing.
- **Rules for standard `<img>` tags**: Always wrap `src` values in this utility to prevent 404s in production.

### Local Asset Migration
- **Memes**: Migrated from external hotlinking to local assets in `public/images/memes/` to eliminate cross-origin blocking and high latency.
- **Games**: Stored in `public/images/games/`.

## 5. Performance & Hydration
- **Mounted State Guard**: The system implements a strict `mounted` check to prevent hydration mismatches during the `output: 'export'` process.
- **GPU Acceleration**: Scroller containers use `transform-gpu` and `will-change-scroll` (implicit) to maintain 60fps performance during high-motion scrolling.

---

## 6. Maintainer & AI Agent Guidelines

### 1. Hard Geometry Constraints
- **Height**: MUST lock at **450px**.
- **Indentation**: Horizontal sections MUST use the **40px manual shift** (`px-10`) for gutter alignment.

### 2. Base Pathing
- **Navigation**: Use relative paths from the root (e.g., `/fun-zone`) as Next.js `basePath` handles the repo prefix.
- **Static Assets**: Manually prepend the repository name constant for images or fonts within `page.tsx` components.

## 7. Typography & Accessibility
- **Character Fallback**: The Fun Zone heavily utilizes numbers for game scores and metadata. Since the primary brand font (Arista Pro) lacks glyphs for numerals and the `@` symbol, the system relies on a global `unicode-range` fallback in `globals.css` that maps these characters to a legible geometric sans-serif (Inter/Geist).
