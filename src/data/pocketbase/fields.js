import { pb } from "./pocketbase.js";

let pb_fields;

try {
    pb_fields = await pb.collection("fields").getFullList(200, {
        sort: "order",
    });
} catch (error) {
    console.error("fields Error:", error);
}

export { pb_fields }