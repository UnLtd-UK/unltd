import { getCollection } from './load.js';

const collection = "Home";
const name = "home";

const filterOptions = {
    filter: {
        status: {
            _eq: 'published'
        }
    },
    fields: ['*'],
}

const attach = false;

const home = await getCollection(collection, name, filterOptions, attach);

export { home }