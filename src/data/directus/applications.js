let response = await fetch("https://unltd.directus.app/items/appliications/?fields[]=*.*.*", {
    method: "GET"
});

let json = await response.json();
applications = json.data;

console.log("hello")

export { applications }