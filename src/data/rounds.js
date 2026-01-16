import { getCollection } from './load.js';

const collection = "rounds";
const name = "rounds";

const showDrafts = process.env.SHOW_DRAFTS === 'true';
const statusFilter = showDrafts
    ? { _in: ['published', 'draft'] }
    : { _eq: 'published' };

const filterOptions = {
    sort: 'opens',
    filter: {
        status: statusFilter
    },
    fields: ['*'],
    limit: 200
}

const attach = false;

const rounds = await getCollection(collection, name, filterOptions, attach);

export { rounds }