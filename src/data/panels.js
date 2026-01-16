import { getCollection } from './load.js';

const collection = "panels";
const name = "panels";

const showDrafts = process.env.SHOW_DRAFTS === 'true';
const statusFilter = showDrafts
    ? { _in: ['published', 'draft'] }
    : { _eq: 'published' };

const filterOptions = {
    filter: {
        status: statusFilter
    },
    fields: ['name', 'date', 'programme.*', 'panel_chair.person.*', 'panel_chair.role.*', 'panel_chair.role.organisation.*', 'unltd_colleagues.positions_id.person.*', 'unltd_colleagues.positions_id.role.*', 'unltd_colleagues.positions_id.role.organisation.*', 'social_entrepreneurs.positions_id.person.*', 'social_entrepreneurs.positions_id.role.*', 'social_entrepreneurs.positions_id.role.organisation.*'],
}

const attach = false;

const panels = await getCollection(collection, name, filterOptions, attach);

export { panels }