'use client';

import { useState } from 'react';
import type { EventData } from '@/lib/events';
import { EventCard } from './EventCard';
import { InteractiveCalendar } from './InteractiveCalendar';

interface EventsSystemProps {
  initialEvents: EventData[];
}

export function EventsSystem({ initialEvents }: EventsSystemProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [searchTag, setSearchTag] = useState<string>('');

  const eventDates = initialEvents.map(e => e.frontmatter.date);

  const filteredEvents = initialEvents.filter(event => {
    let matchDate = true;
    let matchTag = true;

    if (selectedDate) {
      matchDate = event.frontmatter.date === selectedDate;
    }

    if (searchTag.startsWith('#')) {
      const tag = searchTag.replace('#', '').toLowerCase();
      const contentStr = (event.content + ' ' + event.frontmatter.title + ' ' + event.frontmatter.category).toLowerCase();
      matchTag = contentStr.includes(tag);
    } else if (searchTag.trim() !== '') {
      const query = searchTag.toLowerCase();
      const contentStr = (event.content + ' ' + event.frontmatter.title + ' ' + event.frontmatter.category).toLowerCase();
      matchTag = contentStr.includes(query);
    }

    return matchDate && matchTag;
  });

  return (
    <div className="flex flex-col md:flex-row gap-8 w-full">
      {/* 30% Sidebar */}
      <aside className="w-full md:w-[30%] shrink-0 flex flex-col gap-6 sticky top-24 self-start">
        <InteractiveCalendar 
          eventDates={eventDates} 
          selectedDate={selectedDate} 
          onSelectDate={setSelectedDate} 
        />
      </aside>

      {/* 70% Main Feed */}
      <main className="w-full md:w-[70%] flex flex-col gap-6">
        {/* Search Bar */}
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search events or filter by #tag..." 
            value={searchTag}
            onChange={(e) => setSearchTag(e.target.value)}
            className="w-full bg-background border border-foreground/20 rounded-xl px-4 py-4 placeholder-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
          />
        </div>

        {/* Feed */}
        <div className="flex flex-col gap-6 pb-20">
          {filteredEvents.length > 0 ? (
            filteredEvents.map(event => (
              <EventCard key={event.slug} event={event} />
            ))
          ) : (
            <div className="text-center py-20 border border-dashed border-foreground/20 rounded-xl">
              <p className="text-foreground/60 text-lg">No events found matching your criteria.</p>
              <button 
                onClick={() => { setSearchTag(''); setSelectedDate(null); }}
                className="mt-4 text-primary hover:underline font-medium"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
