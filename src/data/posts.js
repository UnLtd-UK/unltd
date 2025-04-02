import { getCollection } from './load.js';

const collection = "posts";
const name = "posts";

// let branch = "branch";

// try {
//     branch = process.env.CF_PAGES_BRANCH;
// } catch (error) {
//     console.error('process is not defined');
//     branch = 'local'; // default value
// }

// const status = branch === 'main' ? {
//     status: {
//         _eq: "published"
//     }
// } : {
//     status: {
//         _in: ["published", "draft"]
//     }
// }

const filterOptions = {
    sort: ['-date_time'],
    limit: -1,
    filter: {
        status: {
            _in: ["published", "draft"]
        }
    }
}

const attach = false;

const posts = await getCollection(collection, name, filterOptions, attach);

export { posts }