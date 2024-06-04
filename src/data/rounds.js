import { getCollection } from './load.js';

const collection = "rounds";
const name = "rounds";

const filterOptions = {
    sort: 'applications_start',
    filter: {
        status: {
            _eq: 'published'
        }
    },
    fields: ['*.*.*'],
}

const attach = false;

const rounds = await getCollection(collection, name, filterOptions, attach);

export { rounds }