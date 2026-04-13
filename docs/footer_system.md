# Slashdot Footer System (2026)

This document outlines the architecture, design choices, and technical implementation of the global `Footer` component for the Slashdot club website.

## 1. Overview
The footer is designed to be a high-fidelity, responsive "anchor" for the site. It provides essential navigation, club contact information, and social connectivity while maintaining perfect alignment with the site's brand guidelines.

## 2. Architecture

### Layout Engine
- **Desktop**: Utilizes a high-precision `md:grid-cols-24` grid system for granular control over section width.
- **Span Ratio (7:10:7)**:
    - **Column 1 (Span 7/24)**: Brand & Logo Zone.
    - **Column 2 (Span 10/24)**: The "Links Hub" (Sitemap & Resources).
    - **Column 3 (Span 7/24)**: Connect & Social Presence.
- **Visual Separators (Adaptive)**:
    - **Desktop**: Features subtle vertical dividers (`md:border-x`) on either side of the Links Hub.
    - **Mobile**: Features horizontal dividers (`border-b`) between sections.
- **Scroll Logic**: Includes `scroll-mt-20` to ensure anchor navigation (e.g., `#join-us`) lands with professional breathing room below the sticky header.
- **Mobile**: Columns utilize `order-` utilities:
    1. **Links Hub** (`order-1`)
    2. **Social Section** (`order-2`)
    3. **Brand Zone** (`order-3`)

## 3. Brand Zone (Column 1)
- **Logo Scale**: Iconic footprint (`h-36 w-40`) using theme-aware image switching.
- **Typography**: Club naming in **Arista Pro Bold**.

## 4. Column Details

### Column 2: Links Hub (Span 10)
- **Internal Grid**: Permanent `grid-cols-2` layout on all devices.
- **Spacing**: Features expanded horizontal gaps (`sm:gap-x-20`) to give links prominence.

### Column 3: Connect (Span 7)
- **Email Contact**: Prominent mail link with standard FA icon.
- **Social Grid**: Data-driven grid using `react-icons/fa6` with a "Reveal-on-Hover" brand coloring system.

## 5. Implementation Notes
- **Responsive Symmetry**: Built with Tailwind CSS v4.
- **Performance**: Optimized branding assets with `next/image`.
- **Maintainability**: Centralized Platform/Icon mapping.
