import type { PortableTextBlock } from "emdash";
import { EMDASH_URL, absoluteMediaUrls, createEmDashClient, showDrafts } from "../lib/emdash.ts";

export interface PageEntry {
  slug: string;
  title: string;
  subtitle: string;
  content: PortableTextBlock[];
  showUpdatedAt: boolean;
  updatedAt: string;
}

async function fetchPages(): Promise<PageEntry[]> {
  const client = createEmDashClient("pages");
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
        content: absoluteMediaUrls((item.data.content as PortableTextBlock[] | null) ?? []),
        showUpdatedAt: Boolean(item.data.show_updated_at),
        updatedAt: item.updatedAt,
      });
    }
  }

  console.log(`Loaded ${pages.length} pages from EmDash (${EMDASH_URL})`);
  return pages;
}

export const pages = await fetchPages();
