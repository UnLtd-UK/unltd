import { getCollection } from './load.js';

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