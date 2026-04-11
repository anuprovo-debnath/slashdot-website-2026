import { EventData } from '@/lib/events';
import { getEventStatus } from '@/lib/eventUtils';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { TagPill } from './ui/TagPill';

interface EventCardProps {
  event: EventData;
}

export function EventCard({ event }: EventCardProps) {
  // Initialize with the status calculated during the build/fetch phase
  const [status, setStatus] = useState<'Live' | 'Upcoming' | 'Past'>(event.frontmatter.status);
  const { title, date, time, category, resources, schedule } = event.frontmatter;

  useEffect(() => {
    // Immediate update on mount to catch shifts since the server-render
    const current = getEventStatus(event.frontmatter);
    setStatus(current);

    const timer = setInterval(() => {
      setStatus(getEventStatus(event.frontmatter));
    }, 30000); 
    return () => clearInterval(timer);
  }, [event.frontmatter]);
  const formatRange = (rangeStr: string) => {
    const parts = rangeStr.split(' - ');
    if (parts.length === 1) {
      const parsed = new Date(parts[0]);
      return !isNaN(parsed.getTime()) ? parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : rangeStr;
    }
    const d1 = new Date(parts[0]);
    const d2 = new Date(parts[1]);
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return rangeStr;

    const m1 = d1.toLocaleDateString('en-US', { month: 'short' });
    const m2 = d2.toLocaleDateString('en-US', { month: 'short' });
    const y1 = d1.getFullYear();
    const y2 = d2.getFullYear();

    if (y1 !== y2) {
      return `${m1} ${d1.getDate()}, ${y1} - ${m2} ${d2.getDate()}, ${y2}`;
    }
    if (m1 === m2) {
       return `${m1} ${d1.getDate()} - ${d2.getDate()}, ${y1}`;
    }
    return `${m1} ${d1.getDate()} - ${m2} ${d2.getDate()}, ${y1}`;
  };

  const formattedDate = schedule && schedule.length > 0 ? "Multiple Dates" : formatRange(date);
  const displayTime = schedule && schedule.length > 0 ? "Scheduled Sessions" : time;

  return (
    <div className="group relative flex flex-col md:flex-row rounded-2xl bg-[var(--background)] ring-[3px] ring-[var(--color-primary)]/30 shadow-xl transition-all duration-300 ease-out transform-gpu hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(var(--color-primary-rgb),0.4)] dark:hover:shadow-[0_20px_50px_rgba(var(--color-primary-rgb),0.25)] hover:ring-[var(--color-primary)]/80 overflow-hidden p-6 gap-6 w-full z-10">
      {/* Absolute link mapping the card to details page */}
      <Link href={`/events/${event.slug}`} className="absolute inset-0 z-[10]" aria-label={`View details for ${title}`} />
      
      <div className="flex flex-row md:flex-col items-center md:items-start justify-between md:justify-start md:w-32 shrink-0 relative z-[20]">
        <div className="flex flex-col gap-2 pointer-events-none">
          <TagPill tag={category} className="w-fit pointer-events-auto" />
          <span className="text-2xl font-extrabold text-foreground tracking-tight font-sans leading-tight">{formattedDate}</span>
          <span className="text-xs text-foreground/50 mt-1 uppercase tracking-widest font-medium">{displayTime}</span>
        </div>
        <div className="mt-0 md:mt-4">
          <StatusBadge status={status} />
        </div>
      </div>

      <div className="flex flex-col flex-grow justify-between relative z-[20] pointer-events-none">
        <div>
          <h3 className="text-2xl font-extrabold group-hover:text-primary transition-colors line-clamp-2 leading-tight">
            {title}
          </h3>
          <p className="text-md text-foreground/70 mt-3 line-clamp-3 leading-relaxed opacity-90">
            {event.content}
          </p>
        </div>
        
        {resources && Object.keys(resources).length > 0 && (
          <div className="flex flex-wrap gap-2 mt-6 relative z-[20] pointer-events-none">
            {Object.entries(resources).map(([type]) => {
              let colorClass = 'bg-primary/5 text-primary border-primary/20';
              if (type.toLowerCase() === 'youtube') colorClass = 'bg-live/10 text-live dark:text-live/90 border-live/20';
              if (type.toLowerCase() === 'github') colorClass = 'bg-foreground/5 text-foreground border-foreground/10';

              return (
                <span 
                  key={type} 
                  className={`px-3 py-1 rounded-full border text-[10px] sm:text-[11px] font-bold uppercase tracking-wider whitespace-nowrap ${colorClass}`}
                >
                  {type}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: EventData['frontmatter']['status'] }) {
  const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border uppercase tracking-wider";
  
  if (status === 'Live') {
    return (
      <span className={`${baseClasses} border-live/30 text-live bg-live/10 shadow-[0_0_10px_rgba(var(--color-live-rgb),0.2)]`}>
        <span className="w-2 h-2 mr-2 bg-live rounded-full animate-pulse" />
        LIVE
      </span>
    );
  }
  
  if (status === 'Upcoming') {
    return (
      <span className={`${baseClasses} border-upcoming/30 text-upcoming bg-upcoming/10`}>
        UPCOMING
      </span>
    );
  }

  return (
    <span className={`${baseClasses} border-foreground/30 text-foreground/60 bg-foreground/5`}>
      PAST
    </span>
  );
}
