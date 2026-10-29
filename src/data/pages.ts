import { EmDashClient } from "emdash/client";
import type { PortableTextBlock } from "emdash";
import { resolveEnvVar } from "../lib/env.ts";

// Pages are fetched over EmDash's HTTP API at build time. The prerender step
// runs in Node (see astro.config.mjs), where the D1 binding that EmDash's
// in-process queries need isn't available.
// `astro dev` serves EmDash itself (with dev-bypass auth), so read from it by
// default there. Builds must say which EmDash instance to read from.
const EMDASH_URL = (
  (await resolveEnvVar("EMDASH_URL")) ??
  (import.meta.env.DEV ? "http://localhost:4321" : "")
).replace(/\/$/, "");

if (!EMDASH_URL) {
  throw new Error(
    "EMDASH_URL is required to build pages (the EmDash site to read from, e.g. https://feature-emdash.unltd.workers.dev).",
  );
}
const EMDASH_TOKEN = await resolveEnvVar("EMDASH_TOKEN");
const showDrafts = process.env.SHOW_DRAFTS === "true";
const isLocal = /^https?:\/\/(localhost|127\.0\.0\.1)(:|\/|$)/.test(EMDASH_URL);

console.log(`Show Drafts: ${showDrafts}`);

export interface PageEntry {
  slug: string;
  title: string;
  subtitle: string;
  content: PortableTextBlock[];
  showUpdatedAt: boolean;
  updatedAt: string;
}

async function fetchPages(): Promise<PageEntry[]> {
  if (!EMDASH_TOKEN && !isLocal) {
    throw new Error(
      `EMDASH_TOKEN is required to read pages from ${EMDASH_URL} (create an API token in the EmDash admin with content read access).`,
    );
  }

  const client = new EmDashClient({
    baseUrl: EMDASH_URL,
    token: EMDASH_TOKEN,
    devBypass: !EMDASH_TOKEN && isLocal,
  });

  const statuses = showDrafts ? ["published", "draft"] : ["published"];
  const pages: PageEntry[] = [];

  for (const status of statuses) {
    for await (const item of client.listAll("pages", {
      status,
      limit: 100,
    })) {
      if (!item.slug) continue;
      pages.push({
        slug: item.slug,
        title: String(item.data.title ?? ""),
        subtitle: String(item.data.subtitle ?? ""),
        content: (item.data.content as PortableTextBlock[] | null) ?? [],
        showUpdatedAt: Boolean(item.data.show_updated_at),
        updatedAt: item.updatedAt,
      });
    }
  }

  console.log(`Loaded ${pages.length} pages from EmDash (${EMDASH_URL})`);
  return pages;
}

export const pages = await fetchPages();
