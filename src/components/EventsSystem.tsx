'use client';

import { useState, useEffect, useRef } from 'react';
import type { EventData } from '@/lib/events';
import { EventCard } from './EventCard';
import { InteractiveCalendar } from './InteractiveCalendar';

interface EventsSystemProps {
  initialEvents: EventData[];
}

export function EventsSystem({ initialEvents }: EventsSystemProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [activeDate, setActiveDate] = useState<string | null>(null);
  const [searchTag, setSearchTag] = useState<string>('');

  const observerRef = useRef<IntersectionObserver | null>(null);

  const calendarEvents = initialEvents.map(e => ({
    date: e.frontmatter.date,
    status: e.frontmatter.status
  }));

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

  // Setup Intersection Observer to track scroll position
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      // Find the first intersecting element logic
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const date = entry.target.getAttribute('data-event-date');
          if (date) {
            setActiveDate(date);
          }
        }
      });
    };

    observerRef.current = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: "-20% 0px -60% 0px", // Triggers when the card is near the upper third of the screen
      threshold: 0
    });

    const elements = document.querySelectorAll('.scroll-event-item');
    elements.forEach(el => observerRef.current?.observe(el));

    return () => {
      observerRef.current?.disconnect();
    };
  }, [filteredEvents]); // Re-bind observer when list changes

  // Shift search bar on scroll
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Trigger the shift when scrolled past standard header offset
      if (window.scrollY > 120) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="flex flex-col md:flex-row gap-8 w-full">
      {/* 30% Sidebar */}
      <aside className="w-full md:w-[30%] shrink-0 flex flex-col gap-6 sticky top-24 self-start">
        {/* Search Bar (Shifted to Sidebar on Scroll) */}
        <div className={`relative z-10 transition-all duration-300 origin-top ${isScrolled ? 'opacity-100 max-h-24 scale-y-100 mb-0' : 'opacity-0 max-h-0 scale-y-0 mb-[-24px] pointer-events-none'}`}>
          <input 
            type="text" 
            placeholder="Search events or filter by #tag..." 
            value={searchTag}
            onChange={(e) => setSearchTag(e.target.value)}
            className="w-full bg-background border border-foreground/20 rounded-xl px-4 py-4 placeholder-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
          />
        </div>

        {/* Global Sticky Calendar */}
        <div className="transition-all duration-300">
          <InteractiveCalendar 
            events={calendarEvents} 
            selectedDate={selectedDate}
            activeDate={activeDate}
            onSelectDate={setSelectedDate} 
          />
        </div>
      </aside>

      {/* 70% Main Feed */}
      <main className="w-full md:w-[70%] flex flex-col gap-6">

        {/* Search Bar (Initial Right-Panel Position) */}
        <div className={`relative z-10 transition-opacity duration-300 ${!isScrolled ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <input 
            type="text" 
            placeholder="Search events or filter by #tag..." 
            value={searchTag}
            onChange={(e) => setSearchTag(e.target.value)}
            className="w-full bg-background border border-foreground/20 rounded-xl px-4 py-4 placeholder-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
          />
        </div>

        {/* Feed */}
        <div className="flex flex-col gap-6 pb-20">
          {filteredEvents.length > 0 ? (
            filteredEvents.map(event => (
              <div 
                key={event.slug} 
                className="scroll-event-item" 
                data-event-date={event.frontmatter.date}
              >
                <EventCard event={event} />
              </div>
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
