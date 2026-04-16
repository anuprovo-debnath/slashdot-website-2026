# Slashdot Home System (2026)

This document outlines the architecture, visual design patterns, and implementation details of the global Home Page for the Slashdot Website 2026.

## 1. Core Philosophy

The Slashdot Home Page is the central entry point of the platform, designed to deliver maximum visual impact while maintaining optimal performance. It serves as an immediate introduction to the club's identity—blending technical rigour with creative design via a highly interactive hero section that establishes the "Theme Parity" used throughout the rest of the application.

## 2. Visual Architecture

### Hero Canvas Background Layer (`HeroCanvas.tsx`)
- **Symbol Density**: Precisely calibrated to 600 floating symbols ensuring a rich textual texture.
- **Vivid Spectrum Aesthetic**: Symbols use a full-spectrum **HSL(0-360, 100%, 50%)** vivid color palette. This provides a striking, high-energy technological texture that contrasts beautifully against the site's dark and light backgrounds.
- **Depth-Linked Opacity (Inverse Proportion)**: Each symbol's `baseOpacity` is calculated as `(MAX_OPACITY × MIN_SIZE) / size`, a true `y = k/x` inverse proportion. Smaller symbols appear sharper and more prominent as if farther away, while larger symbols are subtly diffused, amplifying the faux-parallax depth effect naturally.

### Depth & Topology
- **The Gaussian Ring**: A mouse-tracked Gaussian focus ring creates a "flashlight" effect. This ring features a **sine-wave breathing cycle** (`RING_BREATHE`) that dynamically expands and retracts the illumination radius for a living, organic feel.
- **Simplex Noise "Blobs"**: The focus ring is further modulated by **3D Simplex Noise**. This creates "organic gaps" or "blobs" in the illumination, preventing it from being a perfect circle and instead appearing like light filtering through a complex digital medium.
- **Parallax Emulation**: Symbols drift gently using a synchronized Brownian jitter and Lissajous-inspired oscillation. Coupled with varied opacities and varied font sizes, this creates a visual faux-parallax depth effect mimicking a vast spatial volume.

## 3. Interaction Design

- **Viewport Dynamics**: The canvas explicitly tracks the DOM `resize` event. To prevent clusters or gaps from forming dynamically during browser rescaling:
  - Outer bound checks dynamically constrain objects that fall outside horizontal or vertical limits.
- **Drift Loop**: When a symbol travels vertically off the `top` bound of the screen, its internal engine dynamically restarts its position at the absolute `bottom`, while instantly swapping out its underlying symbolic character against the active pools for continuous mutation.
- **Scroll-Corrected Mouse Tracking**: The `mousemove` handler uses `canvas.getBoundingClientRect()` to translate the raw viewport-relative `clientX/Y` into true canvas-space coordinates. It additionally applies `scaleX/scaleY` ratios to account for any CSS stretching of the canvas element. This mirrors the fix applied in `ThemeToggle.tsx` and ensures the Gaussian ring effect tracks the cursor correctly at any scroll depth.

### Scroll-Linked Physical Fly (Hero → Navbar)
The centrepiece interaction of the Home Page. As the user scrolls, the large hero "Slashdot /." branding physically **translates and scales** into the Navbar logo position via a fixed-coordinate lerper.

**Architecture:**
- **Dead Zone**: The first 40px of scroll have no effect. The fly only begins after this threshold.
- **`position: fixed` Switch**: At the exact moment travel begins, the hero text is detached from the document flow via `position: fixed` and locked to its current viewport coordinates.
- **High-Precision Lerp**: A `requestAnimationFrame` loop smoothly interpolates `smoothRatio` toward `targetRatio` (lerp factor: `0.12`). This drives the `translate3d` and `scale` values based on a pre-cached delta vector to the navbar logo's static position.
- **Continuous Logic**: The flying element **permanently serves as the navbar logo** on the Home route once the transition completes, avoiding visual snapping or optical resets.
- **Scroll Restoration**: Forced `manual` scroll restoration combined with `window.scrollTo(0,0)` on mount ensures the animation always begins from its intended origin.

**Tagline Fade**: The tagline block (`The Coding & Designing / Club of IISER Kolkata`) fades out over the first 30% of the scroll transition range.

## 4. Server-Side Content Hub Architecture
The primary `src/app/page.tsx` has been conceptually split to maximize performance and SEO structure.
- **`HomeHero.tsx` Extaction**: All high-performance client-side animations (canvas rendering, scroll-linked flying logo, and lerp loops) are fully self-contained within the isolated `<HomeHero />` client component.
- **Server Data Handlers**: The root page is explicitly a Server Component, injecting markdown and local data statically using Next.js build-time fetchers (`getMarkdownFiles`, `getEvents`, `getProjects`).
- **`HomeStrip` Ecosystem**: Content is surfaced in standardized, horizontally scrolling grid containers (`<HomeStrip />`). This features snap-mandatory scrolling, keeping previews strictly aligned with the rest of the site grid.
- **Sidelong Strip Architecture**:
    - **Gutter Strategy**: Employs a fixed `px-10` (40px) internal padding shift and `scroll-pl-10` snapping to ensure first-card alignment with headers while allowing shadows to bleed into the edges.
    - **Adaptive Stacking (Events)**: Utilizes a responsive `grid-rows` configuration. While showing 2 stacked rows on desktop to optimize card density, it automatically reverts to a single row on mobile devices to preserve readability and viewport height.
    - **Edge-Fade Optimization**: Implemented via `mask-image` with a 24px-40px horizontal gradient, explicitly buffered by the internal padding to prevent washing out the active/snapped card.
    - **Column-by-Column Navigation**: Scrolling (both manual and auto) moves precisely by one card width (plus gap) to ensure content is never partially cut off during transitions.

## 5. Technical Specifications

| Feature               | Implementation                                |
|-----------------------|-----------------------------------------------|
| **Primary Route**     | `src/app/page.tsx` (Server Component)         |
| **Hero Encapsulation**| `src/components/home/HomeHero.tsx`            |
| **Canvas Sub-Engine** | `src/components/home/HeroCanvas.tsx`         |
| **Data Fetching**     | Static/Server `getMarkdownFiles`, `getEvents`, `getProjects` |
| **Animation Loop**    | `requestAnimationFrame` (lerp-smoothed) inside `HomeHero` |
| **Fly Technique**     | `position: fixed` + viewport-space delta lerp |

## 6. Maintenance Guidelines

- **Adjusting Symbol Density**: Alter the `length: 400` inside `initCanvas` array setup to globally increase or decrease computation weight. Ensure you verify performance on mobile platforms when scaling above `800`.
- **Modifying Previews**: The home page fetches limited slices of data (e.g., `allEvents.slice(0, 8)` or `recentBlogs.slice(0, 9)`). Modify these splice constraints directly in `app/page.tsx` to expand or shrink the `HomeStrip` track widths.
