/**
 * Criteria Mapping
 *
 * Maps CMS field slugs to display names for eligibility criteria.
 * Update this file when adding new criteria or changing CMS field names.
 */

export interface CriterionMapping {
    slug: string;
    name: string;
    category: 'social_entrepreneur' | 'social_venture';
}

/**
 * Social Entrepreneur category criteria
 */
export const socialEntrepreneurCriteria: CriterionMapping[] = [
    { slug: 'age', name: 'How old are you?', category: 'social_entrepreneur' },
    { slug: 'living_in_uk', name: 'Are you currently living in the United Kingdom?', category: 'social_entrepreneur' },
    { slug: 'founder_or_leader', name: 'Are you the founder or leader of the social venture?', category: 'social_entrepreneur' },
    { slug: 'reason_for_funding', name: 'Why are you looking for funding?', category: 'social_entrepreneur' },
    { slug: 'funding_academic_qualifications', name: 'Are you applying primarily to fund academic qualifications?', category: 'social_entrepreneur' },
    { slug: 'funding_overseas_travel', name: 'Are you applying primarily to fund overseas travel?', category: 'social_entrepreneur' },
    { slug: 'funding_pay_others_delivery', name: 'Are you applying primarily to pay others to deliver the work on your behalf?', category: 'social_entrepreneur' },
    { slug: 'needs_financial_non_financial_support', name: "Do you need both UnLtd's financial and non-financial support?", category: 'social_entrepreneur' },
];

/**
 * Social Venture category criteria
 */
export const socialVentureCriteria: CriterionMapping[] = [
    { slug: 'social_purpose_driven', name: 'Is it clearly driven by its social purpose?', category: 'social_venture' },
    { slug: 'clear_need_demonstrated', name: 'Can you demonstrate a clear need for it?', category: 'social_venture' },
    { slug: 'benefits_uk_people_places', name: 'Does it mainly benefit people or places within the UK?', category: 'social_venture' },
    { slug: 'activities_running_4_years', name: 'Is it continuing activities that have already been running for more than four years?', category: 'social_venture' },
    { slug: 'lawful_not_discriminatory', name: 'Does it involve activities outside of the law, against public policy or anything which encourages ethnic, religious, or commercial disharmony?', category: 'social_venture' },
    { slug: 'no_political_religious_campaign', name: 'Does it involve political, or religious campaigning?', category: 'social_venture' },
    { slug: 'more_than_awareness_raising', name: 'Does it do more than just raise awareness of a social issue?', category: 'social_venture' },
    { slug: 'financially_sustainable', name: 'Does it have the potential to be financially sustainable with our support?', category: 'social_venture' },
    { slug: 'incorporation_timeframe', name: 'How long has your idea or social venture been incorporated?', category: 'social_venture' },
    { slug: 'started_trading', name: 'Has your idea or social venture started trading?', category: 'social_venture' },
    { slug: 'sector_classification', name: 'What sectors are you in?', category: 'social_venture' },
    { slug: 'last_year_turnover', name: 'What was your social ventures turnover in its last financial year?', category: 'social_venture' },
    { slug: 'earned_18k_traded_income', name: 'In the last 12 months, has your social venture earned over £18,000 in traded income?', category: 'social_venture' },
    { slug: 'financial_data_projections', name: 'Are you able to provide financial data which covers the last 12 months, along with financial projections for the next 12 months?', category: 'social_venture' },
];

/** All criteria combined */
export const allCriteria: CriterionMapping[] = [...socialEntrepreneurCriteria, ...socialVentureCriteria];

/** Category display names */
export const categoryNames: Record<CriterionMapping['category'], string> = {
    social_entrepreneur: 'Social entrepreneur',
    social_venture: 'Social venture',
};

/** Helper: Get criterion by slug */
export const getCriterionBySlug = (slug: string) => allCriteria.find((c) => c.slug === slug);

/** Helper: Get display name for a slug */
export const getCriterionName = (slug: string) => getCriterionBySlug(slug)?.name ?? slug;

/** Lookup objects */
export const slugToName: Record<string, string> = Object.fromEntries(allCriteria.map((c) => [c.slug, c.name]));
export const nameToSlug: Record<string, string> = Object.fromEntries(allCriteria.map((c) => [c.name, c.slug]));
