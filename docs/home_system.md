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

### Loading Screen Optical Illusion
- **Bypass Mechanism**: When users load natively into `/` (Home), the standard `LoadingScreen` flight sequence (where the logo scales and moves into the Navbar) is intentionally bypassed.
- **Seamless Fade**: The `LoadingScreen` ghost text scales perfectly to match the static `hero-logo-pos` on the Home Page. When typing completes, the background strictly fades to transparent while the logo opacity is zeroed out, creating an imperceptible crossfade illusion into the Hero section's static typography.
- **Native Scroll Lock Management**: Scrolling is natively hijacked explicitly by `page.tsx`. To guarantee no background scrolling occurs *during* the transparency fade, `page.tsx` captures the `slashdot:loader-fade-complete` event dispatched by the loader and extends the `overflow: hidden` lock for exactly 100ms *after* visual completion before returning control to the user.

## 4. Technical Specifications

| Feature               | Implementation                                |
|-----------------------|-----------------------------------------------|
| **Component Layout**  | `src/app/page.tsx`                           |
| **Canvas Sub-Engine** | `src/components/home/HeroCanvas.tsx`         |
| **Rendering Strategy**| Client Component (`"use client"`) for Scroll Lock |
| **Animation Loop**    | `requestAnimationFrame`                       |
| **Class Abstraction** | `BackgroundSymbol` Class (`x, y, char, vec`)  |
| **Viewport Control**  | Native DOM (`document.documentElement.style`) |

## 5. Maintenance Guidelines

- **Adjusting Symbol Density**: Alter the `length: 400` inside `initCanvas` array setup to globally increase or decrease computation weight. Ensure you verify performance on mobile platforms when scaling above `800`.
- **Primary Color Binding**: The canvas fetches its tint via `getComputedStyle(document.documentElement).getPropertyValue('--color-primary')`. If the Next.js Theme architecture significantly shifts away from root-attached CSS variables, this lookup must be refactored to fetch hex strings explicitly.
- **Modifying Drift Logic**: The exact floating speed vectors are instantiated statically inside the `constructor()` of `BackgroundSymbol`. For different motions (e.g. falling, diagonal wind), map both `this.x` and `this.y` inside `update()`.
