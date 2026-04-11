# Slashdot Search System — Architecture Reference

> **Last Updated**: 2026-04-12  
> **Status**: Production  
> **Owner**: Slashdot Core Team

This document is the single source of truth for the Slashdot Universal Discovery System — a build-time-indexed, client-side fuzzy search engine with command-line syntax, tag-first discovery, and relational entity support.

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Build-Time Indexer](#2-build-time-indexer)
3. [Query Command Syntax](#3-query-command-syntax)
4. [Search Engine (Fuse.js)](#4-search-engine-fusejs)
5. [Keyboard Navigation](#5-keyboard-navigation)
6. [Tag-First Discovery](#6-tag-first-discovery)
7. [Relational Entities](#7-relational-entities)
8. [State Management & Persistence](#8-state-management--persistence)
9. [UI & Visual Specifications](#9-ui--visual-specifications)
10. [View Transitions API](#10-view-transitions-api)
11. [Component Map](#11-component-map)

---

## 1. System Overview

The search system is **entirely static and client-side**. There is no API call at search time. Instead:

1. A Node.js script runs **before every build and dev server start** to scan all `content/` directories.
2. It writes a single `public/search-index.json` file containing all indexed items.
3. On the client, `SearchOverlay.tsx` fetches `search-index.json` once, dynamically imports Fuse.js, and runs all fuzzy matching in-browser.

```
Build time                        Runtime (browser)
─────────────────────             ──────────────────────────────────────
scripts/generate-search-index.js  → fetch('/search-index.json')
  scans content/{blog,events,      → import('fuse.js') [lazy]
    projects,funzone}              → Fuse.search(query)
  writes public/search-index.json → render results
```

**Why this architecture?**  
- Zero server-side runtime overhead (compatible with `output: 'export'`)
- Fuse.js is loaded lazily on first `Ctrl + K`, keeping initial page load light
- `localStorage` history is hydration-safe (gated behind a `mounted` check)

---

## 2. Build-Time Indexer

**File**: `scripts/generate-search-index.js`  
**Triggered by**: `npm run dev` and `npm run build` (via `predev` / `prebuild` hooks in `package.json`)

### 2a. Scanned Directories

| Directory | Index `type` |
| --- | --- |
| `content/blog/` | `"blog"` |
| `content/events/` | `"event"` |
| `content/projects/` | `"project"` |
| `content/funzone/` | `"funzone"` |

### 2b. Index Item Schema

Each `.md` / `.mdx` file produces one entry:

```ts
interface SearchIndexItem {
  id: string;          // e.g. "blog-my-first-post"
  title: string;       // frontmatter.title (fallback: slug)
  type: 'blog' | 'event' | 'project' | 'funzone';
  slug: string;        // filename without extension
  tags: string[];      // frontmatter.tags OR tech_stack; always includes category
  description: string; // frontmatter.description / excerpt / content snippet (200 chars)
  category: string;    // frontmatter.category (e.g. "Workshop", "Internal_Tools")
  date: string;        // frontmatter.date
  image: string;       // frontmatter.image or coverImage (used for funzone thumbnails)
  url: string;         // frontmatter.url (used for external game links)
  author: string;      // frontmatter.author (blog posts)
  projectType: string; // frontmatter.category (projects, for type: searches)
}
```

### 2c. Tag Merging Logic

The `tags` array is built by merging all label sources so that every pill rendered on a card is also searchable:

```js
const rawTags = frontmatter.tags ?? frontmatter.tech_stack ?? [];
const category = frontmatter.category ?? '';
const tags = category ? [...new Set([...rawTags, category])] : rawTags;
```

> [!IMPORTANT]
> If you add a new content field that is rendered as a clickable pill, you **must** also include it in the `tags` array or add it as a dedicated key in the Fuse.js configuration. Otherwise clicking the pill will produce no results.

### 2d. Graceful Failure
- Files without frontmatter are skipped with a `console.warn`.
- Individual file parse errors are caught and logged without halting the build.
- Missing `content/` directories print a warning and are skipped.

---

## 3. Query Command Syntax

The search input supports a structured command language: `[scope]/ [prefix][query]`

### 3a. Scopes

Typing a scope followed by `/` instantly filters the Fuse.js data to that subset:

| Scope | Content filtered |
| --- | --- |
| `blog/` | Blog posts only |
| `events/` | Events only |
| `projects/` | Projects only |
| `funzone/` | Fun Zone items only |
| `all/` | Everything (default when no scope given) |

**Example**: `events/ React` searches only events for "React".

### 3b. Query Prefixes

After the scope, the following prefixes shift Fuse.js into a specialised mode:

| Prefix | Mode | Example |
| --- | --- | --- |
| *(none)* | Normal full-text | `blog/ design system` |
| `#` | Tag-first | `all/ #Workshop` |
| `@` | Author | `all/ @Slashdot Core` |
| `type:` | Project type | `projects/ type:Internal_Tools` |

Each prefix mode re-weights the Fuse.js keys and lowers the fuzzy threshold for precision. See [Section 4](#4-search-engine-fusejs) for exact weights.

### 3c. Scope Transition (View Transitions)

When the parsed `activeScope` changes (e.g. user types `blog/` after `events/`), the UI wraps the state update in `document.startViewTransition` so the results area morphs fluidly.

---

## 4. Search Engine (Fuse.js)

**Library**: `fuse.js` (dynamically imported on first open)  
**File**: `src/components/ui/SearchOverlay.tsx` — Effect `// 5. Build Fuse Instance`

### 4a. Mode Detection

The `useMemo` hook that parses the query also derives four stable boolean flags. These — not `searchTerms` itself — are used as the `useEffect` dependency, so Fuse only **rebuilds when the mode flips**, not on every keystroke:

```ts
const { activeScope, searchTerms, isTagMode, isAuthorMode, isTypeMode } = useMemo(() => {
  // parse query → return all five values
}, [query]);
```

### 4b. Fuse.js Weight Table

| Mode | Triggered by | `tags` | `title` | `description` | `author` | `projectType` | Threshold |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **Normal** | *(no prefix)* | 0.7 | **1.0** | 0.4 | 0.3 | — | 0.40 |
| **Tag** (`#`) | `#` prefix | **1.0** | 0.2 | 0.1 | — | — | 0.30 |
| **Author** (`@`) | `@` prefix | — | 0.1 | — | **1.0** | — | 0.25 |
| **Type** (`type:`) | `type:` prefix | — | 0.1 | — | — | **1.0** | 0.25 |

### 4c. Prefix Stripping Before Search

The prefix character is stripped before the query reaches `fuseInstance.search()`:

| Mode | Raw input | Sent to Fuse |
| --- | --- | --- |
| Tag | `#Workshop` | `Workshop` |
| Author | `@Slashdot Core` | `Slashdot Core` |
| Type | `type:Internal_Tools` | `Internal_Tools` |

> [!WARNING]
> Forgetting to strip the prefix is the most common bug in this system. Tags stored in the index are plain strings (`"Workshop"`) — Fuse will return zero results if you search `"#Workshop"` against them.

---

## 5. Keyboard Navigation

The search hub is designed to be fully operable without a mouse.

### 5a. Global Shortcuts

| Key | Action |
| --- | --- |
| `Ctrl + K` / `Cmd + K` | Open / close the Search Hub |
| `Escape` | Close the Search Hub |

### 5b. In-Overlay Navigation

| Key | Action |
| --- | --- |
| `ArrowDown` | Move selection to the next result |
| `ArrowUp` | Move selection to the previous result |
| `Enter` | Navigate to the active result's URL |

### 5c. Active State Behaviour

- `activeIndex` resets to `0` whenever `query` or `activeScope` changes.
- The active result card receives `border-primary`, `bg-primary/5`, a pulsing dot, and `aria-selected="true"`.
- `scrollIntoView({ block: 'nearest' })` is called automatically to keep the selection visible in long lists.

---

## 6. Tag-First Discovery

Tags are the primary navigation primitive across the platform. Every tag rendered anywhere in the UI is also a search trigger — there is no context break between browsing and searching.

### 6a. TagPill Component

**File**: `src/components/ui/TagPill.tsx`

```
Click → e.preventDefault() + e.stopPropagation()
      → document.startViewTransition
        → flushSync
          → window.dispatchEvent(slashdot:open-search, { query: 'all/ #TagName' })
```

**Used in**: `BlogGrid`, `ProjectGrid`, `EventCard`, `TagSystem`, all `[slug]/page.tsx` detail pages, `fun-zone/page.tsx`.

### 6b. TagSystem Component

**File**: `src/components/ui/TagSystem.tsx`

Wraps `TagPill` with overflow management. When the tag list in a card footer exceeds one row, it collapses with a `...` trigger that opens a full tag dialogue portal.

### 6c. Input Chip Display

When a `#` tag is active in the search bar, a teal chip appears **before** the input cursor:

```
[ blog/ ] [ # Tag: Workshop ] [___________________]
```

---

## 7. Relational Entities

Beyond content tags, the system supports clickable **people** (authors) and **structural labels** (project types) as first-class search entities.

### 7a. AuthorPill — `@` Author Search

**File**: `src/components/ui/AuthorPill.tsx`  
**Used in**: `BlogGrid`, `blog/[slug]/page.tsx`

**Behaviour**:
- Renders the author's name with a faint `@` prefix glyph.
- Click → dispatches `slashdot:open-search` with `{ query: 'all/ @AuthorName' }`.
- Wrapped in `document.startViewTransition`.

**Search mode**:
- Input chip colour: **Sky blue** (`bg-sky-500`)
- Fuse keys: `author: 1.0`, `title: 0.1`, threshold `0.25`
- UX: A sky-blue banner reading *"Posts by [Author]"* appears above the results list.

### 7b. TypePill — `type:` Project Type Search

**File**: `src/components/ui/TypePill.tsx`  
**Used in**: `ProjectGrid`, `projects/[slug]/page.tsx`

**Behaviour**:
- Renders with a `📁` folder icon and violet accent colour.
- Click → dispatches `slashdot:open-search` with `{ query: 'projects/ type:CategoryName' }`.
- Wrapped in `document.startViewTransition`.

**Search mode**:
- Input chip colour: **Violet** (`bg-violet-500`)
- Fuse keys: `projectType: 1.0`, `title: 0.1`, threshold `0.25`

### 7c. Input Chip Summary

| Pill type | Query format | Chip colour | Icon |
| --- | --- | --- | --- |
| `TagPill` | `all/ #TagName` | Teal (primary) | `#` |
| `AuthorPill` | `all/ @AuthorName` | Sky blue | `@` |
| `TypePill` | `projects/ type:Category` | Violet | `📁` |

### 7d. EventCard Categories

Event `category` values (`Workshop`, `Seminar`, `Hackathon`) are rendered via `TagPill` directly. They are merged into the `tags` array at index build time so a `#Workshop` search returns all relevant events.

---

## 8. State Management & Persistence

### 8a. Recent Search History

- **Storage key**: `slashdot_search_history` (localStorage)
- **Depth**: 3 most recent queries
- **Logic**: FIFO with deduplication — repeating a query promotes it to the front.
- **Trigger**: Saved on `handleSelect` (when the user navigates to a result).

### 8b. Hydration Safety

> [!IMPORTANT]
> All `localStorage` reads are gated behind `isMounted` state. This prevents Next.js hydration mismatches since the server renders an empty history state while the client may have data.

```ts
const [isMounted, setIsMounted] = useState(false);
useEffect(() => {
  setIsMounted(true);
  const saved = localStorage.getItem('slashdot_search_history');
  if (saved) setRecentSearches(JSON.parse(saved));
}, []);

if (!isMounted || !isOpen) return null; // Never render on server
```

### 8c. Additional Visited Tracking

Separate `localStorage` keys are used for visited-state indicators on cards:

| Key | Purpose |
| --- | --- |
| `slashdot_visited_blogs` | Controls "Latest" vs "New" badge visibility |
| `slashdot_visited_funzone` | Tracks Fun Zone card interactions |

---

## 9. UI & Visual Specifications

### 9a. Overlay

| Property | Value |
| --- | --- |
| Backdrop | `backdrop-blur-xl bg-background/80` |
| Modal max width | `max-w-2xl` |
| Modal max height | `max-h-[70vh]` |
| Open animation | `animate-in zoom-in-95 duration-200` |
| z-index | `9999` |
| Opens at | `pt-[12vh]` from the top |

### 9b. Results Grouping

Results are always rendered grouped by type in this order:
1. Events
2. Blogs
3. Projects
4. Fun Zone

Each group has a header using the **Tan=3 matrix accent** (low-opacity `opacity-[0.08]` SVG stroke pattern in primary colour) as a subtle background.

### 9c. Funzone Thumbnails

When a Funzone result has a non-empty `image` field, a `40×40px` rounded thumbnail is displayed to the left of the result title. External images (Unsplash URLs) are used directly; local images use the repo's base path.

### 9d. Result Card States

| State | Style |
| --- | --- |
| Default | `border-transparent hover:bg-primary/10` |
| Active (keyboard) | `bg-primary/5 border-primary scale-[1.01]` + pulsing dot + chevron shift |
| Active (ARIA) | `aria-selected="true"` |

---

## 10. View Transitions API

All significant state changes in the search system are wrapped in `document.startViewTransition`. The pattern used throughout is:

```ts
const dispatch = () => {
  // state update
};

if (!document.startViewTransition) {
  dispatch(); // Graceful fallback for unsupported browsers
  return;
}

document.startViewTransition(() => {
  flushSync(dispatch); // flushSync ensures React commits before the snapshot
});
```

### Applied to:
| Trigger | What transitions |
| --- | --- |
| `Ctrl + K` | Overlay open/close |
| Scope change (`blog/` → `events/`) | Results re-grouping |
| `TagPill` click | Card → Search Hub |
| `AuthorPill` click | Card author → Search Hub |
| `TypePill` click | Project card → Search Hub |

> [!TIP]
> `flushSync` is required. Without it, `document.startViewTransition` captures the DOM **before** React's state update, resulting in the transition animating from the old state to the old state (a no-op visually).

---

## 11. Component Map

```
src/components/ui/
├── SearchOverlay.tsx      — Main search modal. Global Ctrl+K listener. Fuse.js engine.
├── TagPill.tsx            — Clickable tag that dispatches  all/ #Tag
├── TagSystem.tsx          — Tag area with overflow management (wraps TagPill)
├── AuthorPill.tsx         — Clickable author that dispatches  all/ @Author
└── TypePill.tsx           — Clickable project type that dispatches  projects/ type:X

src/components/
├── BlogGrid.tsx           — Uses AuthorPill + TagSystem
├── ProjectGrid.tsx        — Uses TypePill + TagSystem
└── EventCard.tsx          — Uses TagPill for category

src/app/
├── blog/[slug]/page.tsx   — Uses AuthorPill + TagPill
├── events/[slug]/page.tsx — Uses TagPill for category
├── projects/[slug]/page.tsx — Uses TypePill + TagPill
└── fun-zone/page.tsx      — Uses TagPill in MemeCard, GameCard, ArtCard

scripts/
└── generate-search-index.js  — Build-time indexer → public/search-index.json

public/
└── search-index.json      — Generated artifact. DO NOT edit manually.

docs/
└── search_system.md       — This file.
```

> [!CAUTION]
> `public/search-index.json` is a **generated file**. Any manual edits will be overwritten on the next `npm run dev` or `npm run build`. To change what is indexed, modify `scripts/generate-search-index.js` or the frontmatter of the relevant content files.
