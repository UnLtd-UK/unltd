const showDrafts = process.env.SHOW_DRAFTS === 'true';
const statusFilter = showDrafts
    ? 'filter[status][_in]=published,draft'
    : 'filter[status][_eq]=published';

let response = await fetch(`https://unltd.directus.app/items/applications/?fields[]=*&fields[]=sections.sections_id.*&fields[]=sections.sections_id.fields.fields_id.*&sort[]=sort&sort[]=sections.sections_id.sort&${statusFilter}`, {
    method: "GET"
});

let json = await response.json();
let applications = json.data;

export { applications }


// import { getCollection } from './load.js';

// const collection = "applications";

// const filterOptions = {
//     sort: ['sections.sections_id.sort'],
//     filter: {
//         status: {
//             _eq: 'published'
//         }
//     },
//     fields: ['*', 'sections.sections_id.*', 'sections.sections_id.fields.fields_id.*']
// }

// const attach = false;

// const applications = await getCollection(collection, filterOptions, attach);

// export { applications }