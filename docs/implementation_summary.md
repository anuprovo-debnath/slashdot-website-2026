# Slashdot Website Implementation Summary

This document is the architectural "Source of Truth" for the Slashdot Website 2026. It is intended for future maintainers and contributors to understand the **why** behind key decisions, the sequence of refinements made during development, and the exact mechanisms of complex systems.

---

## Table of Contents

0. [Key Architecture Notes (READ FIRST)](#0-key-architecture-notes-read-first)
1. [Design System & Theming](#1-design-system--theming)
2. [Circular Theme Toggle (View Transitions API)](#2-circular-theme-toggle-view-transitions-api)
3. [Navbar & Navigation Fixes](#3-navbar--navigation-fixes)
4. [Typography — Arista Pro & Fallback Strategy](#4-typography--arista-pro--fallback-strategy)
5. [Deployment (GitHub Pages)](#5-deployment-github-pages)
6. [Critical Maintainer Gotchas](#6-critical-maintainer-gotchas)
7. [Fun Zone & Horizontal Grid Architecture](#7-fun-zone--horizontal-grid-architecture)
8. [Footer Architecture](#8-footer-architecture)
9. [Boot Sequence & Loading Morphology](#9-boot-sequence--loading-morphology)
10. [Hero Canvas Improvements](#10-hero-canvas-improvements)
11. [Global Page Architecture (PageHero)](#11-global-page-architecture-pagehero)
12. [Touch-Parity System (Mobile UX)](#12-touch-parity-system-mobile-ux)
13. [Homepage Rhythm & Section Spacing](#13-homepage-rhythm--section-spacing)
14. [Interactive Calendar Enhancements](#14-interactive-calendar-enhancements)
15. [Events Page Mobile Layout Overhaul](#15-events-page-mobile-layout-overhaul)
16. [Loading Screen Animation Refinement](#16-loading-screen-animation-refinement)
17. [Live Status Hub & Navbar Sync](#17-live-status-hub--navbar-sync)
18. [Real-Time Event Status Engine](#18-real-time-event-status-engine)
19. [Global Search (Ctrl+K)](#19-global-search-ctrlk)
20. [Asset Pathing — GitHub Pages Subpath](#20-asset-pathing--github-pages-subpath)

---

## 0. Key Architecture Notes (READ FIRST)

| Concern | Decision |
| :--- | :--- |
| **Framework** | Next.js 15 (App Router, Server Components first) |
| **Styling** | Tailwind CSS v4 — no `tailwind.config.js`; tokens in `globals.css` `@theme` block |
| **Deployment** | Static Export (`output: 'export'`) to GitHub Pages at `/slashdot-website-2026/` |
| **Theming** | `next-themes` (class strategy: `.dark`) + View Transitions API |
| **Search** | Fuse.js, pre-indexed at build time, no API calls at runtime |
| **Content** | MDX + gray-matter for all site sections (blog, events, projects, funzone, team) |
| **Icons** | Lucide React (UI chrome) + React Icons FA6 (socials, brands) |

---

## 1. Design System & Theming

### CSS Variable Strategy
All design tokens are defined in `src/app/globals.css` using native CSS custom properties and mapped into Tailwind via `@theme inline`:

```css
:root {
  --color-primary: #0291B2;
  --color-primary-rgb: 2, 145, 178;
  --color-bg: #ffffff;
  --color-text: #171717;
  --color-live: #ef4444;
  --color-live-rgb: 239, 68, 68;
  --color-upcoming: #10b981;
}

.dark {
  --color-bg: #262626;
  --color-text: #ffffff;
  /* primary and live unchanged */
}

@theme inline {
  --color-primary: var(--color-primary);
  --color-live: var(--color-live);
  --color-upcoming: var(--color-upcoming);
  --font-heading: var(--font-brand);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}
```

**Rule**: Never hardcode a hex color in component JSX. Always use `var(--color-primary)` or Tailwind's mapped utility (`text-primary`, `bg-live`, etc.).

### Class-Based Dark Mode
`next-themes` is configured with `attribute="class"`, applying the `.dark` class to `<html>`. Tailwind v4 uses `@custom-variant dark (&:where(.dark, .dark *))` to recognize this class across all nested elements.

---

## 2. Circular Theme Toggle (View Transitions API)

The `ThemeToggle` component (`src/components/ThemeToggle.tsx`) produces a circular clip-path reveal animation.

### Algorithm
1. On click, measure the toggle button's screen coordinates (`e.clientX`, `e.clientY`).
2. **Mobile Bar Correction**: Create a temporary `position: fixed; height: 100lvh` probe element. Compare its `getBoundingClientRect().height` with `visualViewport.height`. The difference is the mobile browser bar height (`barHeight`). Add this to `e.clientY` to shift the circle's origin into the snapshot layer (below the browser chrome).
3. Calculate `endRadius = Math.hypot(documentWidth, lvh)` — the diagonal of the full snapshot, guaranteeing the circle always covers the entire screen.
4. Call `document.startViewTransition(() => flushSync(() => setTheme(nextTheme)))`.
5. On `transition.ready`, animate `::view-transition-new(root)` with a `clipPath` from `circle(0px at X Y)` to `circle(endRadiusPx at X Y)` over 1000ms.

### CSS Layer
```css
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
  height: 100%; width: 100%;
  inset: 0;
  object-fit: none;
}
::view-transition-group(root) { animation-duration: 0s; }
::view-transition-old(root) { z-index: 1; }
::view-transition-new(root) { z-index: 2; }
```

**Why `flushSync`?** Without it, `document.startViewTransition` captures the DOM **before** React's state update, making the transition a no-op (old→old).

### Transition Guard in Navbar
The Navbar's scroll progress `useEffect` checks `isTransitioningRef.current` before updating the `scrollProgress` state. This prevents the progress bar from flickering to 0% during the view transition snapshot phase.

---

## 3. Navbar & Navigation Fixes

- **Fixed Positioning**: Migrated from `sticky top-0` to `fixed top-0 left-0 right-0` to prevent detachment flickers caused by mobile address bar height changes during scroll.
- **Glassmorphism**: Always-on `bg-[var(--color-bg)]/80 backdrop-blur-md` — the earlier scroll-triggered conditional was removed for cleaner behavior.
- **Scroll Progress Bar**: 2px bottom-edge bar tracking `(scrollY / documentHeight) * 100`. Uses `window.visualViewport?.height` for correct mobile calculation.
- **Synchronized Anchor Navigation**: When "JOIN" is clicked in the mobile drawer, it waits 300ms for `isOpen: false` animation to complete before calling `scrollIntoView`, preventing layout jumps from the collapsing menu.
- **Logo Reveal Handoff**: On sub-pages, the logo reveals via a CSS `logo-char-reveal` keyframe (`step-end`, character by character) triggered by the `slashdot:loading-ready` event. Each character has a `--i` CSS variable for stagger timing.
- **Fail-Safe Timer**: If `slashdot:loading-ready` never fires (e.g., nav error), an 8-second `setTimeout` forces `setIsLoaded(true)` to prevent a permanently invisible navbar.
- **Hardware Acceleration**: `transform-gpu` is applied to the Navbar. **NEVER remove this.** It forces Chrome to keep the nav rendered during View Transition snapshots.

---

## 4. Typography — Arista Pro & Fallback Strategy

### Font Face Registration
`AristaProBold.ttf` is loaded from the GitHub Pages-prefixed path:

```css
@font-face {
  font-family: 'Arista Pro';
  src: url('/slashdot-website-2026/fonts/AristaProBold.ttf') format('truetype');
  font-weight: bold;
  font-display: swap;
  unicode-range: U+0000-002F, U+003A-003F, U+0041-10FFFF;
}
```

The `unicode-range` **excludes** `U+0030-0039` (digits 0–9) and `U+0040` (`@`). This is because Arista Pro renders these glyphs as stylized block letters that are illegible in context.

### Fallback Rule
A second `@font-face` block for the same `font-family: 'Arista Pro'` covers exactly those excluded characters, mapping them to system sans-serif fonts:

```css
@font-face {
  font-family: 'Arista Pro';
  src: local('Inter Bold'), local('Segoe UI Bold'), local('Arial Bold'), local('sans-serif');
  font-weight: bold;
  unicode-range: U+0030-0039, U+0040;
}
```

This means **dates, version numbers, and email `@` symbols** in any `font-heading` element automatically use Inter/Segoe, while all letters still use Arista Pro — with zero JavaScript and zero font-flash.

### Usage
Use `font-heading` (mapped to `var(--font-brand)`) for any Arista Pro text. Standard body text uses `font-sans` (Geist Sans) and `font-mono` (Geist Mono).

---

## 5. Deployment (GitHub Pages)

### Configuration (`next.config.ts`)
```ts
const nextConfig = {
  output: 'export',
  basePath: '/slashdot-website-2026',
  assetPrefix: '/slashdot-website-2026',
  images: { unoptimized: true },
  trailingSlash: true,
};
```

### Workflow
`.github/workflows/deploy.yml` triggers on push to `main`:
1. `npm ci`
2. `npm run build` (runs `prebuild` → search index generation, then `next build`)
3. Uploads `out/` directory to GitHub Pages

### Special Files in `public/`
- `.nojekyll` — Prevents GitHub Pages from running Jekyll, which would strip `_next` directories.
- `search-index.json` — Generated at build time. Do not edit manually.

### Path Resolution Rule
Because of the `basePath`, all `<Link href="/blog">` and `<Image src="/image.jpg">` components work correctly — Next.js prepends the base path automatically. However, **non-Next.js assets** (fonts, direct `<img>` tags, CSS `url()`) need the full path: `/slashdot-website-2026/fonts/...`.

---

## 6. Critical Maintainer Gotchas

> [!WARNING]
> Read this section before making any structural changes.

### 1. `transform-gpu` on Navbar
The Navbar uses `transform-gpu`. **Do not remove this.** It forces Chrome to keep the nav composited during View Transition snapshots. Without it, the navbar vanishes during theme toggle.

### 2. Mobile Android Viewport
The `overflow-x: hidden` + `width: 100%` lock on both `html` and `body` in `globals.css` prevents content from bleeding horizontally on Chrome Android. Complex animations or absolute-positioned elements that exceed viewport width would otherwise push the page off-center on mobile.

### 3. `flushSync` in Transitions
Every `document.startViewTransition` call that wraps a React state update **must** use `flushSync`. Without it, the transition captures stale DOM.

### 4. Tailwind v4 Config
There is **no `tailwind.config.js`**. All customization is in `globals.css` under the `@theme inline` block. Adding new colors must go there.

### 5. Search Index is Generated
`public/search-index.json` is auto-generated. Manually editing it is pointless — the next `npm run dev` or `npm run build` will overwrite it.

### 6. Client Components & `fs`
Never import `src/lib/events.ts` (uses Node.js `fs`) inside a Client Component. Use `src/lib/eventUtils.ts` for time calculations, and receive data via props from Server Components.

---

## 7. Fun Zone & Horizontal Grid Architecture

- **40px Offset Pattern**: Internal padding `px-10` aligns the first card with site margins while `scroll-pl-10` syncs the snap point.
- **`snap-x snap-mandatory`**: Cards always snap cleanly, even after manual freehand scroll.
- **`hide-scrollbar` + `mask-horizontal-faded`**: Provides clean edge gradients and hidden scrollbars.\
- **Game Card Redirect**: Full card surface redirects to external URL (`target="_blank"`), avoiding sub-route maintenance.

---

## 8. Footer Architecture

- **24-Column Grid (7:10:7 Ratio)**: Precise layout control. The central Links Hub (10/24) gets exactly 41.6% width.
- **CSS Variable Brand Colors**: `style={{ '--brand-color': platform.color }}` + `hover:bg-[var(--brand-color)]` — one class set, N different colors based on `style` attribute.
- **Instagram Gradient Exception**: Uses `hoverClass` override with `hover:bg-gradient-to-tr` since a single brand color can't express the 3-stop gradient.
- **Mobile Reorder**: CSS `order-` utilities reorder sections (Links first, Social second, Brand third) for mobile-first information hierarchy.

---

## 9. Boot Sequence & Loading Morphology

The `LoadingScreen` executes a two-stage cinematic sequence:

### Stage 1 — Terminal Emulation
1. The `/` prompt appears.
2. A JS-driven progressive dot sequence plays: `/ → / . → / .. → / ...` (250ms/frame, minimum 2 full cycles).
3. Dot sequence terminates at `/ .`.
4. Character-by-character typing of "Welcome to" (40ms/char).
5. Character-by-character typing of "Slashdot" (60ms/char).
6. Tagline fades in.

### Stage 2 — Brand Flight
- **Home Page**: The brand text performs a cross-fade that optically aligns with the `HomeHero` component's matching text layout. The background transparency creates the illusion of the loader "becoming" the hero.
- **Sub-Pages**: The brand text physically translates via JS `transform` to the Navbar logo position (`final-logo-pos`). `getBoundingClientRect()` is used to compute the vector.

### Session Awareness
- **Skip Key**: `slashdot_last_visit` in `localStorage`. Within 10 minutes, the full animation is skipped.
- **Skip Path**: Immediately dispatches `slashdot:loading-ready` (with `skipped: true`) and `slashdot:loader-fade-complete`, then unmounts.
- **Fail-Safe**: Navbar has an 8-second safety timer to force visibility if the event never arrives.

### Ligature Suppression on Dots
```ts
element.style.fontVariantLigatures = 'none';
element.style.fontFeatureSettings = '"liga" 0';
element.style.letterSpacing = '0.1em';
```
Prevents `...` from collapsing into `…` (the Unicode ellipsis glyph).

---

## 10. Hero Canvas Improvements

### Depth-Linked Opacity (Inverse Proportion)
```js
baseOpacity = (BASE_OPACITY_MAX × FONT_SIZE_MIN) / size  // y = k/x
```
- 10px symbol → opacity 1.0 (sharp, near)
- 24px symbol → opacity ~0.42 (diffuse, far)

### Mouse Tracking with DPI Correction
```js
mouseX = (e.clientX - rect.left) * (canvas.width / rect.width);
mouseY = (e.clientY - rect.top) * (canvas.height / rect.height);
```
`scaleX/scaleY` ratios handle CSS layout stretching on high-DPI screens.

### Performance Culling Engine
- Monitors frame delta; if it exceeds 35ms for 10 consecutive frames, reduces symbol count by 50.
- Floor: 200 symbols. Ceiling: 600 symbols.
- Particles respawn on `useEffect` mount; changing culling parameters takes effect on full page reload only.

---

## 11. Global Page Architecture (PageHero)

`src/components/ui/PageHero.tsx` is a thin client-side wrapper that renders `HeroCanvas` on sub-pages (Blog, Team, Events, etc.):

- **Non-Distorted Canvas**: `HeroCanvas` renders at full `100vw × 100vh`; the parent clips it with `overflow: hidden`. This ensures symbol sizes are identical to the home page, regardless of the sub-page's hero height.
- **Client Wrapper**: Allows deep pages to remain Server Components for SEO while still having an animated background.
- **Opacity**: Sub-page heroes use `opacity={100}` vs the home page's `80`.

---

## 12. Touch-Parity System (Mobile UX)

### Problem
On touch devices:
- CSS `:hover` never fires (no mouse).
- `:active` releases at `touchend`, before the click event fires.
- On Android, Next.js `router.push()` unmounts the page before any repaint.

### Solution — `TouchNavDelay.tsx`
A global null-render Client Component mounted in `layout.tsx`:

1. **Detection**: Only activates on `(hover: none) and (pointer: coarse)` devices.
2. **`touchstart` handler**: Finds the closest `<a>` → its closest `.group` ancestor → adds `.touch-nav-active`.
3. **`click` handler (capture phase)**: On Android (`/Android/i` UA check), intercepts click, calls `e.preventDefault()`, delays `router.push()` by 250ms.
4. **Cleanup**: Removes `.touch-nav-active` after the delay + 150ms buffer.

### Global CSS Mapping (`globals.css`)
```css
@media (hover: none) and (pointer: coarse) {
  .hover\:-translate-y-2:active,
  .group:active .group-hover\:-translate-y-2,
  .group.touch-nav-active .group-hover\:-translate-y-2 {
    --tw-translate-y: -0.5rem;
    transform: translateY(var(--tw-translate-y));
  }
  /* ... ~40 more rules covering all hover effects ... */
}
```

Coverage includes: card lifts, image zooms, title color changes, ring glows, button tints, border colors, grayscale removal, social brand colors, Instagram gradient, timeline scale/translate effects, search overlay chevron shift.

**Key benefit**: Write standard `hover:` Tailwind classes in components. Touch parity is handled globally — zero per-component special cases.

---

## 13. Homepage Rhythm & Section Spacing

- **Uniform Vertical Margin**: All `HomeStrip` and `HomeFunPreview` sections use `my-8` (32px top+bottom).
- **Max-Width Lock**: `max-w-5xl` with `px-10` on all strips — headers, buttons, and card edges are pixel-perfectly aligned.
- **Auto-Scroll**: `IntersectionObserver` starts auto-scrolling only when a strip is 10%+ visible. Pauses on hover/pointer-down.

---

## 14. Interactive Calendar Enhancements

### Week View Mode
- Renders 7 day-pills for the current week.
- Automatically advances as the user scrolls to events on different dates.
- Resets to today on scroll-to-top (`scrollY < 100`).
- Mobile default: calendar mounted in `initialViewMode: 'week'`.

### Year View (GitHub Heatmap)
- 3×4 month grid with intensity-based coloring:
  - 0 events → transparent
  - 1–2 events → `bg-primary/20`
  - 3 events → `bg-primary/40`
  - 4+ events → `bg-primary/80`
- Clicking a month navigates to that month in month view.

### Props API

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `initialViewMode` | `'month' \| 'year' \| 'week'` | `'month'` | Starting view |
| `showViewToggle` | `boolean` | `true` | Show/hide mode switcher |
| `className` | `string` | `""` | Extra wrapper classes |

### Performance
Wrapped in `React.memo` — prevents re-render from parent scroll events that are frequent but don't affect calendar data.

---

## 15. Events Page Mobile Layout Overhaul

### Mobile Calendar (Fixed Overlay)
A separate `mobileCalendarRef` element is rendered as `position: fixed` at `top: 89px` (below Navbar).
- **GPU Compositing**: `translate3d(0, Y, 0)` instead of `top: Y` to promote to compositor layer.
- `will-change: transform` pre-allocates GPU memory.

### Scroll Architecture Branch
`handleScroll` branches on `window.innerWidth`:
- **Desktop (≥768px)**: 3-phase floating sidebar (Right → Expansion → Left Dock).
- **Mobile (<768px)**: Only drives `mobileCalendarRef` via `requestAnimationFrame`.

### Search Bar — 3-Phase Morphing
| Phase | Trigger | Width | Placeholder |
| :--- | :--- | :--- | :--- |
| Right | `scrollY < threshold1` | ~40% | "Search events..." |
| Full Width | `threshold1 < scrollY < threshold2` | 100% | "Search events, workshops, or use #tags..." |
| Left Dock | `scrollY > threshold2` | Minimized | "Search..." |

### Scroll-to-Top Reset
When `scrollY < 100`, `activeDate` resets to today and the calendar centers on the current week.

---

## 16. Loading Screen Animation Refinement

### Progressive Dot Sequence
Frame-perfect JS-driven animation:
- **Frames**: `/ ` → `/ .` → `/ ..` → `/ ...`
- **Frame duration**: 250ms
- **Minimum cycles**: 2 full cycles (2500ms total)
- **Terminal state**: Always terminates at `/ .` before advancing

### Ligature Suppression
```ts
style.fontVariantLigatures = 'none';
style.fontFeatureSettings = '"liga" 0';
style.letterSpacing = '0.1em';
```

### Session Timing
- Return window: **10 minutes** (tunable via `TIME_SKIP` constant in `LoadingScreen.tsx`)
- Storage key: `slashdot_last_visit`

---

## 17. Live Status Hub & Navbar Sync

### The 30s Heartbeat
```ts
const checkLiveStatus = async () => {
  const res = await fetch('/slashdot-website-2026/search-index.json', { cache: 'no-store' });
  const data: SearchIndexItem[] = await res.json();
  const isLive = data
    .filter(item => item.type === 'event')
    .some(event => getEventStatus(event) === 'Live');
  setHasLiveEvent(isLive);
};
setInterval(checkLiveStatus, 30_000);
```

### Visual Output
- **Desktop Navbar**: `animate-ping` red dot over the "Events" link when `hasLiveEvent === true`.
- **Mobile**: 2.5px red overlay dot on the hamburger icon.
- **Events Calendar**: `bg-live/20` highlight on active dates in `InteractiveCalendar`.

---

## 18. Real-Time Event Status Engine

**File**: `src/lib/eventUtils.ts` (client-safe, no Node.js imports)

### `getEventStatus(frontmatter)` → `'Live' | 'Upcoming' | 'Past'`

#### Option A — Continuous Range
`date: "2026-04-17 - 2026-04-19"` + single `time: "09:00 - 22:00 IST"`.
- Parses start as Day 1 at 09:00 IST and end as Day 3 at 22:00 IST.
- Stays **Live** continuously between those bounds.

#### Option B — Custom Schedule (Oscillating)
```yaml
schedule:
  - { date: "2026-04-17", time: "09:00 - 18:00 IST" }
  - { date: "2026-04-18", time: "10:00 - 20:00 IST" }
```
- Returns **Live** only during active session windows.
- Returns **Upcoming** between sessions (e.g., overnight).
- Returns **Past** only after ALL sessions end.

### IST Parsing
```ts
const isoStr = tz === 'IST'
  ? `${datePart}T${timePart}:00+05:30`
  : `${datePart}T${timePart}:00Z`;
```
The explicit `+05:30` offset ensures correct behavior for users in any timezone.

### `isDayInEvent(targetDateStr, frontmatter)` → `boolean`
Used by `InteractiveCalendar` to highlight days that belong to an event. Handles both continuous ranges and schedule arrays.

> [!CAUTION]
> Never import `eventUtils.ts` in Server Components that also import `events.ts`. Keep them separate — `events.ts` uses Node.js `fs`; `eventUtils.ts` is browser-safe.

---

## 19. Global Search (Ctrl+K)

Covered in detail in [`docs/system_search.md`](./system_search.md). Key points:

- **Trigger**: `Ctrl+K` / `Cmd+K` global key listener in `SearchOverlay.tsx`. Also dispatched as `slashdot:open-search` custom event from Navbar search button, `TagPill`, `AuthorPill`, and `TypePill`.
- **Index**: Static `public/search-index.json`, fetched once at first open.
- **Engine**: Fuse.js, lazy-loaded (`import('fuse.js')`) on first overlay open.
- **Scopes**: `blog/`, `events/`, `projects/`, `funzone/`, `team/`, `all/`.
- **Prefixes**: `#Tag`, `@Author`, `type:Category`.
- **History**: 3 entries, FIFO, `localStorage`.

---

## 20. Asset Pathing — GitHub Pages Subpath

| Context | Correct Approach |
| :--- | :--- |
| `<Link href="/blog">` | ✅ Next.js prepends `basePath` automatically |
| `<Image src="/images/foo.jpg">` | ✅ `next/image` prepends `basePath` automatically |
| `url('/fonts/AristaProBold.ttf')` in CSS | ❌ Must manually write `/slashdot-website-2026/fonts/...` |
| `<img src="/images/foo.jpg">` (raw HTML) | ❌ Must manually write `/slashdot-website-2026/images/...` |
| `fetch('/search-index.json')` | ❌ Must manually write `/slashdot-website-2026/search-index.json` |

Use the `getImgPath(path)` utility (`src/lib/utils.ts`) for dynamic image path construction in components that cannot use `next/image`.

---

*Last Updated: April 17, 2026 (Full documentation audit & expansion)*
