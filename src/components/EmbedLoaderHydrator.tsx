import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import EmbedLoader from './EmbedLoader';
import { PLATFORMS } from '../config/embed.config';

// Map orientation to aspect ratio padding
const ORIENTATION_PADDING: Record<string, string> = {
    landscape: '56.25%',  // 16:9
    portrait: '177.78%',  // 9:16
    square: '100%',       // 1:1
};

/**
 * Hydrates native <embed> elements in the DOM with EmbedLoader React components.
 * 
 * Usage in Directus markdown:
 *   <embed src="https://www.youtube.com/watch?v=VIDEO_ID" title="Video description" />
 *   <embed src="https://www.youtube.com/watch?v=VIDEO_ID" title="Interview" caption="Juan explains his journey" />
 *   <embed src="https://typeform.com/to/FORM_ID" title="Application form" orientation="portrait" />
 * 
 * Supported attributes:
 *   - src (required): The URL to embed
 *   - title (required): Accessible title for screen readers (WCAG compliance)
 *   - caption (optional): Visible text displayed below the embed
 *   - orientation (optional): "landscape" (default), "portrait", or "square"
 * 
 * Usage in Astro:
 *   <EmbedLoaderHydrator client:load />
 */
export default function EmbedLoaderHydrator() {
    useEffect(() => {
        // Find all native <embed> elements
        const embeds = document.querySelectorAll('embed[src]');

        embeds.forEach((embed) => {
            const src = embed.getAttribute('src');
            if (!src) return;

            // Check if this is a configured platform
            const isConfiguredPlatform = PLATFORMS.some((platform) =>
                platform.urlPatterns.some((pattern) => src.includes(pattern))
            );

            if (!isConfiguredPlatform) {
                console.warn(`EmbedLoaderHydrator: Unrecognized platform for URL: ${src}`);
                return;
            }

            const title = embed.getAttribute('title');
            const caption = embed.getAttribute('caption') || undefined;
            const orientation = embed.getAttribute('orientation') || 'landscape';
            const paddingBottom = ORIENTATION_PADDING[orientation] || ORIENTATION_PADDING.landscape;

            // Title is required for accessibility
            if (!title) {
                console.error(`EmbedLoaderHydrator: Missing required 'title' attribute for accessibility. URL: ${src}`);
                return;
            }

            // Create a wrapper div to replace the embed
            const wrapper = document.createElement('div');
            wrapper.className = 'my-8 not-prose';
            wrapper.setAttribute('data-embed-hydrated', 'true');

            // Create the aspect ratio container
            const container = document.createElement('div');
            container.className = 'relative w-full overflow-hidden rounded-lg';
            container.style.paddingBottom = paddingBottom;

            wrapper.appendChild(container);

            // Add caption below the embed if provided
            if (caption) {
                const figcaption = document.createElement('p');
                figcaption.className = 'mt-3 text-sm text-violet-400 text-center';
                figcaption.textContent = caption;
                wrapper.appendChild(figcaption);
            }

            // Replace the embed element with our wrapper
            embed.parentNode?.replaceChild(wrapper, embed);

            // Mount the React component
            const root = createRoot(container);
            root.render(
                <EmbedLoader
                    src={src}
                    title={title}
                    className="absolute inset-0 w-full h-full"
                />
            );
        });
    }, []);

    // This component doesn't render anything itself
    return null;
}