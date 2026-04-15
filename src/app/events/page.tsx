import { getEvents } from '@/lib/events';
import { EventsSystem } from '@/components/EventsSystem';
import { Metadata } from 'next';
import { PageHero } from '@/components/ui/PageHero';

export const metadata: Metadata = {
  title: 'Events | Slashdot IISER K',
  description: 'Upcoming and past events from the Slashdot club.',
};

export default function EventsPage() {
  const events = getEvents();

  return (
    <div className="min-h-screen pb-16">
      <PageHero className="pt-44 pb-24 px-4 sm:px-6 lg:px-12">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 text-[var(--foreground)] font-heading">
            Our Events Hub
          </h1>
          <p className="text-xl text-[var(--foreground)] opacity-80 max-w-2xl mx-auto">
            Workshops, seminars, hackathons, and tech talks organized by Slashdot. Filter by date or search topics below.
          </p>
        </div>
      </PageHero>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-12 pt-12">
        <EventsSystem initialEvents={events} />
      </div>
    </div>
  );
}
