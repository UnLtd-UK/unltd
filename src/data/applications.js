import { getCollection } from './load.js';

const collection = "applications";

const filterOptions = {
    filter: {
        status: {
            _eq: 'published'
        }
    },
    fields: ['*', 'sections.sections_id.*', 'sections.sections_id.fields.fields_id.*']
}

const attach = false;

const applications = await getCollection(collection, filterOptions, attach);

export { applications }