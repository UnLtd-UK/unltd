import { getCollection } from './load.js';
import { getBritishTime } from '../utils/british-time.ts';

const collection = "posts";
const name = "posts";
const showDrafts = process.env.SHOW_DRAFTS === 'true';
console.log(`Show Drafts: ${showDrafts}`);
const statusFilter = showDrafts
    ? { _in: ['published', 'draft'] }
    : { _eq: 'published' };

const britishTime = getBritishTime();

console.log(`UTC Time: ${new Date().toISOString()}`);
console.log(`British Date: ${britishTime.isoDate}`);
console.log(`British Formatted Time: ${britishTime.formatted}`);
console.log(`British Current Time: ${britishTime.currentTime}`);

const filterOptions = {
    sort: ['-date_time'],
    limit: -1,
    filter: showDrafts
        ? {
            status: statusFilter
        }
        : {
            status: statusFilter,
            date_time: {
                _lte: britishTime.currentTime // Use current time instead of end-of-day
            }
        }
}

const attach = false;

const posts = await getCollection(collection, name, filterOptions, attach);

// Debug output - show what posts we have and their dates
if (!showDrafts) {
    console.log(`DEBUG: Found ${posts.length} posts`);
    posts.forEach((post, i) => {
        if (i < 5) { // Just show the first few posts to avoid log spam
            console.log(`Post: ${post.title || post.id}, Date: ${post.date_time}, Status: ${post.status}`);
        }
    });
}

export { posts }