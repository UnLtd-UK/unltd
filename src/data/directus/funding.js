let headersList = {
    "Accept": "*/*",
    "User-Agent": "Thunder Client (https://www.thunderclient.com)",
    "Authorization": "Bearer "
}

let response = await fetch("https://unltd.directus.app/items/funding?fields=*.*.*", {
    method: "GET",
    headers: headersList
});

let funding = await response.json();
funding = funding.data;

export { funding }