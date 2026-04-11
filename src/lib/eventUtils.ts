export function getEventStatus(date: string, time: string): 'Live' | 'Upcoming' | 'Past' {
  const now = new Date();
  
  // Format: "10:00 - 22:00 IST"
  const timeMatch = time.match(/(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})\s*(IST)?/);
  if (!timeMatch) return 'Upcoming';

  const [_, start, end, tz] = timeMatch;

  const createDate = (t: string) => {
    let isoStr = `${date}T${t.padStart(5, '0')}:00`;
    if (tz === 'IST') isoStr += '+05:30';
    else isoStr += 'Z'; // Default to UTC
    return new Date(isoStr);
  };

  try {
    const startDate = createDate(start);
    const endDate = createDate(end);

    if (now >= startDate && now <= endDate) return 'Live';
    if (now < startDate) return 'Upcoming';
    return 'Past';
  } catch (e) {
    return 'Upcoming';
  }
}
