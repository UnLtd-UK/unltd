let response = await fetch("https://unltd.directus.app/items/programmes/?sort[]=name&fields=*.*.*.*.*&filter[status][_eq]=published", {
    method: "GET"
});

let json = await response.json();
let oldProgrammes = json.data;

import { JSDOM } from 'jsdom';

// let newProgrammes;  // Declare 'programmes' at the top level

async function fetchMetadata(url) {
    if (!url || typeof url !== 'string') {
        console.error('Invalid URL:', url);
        return null;
    }

    try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.text();

        const dom = new JSDOM(data);
        const doc = dom.window.document;

        const title = doc.querySelector('meta[property="og:title"]')?.content || 'Default Title';
        const image = doc.querySelector('meta[property="og:image"]')?.content || 'Default Image';
        const author = doc.querySelector('#author')?.textContent || 'Default Author';
        const date = doc.querySelector('#date').getAttribute('value') || 'Default Author';
        const link = url;

        return { title, image, author, link, date };
    } catch (error) {
        console.error('Error fetching metadata:', error);
        return null;
    }
}

async function updateProgrammes(oldProgrammes) {
    return Promise.all(oldProgrammes.map(async (oldProgramme) => {
        const metadata = await fetchMetadata(oldProgramme.post);

        if (metadata) {
            return { ...oldProgramme, post: metadata };
        }
        return oldProgramme;
    }));
}

let programmes;

try {
    programmes = await updateProgrammes(oldProgrammes);
} catch (error) {
    console.error('Error updating programmes:', error);
}

export { programmes }