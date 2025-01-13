import Markdoc from '@markdoc/markdoc';
import { slugify } from './slugify';
import config from '@utils/markdoc.config.mjs';

// Keep track of heading occurrences
const headingCounts = new Map();

const updatedConfig = {
  ...config,
  nodes: {
    ...config.nodes,
    heading: {
      transform(node, config) {
        const children = node.transformChildren(config);
        const text = children.join('');
        const baseId = slugify(text);
        
        // Get and increment the count for this heading
        const count = (headingCounts.get(baseId) || 0) + 1;
        headingCounts.set(baseId, count);
        
        // Always include the number prefix for consistency
        const id = `${count}-${baseId}`;
        const level = node.attributes['level'];
        
        return new Markdoc.Tag(
          `h${level}`,
          { 
            id,
            class: 'group flex whitespace-pre-wrap'
          },
          [
            ...children,
            new Markdoc.Tag(
              'a',
              {
                href: `#${id}`,
                class: 'ml-2 opacity-0 group-hover:opacity-100 transition-opacity',
                'aria-label': 'Link to this section'
              },
              ['🔗']
            )
          ]
        );
      },
    },
  },
};

export default function markdocRenderer(content) {
  try {
    // Reset the heading counts for each new document
    headingCounts.clear();
    
    const ast = Markdoc.parse(content);
    const transformed = Markdoc.transform(ast, updatedConfig);
    return Markdoc.renderers.html(transformed);
  } catch (error) {
    console.error('Markdoc rendering error:', error);
    return '<p>Error rendering content</p>';
  }
}