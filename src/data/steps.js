import { getCollection } from './load.js';

const collection = "steps";
const name = "steps";

const filterOptions = {
    sort: ['sort'],
    filter: {
        status: {
            _eq: 'published'
        }
    }
}

const attach = false;

const steps = await getCollection(collection, name, filterOptions, attach);

export { steps }