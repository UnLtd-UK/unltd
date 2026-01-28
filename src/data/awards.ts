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

export type EligibilityValue = boolean | string | string[] | null;

export interface EligibilityCriteria {
    // Social entrepreneur criteria
    age: EligibilityValue;
    living_in_uk: EligibilityValue;
    founder_or_leader: EligibilityValue;
    reason_for_funding: EligibilityValue;
    funding_academic_qualifications: EligibilityValue;
    funding_overseas_travel: EligibilityValue;
    funding_pay_others_delivery: EligibilityValue;
    needs_financial_non_financial_support: EligibilityValue;
    // Social venture criteria
    social_purpose_driven: EligibilityValue;
    clear_need_demonstrated: EligibilityValue;
    benefits_uk_people_places: EligibilityValue;
    activities_running_4_years: EligibilityValue;
    lawful_not_discriminatory: EligibilityValue;
    no_political_religious_campaign: EligibilityValue;
    more_than_awareness_raising: EligibilityValue;
    financially_sustainable: EligibilityValue;
    incorporation_timeframe: EligibilityValue;
    started_trading: EligibilityValue;
    sector_classification: EligibilityValue;
    last_year_turnover: EligibilityValue;
    earned_18k_traded_income: EligibilityValue;
    financial_data_projections: EligibilityValue;
}

export interface Award {
    code: string;
    name: string;
    stage: 'starting-up' | 'scaling-up';
    grant: number;
    programme: Programme;
    grantUsability: Record<string, boolean>;
    programmeServices: ProgrammeService[];
    eligibility: EligibilityCriteria;
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
    // Eligibility criteria fields
    age: boolean | string | string[] | null;
    living_in_uk: boolean | string | string[] | null;
    founder_or_leader: boolean | string | string[] | null;
    reason_for_funding: boolean | string | string[] | null;
    funding_academic_qualifications: boolean | string | string[] | null;
    funding_overseas_travel: boolean | string | string[] | null;
    funding_pay_others_delivery: boolean | string | string[] | null;
    needs_financial_non_financial_support: boolean | string | string[] | null;
    social_purpose_driven: boolean | string | string[] | null;
    clear_need_demonstrated: boolean | string | string[] | null;
    benefits_uk_people_places: boolean | string | string[] | null;
    activities_running_4_years: boolean | string | string[] | null;
    lawful_not_discriminatory: boolean | string | string[] | null;
    no_political_religious_campaign: boolean | string | string[] | null;
    more_than_awareness_raising: boolean | string | string[] | null;
    financially_sustainable: boolean | string | string[] | null;
    incorporation_timeframe: boolean | string | string[] | null;
    started_trading: boolean | string | string[] | null;
    sector_classification: boolean | string | string[] | null;
    last_year_turnover: boolean | string | string[] | null;
    earned_18k_traded_income: boolean | string | string[] | null;
    financial_data_projections: boolean | string | string[] | null;
}

const rawAwards: DirectusAward[] = await getCollection(collection, collectionName, filterOptions, attach);

/**
 * Transform Directus data to match the Award interface
 */
export const awards: Award[] = rawAwards.map((award) => ({
    code: award.code,
    name: award.name,
    stage: award.code.startsWith('st') ? 'starting-up' : 'scaling-up',
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
    eligibility: {
        age: award.age ?? null,
        living_in_uk: award.living_in_uk ?? null,
        founder_or_leader: award.founder_or_leader ?? null,
        reason_for_funding: award.reason_for_funding ?? null,
        funding_academic_qualifications: award.funding_academic_qualifications ?? null,
        funding_overseas_travel: award.funding_overseas_travel ?? null,
        funding_pay_others_delivery: award.funding_pay_others_delivery ?? null,
        needs_financial_non_financial_support: award.needs_financial_non_financial_support ?? null,
        social_purpose_driven: award.social_purpose_driven ?? null,
        clear_need_demonstrated: award.clear_need_demonstrated ?? null,
        benefits_uk_people_places: award.benefits_uk_people_places ?? null,
        activities_running_4_years: award.activities_running_4_years ?? null,
        lawful_not_discriminatory: award.lawful_not_discriminatory ?? null,
        no_political_religious_campaign: award.no_political_religious_campaign ?? null,
        more_than_awareness_raising: award.more_than_awareness_raising ?? null,
        financially_sustainable: award.financially_sustainable ?? null,
        incorporation_timeframe: award.incorporation_timeframe ?? null,
        started_trading: award.started_trading ?? null,
        sector_classification: award.sector_classification ?? null,
        last_year_turnover: award.last_year_turnover ?? null,
        earned_18k_traded_income: award.earned_18k_traded_income ?? null,
        financial_data_projections: award.financial_data_projections ?? null,
    },
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
