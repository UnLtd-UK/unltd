/**
 * Awards Data
 * 
 * Fetches Award types from Directus with their associated programmes and benefits.
 * 
 * Award codes follow the pattern: {stage}-{programme}
 * - st = Starting Up
 * - sc = Scaling Up
 * - mat = Millennium Awards Trust
 * - ffp = Funding Futures Programme
 */

import { getCollection } from './load.js';

export interface ProgrammeService {
    name: string;
    icon: string;
}

export interface Programme {
    icon: string;
    name: string;
    code: string;
    slug: string;
    colour: string;
    description: string;
}

export interface Award {
    code: string;
    name: string;
    grant: number;
    programme: Programme;
    grantUsability: Record<string, boolean>;
    programmeServices: ProgrammeService[];
}

const collection = "awards";
const collectionName = "awards";

const showDrafts = process.env.SHOW_DRAFTS === 'true';
const statusFilter = showDrafts
    ? { _in: ['published', 'draft'] }
    : { _eq: 'published' };

const filterOptions = {
    sort: ['sort'],
    filter: {
        status: statusFilter
    },
    fields: [
        '*',
        'programme.*',
        'programme.services.services_id.*'
    ],
};

const attach = false;

interface DirectusProgramme {
    id: number;
    name: string;
    code: string;
    slug: string;
    icon: string;
    description: string;
    services: Array<{
        services_id: {
            name: string;
            icon: string;
        };
    }>;
}

interface DirectusAward {
    id: number;
    code: string;
    name: string;
    grant_amount: number;
    grant_features: string[];
    programme: DirectusProgramme;
}

const rawAwards: DirectusAward[] = await getCollection(collection, collectionName, filterOptions, attach);

/**
 * Transform Directus data to match the Award interface
 */
export const awards: Award[] = rawAwards.map((award) => ({
    code: award.code,
    name: award.name,
    grant: award.grant_amount,
    programme: {
        icon: award.programme?.icon ?? '',
        name: award.programme?.name ?? '',
        code: award.programme?.code ?? '',
        slug: award.programme?.slug ?? '',
        colour: award.programme?.code === 'mat' ? 'amber' : 'purple',
        description: award.programme?.description ?? '',
    },
    grantUsability: (award.grant_features ?? []).reduce((acc, feature) => {
        acc[feature] = true;
        return acc;
    }, {} as Record<string, boolean>),
    programmeServices: (award.programme?.services ?? [])
        .filter((s) => s.services_id)
        .map((s) => ({
            name: s.services_id.name,
            icon: s.services_id.icon,
        })),
}));

/**
 * Helper to get an award by its code
 */
export const getAwardByCode = (code: string): Award | undefined => {
    return awards.find(award => award.code === code);
};

/**
 * Helper to get multiple awards by codes
 */
export const getAwardsByCodes = (codes: string[]): Award[] => {
    return codes.map(code => getAwardByCode(code)).filter((a): a is Award => a !== undefined);
};

/**
 * Helper to get an award by its name
 */
export const getAwardByName = (name: string): Award | undefined => {
    return awards.find(award => award.name === name);
};

/**
 * Helper to get awards by programme code
 */
export const getAwardsByProgramme = (code: string): Award[] => {
    return awards.filter(award => award.programme.code === code);
};
