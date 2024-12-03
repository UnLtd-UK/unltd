import { defineMarkdocConfig, component } from '@astrojs/markdoc/config';

export default defineMarkdocConfig({
    tags: {
        dropdown: {
            render: component('./src/components/markdoc/Dropdown.astro'),
            attributes: {
                name: { type: String, required: true },
            },
        },
        tip: {
            render: component('./src/components/markdoc/Tip.astro'),
            attributes: {
                description: { type: String, required: true },
                link: { type: String, required: true },
            },
        },
    },
});