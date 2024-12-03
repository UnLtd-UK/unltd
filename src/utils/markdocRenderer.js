// @utils/markdocRenderer.js
import Markdoc from '@markdoc/markdoc';
import { defineMarkdocConfig, component } from '@astrojs/markdoc/config';

const config = {
    nodes: {
        // Define how Markdoc should handle custom nodes
    },
    tags: {
        dropdown: {
            render: component('@components/markdoc/Dropdown'),
            attributes: {
                name: { type: String, required: true },
            },
        },
        tip: {
            render: component('@components/markdoc/Tip'),
            attributes: {
                description: { type: String, required: true },
                link: { type: String, required: true },
            },
        },
    },
};

export function markdocRenderer(content, components) {
    const ast = Markdoc.parse(content);
    const transformedContent = Markdoc.transform(ast, config);
    return Markdoc.renderers.html(transformedContent, { components });
}