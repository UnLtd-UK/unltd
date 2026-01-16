const showDrafts = process.env.SHOW_DRAFTS === 'true';
const statusFilter = showDrafts
    ? 'filter[status][_in]=published,draft'
    : 'filter[status][_eq]=published';

let response = await fetch(`https://unltd.directus.app/items/fundraisers/?fields=*&fields=funds.funds_id.*&fields=sponsors.organisations_id.*&fields=supporters.organisations_id.*&fields=manager_name.*&fields=manager_role.*&${statusFilter}`, {
    method: "GET"
});

let json = await response.json();
let fundraisers = json.data;

export { fundraisers }