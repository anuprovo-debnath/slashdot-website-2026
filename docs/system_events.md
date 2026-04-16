# [FINAL] Slashdot Events System Documentation (2026)

This document reflects the finalized, high-performance Events System. It outlines the architecture, real-time logic, and interactive components that power the Slashdot IISER K club's events hub.

---

## 1. High-Performance Morphing Layout

The system uses a **Continuous Scroll Interpolation Engine** to manage the floating search hub with zero layout jitter.

### 🔄 3-Phase Search Bar & Contextual UI
The search bar (`z-[40]`) morphs across three phases as the user scrolls. Crucially, the **Placeholder Text** now intelligently updates to reflect its current state:
- **Phase 1 (Right)**: Medium width over the feed. *Placeholder: "Search events..."*
- **Phase 2 (Expansion)**: 100% full-width span. *Placeholder: "Search events, workshops, or use #tags..."*
- **Phase 3 (Left Dock)**: Minimized dock over the calendar column. *Placeholder: "Search..."*

### 📏 Unified Vertical Spacing
To ensure design consistency, the system uses a **24px Vertical Cadence** matching the `gap-6` card spacing:
- **Navbar Gap**: 24px spacing below the 88px navbar (`STICKY_TOP_PX: 112`).
- **Docked Gap**: 24px spacing between the docked search bar and calendar.
- **Card Gutter**: 24px spacing between all event cards.

---

## 2. 🏗️ 2026 Mobile UX Overhaul

The Events page features a dedicated architecture for mobile devices that prioritizes horizontal space and vertical efficiency.

### 📱 Phased Mobile Anchoring
On mobile, the header system operates in a "phased" attachment mode to ensure no visual gaps:
- **Phase 1 (Scrolling Search)**: The search bar is placed at the top of the feed and scrolls away freely to maximize viewport real estate.
- **Phase 2 (Gapless Follow)**: The Weekly Calendar follows the search bar's bottom edge (16px gap) while the search bar is still in view.
- **Phase 3 (Navbar Lock)**: Once the calendar reaches the bottom of the Navbar (`89px`), it locks into a `fixed` position. This is handled by a high-performance math engine using `parentRef` as a baseline.

### 🗓️ Weekly Focus Mode
- **Mobile Default**: On small screens, the calendar automatically defaults to **Weekly View**.
- **Self-Centering**: When the user is at the top of the page, the calendar automatically focuses on the **Current Week (Today)**.
- **Toggleable Expansion**: Users can still toggle to a full **Monthly View** via the view switcher, which is hidden by default on desktop.

### ⚡ Jitter-Free Scroll Physics
To ensure premium "glassy" movement on mobile:
- **RAF Execution**: All coordinate updates happen inside `requestAnimationFrame` to match the display refresh rate.
- **GPU Promotion**: The sticky container uses `translate3d` and `will-change: transform` to offload painting to the GPU.
- **Memoized Hub**: The `InteractiveCalendar` is wrapped in `React.memo` to prevent re-renders of the calendar grid during active scroll-movement.

---

## 3. Content-Bound Sidebar & LERP Engine

The sidebar is not just `sticky`; it's a **Fixed Content-Aware Overlay** that tracks the event feed vertically.

### 🧬 Continuous Scroll LERP Engine
The system uses a linear interpolation (LERP) handler to calculate the calendar's `translateY` offset in real-time. This prevents layout jumps during the search bar expansion:
- **X ↔ Y Alignment**: The engine transitions between aligning with the parent container's top and the search bar's current bottom.
- **Content Bounding**: The calendar is strictly clamped between the top of the first card and the bottom of the last card (`CARDS_BTM_PAD`).
- **Performance**: Transitions are applied directly via DOM styles inside a passive scroll listener, bypassing the React render loop for 60FPS smoothness.

---

## 4. Real-Time Status Engine (IST Aware)

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

## 5. Interactive Calendar & Year View

The sidebar calendar has been upgraded to a multi-modal navigation hub.

### 📅 Advanced Year View
Clicking the "Month Year" header toggles a comprehensive **3x4 Month Selection Grid**:
- **GitHub Contribution Heatmap**: Months are shaded based on event density (Light Teal: 1-2, Deep Teal: 4+) to help users "scout" the year.
- **Orientation**: The actual current month is highlighted with a **Primary Underline**.
- **Year Navigation**: Navigation arrows automatically switch to **Year-Mode** when in the grid view.

### 🔄 Scroll-Active Synchronization
The calendar's internal state is bi-directionally synced with the viewport:
- **Date Picking**: Selecting a date in the calendar immediately filters the feed.
- **Auto-Month Flip**: As the user scrolls through the timeline, the calendar automatically flips to the month of the currently visible event using a `lastActiveDate` intersection tracker.

---

## 6. Global Live Integration & Resources

The Events System is now globally integrated into the site's brand awareness.

### 🛰️ Section 6a: Live Status Hub
- **Navbar Heartbeat**: The primary Navbar maintains a **30s recursive heartbeat** that fetches the event index and triggers a pulsing red "Live" dot next to the "Events" link if any workshop or hackathon is active.
- **Card-Level Feedback**: Active events on the Events page receive a `bg-live/20` highlight in the calendar and a high-contrast pulsing status badge on the `EventCard`.
- **IST Synchronization**: Both the site-wide and page-level hubs utilize `eventUtils.ts` to ensure perfect alignment with IST (UTC+5:30) timezones.

### 🛠️ Section 6b: Resource Integration
Every event can now attach external hubs in its frontmatter:
- **Automatic Chip Generation**: The `EventCard` detects `github`, `youtube`, and `website` keys in the `resources` block.
- **Context-Aware Branding**: YouTube links leverage the **Live Red** theme, while GitHub links use **Neutral Mono** to maintain visual hierarchy.

## 7. UI Components & Card Physics

### 🏗️ Event Cards
- **Unified Borders**: Cards, the Search Bar, and the Calendar all share a matched **2px Brand-Teal Border** aesthetic (`border-2 border-primary/20`).
- **Hardware-Accelerated Physics**: Cards use `transform-gpu` to initialize a dedicated browser layer, ensuring the **8px vertical lift** on hover is smooth and lag-free.
- **Z-Index Hierarchy**: Desktop floating elements are tiered to stay below the Navbar (z-50):
  - Docked Bar: `z-[41]`
  - Sticky Bar Wrapper: `z-[40]`
  - Calendar Overlay: `z-[30]`

---

## 8. Architectural Guardrails

### 🔒 Client-Server Decoupling
To avoid build errors related to Node.js `fs` (File System) in the browser, all date-parsing and status logic is isolated in `src/lib/eventUtils.ts`. 

> [!CAUTION]
> **NEVER** import from `src/lib/events.ts` inside a Client Component. Always use `eventUtils.ts` for time calculations or props-passing for data.

### 🌊 60FPS Performance
- **No CSS Transitions on Layout**: When modifying the search bar's width or transform, avoid using CSS `transition-all`. Use the `handleScroll` math engine to update styles directly for 1:1 scroll locking.

---

**Last Updated**: 2026-04-16
**Status**: Production Ready / Mobile Overhaul Complete / LERP Validated
