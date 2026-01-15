import { getCollection } from './load.js';

const collection = "spaces";
const name = "spaces";

<<<<<<< HEAD
const showDrafts = process.env.SHOW_DRAFTS === 'true';
console.log(`Show Drafts: ${showDrafts}`);
const statusFilter = showDrafts
    ? { _in: ['published', 'draft'] }
    : { _eq: 'published' };
=======
const branch = process.env.BRANCH_NAME || 'local';

const statusFilter = branch === 'main'
    ? { _eq: 'published' }
    : {
        _in: branch === 'dev'
            ? ['published', 'draft']
            : ['published', 'draft', 'archived']
    };
>>>>>>> c40fddc (Refactor resources and spaces structure)

const filterOptions = {
    sort: ['sort'],
    filter: {
        status: statusFilter
    },
    fields: [
        'id',
        'name',
        'description',
<<<<<<< HEAD
        'unlisted',
=======
        'access',
>>>>>>> c40fddc (Refactor resources and spaces structure)
        'restricted_password',
        'eventbrite_keywords',
        'sort'
    ],
    limit: 50
}

const attach = false;

const allSpaces = await getCollection(collection, name, filterOptions, attach);

export { allSpaces }
