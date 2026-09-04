import { createDirectus, rest, readItems, withToken } from '@directus/sdk';
import { resolveEnvVar } from '../lib/env.ts';

const client = createDirectus('https://unltd.directus.app').with(rest());
const DIRECTUS_API_TOKEN = await resolveEnvVar('DIRECTUS_API_TOKEN');

const showDrafts = process.env.SHOW_DRAFTS === 'true';
const statusFilter = showDrafts
    ? { _in: ['published', 'draft'] }
    : { _eq: 'published' };

const sesm = await client.request(
    withToken(DIRECTUS_API_TOKEN, readItems('positions', {
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
    }))
);

export { sesm }