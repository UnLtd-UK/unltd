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
    { slug: 'age', name: 'Your age', category: 'social_entrepreneur' },
    { slug: 'living_in_uk', name: 'You are the founder/leader of the social venture', category: 'social_entrepreneur' },
    { slug: 'founder_or_leader', name: 'You  are currently living in the UK and have the right to work in the UK', category: 'social_entrepreneur' },
    { slug: 'reason_for_funding', name: 'You are looking for funding to create long-term social impact', category: 'social_entrepreneur' },
    { slug: 'funding_academic_qualifications', name: 'You are applying primarily to fund formal or academic qualifications', category: 'social_entrepreneur' },
    { slug: 'funding_overseas_travel', name: 'You are applying primarily to fund overseas travel', category: 'social_entrepreneur' },
    { slug: 'funding_pay_others_delivery', name: 'You are applying primarily to pay others to deliver the work on your behalf', category: 'social_entrepreneur' },
    { slug: 'needs_financial_non_financial_support', name: "You need both UnLtd's financial and non-financial support", category: 'social_entrepreneur' },
];

/**
 * Social Venture category criteria
 */
export const socialVentureCriteria: CriterionMapping[] = [
    { slug: 'social_purpose_driven', name: 'Your social venture clearly driven by a social purpose', category: 'social_venture' },
    { slug: 'clear_need_demonstrated', name: 'You can demonstrate a clear need for your social venture', category: 'social_venture' },
    { slug: 'benefits_uk_people_places', name: 'Your social venture mainly benefits people or places within the UK', category: 'social_venture' },
    { slug: 'activities_running_4_years', name: 'You are applying to fund activities that have already been running for more than four years', category: 'social_venture' },
    { slug: 'lawful_not_discriminatory', name: 'Your social venture involves political or religious campaigning', category: 'social_venture' },
    { slug: 'no_political_religious_campaign', name: 'Your social venture involves activities that are against the law, against public policy, or could cause harm or division between people or communities', category: 'social_venture' },
    { slug: 'more_than_awareness_raising', name: 'Your social venture does more than raise awareness of a social issue', category: 'social_venture' },
    { slug: 'financially_sustainable', name: 'Your social venture has the potential to be financially sustainable with our support', category: 'social_venture' },
    { slug: 'incorporation_timeframe', name: 'Your social venture has been incorporated for less than 4 years', category: 'social_venture' },
    { slug: 'started_trading', name: 'Your social ventures trading history', category: 'social_venture' },
    { slug: 'sector_classification', name: 'Your social ventures areas of focus', category: 'social_venture' },
    { slug: 'last_year_turnover', name: "In it's last financial year your social ventures turnover was less than £250,000", category: 'social_venture' },
    { slug: 'earned_18k_traded_income', name: 'In the last 12 months, your social venture has earned over £18,000 in traded income', category: 'social_venture' },
    { slug: 'social_venture_previously', name: 'You have not received the same Award type for the same social venture previously', category: 'social_venture' },
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
