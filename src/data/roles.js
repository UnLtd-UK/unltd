import { pb } from "./pocketbase.js";

let pb_roles;

try {
    pb_roles = await pb.collection("roles").getFullList(200, {
        sort: "order",
    });
} catch (error) {
    console.error("roles Error:", error);
}

export { pb_roles }