import { getCollection } from './load.js';

const collection = "posts";
const name = "posts";

const status = process.env.CF_PAGES_BRANCH === 'main' ? {
    status: {
        _eq: "published"
    }
} : {
    status: {
        _in: ["published", "draft"]
    }
}

const filterOptions = {
    sort: ['sort', '-date_time'],
    limit: -1,
    filter: status
}

const attach = false;

const posts = await getCollection(collection, name, filterOptions, attach);

export { posts }