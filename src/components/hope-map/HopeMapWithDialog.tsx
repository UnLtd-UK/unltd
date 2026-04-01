/**
 * HopeMapWithDialog — Shared wrapper that renders HopeMap with optional dialog support.
 * Used by both HopeMapEmbedClient (Astro pages) and HopeMapHydrator (blog post content).
 */

import { useState } from 'react';
import type { HopeMapPerson, HopeMapTagConfig } from '../../data/hopeMap';
import HopeMap from './HopeMap';
import HopeMapDialog from './HopeMapDialog';

interface Props {
    entries: HopeMapPerson[];
    tags: Record<string, HopeMapTagConfig>;
    compact?: boolean;
}

export default function HopeMapWithDialog({ entries, tags, compact = true }: Props) {
    const [dialogOpen, setDialogOpen] = useState(false);

    return (
        <>
            <HopeMap
                entries={entries}
                tags={tags}
                compact={compact}
                onExpand={() => setDialogOpen(true)}
            />
            {compact && (
                <HopeMapDialog
                    open={dialogOpen}
                    onClose={() => setDialogOpen(false)}
                    entries={entries}
                    tags={tags}
                />
            )}
        </>
    );
}
