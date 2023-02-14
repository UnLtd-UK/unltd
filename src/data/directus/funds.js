let response = await fetch("https://unltd.directus.app/items/funds/?fields=*.*.*", {
    method: "GET"
});

let json = await response.json();
let funds = json.data;

export { funds }