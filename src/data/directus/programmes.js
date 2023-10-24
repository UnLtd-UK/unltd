let response = await fetch("https://unltd.directus.app/items/programmes/?fields=*.*.*", {
    method: "GET"
});

let json = await response.json();
let programmes = json.data;

export { programmes }