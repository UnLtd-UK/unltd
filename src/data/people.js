import { getCollection } from './load.js';

const collection = 'People';
const name = 'people';

const branch = process.env.BRANCH_NAME || 'local';
const isMainBranch = branch === 'main';
const isDevBranch = branch === 'dev';
const statusFilter = isMainBranch
    ? { _eq: 'published' }
    : {
        _in: isDevBranch
            ? ['published', 'draft']
            : ['published', 'draft', 'archived']
    };

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
