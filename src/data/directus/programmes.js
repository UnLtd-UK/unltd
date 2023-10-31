let response = await fetch("https://unltd.directus.app/items/programmes/?fields=*.*.*", {
    method: "GET"
});

let json = await response.json();
let programmes = json.data;

async function fetchMetadata(url) {
    try {
        const response = await fetch(url);
        const data = await response.text();

        const parser = new DOMParser();
        const dom = parser.parseFromString(data, 'text/html');

        const title = dom.querySelector('meta[property="og:title"]')?.content || '';
        const image = dom.querySelector('meta[property="og:image"]')?.content || '';
        const author = dom.querySelector('#author').textContent;
        const link = url;

        return { title, image, author, link };
    } catch (error) {
        console.error('Error:', error);
    }
}

async function updateProgrammes(programmes) {
    return Promise.all(programmes.map(async (programme) => {
        const metadata = await fetchMetadata(programme.post);
        return { ...programme, post: metadata };
    }));
}

// Usage
async function main() {
    try {
        const updatedProgrammes = await updateProgrammes(programmes);
        console.log("UPDATED", updatedProgrammes);
    } catch (error) {
        console.error('Error updating programmes:', error);
    }
}

main();

export { programmes }