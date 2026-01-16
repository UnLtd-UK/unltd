const showDrafts = process.env.SHOW_DRAFTS === 'true';
const statusFilter = showDrafts
    ? 'filter[status][_in]=published,draft'
    : 'filter[status][_eq]=published';

let response = await fetch(`https://unltd.directus.app/items/applications/?fields[]=name&fields[]=sections.sections_id.*&fields[]=sections.sections_id.fields.fields_id.*&sort[]=sort&fields[]=slug&${statusFilter}`, {
    method: "GET"
});

let json = await response.json();
let applications = json.data;

export { applications }