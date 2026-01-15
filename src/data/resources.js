import { getCollection } from './load.js';

const collection = "resources";
const name = "resources";

const branch = process.env.BRANCH_NAME || 'local';
console.log(`Branch: ${branch}`);
const statusFilter = branch === 'main'
    ? { _eq: 'published' }
    : {
        _in: branch === 'dev'
            ? ['published', 'draft']
            : ['published', 'draft', 'archived']
    };

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
        'topic',
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