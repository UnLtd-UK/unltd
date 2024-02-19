import { createDirectus, rest, readItems } from '@directus/sdk';

const client = createDirectus('https://unltd.directus.app').with(rest());

const pages = await client.request(
    readItems('pages', {
        filter: {
            status: {
                _eq: 'published'
            }
        },
        fields: ['*'],
    })
);

export { pages }