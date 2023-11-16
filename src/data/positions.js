let response = await fetch("https://unltd.directus.app/items/positions?sort[]=person.name&fields[]=*.*", {
    method: "GET"
});

let json = await response.json();
let positions = json.data;

export { positions }