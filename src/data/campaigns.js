let response = await fetch("https://unltd.directus.app/items/campiagns/?fields=*&fields=funds.funds_id.*&fields=sponsors.organisations_id.*&fields=supporters.organisations_id.*&fields=manager.person.*&fields=manager.role.*&filter[status][_eq]=published", {
    method: "GET"
});

let json = await response.json();
let campaigns = json.data;

export { campaigns }