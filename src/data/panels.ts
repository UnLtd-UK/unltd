import { EMDASH_URL, createEmDashClient, referenceChildIds } from "../lib/emdash.ts";
import { imageUrl, peopleById, type Person } from "./people.ts";

export interface PanelMember {
    id: string;
    name: string;
    pronouns: string;
    subtitle: string;
    linkedin: string;
    imageAlt: string;
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

async function fetchSocialEntrepreneurs(): Promise<Map<string, PanelMember>> {
    const client = createEmDashClient("social entrepreneurs");

    const byId = new Map<string, PanelMember>();
    for await (const item of client.listAll("social_entrepreneurs", { status: "published", limit: 100 })) {
        const d = item.data;
        const name = text(d.title);
        if (!name) continue;
        byId.set(item.id, {
            id: item.id,
            name,
            pronouns: text(d.gender_pronouns),
            subtitle: text(d.subtitle),
            linkedin: text(d.linkedin),
            image: imageUrl(d.image),
            imageAlt: text(d.image?.alt) || name,
        });
    }
    return byId;
}

async function fetchPanels(): Promise<PanelEntry[]> {
    const client = createEmDashClient("panels");

    const socialEntrepreneursById = await fetchSocialEntrepreneurs();

    const items: any[] = [];
    for await (const item of client.listAll("panels", { status: "published", limit: 100 })) {
        if (item.slug) items.push(item);
    }

    const panels: PanelEntry[] = [];
    for (const item of items) {
        const d = item.data;
        const [chairId] = await referenceChildIds(client, "panels", item.id, "panels_people");
        const colleagueIds = await referenceChildIds(client, "panels", item.id, "panels_colleagues");
        const entrepreneurIds = await referenceChildIds(client, "panels", item.id, "panels_social_entrepreneurs");
        const date = d.date ? new Date(d.date) : null;

        panels.push({
            slug: item.slug,
            title: text(d.title),
            programme: text(d.programme),
            team: text(d.team),
            date: date && !Number.isNaN(date.getTime()) ? londonDate.format(date) : "",
            chair: chairId ? (peopleById.get(chairId) ?? null) : null,
            colleagues: colleagueIds.flatMap((id) => peopleById.get(id) ?? []),
            members: entrepreneurIds.flatMap((id) => socialEntrepreneursById.get(id) ?? []),
        });
    }

    console.log(`Loaded ${panels.length} panels from EmDash (${EMDASH_URL})`);
    return panels;
}

export const panels = await fetchPanels();
