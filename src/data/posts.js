import { getCollection } from './load.js';

const collection = "posts";
const name = "posts";
const branch = process.env.CF_PAGES_BRANCH || 'local';

console.log(`Branch: ${branch}`);

const isProd = branch === 'main' && true || false;

console.log(`Production: ${isProd}`)

// Get current date with proper timezone handling
const now = new Date();
// ISO string is always in UTC (Z)
const currentDateUTC = now.toISOString();
// Create date string in local timezone (YYYY-MM-DD format)
const localDate = new Date(now.getTime() - (now.getTimezoneOffset() * 60000))
    .toISOString().split('T')[0];
const currentDateLocal = `${localDate}T00:00:00.000Z`; // End of day in local timezone

console.log(`Current UTC Date: ${currentDateUTC}`);
console.log(`Current Local Date (for comparison): ${currentDateLocal}`);
console.log(`Local Time: ${now.toString()}`);

const filterOptions = {
    sort: ['-date_time'],
    limit: -1,
    filter: isProd ?
        {
            status: {
                _eq: "published"
            },
            date_time: {
                _lte: currentDateLocal // Use local date to ensure entire current day is included
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