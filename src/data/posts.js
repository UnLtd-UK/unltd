import { createDirectus, rest, readItems } from '@directus/sdk';

const client = createDirectus('https://unltd.directus.app').with(rest());

const posts = await client.request(
    readItems('posts', {
        sort: ['sort', '-date_time'],
        filter: {
            status: {
                _eq: 'published'
            }
        }
    })
);

export { posts }