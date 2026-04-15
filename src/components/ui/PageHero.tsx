"use client";

import { HeroCanvas } from "@/components/home/HeroCanvas";

interface PageHeroProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * PageHero — Wraps any page header content with the HeroCanvas background.
 *
 * The canvas is rendered at full viewport size (100vw × 100vh) inside the
 * relative+overflow-hidden container, so the container *crops* the canvas
 * rather than squeezing/scaling it. This keeps symbol density identical
 * to the homepage canvas.
 *
 * Use this in Server Components to safely include the client-side canvas
 * without making the entire page a client component.
 */
export function PageHero({ children, className = "" }: PageHeroProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Viewport-sized canvas wrapper — cropped by overflow-hidden above */}
      <div
        className="absolute top-0 left-0 pointer-events-none"
        style={{ width: "100vw", height: "100vh" }}
      >
        <HeroCanvas opacity={100} />
      </div>
      {children}
    </div>
  );
}
