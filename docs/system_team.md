# Slashdot Team System Documentation

This document outlines the architecture, data structure, and technical implementation logic for the Team Page system developed for the Slashdot website (2026). It follows the core design mandates of the project.

---

## 1. Data Structure Reference

The team data is stored as a JSON/Markdown schema defining each member. The schema incorporates the following fields:

- `name` (String): The full name of the member.
- `position` (String): The role of the member (e.g., "Frontend Developer").
- `bio` (String): A short biography.
- `image` (String): Path to the member's avatar image.
- `committee` (Enum): Assigned committee. Allowed values: `Dev` | `Design` | `PR` | `Lead`.
- `tenure` (String): Active years in the club (e.g., `'2025-2026'`).
- `tech_stack` (Array<String>): An array of strings that map dynamically to interactive `TagPill` components.
- `socials` (Object):
  - `github` (URL/String)
  - `linkedin` (URL/String)
  - `twitter` (URL/String)
  - `portfolio` (URL/String)
- `isAlumni` (Boolean): Flag indicating if the member is active (`false`) or an alumni (`true`).

---

## 2. UI Components

### MemberFlipCard
A 3D flip-animated, responsive card representing each team member. 

- **Front Face:** 
  - Displays the member's `name`, `position`, and `image` (Avatar).
  - Serves as the primary, default visual entry point in the grid.
- **Back Face:** 
  - Displays the member's `tech_stack` mapped as interactive **TagPills**.
  - Renders social link icons (`github`, `linkedin`, `twitter`, `portfolio`) for quick engagement.

### AlumniToggle
A high-fidelity boolean switch positioned above the team grid.
- **Functionality:** Filters the rendered grid based on the `isAlumni` flag. 
- **States:** Toggles seamlessly between **'Current'** (isAlumni: false) and **'Legacy'** (isAlumni: true).

---

## 3. Global Search Integration (Compatibility)

To maintain parity with the central unified Search System outlined in `search_system.md`, the Team System mandates strict adherence to the build-time indexing and relational tagging logic:

### 3a. Build-Time Indexer Integration
The team directory (`content/team/`) must be seamlessly ingested by `scripts/generate-search-index.js` during the pre-build hook.
- **Schema Mapping**: A member's `name` maps to the indexer's `title` (Normal search weight 1.0) and `author` (Author prefix weight 1.0) for `@` matching. 
- **Tag Merging**: The `tech_stack` array and the `committee` string must be merged securely into the unified `tags` array, ensuring searches (like `#NextJS` or `#Design`) pull up the associated members.
- **Routing**: The indexed `url` payload for a team entry must output the anchor payload `/team#slug`.

### 3b. Relational Entities Integration
- **@ Author Links**: Utilizing `AuthorPill.tsx`, clicking a name anywhere across the site triggers a search dispatch (`all/ @name`). Because the team member is indexed with their name mapped to the author field, they will surface in the hub allowing direct routing to their `MemberFlipCard`.
- **Global Tag System**: The `tech_stack` pills leverage `TagPill.tsx`. When clicked on the back face of the card, they dispatch `all/ #TagName` to search, maintaining the "zero context break" tag-first discovery paradigm.

---

## 4. "Our Journey" Timeline Component

A historical representation of the club's growth built centrally on the page.
- **Architecture:** A vertical Timeline Component illustrating the evolution path of the Slashdot club.
- **Design Mandate:** The central "spine" of the timeline must strictly utilize the **Tan=3 slant (71-degree angle)** established in the project's brand identity.

---

## 5. Aesthetics & Constraints

- **Template Parity:** The `MemberFlipCard` container must utilize the existing cards from the **Blog** and **Projects** sections as a design template (matching border-radii, spacing, and hover intent).
- **Theme Sync:** All gradients, backgrounds, and typography must fetch from predefined variables, ensuring 100% Theme Sync.
