import { getCollection } from './load.js';

const collection = "quotes";
const name = "quotes";

const showDrafts = process.env.SHOW_DRAFTS === 'true';
const statusFilter = showDrafts
    ? { _in: ['published', 'draft'] }
    : { _eq: 'published' };

const filterOptions = {
    sort: ['sort'],
    filter: {
        status: statusFilter
    },
    fields: ['*.*.*.*'],
}

const attach = false;

const quotes = await getCollection(collection, name, filterOptions, attach);

export { quotes }