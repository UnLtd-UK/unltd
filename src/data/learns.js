import { createDirectus, rest, readItems } from '@directus/sdk';

const client = createDirectus('https://unltd.directus.app').with(rest());

const learns = await client.request(
    readItems('learn', {
        filter: {
            status: {
                _eq: 'published'
            }
        },
        fields: ['*'],
    })
);

export { learns }