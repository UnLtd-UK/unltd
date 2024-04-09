import { getCollection } from './load.js';

const collection = "faq";
const name = "faq";


const filterOptions = {
    filter: {
        status: {
            _eq: 'published'
        }
    }
}

const attach = false;

const faq = await getCollection(collection, name, filterOptions, attach);

export { faq }