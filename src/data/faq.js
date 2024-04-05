import { getCollection } from './load.js';

const collection = "faq";

const filterOptions = {
    filter: {
        status: {
            _eq: 'published'
        }
    }
}

const attach = false;

const faq = await getCollection(collection, filterOptions, attach);

export { faq }