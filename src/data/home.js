import { getCollection } from './load.js';

const collection = "Home";
const name = "home";

const showDrafts = process.env.SHOW_DRAFTS === 'true';
const statusFilter = showDrafts
    ? { _in: ['published', 'draft'] }
    : { _eq: 'published' };

const filterOptions = {
    filter: {
        status: statusFilter
    },
    fields: ['*.*'],
    limit: 200
}

const attach = false;

const home = await getCollection(collection, name, filterOptions, attach);

export { home }