let response = await fetch("https://unltd.directus.app/items/funding/?fields[]=*.*.*", {
    method: "GET"
});

let json = await response.json();
let funding = json.data;

export { funding }