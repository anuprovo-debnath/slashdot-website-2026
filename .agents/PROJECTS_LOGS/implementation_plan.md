# Implementation Plan: Project Showcase System

This plan details the implementation of the project showcase system as defined in `/docs/projects_system.md`.

## User Review Required

> [!IMPORTANT]
> The project system will reuse the `SlashdotFallbackCover` component to maintain brand consistency.
> The layout strictly adheres to the **450px card height** mandate.

## Proposed Changes

### Data & Logic

#### [NEW] [projects.ts](file:///d:/Github/slashdot-website-2026/src/lib/projects.ts)
- Implement `getProjects()` to fetch and parse Markdown files from `content/projects/`.
- Ensure sorting by date or status (Active first).

### Components

#### [NEW] [ProjectGrid.tsx](file:///d:/Github/slashdot-website-2026/src/components/ProjectGrid.tsx)
- Create a responsive grid (1, 2, or 3 columns).
- Implement `ProjectCard` with:
    - **Header**: Image or `SlashdotFallbackCover`.
    - **Status Badge**: Using themed colors for `Active`, `Maintained`, and `Archived`.
    - **Tech Stack**: Responsive list of tags.
    - **Links**: Actionable links for GitHub, Demo, and YouTube using `lucide-react`.
    - **Height**: Fixed at 450px.

### Pages

#### [NEW] [page.tsx](file:///d:/Github/slashdot-website-2026/src/app/projects/page.tsx)
- Main projects page fetching data from `src/lib/projects.ts`.
- Integrated with the site's layout and transitions.

### Content

#### [NEW] [example-project.md](file:///d:/Github/slashdot-website-2026/content/projects/example-project.md)
- A sample project file with all mandatory frontmatter fields to test the system.

## Verification Plan

### Automated Tests
- Build verification: Run `npm run build` to ensure static export compatibility.

### Manual Verification
- Verify responsive layout on mobile, tablet, and desktop views.
- Check theme-switching behavior on status badges and cards.
- Ensure all links in the project cards are functional and correctly styled.
