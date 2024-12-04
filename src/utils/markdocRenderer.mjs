import Markdoc from '@markdoc/markdoc';
import config from '@utils/markdoc.config.mjs';

export default function markdocRenderer(content) {
    try {
        const ast = Markdoc.parse(content);
        const transformedContent = Markdoc.transform(ast, config);
        return Markdoc.renderers.html(transformedContent);
    } catch (error) {
        console.error('Markdoc rendering error:', error);
        return '<p>Error rendering content</p>';
    }
}