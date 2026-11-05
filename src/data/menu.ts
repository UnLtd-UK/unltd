import { EMDASH_URL, createEmDashClient, emdashRequest } from "../lib/emdash.ts";
import { forms } from "./forms.ts";
import { pages } from "./pages.ts";

interface MenuItem {
  id: string;
  parentId: string | null;
  sortOrder: number;
  type: string;
  referenceCollection: string | null;
  referenceId: string | null;
  customUrl: string | null;
  label: string;
  titleAttr: string | null;
  target: string | null;
  cssClasses: string | null;
}

export interface NavLink {
  id: string;
  name: string;
  description: string;
  href: string;
  icon: string;
  external: boolean;
  /** Non-icon classes from the EmDash "CSS Classes" field; the dropdown styles links from these. */
  classes: string[];
  enabled: true;
}

export interface NavGroup {
  id: string;
  name: string;
  href?: string;
  enabled: true;
  items?: NavLink[];
  actions?: NavLink[];
}

// The EmDash menu only holds a label and a URL for each link. The blurb shown
// in the dropdowns is kept here, keyed by URL. A link's "Title attribute" in
// EmDash, when set, is used as its description instead.
// A link's icon is set in the EmDash "CSS Classes" field as Font Awesome classes
// (e.g. "fa-solid fa-award"); any other classes are passed through as they are.
const LINK_DETAILS: Record<string, { description: string }> = {
  "/awards": {
    description: "Grants & services for social entrepreneurs",
  },
  "/community-climate-action": {
    description:
      "Awards of up to £8,000 and support for early-stage social entrepreneurs taking practical action on climate change within their communities",
  },
  "https://growthimpactfund.org.uk": {
    description: "Investment & services for social ventures",
  },
  "/partnerships": {
    description: "Collaborate with us by funding or supporting a new or existing programme.",
  },
  "/volunteering": {
    description:
      "Support social entrepreneurs by sharing your skills, experience, and time. Whether through one-to-one mentoring, pro bono consulting, expert advising, or corporate volunteering.",
  },
  "/our-purpose": { description: "Vision and mission" },
  "/our-people": {
    description: "An executive team, trustees and four directorates",
  },
  "https://2025.strategy.unltd.org.uk": {
    description: "How we make impact",
  },
};

// A top-level item with the CSS class "action" in EmDash is shown as the
// call-to-action link at the end of the header, not among the main items.
const isAction = (item: MenuItem) => (item.cssClasses ?? "").split(/\s+/).includes("action");
// "growth-impact-fund" gives a dropdown link the Growth Impact Fund look (see components/ui/Popover.jsx).

// EmDash requires every menu item to have a URL, so a dropdown heading uses an
// in-page anchor such as "/#about-us". Those are headings, not destinations.
const isGroupHeading = (url: string) => url.startsWith("/#");

const isIconClass = (c: string) => c.startsWith("fa-") || ["fas", "far", "fab", "fal", "fat"].includes(c);

const normaliseUrl = (url: string) => url.replace(/\/$/, "");

function resolveUrl(item: MenuItem): string | null {
  if (item.type === "custom") return item.customUrl;
  if (item.referenceCollection === "pages") {
    const page = pages.find((p) => p.id === item.referenceId);
    return page ? `/${page.slug}` : null;
  }
  if (item.referenceCollection === "forms") {
    const form = forms.find((f) => f.id === item.referenceId);
    return form ? `/contact/${form.slug}` : null;
  }
  return null;
}

async function fetchMenuItems(name: string): Promise<MenuItem[]> {
  const client = createEmDashClient(`the ${name} menu`);
  const { items } = await emdashRequest<{ items: MenuItem[] }>(client, "GET", `/menus/${name}`);
  return [...items].sort((a, b) => a.sortOrder - b.sortOrder);
}

function toLink(menu: string, item: MenuItem): NavLink | null {
  const url = resolveUrl(item);
  if (!url) {
    console.warn(`Menu "${menu}" item "${item.label}" has no URL (is its page or form published?), skipping it`);
    return null;
  }
  // Drop the trailing slash on external sites; the dropdown matches on the bare URL.
  const href = /^https?:\/\//.test(url) ? normaliseUrl(url) : url;
  const details = LINK_DETAILS[href];
  const classes = (item.cssClasses ?? "").split(/\s+/).filter(Boolean);
  return {
    id: item.id,
    name: item.label,
    description: item.titleAttr?.trim() || details?.description || "",
    href,
    icon: classes.filter(isIconClass).join(" "),
    external: /^https?:\/\//.test(href),
    classes: classes.filter((c) => !isIconClass(c)),
    enabled: true,
  };
}

async function fetchHeader() {
  const ordered = await fetchMenuItems("primary");

  const main: NavGroup[] = [];
  let action: { name: string; link: string; enabled: true } | null = null;
  for (const item of ordered.filter((i) => !i.parentId)) {
    if (isAction(item)) {
      const url = resolveUrl(item);
      if (url) action = { name: item.label, link: url, enabled: true };
      continue;
    }
    const children = ordered
      .filter((i) => i.parentId === item.id)
      .flatMap((child) => toLink("primary", child) ?? []);
    const url = resolveUrl(item);

    if (children.length > 0 || (url && isGroupHeading(url))) {
      if (children.length > 0) {
        main.push({ id: item.id, name: item.label, enabled: true, items: children, actions: [] });
      }
    } else if (url) {
      main.push({ id: item.id, name: item.label, href: url, enabled: true });
    }
  }

  console.log(`Loaded primary menu from EmDash (${EMDASH_URL}): ${main.length} top-level items`);
  return { main, action: action ?? { name: "", link: "", enabled: false }, enabled: true };
}

export const headerNavigation = { code: { header: await fetchHeader() } };

export interface FooterLinkGroup {
  name: string;
  items: NavLink[];
}

// The footer menu is a list of headings (top-level items) each with its links.
async function fetchFooterLinks(): Promise<FooterLinkGroup[]> {
  const ordered = await fetchMenuItems("footer");
  const groups: FooterLinkGroup[] = [];

  for (const heading of ordered.filter((i) => !i.parentId)) {
    const items = ordered
      .filter((i) => i.parentId === heading.id)
      .flatMap((child) => toLink("footer", child) ?? []);
    if (items.length > 0) groups.push({ name: heading.label, items });
  }

  console.log(`Loaded footer menu from EmDash (${EMDASH_URL}): ${groups.length} groups`);
  return groups;
}

export const footerLinks = await fetchFooterLinks();
