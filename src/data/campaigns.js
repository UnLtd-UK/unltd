import { getCollection } from './load.js';

const collection = "campaigns";
const name = "campaigns";

const filterOptions = {
    filter: {
        status: {
            _eq: 'published'
        }
    },
    fields: ['*', 'funds.funds_id.*', 'sponsors.organisations_id.*', 'supporters.organisations_id.*', 'manager.person.*', 'manager.role.*']
}

const attach = false;

const campaigns = await getCollection(collection, name, filterOptions, attach);

export { campaigns }