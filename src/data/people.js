import { pb } from "./pocketbase.js";

let pb_people;

try {
    pb_people = await pb.collection("people").getFullList(200, {
        sort: "order",
    });
} catch (error) {
    console.error("people Error:", error);
}

export { pb_people }