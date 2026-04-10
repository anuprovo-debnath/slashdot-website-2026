# Slashdot Projects System Documentation

This document outlines the architecture, design logic, and technical implementation of the responsive projects showcase system developed for the Slashdot website (2026).

---

## 1. Responsive Project Grid
The project grid mirrors the blog system's "Matrix" geometry to ensure visual consistency across the platform.

### Core Proportions
- **Total Height:** Strictly fixed at **450px** across all devices.
- **Header/Visual Height:** **180px** (Utilizes `SlashdotFallbackCover` or a project screenshot).
- **Meta Zone:** **44px** (Height-locked for tech stack and links).
- **Description Area:** Uses the **"Greedy Clamping"** strategy to maximize readable space.

### Responsive Constraints
To eliminate "dead space" on wider screens, the layout follows these breaking points:
- **Mobile (1-col):** `line-clamp-4`.
- **Tablet/Small Desktop (2-col):** `sm:line-clamp-5`.
- **Desktop (Standard 3-col):** `lg:line-clamp-5`.
- **Ultrawide:** `xl:line-clamp-6`.

---

## 2. Data Structure & Taxonomy
Projects are defined via Markdown files with a strict frontmatter schema to drive the UI.

### Frontmatter Schema
```yaml
---
title: "Project Name"
category: "Internal_Tools" # Options: Internal_Tools | Other | Member_Spotlight
status: "Active"          # Options: Active | Maintained | Archived
tech_stack: ["Next.js", "Tailwind", "TypeScript"]
links:
  github: "https://github.com/..."
  demo: "https://..."
  youtube: "https://..." # Optional
coverImage: "/projects/cover.jpg" # Optional - Fallback pattern used if omitted
---
```

### Classification Logic
- **Internal_Tools:** Infrastructure or utilities built *for* the club.
- **Member_Spotlight:** High-quality projects created by individual club members.
- **Other:** General community or experimental projects.

---

## 3. Visual System & Badges

### Status Badges
Status badges are styled using the site's centralized theme variables located in `src/app/globals.css`.

| Status | Color Logic | CSS Class (Tailwind v4) |
| :--- | :--- | :--- |
| **Active** | `var(--color-primary)` | `bg-primary/10 text-primary border-primary/20` |
| **Maintained** | `var(--color-text)` (Dimmed) | `bg-foreground/5 text-foreground/70 border-foreground/10` |
| **Archived** | Greyscale | `bg-muted text-muted-foreground border-border` |

### SlashdotFallbackCover (`SlashdotFallbackCover.tsx`)
For projects without a high-resolution cover image, the `SlashdotFallbackCover` component provides a branded SVG Matrix background.
- **Variant Logic:** The project system may implement color-shifting variants of the fallback cover based on the project `category`.

---

## 4. Design System Integration

### Centralized Theming
All styles must respect `src/app/globals.css`:
- **Primary:** `var(--color-primary)` (#0291B2).
- **Background:** `var(--color-background)`.
- **Text:** `var(--color-foreground)`.

### GitHub Pages Subpath Constraints
- **Relative Assets:** Since the site is deployed at `/slashdot-website-2026`, all internal links and asset paths must be prefixed correctly.
- **Implementation:** Use the helper functions in `src/lib/utils.ts` (if available) or ensure paths in Markdown start with `/` which are handled by the Next.js `basePath` configuration.

---

## 5. Content Creation Guide

1.  **Create File:** Navigate to `content/projects/` and create `your-project.md`.
2.  **Add Metadata:** Ensure all mandatory fields (`category`, `status`, `tech_stack`) are present.
3.  **Visuals:** If adding a screenshot, place it in `public/projects/` and reference it as `/projects/filename.jpg`.

---

## 6. Maintainer Guidelines (Tailwind v4)

- **Utility First:** Stick to Tailwind v4 theme variables. Do not introduce new color variables unless synchronized with the global theme.
- **Lock Height:** The 450px constraint is non-negotiable for grid uniformity.
- **Hydration:** Ensure any client-side link interactions use `mounted` state guards to prevent hydration mismatches.
