interface Event {
  name: { text: string };
  description: { text: string };
  start: { local: string };
  end: { local: string };
  venue?: { name: string };
  url: string;
  logo?: { url: string };
  is_series: boolean;
  series_id?: string;
  series?: {
    end_date: string;
    start_date: string;
  };
}

// const EVENTBRITE_API_TOKEN = process.env.ENV === 'cloudflare' 
//   ? import.meta.env.EVENTBRITE_API_TOKEN 
//   : process.env.EVENTBRITE_API_TOKEN;

const EVENTBRITE_API_TOKEN = ENVIRONMENT === 'preview' // Cloudflare Pages sets this automatically
  ? import.meta.env.EVENTBRITE_API_TOKEN 
  : process.env.EVENTBRITE_API_TOKEN;

async function fetchCollectionEvents(collectionId: string): Promise<Event[]> {
  try {
    if (!EVENTBRITE_API_TOKEN) {
      throw new Error('Eventbrite API token is not configured');
    }

    const response = await fetch(
      `https://www.eventbriteapi.com/v3/collections/${collectionId}/events/?expand=series,venue`,
      {
        headers: {
          'Authorization': `Bearer ${EVENTBRITE_API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch events for collection ${collectionId}`);
    }

    const data = await response.json();
    return data.events;
  } catch (error) {
    console.error(`Error fetching events for collection ${collectionId}:`, error);
    return [];
  }
}

export const collections = {
  "access-to-employment": {
    id: "1419949",
    name: "Access to Employment",
    slug: "access-to-employment",
    description: "Events focused on improving access to employment opportunities"
  },
  "funding-futures": {
    id: "3966343",
    name: "Funding Futures",
    slug: "funding-futures",
    description: "Events related to funding and investment opportunities"
  },
  "healthy-ageing": {
    id: "1419909",
    name: "Healthy Ageing",
    slug: "healthy-ageing",
    description: "Events promoting healthy and active ageing"
  },
  "movement-for-change": {
    id: "1376499",
    name: "Movement for Change",
    slug: "movement-for-change",
    description: "Events driving social change and community action"
  }
} as const;

// Fetch all events at build time
async function fetchAllEvents() {
  const allEvents: Record<string, Event[]> = {};
  
  for (const [slug, collection] of Object.entries(collections)) {
    const events = await fetchCollectionEvents(collection.id);
    allEvents[slug] = events;
  }
  
  return allEvents;
}

export const allEvents = await fetchAllEvents();

export function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function isPastEvent(event: Event): boolean {
  const now = new Date();
  
  // If it's a series, check if the series end date is in the future
  if (event.series?.end_date) {
    return new Date(event.series.end_date) < now;
  }
  
  // For non-series events, check the event end date
  return new Date(event.end.local) < now;
}

export function sortEvents(events: Event[]): Event[] {
  return [...events].sort((a, b) => {
    const aIsPast = isPastEvent(a);
    const bIsPast = isPastEvent(b);
    
    if (aIsPast === bIsPast) {
      // If both are past or both are future, sort by date (newest first)
      return new Date(b.start.local).getTime() - new Date(a.start.local).getTime();
    }
    // Put future events first
    return aIsPast ? 1 : -1;
  });
} 