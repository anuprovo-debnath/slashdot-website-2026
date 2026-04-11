import type { EventData } from '@/lib/events';
import Link from 'next/link';

interface EventCardProps {
  event: EventData;
}

export function EventCard({ event }: EventCardProps) {
  const { title, date, time, category, status, resources } = event.frontmatter;
  
  const parsedDate = new Date(date);
  const formattedDate = !isNaN(parsedDate.getTime()) 
    ? parsedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : date;

  return (
    <div className="group relative flex flex-col md:flex-row rounded-2xl bg-[var(--background)] ring-[3px] ring-[var(--color-primary)]/30 shadow-xl transition-all hover:ring-[var(--color-primary)]/80 hover:shadow-[0_0_40px_rgba(2,145,178,0.4)] dark:hover:shadow-[0_0_40px_rgba(2,145,178,0.25)] hover:-translate-y-2 overflow-hidden p-6 gap-6 w-full z-10">
      {/* Absolute link mapping the card to details page */}
      <Link href={`/events/${event.slug}`} className="absolute inset-0 z-[10]" aria-label={`View details for ${title}`} />
      
      <div className="flex flex-row md:flex-col items-center md:items-start justify-between md:justify-start md:w-32 shrink-0 relative z-[20] pointer-events-none">
        <div className="flex flex-col">
          <span className="text-[10px] text-[var(--color-primary)] uppercase font-bold tracking-[0.2em] mb-1">{category}</span>
          <span className="text-2xl font-extrabold text-foreground tracking-tight">{formattedDate}</span>
          <span className="text-xs text-foreground/50 mt-1 uppercase tracking-widest font-medium">{time}</span>
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
          <div className="flex flex-wrap gap-3 mt-6">
            {Object.entries(resources).map(([type, url]) => (
              <a 
                key={type} 
                href={url as string} 
                target="_blank" 
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="pointer-events-auto text-[10px] font-black px-4 py-2 rounded-full border border-foreground/10 text-foreground bg-background hover:bg-primary hover:text-white hover:border-primary transition-all uppercase tracking-[0.15em] shadow-sm z-[30]"
              >
                {type}
              </a>
            ))}
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
      <span className={`${baseClasses} border-red-500/30 text-red-500 bg-red-500/10 shadow-[0_0_10px_rgba(239,68,68,0.2)]`}>
        <span className="w-2 h-2 mr-2 bg-red-500 rounded-full animate-pulse" />
        LIVE
      </span>
    );
  }
  
  if (status === 'Upcoming') {
    return (
      <span className={`${baseClasses} border-primary/30 text-primary bg-primary/10`}>
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
