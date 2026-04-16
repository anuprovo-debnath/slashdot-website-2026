import { NextResponse } from 'next/server';
import { getEvents } from '@/lib/events';
import { getEventStatus } from '@/lib/eventUtils';

export async function GET() {
  try {
    const events = getEvents();
    const isAnythingLive = events.some(event => {
      const status = getEventStatus(event.frontmatter);
      return status === 'Live';
    });

    return NextResponse.json({ hasLiveEvent: isAnythingLive }, {
        headers: {
            'Cache-Control': 'no-store, max-age=0'
        }
    });
  } catch (error) {
    console.error('Failed to check live status:', error);
    return NextResponse.json({ hasLiveEvent: false }, { status: 500 });
  }
}
