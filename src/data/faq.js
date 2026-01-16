import { getCollection } from './load.js';

const collection = "faq";
const name = "faq";

const showDrafts = process.env.SHOW_DRAFTS === 'true';
const statusFilter = showDrafts
    ? { _in: ['published', 'draft'] }
    : { _eq: 'published' };

const filterOptions = {
    filter: {
        status: statusFilter
    }
}

const attach = false;

const faq = await getCollection(collection, name, filterOptions, attach);

export { faq }