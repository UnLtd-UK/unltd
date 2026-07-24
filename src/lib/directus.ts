import { createDirectus, rest, readItems, withToken } from "@directus/sdk";

// Shared Directus REST client, used for on-demand requests (e.g. the live
// preview route) that must bypass the build-time cache in src/data/load.js
// and always fetch fresh data straight from Directus.
const DIRECTUS_URL = "https://unltd.directus.app";

const client = createDirectus(DIRECTUS_URL).with(rest());

export { client, readItems, withToken };
