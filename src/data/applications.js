let response = await fetch("https://unltd.directus.app/items/applications/?filter[status][_eq]=published&fields[]=*&fields[]=sections.sections_id.*&fields[]=sections.sections_id.fields.fields_id.*", {
    method: "GET"
});

let json = await response.json();
let applications = json.data;

export { applications }