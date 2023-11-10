let response = await fetch("https://unltd.directus.app/items/pages/?fields=*", {
    method: "GET"
});

let json = await response.json();
let pages = json.data;

export { pages }