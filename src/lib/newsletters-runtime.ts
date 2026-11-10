import { getEmDashCollection, getEmDashEntry, type CacheHint, type EditProxy, type PortableTextBlock } from "emdash";

// Reads newsletters straight from EmDash's database in the Worker, so the
// archive is rendered on demand and never needs a build. Do not import this
// from a prerendered page.

export interface RuntimeNewsletter {
  slug: string;
  title: string;
  subtitle: string;
  content: PortableTextBlock[];
  /** When it was published (ISO), the date shown as the edition's date. */
  date: string;
  /** Spread onto an element to make its field editable on the page (a no-op unless an editor is in edit mode). */
  edit: EditProxy;
}

// The generated collection types can lag the real schema, so read entries loosely.
type Entry = { data: Record<string, any>; edit: EditProxy };

const toIso = (value: unknown): string => {
  const date = value ? new Date(String(value)) : null;
  return date && !Number.isNaN(date.getTime()) ? date.toISOString() : "";
};

const toNewsletter = (entry: Entry): RuntimeNewsletter => {
  const d = entry.data;
  return {
    slug: String(d.slug ?? "").trim(),
    title: String(d.title ?? "").trim(),
    subtitle: String(d.subtitle ?? "").trim(),
    content: d.content ?? [],
    date: toIso(d.publishedAt ?? d.createdAt),
    edit: entry.edit,
  };
};

/** One newsletter by slug, or null. A draft is returned only for a valid EmDash preview link. */
export async function getNewsletter(
  slug: string,
): Promise<{ newsletter: RuntimeNewsletter | null; isPreview: boolean; cacheHint: CacheHint }> {
  const { entry, isPreview, cacheHint } = await getEmDashEntry("newsletters", slug);
  return { newsletter: entry ? toNewsletter(entry as unknown as Entry) : null, isPreview, cacheHint };
}

/** Every published newsletter, newest first. */
export async function getAllNewsletters(): Promise<{ newsletters: RuntimeNewsletter[]; cacheHints: CacheHint[] }> {
  const newsletters: RuntimeNewsletter[] = [];
  const cacheHints: CacheHint[] = [];
  let cursor: string | undefined;

  do {
    const result = await getEmDashCollection("newsletters", { status: "published", limit: 100, cursor });
    if (result.error) throw result.error;
    cacheHints.push(result.cacheHint);
    for (const entry of result.entries) {
      const newsletter = toNewsletter(entry as unknown as Entry);
      if (newsletter.slug) newsletters.push(newsletter);
    }
    cursor = result.nextCursor;
  } while (cursor);

  newsletters.sort((a, b) => b.date.localeCompare(a.date));
  return { newsletters, cacheHints };
}
