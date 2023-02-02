let headersList = {
    "Accept": "*/*",
    "User-Agent": "Thunder Client (https://www.thunderclient.com)"
}

let response = await fetch("https://unltd.directus.app/items/funding?fields=*.*.*&filter=filter[type][_eq]=Investments", {
    method: "GET",
    headers: headersList
});

let investments = await response.json();
investments = investments.data;

export { investments }