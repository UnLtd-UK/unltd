import { getCollection } from './load.js';

const collection = "quotes";
const name = "quotes";

const filterOptions = {
    sort: ['sort'],
    filter: {
        status: {
            _eq: 'published'
        }
    },
    fields: ['*.*.*.*'],
}

const attach = false;

const quotes = await getCollection(collection, name, filterOptions, attach);

export { quotes }