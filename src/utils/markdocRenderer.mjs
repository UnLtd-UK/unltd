import Markdoc from '@markdoc/markdoc';
import { slugify } from './slugify';
import config from '@utils/markdoc.config.mjs';

const updatedConfig = {
  ...config,
  nodes: {
    ...config.nodes,
    heading: {
      transform(node, config) {
        const children = node.transformChildren(config);
        const text = children.join('');
        const id = slugify(text);
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
    const ast = Markdoc.parse(content);
    const transformed = Markdoc.transform(ast, updatedConfig);
    return Markdoc.renderers.html(transformed);
  } catch (error) {
    console.error('Markdoc rendering error:', error);
    return '<p>Error rendering content</p>';
  }
}