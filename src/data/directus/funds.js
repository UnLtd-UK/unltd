let headersList = {
    "Accept": "*/*",
    "User-Agent": "Thunder Client (https://www.thunderclient.com)",
    "Authorization": "Bearer "
}

let response = await fetch("https://unltd.directus.app/items/funds?fields=*.*.*", {
    method: "GET",
    headers: headersList
});

let funds = await response.json();
funds = funds.data;

export { funds }