import { EMDASH_URL, createEmDashClient } from "../lib/emdash.ts";

export interface FaqEntry {
  question: string;
  answer: string;
}

async function fetchFaqs(): Promise<FaqEntry[]> {
  const client = createEmDashClient("FAQs");
  const faqs: FaqEntry[] = [];

  for await (const item of client.listAll("faqs", { status: "published", limit: 100 })) {
    faqs.push({
      question: String(item.data.title ?? "").trim(),
      answer: String(item.data.answer ?? "").trim(),
    });
  }

  // EmDash FAQs have no manual order, so list them alphabetically.
  faqs.sort((a, b) => a.question.localeCompare(b.question, "en-GB"));

  console.log(`Loaded ${faqs.length} FAQs from EmDash (${EMDASH_URL})`);
  return faqs;
}

export const faq = await fetchFaqs();
