import { getCollection } from './load.js';

const collection = "resources";
const name = "resources";

const filterOptions = {
    sort: ['name'],
    filter: {
        status: {
            _eq: 'published'
        }
    },
    limit: 200
}

const attach = false;

const allResources = await getCollection(collection, name, filterOptions, attach);

export { allResources }