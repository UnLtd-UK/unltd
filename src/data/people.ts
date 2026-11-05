import {
  EMDASH_URL,
  createEmDashClient,
  referenceChildIds,
} from "../lib/emdash.ts";

export interface Person {
  id: string;
  name: string;
  pronouns: string;
  roleTitle: string;
  /** Anything other than "Active", e.g. "Parental Leave"; empty when active. */
  roleStatus: string;
  linkedin: string;
  /** Absolute URL of the photo on the EmDash site, or "" for none. */
  image: string;
  imageAlt: string;
}

export interface TeamEntry {
  id: string;
  slug: string;
  name: string;
  description: string;
  lead: Person | null;
  members: Person[];
}

const text = (value: unknown) => String(value ?? "").trim();

// EmDash stores a media field as { meta: { storageKey }, alt, ... } and serves
// the file from /_emdash/api/media/file/<storageKey>.
export function imageUrl(field: any): string {
  if (typeof field?.src === "string" && field.src) {
    return /^https?:\/\//.test(field.src) ? field.src : `${EMDASH_URL}${field.src}`;
  }
  const storageKey = field?.meta?.storageKey;
  return storageKey ? `${EMDASH_URL}/_emdash/api/media/file/${storageKey}` : "";
}

async function fetchPeople(): Promise<Map<string, Person>> {
  const client = createEmDashClient("people");

  const peopleById = new Map<string, Person>();
  for await (const item of client.listAll("people", { status: "published", limit: 100 })) {
    const d = item.data;
    const name = text(d.title);
    const roleStatus = text(d.role_status);
    peopleById.set(item.id, {
      id: item.id,
      name,
      pronouns: text(d.pronouns),
      roleTitle: text(d.role_title),
      roleStatus: roleStatus.toLowerCase() === "active" ? "" : roleStatus,
      linkedin: text(d.linkedin),
      image: imageUrl(d.image),
      imageAlt: text(d.image?.alt) || name,
    });
  }
  return peopleById;
}

export const peopleById = await fetchPeople();

async function fetchTeams(): Promise<TeamEntry[]> {
  const client = createEmDashClient("teams");

  const items: any[] = [];
  for await (const item of client.listAll("teams", { status: "published", limit: 100 })) {
    items.push(item);
  }
  // Teams have no manual order; they are listed in the order they were created.
  items.sort((a, b) => String(a.createdAt).localeCompare(String(b.createdAt)));

  const lookup = (ids: string[]) => ids.flatMap((id) => peopleById.get(id) ?? []);

  const teams: TeamEntry[] = [];
  for (const item of items) {
    const [leadId] = await referenceChildIds(client, "teams", item.id, "teams_lead");
    const memberIds = await referenceChildIds(client, "teams", item.id, "teams_members");
    const name = text(item.data.title);
    const members = lookup(memberIds);

    // Directors lead their own directorates but also sit on the executive team.
    if (name.toLowerCase() === "executive team") {
      for (const person of peopleById.values()) {
        if (person.roleTitle.toLowerCase().startsWith("director of ") && !members.includes(person)) {
          members.push(person);
        }
      }
    }

    teams.push({
      id: item.id,
      slug: String(item.slug ?? ""),
      name,
      description: text(item.data.subtitle),
      lead: leadId ? (peopleById.get(leadId) ?? null) : null,
      members,
    });
  }

  console.log(
    `Loaded ${peopleById.size} people in ${teams.length} teams from EmDash (${EMDASH_URL})`,
  );
  return teams;
}

export const teams = await fetchTeams();
