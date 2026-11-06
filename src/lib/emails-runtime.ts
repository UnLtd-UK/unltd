import { getEmDashCollection, getEmDashEntry, type CacheHint, type EditProxy } from "emdash";

// Reads the "Emails" collection (slug "forms") straight from EmDash's database
// in the Worker, so the contact pages are rendered on demand and never need a
// build. Do not import this from a prerendered page; the menu still uses
// @data/forms at build time.

export interface EmailDialog {
  title: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
}

export interface RuntimeEmail {
  slug: string;
  name: string;
  description: string;
  email: string;
  /** Shown as a pop-up on the page; only set when all four dialog fields are filled in. */
  dialog?: EmailDialog;
  /** Spread onto an element to make its field editable on the page (a no-op unless an editor is in edit mode). */
  edit: EditProxy;
}

// The generated collection types can lag the real schema, so read entries loosely.
type Entry = { data: Record<string, any>; edit: EditProxy };

const text = (value: unknown) => String(value ?? "").trim();

const toEmail = (entry: Entry): RuntimeEmail => {
  const d = entry.data;
  const dialog = {
    title: text(d.dialog_title),
    description: text(d.dialog_subtitle),
    buttonText: text(d.dialog_button),
    buttonUrl: text(d.dialog_url),
  };
  return {
    slug: text(d.slug),
    name: text(d.title),
    description: text(d.subtitle),
    email: text(d.email),
    dialog: Object.values(dialog).every(Boolean) ? dialog : undefined,
    edit: entry.edit,
  };
};

/** One email page by slug, or null. A draft is returned only for a valid EmDash preview link. */
export async function getEmail(
  slug: string,
): Promise<{ email: RuntimeEmail | null; isPreview: boolean; cacheHint: CacheHint }> {
  const { entry, isPreview, cacheHint } = await getEmDashEntry("forms", slug);
  return { email: entry ? toEmail(entry as unknown as Entry) : null, isPreview, cacheHint };
}

/** Every published email page, by name. */
export async function getAllEmails(): Promise<{ emails: RuntimeEmail[]; cacheHints: CacheHint[] }> {
  const emails: RuntimeEmail[] = [];
  const cacheHints: CacheHint[] = [];
  let cursor: string | undefined;

  do {
    const result = await getEmDashCollection("forms", { status: "published", limit: 100, cursor });
    if (result.error) throw result.error;
    cacheHints.push(result.cacheHint);
    for (const entry of result.entries) {
      const email = toEmail(entry as unknown as Entry);
      if (email.slug) emails.push(email);
    }
    cursor = result.nextCursor;
  } while (cursor);

  // EmDash entries have no manual order, so list them alphabetically.
  emails.sort((a, b) => a.name.localeCompare(b.name, "en-GB"));
  return { emails, cacheHints };
}
