import { pb } from "./pocketbase.js";

let pb_applications;

try {
    pb_applications = await pb.collection("applications").getFullList(200, {
        sort: "order",
    });
} catch (error) {
    console.error("applications Error:", error);
}

export { pb_applications }