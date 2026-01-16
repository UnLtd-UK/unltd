import { getCollection } from './load.js';

const collection = "grants";
const name = "grants";

const showDrafts = process.env.SHOW_DRAFTS === 'true';
const statusFilter = showDrafts
    ? { _in: ['published', 'draft'] }
    : { _eq: 'published' };

const filterOptions = {
    sort: ['sort'],
    filter: {
        status: statusFilter
    },
    limit: 200
}

const attach = false;

const grants = await getCollection(collection, name, filterOptions, attach);

export { grants }