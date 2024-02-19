let response = await fetch("https://unltd.directus.app/items/navigation?filter[status][_eq]=published", {
    method: "GET"
});

let json = await response.json();
let navigation = json.data;

export { navigation }