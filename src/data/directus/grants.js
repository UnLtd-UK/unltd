let headersList = {
    "Accept": "*/*",
    "User-Agent": "Thunder Client (https://www.thunderclient.com)"
}

let response = await fetch("https://unltd.directus.app/items/grants?fields=*.*", {
    method: "GET",
    headers: headersList
});

let grants = await response.json();
grants = grants.data;

export { grants }