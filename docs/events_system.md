# Slashdot Events System Documentation

This document outlines the architecture, design logic, and technical implementation of the events system developed for the Slashdot website (2026).

---

## 1. Split-Screen Layout (Event Hub)

The events page utilizes a responsive split-screen architecture to efficiently display both spatial/temporal choices (calendar) and chronologically sorted content.

### Layout Geometry
- **Sidebar (30% Width):** Contains the Interactive Calendar component.
- **Main Section (70% Width):** A vertically scrollable feed of `EventCard` components.
- **Mobile Behavior:** On mobile screens, the calendar collapses into an expandable top section or horizontal slider, giving the main scrolling section 100% width.

### Interactive Calendar Behavior
- **Date Selection:** Clicking a specific date filters the main section feed to show only events happening on (or related to) that date.
- **Visual Cues:** Dates with scheduled events are highlighted using the primary brand token.

---

## 2. Event Data Schema (Frontmatter)

Events are managed as `.md` or `.mdx` files in the `content/events/` directory. Each requires the following YAML schema:

```yaml
---
title: "Introduction to Web3 Technologies"
date: "2026-04-15"        # ISO format required
time: "18:00 - 20:00 IST"
category: "Workshop"      # Options: Workshop, Seminar, Hackathon
status: "Upcoming"        # Required. Options: Live | Upcoming | Past
resources:
  youtube: "https://youtube.com/..."
  github: "https://github.com/..."
  slides: "https://slides.com/..."
  docs: "https://docs.slashdot..."
gallery:                  # Array of absolute image paths
  - "/slashdot-website-2026/events/web3-1.jpg"
  - "/slashdot-website-2026/events/web3-2.jpg"
---
```

### Schema Constraints
- **Date Formatting:** Must adhere strictly to the `YYYY-MM-DD` ISO format to enable correct Calendar interaction and filtering.
- **Gallery Images:** All paths **must** use the absolute base path `/slashdot-website-2026/` to function correctly on GitHub Pages deployment.

---

## 3. UI Components

### EventCard
Unlike Blog or Project cards (which are typically square or tall and image-focused), EventCards are structured differently:
- **Shape:** Rectangular horizontal layout (List view rather than Grid view).
- **Core Focus:** Typography prioritizes the `Date` and `Status Badge` above all else.
- **Actions:** Quick links mapping to the `resources` frontmatter (GitHub, Slides, etc.).

### LiveIndicator
- **Purpose:** A high-visibility visual cue for events where `status: "Live"`.
- **Implementation:** A pure CSS-based pulsing red dot (`bg-red-500 animate-pulse` or a custom concentric ring animation) attached to the event's status badge.

---

## 4. Search & Filter Architecture

The events system features a dual-filter synchronization strategy:

### Tag & Calendar Interaction
- **Search Bar Extraction:** The search bar intelligently parses `#tags` (e.g., typing `#web3` or `#hackathon`).
- **Intersection Logic:** When a user selects a date on the Interactive Calendar *and* types a `#tag` in the search bar, the main feed performs an **AND** filtering logic.
- **State Management:** The chosen date and search parameters are managed via a unified URL or local state hook, ensuring the Interactive Calendar visually reflects active filters.

---

## 5. Infrastructure & Maintainer Guardrails

If you are a developer or AI agent working on this system, adhere strictly to these project mandates:

### Asset Pathing Rule (Critical)
- **Base Path Compliance:** This site is deployed to GitHub Pages at the sub-path `/slashdot-website-2026/`.
- **No Relative Paths:** Every `resource` link or `gallery` image in the event frontmatter MUST be an absolute path starting with `/slashdot-website-2026/`.

### Design System Sync
- Adhere strictly to the "100% Theme Sync" rule. Use predefined CSS variables (`var(--color-primary)`, `var(--background)`) found in `src/app/globals.css`.
- Employ `mounted` state checks for any component dealing with real-time `status` determination relative to the current local browser time, avoiding Next.js hydration mismatches.
