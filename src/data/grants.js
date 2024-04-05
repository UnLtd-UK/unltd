import { getCollection } from './load.js';

const collection = "grants";

const filterOptions = {
    sort: ['sort'],
    filter: {
        status: {
            _eq: 'published'
        }
    }
}

const attach = false;

const grants = await getCollection(collection, filterOptions, attach);

export { grants }