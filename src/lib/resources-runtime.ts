import {
  getEmDashCollection,
  getEmDashEntry,
  getEmDashReferences,
  type CacheHint,
  type EditProxy,
  type PortableTextBlock,
} from "emdash";
import { calculateReadTime } from "@data/functions/read-time";

// Reads resources straight from EmDash's database in the Worker, so they are
// rendered on demand and never need a build. Do not import this from a
// prerendered page.

export interface RuntimeResource {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  /** Phosphor icon name, or "" for none. */
  icon: string;
  content: PortableTextBlock[];
  /** Hidden resources are only reachable by direct link, and are not indexed. */
  hidden: boolean;
  readTime: number;
  /** Spread onto an element to make its field editable on the page (a no-op unless an editor is in edit mode). */
  edit: EditProxy;
}

// The generated collection types can lag the real schema, so read entries loosely.
type Entry = { id: string; data: Record<string, any>; edit: EditProxy };

function portableTextToPlain(value: unknown): string {
  if (Array.isArray(value)) return value.map(portableTextToPlain).join(" ");
  if (value && typeof value === "object") {
    const node = value as { text?: unknown; children?: unknown };
    return typeof node.text === "string" ? node.text : portableTextToPlain(node.children);
  }
  return "";
}

const toResource = (entry: Entry): RuntimeResource => {
  const d = entry.data;
  const content: PortableTextBlock[] = d.content ?? [];
  return {
    id: entry.id,
    slug: String(d.slug ?? "").trim(),
    title: String(d.title ?? ""),
    subtitle: String(d.subtitle ?? ""),
    icon: String(d.icon ?? "").trim(),
    content,
    hidden: Boolean(d.hidden),
    readTime: Math.max(1, calculateReadTime(portableTextToPlain(content))),
    edit: entry.edit,
  };
};

/** One resource by slug, or null. A draft is returned only for a valid EmDash preview link. */
export async function getResource(
  slug: string,
): Promise<{ resource: RuntimeResource | null; isPreview: boolean; cacheHint: CacheHint }> {
  const { entry, isPreview, cacheHint } = await getEmDashEntry("resources", slug);
  return { resource: entry ? toResource(entry as unknown as Entry) : null, isPreview, cacheHint };
}

/** Every published resource, by title (hidden ones included; filter them for listings). */
export async function getAllResources(): Promise<{ resources: RuntimeResource[]; cacheHints: CacheHint[] }> {
  const resources: RuntimeResource[] = [];
  const cacheHints: CacheHint[] = [];
  let cursor: string | undefined;

  do {
    const result = await getEmDashCollection("resources", { status: "published", limit: 100, cursor });
    if (result.error) throw result.error;
    cacheHints.push(result.cacheHint);
    for (const entry of result.entries) {
      const resource = toResource(entry as unknown as Entry);
      if (resource.slug) resources.push(resource);
    }
    cursor = result.nextCursor;
  } while (cursor);

  resources.sort((a, b) => a.title.localeCompare(b.title, "en-GB"));
  return { resources, cacheHints };
}

/** A resource as listed in a group, with the one URL it is served at. */
export interface GroupedResource extends RuntimeResource {
  href: string;
}

/** Where a resource that is in no group is served (hidden resources, drafts). */
export const resourceHref = (slug: string) => `/resources/${slug}`;

export interface ResourceGroup {
  slug: string;
  title: string;
  subtitle: string;
  /** Phosphor icon name, or "" for none. */
  icon: string;
  /** The group's visible resources, in the order chosen in EmDash. */
  resources: GroupedResource[];
}

const UNGROUPED_TITLE = "Other";

/**
 * Every group with its visible resources, in navigation order: groups by their
 * numeric `order` field (then title), resources as arranged in EmDash.
 * Published resources that are in no group are collected in a trailing "Other"
 * group, so a new resource always shows up. Hidden resources are left out.
 */
export async function getResourceGroups(): Promise<{ groups: ResourceGroup[]; cacheHints: CacheHint[] }> {
  const [{ resources: all, cacheHints }, groupResult] = await Promise.all([
    getAllResources(),
    getEmDashCollection("groups", { status: "published", limit: 100 }),
  ]);
  if (groupResult.error) throw groupResult.error;

  const hints = [...cacheHints, groupResult.cacheHint];
  const byId = new Map(all.map((resource) => [resource.id, resource]));
  const placed = new Set<string>();

  const loaded = await Promise.all(
    (groupResult.entries as unknown as Entry[]).map(async (entry) => {
      const linked: RuntimeResource[] = [];
      let cursor: string | undefined;
      do {
        const page = await getEmDashReferences("groups", entry.id, "resources", { limit: 100, cursor });
        if (page.error) throw page.error;
        hints.push(page.cacheHint);
        for (const link of page.entries) {
          placed.add(link.id);
          const resource = byId.get(link.id);
          if (resource && !resource.hidden) linked.push(resource);
        }
        cursor = page.nextCursor;
      } while (cursor);

      const order = Number(entry.data.order);
      return {
        order: Number.isFinite(order) && entry.data.order !== null && entry.data.order !== "" ? order : Infinity,
        group: { slug: String(entry.data.slug ?? "").trim(), title: String(entry.data.title ?? ""), subtitle: String(entry.data.subtitle ?? ""), icon: String(entry.data.icon ?? "").trim(), resources: linked as GroupedResource[] },
      };
    }),
  );

  loaded.sort((a, b) => a.order - b.order || a.group.title.localeCompare(b.group.title, "en-GB"));
  const groups = loaded.map(({ group }) => group).filter((group) => group.resources.length > 0);

  const ungrouped = all.filter((resource) => !resource.hidden && !placed.has(resource.id));
  if (ungrouped.length > 0) groups.push({ slug: "other", title: UNGROUPED_TITLE, subtitle: "", icon: "", resources: ungrouped as GroupedResource[] });

  // A resource linked from several groups is served under the first one.
  const hrefs = new Map<string, string>();
  for (const group of groups) {
    for (const resource of group.resources) {
      if (!hrefs.has(resource.id)) hrefs.set(resource.id, `/resources/${group.slug}/${resource.slug}`);
    }
  }
  for (const group of groups) {
    group.resources = group.resources.map((resource) => ({ ...resource, href: hrefs.get(resource.id)! }));
  }

  return { groups, cacheHints: hints };
}
