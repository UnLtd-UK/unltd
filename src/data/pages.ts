import { EMDASH_URL, createEmDashClient } from "../lib/emdash.ts";

/**
 * Just what the menus need to turn a page reference into a URL. Pages
 * themselves are rendered on demand (src/lib/pages-runtime.ts), so a page
 * edit needs no build; a page added to a menu still shows after the next one.
 */
export interface PageEntry {
  id: string;
  slug: string;
}

async function fetchPages(): Promise<PageEntry[]> {
  const client = createEmDashClient("pages");
  const pages: PageEntry[] = [];

  for await (const item of client.listAll("pages", { status: "published", limit: 100 })) {
    if (!item.slug) continue;
    pages.push({ id: item.id, slug: item.slug });
  }

  console.log(`Loaded ${pages.length} pages from EmDash (${EMDASH_URL})`);
  return pages;
}

export const pages = await fetchPages();
