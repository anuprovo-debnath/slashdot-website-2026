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
  overflow: clip;
}
```

## 3. Responsive Navbar

The `Navbar` component was refactored to be a high-fidelity, interactive component with adaptive styling.

- **Dynamic Glassmorphism**: Implemented a scroll-triggered state. The navbar starts transparent and transitions to `bg-[var(--color-bg)]/80 backdrop-blur-md` after 20px of scroll, providing a premium "frosted" look.
- **Structural Cleanup**: Removed duplicate `ThemeToggle` components and reorganized utility icons (Search, Theme, JOIN) into a consolidated utility zone separated by a vertical divider.
- **Route Rationalization**: Navigation was simplified to focus on core club features (**Home**, **Team**, **Blog**, **Projects**, **Events**, **Fun Zone**). Dead links to `/about` and `/contact` were removed in favor of these high-traffic routes.
- **GPU Acceleration**: Retained `transform-gpu` to force composited layers, preventing flicker during View Transition snapshots.
- **Active State Tracking**: Uses `usePathname()` to provide visual feedback for the current active route via subtle background highlights.
- **Theme-Aware Branding**: Standardized logo swap logic using `next/image`'s `fill` and `object-contain` for perfectly sharp logos in both modes.

## 4. Assets & Icons

- **Favicon**: The primary logo (`Logo_Black_BG.png`) was set as the website icon via `src/app/icon.png`.
- **Typography**: Configured `@font-face` for **Arista Pro Bold**, sourced from `/slashdot-website-2026/fonts/`.
- **Tech Page**: Created `/tech` to showcase the color palette and design tokens to judges.

## 5. Deployment (GitHub Pages)

Configured specifically for subpath deployment at `/slashdot-website-2026/`:
- **`next.config.ts`**: Set `basePath`, `assetPrefix`, `output: 'export'`, and `trailingSlash: true`.
- **Layout**: Added a `<base href="/slashdot-website-2026/" />` tag to ensure relative assets (fonts/images) resolve correctly across all sub-pages.
- **Workflows**: Automated deployment via `.github/workflows/deploy.yml` on every push to `main`.
- **Compatibility**: Added `.nojekyll` and an empty `CNAME` in the `public/` folder to bypass Jekyll processing on GitHub.

## 6. Critical Mantainer Gotchas

### Path Resolution & Subpaths
Because the site is hosted at `/slashdot-website-2026/`, we use a `<base>` tag in `layout.tsx`. 
- **Rule**: When adding local links or images, use paths relative to the root (e.g., `/logos/...`) but check them in production. The `<base>` tag usually handles the resolution, but `next/link` and `next/image` (if used) might behave differently under `basePath` configurations.

### Hardware Acceleration (The "Vanishing" Navbar)
The Navbar uses `transform-gpu` (`transform: translateZ(0)`). **Do not remove this.** It is there to force Chrome to keep the sticky navbar rendered during the View Transition snapshot. Without it, the navbar will flicker or disappear during theme changes.

### View Transition Clipping
The CSS `height: 100svh` and `overflow: clip` on `::view-transition-old(root)` and `::view-transition-new(root)` are vital for Android Chrome. They ensure the circular reveal doesn't "jump" when the mobile address bar is expanding or collapsing.

### Tailwind v4 Styling
This project does **not** have a `tailwind.config.js`. All design tokens (colors, fonts) are defined inside the `@theme` block in `src/app/globals.css`.

## 7. Fun Zone Grid System

To accommodate high-motion interactive elements while maintaining parity with the Blog/Project grids, we implemented the **Sidelong Grid** architecture.

### Manual Shift Strategy
Standard CSS grids with `max-w-7xl` often clip shadows or high-density hover states at the viewport edges. To solve this, the Fun Zone uses a **40px Manual Shift** (`px-10`).
- **Alignment**: The scroller's internal padding (`px-10`) ensures the first card aligns perfectly with the site header's left edge while allowing shadows to bleed into the gutter.
- **Snapping**: `scroll-pl-10` is used to synchronize the `snap-mandatory` start point with the manual indentation.

### Component Architecture
- **`STRIP_CONFIG`**: A central constant in `fun-zone/page.tsx` that manages all grid geometry to prevent value-drift across the three strips (Memes, Games, Art).
- **Asset Localisation**: Swapped external Giphy/Unsplash placeholders for local production assets in `public/images/games/` to ensure 100% reliability for judge reviews. 
- **Direct Redirection**: Game cards were updated to redirect the entire card surface to provided external links (`target="_blank"`), avoiding sub-route maintenance for third-party games.

## 8. Footer Architecture

The global `Footer` component was refactored into a **3-column zone system** to improve visual balance and information density.

### Design Decisions
- **Grid Layout**: Transitioned to an equitable **12-column responsive system** (`md:grid-cols-12`) using a **4:4:4 ratio**, providing each functional zone (Brand, Navigation, Social) equal visual weight.
- **Enhanced Spacing**: Increased the main grid gutter to `gap-20` (and `gap-16` within the links hub). The social icon grid was also expanded to `gap-6` to improve scannability and interaction clarity.
- **Links Hub (Centralization)**: Sitemap and Resources are grouped into a single middle column.
- **Split-Alignment Strategy**: 
    - **Brand & Connect**: Centered within their respective 33% columns to create symmetrical anchors. Features a text-based email link (with a Font Awesome icon) positioned above the social icon grid for high-visibility contact.
    - **Links Hub**: Utilizes internal opposites—Sitemap is left-aligned while Resources is right-aligned—to maximize white space and clarity.
- **Visual Impact**: The tall-format logo (`h-36 w-40`) remains the primary branding anchor, now perfectly centered in the first column.
