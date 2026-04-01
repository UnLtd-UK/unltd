/**
 * HopeMapEmbedClient — React client component for the Astro HopeMapEmbed wrapper.
 * Bundles the static data and renders HopeMap with dialog support.
 */

import { hopeMapEntries, hopeMapTags } from '../data/hopeMap';
import HopeMapWithDialog from './hope-map/HopeMapWithDialog';

interface Props {
    compact?: boolean;
}

export default function HopeMapEmbedClient({ compact = true }: Props) {
    return (
        <HopeMapWithDialog
            entries={hopeMapEntries}
            tags={hopeMapTags}
            compact={compact}
        />
    );
}
