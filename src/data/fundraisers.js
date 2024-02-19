let response = await fetch("https://unltd.directus.app/items/fundraisers/?fields=*&fields=funds.funds_id.*&fields=sponsors.organisations_id.*&fields=supporters.organisations_id.*&fields=manager.person.*&fields=manager.role.*&filter[status][_eq]=published", {
    method: "GET"
});

let json = await response.json();
let fundraisers = json.data;

export { fundraisers }