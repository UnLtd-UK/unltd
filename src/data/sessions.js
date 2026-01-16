import { getCollection } from './load.js';

const collection = "sessions";
const name = "sessions";

const showDrafts = process.env.SHOW_DRAFTS === 'true';
const statusFilter = showDrafts
    ? { _in: ['published', 'draft'] }
    : { _eq: 'published' };

const filterOptions = {
    sort: ['datetime'],
    filter: {
        status: statusFilter
    },
    fields: ['*.*.*'],
}

const attach = true;

const sessions = await getCollection(collection, name, filterOptions, attach);

export { sessions }