import { getCollection } from './load.js';

const collection = "resources";
const name = "resources";

const branch = process.env.CF_PAGES_BRANCH || 'local';
const isProd = branch === 'main';

const filterOptions = {
    sort: ['name'],
    filter: {
        status: isProd
            ? {
                _eq: 'published'
            }
            : {
                _in: ['published', 'draft']
            }
    },
    limit: 200
}

const attach = false;

const allResources = await getCollection(collection, name, filterOptions, attach);

export { allResources }