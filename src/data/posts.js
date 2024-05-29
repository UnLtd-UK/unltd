import { getCollection } from './load.js';

const collection = "posts";
const name = "posts";

const status = context.env.BLOG === 'main' ? 'published' : 'draft';

const filterOptions = {
    sort: ['sort', '-date_time'],
    limit: -1,
    filter: {
        status: {
            _eq: status
        }
    }
}

const attach = false;

const posts = await getCollection(collection, name, filterOptions, attach);

export { posts }
