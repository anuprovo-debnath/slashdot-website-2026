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
  const [activeDate, setActiveDate] = useState<string | null>(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });
  const activeDateRef = useRef<string | null>(null);
  const [searchTag, setSearchTag] = useState<string>('');
  const [placeholder, setPlaceholder] = useState('Search events...');
  const lastPlaceholder = useRef('Search events...');

  // ── Layout Constants (preserved from original working code) ────────────
  const SEARCH_BAR_HEIGHT = 56; // h-14
  const SEARCH_BAR_GAP = 24; // space between search bar and content
  const PADDING_TOP = SEARCH_BAR_HEIGHT + SEARCH_BAR_GAP; // 84px
  const STICKY_TOP_PX = 112; // Navbar (88px) + 24px Gap
  const DOCKED_GAP = 24; // matches gap-6 between cards (24px)
  const SIDEBAR_WIDTH = 0.30;
  const CARDS_BTM_PAD = 24; // matches gap-6 between cards (24px)

  // ── Scroll Thresholds (preserved from original) ────────────────────────
  const PHASE2_START = 200;
  const PHASE3_START = PHASE2_START + 50; // 250
  const PHASE3_END = PHASE3_START + 50; // 300
  const INTERPOLATION_START = PHASE2_START - 50; // 150
  const PRE_TRIGGER_OFFSET = SEARCH_BAR_HEIGHT + 70;

  const observerRef = useRef<IntersectionObserver | null>(null);
  const parentRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null); // original morphing bar
  const searchDockedRef = useRef<HTMLDivElement>(null); // fixed bar (Phase 3+)
  const calendarRef = useRef<HTMLDivElement>(null); // fixed calendar overlay
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const mobileCalendarRef = useRef<HTMLDivElement>(null);

  const calendarEvents = initialEvents.map(e => ({
    date: e.frontmatter.date,
    schedule: e.frontmatter.schedule,
    status: getEventStatus(e.frontmatter)
  }));

  const filteredEvents = initialEvents.filter(event => {
    let matchDate = true;
    let matchTag = true;
    if (selectedDate) matchDate = event.frontmatter.date === selectedDate;
    if (searchTag.startsWith('#')) {
      const tag = searchTag.replace('#', '').toLowerCase();
      const str = (event.content + ' ' + event.frontmatter.title + ' ' + event.frontmatter.category).toLowerCase();
      matchTag = str.includes(tag);
    } else if (searchTag.trim() !== '') {
      const str = (event.content + ' ' + event.frontmatter.title + ' ' + event.frontmatter.category).toLowerCase();
      matchTag = str.includes(searchTag.toLowerCase());
    }
    return matchDate && matchTag;
  });

  // Active Highlight Scroll Tracker (unchanged from original)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    observerRef.current = new IntersectionObserver(
      (entries) => entries.forEach(entry => {
        if (entry.isIntersecting) {
          const date = entry.target.getAttribute('data-event-date');
          if (date) {
            setActiveDate(date);
            activeDateRef.current = date;
          }
        }
      }),
      { root: null, rootMargin: '-20% 0px -60% 0px', threshold: 0 }
    );
    document.querySelectorAll('.scroll-event-item').forEach(el =>
      observerRef.current?.observe(el)
    );
    return () => observerRef.current?.disconnect();
  }, [filteredEvents]);

  // Main scroll + positioning engine
  useEffect(() => {
    /**
     * Anchors the fixed sidebar elements (calendar + docked search bar)
     * to the parent container's left-column position.
     */
    const anchorSidebar = () => {
      if (!parentRef.current) return;
      if (window.innerWidth < 768) return;
      const rect = parentRef.current.getBoundingClientRect();
      const left = rect.left;
      const width = rect.width * SIDEBAR_WIDTH;
      if (calendarRef.current) {
        calendarRef.current.style.left = `${left}px`;
        calendarRef.current.style.width = `${width}px`;
      }
      if (searchDockedRef.current) {
        searchDockedRef.current.style.left = `${left}px`;
        searchDockedRef.current.style.width = `${width}px`;
      }
    };

    const handleScroll = () => {
      if (!parentRef.current || !rightRef.current || !searchContainerRef.current) return;

      const sy = window.scrollY;

      // When at the top, focus on today's week
      if (sy < 100) {
        const d = new Date();
        const todayStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        if (activeDateRef.current !== todayStr) {
          setActiveDate(todayStr);
          activeDateRef.current = todayStr;
        }
      }

      if (window.innerWidth < 768) {
        if (!mobileSearchRef.current || !mobileCalendarRef.current || !cardsRef.current || !parentRef.current) return;

        requestAnimationFrame(() => {
          if (!mobileSearchRef.current || !mobileCalendarRef.current || !cardsRef.current || !parentRef.current) return;
          
          const stickyTop = 89;
          const mobileGap = 16;
          
          // Calculate search bottom relative to viewport
          const parentRect = parentRef.current.getBoundingClientRect();
          const searchTop = parentRect.top + 16; // derived from pt-4/px-4 styling
          const searchHeight = 56;
          const searchBottom = searchTop + searchHeight;
          
          // Entry: Push down so it visually sits underneath the search bar
          const naturalTop = searchBottom + mobileGap;
          const entryOffset = Math.max(0, naturalTop - stickyTop);
          
          // Exit: Pull up so it doesn't cross the end of the cards 
          const calHeight = mobileCalendarRef.current.offsetHeight || 184;
          const cardsRect = cardsRef.current.getBoundingClientRect();
          const trueCardsBottom = cardsRect.bottom - CARDS_BTM_PAD; 
          
          const exitBoundary = trueCardsBottom - calHeight;
          const exitOffset = Math.min(0, exitBoundary - stickyTop);
          
          const translateY = exitBoundary < stickyTop ? exitOffset : entryOffset;
          
          mobileCalendarRef.current.style.transform = `translate3d(0, ${translateY}px, 0)`;
        });
        return;
      }

      anchorSidebar();

      const parentWidth = parentRef.current.offsetWidth;
      const leftWidth = parentWidth * SIDEBAR_WIDTH;
      const rightWidth = rightRef.current.offsetWidth;
      const rightX = rightRef.current.offsetLeft;
      const leftX = 0; // sidebar is at the left edge of parentRef

      // ── 3-Phase Morphing Search Bar (original logic, untouched) ─────────
      let targetWidth = rightWidth;
      let targetX = rightX;

      // 1. Proactive sidebar padding (original)
      const paddingTriggerStart = PHASE2_START - PRE_TRIGGER_OFFSET;
      const targetPadding = Math.min(Math.max(sy - paddingTriggerStart, 0), PADDING_TOP);
      void targetPadding; // kept for original compatibility; applied below where needed

      if (sy > INTERPOLATION_START && sy <= PHASE2_START) {
        const p = (sy - INTERPOLATION_START) / (PHASE2_START - INTERPOLATION_START);
        targetWidth = rightWidth + (parentWidth - rightWidth) * p;
        targetX = rightX * (1 - p);
      } else if (sy > PHASE2_START && sy <= PHASE3_START) {
        targetWidth = parentWidth;
        targetX = 0;
      } else if (sy > PHASE3_START && sy <= PHASE3_END) {
        const p = (sy - PHASE3_START) / 50;
        targetWidth = parentWidth - (parentWidth - leftWidth) * p;
        targetX = leftX * p;
      } else if (sy > PHASE3_END) {
        targetWidth = leftWidth;
        targetX = leftX;
      }

      const isDocked = sy > PHASE3_END;

      // ── Morphing bar: fade out once search has docked ────────────────────
      searchContainerRef.current.style.width = `${targetWidth}px`;
      searchContainerRef.current.style.transform = `translateX(${targetX}px)`;
      searchContainerRef.current.style.opacity = isDocked ? '0' : '1';
      searchContainerRef.current.style.pointerEvents = isDocked ? 'none' : 'auto';

      // ── Placeholder ─────────────────────────────────────────────────────
      let next = 'Search events, workshops, or use #tags...';
      if (sy > PHASE3_START) next = 'Search...';
      if (next !== lastPlaceholder.current) { lastPlaceholder.current = next; setPlaceholder(next); }

      // ── Fixed calendar + docked search ──────────────────────────────────
      if (!calendarRef.current || !cardsRef.current) return;

      /**
       * Calendar top: slides down during Phase 3 to make room for the
       * docked search bar. By the time the docked bar appears (isDocked),
       * the calendar is already offset exactly by (SEARCH_BAR_HEIGHT + DOCKED_GAP).
       */
      const phase3Progress = Math.min(Math.max((sy - PHASE3_START) / 50, 0), 1);
      const calTop = STICKY_TOP_PX + phase3Progress * (SEARCH_BAR_HEIGHT + DOCKED_GAP);
      calendarRef.current.style.top = `${calTop}px`;

      // Docked search bar is always at STICKY_TOP_PX; appears in Phase 3+
      if (searchDockedRef.current) {
        searchDockedRef.current.style.top = `${STICKY_TOP_PX}px`;
        searchDockedRef.current.style.opacity = isDocked ? '1' : '0';
        searchDockedRef.current.style.pointerEvents = isDocked ? 'auto' : 'none';
      }

      // ── translateY clamp: bounds calendar (and docked bar) to cards ─────
      /**
       * Entry: push calendar DOWN so its top aligns with the first card.
       * Exit:  pull BOTH UP so calendar bottom doesn't pass the last card.
       * The docked search bar shares the same translateY so they exit together.
       */
      const calHeight = calendarRef.current.offsetHeight;
      const cardsRect = cardsRef.current.getBoundingClientRect();
      const trueCardsBottom = cardsRect.bottom - CARDS_BTM_PAD;
      // Pre-calc both versions
      const parentRect = parentRef.current.getBoundingClientRect();
      const parentTop = parentRect.top;



      const offsetX = Math.max(0, parentTop - STICKY_TOP_PX);

      const searchRect = searchContainerRef.current.getBoundingClientRect();
      const searchBottom = searchRect.bottom;

      const offsetY = Math.max(
        0,
        searchBottom - STICKY_TOP_PX + SEARCH_BAR_GAP
      );

      const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

      let entryOffset = offsetX;

      // 1. Phase A → pure X
      if (sy + PADDING_TOP < INTERPOLATION_START) {
        entryOffset = offsetX;
      }

      // 2. X → Y interpolation
      else if (sy < INTERPOLATION_START) {
        const t =
          (sy + PADDING_TOP - INTERPOLATION_START) / PADDING_TOP;
        entryOffset = lerp(offsetX, offsetY, Math.min(Math.max(t, 0), 1));
      }

      // 3. Pure Y
      else if (sy <= PHASE3_START) {
        entryOffset = offsetY;
      }

      // 4. Y → X interpolation
      else if (sy <= PHASE3_END) {
        const t = (sy - PHASE3_START) / (PHASE3_END - PHASE3_START);
        entryOffset = lerp(offsetY, offsetX, Math.min(Math.max(t, 0), 1));
      }

      // 5. Phase 5 → pure X again
      else {
        entryOffset = offsetX;
      }

      const exitBoundary = trueCardsBottom - calHeight;
      const exitOffset = Math.min(0, exitBoundary - calTop);
      const translateY = exitBoundary < calTop ? exitOffset : entryOffset;

      calendarRef.current.style.transform = `translate3d(0, ${translateY}px, 0)`;
      if (searchDockedRef.current) {
        searchDockedRef.current.style.transform = `translate3d(0, ${translateY}px, 0)`;
      }
    };

    // Initial fixed placement
    if (calendarRef.current) {
      calendarRef.current.style.position = 'fixed';
      calendarRef.current.style.top = `${STICKY_TOP_PX}px`;
      calendarRef.current.style.transform = 'translateY(0px)';
    }
    anchorSidebar();
    handleScroll();

    const onResize = () => { anchorSidebar(); handleScroll(); };
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div className="relative w-full" ref={parentRef}>

      {/* ── 3-Phase Floating Search Bar (sticky, original) ──────────────── */}
      <div
        className="hidden md:block sticky z-[40] w-full pointer-events-none mb-2"
        style={{ top: `${STICKY_TOP_PX}px` }}
      >
        <div ref={searchContainerRef} className="pointer-events-auto h-14">
          <input
            type="text"
            placeholder={placeholder}
            value={searchTag}
            onChange={(e) => setSearchTag(e.target.value)}
            className="w-full h-full bg-background border-2 border-primary/40 rounded-xl px-4 font-bold placeholder-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* ── Mobile Search & Calendar (Dedicated Overhaul) ────────────────── */}
      <div className="md:hidden flex flex-col pt-4 gap-4">
        {/* Search Bar: Freely scrolls away */}
        <div ref={mobileSearchRef} className="w-full h-14 shrink-0">
          <input
            type="text"
            placeholder="Search events..."
            value={searchTag}
            onChange={(e) => setSearchTag(e.target.value)}
            className="w-full h-full bg-background border-2 border-primary/40 rounded-2xl px-4 font-bold placeholder-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-lg"
          />
        </div>

        {/* Mobile Calendar Placeholder to prevent feed jumping */}
        <div className="w-full h-[184px] shrink-0" aria-hidden="true" />
      </div>

      {/* Calendar: Fixed Mobile Version relying on translateY */}
      <div
        ref={mobileCalendarRef}
        className="fixed md:hidden top-[89px] left-0 right-0 z-[30] px-4 py-2 pointer-events-none will-change-transform"
        style={{ transform: 'translate3d(0, 0px, 0)' }}
      >
        <div className="w-full max-w-5xl mx-auto pointer-events-auto">
          <InteractiveCalendar
            initialViewMode="week"
            events={calendarEvents}
            selectedDate={selectedDate}
            activeDate={activeDate}
            onSelectDate={setSelectedDate}
          />
        </div>
      </div>

      {/* ── Main Grid ───────────────────────────────────────────────────── */}
      <div
        className="flex flex-col md:flex-row gap-8 w-full"
        style={{
          marginTop: typeof window !== 'undefined' && window.innerWidth >= 768
            ? `-${SEARCH_BAR_HEIGHT + 8}px`
            : '0'
        }}
      >
        {/* Spacer: reserves 30% column so feed doesn't bleed under the fixed calendar */}
        <div className="hidden md:block md:w-[30%] shrink-0" aria-hidden="true" />

        {/* ── Event Feed (70%) ──────────────────────────────────────────── */}
        <main className="w-full md:w-[70%] flex flex-col" ref={rightRef}>
          <div className="mb-4 opacity-0 pointer-events-none hidden md:block w-full shrink-0" />

          {/* cardsRef = exact cards wrapper (no spacer), used for entry/exit bounds */}
          <div ref={cardsRef} className="flex flex-col gap-6 pb-10 w-full relative">
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

      {/*
        ── Fixed Calendar Overlay (desktop) ────────────────────────────────
        position:fixed — immune to overflow-hidden on ancestors (which breaks sticky).
        top / translateY managed by scroll engine.
        Slides down during Phase 3 to make room for the docked search bar.
      */}
      <div
        ref={calendarRef}
        className="hidden md:flex md:flex-col z-[30] will-change-transform"
        style={{ position: 'fixed', top: `${STICKY_TOP_PX}px`, transform: 'translate3d(0, 0px, 0)' }}
      >
        <InteractiveCalendar
          events={calendarEvents}
          selectedDate={selectedDate}
          activeDate={activeDate}
          onSelectDate={setSelectedDate}
          showViewToggle={false}
        />
      </div>

      {/*
        ── Docked Search Bar (desktop, Phase 3+) ────────────────────────────
        Sits at the same XY as where the morphing bar lands (top: STICKY_TOP_PX,
        left + width = sidebar column). Always opacity:0 until Phase 3 ends.
        Shares translateY with the calendar so they exit together as one unit.
      */}
      <div
        ref={searchDockedRef}
        className="hidden md:block z-[41] h-14"
        style={{
          position: 'fixed',
          top: `${STICKY_TOP_PX}px`,
          opacity: 0,
          pointerEvents: 'none',
          transition: 'opacity 0.15s ease',
        }}
      >
        <input
          type="text"
          placeholder="Search..."
          value={searchTag}
          onChange={(e) => setSearchTag(e.target.value)}
          className="w-full h-full bg-background border-2 border-primary/40 rounded-xl px-4 font-bold placeholder-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* ── Mobile: Removed redundant inline calendar ────────── */}
    </div>
  );
}
