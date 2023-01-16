import { pb } from "./pocketbase.js";

let pb_funds;

try {
    pb_funds = await pb.collection("funds").getFullList(200, {
        expand: "funders"
    });
} catch (error) {
    console.error("funds Error:", error);
}

export { pb_funds }