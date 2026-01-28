import { getCollection } from './load.js';

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
    fields: ['*', 'sections.sections_id.*', 'sections.sections_id.fields.fields_id.*'],
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

export { applications }