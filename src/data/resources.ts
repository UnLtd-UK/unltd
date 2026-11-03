import type { PortableTextBlock } from "emdash";
import { calculateReadTime } from "./functions/read-time.js";
import { EMDASH_URL, absoluteMediaUrls, createEmDashClient, showDrafts } from "../lib/emdash.ts";

export interface ResourceEntry {
  slug: string;
  title: string;
  subtitle: string;
  content: PortableTextBlock[];
  hidden: boolean;
  readTime: number;
  updatedAt: string;
}

function portableTextToPlain(value: unknown): string {
  if (Array.isArray(value)) return value.map(portableTextToPlain).join(" ");
  if (value && typeof value === "object") {
    const node = value as { text?: unknown; children?: unknown };
    return typeof node.text === "string"
      ? node.text
      : portableTextToPlain(node.children);
  }
  return "";
}

async function fetchResources(): Promise<ResourceEntry[]> {
  const client = createEmDashClient("resources");
  const statuses = showDrafts ? ["published", "draft"] : ["published"];
  const resources: ResourceEntry[] = [];

  for (const status of statuses) {
    for await (const item of client.listAll("resources", {
      status,
      limit: 100,
    })) {
      if (!item.slug) continue;
      const content = absoluteMediaUrls((item.data.content as PortableTextBlock[] | null) ?? []);
      resources.push({
        slug: item.slug,
        title: String(item.data.title ?? ""),
        subtitle: String(item.data.subtitle ?? ""),
        content,
        hidden: Boolean(item.data.hidden),
        readTime: Math.max(1, calculateReadTime(portableTextToPlain(content))),
        updatedAt: item.updatedAt,
      });
    }
  }

  resources.sort((a, b) => a.title.localeCompare(b.title, "en-GB"));

  console.log(`Loaded ${resources.length} resources from EmDash (${EMDASH_URL})`);
  return resources;
}

export const resources = await fetchResources();
