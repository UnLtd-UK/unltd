import { getCollection } from './load.js';

const collection = "pages";
const name = "pages";

const filterOptions = {
    filter: {
        status: {
            _eq: 'published'
        }
    },
    fields: ['*'],
}

const attach = false;

const pages = await getCollection(collection, name, filterOptions, attach);

export { pages }