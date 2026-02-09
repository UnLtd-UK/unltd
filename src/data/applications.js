import { getCollection } from './load.js';
import { getAwardsByCodes } from './awards.ts';

const collection = "applications";
const name = "applications";

const showDrafts = process.env.SHOW_DRAFTS === 'true';
const statusFilter = showDrafts
    ? { _in: ['published', 'draft'] }
    : { _eq: 'published' };

const filterOptions = {
    filter: {
        status: statusFilter
    },
    fields: [
        '*',
        'sections.sections_id.*',
        'sections.sections_id.fields.fields_id.*'
    ],
    limit: 200
}

const attach = false;

let applications = await getCollection(collection, name, filterOptions, attach);

// Debug: log actual application names
console.log('Application names:', applications.map(app => app.name));

// Add portal mapping based on application name
applications = applications.map((app) => {
    let portal_value = null;
    let portal_text = null;
    let stage_text = null;

    // Match with flexible string comparison (trim whitespace and asterisks)
    const normalizedName = app.name?.trim().toLowerCase().replace(/\*/g, '') || '';

    if ((normalizedName.includes('idea') && normalizedName.includes('stage')) || normalizedName.includes('forming an idea')) {
        portal_value = "forming-i-have-an-idea";
        portal_text = "Forming: I have an idea";
        stage_text = "is an idea or not yet trading";
    } else if (normalizedName.includes('less than 1 year')) {
        portal_value = "i-ve-been-trading-for-less-than-1-year";
        portal_text = "I've been trading for less than 1 year";
        stage_text = "has been trading for less than 1 year";
    } else if (normalizedName.includes('more than 1 year')) {
        portal_value = "i-ve-been-trading-for-1-year";
        portal_text = "I've been trading for 1 year";
        stage_text = "has been trading for more than 1 year";
    } else if (normalizedName.includes('between') && normalizedName.includes('four years')) {
        portal_value = "i-ve-been-trading-for-1-year";
        portal_text = "I've been trading for 1 year";
        stage_text = "has been trading for 1 to 4 years";
    }

    return {
        ...app,
        portal_value,
        portal_text,
        stage_text,
    };
});

/**
 * Mapping from trading status to award codes
 * This maps the trading stage to the applicable awards
 * Note: Award codes use hyphen format (st-mat, not stmat)
 */
const tradingStatusToAwards = {
    'idea': ['st-mat', 'st-ffp'],           // Idea stage can apply for Starting Up awards
    'under-1-year': ['st-mat', 'st-ffp'],   // Under 1 year can apply for Starting Up awards
    'under-4-years': ['sc-mat', 'sc-ffp'],  // 1-4 years can apply for Scaling Up awards
};

/**
 * Derive trading status from application name/portal_value
 */
const deriveTradingStatus = (app) => {
    if (app.portal_value === "forming-i-have-an-idea") return 'idea';
    if (app.portal_value === "i-ve-been-trading-for-less-than-1-year") return 'under-1-year';
    if (app.portal_value === "i-ve-been-trading-for-1-year") return 'under-4-years';
    return 'idea'; // Default
};

/**
 * Derive stage (starting-up or scaling-up) from trading status
 */
const deriveStage = (tradingStatus) => {
    return tradingStatus === 'under-4-years' ? 'scaling-up' : 'starting-up';
};

/**
 * Get applications marked as "new" for the refactored eligibility pages
 * These are applications that have the new field set to true in Directus
 */
export const getNewApplications = () => {
    return applications.filter(app => app.new === true);
};

/**
 * Get an application by its slug
 */
export const getApplicationBySlug = (slug) => {
    return applications.find(app => app.slug === slug);
};

/**
 * Get a new application by its slug (only from apps with new: true)
 */
export const getNewApplicationBySlug = (slug) => {
    return getNewApplications().find(app => app.slug === slug);
};

/**
 * Get an application with its resolved awards
 * Returns the application data along with full award objects
 * 
 * If the application has award_codes from Directus, use those.
 * Otherwise, derive from trading status mapping.
 */
export const getApplicationWithAwards = (slug) => {
    const application = getNewApplicationBySlug(slug);
    if (!application) return null;

    // Derive trading status from existing data
    const tradingStatus = application.trading_status || deriveTradingStatus(application);
    const stage = application.stage || deriveStage(tradingStatus);

    // Get award codes - either from Directus field or derive from trading status
    const awardCodes = application.award_codes || tradingStatusToAwards[tradingStatus] || [];
    const awards = getAwardsByCodes(awardCodes);

    // Trading description derived from stage_text or trading status
    const tradingDescription = application.trading_description ||
        application.stage_text ||
        `Your social venture ${tradingStatus === 'idea' ? 'is an idea or not yet trading' :
            tradingStatus === 'under-1-year' ? 'has been trading for less than 1 year' :
                'has been trading for 1 to 4 years'}`;

    return {
        application: {
            ...application,
            trading_status: tradingStatus,
            trading_description: tradingDescription,
            stage,
            award_codes: awardCodes,
        },
        awards
    };
};

export { applications }