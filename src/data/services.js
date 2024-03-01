import { createDirectus, rest, readItems } from '@directus/sdk';

const client = createDirectus('https://unltd.directus.app').with(rest());

const services = await client.request(
    readItems('services', {
        filter: {
            status: {
                _eq: 'published'
            }
        },
        fields: ['*.*.*.*.*'],
    })
);

export { services }