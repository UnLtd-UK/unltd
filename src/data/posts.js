import { getCollection } from './load.js';

const collection = "posts";

const filterOptions = {
    sort: ['sort', '-date_time'],
    filter: {
        status: {
            _eq: 'published'
        }
    }
}

const attach = false;

const posts = await getCollection(collection, filterOptions, attach);

export { posts }