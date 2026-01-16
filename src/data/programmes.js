import { getCollection } from './load.js';

const collection = "programmes";
const name = "programmes";

const showDrafts = process.env.SHOW_DRAFTS === 'true';
const statusFilter = showDrafts
    ? { _in: ['published', 'draft', 'archived'] }
    : { _in: ['published', 'archived'] };

const filterOptions = {
    sort: ['name'],
    filter: {
        status: statusFilter
    },
    fields: ['*.*.*.*.*'],
}

const attach = true;

const programmes = await getCollection(collection, name, filterOptions, attach);

export { programmes }