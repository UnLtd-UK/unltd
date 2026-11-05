import type { Event } from "@data/eventCollections";

// Kept apart from @data/eventCollections, which fetches from Eventbrite when
// it loads and so can't be imported by an on-demand route.

export function isPastEvent(event: Event): boolean {
  const now = new Date();
  return new Date(event.end.local) < now;
}

export function sortEvents(events: Event[]): Event[] {
  return [...events].sort((a, b) => {
    const aStart = new Date(a.start.local).getTime();
    const bStart = new Date(b.start.local).getTime();
    return aStart - bStart;
  });
}
