import { getCollection } from './load.js';

const collection = "posts";
const name = "posts";
const branch = process.env.CF_PAGES_BRANCH || 'local';

console.log(`Branch: ${branch}`);

const isProd = branch === 'main' && true || false;

console.log(`Production: ${isProd}`)

// Get current date with simplified handling that works in all environments
const now = new Date();
// ISO string is always in UTC (Z)
const currentDateUTC = now.toISOString();

// Get just the date part (YYYY-MM-DD)
const todayDate = currentDateUTC.split('T')[0];
// Set to end of today in UTC
const endOfTodayUTC = `${todayDate}T23:59:59.999Z`;

console.log(`Current UTC Date: ${currentDateUTC}`);
console.log(`End of Today UTC (for comparison): ${endOfTodayUTC}`);
console.log(`Environment Time: ${now.toString()}`);

const filterOptions = {
    sort: ['-date_time'],
    limit: -1,
    filter: isProd ?
        {
            status: {
                _eq: "published"
            },
            date_time: {
                _lte: endOfTodayUTC // Use end of today in UTC to include all today's posts
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