import { marked } from 'marked';

interface ImageOptions {
  href: string;
  text: string | null;
}

// Configure marked renderer for custom image handling
const renderer = new marked.Renderer();
renderer.image = ({href, title, text}): string => {
  try {
    const imageOptions: ImageOptions = {
      href,
      text: text || title || ''
    };

    // Check if there's a caption (text between asterisks)
    const captionMatch = imageOptions.text && imageOptions.text.match(/^([^*]+)(?:\s*\*([^*]+)\*)?$/);

    if (captionMatch) {
      // If there's a caption, render as figure with figcaption
      const alt = (captionMatch[1] || '').trim();
      const caption = (captionMatch[2] || '').trim();

      if (caption) {
        return `<figure>
          <img src="${imageOptions.href}" alt="${alt}">
          <figcaption>${caption}</figcaption>
        </figure>`;
      }
    }

    // If no caption, render as simple img tag with consistent styling
    return `<figure>
      <img src="${imageOptions.href}" alt="${imageOptions.text}">
    </figure>`;

  } catch (error) {
    console.error('Error processing image:', error);
    // Fallback to basic image rendering with consistent styling
    return `<figure>
      <img src="${href}" alt="${text || ''}">
    </figure>`;
  }
};

// Create and export a function that returns the configured marked instance
export function getMarkedWithImageCaption(): typeof marked {
  marked.use({ renderer });
  return marked;
}