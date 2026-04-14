# Slashdot Navbar & Navigation System (2026)

This document outlines the architecture, UX patterns, and implementation details of the global navigation bar for the Slashdot Website 2026.

## 1. Core Philosophy

The Slashdot Navbar is designed to be **unobtrusive yet powerful**. It prioritizes content-first visibility by starting with a transparent background and adapting its visual density based on user scroll behavior.

## 2. Visual Architecture

### Adaptive Styling (Glassmorphism)
- **Initial State**: Transparent background with consistent padding (`py-3`) to blend into the landing hero.
- **Scrolled State**: Triggered at `window.scrollY > 20`. 
    - **Effect**: `bg-[var(--color-bg)]/80` with `backdrop-blur-md`.
    - **Physicality**: Bottom border `border-b` is always present; color transitions from `transparent` to `border-black/10` (light) / `border-white/10` (dark) to prevent layout-shift flashes.
    - **Scroll Progress**: A dynamic 2px bar at the bottom edges tracks reading progress using the theme color.

### Navigation Priority
The links are defined in a centralized `NAV_LINKS` constant. The **Home** link has been removed as the primary branding now serves as the home navigational anchor:
1.  **Team** (`/team`)
2.  **Blog** (`/blog`)
3.  **Projects** (`/projects`)
4.  **Events** (`/events`)
5.  **Fun Zone** (`/fun-zone`)

## 3. Interaction Design

### Active Route Strategy
Uses the `usePathname` hook from `next/navigation` to compare current location with link `href` via `startsWith`.
- **Active Styles**: Colored text (`var(--color-primary)`).
- **Inactive Styles**: Neutral text with primary-color hover shifts and subtle `bg-primary/5` pill patterns on hover.

### Branding & Logo
- **Logo Zone**: Transitioned to the text-based **Arista Pro Bold** branding with the iconic **" /."** suffix for identity parity with the Navbar.
- **Typography**: Uses theme-aware coloring (Neutral-800 for light, White for dark) for the brand text, with the suffix in the primary accent color.
- **Alignment**: Centered branding to serve as a visual anchor.

### Synchronized Anchor Navigation
To ensure a smooth transition to the footer's `#join-us` anchor:
- **Desktop**: Direct anchor linking with `scroll-mt-24` offset.
- **Mobile (Menu Sync)**: Handled via a 300ms delayed scroll. When "JOIN THE CLUB" is clicked in the mobile drawer, the menu starts its closing animation first. The scroll event is delayed to allow the layout to stabilize (preventing "jumpy" destinations caused by the collapsing menu height).

### Utility Zone
Consolidated on the far right of the nav:
- **Search Hub**: Triggers the global custom event `slashdot:open-search`.
- **Theme Switcher**: Integrated `ThemeToggle` with View Transition support.
- **Vertical Divider**: A visual break between primary navigation and club utility.
- **JOIN CTA**: High-contrast button with shadow-glow and active-click scaling.

## 4. Mobile UX (Side Drawer)

- **Drawer Mechanism**: Controlled by an `isOpen` state with a standard Menu/X toggle.
- **Animation**: Smooth `max-h` and `opacity` transition (300ms ease-in-out).
- **Responsive Stack**: Links expand to full-width touch targets with rounded corners (`rounded-xl`).
- **Primary Action**: A full-width "JOIN THE CLUB" button anchored at the bottom of the drawer.

## 5. Technical Specifications

| Feature | Implementation |
| :--- | :--- |
| **Component Path** | `src/components/Navbar.tsx` |
| **Client/Server** | Client Component (`"use client"`) |
| **Animation Engine** | CSS Transitions + Tailwind Utilities |
| **Icon Set** | Lucide React (Search, Menu, X) + Font Awesome (Envelope/Socials) |
| **Accessibility** | ARIA attributes for menu state, semantic `<nav>` wrapper |

## 6. Maintenance Guidelines

- **Adding a Route**: Simply update the `NAV_LINKS` array at the top of the file. No component re-wiring required.
- **Base Pathing**: Logo sources include the GitHub Pages subpath (`/slashdot-website-2026/`). If the `basePath` changes in `next.config.ts`, these string paths must be updated manually.
- **Hardware Acceleration**: The Navbar uses `transform-gpu` to ensure it remains stable during theme-toggle view transitions.
- **Mobile Sticky Fix**: Swapped `transition-all` for specifically targeted transitions to prevent the mobile address bar's auto-hide resize from detaching the "sticky" navbar.
- **Viewport-Aware Indicators**: The scroll progress indicator uses `window.visualViewport` to accurately calculate document height on mobile devices with dynamic system UI bars.
