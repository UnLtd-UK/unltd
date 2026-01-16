import { getCollection } from './load.js';

const collection = "banner";
const name = "banner";

const showDrafts = process.env.SHOW_DRAFTS === 'true';
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

const banner = await getCollection(collection, name, filterOptions, attach);

export { banner }