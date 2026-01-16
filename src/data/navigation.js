import { getCollection } from './load.js';

const collection = "navigation";
const name = "navigation";

const showDrafts = process.env.SHOW_DRAFTS === 'true';
const statusFilter = showDrafts
    ? { _in: ['published', 'draft'] }
    : { _eq: 'published' };

const filterOptions = {
    filter: {
        status: statusFilter
    }
}

const attach = false;

const navigation = await getCollection(collection, name, filterOptions, attach);

export { navigation }