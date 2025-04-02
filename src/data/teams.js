import { getCollection } from './load.js';

const collection = "our-team";
const name = "our-team";

const filterOptions = {
    sort: ['name'],
    filter: {
        status: {
            _eq: 'published'
        },
        person: {
            _nnull: true
        }
    },
}

const attach = false;

const ourteam = await getCollection(collection, name, filterOptions, attach);

export { ourteam }