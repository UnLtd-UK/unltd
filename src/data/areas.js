import { getCollection } from './load.js';

const collection = "areas";

const filterOptions = {
    sort: ['sort', 'name'],
    filter: {
        status: {
            _eq: 'published'
        }
    },
    fields: ['*.*.*.*.*']
}

const attach = false;

const areas = await getCollection(collection, filterOptions, attach);

export { areas }