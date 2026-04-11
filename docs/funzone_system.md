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
- **`headerPx` & `gridPx` (`px-10`)**: Standardized 40px horizontal padding to ensure high-motion hover states (shadows/scaling) do not clip at the viewport edges.
- **`snapPl` (`scroll-pl-10`)**: Synchronizes the scroll-snap start point with the 40px container indentation.
- **`gridLayout`**: Defines the responsive column widths (1-col mobile, 2-col tablet, 3-col desktop) for the horizontal `grid-flow-col` scroller.

### Shared Components
- **`SidelongStrip`**: A wrapper component that encapsulates the Section Header, Navigation Buttons, and the Scroller Container. It ensures cross-section parity for all layout metrics.
- **`MemeCard` / `GameCard` / `ArtCard`**: Specialized card implementations mapped to the uniform 450px grid system.

---

## 3. Responsive Grid & Sidelong Scroller
The horizontal scrolling architecture is built for high-density, snap-mandatory interactions.

### Layout Logic
- **Geometry Inheritance**: Cards are strictly **450px** high, mirroring the Blog/Project grid geometry.
- **Manual Shift (Gutter Strategy)**: The scroller uses `px-10` (40px) padding instead of the standard `max-w-7xl` centered padding. This "Manual Shift" ensures that the first card aligns perfectly with the site-header's left edge while allowing scroll-shadows to bleed into the gutter without clipping.
- **Snap mandatory Behavior**: Full-width scrolling with `snap-start` provides a tactile, "app-like" experience for Memes and Games.
- **Navigation Controls**: Desktop users can use smooth-scroll `<` and `>` buttons which advance fixed increments of the client viewport width.

---

## 4. Asset Management & Links
- **Local Assets**: Game thumbnail assets are stored locally in `/public/images/games/` to eliminate dependence on third-party GIF host reliability.
- **External Redirection**: For Game Cards, the entire card body functions as a link precisely routing to the provided game URLs (e.g., play2048.co, play.tetris.com).
- **Asset Pathing**: Images use the `${REPO_NAME}` constant prefix to ensure correct resolution on GitHub Pages deployments.

---

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
