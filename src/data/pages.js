let response = await fetch("https://unltd.directus.app/items/pages/?fields=*&filter[status][_eq]=published", {
    method: "GET"
});

let json = await response.json();
let pages = json.data;

export { pages }