import type { PortableTextBlock } from "emdash";
import { EmDashClient } from "emdash/client";
import { resolveEnvVar } from "./env.ts";

// Content is fetched over EmDash's HTTP API at build time. The prerender step
// runs in Node (see astro.config.mjs), where the D1 binding that EmDash's
// in-process queries need isn't available.
// `astro dev` serves EmDash itself (with dev-bypass auth), so read from it by
// default there. Builds must say which EmDash instance to read from.
export const EMDASH_URL = (
  (await resolveEnvVar("EMDASH_URL")) ??
  (import.meta.env?.DEV ? "http://localhost:4321" : "")
).replace(/\/$/, "");

if (!EMDASH_URL) {
  throw new Error(
    "EMDASH_URL is required to build pages (the EmDash site to read from, e.g. https://unltd.org.uk).",
  );
}

const EMDASH_TOKEN = await resolveEnvVar("EMDASH_TOKEN");
const isLocal = /^https?:\/\/(localhost|127\.0\.0\.1)(:|\/|$)/.test(EMDASH_URL);

/**
 * The client has no public method for a post's taxonomy terms, so call its
 * JSON request method (private in the types, available at runtime).
 */
export function emdashRequest<T>(client: EmDashClient, method: string, path: string): Promise<T> {
  const raw = client as unknown as {
    request: (method: string, path: string) => Promise<T>;
  };
  return raw.request(method, path);
}

export interface MediaItem {
  /** Root-relative URL of the file; EmDash serves it on whichever domain the site runs on. */
  url: string;
  alt: string;
  width?: number;
  height?: number;
}

/** A media library item by ID, so a page can use its alt text and size from EmDash rather than repeating them. */
export async function getMediaItem(id: string): Promise<MediaItem> {
  const client = createEmDashClient("media");
  const { item } = await emdashRequest<{
    item: { storageKey: string; alt: string | null; width: number | null; height: number | null };
  }>(client, "GET", `/media/${encodeURIComponent(id)}`);
  return {
    url: `/_emdash/api/media/file/${item.storageKey}`,
    alt: item.alt?.trim() ?? "",
    width: item.width ?? undefined,
    height: item.height ?? undefined,
  };
}

/** Maps `items` through an async `fn`, running at most `limit` calls at once. */
export async function mapWithConcurrency<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
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

/** IDs of the entries a reference field points to, in the order chosen in EmDash. */
export async function referenceChildIds(
  client: EmDashClient,
  collection: string,
  entryId: string,
  relation: string,
): Promise<string[]> {
  const ids: string[] = [];
  let cursor: string | undefined;
  do {
    const query = cursor ? `?cursor=${encodeURIComponent(cursor)}` : "";
    const page = await emdashRequest<{
      children: { id: string }[];
      nextCursor?: string | null;
    }>(
      client,
      "GET",
      `/content/${collection}/${encodeURIComponent(entryId)}/references/${relation}/children${query}`,
    );
    ids.push(...page.children.map((child) => child.id));
    cursor = page.nextCursor ?? undefined;
  } while (cursor);
  return ids;
}

/**
 * Images inside Portable Text content are stored as root-relative paths
 * (`/_emdash/api/media/file/...`). EmDash's image component resolves those
 * against the site's own address (`site` in astro.config.mjs, i.e. production),
 * so on a preview deployment, or anywhere that address does not serve the
 * media, the images 404. It also stops Astro optimising them, because that
 * address is not an allowed image host. Pointing them at the EmDash instance
 * the content was read from fixes both.
 */
export function absoluteMediaUrls(blocks: PortableTextBlock[]): PortableTextBlock[] {
  return blocks.map((block) => {
    const asset = block.asset as { url?: unknown } | undefined;
    const url = asset?.url;
    if (typeof url === "string" && url.startsWith("/") && !url.startsWith("//")) {
      return { ...block, asset: { ...asset, url: `${EMDASH_URL}${url}` } };
    }
    return block;
  });
}

/** Client for reading content. `what` names the content in the error if no token is set. */
export function createEmDashClient(what: string): EmDashClient {
  if (!EMDASH_TOKEN && !isLocal) {
    throw new Error(
      `EMDASH_TOKEN is required to read ${what} from ${EMDASH_URL} (create an API token in the EmDash admin with content read access).`,
    );
  }

  return new EmDashClient({
    baseUrl: EMDASH_URL,
    token: EMDASH_TOKEN,
    devBypass: !EMDASH_TOKEN && isLocal,
  });
}
