import { getCollection } from './load.js';

const collection = "posts";
const name = "posts";
const branch = process.env.CF_PAGES_BRANCH || 'local';

console.log(`Branch: ${branch}`);

const isProd = branch === 'main' && true || false;

console.log(`Production: ${isProd}`)

const filterOptions = {
    sort: ['-date_time'],
    limit: -1,
    filter: isProd ?
        {
            status: {
                _eq: "published"
            }
        } :
        {
            status: {
                _in: ["published", "draft"]
            }
        }
}

const attach = false;

const posts = await getCollection(collection, name, filterOptions, attach);

export { posts }