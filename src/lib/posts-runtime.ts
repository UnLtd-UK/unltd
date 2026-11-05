import { getEmDashCollection, getEmDashEntry, type CacheHint, type EditProxy } from "emdash";
import { postYear } from "@utils/post-format";
import type { PostAuthor, PostEntry, PostImage } from "@data/posts";

// Reads posts straight from EmDash's database in the Worker, so the blog is
// rendered on demand and never needs a build. Do not import this from a
// prerendered page, and do not import @data/posts' values here: that module
// reads EmDash over HTTP at build time.

const PAGE_SIZE = 100;

// The generated collection types lag the real schema (no `subtitle`), so read entries loosely.
type Entry = { data: Record<string, any> };

function toImage(field: any): PostImage | null {
  if (!field) return null;
  const src =
    field.src ??
    (field.meta?.storageKey ? `/_emdash/api/media/file/${field.meta.storageKey}` : null);
  if (!src) return null;
  return {
    src,
    media: field,
    alt: String(field.alt ?? "").trim(),
    caption: String(field.caption ?? field.meta?.caption ?? "").trim(),
    width: field.width ?? undefined,
    height: field.height ?? undefined,
  };
}

const toIso = (value: unknown): string => (value instanceof Date ? value : new Date(String(value))).toISOString();

export function toPostEntry(entry: Entry): PostEntry {
  const d = entry.data;
  const term = d.terms?.tag?.[0];
  return {
    slug: String(d.slug ?? "").trim(),
    title: String(d.title ?? "").trim(),
    subtitle: String(d.subtitle ?? "").trim(),
    tag: term ? { slug: term.slug, label: term.label } : null,
    image: toImage(d.featured_image),
    authors: (d.bylines ?? [])
      .map((credit: any): PostAuthor => ({
        name: String(credit.byline?.displayName ?? ""),
        jobTitle: String(credit.byline?.customFields?.job_title ?? ""),
      }))
      .filter((author: PostAuthor) => author.name),
    date: toIso(d.publishedAt ?? d.scheduledAt ?? d.createdAt),
    status: d.status,
    content: d.content ?? [],
  };
}

/** One post by slug, or null. A draft is returned only for a valid EmDash preview link. */
export async function getPost(
  slug: string,
): Promise<{ post: PostEntry | null; edit: EditProxy | null; isPreview: boolean; cacheHint: CacheHint }> {
  const { entry, isPreview, cacheHint } = await getEmDashEntry("posts", slug);
  return {
    post: entry ? toPostEntry(entry as unknown as Entry) : null,
    // Spread onto an element to make its field editable on the page (a no-op unless an editor is in edit mode).
    edit: entry?.edit ?? null,
    isPreview,
    cacheHint,
  };
}

/** Every year that has a post, newest first. */
export function postYears(posts: PostEntry[]): number[] {
  return [...new Set(posts.map((post) => postYear(post.date)))].sort((a, b) => b - a);
}

/** Every published post, newest first. */
export async function getAllPosts(): Promise<{ posts: PostEntry[]; cacheHints: CacheHint[] }> {
  const posts: PostEntry[] = [];
  const cacheHints: CacheHint[] = [];
  let cursor: string | undefined;

  do {
    const result = await getEmDashCollection("posts", {
      status: "published",
      limit: PAGE_SIZE,
      cursor,
      orderBy: { published_at: "desc" },
    });
    if (result.error) throw result.error;
    cacheHints.push(result.cacheHint);
    for (const entry of result.entries) {
      if (entry.data.slug) posts.push(toPostEntry(entry as unknown as Entry));
    }
    cursor = result.nextCursor;
  } while (cursor);

  return { posts, cacheHints };
}
