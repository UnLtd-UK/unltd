let response = await fetch("https://unltd.directus.app/items/positions?sort[]=person.name&fields[]=*.*&filter[status][_eq]=published", {
    method: "GET"
});

let json = await response.json();
let positions = json.data;

export { positions }