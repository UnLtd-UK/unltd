import { getCollection } from './load.js';

console.log("NAME: ", env.BRANCH_NAME);
console.log("NAME2: ", process.env.BRANCH_NAME);

const collection = "posts";
const name = "posts";
const branch = process.env.CF_PAGES_BRANCH || 'local';

console.log(`Branch: ${branch}`);

const isProd = branch === 'main' && true || false;

console.log(`Production: ${isProd}`)

// Function to get current time in British timezone (either GMT or BST depending on DST)
function getBritishTime() {
    const now = new Date();

    // Format in British timezone (en-GB locale with Europe/London timezone)
    const britishFormatter = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/London',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });

    // Get formatted parts
    const parts = britishFormatter.formatToParts(now);
    const britishDateObj = {};

    // Convert parts to an object for easy access
    parts.forEach(part => {
        britishDateObj[part.type] = part.value;
    });

    // Format as ISO-like string for date comparison (YYYY-MM-DD)
    const britishDate = `${britishDateObj.year}-${britishDateObj.month}-${britishDateObj.day}`;

    // Create properly formatted ISO strings that represent British local time
    const britishCurrentTime = `${britishDate}T${britishDateObj.hour}:${britishDateObj.minute}:${britishDateObj.second}.000Z`;
    const britishEndOfDay = `${britishDate}T23:59:59.999Z`;

    return {
        now: now,
        isoDate: britishDate,
        endOfDay: britishEndOfDay,
        currentTime: britishCurrentTime,
        formatted: `${britishDate} ${britishDateObj.hour}:${britishDateObj.minute}:${britishDateObj.second}`
    };
}

const britishTime = getBritishTime();

console.log(`UTC Time: ${new Date().toISOString()}`);
console.log(`British Date: ${britishTime.isoDate}`);
console.log(`British Formatted Time: ${britishTime.formatted}`);
console.log(`British Current Time: ${britishTime.currentTime}`);

const filterOptions = {
    sort: ['-date_time'],
    limit: -1,
    filter: isProd ?
        {
            status: {
                _eq: "published"
            },
            date_time: {
                _lte: britishTime.currentTime // Use current time instead of end-of-day
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