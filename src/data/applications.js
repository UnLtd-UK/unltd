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

const applications = await getCollection(collection, name, filterOptions, attach);

export { applications }