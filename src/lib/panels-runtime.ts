import { getEmDashEntry, type CacheHint, type EditProxy } from "emdash";
import { pronounsText } from "../utils/pronouns.ts";

// Reads a panel, and the people and social entrepreneurs it references,
// straight from EmDash's database in the Worker, so it is rendered on demand
// and never needs a build. Do not import this from a prerendered page, and do
// not import @data/panels or @data/people here: those read EmDash over HTTP at
// build time.

export interface PanelPerson {
  name: string;
  pronouns: string;
  roleTitle: string;
  subtitle: string;
  linkedin: string;
  /** URL of the photo, or "" for none. */
  image: string;
  imageAlt: string;
}

export interface RuntimePanel {
  slug: string;
  title: string;
  programme: string;
  team: string;
  /** Calendar date in UK time, YYYY-MM-DD, or "" when unset. */
  date: string;
  chair: PanelPerson | null;
  colleagues: PanelPerson[];
  /** The social entrepreneurs on the panel. */
  members: PanelPerson[];
  /** Spread onto an element to make its field editable on the page (a no-op unless an editor is in edit mode). */
  edit: EditProxy;
}

// The generated collection types lag the real schema, so read entries loosely.
type Entry = { data: Record<string, any>; edit: EditProxy };
type ReferenceEntry = { data: Record<string, any> };
type References = Record<string, { entries: ReferenceEntry[] } | undefined>;

const text = (value: unknown) => String(value ?? "").trim();

// en-CA formats as YYYY-MM-DD
const londonDate = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/London" });

function imageSrc(field: any): string {
  if (!field) return "";
  if (typeof field.src === "string" && field.src) return field.src;
  return field.meta?.storageKey ? `/_emdash/api/media/file/${field.meta.storageKey}` : "";
}

const toPerson = ({ data: d }: ReferenceEntry): PanelPerson => {
  const name = text(d.title);
  return {
    name,
    pronouns: pronounsText(d.pronouns ?? d.gender_pronouns),
    roleTitle: text(d.role_title),
    subtitle: text(d.subtitle),
    linkedin: text(d.linkedin),
    image: imageSrc(d.image),
    imageAlt: text(d.image?.alt) || name,
  };
};

const toPanel = (entry: Entry, references: References): RuntimePanel => {
  const d = entry.data;
  const people = (field: string) => (references[field]?.entries ?? []).map(toPerson);
  const date = d.date ? new Date(d.date) : null;
  return {
    slug: text(d.slug),
    title: text(d.title),
    programme: text(d.programme),
    team: text(d.team),
    date: date && !Number.isNaN(date.getTime()) ? londonDate.format(date) : "",
    chair: people("panel_chair")[0] ?? null,
    colleagues: people("colleagues"),
    members: people("social_entrepreneurs"),
    edit: entry.edit,
  };
};

/**
 * One panel by slug, or null. A draft is returned only for a valid EmDash preview link.
 *
 * The cache hint also names every referenced person and social entrepreneur, so
 * editing one of them refreshes the panels that show them (and no others).
 */
export async function getPanel(
  slug: string,
): Promise<{ panel: RuntimePanel | null; isPreview: boolean; cacheHint: CacheHint }> {
  const { entry, isPreview, cacheHint } = await getEmDashEntry("panels", slug, {
    references: {
      panel_chair: { limit: 1 },
      colleagues: { limit: 100 },
      social_entrepreneurs: { limit: 100 },
    },
  } as never);
  if (!entry) return { panel: null, isPreview, cacheHint };
  const references = (entry as unknown as { references?: References }).references ?? {};
  return { panel: toPanel(entry as unknown as Entry, references), isPreview, cacheHint };
}
