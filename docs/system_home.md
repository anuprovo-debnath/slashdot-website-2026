# Slashdot Home System (2026)

Technical reference for the Home Page (`src/app/page.tsx`) — the entry point of the Slashdot Website 2026. This document covers the interactive hero canvas, the scroll-fly brand morph, the horizontal content strips, and the page's server/client split.

---

## Table of Contents
1. [Architecture Overview](#1-architecture-overview)
2. [Hero Canvas — `HeroCanvas.tsx`](#2-hero-canvas--herocanvastsx)
3. [Scroll-Fly Brand Morph — `HomeHero.tsx`](#3-scroll-fly-brand-morph--homeherotsx)
4. [Horizontal Content Strips — `HomeStrip.tsx`](#4-horizontal-content-strips--homestrriptsx)
5. [Fun Zone Preview — `HomeFunPreview.tsx`](#5-fun-zone-preview--homefunpreviewtsx)
6. [Server/Client Split](#6-serverclient-split)
7. [Technical Specifications](#7-technical-specifications)
8. [Maintenance Guidelines](#8-maintenance-guidelines)

---

## 1. Architecture Overview

```
app/page.tsx  (Server Component)
│
├── <HomeHero />          ← Client: Canvas + fly animation
│   └── <HeroCanvas />    ← Client: 600-particle canvas engine
│
├── <HomeStrip title="Blog" ...>
│   └── <BlogCard /> × N
│
├── <HomeStrip title="Events" rows={2} ...>
│   └── <EventCard /> × N
│
├── <HomeStrip title="Projects" ...>
│   └── <ProjectCard /> × N
│
└── <HomeFunPreview />    ← Client: Fun Zone horizontal scroll preview
```

Data for each strip is fetched server-side in `app/page.tsx`:
- `getMarkdownFiles('content/blog')` → latest 9 blog posts
- `getEvents()` → up to 8 events (sorted by date desc)
- `getMarkdownFiles('content/projects')` → latest 6 projects

---

## 2. Hero Canvas — `HeroCanvas.tsx`

A full-screen `<canvas>` element that renders 600 floating symbols as an interactive particle field.

### Symbol Pool (`lib/symbols.ts`)
Characters drawn from three categories to represent the club's multi-disciplinary identity:
- **Mathematics**: `∫ ∂ ψ λ ∑ ∏ ∆ ∇ ∞ ≈ ⊕ ⊗`
- **Code / Syntax**: `</> => ptr* {} [] () && || == !=`
- **Chemistry / Structure**: `⏣ ⌬ ⎔`

### Color System
All symbols use a full-spectrum **vivid HSL palette** — each particle is assigned a random hue (0°–360°) at full saturation and 50% lightness:
```ts
this.hue = Math.random() * 360;
ctx.fillStyle = `hsl(${this.hue}, 100%, 50%)`;
```
This produces a vibrant, energetic field that contrasts with both light and dark site backgrounds.

### Depth — Inverse-Proportion Opacity
Particle opacity is inversely proportional to its size, simulating depth:
```ts
this.baseOpacity = (BASE_OPACITY_MAX * FONT_SIZE_MIN) / this.size;
```
- Small symbols (10px) → opacity ≈ 1.0 (appear sharp, close)
- Large symbols (24px) → opacity ≈ 0.42 (appear diffuse, distant)

### Movement Physics
Each symbol uses a **Lissajous / Brownian hybrid** motion:
- **Center drift (Brownian)**: `cx` and `cy` drift by `±BROWNIAN_JITTER` each frame.
- **Orbital oscillation**: Actual render position orbits around the center: `x = cx + cos(angle) * radius`.
- **Boundary wrap**: When a symbol exits the canvas bounds, it wraps to the opposite edge.

### Gaussian "Flashlight" Ring
The mouse creates a visible zone via a Gaussian function:
```ts
const gaussianOpacity = Math.exp(-Math.pow(r - r0, 2) / (2 * Math.pow(SIGMA, 2)));
```
- `r0` = base radius + `sin(time * BREATHE_SPEED) * BREATHE_AMPLITUDE` → the ring **breathes** in and out.
- `SIGMA` = controls the sharpness of the ring edge (wider = softer).

### Simplex Noise "Blobs"
A 3D Simplex Noise field modulates the Gaussian ring angularly, creating organic gaps:
```ts
const noiseVal = noise3D(
  Math.cos(theta) * NOISE_SCALE_ANGULAR,
  Math.sin(theta) * NOISE_SCALE_ANGULAR,
  time * NOISE_SPEED
);
const finalOpacity = gaussianOpacity * normalizedNoise * this.baseOpacity;
```
This means the ring is never a perfect circle — it has "blobs" and gaps that evolve over time.

### Adaptive Performance Culling
```ts
if (delta > FPS_DROP_THRESHOLD_MS) {
  slowFramesTracker++;
  if (slowFramesTracker > SLOW_FRAME_TOLERANCE && symbols.length > MIN_SYMBOLS) {
    symbols.length -= CULL_RATE;
  }
}
```
If sustained frame time exceeds 35ms (sub-30fps), symbols are removed in batches of 50, down to a minimum of 200.

### CONFIG Object
All tunable parameters are in a single exported `CONFIG` object at the top of `HeroCanvas.tsx`:

| Parameter | Default | Effect |
| :--- | :--- | :--- |
| `MAX_SYMBOLS` | 600 | Starting particle count |
| `MIN_SYMBOLS` | 200 | Floor during culling |
| `CULL_RATE` | 50 | How many removed per lag event |
| `RING_BASE_RADIUS` | 160 | Default flashlight radius |
| `RING_BREATHE_AMPLITUDE` | 20 | Ring pulse range |
| `RING_BREATHE_SPEED` | 1.2 | Pulse cycle speed |
| `RING_SIGMA` | 60 | Ring edge softness |
| `NOISE_INTENSITY` | 0.9 | Blob intensity |
| `NOISE_SPEED` | 0.4 | Blob evolution speed |

---

## 3. Scroll-Fly Brand Morph — `HomeHero.tsx`

The centrepiece interaction of the Home Page. The large "Slashdot /." hero text physically translates and scales into the Navbar logo as the user scrolls.

### How It Works

**Phase 1 — Dead Zone (0–40px scroll)**
No movement. The 40px dead zone prevents accidental triggers from micro-scrolls.

**Phase 2 — Position Computation (once, on first movement)**
The moment `smoothRatio` first exceeds `0.001`, `switchToFixed()` is called **once**:
1. Captures the hero element's current `getBoundingClientRect()` (viewport coordinates).
2. Detaches the element from document flow: `position: fixed; left: Xpx; top: Ypx; width: Wpx`.
3. Computes the fixed delta vectors to the Navbar logo: `fixedDx`, `fixedDy`, `fixedScale`.
4. These values **never change** — both elements are now `position: fixed` in the same viewport coordinate space.

**Phase 3 — rAF Lerp Loop**
```ts
smoothRatio += (targetRatio - smoothRatio) * 0.12;  // LERP factor

const dx = fixedDx * smoothRatio;
const dy = fixedDy * smoothRatio;
const s  = 1 + (fixedScale - 1) * smoothRatio;

heroTextRef.current.style.transform = `translate(${dx}px, ${dy}px) scale(${s})`;
```
`targetRatio` is set by the scroll event; `smoothRatio` follows behind at 12% per frame, producing the elastic, decelerating feel.

**Phase 4 — Permanent Parking**
When `smoothRatio` reaches 1.0, the hero text is positioned exactly over the Navbar logo. On the Home route, the Navbar logo is permanently `opacity: 0; visibility: hidden` — the hero text **is** the Navbar logo. There is no swap or crossfade.

### Scroll Lock
While the `LoadingScreen` is active, `document.documentElement.style.overflow = 'hidden'` prevents scrolling. This is released on the `slashdot:loader-fade-complete` event.

### Tagline Fade
```ts
taglineEl.style.opacity = String(Math.max(0, 1 - smoothRatio / 0.3));
```
The "The Coding & Designing / Club of IISER Kolkata" tagline fades to zero opacity over the first 30% of the transition range.

---

## 4. Horizontal Content Strips — `HomeStrip.tsx`

A reusable `<section>` component for horizontally scrollable card grids.

### Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `title` | string | — | Section header text |
| `subtitle` | string | — | Secondary label (uppercase tracking) |
| `viewAllLink` | string | — | Route for the "View All" button |
| `children` | ReactNode | — | Card components to scroll through |
| `rows` | number | `1` | Set to `2` for the Events strip (stacked rows) |
| `columnLayout` | string | `auto-cols-[33.333%]` | Responsive column width classes |
| `autoScrollInterval` | number | `5000` | ms between automatic scrolls (0 = none) |

### Auto-Scroll Behavior
An `IntersectionObserver` watches the strip. When it's at least 10% visible:
- A `setInterval` runs at `autoScrollInterval` ms.
- Each tick scrolls exactly one card width (`firstChild.offsetWidth + 24px gap`).
- When the end is reached, it wraps back to the start smoothly.
- Pauses while `isHovered` is `true` (mouse entered or pointer down).

### Edge Fade Masks
An inline `maskImage` gradient creates a 24px transparent zone on both left and right edges:
```ts
maskImage: "linear-gradient(to right, transparent, black 24px, black calc(100% - 24px), transparent)"
```
This is applied inline (not via CSS class) to avoid Tailwind purging issues.

### Scroll Snapping
The inner grid uses `snap-x snap-mandatory` with `scroll-pl-10` (40px left scroll padding) so cards always snap into a clean, aligned position regardless of manual scroll.

### Manual Navigation
Left (`‹`) and right (`›`) arrow buttons compute the exact card width + gap offset and call `scrollBy()` with smooth behavior.

---

## 5. Fun Zone Preview — `HomeFunPreview.tsx`

A dedicated horizontal scroll preview section for the Fun Zone. Uses a similar mask-fade technique with touch drag support. On mobile, it shows meme cards in a single row. On desktop, it shows a 2-column grid of categories (Memes, Games, Art) with a "Explore Fun Zone" CTA.

---

## 6. Server/Client Split

| Component | Rendering | Reason |
| :--- | :--- | :--- |
| `app/page.tsx` | Server | Reads filesystem, passes data as props |
| `HomeHero` | Client | Canvas + scroll listeners + rAF |
| `HeroCanvas` | Client | Canvas 2D API |
| `HomeStrip` | Client | Intersection Observer + setInterval |
| `BlogCard`, `EventCard`, `ProjectCard` | Client | `localStorage` visited state |

---

## 7. Technical Specifications

| Property | Value |
| :--- | :--- |
| **Canvas Z-Index** | `z-index: -10` (behind all content) |
| **Hero Text Z-Index** | `z-[60]` |
| **Lerp Factor** | `0.12` |
| **Dead Zone** | `40px` scroll |
| **Transition Range** | `45% of viewport height` |
| **Scroll Restoration** | `history.scrollRestoration = 'manual'` |
| **Scroll Lock Event** | `slashdot:loader-fade-complete` |

---

## 8. Maintenance Guidelines

- **Symbol Density**: Decrease `MAX_SYMBOLS` in `CONFIG` to improve low-end device performance. Values above 800 may cause frame drops on mobile.
- **Adding a Strip**: Fetch data in `app/page.tsx` (Server Component) and pass it to a new `<HomeStrip>` block. Card components must be Client Components if they use `localStorage`.
- **Home Data Slices**: The current data slices are `blog.slice(0, 9)`, `events.slice(0, 8)`, `projects.slice(0, 6)`. Adjust these to change strip length.
- **Fly Animation Timing**: To adjust the lerp smoothness, change `LERP = 0.12` in `HomeHero.tsx`. Higher = faster response, lower = more elastic/floaty.
