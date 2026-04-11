'use client';

import { useState, useEffect, useRef } from 'react';

type CalendarEvent = { date: string; status: 'Live' | 'Upcoming' | 'Past' };

interface InteractiveCalendarProps {
  events: CalendarEvent[];
  selectedDate: string | null;
  activeDate: string | null;
  onSelectDate: (date: string | null) => void;
}

export function InteractiveCalendar({ events, selectedDate, activeDate, onSelectDate }: InteractiveCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 3, 1)); 
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

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="h-8 w-8" />);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    
    const eventForDay = events.find(e => e.date === dStr);
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
        if (eventForDay.status === 'Live') colorClasses = 'bg-red-500 text-white font-bold shadow-md';
        else if (eventForDay.status === 'Upcoming') colorClasses = 'bg-emerald-500 text-white font-bold shadow-md';
        else colorClasses = 'bg-primary text-white font-bold shadow-md';
      } else {
        colorClasses = 'bg-foreground/20 text-foreground font-bold shadow-sm';
      }
    } else if (hasEvent) {
      if (eventForDay.status === 'Live') {
        colorClasses = 'bg-red-500/20 text-red-600 dark:text-red-400 font-bold hover:bg-red-500/40';
      } else if (eventForDay.status === 'Upcoming') {
        colorClasses = 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold hover:bg-emerald-500/40';
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

  return (
    <div className="bg-background border border-foreground/10 rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-heading font-bold text-lg">{monthNames[month]} {year}</h3>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="px-2 py-1 text-xs border border-foreground/10 rounded hover:bg-foreground/10 transition-colors cursor-pointer">&lt;</button>
          <button onClick={nextMonth} className="px-2 py-1 text-xs border border-foreground/10 rounded hover:bg-foreground/10 transition-colors cursor-pointer">&gt;</button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-y-2 place-items-center mb-4">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
          <div key={d} className="text-[10px] text-foreground/40 font-black uppercase tracking-widest">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-2 place-items-center gap-y-4">
        {days}
      </div>

      {/* 1. Shift color coding legend below calendar */}
      <div className="flex gap-4 justify-center mt-8 pt-6 border-t border-foreground/5 text-[9px] font-black uppercase tracking-[0.2em] opacity-60">
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.4)]"></span> Live</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></span> Upcoming</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-primary/80 shadow-[0_0_8px_rgba(2,145,178,0.4)]"></span> Past</span>
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
