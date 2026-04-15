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

## 3. Responsive Grid & Sidelong Scroller
The horizontal scrolling architecture is built for high-density, snap-mandatory interactions with automated traversal.

### Layout Logic
- **Geometry Inheritance**: Cards are strictly **450px** high, mirroring the Blog/Project grid geometry.
- **Mask Fade & Shadow Safety**: Instead of strict clipping borders, the system applies a 16px fade effect using `mask-image` at the edges of the horizontal list, preserving enough non-faded padding (the remaining 16px) to allow aggressive hover box-shadows to bleed elegantly over the background context without visual severing.
- **Auto-Scrolling Architecture**: A mathematical observer interval continually advances the scroll position by precisely computing `firstElementChild.clientWidth + 32px` on a 4-second cycle, guaranteeing an unbroken one-by-one slide view. If the physical boundary is intersected, the scroll smoothly resets to zero.
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
