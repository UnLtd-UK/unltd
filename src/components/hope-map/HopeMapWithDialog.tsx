/**
 * HopeMapWithDialog — Shared wrapper that renders HopeMap with optional dialog support.
 * Used by both HopeMapEmbedClient (Astro pages) and HopeMapHydrator (blog post content).
 */

import { useState } from 'react';
import type { HopeMapPerson } from '../../data/hopeMap';
import HopeMap from './HopeMap';
import HopeMapDialog from './HopeMapDialog';

interface Props {
    entries: HopeMapPerson[];
    compact?: boolean;
}

export default function HopeMapWithDialog({ entries, compact = true }: Props) {
    const [dialogOpen, setDialogOpen] = useState(false);

    return (
        <>
            <HopeMap
                entries={entries}
                compact={compact}
                onExpand={() => setDialogOpen(true)}
            />
            {compact && (
                <HopeMapDialog
                    open={dialogOpen}
                    onClose={() => setDialogOpen(false)}
                    entries={entries}
                />
            )}
        </>
    );
}
