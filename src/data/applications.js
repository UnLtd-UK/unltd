import { getCollection } from './load.js';

const collection = "applications";
const name = "applications";

const filterOptions = {
    filter: {
        status: {
            _eq: 'published'
        }
    },
    fields: ['*', 'sections.sections_id.*', 'sections.sections_id.fields.fields_id.*'],
    limit: 200
}

const attach = false;

const applications = await getCollection(collection, name, filterOptions, attach);

export { applications }