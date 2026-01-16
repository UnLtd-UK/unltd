import { getCollection } from './load.js';

const collection = 'People';
const name = 'people';

const showDrafts = process.env.SHOW_DRAFTS === 'true';
console.log(`Show Drafts: ${showDrafts}`);
const statusFilter = showDrafts
    ? { _in: ['published', 'draft'] }
    : { _eq: 'published' };

const filterOptions = {
    sort: ['sort', 'full_name'],
    filter: {
        status: statusFilter
    },
    fields: [
        '*',
        'image.*',
        'team.*'
    ],
    limit: 500
};

const attach = false;

const people = await getCollection(collection, name, filterOptions, attach);

export { people };
