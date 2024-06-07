import { getCollection } from './load.js';

const collection = "panels";
const name = "panels";

const filterOptions = {
    filter: {
        status: {
            _eq: 'published'
        }
    },
    fields: ['*.*.*'],
}

const attach = false;

const panels = await getCollection(collection, name, filterOptions, attach);

export { panels }