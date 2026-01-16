import { getCollection } from './load.js';

const collection = "pages";
const name = "pages";

const showDrafts = process.env.SHOW_DRAFTS === 'true';
console.log(`Show Drafts: ${showDrafts}`);
const statusFilter = showDrafts
    ? { _in: ['published', 'draft'] }
    : { _eq: 'published' };

const filterOptions = {
    filter: {
        status: statusFilter
    },
    fields: ['*'],
}

const attach = false;

const pages = await getCollection(collection, name, filterOptions, attach);

export { pages }