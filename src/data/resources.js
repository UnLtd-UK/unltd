import { getCollection } from './load.js';

const collection = "resources";
const name = "resources";

const showDrafts = process.env.SHOW_DRAFTS === 'true';
console.log(`Show Drafts: ${showDrafts}`);
const statusFilter = showDrafts
    ? { _in: ['published', 'draft'] }
    : { _eq: 'published' };

const filterOptions = {
    sort: ['sort', 'name'],
    filter: {
        status: statusFilter
    },
    fields: [
        'id',
        'name',
        'slug',
        'description',
        'body',
        'type',
        'topic',
        'external_url',
        'sort',
        'date_updated',
        'spaces.spaces_id.id',
        'spaces.spaces_id.name'
    ],
    limit: 500
}

const attach = false;

const allResources = await getCollection(collection, name, filterOptions, attach);

export { allResources }
