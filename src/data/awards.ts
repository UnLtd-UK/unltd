/**
 * Awards Data
 * 
 * Reads Award types from the EmDash products collection. Each product points
 * at a programme (with its services) and a grant.
 * 
 * Award codes follow the pattern: {stage}-{programme}
 * - st = Starting Up
 * - sc = Scaling Up
 * - mat = Millennium Awards Trust
 * - ffp = Funding Futures Programme
 */

import { contentStatuses, createEmDashClient, referenceChildIds } from '../lib/emdash.ts';
import { programmes } from './programmes.ts';

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
    social_venture_previously: EligibilityValue;
}

export interface Award {
    /** EmDash product id. */
    id: string;
    code: string;
    name: string;
    grantTitle: string;
    grantDescription: string;
    stage: 'starting-up' | 'scaling-up';
    grant: number;
    programme: Programme;
    grantUsability: Record<string, boolean>;
    programmeServices: ProgrammeService[];
    eligibility: EligibilityCriteria;
}

const PROGRAMME_RELATION = 'products_programmes';
const GRANT_RELATION = 'products_grants';

/**
 * Maps each criterion slug used by the site (see criteriaMapping.ts) to the
 * field on the EmDash product that holds it.
 */
const ELIGIBILITY_FIELDS: Record<keyof EligibilityCriteria, string> = {
    age: 'your_age',
    living_in_uk: 'you_are_the_founder_leader_of_the_social_venture',
    founder_or_leader: 'you_are_currently_living_in_the_uk_and_have_the_right_to_work_i',
    reason_for_funding: 'you_are_looking_for_funding_to_create_long_term_social_impact',
    funding_academic_qualifications: 'you_are_applying_primarily_to_fund_formal_or_academic_qualifica',
    funding_overseas_travel: 'you_are_applying_primarily_to_fund_overseas_travel',
    funding_pay_others_delivery: 'you_are_applying_primarily_to_pay_others_to_deliver_the_work_on',
    needs_financial_non_financial_support: 'you_need_both_unltd_s_financial_and_non_financial_support',
    social_purpose_driven: 'your_social_venture_clearly_driven_by_a_social_purpose',
    clear_need_demonstrated: 'you_can_demonstrate_a_clear_need_for_your_social_venture',
    benefits_uk_people_places: 'your_social_venture_mainly_benefits_people_or_places_within_the',
    activities_running_4_years: 'you_are_applying_to_fund_activities_that_have_already_been_runn',
    lawful_not_discriminatory: 'your_social_venture_involves_political_or_religious_campaigning',
    no_political_religious_campaign: 'your_social_venture_involves_activities_that_are_against_the_la',
    more_than_awareness_raising: 'your_social_venture_does_more_than_raise_awareness_of_a_social',
    financially_sustainable: 'your_social_venture_has_the_potential_to_be_financially_sustain',
    incorporation_timeframe: 'your_social_venture_s_incorporation_history',
    started_trading: 'your_social_venture_s_trading_history',
    sector_classification: 'your_social_venture_s_areas_of_focus',
    last_year_turnover: 'your_social_venture_s_turnover_in_the_last_financial_year',
    earned_18k_traded_income: 'your_social_venture_s_earnings_in_the_last_12_months',
    social_venture_previously: 'you_have_not_received_the_same_award_type_for_the_same_social_v',
};

// EmDash boolean fields come back as 1/0; text fields are left empty when not applicable.
function toEligibilityValue(value: unknown): EligibilityValue {
    if (value === null || value === undefined || value === '') return null;
    if (value === 1 || value === true) return true;
    if (value === 0 || value === false) return false;
    if (Array.isArray(value)) return value.map(String);
    return String(value);
}

interface Grant {
    title: string;
    amount: number;
    usage: string[];
}

async function fetchAwards(): Promise<Award[]> {
    const client = createEmDashClient('awards');

    const grantsById = new Map<string, Grant>();
    for (const status of contentStatuses) {
        for await (const item of client.listAll('grants', { status, limit: 100 })) {
            grantsById.set(item.id, {
                title: String(item.data.title ?? ''),
                amount: Number(item.data.amount ?? 0),
                usage: ((item.data.usage as string[] | null) ?? []).map(String),
            });
        }
    }

    const items: any[] = [];
    for (const status of contentStatuses) {
        for await (const item of client.listAll('products', { status, limit: 100 })) {
            items.push(item);
        }
    }

    const result: Award[] = [];
    for (const item of items) {
        const code = String(item.data.code ?? '').trim();
        const title = String(item.data.title ?? '').trim();
        if (!code) {
            console.warn(`Product "${title}" has no code, skipping it`);
            continue;
        }

        const [programmeId] = await referenceChildIds(client, 'products', item.id, PROGRAMME_RELATION);
        const [grantId] = await referenceChildIds(client, 'products', item.id, GRANT_RELATION);
        const programme = programmes.find((p) => p.id === programmeId);
        const grant = grantId ? grantsById.get(grantId) : undefined;
        if (!programme) console.warn(`Product "${title}" has no programme in EmDash`);
        if (!grant) console.warn(`Product "${title}" has no grant in EmDash`);

        const stage = code.startsWith('st') ? 'starting-up' : 'scaling-up';
        // The cards split the name at the programme, so build it as
        // "Starting Up Award <programme>" rather than using the product title.
        const name = `${stage === 'starting-up' ? 'Starting Up' : 'Scaling Up'} Award ${programme?.title ?? ''}`.trim();

        result.push({
            id: item.id,
            code,
            name,
            grantTitle: grant?.title ?? '',
            grantDescription: (grant?.usage ?? []).join(', '),
            stage,
            grant: grant?.amount ?? 0,
            programme: {
                icon: programme?.icon ?? '',
                name: programme?.title ?? '',
                code: code.split('-')[1] ?? '',
                slug: programme?.slug ?? '',
                colour: programme?.slug === 'millennium-awards-trust' ? 'amber' : 'purple',
                description: programme?.summary ?? '',
            },
            grantUsability: Object.fromEntries((grant?.usage ?? []).map((usage) => [usage, true])),
            programmeServices: (programme?.services ?? []).map((service) => ({
                name: service.title,
                icon: service.icon,
            })),
            eligibility: Object.fromEntries(
                Object.entries(ELIGIBILITY_FIELDS).map(([criterion, field]) => [
                    criterion,
                    toEligibilityValue(item.data[field]),
                ]),
            ) as unknown as EligibilityCriteria,
        });
    }

    // Starting Up before Scaling Up; within a stage, Millennium Awards Trust first
    const rank = (award: Award) => (award.stage === 'starting-up' ? 0 : 2) + (award.code.endsWith('-mat') ? 0 : 1);
    result.sort((a, b) => rank(a) - rank(b));

    console.log(`Loaded ${result.length} awards from EmDash products`);
    return result;
}

/** The awards, one per EmDash product. */
export const awards: Award[] = await fetchAwards();

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
