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

The `Navbar` component was built to be mobile-first and high-performance.

- **Sticky Behavior**: Uses `sticky top-0` for constant access.
- **GPU Acceleration**: Added `transform-gpu` to force the Navbar onto a separate composited layer. This prevents a known Chrome bug where sticky elements would "vanish" during View Transition snapshots.
- **Dynamic Logos**: Integrated theme-aware logos (`Logo_White_BG.png` for light, `Logo_Black_BG.png` for dark) that swap instantly.
- **Casing**: Standardized all branding to "Slashdot" (correct capital 'S', lowercase 'd').

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

## 7. Future Maintenance Tasks
- **Font Refresh**: If changing fonts, update the `@font-face` in `globals.css` and ensure assets are in `public/fonts/`.
- **New Pages**: Any new page added must follow the semantic structure used in `page.tsx` and `tech/page.tsx` to maintain SEO and layout consistency.
- **Next.js Updates**: Since this uses Next.js 15, monitor the stability of "File-based Metadata" (icon.png, opengraph-image.png) as APIs evolve.
