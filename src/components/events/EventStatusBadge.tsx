"use client";

import { useState, useEffect } from "react";
import { getEventStatus } from "@/lib/eventUtils";
import { EventData } from "@/lib/events";

interface EventStatusBadgeProps {
  event: Pick<EventData["frontmatter"], "date" | "time" | "schedule">;
}

export function EventStatusBadge({ event }: EventStatusBadgeProps) {
  const [status, setStatus] = useState<"Live" | "Upcoming" | "Past">(() =>
    getEventStatus(event)
  );

  useEffect(() => {
    // Immediate update to catch shifts
    setStatus(getEventStatus(event));

    const interval = setInterval(() => {
      setStatus(getEventStatus(event));
    }, 30000);

    return () => clearInterval(interval);
  }, [event]);

  const baseClasses =
    "inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold border uppercase tracking-widest shadow-sm transition-all duration-300";

  if (status === "Live") {
    return (
      <span
        className={`${baseClasses} border-live/30 text-live bg-live/10 shadow-[0_0_15px_rgba(var(--color-live-rgb),0.2)]`}
      >
        <span className="w-2 h-2 mr-2 bg-live rounded-full animate-pulse" />
        LIVE
      </span>
    );
  }

  if (status === "Upcoming") {
    return (
      <span
        className={`${baseClasses} border-upcoming/30 text-upcoming bg-upcoming/10`}
      >
        UPCOMING
      </span>
    );
  }

  return (
    <span
      className={`${baseClasses} border-foreground/20 text-foreground/70 bg-foreground/5`}
    >
      PAST
    </span>
  );
}
