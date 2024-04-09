import { getCollection } from './load.js';

const collection = "positions";
const name = "positions";

const filterOptions = {
    sort: ['sort', 'person.name'],
    filter: {
        status: {
            _eq: 'published'
        },
        person: {
            _nnull: true
        }
    },
    fields: ['*.*'],
}

const attach = false;

const positions = await getCollection(collection, name, filterOptions, attach);

export { positions }