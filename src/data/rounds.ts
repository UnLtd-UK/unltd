import { EMDASH_URL, createEmDashClient } from "../lib/emdash.ts";

/**
 * A round in the shape the round components (utils/application-rounds.js) read.
 * Dates are naive Europe/London wall-clock strings, e.g. "2026-07-01T10:00:00".
 */
export interface RoundEntry {
  id: string;
  opens: string;
  closes: string;
  assessment_starts: string;
  assessment_ends: string;
  interview_starts: string | null;
  interview_ends: string | null;
  results_start: string;
  results_end: string;
  /** Maximum number of applications for the round; 0 when not tracked. */
  capacity: number;
  /** Applications received so far. */
  capacity_status: number;
}

const londonParts = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/London",
  hourCycle: "h23",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

// EmDash stores each datetime as a UTC instant. Round times are entered, and
// compared, as UK local time, so express the instant as London wall-clock time.
function toLondonWallClock(value: unknown): string | null {
  if (typeof value !== "string" || !value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  const p: Record<string, string> = {};
  for (const part of londonParts.formatToParts(date)) p[part.type] = part.value;
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}:${p.second}`;
}

async function fetchRounds(): Promise<RoundEntry[]> {
  const client = createEmDashClient("rounds");
  const rounds: RoundEntry[] = [];

  for await (const item of client.listAll("rounds", { status: "published", limit: 100 })) {
    const d = item.data;
    const opens = toLondonWallClock(d.apply_open);
    const closes = toLondonWallClock(d.apply_close);
    const assessmentStarts = toLondonWallClock(d.application_review_open);
    const assessmentEnds = toLondonWallClock(d.application_review_close);
    const resultsStart = toLondonWallClock(d.result_open);
    const resultsEnd = toLondonWallClock(d.result_close);

    if (!opens || !closes || !assessmentStarts || !assessmentEnds || !resultsStart || !resultsEnd) {
      console.warn(`Round "${d.title}" is missing a date, skipping it`);
      continue;
    }

    rounds.push({
      id: item.id,
      opens,
      closes,
      assessment_starts: assessmentStarts,
      assessment_ends: assessmentEnds,
      // Panel & recommendation is the stage that sits between assessment and results
      interview_starts: toLondonWallClock(d.panel_recommendation_open),
      interview_ends: toLondonWallClock(d.panel_recommendation_close),
      results_start: resultsStart,
      results_end: resultsEnd,
      capacity: Number(d.capacity ?? 0),
      capacity_status: Number(d.applications ?? 0),
    });
  }

  rounds.sort((a, b) => a.opens.localeCompare(b.opens));

  console.log(`Loaded ${rounds.length} rounds from EmDash (${EMDASH_URL})`);
  return rounds;
}

export const rounds = await fetchRounds();
