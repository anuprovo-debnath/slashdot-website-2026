'use client';

import { useState, useEffect } from 'react';

interface InteractiveCalendarProps {
  eventDates: string[]; // array of 'YYYY-MM-DD'
  selectedDate: string | null;
  onSelectDate: (date: string | null) => void;
}

export function InteractiveCalendar({ eventDates, selectedDate, onSelectDate }: InteractiveCalendarProps) {
  // Center on April 2026 by default matching the test data
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 3, 1)); 
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    const hasEvent = eventDates.includes(dStr);
    const isSelected = selectedDate === dStr;

    days.push(
      <button
        key={dStr}
        onClick={() => onSelectDate(isSelected ? null : dStr)}
        className={`h-8 w-8 rounded-full flex items-center justify-center text-sm transition-all
          ${isSelected ? 'bg-primary text-white font-bold' : ''}
          ${!isSelected && hasEvent ? 'bg-primary/20 text-primary font-bold hover:bg-primary/40' : ''}
          ${!isSelected && !hasEvent ? 'text-foreground hover:bg-foreground/10' : ''}
        `}
      >
        {i}
      </button>
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
