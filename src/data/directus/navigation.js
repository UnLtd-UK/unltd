let response = await fetch("https://unltd.directus.app/items/navigation", {
    method: "GET"
});

let json = await response.json();
let navigation = json.data;

export { navigation }