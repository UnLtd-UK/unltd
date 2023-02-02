let headersList = {
    "Accept": "*/*",
    "User-Agent": "Thunder Client (https://www.thunderclient.com)",
    "Authorization": "Bearer "
}

let response = await fetch("https://unltd.directus.app/items/organisations?fields=*.*.*", {
    method: "GET",
    headers: headersList
});

let organisations = await response.json();
organisations = organisations.data;

export { organisations }