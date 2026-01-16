import { getCollection } from './load.js';

const collection = 'teams';
const name = 'teams';

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
        '*',
        'owner.*',
        'owner.image.*'
    ],
    limit: 200
};

const attach = false;

const teams = await getCollection(collection, name, filterOptions, attach);

export { teams };