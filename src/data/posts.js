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
// Instead of end of day, use current exact time to ensure we catch everything
// This ensures we're getting posts up to the current minute
const currentExactTime = currentDateUTC;

console.log(`Current UTC Date: ${currentDateUTC}`);
console.log(`Using exact current time for comparison: ${currentExactTime}`);
console.log(`Environment Time: ${now.toString()}`);

// Add 5 minutes buffer to account for small time differences/clock skew
const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60000).toISOString();
console.log(`With 5min buffer: ${fiveMinutesFromNow}`);

const filterOptions = {
    sort: ['-date_time'],
    limit: -1,
    filter: isProd ?
        {
            status: {
                _eq: "published"
            },
            date_time: {
                _lte: fiveMinutesFromNow // Use current time + 5min buffer to ensure all posts are included
            }
        } :
        {
            status: {
                _in: ["published", "draft"]
            },
            date_time: {
                _lte: fiveMinutesFromNow // Use current time + 5min buffer to ensure all posts are included
            }
        }
}

const attach = false;

const posts = await getCollection(collection, name, filterOptions, attach);

// Debug output - show what posts we have and their dates
if (isProd) {
    console.log(`DEBUG: Found ${posts.length} posts`);
    posts.forEach((post, i) => {
        if (i < 5) { // Just show the first few posts to avoid log spam
            console.log(`Post: ${post.title || post.id}, Date: ${post.date_time}, Status: ${post.status}`);
        }
    });
}

export { posts }