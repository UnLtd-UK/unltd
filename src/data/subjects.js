import { getCollection } from './load.js';

const collection = "subjects";
const name = "subjects";

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

const subjects = await getCollection(collection, name, filterOptions, attach);

export { subjects }