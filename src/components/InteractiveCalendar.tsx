'use client';

import { useState, useEffect } from 'react';

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

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync calendar month when activeDate changes via scrolling
  useEffect(() => {
    if (activeDate) {
      const parts = activeDate.split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        // Only update if it's a different month to prevent unnecessary re-renders
        if (currentMonth.getFullYear() !== year || currentMonth.getMonth() !== month) {
          setCurrentMonth(new Date(year, month, 1));
        }
      }
    }
  }, [activeDate, currentMonth]);

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
    
    // Check if event exists and get its status to determine coloring
    const eventForDay = events.find(e => e.date === dStr);
    const hasEvent = !!eventForDay;
    const isSelected = selectedDate === dStr;
    const isActive = activeDate === dStr && !selectedDate; // Only show scroll highlight if nothing is manually selected

    let colorClasses = 'text-foreground hover:bg-foreground/10'; // Default
    if (isSelected) {
      colorClasses = 'bg-primary text-white font-bold shadow-md';
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
          <div className="absolute inset-0 border-2 border-primary/50 rounded-full animate-pulse" />
        )}
        <button
          onClick={() => onSelectDate(isSelected ? null : dStr)}
          className={`h-8 w-8 rounded-full flex items-center justify-center text-sm transition-all z-10 ${colorClasses}`}
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
          <button onClick={prevMonth} className="px-2 py-1 text-xs border border-foreground/10 rounded hover:bg-foreground/5 transition-colors">&lt;</button>
          <button onClick={nextMonth} className="px-2 py-1 text-xs border border-foreground/10 rounded hover:bg-foreground/5 transition-colors">&gt;</button>
        </div>
      </div>
      <div className="flex gap-4 justify-center mb-4 text-[10px] font-bold uppercase tracking-wider">
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500/50"></span> Live</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500/50"></span> Upcoming</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-primary/50"></span> Past</span>
      </div>
      <div className="grid grid-cols-7 gap-y-2 place-items-center mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
          <div key={d} className="text-xs text-foreground/50 font-bold">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-2 place-items-center">
        {days}
      </div>
      
      {selectedDate && (
        <div className="mt-4 pt-4 border-t border-foreground/10 text-center animate-in fade-in">
          <button 
            onClick={() => onSelectDate(null)}
             className="text-xs font-semibold text-primary/80 hover:text-primary transition-colors"
          >
            Clear Search Date
          </button>
        </div>
      )}
    </div>
  );
}
