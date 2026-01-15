import { getCollection } from './load.js';

const collection = "spaces";
const name = "spaces";

const branch = process.env.BRANCH_NAME || 'local';

const statusFilter = branch === 'main'
    ? { _eq: 'published' }
    : {
        _in: branch === 'dev'
            ? ['published', 'draft']
            : ['published', 'draft', 'archived']
    };

const filterOptions = {
    sort: ['sort'],
    filter: {
        status: statusFilter
    },
    fields: [
        'id',
        'name',
        'description',
        'access',
        'restricted_password',
        'eventbrite_keywords',
        'sort'
    ],
    limit: 50
}

const attach = false;

const allSpaces = await getCollection(collection, name, filterOptions, attach);

export { allSpaces }
