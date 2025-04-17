import { getCollection } from './load.js';

const collection = "posts";
const name = "posts";

let branch = "branch";
let isDev = false;

try {
    // For Cloudflare Pages, environment variables are available in process.env
    branch = process.env.CF_PAGES_BRANCH || 'local';

    // Check for DEV environment variable
    // In Cloudflare Pages, custom environment variables are prefixed with CF_PAGES
    // or you can access them directly if you've set them up in the Pages dashboard
    isDev = process.env.DEV === 'true' || process.env.CF_PAGES_DEV === 'true' || false;

    console.log(`Branch: ${branch}`);
    console.log(`DEV environment: ${isDev ? 'true' : 'false'}`);
    console.log(`DOMAIN: ${process.env.DOMAIN || process.env.CF_PAGES_DOMAIN || 'not set'}`);
} catch (error) {
    console.error('Error accessing environment variables:', error);
    branch = 'local'; // default value
    isDev = true; // default to dev mode if we can't determine
}

// Use both branch check and explicit DEV variable
const isProd = (branch === 'main' || branch === 'production') && !isDev;

const filterOptions = {
    sort: ['-date_time'],
    limit: -1,
    filter: isProd ?
        {
            status: {
                _eq: "published"
            }
        } :
        {
            status: {
                _in: ["published", "draft"]
            }
        }
}

const attach = false;

const posts = await getCollection(collection, name, filterOptions, attach);

export { posts }