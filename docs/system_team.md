# Slashdot Team System Documentation (2026)

Technical reference for the Team page at `/team`, including the flip-card grid, alumni toggle, journey timeline, and search integration.

---

## Table of Contents
1. [Architecture Overview](#1-architecture-overview)
2. [Content Schema](#2-content-schema)
3. [MemberFlipCard Component](#3-memberflipcard-component)
4. [Alumni Toggle](#4-alumni-toggle)
5. [Journey Timeline](#5-journey-timeline)
6. [Search Integration](#6-search-integration)
7. [Content Creation Guide](#7-content-creation-guide)
8. [Maintenance Guidelines](#8-maintenance-guidelines)

---

## 1. Architecture Overview

The Team page is split into a Server Component root and a Client Component shell:

- **`src/app/team/page.tsx`** (Server): Reads all `content/team/*.md` files at build time, sorts members (current before alumni), and passes them as props.
- **`src/components/TeamDashboard.tsx`** (Client): Manages the Alumni Toggle state and renders the filtered grid.
- **`src/components/ui/MemberFlipCard.tsx`** (Client): Individual 3D flip card for each member.
- **`src/components/ui/JourneyTimeline.tsx`** (Client): The "Our Journey So Far" vertical timeline.

---

## 2. Content Schema

Each team member is defined as a markdown file in `content/team/`. The `slug` (filename without `.md`) is used as the anchor ID (`/team#slug`).

```yaml
---
name: "Anuprovo Debnath"
position: "Lead Developer"
bio: "A short description about the member, their interests, and role in the club."
image: "/images/team/anuprovo-debnath.jpg"    # Stored in public/images/team/
committee: "Lead"          # Enum: Lead | Dev | Design | PR
tenure: "2025-2026"        # Active years in the club
tech_stack:
  - "Next.js"
  - "TypeScript"
  - "Tailwind CSS"
isAlumni: false            # false = Current member, true = Alumni
socials:
  github: "https://github.com/anuprovo-debnath"
  linkedin: "https://linkedin.com/in/..."
  twitter: "https://twitter.com/..."      # Optional
  portfolio: "https://..."                # Optional
---
```

> [!IMPORTANT]
> The `committee` value must be one of: `Lead | Dev | Design | PR`. Other values will not match the filter UI categories.

### Fields Reference

| Field | Type | Required | Notes |
| :--- | :--- | :--- | :--- |
| `name` | String | ✅ | Mapped to `title` + `author` in the search index |
| `position` | String | ✅ | Displayed on the card front |
| `bio` | String | ✅ | Displayed on hover (back face) |
| `image` | String | ✅ | Path relative to `public/` |
| `committee` | Enum | ✅ | Used for alumni toggle filter categories |
| `tenure` | String | ✅ | e.g., `"2024-2025"` |
| `tech_stack` | String[] | ✅ | Rendered as clickable `TagPill` components on back face |
| `isAlumni` | Boolean | ✅ | Controls which grid the member appears in |
| `socials` | Object | Partial | At least one social link is recommended |

---

## 3. MemberFlipCard Component

A CSS 3D flip card with a front and back face. The flip is triggered purely in CSS using `group-hover:` on the card container and `rotateY(180deg)`.

### Front Face
Displays:
- **Member avatar** (`next/image`, `object-cover`)
- **Name** — `font-heading` (Arista Pro Bold)
- **Position / Role**
- **Committee badge** — styled with the site's primary color

### Back Face (revealed on hover / tap)
Displays:
- **`tech_stack`** mapped as `<TagPill>` components. Clicking any tag opens the Global Search with `all/ #TagName`.
- **Social links** — icons from `react-icons/fa6` for GitHub, LinkedIn, Twitter, Portfolio.
- **Bio text** — `line-clamp-4` to keep the back face tidy.

### 3D Flip Physics
- **Container**: `perspective: 1000px` on the outer wrapper.
- **Inner**: `transform-style: preserve-3d; transition: transform 0.6s ease`.
- **Back face**: `backface-visibility: hidden; rotateY(180deg)` at rest. Set to `rotateY(0deg)` on hover state.
- **Front face**: `backface-visibility: hidden`.

### Alumni Styling
Alumni cards receive a `grayscale` filter and slightly reduced opacity in their default state. On hover, `grayscale-0` restores full color — documented in the Touch-Parity CSS as `hover:grayscale-0:active`.

---

## 4. Alumni Toggle

A boolean switch positioned above the team grid that filters between **Current** and **Legacy (Alumni)** members.

- **State**: Managed in `TeamDashboard.tsx` with `useState<boolean>(false)`.
- **Current** (`isAlumni: false`): Shows only active club members.
- **Legacy** (`isAlumni: true`): Shows only alumni members.
- **Transition**: The grid re-renders with `animate-in fade-in` when the toggle changes.

The toggle is styled as a high-fidelity boolean switch with:
- A sliding pill indicator
- Primary brand color for the active state
- Smooth `transition-transform` animation on the indicator

---

## 5. Journey Timeline

Located in `src/components/ui/JourneyTimeline.tsx`. A vertical timeline that tells the club's history.

### Architecture
- **Spine**: A vertical center line styled with the `--color-primary` brand color.
- **Tan=3 Slant Accent**: The decorative details on timeline nodes use the 71° (`tan⁻¹(3)`) brand slant for consistency with the site's SVG matrix patterns.
- **Alternating Layout**: Events alternate left and right of the spine on desktop, stacking to a single column on mobile.
- **Hover Effect**: Timeline nodes scale to `scale-125` and the connecting line animates to `border-primary/50` on hover / touch.

### Touch-Parity
The timeline node hover effects (scale, translate, border color) are mirrored for mobile via `globals.css`:
```css
.group:active .group-hover\:scale-125 { transform: scale(1.25); }
.group:active .group-hover\:translate-x-3 { transform: translateX(0.75rem); }
```

---

## 6. Search Integration

### Build-Time Indexing
The `scripts/generate-search-index.js` indexer maps team member data as follows:

| Markdown Field | Index Field | Search Mode |
| :--- | :--- | :--- |
| `name` | `title` + `author` | Normal + `@Author` mode |
| `tech_stack` + `committee` | `tags` | `#Tag` mode |
| `bio` | `description` | Normal (weight 0.4) |
| `slug` → `/team#slug` | `url` | Navigation target |

### Tag Discovery
- Clicking a `TagPill` on a member's back face dispatches `slashdot:open-search` with query `all/ #TagName`.
- This finds all blog posts, projects, and **other team members** who share the same technology.

### Author Mode
- Clicking an `AuthorPill` on a blog post (e.g., post written by "Anuprovo Debnath") dispatches `all/ @Anuprovo Debnath`.
- Because `name` is indexed as `author`, the team member card surfaces as a result, allowing navigation directly to their `/team#slug` anchor.

---

## 7. Content Creation Guide

### Adding a New Member

1. Create `content/team/firstname-lastname.md` (use kebab-case for the slug).
2. Add all required frontmatter fields (see [Content Schema](#2-content-schema)).
3. Place the avatar image at `public/images/team/firstname-lastname.jpg`.
4. Re-run `npm run dev` or `npm run build` to regenerate the search index.

### Graduating a Member to Alumni

Change `isAlumni: false` to `isAlumni: true` in their `.md` file. No other changes needed — the alumni toggle will automatically move them to the Legacy grid.

---

## 8. Maintenance Guidelines

> [!CAUTION]
> Do NOT import `src/lib/events.ts` or other Node.js filesystem utilities inside `TeamDashboard.tsx` or `MemberFlipCard.tsx` — they are Client Components. Pass all data as props from the Server Component (`app/team/page.tsx`).

- **Card Geometry**: The `MemberFlipCard` dimensions are fixed (`h-[450px]`) to match the Blog and Project card grids for visual consistency.
- **Theme Sync**: All gradients and color values must use `var(--color-primary)`, `var(--color-background)`, and `var(--color-foreground)`. Never hardcode hex values.
- **Hydration**: Any browser-only API usage (e.g., `localStorage` for visited state) must be gated behind a `mounted` state check.
- **Search Index**: The `name` field becomes both `title` and `author` in the index. If a member's name changes, update the markdown file AND any blog posts where they are listed as `author` to maintain `@` search consistency.
