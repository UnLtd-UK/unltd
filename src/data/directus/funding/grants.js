let headersList = {
    "Accept": "*/*",
    "User-Agent": "Thunder Client (https://www.thunderclient.com)"
}

let response = await fetch("https://unltd.directus.app/items/funding?fields=*.*.*&filter=filter[type][_eq]=Grant", {
    method: "GET",
    headers: headersList
});

let grants = await response.json();
grants = grants.data;

export { grants }