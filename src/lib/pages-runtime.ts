import { getEmDashCollection, getEmDashEntry, type CacheHint } from "emdash";
import type { PortableTextBlock } from "emdash";

// Reads pages straight from EmDash's database in the Worker, so they are
// rendered on demand and never need a build. Do not import this from a
// prerendered page, and do not import @data/pages here: that module reads
// EmDash over HTTP at build time.

export interface RuntimePage {
  slug: string;
  title: string;
  subtitle: string;
  content: PortableTextBlock[];
  showUpdatedAt: boolean;
  updatedAt: string | null;
}

// The generated collection types can lag the real schema, so read entries loosely.
type Entry = { data: Record<string, any> };

const toPage = (entry: Entry): RuntimePage => {
  const d = entry.data;
  return {
    slug: String(d.slug ?? "").trim(),
    title: String(d.title ?? ""),
    subtitle: String(d.subtitle ?? ""),
    content: d.content ?? [],
    showUpdatedAt: Boolean(d.show_updated_at),
    updatedAt: d.updatedAt ? new Date(d.updatedAt).toISOString() : null,
  };
};

/** One page by slug, or null. A draft is returned only for a valid EmDash preview link. */
export async function getPage(
  slug: string,
): Promise<{ page: RuntimePage | null; isPreview: boolean; cacheHint: CacheHint }> {
  const { entry, isPreview, cacheHint } = await getEmDashEntry("pages", slug);
  return { page: entry ? toPage(entry as Entry) : null, isPreview, cacheHint };
}

/** The slug and last change of every published page. */
export async function getPageSlugs(): Promise<{
  pages: { slug: string; updatedAt: string | null }[];
  cacheHints: CacheHint[];
}> {
  const pages: { slug: string; updatedAt: string | null }[] = [];
  const cacheHints: CacheHint[] = [];
  let cursor: string | undefined;

  do {
    const result = await getEmDashCollection("pages", { status: "published", limit: 100, cursor });
    if (result.error) throw result.error;
    cacheHints.push(result.cacheHint);
    for (const entry of result.entries) {
      const { slug, updatedAt } = toPage(entry as Entry);
      if (slug) pages.push({ slug, updatedAt });
    }
    cursor = result.nextCursor;
  } while (cursor);

  return { pages, cacheHints };
}
