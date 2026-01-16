import { getCollection } from './load.js';

const collection = "campaigns";
const name = "campaigns";

const showDrafts = process.env.SHOW_DRAFTS === 'true';
const statusFilter = showDrafts
    ? { _in: ['published', 'draft'] }
    : { _eq: 'published' };

const filterOptions = {
    filter: {
        status: statusFilter
    },
    fields: ['*', 'funds.funds_id.*', 'sponsors.organisations_id.*', 'supporters.organisations_id.*', 'manager.person.*', 'manager.role.*'],
    limit: 200
}

const attach = false;

const campaigns = await getCollection(collection, name, filterOptions, attach);

export { campaigns }