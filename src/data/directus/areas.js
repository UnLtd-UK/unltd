let response = await fetch("https://unltd.directus.app/items/areas/?fields=*.*.*.*.*&filter[status][_eq]=published", {
    method: "GET"
});

let json = await response.json();
let areas = json.data;

export { areas }