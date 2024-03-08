import { createDirectus, rest, readItems } from '@directus/sdk';

const client = createDirectus('https://unltd.directus.app').with(rest());

const positions = await client.request(
    readItems('positions', {
        sort: ['sort', 'person.name'],
        filter: {
            status: {
                _eq: 'published'
            },
            person: {
                _nnull: true
            }
        },
        fields: ['*.*'],
    })
);

export { positions }