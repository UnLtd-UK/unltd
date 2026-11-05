import type { PortableTextBlock, ImageValue } from "emdash";
import {
  EMDASH_URL,
  createEmDashClient,
  emdashRequest,
  mapWithConcurrency,
} from "../lib/emdash.ts";

export interface PostAuthor {
  name: string;
  jobTitle: string;
}

export interface PostImage {
  /** Absolute URL of the file on the EmDash site. */
  src: string;
  /** The EmDash media value, set when the post is read in the Worker; render it with emdash/ui's Image. */
  media?: ImageValue;
  alt: string;
  caption: string;
  width?: number;
  height?: number;
}

export interface PostEntry {
  slug: string;
  title: string;
  subtitle: string;
  tag: { slug: string; label: string } | null;
  image: PostImage | null;
  authors: PostAuthor[];
  /** ISO date used for display, sorting and the year tabs. */
  date: string;
  status: "published" | "scheduled" | "draft";
  content: PortableTextBlock[];
}

const TAG_TAXONOMY = "tag";
const TERMS_CONCURRENCY = 8;

const mediaUrl = (path: string) => (/^https?:\/\//.test(path) ? path : `${EMDASH_URL}${path}`);

// EmDash stores a media field as { id, filename, width, height, alt, meta: { storageKey } }
// and serves the file from /_emdash/api/media/file/<storageKey>.
function toImage(field: any): PostImage | null {
  if (!field) return null;
  const path =
    field.src ??
    (field.meta?.storageKey ? `/_emdash/api/media/file/${field.meta.storageKey}` : null);
  if (!path) return null;
  return {
    src: mediaUrl(path),
    alt: String(field.alt ?? "").trim(),
    caption: String(field.caption ?? field.meta?.caption ?? "").trim(),
    width: field.width ?? undefined,
    height: field.height ?? undefined,
  };
}

const dateOf = (item: any): string => item.publishedAt ?? item.scheduledAt ?? item.createdAt;

/**
 * The newest `limit` posts, for the home page. The full blog is rendered on
 * demand (src/lib/posts-runtime.ts), so the build only reads what it shows.
 */
export async function latestPosts(limit: number): Promise<PostEntry[]> {
  const client = createEmDashClient("posts");
  const items: any[] = [];

  for await (const item of client.listAll("posts", { status: "published", limit: 100 })) {
    if (item.slug) items.push(item);
  }

  const now = Date.now();
  const newest = items
    // A published post dated in the future should not appear yet.
    .filter((item) => !(item.status === "published" && new Date(dateOf(item)).getTime() > now))
    .sort((a, b) => new Date(dateOf(b)).getTime() - new Date(dateOf(a)).getTime())
    .slice(0, limit);

  // The list endpoint doesn't include taxonomy terms, so they are read per post.
  const tags = await mapWithConcurrency(newest, TERMS_CONCURRENCY, async (item) => {
    const data = await emdashRequest<{ terms: { slug: string; label: string }[] }>(
      client,
      "GET",
      `/content/posts/${encodeURIComponent(item.id)}/terms/${TAG_TAXONOMY}`,
    );
    const term = data.terms?.[0];
    return term ? { slug: term.slug, label: term.label } : null;
  });

  const posts = newest.map((item, index): PostEntry => ({
    slug: String(item.slug).trim(),
    title: String(item.data.title ?? "").trim(),
    subtitle: String(item.data.subtitle ?? "").trim(),
    tag: tags[index],
    image: toImage(item.data.featured_image),
    authors: (item.bylines ?? []).map((credit: any) => ({
      name: String(credit.byline?.displayName ?? ""),
      jobTitle: String(credit.byline?.customFields?.job_title ?? ""),
    })).filter((author: PostAuthor) => author.name),
    date: dateOf(item),
    status: item.status,
    content: [],
  }));

  console.log(`Loaded the ${posts.length} latest posts from EmDash (${EMDASH_URL})`);
  return posts;
}
