import { getCollection } from './load.js';

const collection = "grants";
const name = "grants";

const filterOptions = {
    sort: ['sort'],
    filter: {
        status: {
            _eq: 'published'
        }
    },
    limit: 200
}

const attach = false;

const grants = await getCollection(collection, name, filterOptions, attach);

export { grants }