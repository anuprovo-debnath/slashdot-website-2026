# Slashdot Navbar & Navigation System (2026)

This document is the technical reference for `src/components/Navbar.tsx` — the global navigation and site-wide status hub for the Slashdot Website 2026.

---

## Table of Contents
1. [Core Philosophy](#1-core-philosophy)
2. [Visual Architecture](#2-visual-architecture)
3. [Logo & Brand System](#3-logo--brand-system)
4. [Global Search Trigger](#4-global-search-trigger)
5. [Live Event Heartbeat](#5-live-event-heartbeat)
6. [Scroll Progress Indicator](#6-scroll-progress-indicator)
7. [Theme Toggle Integration](#7-theme-toggle-integration)
8. [Mobile Drawer](#8-mobile-drawer)
9. [Touch-Parity System](#9-touch-parity-system)
10. [Event Bus & Custom Events](#10-event-bus--custom-events)
11. [Technical Specifications](#11-technical-specifications)
12. [Maintenance Guidelines](#12-maintenance-guidelines)

---

## 1. Core Philosophy

The Navbar is **unobtrusive yet powerful**. It surfaces the full utility of the site (search, navigation, live status, theme) in one compact strip, and is architecturally aware of other components — specifically the `LoadingScreen` and the Home Page fly-in animation — to avoid visual conflicts.

---

## 2. Visual Architecture

### Glassmorphism State
The Navbar uses a **permanent glassmorphism** style (always blurred, not conditional on scroll):

```tsx
className="border-black/10 dark:border-white/10 bg-[var(--color-bg)]/80 backdrop-blur-md py-3"
```

- **Background**: `bg-[var(--color-bg)]/80` — 80% opaque, theme-aware.
- **Blur**: `backdrop-blur-md` — smooth frosted glass over page content.
- **Border**: A persistent bottom border that respects both light and dark themes.
- **Position**: `fixed top-0 left-0 right-0 z-50` — always overlays content, never participates in document flow.

> **Note**: The previously-planned scroll-triggered conditional style was removed. The nav is always visually activated, providing cleaner aesthetics and removing edge-case glitches on scroll.

### Navigation Links

Defined in the `NAV_LINKS` constant at the top of the file — the only place that needs updating to add/remove routes:

| Link | Route | Notes |
| :--- | :--- | :--- |
| Team | `/team` | |
| Blog | `/blog` | |
| Projects | `/projects` | |
| Events | `/events` | Has `hasLiveDot: true` |
| Fun Zone | `/fun-zone` | |

Active detection uses `pathname.startsWith(link.href)` so nested routes (e.g., `/blog/my-post`) also highlight the "Blog" link.

---

## 3. Logo & Brand System

### Home Page Awareness
The Navbar logo (`#final-logo-pos`) is **hidden on the home page**:

```tsx
style={{
  opacity: pathname !== '/' ? (isLoaded ? 1 : 0) : 0,
  visibility: pathname !== '/' ? 'visible' : 'hidden'
}}
```

This allows `HomeHero.tsx` to exclusively control the fly-in morph. The navbar logo physically IS the hero text on the home page — there is no swap.

### Sub-Page Typewriter Reveal
On all non-home routes, the Navbar logo plays a staggered character-reveal animation once `shouldAnimate` becomes `true` (fired after the `LoadingScreen` exits):

- **`logo-char-reveal`**: Each letter of "Slashdot" fades in with a 160ms stagger (`--i` CSS variable × `--rev-char-stagger`).
- **`logo-dot-slide`**: The `/. ` suffix slides in from the left over 1.28 seconds.
- **Skipped Animation**: If the session was within the 10-minute window, `isSkipped: true` is passed via the `slashdot:loading-ready` event, and the logo reveals instantly with `setShouldAnimate(true)` immediately.

---

## 4. Global Search Trigger

The Navbar's search `<button>` dispatches a custom event to open the `SearchOverlay`:

```tsx
onClick={() => window.dispatchEvent(new CustomEvent('slashdot:open-search'))}
```

This event is also dispatched by `TagPill`, `AuthorPill`, `TypePill` with a query payload. The search icon appears in both the **desktop utility zone** and the **mobile header** (before the hamburger).

**Keyboard shortcut**: `Ctrl+K` / `Cmd+K` is handled directly inside `SearchOverlay.tsx`'s own `useEffect` listener and opens the same overlay from any page without needing the navbar button.

---

## 5. Live Event Heartbeat

The Navbar runs a 30-second interval to check if any event is currently "Live":

```tsx
const checkLiveStatus = async () => {
  const res = await fetch('/slashdot-website-2026/search-index.json', { cache: 'no-store' });
  const data = await res.json();
  const events = data.filter(item => item.type === 'event');
  const isLive = events.some(event => getEventStatus(event) === 'Live');
  setHasLiveEvent(isLive);
};
const interval = setInterval(checkLiveStatus, 30000);
```

### Visual Output
When `hasLiveEvent` is `true`:

- **Desktop**: A pulsing `animate-ping` red dot appears in the top-right corner of the "Events" nav link.
- **Mobile**: A 2.5px red dot appears over the hamburger menu icon.
- **Color**: Uses `bg-live` (`--color-live`, `#ef4444`) to visually indicate urgency.

The indicator is calculated using `getEventStatus()` from `lib/eventUtils.ts`, which handles all IST (UTC+5:30) timezone parsing.

---

## 6. Scroll Progress Indicator

A 2px bar runs along the bottom edge of the Navbar, tracking how far the user has scrolled through the page:

```tsx
<div
  className="absolute bottom-0 left-0 h-[2px] bg-[var(--color-primary)] transition-all duration-150 ease-out shadow-[0_0_8px_var(--color-primary)]"
  style={{ width: `${scrollProgress}%` }}
/>
```

- **Calculation**: `scrollProgress = (scrollY / (documentHeight - viewportHeight)) * 100`
- **Viewport Correction**: Uses `window.visualViewport?.height` to get the true visible height on mobile (excluding browser chrome), preventing the bar from maxing out prematurely.
- **Transition Guard**: A `isTransitioningRef` ref prevents the progress bar from jumping to 0% during a View Transition snapshot. The guard is released after `slashdot:transition-end` fires.

---

## 7. Theme Toggle Integration

The `<ThemeToggle />` component is embedded in both the desktop utility zone and the mobile header row. It uses the **View Transitions API** to animate a circular clip-path reveal from the toggle button's position. See [`src/components/ThemeToggle.tsx`](../src/components/ThemeToggle.tsx) for full implementation details.

---

## 8. Mobile Drawer

The mobile menu is extracted as a **sibling element** to the `<nav>`, positioned with `fixed top-[89px]`. This prevents it from being clipped by the Navbar's own `overflow: hidden` and ensures it floats above the hero canvas (`z-[70]`).

| Property | Value |
| :--- | :--- |
| Trigger | Hamburger `<Menu>` / Close `<X>` icon |
| State | `isOpen` boolean via `useState` |
| Animation | `max-h` + `opacity` CSS transition (300ms ease-in-out) |
| Height | `max-h-[calc(100vh-89px)]` when open |
| Border | Bottom border with `shadow-2xl` when open |

### JOIN Button Scroll Sync
The **"JOIN THE CLUB"** button in the mobile drawer performs a two-phase action on click:
1. Closes the drawer (`setIsOpen(false)`) and waits 300ms for its close animation to finish.
2. Then scrolls to `#join-us` in the Footer via `scrollIntoView({ behavior: 'smooth' })`.

This prevents scroll position jumps caused by the collapsing drawer height.

---

## 9. Touch-Parity System

The Navbar is fully wired into the global `TouchNavDelay` system:

- **`touchstart`** on a nav link immediately adds `.touch-nav-active` to its `.group` ancestor, triggering CSS hover-parity rules from `globals.css`.
- **Android Delay**: On Android, `router.push()` is delayed 250ms so "pill glow" and scale animations complete before the page unmounts.
- All Navbar interactive elements have matching `hover:bg-*` and corresponding `:active` rules in globals.css.

---

## 10. Event Bus & Custom Events

The Navbar both listens for and dispatches the following custom window events:

| Event | Direction | Purpose |
| :--- | :--- | :--- |
| `slashdot:loading-ready` | **Listens** | Triggers `setIsLoaded(true)` and the logo reveal animation |
| `slashdot:transition-start` | **Listens** | Sets `isTransitioningRef = true` (suppresses scroll updates) |
| `slashdot:transition-end` | **Listens** | Releases the transition guard, resyncs scroll position |
| `slashdot:open-search` | **Dispatches** | Opens the `SearchOverlay` (via search icon click) |

---

## 11. Technical Specifications

| Property | Value |
| :--- | :--- |
| **Component Path** | `src/components/Navbar.tsx` |
| **Rendering Strategy** | Client Component (`"use client"`) |
| **Position** | `fixed top-0 left-0 right-0 z-50` |
| **Height** | `h-16` inner content + `py-3` padding ≈ 89px total |
| **Icon Set** | Lucide React (`Search`, `Menu`, `X`) |
| **Live Interval** | `setInterval(checkLiveStatus, 30_000)` |
| **Failsafe Timer** | `setTimeout(() => setIsLoaded(true), 8000)` |
| **Route Awareness** | `usePathname()` from `next/navigation` |

---

## 12. Maintenance Guidelines

- **Adding a Route**: Update the `NAV_LINKS` array only. No component re-wiring required.
- **Live Dot Threshold**: To add a live indicator to another section, give its `NAV_LINKS` entry `hasLiveDot: true`. Supply the condition via the `hasLiveEvent` state (or extend the heartbeat logic).
- **Base Path Changes**: If `basePath` in `next.config.ts` changes, update the fetch URL in `checkLiveStatus` manually.
- **Logo Animation Timing**: Adjust `--rev-base-delay`, `--rev-char-stagger`, and `--rev-dot-duration` CSS custom properties defined inside the `<style jsx>` block in the component.
