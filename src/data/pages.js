import { getCollection } from './load.js';

const collection = "pages";
const name = "pages";

const branch = process.env.BRANCH_NAME || 'local';
console.log(`Branch: ${branch}`);
const isMainBranch = branch === 'main';
const statusFilter = isMainBranch
    ? { _eq: 'published' }
    : {
        _in: branch === 'dev'
            ? ['published', 'draft']
            : ['published', 'draft', 'archived']
    };

const filterOptions = {
    filter: {
        status: statusFilter
    },
    fields: ['*'],
}

const attach = false;

const pages = await getCollection(collection, name, filterOptions, attach);

export { pages }