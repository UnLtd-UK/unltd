import { getCollection } from './load.js';

const collection = "subjects";
const name = "subjects";

const filterOptions = {
    sort: ['sort'],
    filter: {
        status: {
            _eq: 'published'
        }
    }
}

const attach = false;

const subjects = await getCollection(collection, name, filterOptions, attach);

export { subjects }