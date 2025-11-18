import { getCollection } from './load.js';

const collection = "posts";
const name = "posts";
function getRuntimeEnv() {
    const globalContext = globalThis;

    if (globalContext?.context?.env) {
        return globalContext.context.env;
    }

    if (globalContext?.context?.locals?.env) {
        return globalContext.context.locals.env;
    }

    if (typeof process !== "undefined" && typeof process.env !== "undefined") {
        return process.env;
    }

    if (typeof import.meta !== "undefined" && typeof import.meta.env !== "undefined") {
        return import.meta.env;
    }

    return {};
}

function isTruthy(value) {
    if (typeof value !== "string") {
        return Boolean(value);
    }

    switch (value.trim().toLowerCase()) {
        case "1":
        case "true":
        case "yes":
        case "on":
            return true;
        default:
            return false;
    }
}

const runtimeEnv = getRuntimeEnv();
const isDev = isTruthy(runtimeEnv.DEV);

console.log(`DEV mode: ${isDev}`);

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
    filter: isDev ?
        {
            status: {
                _in: ["published", "draft"]
            }
        } :
        {
            status: {
                _eq: "published"
            },
            date_time: {
                _lte: britishTime.currentTime
            }
        }
};

const attach = false;

const posts = await getCollection(collection, name, filterOptions, attach);

// Debug output - show what posts we have and their dates
if (!isDev) {
    console.log(`DEBUG: Found ${posts.length} posts`);
    posts.forEach((post, i) => {
        if (i < 5) { // Just show the first few posts to avoid log spam
            console.log(`Post: ${post.title || post.id}, Date: ${post.date_time}, Status: ${post.status}`);
        }
    });
}

export { posts }