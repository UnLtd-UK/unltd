import PocketBase from "pocketbase";

const pb = new PocketBase("http://127.0.0.1:8090");

const authData = await pb.admins.authWithPassword(
"tomsheppard@unltd.org.uk",
"mrf*bkn6ybg4MEM4hud"
);

export {pb};