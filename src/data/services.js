import { getCollection } from './load.js';

const collection = "services";
const name = "services";

const showDrafts = process.env.SHOW_DRAFTS === 'true';
const statusFilter = showDrafts
    ? { _in: ['published', 'draft'] }
    : { _eq: 'published' };

const filterOptions = {
    filter: {
        status: statusFilter
    },
    fields: ['*.*.*.*.*'],
}

const attach = false;

const services = await getCollection(collection, name, filterOptions, attach);

export { services }