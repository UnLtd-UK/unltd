import { getCollection } from './load.js';

const collection = "steps";

const filterOptions = {
    sort: ['sort'],
    filter: {
        status: {
            _eq: 'published'
        }
    }
}

const attach = false;

const steps = await getCollection(collection, filterOptions, attach);

export { steps }