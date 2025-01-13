import Markdoc from '@markdoc/markdoc';
import { slugify } from './slugify';
import config from '@utils/markdoc.config.mjs';

// Keep track of heading occurrences and which ones are duplicates
const headingCounts = new Map();
const duplicateHeadings = new Set();

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
        
        // If this is the second occurrence, mark it as a duplicate
        if (count === 2) {
          duplicateHeadings.add(baseId);
        }
        
        // Only add numbers to subsequent occurrences of duplicates
        const id = duplicateHeadings.has(baseId) && count > 1
          ? `${baseId}-${count - 1}`  // Subtract 1 so second occurrence is "baseId-1"
          : baseId;
        
        const level = node.attributes['level'];
        
        return new Markdoc.Tag(
          `h${level}`,
          { 
            id,
            class: 'group flex whitespace-pre-wrap scroll-mt-12'
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
    // Reset the tracking for each new document
    headingCounts.clear();
    duplicateHeadings.clear();
    
    // Pre-scan to identify duplicates
    const ast = Markdoc.parse(content);
    ast.walk(node => {
      if (node.type === 'heading') {
        const text = node.children[0]?.children?.[0] || '';
        const baseId = slugify(text);
        const count = (headingCounts.get(baseId) || 0) + 1;
        headingCounts.set(baseId, count);
        if (count === 2) {
          duplicateHeadings.add(baseId);
        }
      }
    });
    
    // Reset counts for the actual transform
    headingCounts.clear();
    
    // Now do the actual transform
    const transformed = Markdoc.transform(ast, updatedConfig);
    return Markdoc.renderers.html(transformed);
  } catch (error) {
    console.error('Markdoc rendering error:', error);
    return '<p>Error rendering content</p>';
  }
}