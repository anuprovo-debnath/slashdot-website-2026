# Slashdot Footer & Contact System (2026)

This document outlines the architecture, design decisions, and implementation details of the global Footer component for the Slashdot Website 2026.

## 1. Core Architecture

The footer is implemented as a single, highly-optimized React component (`src/components/Footer.tsx`) integrated into the `RootLayout` (`src/app/layout.tsx`). It serves three primary functions:
1.  **Lead Generation**: Dedicated #join-us landing section.
2.  **Brand Presence**: High-resolution, theme-aware logo system.
3.  **Social Connectivity**: Centralized grid for all official reach-out channels.

## 2. Anchor-Based Scrolling System

### The #join-us Target
- **Purpose**: Acts as the primary landing spot for all "JOIN" calls-to-action (CTA) across the site.
- **Anchor Location**: The root level of the footer component.
- **Behavior**: Enabled with global `scroll-behavior: smooth` in `src/app/globals.css`.
- **Offset Management**: No scroll-margin-top is applied to ensure the viewport reaches the absolute end of the page, showing the copyright line.

### Linked Components
- `Navbar.tsx`: Desktop and Mobile "JOIN" buttons.
- `page.tsx`: Hero "Join Competition" CTA.

## 3. Brand & Contact Column

### Responsive Logo System
- **Scale**: Large footprint (`h-32` on desktop) for premium visibility.
- **Positioning**: Offset by `translate-x-10` to balance the desktop grid.
- **Theme Awareness**: Dual-image implementation:
    - `Logo_White_BG.png`: Rendered in Light Mode.
    - `Logo_Black_BG.png`: Rendered in Dark Mode via `hidden dark:block` and `dark:hidden` Tailwind classes.

## 4. Reach-Out Grid (REACH US)

### Organizational Hierarchy
The social section is organized into a prioritized 2-row grid to optimize accessibility and visibility.

**Row 1 (Primary):**
- **GitHub**: Official Green (`#0FBF3E`) hover effect.
- **LinkedIn**: Brand Blue hover.
- **Email**: Integrated `mailto:slashdot@iiserkol.ac.in` using Lucide Mail icon.

**Row 2 (Community):**
- **Discord**: Brand "Blurple" hover.
- **YouTube**: Signature Red hover.
- **Instagram**: Professional Gradient hover.
- **Facebook**: Brand Blue hover.

### Icon Implementation
- **Tech**: Custom SVG paths (Font Awesome source).
- **Optimization**: Zero external library overhead for brand icons.
- **Interactive State**: Grayscale (0.8 opacity) to full-color brand transition on hover with a `300ms` transition.

## 5. Technical Specification

| Property | Value |
| :--- | :--- |
| **Component Path** | `src/components/Footer.tsx` |
| **Technology** | React (Client Component), Next.js Link/Image, Tailwind CSS |
| **Grid Layout** | `grid-cols-1 md:grid-cols-3` |
| **Background** | `bg-white/50` (Light) / `bg-black/20` (Dark) with Backdrop Blur |
| **Typography** | Global Geist Sans system |
| **Performance** | Inline SVGs, Optimized Next.js Images |

## 6. Future Recommendations
- **Dynamic Links**: Consider moving social URLs to a centralized constants file.
- **Tooltips**: Add accessible hover tooltips for specific social platforms.
- **Sign-up Integration**: Replace the mailto with a dedicated signup modal or form once available.
