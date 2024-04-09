import fs from 'fs/promises';
import { createDirectus, rest, readItems } from '@directus/sdk';

async function fetchData(collection, name, collectionUrl, filterOptions, attach) {
    try {

        const client = createDirectus('https://unltd.directus.app').with(rest());

        const response = await client.request(
            readItems(collection, filterOptions)
        );

        if (attach == true) {
            response.map((currentObject, index, originalArray) => {
                // Filter out the current object
                const remainingObjects = originalArray.filter((_, filterIndex) => index !== filterIndex);
                return {
                    ...currentObject,
                    collection: remainingObjects
                };
            });
        }

        await fs.mkdir("./src/data/cache", { recursive: true });

        // Write the file
        await fs.writeFile(collectionUrl, JSON.stringify(response));

        console.log("Wrote cache: ", `${name}.json`)

        return response;
    } catch (error) {
        console.error(`Error getting ${name} collection:`, error);
    }
}

async function load(collection, name, filterOptions, attach) {

    const collectionUrl = `./src/data/cache/${name}.json`;

    // Check if the JSON file exists
    try {
        await fs.stat(collectionUrl);

        const data = await fs.readFile(collectionUrl, 'utf8');

        console.log("Read cache: ", `${name}.json`)
        return JSON.parse(data);

    } catch (error) {
        if (error.code === 'ENOENT') {
            // If the file does not exist, fetch data from the API
            return fetchData(collection, name, collectionUrl, filterOptions, attach);
        }

        console.error('Error:', error);
    }
}

export async function getCollection(collection, name, filterOptions, attach) {
    return await load(collection, name, filterOptions, attach);
}