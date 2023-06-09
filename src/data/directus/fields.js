let response = await fetch("https://unltd.directus.app/items/applications/?fields[]=*&fields[]=sections.sections_id.*&fields[]=sections.sections_id.fields.fields_id.*&sort[]=sort&sort[]=sections.sections_id.sort", {
    method: "GET"
});

let json = await response.json();
let applications = json.data;

export { applications }