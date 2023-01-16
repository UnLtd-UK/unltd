import { pb } from "./pocketbase.js";

let pb_organisations;

try {
    pb_organisations = await pb.collection("organisations").getFullList(200);
} catch (error) {
    console.error("organisations Error:", error);
}

export { pb_organisations }