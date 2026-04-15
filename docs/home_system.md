# Slashdot Home System (2026)

This document outlines the architecture, visual design patterns, and implementation details of the global Home Page for the Slashdot Website 2026.

## 1. Core Philosophy

The Slashdot Home Page is the central entry point of the platform, designed to deliver maximum visual impact while maintaining optimal performance. It serves as an immediate introduction to the club's identity—blending technical rigour with creative design via a highly interactive hero section that establishes the "Theme Parity" used throughout the rest of the application.

## 2. Visual Architecture

### Hero Canvas Background Layer (`HeroCanvas.tsx`)
- **Symbol Density**: Precisely calibrated to 600 floating symbols ensuring a rich textual texture without overwhelming system resources.
- **Symbol Pools**: Characters are dynamically pooled from three distinct categories symbolizing the diverse multidisciplinary nature of the club:
  - **Mathematics**: `∫, ∂, ψ, λ, ∑, ∏, ∆, ∇, ∞, ≈, ⊕, ⊗`
  - **Code/Syntax**: `</>, =>, ptr*, {}, [], (), &&, ||, ==, !=, ;`
  - **Chemistry/Nodes**: `⏣, ⌬, ⎔`
- **Theme Awareness**: The floating symbols perfectly integrate into the site's dark/light modes by dynamically mapping to the CSS variable `--color-primary`.
- **Depth-Linked Opacity (Inverse Proportion)**: Each symbol's `baseOpacity` is calculated as `(MAX_OPACITY × MIN_SIZE) / size`, a true `y = k/x` inverse proportion. Smaller symbols appear sharper and more prominent as if farther away, while larger symbols are subtly diffused, amplifying the faux-parallax depth effect naturally.

### Depth & Topology
- **Layering System**: The canvas rests immutably in a specialized absolute layer (`z-[-1]`) ensuring that all interactive elements, typographic headers, and CTA buttons sit structurally floating on top (`z-10`).
- **Parallax Emulation**: Symbols drift gently upwards (`speedY` randomized between `0.1` and `0.5`). Coupled with varied opacities (`0.1` to `0.6`) and varied font sizes (`10px` to `24px`), this creates a visual faux-parallax depth effect mimicking a vast spatial volume.

## 3. Interaction Design

- **Viewport Dynamics**: The canvas explicitly tracks the DOM `resize` event. To prevent clusters or gaps from forming dynamically during browser rescaling:
  - Outer bound checks dynamically constrain objects that fall outside horizontal or vertical limits.
- **Drift Loop**: When a symbol travels vertically off the `top` bound of the screen, its internal engine dynamically restarts its position at the absolute `bottom`, while instantly swapping out its underlying symbolic character against the active pools for continuous mutation.
- **Scroll-Corrected Mouse Tracking**: The `mousemove` handler uses `canvas.getBoundingClientRect()` to translate the raw viewport-relative `clientX/Y` into true canvas-space coordinates. It additionally applies `scaleX/scaleY` ratios to account for any CSS stretching of the canvas element. This mirrors the fix applied in `ThemeToggle.tsx` and ensures the Gaussian ring effect tracks the cursor correctly at any scroll depth.

### Scroll-Linked Physical Fly (Hero → Navbar)
The centrepiece interaction of the Home Page. As the user scrolls, the large hero "Slashdot" text physically translates and scales into the Navbar logo position, creating a cinematic brand flyaway.

**Architecture:**
- **Dead Zone**: The first 40px of scroll have no effect. The fly only begins after this threshold.
- **`position: fixed` Switch**: The instant `smoothRatio` exceeds 0, the hero text element is detached from the document flow via `position: fixed`, locked to its current exact viewport coordinates. This is the key to jitter-free animation.
- **Stable Delta Vectors**: `fixedDx`, `fixedDy`, and `fixedScale` are computed once. Since both the hero (now fixed) and the navbar (`position: fixed`) live in viewport space, these deltas never change.
- **Permanent Parking (No Swap)**: Unlike technical routes where an optical swap occurs, the home page flying element now **permanently serves as the navbar logo** once the transition completes. The static navbar logo is kept hidden on this route to maintain visual continuity.
- **Teal Dots Sync**: The flying text explicitly mimics the Navbar branding by including a `/.` suffix in the primary theme color, ensuring perfect identity parity when parked.
- **Lerp Loop**: A continuous `requestAnimationFrame` loop lerps `smoothRatio` toward `targetRatio` (set by the scroll event) using a factor of `0.12`.
- **Scroll Restoration**: Forced `manual` scroll restoration combined with `window.scrollTo(0,0)` on mount ensures the animation always begins from its intended origin, even after a page reload.

**Tagline Fade**: The tagline block (`The Coding & Designing / Club of IISER Kolkata`) fades out over the first 30% of the scroll transition range.

## 4. Server-Side Content Hub Architecture
The primary `src/app/page.tsx` has been conceptually split to maximize performance and SEO structure.
- **`HomeHero.tsx` Extaction**: All high-performance client-side animations (canvas rendering, scroll-linked flying logo, and lerp loops) are fully self-contained within the isolated `<HomeHero />` client component.
- **Server Data Handlers**: The root page is explicitly a Server Component, injecting markdown and local data statically using Next.js build-time fetchers (`getMarkdownFiles`, `getEvents`, `getProjects`).
- **`HomeStrip` Ecosystem**: Content is surfaced in standardized, horizontally scrolling grid containers (`<HomeStrip />`). This features snap-mandatory scrolling, keeping previews strictly aligned with the rest of the site grid.

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
