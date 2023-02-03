let response = await fetch("https://unltd.directus.app/items/rounds/?fields[]=*.*.*", {
    method: "GET"
});

let json = await response.json();
let rounds = json.data;

export { rounds }