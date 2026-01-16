import { getCollection } from './load.js';

const collection = "steps";
const name = "steps";

const showDrafts = process.env.SHOW_DRAFTS === 'true';
const statusFilter = showDrafts
    ? { _in: ['published', 'draft'] }
    : { _eq: 'published' };

const filterOptions = {
    sort: ['sort'],
    filter: {
        status: statusFilter
    }
}

const attach = false;

const steps = await getCollection(collection, name, filterOptions, attach);

export { steps }