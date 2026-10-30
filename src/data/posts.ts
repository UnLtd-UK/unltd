import type { PortableTextBlock } from "emdash";
import {
  EMDASH_URL,
  contentStatuses,
  createEmDashClient,
  emdashRequest,
} from "../lib/emdash.ts";

export interface PostAuthor {
  name: string;
  jobTitle: string;
}

export interface PostImage {
  /** Absolute URL of the file on the EmDash site. */
  src: string;
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

// The list endpoint doesn't include taxonomy terms, so they are read per post.
async function mapWithConcurrency<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const results = new Array<R>(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (next < items.length) {
        const index = next++;
        results[index] = await fn(items[index]);
      }
    }),
  );
  return results;
}

async function fetchPosts(): Promise<PostEntry[]> {
  const client = createEmDashClient("posts");
  const items: any[] = [];

  for (const status of contentStatuses) {
    for await (const item of client.listAll("posts", { status, limit: 100 })) {
      if (item.slug) items.push(item);
    }
  }

  const tags = await mapWithConcurrency(items, TERMS_CONCURRENCY, async (item) => {
    const data = await emdashRequest<{ terms: { slug: string; label: string }[] }>(
      client,
      "GET",
      `/content/posts/${encodeURIComponent(item.id)}/terms/${TAG_TAXONOMY}`,
    );
    const term = data.terms?.[0];
    return term ? { slug: term.slug, label: term.label } : null;
  });

  const now = Date.now();
  const posts: PostEntry[] = [];

  items.forEach((item, index) => {
    const date: string = item.publishedAt ?? item.scheduledAt ?? item.createdAt;
    // A published post dated in the future should not appear yet.
    if (item.status === "published" && new Date(date).getTime() > now) return;

    posts.push({
      slug: String(item.slug).trim(),
      title: String(item.data.title ?? "").trim(),
      subtitle: String(item.data.subtitle ?? "").trim(),
      tag: tags[index],
      image: toImage(item.data.featured_image),
      authors: (item.bylines ?? []).map((credit: any) => ({
        name: String(credit.byline?.displayName ?? ""),
        jobTitle: String(credit.byline?.customFields?.job_title ?? ""),
      })).filter((author: PostAuthor) => author.name),
      date,
      status: item.status,
      content: (item.data.content as PortableTextBlock[] | null) ?? [],
    });
  });

  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const count = (predicate: (post: PostEntry) => boolean) => posts.filter(predicate).length;
  console.log(
    `Loaded ${posts.length} posts from EmDash (${EMDASH_URL}): ` +
      `${count((p) => !!p.tag)} with a tag, ${count((p) => p.authors.length > 0)} with a byline, ` +
      `${count((p) => !!p.image)} with a featured image`,
  );

  return posts;
}

export const posts = await fetchPosts();
