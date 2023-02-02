let headersList = {
    "Accept": "*/*",
    "User-Agent": "Thunder Client (https://www.thunderclient.com)",
    "Authorization": "Bearer "
}

let response = await fetch("https://unltd.directus.app/items/eligibilities?fields=*.*.*", {
    method: "GET",
    headers: headersList
});

let eligibilities = await response.json();
eligibilities = eligibilities.data;

export { eligibilities }