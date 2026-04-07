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
    return <div className="h-9 w-9" />;
  }

  const toggleTheme = (e: React.MouseEvent) => {
    const isDark = resolvedTheme === "dark";
    const nextTheme = isDark ? "light" : "dark";

    if (!document.startViewTransition) {
      setTheme(nextTheme);
      return;
    }

    // --- MOBILE CORRECTION LOGIC ---
    // 1. Create a temporary element to measure 100lvh (the snapshot height)
    const measure = document.createElement("div");
    measure.style.height = "100lvh";
    measure.style.position = "fixed";
    measure.style.visibility = "hidden";
    document.body.appendChild(measure);

    const lvh = measure.getBoundingClientRect().height;
    const viewH = window.visualViewport?.height || window.innerHeight;
    const barHeight = lvh - viewH;

    // Clean up measurement element
    document.body.removeChild(measure);

    // 2. Calculate coordinates
    // We add barHeight to e.clientY to shift the circle down 
    // from the browser UI into the snapshot area.
    const x = e.clientX;
    const y = e.clientY + barHeight;

    const width = document.documentElement.clientWidth;
    // We use lvh here for the radius to ensure it covers the full snapshot
    const endRadius = Math.hypot(width, lvh);

    const transition = document.startViewTransition(async () => {
      flushSync(() => {
        setTheme(nextTheme);
      });
    });

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 500, // Back to a snappy 500ms
          easing: "ease-in-out",
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