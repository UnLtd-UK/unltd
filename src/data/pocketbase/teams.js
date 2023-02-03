import { pb } from "./pocketbase.js";

let pb_teams;

try {
    pb_teams = await pb.collection("teams").getFullList(200, {
        sort: "order",
    });
} catch (error) {
    console.error("teams Error:", error);
}

export { pb_teams }