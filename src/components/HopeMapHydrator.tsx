/**
 * HopeMapHydrator — Client-side hydrator for Hope Map embeds in blog post content.
 *
 * When a Directus blog post contains <HopeMapEmbed /> in its markdown body,
 * the `marked` parser passes it through as a raw <hopemapembed> HTML element.
 * This hydrator finds those elements in the DOM and mounts the interactive
 * React HopeMap component into each one.
 *
 * Pattern follows EmbedLoaderHydrator.tsx.
 *
 * Usage in Astro:
 *   <HopeMapHydrator client:load />
 */

import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { hopeMapEntries, hopeMapTags } from '../data/hopeMap';
import HopeMapWithDialog from './hope-map/HopeMapWithDialog';

export default function HopeMapHydrator() {
    useEffect(() => {
        // HTML custom/unknown elements are lowercased by the browser parser.
        // <HopeMapEmbed /> in markdown becomes <hopemapembed> in the DOM.
        const targets = document.querySelectorAll('hopemapembed');

        targets.forEach((target) => {
            // Skip if already hydrated
            if (target.getAttribute('data-hydrated') === 'true') return;

            // Create wrapper div
            const wrapper = document.createElement('div');
            wrapper.className = 'my-8 not-prose';
            wrapper.setAttribute('data-hope-map-hydrated', 'true');

            // Replace the original element
            target.parentNode?.replaceChild(wrapper, target);

            // Mount React component
            const root = createRoot(wrapper);
            root.render(
                <HopeMapWithDialog
                    entries={hopeMapEntries}
                    tags={hopeMapTags}
                    compact={true}
                />
            );
        });
    }, []);

    return null;
}
