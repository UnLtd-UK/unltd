let response = await fetch("https://unltd.directus.app/items/rounds/?fields[]=*.*.*&filter[status][_eq]=published", {
    method: "GET"
});

let json = await response.json();
let rounds = json.data;

export { rounds }