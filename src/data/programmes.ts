import type { PortableTextBlock } from "emdash";
import {
  EMDASH_URL,
  absoluteMediaUrls,
  createEmDashClient,
  referenceChildIds,
} from "../lib/emdash.ts";

export interface ProgrammeImage {
  /** Absolute URL of the file on the EmDash site. */
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface ProgrammeService {
  slug: string;
  title: string;
  subtitle: string;
  /** FontAwesome class string for DynamicIcon, or "" when the icon is unknown. */
  icon: string;
}

export interface ProgrammeVideo {
  title: string;
  /** YouTube watch URL. */
  url: string;
  /** Absolute URL of the thumbnail uploaded in EmDash, or "" to use YouTube's own. */
  thumbnail: string;
}

export interface ProgrammeEntry {
  id: string;
  slug: string;
  title: string;
  /** Introduction as plain text, paragraphs separated by a blank line. */
  subtitle: string;
  /** The first paragraph of the introduction, for cards and meta descriptions. */
  summary: string;
  image: ProgrammeImage | null;
  /** FontAwesome class string for DynamicIcon, or "" when the programme has none. */
  icon: string;
  services: ProgrammeService[];
  /** Linked images in the content (thumbnail + YouTube link), shown as videos. */
  videos: ProgrammeVideo[];
  /** The rest of the content. */
  content: PortableTextBlock[];
}

const SERVICES_RELATION = "programmes_services";

// The programmes collection has no icon field, so the icon shown next to a
// programme comes from here, keyed by EmDash slug.
const PROGRAMME_ICONS: Record<string, string> = {
  "funding-futures": "fa-solid fa-rocket-launch",
  "millennium-awards-trust": "fa-solid fa-universal-access",
};

// Service icons are chosen in the EmDash admin using its icon names; the site
// draws them with FontAwesome Light icons registered in src/lib/icons.ts.
const SERVICE_ICONS: Record<string, string> = {
  headset: "fa-light fa-user-headset",
  "user-focus": "fa-light fa-rectangle-pro",
  "users-four": "fa-light fa-people-group",
  files: "fa-light fa-files",
  handshake: "fa-light fa-handshake-angle",
};

function serviceIcon(name: string): string {
  if (!name) return "";
  if (name.includes("fa-")) return name;
  const icon = SERVICE_ICONS[name];
  if (!icon) console.warn(`No FontAwesome icon mapped for service icon "${name}" (src/data/programmes.ts)`);
  return icon ?? "";
}

const YOUTUBE_URL = /^https?:\/\/(?:www\.)?(?:youtube\.com|youtu\.be|youtube-nocookie\.com)\//;

// EmDash stores a media field as { id, filename, width, height, alt, meta: { storageKey } }
// and serves the file from /_emdash/api/media/file/<storageKey>.
function toImage(field: any): ProgrammeImage | null {
  const storageKey = field?.meta?.storageKey;
  if (!storageKey) return null;
  return {
    src: `${EMDASH_URL}/_emdash/api/media/file/${storageKey}`,
    alt: String(field.alt ?? "").trim(),
    width: field.width ?? undefined,
    height: field.height ?? undefined,
  };
}

/** An image block that links to YouTube is a video: the image is its thumbnail. */
function toVideo(block: PortableTextBlock): ProgrammeVideo | null {
  if (block._type !== "image") return null;
  const url = (block.link as { href?: unknown } | undefined)?.href;
  if (typeof url !== "string" || !YOUTUBE_URL.test(url)) return null;
  const asset = block.asset as { url?: unknown } | undefined;
  return {
    title: String(block.caption ?? "").trim(),
    url,
    thumbnail: typeof asset?.url === "string" ? asset.url : "",
  };
}

async function fetchProgrammes(): Promise<ProgrammeEntry[]> {
  const client = createEmDashClient("programmes");

  const servicesById = new Map<string, ProgrammeService>();
  for await (const item of client.listAll("services", { status: "published", limit: 100 })) {
    servicesById.set(item.id, {
      slug: String(item.slug ?? ""),
      title: String(item.data.title ?? "").trim(),
      subtitle: String(item.data.subtitle ?? "").trim(),
      icon: serviceIcon(String(item.data.icon ?? "").trim()),
    });
  }

  async function fetchServices(programmeId: string): Promise<ProgrammeService[]> {
    const ids = await referenceChildIds(client, "programmes", programmeId, SERVICES_RELATION);
    return ids.flatMap((id) => servicesById.get(id) ?? []);
  }

  const items: any[] = [];
  for await (const item of client.listAll("programmes", { status: "published", limit: 100 })) {
    if (item.slug) items.push(item);
  }

  const programmes: ProgrammeEntry[] = [];
  for (const item of items) {
    const slug = String(item.slug).trim();
    const subtitle = String(item.data.subtitle ?? "").trim();
    const blocks = absoluteMediaUrls((item.data.content as PortableTextBlock[] | null) ?? []);

    const videos: ProgrammeVideo[] = [];
    const content: PortableTextBlock[] = [];
    for (const block of blocks) {
      const video = toVideo(block);
      if (video) videos.push(video);
      else content.push(block);
    }

    programmes.push({
      id: item.id,
      slug,
      title: String(item.data.title ?? "").trim(),
      subtitle,
      summary: subtitle.split(/\n\s*\n/)[0]?.trim() ?? "",
      image: toImage(item.data.featured_image),
      icon: PROGRAMME_ICONS[slug] ?? "",
      services: await fetchServices(item.id),
      videos,
      content,
    });
  }

  programmes.sort((a, b) => a.title.localeCompare(b.title, "en-GB"));

  console.log(
    `Loaded ${programmes.length} programmes and ${servicesById.size} services from EmDash (${EMDASH_URL})`,
  );

  return programmes;
}

export const programmes = await fetchProgrammes();
