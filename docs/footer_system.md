# Slashdot Footer System (2026)

This document outlines the architecture, design choices, and technical implementation of the global `Footer` component for the Slashdot club website.

## 1. Overview
The footer is designed to be a high-fidelity, responsive "anchor" for the site. It provides essential navigation, club contact information, and social connectivity while maintaining perfect alignment with the site's brand guidelines.

## 2. Architecture

### Layout Engine
- **Desktop**: Utilizes a `md:grid-cols-12` grid system.
- **Span Ratio (4:4:4)**:
    - **Column 1 (Span 4)**: Brand & Logo Zone.
    - **Column 2 (Span 4)**: The "Links Hub" (Sitemap & Resources).
    - **Column 3 (Span 4)**: Connect & Social Presence.
- **Visual Separators (Adaptive)**:
    - **Desktop**: Features subtle vertical dividers (`md:border-x`) on either side of the Links Hub to create a structured triptych layout.
    - **Mobile**: Features horizontal dividers (`border-b`) between the reordered sections to maintain clear hierarchy in the vertical stack.
    - **Subtlety**: Borders use a highly transparent `border-black/10` or `border-white/10` to ensure they are helpful but never distracting.
- **Mobile**: Columns utilize `order-` utilities to rebalance hierarchy for small screens:
    1. **Links Hub** (`order-1`) - Primary navigation first.
    2. **Social Section** (`order-2`) - Community connectivity second.
    3. **Brand Zone** (`order-3`) - Club branding provides the final anchor.
    - Vertically spaced with `py-12` per section.

## 3. Brand Zone (Column 1)
- **Logo Scale**: Iconic footprint (`h-36 w-40`) using theme-aware image switching.
- **Typography**: Club naming in **Arista Pro Bold**.
- **Alignment**: Centered branding to serve as a visual anchor.

## 4. Column Details

### Column 2: Links Hub (Span 4)
- **Internal Grid**: Uses a **permanent 2-column grid** (`grid-cols-2`) on all devices to ensure `Sitemap` and `Resources` remain adjacent.
- **Interactive States**: Links use `opacity-70` with a transition to `opacity-100` and the primary brand color on hover.
- **Resources**: Includes "Open Source" (GitHub) and "Help Center" (Mail) alongside internal navigation.

### Column 3: Connect (Span 4)
- **Email Contact**: High-visibility mail link with a Font Awesome icon, positioned prominently above the social grid.
- **Social Grid**:
    - Features a **data-driven grid** mapped via `SOCIAL_PLATFORMS`, utilizing components from **`react-icons/fa6`**.
    - **Default State**: High-contrast minimalist style. Subtle grey background (`bg-black/5`) with pure **Black (Light Mode)** or **White (Dark Mode)** icons for maximum legibility.
    - **Hover State**: Burst into **solid brand color** transition with full white icons and subtle shadow.
    - **Layout**: Uses a spacious **`w-12 h-12`** scale with **`gap-5`** spacing.

## 5. Technical Specification

### Dynamic Icon System
The social section uses a centralized configuration to manage platform metadata:
```tsx
const SOCIAL_PLATFORMS = [
  { 
    name: "GitHub", 
    color: "#0FBF3E", // Solid Brand Color (revealed on hover)
    // ... metadata
  }
];
```
Styling is achieved using **CSS Variables** (`style={{ '--brand-color': platform.color }}`) to ensure the transition to a solid brand fill is perfectly coordinated across the layout.

## 6. Implementation Notes
- **Responsive Symmetry**: Built with Tailwind CSS v4 to ensure the 4:4:4 layout scales perfectly from ultra-wide monitors to mobile devices.
- **Performance**: Uses `next/image` with `unoptimized` flag for SVG-like performance on club branding assets.
- **Maintainability**: The transition to a data-driven mapping system allows for platform updates without touching the JSX architecture.
