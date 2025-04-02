import { createDirectus, rest, readItems } from '@directus/sdk';

const client = createDirectus('https://unltd.directus.app').with(rest());

const sesm = await client.request(
    readItems('positions', {
        sort: ['person.name'],
        filter: {
            status: {
                _eq: 'published'
            },
            role: {
                name: {
                    _in: ['Social Entrepreneur Support Manager', 'Social Entrepreneur Support Manager - England']
                }
            }
        },
        fields: ['*.*'],
    })
);

export { sesm }