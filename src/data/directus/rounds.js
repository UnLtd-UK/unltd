let headersList = {
    "Accept": "*/*",
    "User-Agent": "Thunder Client (https://www.thunderclient.com)",
    "Authorization": "Bearer "
}

let response = await fetch("https://y5y6f0wx.directus.app/items/rounds?fields=*.*.*", {
    method: "GET",
    headers: headersList
});

let rounds = await response.json();
rounds = rounds.data;

export { rounds }