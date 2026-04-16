"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * TouchNavDelay
 *
 * Solves two problems on mobile:
 *   1. CSS :active is released at touchend (before the click event fires), so
 *      hover-parity animations in globals.css never get a chance to be seen.
 *   2. On Android, Next.js client-side navigation fires synchronously inside
 *      the click handler, unmounting the page before any repaint can occur.
 *
 * Fix:
 *   - On touchstart over an internal link, add `.touch-nav-active` to the
 *     closest `.group` ancestor so the CSS animation fires immediately.
 *   - On Android, intercept the click in the capture phase, prevent default,
 *     and delay router.push() by 250 ms so the animation is visible.
 *   - The `.touch-nav-active` class is removed after the delay + a small buffer.
 */
export function TouchNavDelay() {
  const router = useRouter();

  useEffect(() => {
    // Only run on actual touch devices
    const isTouch = window.matchMedia(
      "(hover: none) and (pointer: coarse)"
    ).matches;
    if (!isTouch) return;

    const isAndroid = /Android/i.test(navigator.userAgent);
    const NAV_DELAY = isAndroid ? 250 : 0;

    // Track the group that's being animated so we can clean it up
    let pendingGroup: Element | null = null;
    let cleanupTimer: ReturnType<typeof setTimeout> | null = null;

    const clearPending = () => {
      if (cleanupTimer) clearTimeout(cleanupTimer);
      if (pendingGroup) {
        pendingGroup.classList.remove("touch-nav-active");
        pendingGroup = null;
      }
    };

    // ── touchstart: immediately add the class so CSS animations fire ──────────
    const handleTouchStart = (e: TouchEvent) => {
      clearPending();

      const link = (e.target as Element).closest("a[href]");
      if (!link) return;

      const group = link.closest(".group");
      if (group) {
        group.classList.add("touch-nav-active");
        pendingGroup = group;
      }
    };

    // ── touchcancel / touchend without navigation: clean up ──────────────────
    const handleTouchCancel = () => {
      // Give a short moment in case a click follows, then clean up
      cleanupTimer = setTimeout(clearPending, NAV_DELAY + 150);
    };

    // ── click (capture phase): delay navigation ──────────────────────────────
    const handleClick = (e: MouseEvent) => {
      const link = (e.target as Element).closest(
        "a[href]"
      ) as HTMLAnchorElement | null;
      if (!link) return;

      const hrefAttr = link.getAttribute("href");
      if (!hrefAttr) return;

      // Use the .href property to get the absolute URL for external check
      const absoluteHref = link.href;
      const isExternal = !absoluteHref.startsWith(window.location.origin);
      const isNewTab = link.target === "_blank";

      // If it's a new tab, don't prevent default or delay navigation.
      // The browser will open the tab. We just keep the touch-nav-active class
      // on the CURRENT page so the user sees the animation before they leave/switch.
      if (isNewTab) {
        cleanupTimer = setTimeout(clearPending, 500);
        return;
      }

      if (NAV_DELAY > 0) {
        e.preventDefault();
        setTimeout(() => {
          clearPending();
          if (isExternal) {
            window.location.href = absoluteHref;
          } else {
            // Next.js router.push() expects the path WITHOUT the basePath.
            // If the hrefAttr already includes it (rendered by <Link>), we must strip it.
            const basePath = "/slashdot-website-2026";
            let navPath = hrefAttr;
            if (navPath.startsWith(basePath)) {
              navPath = navPath.substring(basePath.length) || "/";
            }
            router.push(navPath);
          }
        }, NAV_DELAY);
      } else {
        cleanupTimer = setTimeout(clearPending, 300);
      }
    };

    document.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    document.addEventListener("touchend", handleTouchCancel, { passive: true });
    document.addEventListener("touchcancel", handleTouchCancel, {
      passive: true,
    });
    // capture: true so we intercept before Next.js/React handlers
    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchCancel);
      document.removeEventListener("touchcancel", handleTouchCancel);
      document.removeEventListener("click", handleClick, true);
      clearPending();
    };
  }, [router]);

  return null;
}
