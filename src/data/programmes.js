import { JSDOM } from 'jsdom';
import { createDirectus, rest, readItems } from '@directus/sdk';

const client = createDirectus('https://unltd.directus.app').with(rest());

const response = await client.request(
    readItems('programmes', {
        sort: ['sort', 'name'],
        filter: {
            status: {
                _eq: 'published'
            }
        },
        fields: ['*.*.*.*.*'],
    })
);

let programmes;

try {
    programmes = response.map((currentObject, index, originalArray) => {
        // Filter out the current object
        const remainingObjects = originalArray.filter((_, filterIndex) => index !== filterIndex);

        // Return a new object with the remainingObjects attached
        return {
            ...currentObject,
            programmes: remainingObjects
        };
    });
} catch (error) {
    console.error('Error updating programmes:', error);
}

export { programmes }