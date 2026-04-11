# [FINAL] Slashdot Events System Documentation (2026)

This document reflects the finalized, high-performance Events System. It outlines the architecture, real-time logic, and interactive components that power the Slashdot IISER K club's events hub.

---

## 1. High-Performance Morphing Layout

The system uses a **Continuous Scroll Interpolation Engine** to manage the floating search hub with zero layout jitter.

### 🔄 3-Phase Search Bar & Contextual UI
The search bar (`z-[100]`) morphs across three phases as the user scrolls. Crucially, the **Placeholder Text** now intelligently updates to reflect its current state:
- **Phase 1 (Right)**: Medium width over the feed. *Placeholder: "Search events..."*
- **Phase 2 (Expansion)**: 100% full-width span. *Placeholder: "Search events, workshops, or use #tags..."*
- **Phase 3 (Left Dock)**: Minimized dock over the calendar. *Placeholder: "Search..."*

---

## 2. Real-Time Status Engine (IST Aware)

Static status fields (`Live`, `Upcoming`) in markdown have been replaced by a **Dynamic Status Hub** to eliminate manual maintenance.

### 🛰️ Automatic Lifecycle Management
The system utilizes a client-safe utility, [`eventUtils.ts`](file:///d:/Github/slashdot-website-2026/src/lib/eventUtils.ts), to calculate event status in real-time:
- **Timezone Sensitivity**: Explicitly handles **IST (UTC+5:30)** parsing for the club's events.
- **Heartbeat Sync**: Every `EventCard` maintains a 30-second heartbeat. If an event starts while a user is on-page, the **"LIVE"** pulse badge triggers instantly.
- **Hydration Stability**: Status is synced post-mount to ensure the server-rendered HTML perfectly matches the client's local clock without flickering.

### 📅 Hybrid Multi-Day Events
The engine natively supports two formats for events spanning multiple days, properly parsing strict ` - ` delimiters to avoid ISO date collision bugs:

#### Option A: Continuous Ranges
- **Frontmatter**: `date: "2026-04-13 - 2026-04-15"` with a single `time`.
- **Behavior**: Handled as one continuous block. Stays **LIVE** 24/7 from the start time on Day 1 until the end time on the final day.

#### Option B: Custom Schedules (Oscillating)
- **Frontmatter**: An array of `schedule: [{ date: "...", time: "..." }]` overriding the top-level time.
- **Behavior (Oscillation)**: The badge shows **LIVE** during each scheduled session. Between sessions (e.g., overnight), it intelligently flips back to **UPCOMING** instead of prematurely dying. It only shifts to **PAST** when the absolute final session concludes.

---

## 3. Interactive Calendar & Year View

The sidebar calendar has been upgraded to a multi-modal navigation hub.

### 📅 Advanced Year View
Clicking the "Month Year" header toggles a comprehensive **3x4 Month Selection Grid**:
- **GitHub Contribution Heatmap**: Months are shaded based on event density (Light Teal: 1-2, Deep Teal: 4+) to help users "scout" the year.
- **Orientation**: The actual current month is highlighted with a **Primary Underline**.
- **Year Navigation**: Navigation arrows automatically switch to **Year-Mode** when in the grid view.

---

## 4. UI Components & Card Physics

### 🏗️ Event Cards
- **Unified Borders**: Cards, the Search Bar, and the Calendar all share a matched **2px Brand-Teal Border** aesthetic (`border-2 border-primary/xx`).
- **Hardware-Accelerated Physics**: Cards use `transform-gpu` to initialize a dedicated browser layer, ensuring the **8px vertical lift** on hover is smooth and lag-free.
- **Opacity Rings**: Hover rings are synced to **80% opacity** to match the Blog and Project grid systems exactly.

---

## 5. Architectural Guardrails

### 🔒 Client-Server Decoupling
To avoid build errors related to Node.js `fs` (File System) in the browser, all date-parsing and status logic is isolated in `src/lib/eventUtils.ts`. 

> [!CAUTION]
> **NEVER** import from `src/lib/events.ts` inside a Client Component. Always use `eventUtils.ts` for time calculations or props-passing for data.

### 🌊 60FPS Performance
- **No CSS Transitions on Layout**: When modifying the search bar's width or transform, avoid using CSS `transition-all`. Use the `handleScroll` math engine to update styles directly for 1:1 scroll locking.

---

**Last Updated**: 2026-04-12
**Status**: Production Ready / Performance Validated
