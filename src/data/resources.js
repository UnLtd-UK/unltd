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
        'description',
        'body',
        'type',
<<<<<<< HEAD
<<<<<<< HEAD
        'topic',
=======
        'category',
>>>>>>> c40fddc (Refactor resources and spaces structure)
=======
        'topic',
>>>>>>> 8c3fa8c (feat: refactor resource components to use topic instead of category)
        'external_url',
        'sort',
        'spaces.spaces_id.id',
        'spaces.spaces_id.name'
    ],
    limit: 500
}

const attach = false;

const allResources = await getCollection(collection, name, filterOptions, attach);

export { allResources }