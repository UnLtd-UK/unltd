import { pb } from "./pocketbase.js";

let pb_sections;

try {
    pb_sections = await pb.collection("sections").getFullList(200, {
        sort: "order",
    });
} catch (error) {
    console.error("sections Error:", error);
}

export { pb_sections }