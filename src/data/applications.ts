/**
 * Applications Data
 *
 * Reads the application forms from the EmDash applications collection. Each
 * application references its sections (in order), each section references its
 * fields, and a field references the fields that depend on it. The awards come
 * from the application's products, so their grant details live on the product's
 * grant.
 */

import { EMDASH_URL, createEmDashClient, mapWithConcurrency, referenceChildIds, showDrafts } from '../lib/emdash.ts';
import { awards, type Award } from './awards.ts';
import { resources, type ResourceEntry } from './resources.ts';

export interface ApplicationSelectOption {
    name: string;
    slug?: string;
    code?: string;
    description?: string;
}

export interface ApplicationField {
    slug: string;
    status: string;
    title: string;
    subtitle: string;
    /** "Input" | "Select" | "Textarea" | "Checkboxes" | "Radios" | "Key-value" */
    type: string;
    input_type?: string;
    required: boolean;
    select_options: ApplicationSelectOption[];
    guidance: string;
    helper_text: string;
    prefix: string;
    suffix: string;
    /** Slug of the field this one depends on; it is shown indented below that field. */
    dependency?: string;
    updatedAt: string;
}

export interface ApplicationSection {
    slug: string;
    status: string;
    title: string;
    subtitle: string;
    guidance: string;
    fields: ApplicationField[];
    updatedAt: string;
}

export interface ApplicationEntry {
    slug: string;
    status: string;
    title: string;
    /** Describes the stage, including the note about what to expect when selecting it. */
    subtitle: string;
    /** Slug of the matching option in the portal's "stage" question. */
    portalValue: string | null;
    /** Completes "Your social venture ..." */
    stageText: string | null;
    resources: ResourceEntry[];
    awards: Award[];
    sections: ApplicationSection[];
}

const CONCURRENCY = 8;

// The application's `stage` value decides which stage the portal question is pre-selected to.
const STAGES: Record<string, { portalValue: string; stageText: string }> = {
    'forming-i-have-an-idea': {
        portalValue: 'forming-i-have-an-idea',
        stageText: 'is an idea or not yet trading',
    },
    'ive-been-trading-for-less-than-1-year': {
        portalValue: "i've-been-trading-for-less-than-one-year",
        stageText: 'has been trading for less than 1 year',
    },
    'ive-been-trading-for-1-year': {
        portalValue: "i've-been-trading-for-one-year-or-more",
        stageText: 'has been trading for 1 to 4 years',
    },
};

const text = (value: unknown) => String(value ?? '').trim();

async function fetchApplications(): Promise<ApplicationEntry[]> {
    const client = createEmDashClient('applications');
    const statuses = showDrafts ? ['published', 'draft'] : ['published'];

    const list = async (collection: string) => {
        const items: any[] = [];
        for (const status of statuses) {
            for await (const item of client.listAll(collection, { status, limit: 100 })) {
                if (item.slug) items.push(item);
            }
        }
        return items;
    };

    const [applicationItems, sectionItems, fieldItems] = await Promise.all([
        list('applications'),
        list('sections'),
        list('fields'),
    ]);

    // A field's children are the fields that depend on it.
    const parentSlugById = new Map<string, string>();
    await mapWithConcurrency(fieldItems, CONCURRENCY, async (field) => {
        for (const childId of await referenceChildIds(client, 'fields', field.id, 'fields_fields')) {
            parentSlugById.set(childId, field.slug);
        }
    });

    const fieldsById = new Map<string, ApplicationField>(
        fieldItems.map((item) => {
            const d = item.data;
            const field: ApplicationField = {
                slug: item.slug,
                status: item.status,
                title: text(d.title),
                subtitle: text(d.subtitle),
                type: text(d.type) || 'Input',
                input_type: text(d.input_type) || undefined,
                required: Boolean(d.required),
                select_options: Array.isArray(d.select_options) ? d.select_options : [],
                guidance: text(d.guidance),
                helper_text: text(d.helper_text),
                prefix: text(d.prefix),
                suffix: text(d.suffix),
                dependency: parentSlugById.get(item.id),
                updatedAt: item.updatedAt,
            };
            return [item.id, field];
        }),
    );

    const sectionFieldIds = await mapWithConcurrency(sectionItems, CONCURRENCY, (section) =>
        referenceChildIds(client, 'sections', section.id, 'sections_fields'),
    );
    const sectionsById = new Map<string, ApplicationSection>(
        sectionItems.map((item, index) => {
            const section: ApplicationSection = {
                slug: item.slug,
                status: item.status,
                title: text(item.data.title),
                subtitle: text(item.data.subtitle),
                guidance: text(item.data.guidance),
                fields: sectionFieldIds[index].flatMap((id) => fieldsById.get(id) ?? []),
                updatedAt: item.updatedAt,
            };
            return [item.id, section];
        }),
    );

    const resourcesById = new Map(resources.map((resource) => [resource.id, resource]));
    const awardsById = new Map(awards.map((award) => [award.id, award]));

    const result = await mapWithConcurrency(applicationItems, CONCURRENCY, async (item): Promise<ApplicationEntry> => {
        const [resourceIds, productIds, sectionIds] = await Promise.all([
            referenceChildIds(client, 'applications', item.id, 'applications_resources'),
            referenceChildIds(client, 'applications', item.id, 'applications_products'),
            referenceChildIds(client, 'applications', item.id, 'applications_sections'),
        ]);

        const stage = STAGES[text(item.data.stage)];
        if (!stage) console.warn(`Application "${item.data.title}" has an unrecognised stage "${item.data.stage}"`);

        return {
            slug: item.slug,
            status: item.status,
            title: text(item.data.title),
            subtitle: text(item.data.subtitle),
            portalValue: stage?.portalValue ?? null,
            stageText: stage?.stageText ?? null,
            resources: resourceIds.flatMap((id) => resourcesById.get(id) ?? []),
            awards: productIds.flatMap((id) => awardsById.get(id) ?? []),
            sections: sectionIds.flatMap((id) => sectionsById.get(id) ?? []),
        };
    });

    console.log(`Loaded ${result.length} applications from EmDash (${EMDASH_URL})`);
    return result;
}

export const applications = await fetchApplications();

export const getApplicationBySlug = (slug: string) =>
    applications.find((application) => application.slug === slug);
