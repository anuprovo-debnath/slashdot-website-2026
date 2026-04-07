"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { flushSync } from "react-dom";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-9 w-9" />; // Placeholder to avoid layout shift
  }

  const toggleTheme = (e: React.MouseEvent) => {
    const isDark = resolvedTheme === "dark";
    const nextTheme = isDark ? "light" : "dark";

    // Fallback if browser doesn't support startViewTransition
    if (!document.startViewTransition) {
      setTheme(nextTheme);
      return;
    }

    // 1. Get the scroll and viewport offsets
    // pageX/Y includes the document scroll
    // visualViewport.offsetTop/Left handles the address bar shift
    const vOffsetLeft = window.visualViewport?.offsetLeft || 0;
    const vOffsetTop = window.visualViewport?.offsetTop || 0;

    const x = e.clientX + vOffsetLeft;
    const y = e.clientY + vOffsetTop;

    // 2. Use documentElement dimensions for the radius
    // This ensures the circle covers the Layout Viewport (the snapshot)
    const { clientWidth: width, clientHeight: height } = document.documentElement;

    const endRadius = Math.hypot(
      Math.max(x, width - x),
      Math.max(y, height - y)
    );

    const transition = document.startViewTransition(async () => {
      flushSync(() => {
        setTheme(nextTheme);
      });
    });

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ];

      document.documentElement.animate(
        {
          clipPath: clipPath,
        },
        {
          // Adjust animation speed here (500 for normal speed; 50000 is 100x slower for debugging)
          duration: 1000,
          easing: "ease-in",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    });
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition-colors relative z-50"
      aria-label="Toggle theme"
    >
      <Moon className="h-5 w-5 dark:hidden" />
      <Sun className="h-5 w-5 hidden dark:block" />
    </button>
  );
}
