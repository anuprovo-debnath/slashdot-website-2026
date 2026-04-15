# Slashdot Website Implementation Summary

This document outlines the technical implementation details for the Slashdot website project. It is intended for future maintainers to understand the "why" behind specific architectural choices and complex fixes.

## 0. Key Architecture Notes (READ FIRST)
- **Framework**: Next.js 15 (App Router).
- **Styling**: Tailwind CSS v4 (Pure CSS configuration using `@theme`).
- **Deployment Strategy**: Static Export (`output: 'export'`) to GitHub Pages subpath.
- **Experimental APIs**: Heavily relies on the **View Transitions API** for the theme toggle.

## 1. Design System & Theming

### CSS Variables
We implemented a CSS Variable strategy in `src/app/globals.css` to handle both Light and Dark modes.
- **Teal (Primary)**: `#0291B2`
- **Dark Surface**: `#262626`
- **Transitions**: Native CSS transitions were initially used but later replaced by the **View Transitions API** for smoother performance during theme switching.

### Theme Engine
- **Provider**: Utilizes `next-themes` with a `ThemeProvider` wrapping the application in `layout.tsx`.
- **Strategy**: Class-based switching (`.dark` / `.light`).
- **Mobile Fix**: Tailwind v4 was configured with `@custom-variant dark` to correctly recognize the `.dark` class instead of relying solely on system-level media queries.

## 2. The "Expanding Circle" Animation

A premium circular reveal animation was implemented for theme toggling using the modern **View Transitions API**.

### Logic Detail (`ThemeToggle.tsx`)
- **Origin Calculation**: The circle expands from the exact location of the click/tap. On mobile, it falls back to the center of the toggle button if precise coordinates are missing.
- **Visual Viewport Sync**: Addressed an Android Chrome bug where the address bar collapse offset the Y-coordinate. The implementation uses `100svh` and specific CSS bounds to keep the animation aligned.
- **Coordination**: Uses `flushSync` from `react-dom` to ensure the DOM state updates immediately before the transition snapshot is captured.

### CSS Optimization (`globals.css`)
```css
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
  height: 100svh; /* Locks the transition to the visible area */
  object-fit: none;
}
```

## 3. Responsive Navbar & Navigation Fixes

The `Navbar` component was refactored to be a high-fidelity, interactive component with adaptive styling.

- **Dynamic Glassmorphism**: Implemented a scroll-triggered state. The navbar remains stable at `py-3` to prevent "hiding" illusions, with the border-color transitioning to avoid layout flashes.
- **Text-Based Branding**: Migrated from images to Arista Pro text components with teal suffixes for better accessibility and theme synchronization.
- **Scroll Indicator**: Added a persistent 2px progress bar using the Visual Viewport API for cross-device accuracy.
- **Synchronized Anchor Navigation (Critical Fix)**: Addressed a common Next.js/Tailwind issue where scrolling to a footer anchor while the mobile menu is open would "jump" or over-scroll because the menu was collapsing simultaneously. 
    - **Solution**: Implemented a 300ms delay in `Navbar.tsx` for mobile drawer links, allowing the `isOpen` transition to complete before initiating `scrollIntoView`.
- **Staggered Handoff**: Implemented a pixel-perfect "typing" handoff between the `LoadingScreen` and `Navbar`. As characters in the loader's terminal exit via a staggered opacity animation, the Navbar triggers a matching `logo-char-reveal` and `logo-dot-slide` to create a seamless visual transition.
- **Intro Skip Cache**: Integrated a `localStorage` check (`slashdot_last_visit`) that caches the user's visit. Returning visitors within a 24-hour window bypass the 5-second loading sequence for an immediate site reveal.
- **Global Scrollbar Removal**: Achieved a clean, app-like aesthetic by hiding the default OS scrollbars via CSS (`scrollbar-width: none` and `::-webkit-scrollbar { display: none }`). Navigation progress is instead tracked by the custom Navbar indicator.
- **Mobile Geometric Stability**: Resolved the "disappearing navbar" bug by switching from `sticky` to `fixed` positioning and using the `Visual Viewport API` to account for the dynamic height of mobile address bars.
- **Responsive Branding**: Implemented CSS media queries in the loading sequence to scale terminal fonts and brand sizes specifically for mobile viewports, preventing layout overflows.

## 4. Assets & Icons

- **Standardization**: Migrated all branding and social icons to **`react-icons/fa6`** components. This ensures SVG consistency across the site and allows for easy color management.
- **Favicon**: The primary logo was set as the website icon via `src/app/icon.png`.
- **Typography**: Configured `@font-face` for **Arista Pro Bold**, sourced from `/slashdot-website-2026/fonts/AristaProBold.ttf`.
- **Tech Page**: Created `/tech` to showcase the color palette and design tokens.

## 5. Deployment (GitHub Pages)

Configured specifically for subpath deployment at `/slashdot-website-2026/`:
- **`next.config.ts`**: Set `basePath`, `assetPrefix`, `output: 'export'`, and `trailingSlash: true`.
- **Asset Prefixing**: Handled via a `<base>` tag in `layout.tsx` to ensure relative assets (fonts/images) resolve correctly across all sub-pages.
- **Workflows**: Automated deployment via `.github/workflows/deploy.yml` on every push to `main`.
- **Compatibility**: Added `.nojekyll` and an empty `CNAME` in the `public/` folder to bypass Jekyll processing.

## 6. Critical Maintainer Gotchas

### Path Resolution & Subpaths
Because the site is hosted at `/slashdot-website-2026/`, we use a `<base>` tag in `layout.tsx`. 
- **Rule**: When adding local links or images, use paths relative to the root (e.g., `/logos/...`). The `<base>` tag ensures these settle correctly into the subpath.

### Hardware Acceleration (The "Vanishing" Navbar)
The Navbar uses `transform-gpu`. **Do not remove this.** It is there to force Chrome to keep the sticky navbar rendered during the View Transition snapshot.

### View Transition Clipping
The CSS `height: 100svh` and `overflow: clip` are vital for Android Chrome. They ensure the circular reveal doesn't "jump" when the mobile address bar is expanding or collapsing.

### Tailwind v4 Styling
This project does **not** have a `tailwind.config.js`. All design tokens (colors, fonts) are defined inside the `@theme` block in `src/app/globals.css`.

## 7. Fun Zone & Sidelong Grid Architecture

To accommodate high-motion interactive elements while maintaining parity with the Blog/Project grids, we implemented the **Sidelong Grid**.

- **40px Manual Shift**: The scroller's internal padding (`px-10`) ensures the first card aligns perfectly with the site header while allowing shadows to bleed into the gutter.
- **Snapping**: `scroll-pl-10` is used to synchronize the `snap-mandatory` start point with the manual indentation.
- **Component Architecture**: A central `STRIP_CONFIG` manages all grid geometry to prevent value-drift across Memes, Games, and Art.
- **Direct Redirection**: Game cards redirect the entire card surface to external links (`target="_blank"`), avoiding sub-route maintenance.

## 8. Footer Architecture (Final Production State)

The `Footer` was evolved from a simple list into a high-precision architectural anchor.

- **24-Column Grid Architecture**: Transitioned to a **24-column grid** to enable the **7:10:7** width ratio. This gives the central Links Hub exactly 41.6% of the width, maximizing readability for the sitemap and resources.
- **Minimalist Neutral Style**: Social icons use a pure high-contrast (Black/White) neutral default state that "bursts" into brand color only on hover. Brand borders were removed for a cleaner look.
- **Visual Separators**: Implemented adaptive separators—subtle vertical lines on desktop and horizontal lines on mobile—that respect the responsive `order-` of sections.
- **Mobile Reordering**: Handled via CSS `order-` utilities:
    1. **Links Hub** (`order-1`)
    2. **Social Section** (`order-2`)
    3. **Brand Zone** (`order-3`)
- **Unified Branding**: Standardized the logo scale to `h-36 w-40` for maximum visual impact across all devices.

## 9. Splash & Loading Morphology (The "Boot Sequence")

We implemented a high-fidelity terminal boot sequence with a perfectly synchronized brand handoff.

- **Conceptual Architecture**: A two-stage sequence. **Stage 1** simulates a terminal typing process. **Stage 2** initiates a "flight" transformation where the brand name moves to the navbar.
- **Session-Based Persistence**:
    - Uses `localStorage` to check for recent visits (24-hour window).
    - Returning visitors bypass the main terminal sequence, seeing only the lighter "Mini-Reveal" in the navbar.
- **The "Pixel Handoff" Synchronization**:
    - **Shared Timing Engine**: Both `LoadingScreen` and `Navbar` utilize a shared stagger (`0.16s`) and linear travel speed.
    - **Page Context Branching**: The loader checks the `usePathname` scope. On internal routing (`/blog`, `/team`), the brand translates functionally to the top-left Nav space (`final-logo-pos`). But if the user mounts natively at `/` (Home), the flight translates nowhere; it executes a massive optical illusion cross-fade exposing the statically aligned Hero logo physically behind it via a fading background transparency.
    - **Explicit Scroll Management**: To prevent bleed-through scrolling mechanics caused by dynamic heights, `Layout` level scroll locks were abandoned. Instead, if the user bypasses via the Home page, `page.tsx` itself intercepts an exhaustive `overflow: hidden` onto `document.documentElement` and listens structurally for the `slashdot:loader-fade-complete` event to disengage it safely 100ms post-render.
    - **Synchronized Exit/Entry**: Loader characters utilize a `step-end` exit animation that triggers exactly as the Navbar's characters execute their `step-end` entry.
    - **Visual Continuity**: The Navbar's `/.` dot acts as a digital wiper/cursor. As it slides across the brand area, it simultaneously "erases" the incoming loader text and "writes" the navbar text.
- **Mathematical Centering**: Use vertical centering math (`yMove`) to align the loader's large font baseline with the navbar's smaller logo baseline, preventing any vertical "jump" during the transition.
- **Redundant Activation Strategy**:
    - The Navbar logo is initially hidden at 0% opacity.
    - **Handshake**: Loader signals `slashdot:loading-ready` with a `skipped` flag.
    - **Fail-Safe**: If no event is detected, an 8s safety timer forces visibility to prevent a broken UI state.

## 10. HeroCanvas Improvements

### Depth-Linked Opacity (Inverse Proportion)
Previously, `baseOpacity` was assigned randomly per symbol. It now uses a deterministic **inverse proportion formula**:

```js
baseOpacity = (BASE_OPACITY_MAX × FONT_SIZE_MIN) / size
```

This is mathematically equivalent to `y = k/x`. Smaller symbols (10px) receive full opacity (1.0), while larger symbols (24px) receive ~0.42 opacity. This creates a convincing pseudo-3D parallax effect — distant/small symbols are sharp, close/large symbols are faded.

> **Note for maintainers**: Because particles are spawned once in `useEffect`, changes to `baseOpacity` logic only take effect on a full page reload (not hot-reload). This is expected behaviour.

### Scroll-Corrected Mouse Tracking
The raw `e.clientX / e.clientY` values from `mousemove` are viewport-relative and drift out of sync when the page is scrolled. The fix (mirroring the approach in `ThemeToggle.tsx`) translates coordinates into true canvas-space via:

```js
const rect = canvas.getBoundingClientRect();
mouseX = (e.clientX - rect.left) * (canvas.width / rect.width);
mouseY = (e.clientY - rect.top) * (canvas.height / rect.height);
```

This also applies `scaleX/scaleY` ratios to handle any CSS layout stretching of the canvas element, ensuring the Gaussian ring perfectly envelops the cursor at any scroll depth.

---
*Last Updated: April 2026*
