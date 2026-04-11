'use client';

import { useState, useEffect, useRef } from 'react';
import { isDayInEvent } from '@/lib/eventUtils';

type CalendarEvent = { 
  date: string; 
  status: 'Live' | 'Upcoming' | 'Past';
  schedule?: { date: string; time: string }[];
};

interface InteractiveCalendarProps {
  events: CalendarEvent[];
  selectedDate: string | null;
  activeDate: string | null;
  onSelectDate: (date: string | null) => void;
}

export function InteractiveCalendar({ events, selectedDate, activeDate, onSelectDate }: InteractiveCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 3, 1)); 
  const [viewMode, setViewMode] = useState<'month' | 'year'>('month');
  const [mounted, setMounted] = useState(false);
  
  // Track today
  const d = new Date();
  const todayFormat = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  const lastActiveDate = useRef<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 4. Sync calendar month ONLY when activeDate changes via scrolling.
  //    This fixes manual scrolling by preventing `currentMonth` dependency loop.
  useEffect(() => {
    if (activeDate && activeDate !== lastActiveDate.current) {
      lastActiveDate.current = activeDate;
      const parts = activeDate.split('-');
      if (parts.length >= 2) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        setCurrentMonth(prev => {
          if (prev.getFullYear() !== year || prev.getMonth() !== month) {
            return new Date(year, month, 1);
          }
          return prev;
        });
      }
    }
  }, [activeDate]);

  if (!mounted) return <div className="h-64 border border-foreground/10 rounded-xl animate-pulse" />;

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const prevMonth = () => {
    if (viewMode === 'month') setCurrentMonth(new Date(year, month - 1, 1));
    else setCurrentMonth(new Date(year - 1, month, 1));
  };
  const nextMonth = () => {
    if (viewMode === 'month') setCurrentMonth(new Date(year, month + 1, 1));
    else setCurrentMonth(new Date(year + 1, month, 1));
  };

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="h-8 w-8" />);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    
    const overlappingEvents = events.filter(e => isDayInEvent(dStr, { date: e.date, schedule: e.schedule }));
    const eventForDay = overlappingEvents.length > 0 ? overlappingEvents[0] : null; // Optionally we could sort by status LIVE > UPCOMING
    const hasEvent = !!eventForDay;
    const isSelected = selectedDate === dStr;
    const isActive = activeDate === dStr && !selectedDate; 
    const isToday = dStr === todayFormat;

    // 2. Color assignment for Selected / HasEvent / NoEvent
    // Less importance for no events
    let colorClasses = 'text-foreground/40 hover:bg-foreground/10'; 
    
    if (isSelected) {
      // Keep event colors if selected, but solid
      if (hasEvent) {
        if (eventForDay.status === 'Live') colorClasses = 'bg-live text-white font-bold shadow-md';
        else if (eventForDay.status === 'Upcoming') colorClasses = 'bg-upcoming text-white font-bold shadow-md';
        else colorClasses = 'bg-primary text-white font-bold shadow-md';
      } else {
        colorClasses = 'bg-foreground/20 text-foreground font-bold shadow-sm';
      }
    } else if (hasEvent) {
      if (eventForDay.status === 'Live') {
        colorClasses = 'bg-live/20 text-live font-bold hover:bg-live/40';
      } else if (eventForDay.status === 'Upcoming') {
        colorClasses = 'bg-upcoming/20 text-upcoming font-bold hover:bg-upcoming/40';
      } else {
        colorClasses = 'bg-primary/20 text-primary font-bold hover:bg-primary/40';
      }
    }

    days.push(
      <div key={dStr} className="relative flex items-center justify-center">
        {isActive && !isSelected && (
          <div className="absolute inset-0 border-2 border-primary/50 rounded-full animate-pulse pointer-events-none" />
        )}
        <button
          onClick={() => onSelectDate(isSelected ? null : dStr)}
          className={`h-8 w-8 rounded-full flex flex-col items-center justify-center text-sm transition-all z-10 cursor-pointer ${colorClasses}
            ${isToday && isSelected ? 'ring-2 ring-offset-2 ring-offset-background ring-foreground' : ''}
            ${isToday && !isSelected && !hasEvent ? 'border border-foreground/40' : ''}
            ${isToday ? 'underline decoration-2 underline-offset-4' : ''}`}
        >
          {i}
        </button>
      </div>
    );
  }

  const renderYearView = () => {
    return (
      <div className="grid grid-cols-3 gap-2 animate-in fade-in zoom-in-95 duration-200">
        {monthNames.map((name, index) => {
          const isCurrentMonthInYear = index === month;
          const today = new Date();
          const isActualTodayMonth = today.getFullYear() === year && today.getMonth() === index;
          
          const eventsInMonth = events.filter(e => {
            // Check if any day 1..daysInMonth is inside this event
            const daysInThisMonth = new Date(year, index + 1, 0).getDate();
            for (let d = 1; d <= daysInThisMonth; d++) {
                const targetDayStr = `${year}-${String(index + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                if (isDayInEvent(targetDayStr, { date: e.date, schedule: e.schedule })) {
                    return true;
                }
            }
            return false;
          }).length;

          // GitHub-style contribution intensity
          let intensityClasses = 'bg-primary/5 border-foreground/5 text-foreground/60';
          if (eventsInMonth > 0) {
            if (eventsInMonth === 1) intensityClasses = 'bg-primary/10 border-primary/20 text-foreground';
            else if (eventsInMonth < 4) intensityClasses = 'bg-primary/25 border-primary/40 text-foreground';
            else intensityClasses = 'bg-primary/50 border-primary/60 text-white';
          }

          return (
            <button
              key={name}
              onClick={() => {
                setCurrentMonth(new Date(year, index, 1));
                setViewMode('month');
              }}
              className={`py-3 rounded-lg text-xs font-bold transition-all hover:scale-105 active:scale-95 border
                ${isCurrentMonthInYear ? 'ring-2 ring-primary ring-offset-1 z-10' : ''}
                ${intensityClasses}`}
            >
              <span className={isActualTodayMonth ? 'underline decoration-2 underline-offset-4 decoration-primary' : ''}>
                {name.substring(0, 3)}
              </span>
              {eventsInMonth > 0 && (
                <div className={`absolute top-1 right-1.5 text-[8px] opacity-70 ${eventsInMonth >= 4 ? 'text-white' : 'text-primary'}`}>
                  {eventsInMonth}
                </div>
              )}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-background border-2 border-primary/30 rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={() => setViewMode(viewMode === 'month' ? 'year' : 'month')}
          className="font-extrabold text-lg flex items-center gap-2 hover:text-primary transition-colors group"
        >
          {viewMode === 'month' ? `${monthNames[month]} ${year}` : year}
          <span className={`text-[10px] opacity-20 group-hover:opacity-100 transition-all ${viewMode === 'year' ? 'rotate-180' : ''}`}>▼</span>
        </button>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="px-2 py-1 text-xs border border-foreground/10 rounded hover:bg-foreground/10 transition-colors cursor-pointer">&lt;</button>
          <button onClick={nextMonth} className="px-2 py-1 text-xs border border-foreground/10 rounded hover:bg-foreground/10 transition-colors cursor-pointer">&gt;</button>
        </div>
      </div>
      
      {viewMode === 'month' ? (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="grid grid-cols-7 gap-y-2 place-items-center mb-4">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
              <div key={d} className="text-[10px] text-foreground/40 font-black uppercase tracking-widest">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-y-2 place-items-center gap-y-4">
            {days}
          </div>
        </div>
      ) : (
        renderYearView()
      )}

      {/* 1. Shift color coding legend below calendar */}
      <div className="flex gap-4 justify-center mt-8 pt-6 border-t border-foreground/5 text-[9px] font-black uppercase tracking-[0.2em] opacity-60">
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-live shadow-[0_0_8px_rgba(var(--color-live-rgb),0.5)]"></span> Live</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-upcoming shadow-[0_0_8px_rgba(var(--color-upcoming-rgb),0.5)]"></span> Upcoming</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-primary/80 shadow-[0_0_8px_rgba(var(--color-primary-rgb),0.4)]"></span> Past</span>
      </div>
      
      {selectedDate && (
        <div className="mt-3 text-center animate-in fade-in">
          <button 
            onClick={() => onSelectDate(null)}
             className="text-xs font-semibold text-primary/80 hover:text-primary transition-colors cursor-pointer"
          >
            Clear Selected Date
          </button>
        </div>
      )}
    </div>
  );
}
