import { getCollection } from './load.js';

const collection = "programmes";
const name = "programmes";

const filterOptions = {
    sort: ['sort', 'name'],
    filter: {
        status: {
            _eq: 'published'
        }
    },
    fields: ['*.*.*.*.*'],
}

const attach = true;

const programmes = await getCollection(collection, name, filterOptions, attach);

export { programmes }