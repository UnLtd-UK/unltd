import { getCollection } from './load.js';

const collection = "services";
const name = "services";

const filterOptions = {
    filter: {
        status: {
            _eq: 'published'
        }
    },
    fields: ['*.*.*.*.*'],
}

const attach = false;

const services = await getCollection(collection, name, filterOptions, attach);

export { services }