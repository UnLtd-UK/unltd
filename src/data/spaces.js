import { getCollection } from './load.js';

const collection = "spaces";
const name = "spaces";

const showDrafts = process.env.SHOW_DRAFTS === 'true';
console.log(`Show Drafts: ${showDrafts}`);
const statusFilter = showDrafts
    ? { _in: ['published', 'draft'] }
    : { _eq: 'published' };

const filterOptions = {
    sort: ['sort'],
    filter: {
        status: statusFilter
    },
    fields: [
        'id',
        'name',
        'description',
        'unlisted',
        'restricted_password',
        'eventbrite_keywords',
        'sort'
    ],
    limit: 50
}

const attach = false;

const allSpaces = await getCollection(collection, name, filterOptions, attach);

export { allSpaces }
