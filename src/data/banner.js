import { getCollection } from './load.js';

const collection = "banner";
const name = "banner";

const filterOptions = {
    filter: {
        status: {
            _eq: 'published'
        }
    },
    fields: ['*'],
}

const attach = false;

const banner = await getCollection(collection, name, filterOptions, attach);

export { banner }