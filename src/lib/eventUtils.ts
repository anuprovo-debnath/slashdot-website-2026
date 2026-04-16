import type { EventData } from './events';

export const parseTimeRange = (dateStr: string, timeStr: string) => {
  if (!timeStr) return null;
  const timeMatch = timeStr.match(/(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})\s*(IST)?/);
  if (!timeMatch) return null;
  const [_, start, end, tz] = timeMatch;

  const createDate = (d: string, t: string) => {
    // Ensure d is YYYY-MM-DD
    const datePart = d.trim();
    const timePart = t.trim().padStart(5, '0');
    let isoStr = `${datePart}T${timePart}:00`;
    
    if (tz && tz.toUpperCase() === 'IST') isoStr += '+05:30';
    else isoStr += 'Z';
    return new Date(isoStr);
  };

  return {
    start: createDate(dateStr, start),
    end: createDate(dateStr, end)
  };
};

export function getEventStatus(
  frontmatter: Pick<EventData['frontmatter'], 'date' | 'time' | 'schedule'>
): 'Live' | 'Upcoming' | 'Past' {
  const now = new Date();

  // Option B: Custom Schedule
  if (frontmatter.schedule && frontmatter.schedule.length > 0) {
    let hasUpcoming = false;

    for (const session of frontmatter.schedule) {
      const dates = session.date.split(' - ');
      const startDateStr = dates[0];
      const endDateStr = dates.length > 1 ? dates[1] : dates[0];
      
      const parsedStart = parseTimeRange(startDateStr, session.time);
      const parsedEnd = parseTimeRange(endDateStr, session.time);
      
      if (!parsedStart || !parsedEnd) continue;

      if (now >= parsedStart.start && now <= parsedEnd.end) {
        return 'Live';
      }
      if (now < parsedStart.start) {
        hasUpcoming = true; // A future session exists
      }
    }

    if (hasUpcoming) {
      return 'Upcoming'; // Oscillate back to Upcoming between sessions
    }
    return 'Past'; // Only past when ALL sessions are exhausted
  }

  // Option A: Continuous range or single day
  const dates = frontmatter.date.split(' - ');
  const startDateStr = dates[0];
  const endDateStr = dates.length > 1 ? dates[1] : dates[0];

  const parsedStart = parseTimeRange(startDateStr, frontmatter.time);
  const parsedEnd = parseTimeRange(endDateStr, frontmatter.time);

  if (!parsedStart || !parsedEnd) return 'Upcoming';

  if (now >= parsedStart.start && now <= parsedEnd.end) {
    return 'Live';
  }
  if (now < parsedStart.start) {
    return 'Upcoming';
  }
  return 'Past';
}

export function isDayInEvent(targetDateStr: string, frontmatter: Pick<EventData['frontmatter'], 'date' | 'schedule'>) {
    const targetDate = new Date(targetDateStr);
    targetDate.setHours(0, 0, 0, 0);
    const target = targetDate.getTime();

    if (frontmatter.schedule && frontmatter.schedule.length > 0) {
        return frontmatter.schedule.some(s => {
             const sessionDate = new Date(s.date);
             sessionDate.setHours(0, 0, 0, 0);
             return target === sessionDate.getTime();
        });
    }

    const dates = frontmatter.date.split(' - ');
    const startDate = new Date(dates[0]);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(dates.length > 1 ? dates[1] : dates[0]);
    endDate.setHours(0, 0, 0, 0);
    
    return target >= startDate.getTime() && target <= endDate.getTime();
}
