import { getEvents } from '@/lib/events';
import { EventsSystem } from '@/components/EventsSystem';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Events | Slashdot IISER K',
  description: 'Upcoming and past events from the Slashdot club.',
};

export default function EventsPage() {
  const events = getEvents();

  return (
    <div className="min-h-screen bg-background pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-5xl font-bold font-heading text-foreground tracking-tight">Events Hub</h1>
          <p className="text-lg text-foreground/70 mt-4 max-w-2xl">
            Workshops, seminars, hackathons, and tech talks organized by Slashdot. Filter by date or search topics below.
          </p>
        </div>
        
        <EventsSystem initialEvents={events} />
      </div>
    </div>
  );
}
