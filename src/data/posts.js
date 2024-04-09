import { getCollection } from './load.js';

const collection = "posts";
const name = "posts";

const filterOptions = {
    sort: ['sort', '-date_time'],
    filter: {
        status: {
            _eq: 'published'
        }
    }
}

const attach = false;

const posts = await getCollection(collection, name, filterOptions, attach);

export { posts }