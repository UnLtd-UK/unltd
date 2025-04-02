import { getCollection } from './load.js';

const collection = "programmes";
const name = "programmes";

const filterOptions = {
    sort: ['name'],
    filter: {
        status: {
            _in: ['published', 'archived']
        }
    },
    fields: ['*.*.*.*.*'],
}

const attach = true;

const programmes = await getCollection(collection, name, filterOptions, attach);

export { programmes }