interface EventName {
  text: string;
  html?: string;
}

interface EventDate {
  timezone: string;
  local: string;
  utc: string;
}

export interface Event {
  id: string;
  name: EventName;
  description?: EventName;
  summary?: string;
  url: string;
  start: EventDate;
  end: EventDate;
  organization_id?: string;
  venue_id?: string | null;
  venue?: { name?: string };
  logo?: { url?: string };
  online_event?: boolean;
  status?: string;
  is_series?: boolean;
  series_id?: string | null;
}

type RuntimeEnv = Record<string, string | undefined>;

const EVENT_DESCRIPTION_PREFIXES = ["for social entrepreneurs", "for social entrepreneurs"];

function getRuntimeEnv(): RuntimeEnv {
  const globalContext = globalThis as unknown as {
    context?: { env?: RuntimeEnv; locals?: { env?: RuntimeEnv } };
  };

  if (globalContext?.context?.env) {
    return globalContext.context.env;
  }

  if (globalContext?.context?.locals?.env) {
    return globalContext.context.locals.env;
  }

  if (typeof process !== "undefined" && typeof process.env !== "undefined") {
    return process.env as unknown as RuntimeEnv;
  }

  if (typeof import.meta !== "undefined" && typeof import.meta.env !== "undefined") {
    return import.meta.env as unknown as RuntimeEnv;
  }

  return {};
}

function extractValueFromEnvFile(contents: string, key: string): string | undefined {
  const lines = contents.split(/\r?\n/);

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) {
      continue;
    }

    const [lhs, ...rest] = line.split("=");
    if (!lhs || lhs.trim() !== key) {
      continue;
    }

    let value = rest.join("=").trim();
    if (!value) {
      return undefined;
    }

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    return value;
  }

  return undefined;
}

async function resolveEventbriteToken(env: RuntimeEnv): Promise<string | undefined> {
  const tokenKeys = ["EVENTBRITE_PRIVATE_TOKEN", "EVENTBRITE_API_TOKEN"];

  for (const key of tokenKeys) {
    const value = env[key];
    if (value && value.trim().length > 0) {
      return value.trim();
    }
  }

  if (typeof process !== "undefined" && process.versions?.node) {
    try {
      const fs = await import("node:fs/promises");
      const candidateFiles = [".dev.vars", ".env.local", ".env"];

      for (const fileName of candidateFiles) {
        try {
          const fileUrl = new URL(`../../${fileName}`, import.meta.url);
          const fileContents = await fs.readFile(fileUrl, "utf-8");

          for (const key of tokenKeys) {
            const token = extractValueFromEnvFile(fileContents, key);
            if (token) {
              return token;
            }
          }
        } catch (error: any) {
          if (error?.code && error.code !== "ENOENT") {
            console.warn(
              `[events] Unable to read ${fileName} for Eventbrite token:`,
              error,
            );
          }
        }
      }
    } catch (error) {
      console.warn(
        "[events] Failed to inspect local env files for Eventbrite token:",
        error,
      );
    }
  }

  return undefined;
}

const runtimeEnv = getRuntimeEnv();

const EVENTBRITE_ORGANISATION_ID =
  runtimeEnv.EVENTBRITE_ORGANISATION_ID && runtimeEnv.EVENTBRITE_ORGANISATION_ID.trim().length > 0
    ? runtimeEnv.EVENTBRITE_ORGANISATION_ID.trim()
    : "3046207224";

const EVENTBRITE_TOKEN = await resolveEventbriteToken(runtimeEnv);

type FetchProgrammeEventsOptions = {
  organisationId?: string;
  status?: string;
  orderBy?: string;
  descriptionPrefixes?: string[];
};

export async function fetchProgrammeEvents(
  options: FetchProgrammeEventsOptions = {},
): Promise<Event[]> {
  try {
    if (!EVENTBRITE_TOKEN) {
      throw new Error("Eventbrite private token is not configured");
    }

    const organisationId = options.organisationId ?? EVENTBRITE_ORGANISATION_ID;
    const status = options.status ?? "live";
    const orderBy = options.orderBy ?? "start_asc";
    const descriptionPrefixes = (options.descriptionPrefixes ?? EVENT_DESCRIPTION_PREFIXES)
      .map((prefix) => prefix?.trim().toLowerCase())
      .filter((prefix): prefix is string => Boolean(prefix && prefix.length > 0));

    const response = await fetch(
      `https://www.eventbriteapi.com/v3/organizations/${organisationId}/events/?status=${encodeURIComponent(status)}&order_by=${encodeURIComponent(orderBy)}`,
      {
        method: "GET",
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${EVENTBRITE_TOKEN}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch events for organisation ${organisationId}`);
    }

    const data = await response.json();
    const events: Event[] = Array.isArray(data?.events) ? data.events : [];

    if (descriptionPrefixes.length === 0) {
      return events;
    }

    return events.filter((event) => {
      const description = event.description?.text ?? event.summary ?? "";
      const normalised = description.trim().toLowerCase();
      if (!normalised) {
        return false;
      }

      return descriptionPrefixes.some((prefix) => normalised.startsWith(prefix));
    });
  } catch (error) {
    console.error("Error fetching Eventbrite organisation events:", error);
    return [];
  }
}

export const programmeEvents = await fetchProgrammeEvents();

export function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

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

export const collections = {
  "for-social-entrepreneurs": {
    id: EVENTBRITE_ORGANISATION_ID,
    name: "For Social Entrepreneurs",
    slug: "for-social-entrepreneurs",
    description:
      "Upcoming UnLtd sessions for social entrepreneurs, covering introductions to our support, programmes, and application process.",
  },
} as const;

export const allEvents: Record<string, Event[]> = {
  "for-social-entrepreneurs": programmeEvents,
};