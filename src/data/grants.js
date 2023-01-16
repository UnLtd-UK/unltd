import { pb } from "./pocketbase.js";

let pb_grants;

try {
    pb_grants = await pb.collection("grants").getFullList(200);
} catch (error) {
    console.error("grants Error:", error);
}

export { pb_grants }