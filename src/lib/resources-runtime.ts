import { getEmDashCollection, getEmDashEntry, type CacheHint, type PortableTextBlock } from "emdash";
import { calculateReadTime } from "@data/functions/read-time";

// Reads resources straight from EmDash's database in the Worker, so they are
// rendered on demand and never need a build. Do not import this from a
// prerendered page.

export interface RuntimeResource {
  slug: string;
  title: string;
  subtitle: string;
  content: PortableTextBlock[];
  /** Hidden resources are only reachable by direct link, and are not indexed. */
  hidden: boolean;
  readTime: number;
}

// The generated collection types can lag the real schema, so read entries loosely.
type Entry = { data: Record<string, any> };

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
    slug: String(d.slug ?? "").trim(),
    title: String(d.title ?? ""),
    subtitle: String(d.subtitle ?? ""),
    content,
    hidden: Boolean(d.hidden),
    readTime: Math.max(1, calculateReadTime(portableTextToPlain(content))),
  };
};

/** One resource by slug, or null. A draft is returned only for a valid EmDash preview link. */
export async function getResource(
  slug: string,
): Promise<{ resource: RuntimeResource | null; isPreview: boolean; cacheHint: CacheHint }> {
  const { entry, isPreview, cacheHint } = await getEmDashEntry("resources", slug);
  return { resource: entry ? toResource(entry as Entry) : null, isPreview, cacheHint };
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
      const resource = toResource(entry as Entry);
      if (resource.slug) resources.push(resource);
    }
    cursor = result.nextCursor;
  } while (cursor);

  resources.sort((a, b) => a.title.localeCompare(b.title, "en-GB"));
  return { resources, cacheHints };
}
