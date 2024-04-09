import { getCollection } from './load.js';

const collection = "learn";
const name = "learn";

const filterOptions = {
    sort: ['sort'],
    filter: {
        status: {
            _eq: 'published'
        }
    }
}

const attach = false;

const learns = await getCollection(collection, name, filterOptions, attach);

export { learns }