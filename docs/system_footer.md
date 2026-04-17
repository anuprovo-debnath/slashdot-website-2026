# Slashdot Footer System (2026)

Technical reference for `src/components/Footer.tsx` — the global footer used on every page of the Slashdot Website 2026.

---

## Table of Contents
1. [Overview & Purpose](#1-overview--purpose)
2. [Layout Engine](#2-layout-engine)
3. [Section 1: "Join Us" Hero Block](#3-section-1-join-us-hero-block)
4. [Section 2: Brand Zone (Column 1)](#4-section-2-brand-zone-column-1)
5. [Section 3: Links Hub (Column 2)](#5-section-3-links-hub-column-2)
6. [Section 4: Connect & Social Grid (Column 3)](#6-section-4-connect--social-grid-column-3)
7. [Section 5: Legal Strip](#7-section-5-legal-strip)
8. [Touch-Parity System](#8-touch-parity-system)
9. [Social Platforms Reference](#9-social-platforms-reference)
10. [Maintenance Guidelines](#10-maintenance-guidelines)

---

## 1. Overview & Purpose

The footer serves three functions simultaneously:
- **CTA Section**: A "Ready to Join Us?" block with a direct email mailto link.
- **Site Navigation**: A compact repeat of the full sitemap for quick access.
- **Community Hub**: Social media links and contact information for the club.

The footer has `id="join-us"` which is the anchor target for the "JOIN" button in the Navbar and the mobile drawer.

---

## 2. Layout Engine

### Top-Level Structure
```
<footer id="join-us">
  ├── Join Us Hero Block       (full width, centered)
  └── Main Footer Panel
      ├── Brand Zone           (md:col-span-7)
      ├── Links Hub            (md:col-span-10) ← center, with border-x separators
      └── Connect / Social     (md:col-span-7)
```

### Desktop Grid — `md:grid-cols-24`
The footer uses a **24-column grid** for precise section sizing:

| Column | Span | Content |
| :--- | :--- | :--- |
| 1 | 7/24 (29%) | Brand & Logo Zone |
| 2 | 10/24 (42%) | Links Hub (Sitemap + Resources) |
| 3 | 7/24 (29%) | Connect (Email + Social Icons) |

Vertical separators (`md:border-x`) flank the Links Hub, creating a visual triptych.

### Mobile Reorder
On small screens, columns stack vertically in a different order using Tailwind `order-` utilities:

1. **Links Hub** (`order-1`) — Most navigational value first.
2. **Connect / Social** (`order-2`) — Easy social access.
3. **Brand Zone** (`order-3`) — Decorative, least critical, at the bottom.

Horizontal `border-b` dividers replace the vertical ones on mobile.

### Scroll-Offset
`scroll-mt-8 md:scroll-mt-24` is applied to the `<footer>` element itself. This offsets the anchor scroll position to account for the fixed Navbar height, so `#join-us` links land cleanly below the nav bar.

---

## 3. Section 1: "Join Us" Hero Block

A full-width introductory block at the top of the footer:

- **Heading**: "Ready to **Join Us?**" with the brand teal color on the "Join Us" span.
- **Subtext**: A brief description of the club's value proposition.
- **CTA Button**: `mailto:slashdot@iiserkol.ac.in` — styled as a teal pill with hover glow, scale-up on hover, and `active:scale-95` for tactile feedback.

```tsx
<a href="mailto:slashdot@iiserkol.ac.in"
   className="inline-flex ... bg-[var(--color-primary)] hover:scale-105 active:scale-95">
  JOIN
</a>
```

---

## 4. Section 2: Brand Zone (Column 1)

- **Logo**: Dual `next/image` images — `Logo_White_BG.png` for light mode (with `dark:hidden`) and `Logo_Black_BG.png` for dark mode (with `hidden dark:block`). This strategy avoids JS-based conditional rendering which would cause hydration mismatches on static export.
- **Brand Name**: "Slashdot" in **Arista Pro Bold** (`font-heading`), colored in `var(--color-primary)` teal. Font size: `text-5xl`.
- **Centering**: The entire zone uses `items-center` and `text-center` for a balanced visual anchor.

---

## 5. Section 3: Links Hub (Column 2)

An internal 2-column sub-grid with `gap-x-10 sm:gap-x-20`:

### Sitemap Column (Left)
Links to all primary site routes:
- Home (`/`)
- The Team (`/team`)
- Blog (`/blog`)
- Projects (`/projects`)
- Events (`/events`)

### Resources Column (Right)
External and utility links:
- **Design Systems** → [GitHub Repository](https://github.com/anuprovo-debnath/slashdot-website-2026) (external, `target="_blank"`)
- **Fun Zone** (`/fun-zone`)
- **Open Source** → [Slashdot GitHub Org](https://github.com/slashdot-iiserk) (external)
- **Help Center** → `mailto:slashdot@iiserkol.ac.in`

All links use `opacity-70` at rest with `hover:opacity-100 hover:text-[var(--color-primary)]` transition for a consistent interactive feel.

---

## 6. Section 4: Connect & Social Grid (Column 3)

### Email Contact
Displayed prominently with a `FaEnvelope` icon from `react-icons/fa6`. The icon applies independent `group-hover:scale-110` on the surrounding group to add micro-animation.

### Social Media Grid
Rendered via the `SOCIAL_PLATFORMS` configuration array — a data-driven approach that maps platform metadata to React icon components.

**Current platforms (in order):**

| Platform | Icon | Hover Color |
| :--- | :--- | :--- |
| GitHub | `FaGithub` | `#0FBF3E` (green) |
| LinkedIn | `FaLinkedin` | `#0077B5` (blue) |
| Discord | `FaDiscord` | `#5865F2` (indigo) |
| YouTube | `FaYoutube` | `#FF0000` (red) |
| Instagram | `FaInstagram` | Gradient: `#f9ce34 → #ee2a7b → #6228d7` |
| Facebook | `FaFacebookF` | `#1877F2` (blue) |

### CSS Variable Color Trick
Each icon `<a>` element receives its brand color via a CSS custom property:
```tsx
style={{ "--brand-color": platform.color } as React.CSSProperties}
className="hover:bg-[var(--brand-color)] hover:shadow-[var(--brand-color)]/20"
```
This lets a single set of utility classes apply different brand colors based on the parent's `style` attribute — no conditional class logic needed.

### Instagram Gradient Exception
Instagram has a `hoverClass` override in its config that replaces the standard `hover:bg-[var(--brand-color)]` with a `hover:bg-gradient-to-tr` class for the authentic 3-color gradient:
```tsx
hoverClass: "hover:bg-gradient-to-tr hover:from-[#f9ce34] hover:via-[#ee2a7b] hover:to-[#6228d7]"
```

---

## 7. Section 5: Legal Strip

A bottom row with:
- **Copyright**: "© 2026 Slashdot Website Competition. All rights reserved."
- **Links**: Privacy Policy, Terms of Service, Cookies (placeholder anchors)
- **Style**: `opacity-60 text-xs` — intentionally de-emphasized.

---

## 8. Touch-Parity System

The social icon grid is fully wired into the global touch-parity CSS in `globals.css`:

```css
@media (hover: none) and (pointer: coarse) {
  .hover\:-translate-y-1:active { ... }
  .hover\:bg-\[var\(--brand-color\)\]:active { background-color: var(--brand-color); }
  .hover\:bg-gradient-to-tr:active { background-image: linear-gradient(...); }
  .group\:active .group-hover\:text-white { color: white !important; }
}
```

This ensures that on touch devices:
- Tapping a social icon immediately shows its brand color fill.
- The icon color flips to white.
- The upward `translate-y-1` lift is visible during the touch.

---

## 9. Social Platforms Reference

To add or modify social platforms, edit the `SOCIAL_PLATFORMS` array in `Footer.tsx`:

```tsx
const SOCIAL_PLATFORMS = [
  {
    name: "GitHub",
    href: "https://github.com/slashdot-iiserk",
    icon: FaGithub,          // Import from react-icons/fa6
    color: "#0FBF3E",        // Used as --brand-color CSS variable
    hoverClass: undefined,   // Optional: override the default hover behavior
  },
  // ...
];
```

- **`color`**: Used for `--brand-color` (solid fill hover).
- **`hoverClass`**: Add a string of Tailwind classes to fully override the default hover style. Used only for Instagram's gradient.

---

## 10. Maintenance Guidelines

- **`#join-us` Anchor**: Do not remove `id="join-us"` from the `<footer>` element. It is the target of the Navbar's "JOIN" button and the mobile drawer's "JOIN THE CLUB" button.
- **Adding a Social Platform**: Import the icon from `react-icons/fa6` and add a new entry to `SOCIAL_PLATFORMS`. The touch-parity CSS in `globals.css` will need a matching `:active` rule for the new `hover:bg-[color]` class.
- **Logo Assets**: The logo images are stored at `public/logos/Logo_White_BG.png` and `public/logos/Logo_Black_BG.png`. They include the GitHub Pages base path (`/slashdot-website-2026/`) because they use standard `<img>` src strings.
- **Link Updates**: Internal links use `<Link>` from `next/link`. External links use plain `<a target="_blank">`.
