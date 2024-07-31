import { getCollection } from './load.js';

const collection = "sessions";
const name = "sessions";

const filterOptions = {
    sort: ['sort', 'datetime'],
    filter: {
        status: {
            _eq: 'published'
        }
    },
    fields: ['*.*.*'],
}

const attach = true;

const sessions = await getCollection(collection, name, filterOptions, attach);

export { sessions }