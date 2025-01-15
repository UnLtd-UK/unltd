import { getCollection } from './load.js';

const collection = "resources";
const name = "resources";

const filterOptions = {
    sort: ['sort'],
    filter: {
        status: {
            _eq: 'published'
        }
    }
}

const attach = false;

const resources = await getCollection(collection, name, filterOptions, attach);

export { resources }