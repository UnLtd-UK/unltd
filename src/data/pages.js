import { getCollection } from './load.js';

console.log("NAME: ", env.BRANCH_NAME);
console.log("NAME2: ", process.env.BRANCH_NAME);

const collection = "pages";
const name = "pages";

const branch = process.env.CF_PAGES_BRANCH || 'local';
const isProd = branch === 'main';

const filterOptions = {
    filter: {
        status: isProd
            ? {
                _eq: 'published'
            }
            : {
                _in: ['published', 'draft']
            }
    },
    fields: ['*'],
}

const attach = false;

const pages = await getCollection(collection, name, filterOptions, attach);

export { pages }