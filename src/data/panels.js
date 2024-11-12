import { getCollection } from './load.js';

const collection = "panels";
const name = "panels";

const filterOptions = {
    filter: {
        status: {
            _eq: 'published'
        }
    },
    fields: ['date', 'programme.*', 'panel_chair.person.*', 'panel_chair.role.*', 'panel_chair.role.organisation.*', 'unltd_colleagues.positions_id.person.*', 'unltd_colleagues.positions_id.role.*', 'unltd_colleagues.positions_id.role.organisation.*', 'social_entrepreneurs.positions_id.person.*', 'social_entrepreneurs.positions_id.role.*', 'social_entrepreneurs.positions_id.role.organisation.*'],
}

const attach = false;

const panels = await getCollection(collection, name, filterOptions, attach);

export { panels }