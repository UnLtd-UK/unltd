import type { AstroGlobal } from "astro";
import type { headerNavigation, FooterLinkGroup } from "@data/menu.ts";
import type { RoundEntry } from "@data/rounds.ts";
import type { Event } from "@data/eventCollections.ts";

/** The content shared by every page's header, footer and round banner. */
export interface SiteShell {
  navigation: typeof headerNavigation;
  footerLinks: FooterLinkGroup[];
  rounds: RoundEntry[];
}

type BuildContext = Pick<AstroGlobal, "isPrerendered" | "url" | "request">;

const SHELL_PATH = "/site-shell.json";
const EVENTS_PATH = "/programme-events.json";

/**
 * Prerendered pages read build-time content (menus, rounds, Eventbrite events)
 * from EmDash and Eventbrite during the build. On-demand pages run in the
 * Worker, which can't do that work (it happens at module load, over HTTP), so
 * they read the copy the build wrote to a static JSON file. That content
 * therefore still updates on a rebuild, not on a CMS edit.
 */
const requestCache = new WeakMap<Request, Map<string, Promise<unknown>>>();

function loadBuildJson<T>(context: BuildContext, path: string, fromBuild: () => Promise<T>): Promise<T> {
  if (context.isPrerendered) return fromBuild();
  let perRequest = requestCache.get(context.request);
  if (!perRequest) {
    perRequest = new Map();
    requestCache.set(context.request, perRequest);
  }
  let value = perRequest.get(path) as Promise<T> | undefined;
  if (!value) {
    value = loadFromAssets<T>(new URL(path, context.url));
    perRequest.set(path, value);
  }
  return value;
}

export function loadSiteShell(context: BuildContext): Promise<SiteShell> {
  return loadBuildJson(context, SHELL_PATH, async () => {
    const [{ headerNavigation, footerLinks }, { rounds }] = await Promise.all([
      import("@data/menu.ts"),
      import("@data/rounds.ts"),
    ]);
    return { navigation: headerNavigation, footerLinks, rounds };
  });
}

/** The upcoming Eventbrite programme events, as of the last build. */
export function loadProgrammeEvents(context: BuildContext): Promise<Event[]> {
  return loadBuildJson(context, EVENTS_PATH, async () => (await import("@data/eventCollections.ts")).programmeEvents);
}

async function loadFromAssets<T>(url: URL): Promise<T> {
  // A Worker can't fetch its own public URL, so read the static file through
  // the ASSETS binding. `astro dev` has no built assets; its server serves the
  // endpoint instead.
  const response = import.meta.env.DEV
    ? await fetch(url)
    : await (await import("cloudflare:workers")).env.ASSETS.fetch(url);
  if (!response.ok) {
    throw new Error(`Could not load ${url.pathname} (${response.status}); was the site built?`);
  }
  return (await response.json()) as T;
}
