/**
 * Eligibility Pages Data
 * 
 * Maps eligibility checker outcomes to page configurations.
 * Each slug corresponds to a Typeform redirect destination.
 * 
 * Slug naming convention:
 * - st = Starting Up, sc = Scaling Up
 * - mat = Millennium Awards Trust, ffp = Funding Futures Programme
 * - 0 = idea/not yet trading, l1 = less than 1 year, u4 = under 4 years
 * 
 * Example: stmatstffpl1 = Starting Up MAT + Starting Up FFP, trading less than 1 year
 * 
 * Structured for future Directus integration.
 */

import { getAwardsByCodes, type Award } from './awards';

export type TradingStatus =
    | 'idea'           // Just forming an idea, not yet trading
    | 'under-1-year'   // Trading for less than 1 year
    | 'under-4-years'; // Trading for less than 4 years (scaling up)

export interface EligibilityPage {
    /** URL slug - matches Typeform redirect */
    slug: string;

    /** Human-readable title for the page */
    title: string;

    /** Meta description for SEO (though page is noindex) */
    description: string;

    /** Trading status description shown to user */
    tradingStatus: TradingStatus;

    /** Human-readable trading description */
    tradingDescription: string;

    /** Award codes this eligibility maps to */
    awardCodes: string[];

    /** Stage of the awards (for styling/messaging) */
    stage: 'starting-up' | 'scaling-up';
}

/**
 * All eligibility page configurations
 */
export const eligibilityPages: EligibilityPage[] = [
    // Starting Up - MAT only - Idea stage
    {
        slug: "stmat0",
        title: "You're Eligible for a Starting Up Award",
        description: "You're eligible to apply for a Starting Up Millennium Awards Trust Award.",
        tradingStatus: "idea",
        tradingDescription: "You have an idea that's not yet trading",
        awardCodes: ["st-mat"],
        stage: "starting-up",
    },

    // Starting Up - MAT only - Trading under 1 year
    {
        slug: "stmatl1",
        title: "You're Eligible for a Starting Up Award",
        description: "You're eligible to apply for a Starting Up Millennium Awards Trust Award.",
        tradingStatus: "under-1-year",
        tradingDescription: "You've been trading for less than 1 year",
        awardCodes: ["st-mat"],
        stage: "starting-up",
    },

    // Starting Up - MAT + FFP - Idea stage
    {
        slug: "stmatstffp0",
        title: "You're Eligible for Starting Up Awards",
        description: "You're eligible to apply for Starting Up Awards from both our programmes.",
        tradingStatus: "idea",
        tradingDescription: "You have an idea that's not yet trading",
        awardCodes: ["st-mat", "st-ffp"],
        stage: "starting-up",
    },

    // Starting Up - MAT + FFP - Trading under 1 year
    {
        slug: "stmatstffpl1",
        title: "You're Eligible for Starting Up Awards",
        description: "You're eligible to apply for Starting Up Awards from both our programmes.",
        tradingStatus: "under-1-year",
        tradingDescription: "You've been trading for less than 1 year",
        awardCodes: ["st-mat", "st-ffp"],
        stage: "starting-up",
    },

    // Scaling Up - MAT only - Trading under 4 years
    {
        slug: "scmatu4",
        title: "You're Eligible for a Scaling Up Award",
        description: "You're eligible to apply for a Scaling Up Millennium Awards Trust Award.",
        tradingStatus: "under-4-years",
        tradingDescription: "You've been trading for between 1 and 4 years",
        awardCodes: ["sc-mat"],
        stage: "scaling-up",
    },

    // Scaling Up - MAT + FFP - Trading under 4 years
    {
        slug: "scmatscffpu4",
        title: "You're Eligible for Scaling Up Awards",
        description: "You're eligible to apply for Scaling Up Awards from both our programmes.",
        tradingStatus: "under-4-years",
        tradingDescription: "You've been trading for between 1 and 4 years",
        awardCodes: ["sc-mat", "sc-ffp"],
        stage: "scaling-up",
    },
];

/**
 * Get an eligibility page by slug
 */
export const getEligibilityPageBySlug = (slug: string): EligibilityPage | undefined => {
    return eligibilityPages.find(page => page.slug === slug);
};

/**
 * Get eligibility page with resolved awards
 */
export const getEligibilityPageWithAwards = (slug: string): { page: EligibilityPage; awards: Award[] } | undefined => {
    const page = getEligibilityPageBySlug(slug);
    if (!page) return undefined;

    const awards = getAwardsByCodes(page.awardCodes);
    return { page, awards };
};

/**
 * Get all eligibility page slugs (for static path generation)
 */
export const getAllEligibilitySlugs = (): string[] => {
    return eligibilityPages.map(page => page.slug);
};
