let response = await fetch("https://unltd.directus.app/items/services/?fields=*.*.*.*.*&filter[status][_eq]=published", {
    method: "GET"
});

let json = await response.json();
let services = json.data;

export { services }