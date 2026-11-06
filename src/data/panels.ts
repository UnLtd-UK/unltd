import { EMDASH_URL, createEmDashClient, referenceChildIds } from "../lib/emdash.ts";
import { imageUrl, peopleById, type Person } from "./people.ts";

export interface PanelMember {
    name: string;
    pronouns: string;
    jobTitle: string;
    subtitle: string;
    /** Absolute URL of the photo on the EmDash site, or "" for none. */
    image: string;
}

export interface PanelEntry {
    slug: string;
    title: string;
    programme: string;
    team: string;
    /** Calendar date in UK time, YYYY-MM-DD. */
    date: string;
    chair: Person | null;
    colleagues: Person[];
    members: PanelMember[];
}

const text = (value: unknown) => String(value ?? "").trim();

// en-CA formats as YYYY-MM-DD
const londonDate = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/London" });

async function fetchPanels(): Promise<PanelEntry[]> {
    const client = createEmDashClient("panels");

    const items: any[] = [];
    for await (const item of client.listAll("panels", { status: "published", limit: 100 })) {
        if (item.slug) items.push(item);
    }

    const panels: PanelEntry[] = [];
    for (const item of items) {
        const d = item.data;
        const [chairId] = await referenceChildIds(client, "panels", item.id, "panels_people");
        const colleagueIds = await referenceChildIds(client, "panels", item.id, "panels_colleagues");
        const date = d.date ? new Date(d.date) : null;

        panels.push({
            slug: item.slug,
            title: text(d.title),
            programme: text(d.programme),
            team: text(d.team),
            date: date && !Number.isNaN(date.getTime()) ? londonDate.format(date) : "",
            chair: chairId ? (peopleById.get(chairId) ?? null) : null,
            colleagues: colleagueIds.flatMap((id) => peopleById.get(id) ?? []),
            members: (Array.isArray(d.panel_members) ? d.panel_members : [])
                .map((member: any) => ({
                    name: text(member.title),
                    pronouns: text(member.gender_pronouns),
                    jobTitle: text(member.job_title),
                    subtitle: text(member.subtitle),
                    image: imageUrl(member.image),
                }))
                .filter((member: PanelMember) => member.name),
        });
    }

    console.log(`Loaded ${panels.length} panels from EmDash (${EMDASH_URL})`);
    return panels;
}

export const panels = await fetchPanels();
