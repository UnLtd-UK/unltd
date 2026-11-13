import type { AstroGlobal } from "astro";
import type { CacheHint } from "emdash";
import { headingsToToc, type TocHeading } from "@data/functions/portableHeadings";
import { loadProgrammeEvents } from "@lib/site-shell";
import { isPastEvent, sortEvents } from "@lib/event-helpers";
import { CMS_PAGE_CACHE } from "@lib/route-cache";
import {
  getResource,
  getResourceGroups,
  resourceHref,
  type GroupedResource,
  type ResourceGroup,
  type RuntimeResource,
} from "@lib/resources-runtime";

type Context = Pick<AstroGlobal, "cache" | "cookies" | "isPrerendered" | "request" | "url">;

export interface ResourcePageData {
  resource: RuntimeResource;
  groups: ResourceGroup[];
  events: Awaited<ReturnType<typeof loadProgrammeEvents>>;
  toc: TocHeading[];
  /** The group the resource is served under, if it is in one. */
  group?: ResourceGroup;
  previous?: GroupedResource;
  next?: GroupedResource;
}

export type ResourcePageResult =
  | { kind: "missing" }
  | { kind: "redirect"; to: string; status: 301 | 302 }
  | ({ kind: "page" } & ResourcePageData);

/** The group with this slug, or null. Groups are read from EmDash, so this is only for on-demand routes. */
export async function findGroup(slug: string) {
  const { groups, cacheHints } = await getResourceGroups();
  return { group: groups.find((group) => group.slug === slug) ?? null, groups, cacheHints };
}

/**
 * Loads a resource page, or says where it lives instead.
 *
 * A resource is served at /resources/<group>/<resource> under the first group
 * that lists it. Anything else (an old /resources/<resource> link, a wrong
 * group) redirects there, except a draft preview or an editor's edit-mode view,
 * which must stay on the URL it was opened at. A resource in no group (hidden,
 * or a new draft) is served at /resources/<resource>.
 */
export async function loadResourcePage(
  context: Context,
  slug: string,
  groupSlug?: string,
): Promise<ResourcePageResult> {
  const [{ resource, isPreview, cacheHint }, { groups, cacheHints: groupHints }, programmeEvents] =
    await Promise.all([getResource(slug), getResourceGroups(), loadProgrammeEvents(context)]);
  if (!resource) return { kind: "missing" };

  const editing = context.cookies.get("emdash-edit-mode")?.value === "true";
  const ordered = groups.flatMap((group) => group.resources.map((item) => ({ group, item })));
  const position = ordered.findIndex(({ item }) => item.id === resource.id);
  const canonical = position >= 0 ? ordered[position].item.href : resourceHref(resource.slug);

  if (!isPreview && !editing && context.url.pathname.replace(/\/$/, "") !== canonical) {
    return { kind: "redirect", to: canonical, status: groupSlug === undefined ? 301 : 302 };
  }

  if (context.cache?.enabled) {
    // A draft preview or an editor's edit-mode view is for one person, not for the shared cache.
    if (isPreview || editing) context.cache.set(false);
    else {
      context.cache.set(cacheHint as CacheHint);
      groupHints.forEach((hint) => context.cache.set(hint));
      context.cache.set(CMS_PAGE_CACHE);
    }
  }

  return {
    kind: "page",
    resource,
    groups,
    events: sortEvents(programmeEvents.filter((event) => !isPastEvent(event))),
    toc: headingsToToc(resource.content),
    group: position >= 0 ? ordered[position].group : undefined,
    previous: position > 0 ? ordered[position - 1].item : undefined,
    next: position >= 0 ? ordered[position + 1]?.item : undefined,
  };
}
