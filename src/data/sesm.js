import { createDirectus, rest, readItems } from '@directus/sdk';

const client = createDirectus('https://unltd.directus.app').with(rest());

const showDrafts = process.env.SHOW_DRAFTS === 'true';
const statusFilter = showDrafts
    ? { _in: ['published', 'draft'] }
    : { _eq: 'published' };

const sesm = await client.request(
    readItems('positions', {
        sort: ['person.name'],
        filter: {
            status: statusFilter,
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