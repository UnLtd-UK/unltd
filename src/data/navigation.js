import { getCollection } from './load.js';

const collection = "navigation";

const filterOptions = {
    filter: {
        status: {
            _eq: 'published'
        }
    }
}

const attach = false;

const navigation = await getCollection(collection, filterOptions, attach);

export { navigation }