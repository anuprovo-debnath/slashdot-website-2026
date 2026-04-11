'use client';

import { useState, useEffect, useRef } from 'react';
import type { EventData } from '@/lib/events';
import { getEventStatus } from '@/lib/eventUtils';
import { EventCard } from './EventCard';
import { InteractiveCalendar } from './InteractiveCalendar';

interface EventsSystemProps {
  initialEvents: EventData[];
}

export function EventsSystem({ initialEvents }: EventsSystemProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [activeDate, setActiveDate] = useState<string | null>(null);
  const [searchTag, setSearchTag] = useState<string>('');
  const [placeholder, setPlaceholder] = useState('Search events...');
  const lastPlaceholder = useRef('Search events...');

  // Layout Constants
  const SEARCH_BAR_HEIGHT = 56; // h-14
  const SEARCH_BAR_GAP = 28;    // space between search bar and content
  const PADDING_TOP = SEARCH_BAR_HEIGHT + SEARCH_BAR_GAP; // 84px
  const STICKY_TOP_PX = 96;     // matching top-24 (24 * 4)

  // Scroll Threshold Constants
  const PHASE2_START = 200;
  const PHASE3_START = PHASE2_START + 50;
  const INTERPOLATION_START = PHASE2_START - 50; // Start morphing at 150px
  const PRE_TRIGGER_OFFSET = SEARCH_BAR_HEIGHT + 70;

  const observerRef = useRef<IntersectionObserver | null>(null);

  // Layout refs
  const parentRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  
  // Direct DOM refs for high-performance scroll sync
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const calendarEvents = initialEvents.map(e => ({
    date: e.frontmatter.date,
    schedule: e.frontmatter.schedule,
    status: getEventStatus(e.frontmatter)
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

  // Active Highlight Scroll Tracker
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const date = entry.target.getAttribute('data-event-date');
          if (date) setActiveDate(date);
        }
      });
    };

    observerRef.current = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0
    });

    const elements = document.querySelectorAll('.scroll-event-item');
    elements.forEach(el => observerRef.current?.observe(el));

    return () => {
      observerRef.current?.disconnect();
    };
  }, [filteredEvents]);

  // Continuous Scroll Interpolation Logic
  useEffect(() => {
    const handleScroll = () => {
      if (!parentRef.current || !rightRef.current || !searchContainerRef.current || !sidebarRef.current) return;
      if (window.innerWidth < 768) {
        searchContainerRef.current.style.width = '100%';
        searchContainerRef.current.style.transform = `translateX(0px)`;
        searchContainerRef.current.style.opacity = '1';
        return;
      }

      const sy = window.scrollY;
      
      const parentWidth = parentRef.current.offsetWidth;
      const leftWidth = sidebarRef.current.offsetWidth;
      const rightWidth = rightRef.current.offsetWidth;
      const rightX = rightRef.current.offsetLeft;
      const leftX = sidebarRef.current.offsetLeft;

      let targetWidth = rightWidth;
      let targetX = rightX;

      // 1. Proactive Interpolated Padding (Eliminates the jump by growing 1:1 with scroll)
      const paddingTriggerStart = PHASE2_START - PRE_TRIGGER_OFFSET;
      const targetPadding = Math.min(Math.max(sy - paddingTriggerStart, 0), PADDING_TOP);

      // 2. Expansion Phase (Right -> Full)
      if (sy > INTERPOLATION_START && sy <= PHASE2_START) {
        const p = (sy - INTERPOLATION_START) / (PHASE2_START - INTERPOLATION_START);
        targetWidth = rightWidth + (parentWidth - rightWidth) * p;
        targetX = rightX * (1 - p);
      } 
      // 3. FULL WIDTH PLATEAU! (The requested lock)
      else if (sy > PHASE2_START && sy <= PHASE3_START) {
        targetWidth = parentWidth;
        targetX = 0;
      }
      // 4. Contraction Phase (Full -> Left)
      else if (sy > PHASE3_START && sy <= (PHASE3_START + 50)) {
        const p = (sy - PHASE3_START) / 50;
        targetWidth = parentWidth - (parentWidth - leftWidth) * p;
        targetX = leftX * p; 
      }
      // 5. Final State (Locked Left)
      else if (sy > (PHASE3_START + 50)) {
        targetWidth = leftWidth;
        targetX = leftX;
      }

      // Dynamic Placeholder Toggle
      let nextPlaceholder = 'Search events...'; // Phase 1
      if (sy > PHASE2_START && sy <= PHASE3_START) {
        nextPlaceholder = 'Search events, workshops, or use #tags...'; // Phase 2 (Full)
      } else if (sy > PHASE3_START) {
        nextPlaceholder = 'Search...'; // Phase 3 (Docked)
      }

      if (nextPlaceholder !== lastPlaceholder.current) {
        lastPlaceholder.current = nextPlaceholder;
        setPlaceholder(nextPlaceholder);
      }

      // Apply styles directly to DOM for 60fps smoothness (bypass React render loop)
      searchContainerRef.current.style.width = `${targetWidth}px`;
      searchContainerRef.current.style.transform = `translateX(${targetX}px)`;
      searchContainerRef.current.style.opacity = '1';

      sidebarRef.current.style.paddingTop = `${targetPadding}px`;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll(); // Initial run

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <div className="relative w-full" ref={parentRef}>

      {/* 3-Phase Continuous Floating Search Layer */}
      <div className="sticky z-[100] w-full pointer-events-none mb-2" style={{ top: `${STICKY_TOP_PX}px` }}>
        <div
          ref={searchContainerRef}
          className="pointer-events-auto h-14"
        >
          <input
            type="text"
            placeholder={placeholder}
            value={searchTag}
            onChange={(e) => setSearchTag(e.target.value)}
            className="w-full h-full bg-background border-2 border-primary/40 rounded-xl px-4 font-bold placeholder-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Main Grid Wrapper */}
      <div className="flex flex-col md:flex-row gap-8 w-full" style={{ marginTop: `-${SEARCH_BAR_HEIGHT + 8}px` }}>

        {/* 30% Sidebar */}
        <aside
          ref={sidebarRef}
          className="w-full md:w-[30%] shrink-0 flex flex-col sticky self-start overflow-visible"
          style={{ top: `${STICKY_TOP_PX}px` }}
        >
          <div className="w-full">
            <InteractiveCalendar
              events={calendarEvents}
              selectedDate={selectedDate}
              activeDate={activeDate}
              onSelectDate={setSelectedDate}
            />
          </div>
        </aside>

        {/* 70% Main Feed */}
        <main className="w-full md:w-[70%] flex flex-col" ref={rightRef}>
          <div className="h-14 mb-8 opacity-0 pointer-events-none hidden md:block w-full shrink-0" />

          <div className="flex flex-col gap-6 pb-20 w-full relative">
            {filteredEvents.length > 0 ? (
              filteredEvents.map(event => (
                <div
                  key={event.slug}
                  className="scroll-event-item w-full"
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
    </div>
  );
}
