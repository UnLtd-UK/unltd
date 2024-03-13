import { getCollection } from './load.js';

const collection = "pages";

const filterOptions = {
    filter: {
        status: {
            _eq: 'published'
        }
    },
    fields: ['*'],
}

const attach = false;

const pages = await getCollection(collection, filterOptions, attach);

export { pages }