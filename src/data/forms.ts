import { EMDASH_URL, contentStatuses, createEmDashClient } from "../lib/emdash.ts";

export interface FormField {
  component: "Input" | "Textarea" | "Select" | "Cloudflare";
  name?: string;
  type?: string;
  rows?: string;
  required?: boolean;
  options?: { name: string }[];
}

export interface FormDialog {
  icon: string;
  title: string;
  description: string;
  primaryButton: { text: string; href: string };
  secondaryButton: { text: string };
}

export interface FormEntry {
  slug: string;
  name: string;
  description: string;
  email: string;
  worker: string;
  dialog?: FormDialog;
  fields: FormField[];
}

const fullName: FormField = { component: "Input", name: "Full name", type: "text", required: true };
const emailField: FormField = { component: "Input", name: "Email", type: "email", required: true };
const optionalPhone: FormField = { component: "Input", name: "Phone number", type: "tel", required: false };
const subject: FormField = { component: "Input", name: "Subject", type: "text", required: true };
const organisation: FormField = { component: "Input", name: "Organisation", type: "text", required: true };
const message: FormField = { component: "Textarea", name: "Message", rows: "4", required: true };
const captcha: FormField = { component: "Cloudflare" };

// The title, description and email of each form are edited in the EmDash forms
// collection. What the page needs to build the form itself (fields, dialog) is not
// stored there, so it is defined here, keyed by EmDash slug.
// The order here is the order the forms are listed on /contact.
type FormDetails = Pick<FormEntry, "fields" | "dialog">;

const FORM_DETAILS: Record<string, FormDetails> = {
  "general-enquiries": {
    fields: [fullName, emailField, optionalPhone, subject, message, captcha],
  },
  "awards-enquiries": {
    dialog: {
      icon: "fa-solid fa-envelope",
      title:
        "Before contacting us, please first ensure you've read the information contained on our Awards page",
      description:
        "If you haven’t been able to find the answer to your question on our website, you can email us.",
      primaryButton: { text: "Go to our Awards FAQs", href: "/awards#faq" },
      secondaryButton: { text: "Email us" },
    },
    fields: [
      fullName,
      emailField,
      optionalPhone,
      subject,
      {
        component: "Select",
        name: "Support",
        required: true,
        options: [{ name: "Pre-application" }, { name: "Application" }, { name: "Post-application" }],
      },
      message,
      captcha,
    ],
  },
  "partnerships-enquiries": {
    fields: [
      fullName,
      emailField,
      optionalPhone,
      organisation,
      { component: "Input", name: "Role", type: "text", required: true },
      subject,
      message,
      captcha,
    ],
  },
  "volunteering-enquiries": {
    fields: [fullName, emailField, optionalPhone, organisation, subject, message, captcha],
  },
  "press-media-enquiries": {
    fields: [
      fullName,
      emailField,
      { ...optionalPhone, required: true },
      organisation,
      subject,
      message,
      { component: "Input", name: "Deadline", type: "date", required: true },
      captcha,
    ],
  },
};

const WORKER = "/enquiries";

async function fetchForms(): Promise<FormEntry[]> {
  const client = createEmDashClient("forms");
  const bySlug = new Map<string, FormEntry>();

  for (const status of contentStatuses) {
    for await (const item of client.listAll("forms", { status, limit: 100 })) {
      const slug = String(item.slug ?? "").trim();
      if (!slug) continue;
      const details = FORM_DETAILS[slug];
      if (!details) {
        console.warn(`Form "${slug}" has no fields defined in src/data/forms.ts, skipping it`);
        continue;
      }
      bySlug.set(slug, {
        slug,
        name: String(item.data.title ?? "").trim(),
        description: String(item.data.subtitle ?? "").trim(),
        email: String(item.data.email ?? "").trim(),
        worker: WORKER,
        ...details,
      });
    }
  }

  const forms = Object.keys(FORM_DETAILS).flatMap((slug) => bySlug.get(slug) ?? []);

  console.log(`Loaded ${forms.length} forms from EmDash (${EMDASH_URL})`);
  return forms;
}

export const forms = await fetchForms();
