import { EMDASH_URL, createEmDashClient } from "../lib/emdash.ts";

export interface EmailDialog {
  title: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
}

/** An entry in the EmDash "Emails" collection (slug "forms"): a contact page for one email address. */
export interface FormEntry {
  id: string;
  slug: string;
  name: string;
  description: string;
  email: string;
  /** Shown as a pop-up on the page; only set when all four dialog fields are filled in. */
  dialog?: EmailDialog;
}

async function fetchForms(): Promise<FormEntry[]> {
  const client = createEmDashClient("emails");
  const forms: FormEntry[] = [];

  for await (const item of client.listAll("forms", { status: "published", limit: 100 })) {
    const slug = String(item.slug ?? "").trim();
    if (!slug) continue;

    const d = item.data;
    const text = (value: unknown) => String(value ?? "").trim();
    const dialog = {
      title: text(d.dialog_title),
      description: text(d.dialog_subtitle),
      buttonText: text(d.dialog_button),
      buttonUrl: text(d.dialog_url),
    };

    forms.push({
      id: item.id,
      slug,
      name: text(d.title),
      description: text(d.subtitle),
      email: text(d.email),
      dialog: Object.values(dialog).every(Boolean) ? dialog : undefined,
    });
  }

  // EmDash entries have no manual order, so list them alphabetically.
  forms.sort((a, b) => a.name.localeCompare(b.name, "en-GB"));

  console.log(`Loaded ${forms.length} email pages from EmDash (${EMDASH_URL})`);
  return forms;
}

export const forms = await fetchForms();
