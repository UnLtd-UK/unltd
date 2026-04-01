/**
 * HopeMap — Main container component for the Hope Map.
 * Manages view toggle (list/map), tag filtering, and renders the active view.
 */

import { useState, useMemo } from 'react';
import type { HopeMapPerson, HopeMapTagConfig } from '../../data/hopeMap';
import ListView from './ListView';
import MapView from './MapView';

type ViewMode = 'list' | 'map';

interface HopeMapProps {
    entries: HopeMapPerson[];
    tags: Record<string, HopeMapTagConfig>;
    compact?: boolean;
    onExpand?: () => void;
}

export default function HopeMap({ entries, tags, compact = false, onExpand }: HopeMapProps) {
    const [view, setView] = useState<ViewMode>('list');
    const [activeTag, setActiveTag] = useState<string | null>(null);

    // Derive the set of tags actually used by the entries
    const availableTags = useMemo(() => {
        const slugs = new Set(entries.flatMap((e) => e.tags));
        return Object.entries(tags).filter(([slug]) => slugs.has(slug));
    }, [entries, tags]);

    // Filter entries by active tag
    const filteredEntries = useMemo(() => {
        if (!activeTag) return entries;
        return entries.filter((e) => e.tags.includes(activeTag));
    }, [entries, activeTag]);

    const toggleTag = (slug: string) => {
        setActiveTag((prev) => (prev === slug ? null : slug));
    };

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                {/* View Toggle */}
                <div className="inline-flex rounded-xl bg-violet-900/50 p-1 ring-1 ring-violet-700/50">
                    <button
                        type="button"
                        onClick={() => setView('list')}
                        className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${view === 'list'
                                ? 'bg-violet-600/80 text-white ring-1 ring-violet-500/50 shadow-lg shadow-violet-500/20'
                                : 'text-violet-400 hover:text-violet-300 hover:bg-violet-800/30'
                            }`}
                    >
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 512 512" aria-hidden="true">
                            <path d="M40 48C26.7 48 16 58.7 16 72v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V72c0-13.3-10.7-24-24-24H40zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zM16 232v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V232c0-13.3-10.7-24-24-24H40c-13.3 0-24 10.7-24 24zM40 368c-13.3 0-24 10.7-24 24v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V392c0-13.3-10.7-24-24-24H40z" />
                        </svg>
                        List
                    </button>
                    <button
                        type="button"
                        onClick={() => setView('map')}
                        className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${view === 'map'
                                ? 'bg-violet-600/80 text-white ring-1 ring-violet-500/50 shadow-lg shadow-violet-500/20'
                                : 'text-violet-400 hover:text-violet-300 hover:bg-violet-800/30'
                            }`}
                    >
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 576 512" aria-hidden="true">
                            <path d="M384 476.1L192 421.2V35.9L384 90.8V476.1zm32-1.2V88.4L543.1 37.5c15.8-6.3 32.9 5.3 32.9 22.3V394.6c0 9.8-6 18.6-15.1 22.3L416 474.8zM15.1 95.1L160 37.2V423.6L.9 474.8C-14.8 481.1-32 469.4-32 452.5V117.4c0-9.8 6-18.6 15.1-22.3z" />
                        </svg>
                        Map
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    {/* Expand button (compact mode only) */}
                    {compact && onExpand && (
                        <button
                            type="button"
                            onClick={onExpand}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-violet-800/50 px-3 py-2 text-sm font-medium text-violet-300 ring-1 ring-violet-700/50 hover:bg-violet-700/50 hover:text-violet-200 transition-colors"
                            aria-label="Expand Hope Map to fullscreen"
                        >
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 448 512" aria-hidden="true">
                                <path d="M32 32C14.3 32 0 46.3 0 64v96c0 17.7 14.3 32 32 32s32-14.3 32-32V96h64c17.7 0 32-14.3 32-32s-14.3-32-32-32H32zM64 416H32V352c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7 14.3 32 32 32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32zm352-320V160c0 17.7 14.3 32 32 32s32-14.3 32-32V64c0-17.7-14.3-32-32-32H352c-17.7 0-32 14.3-32 32s14.3 32 32 32h64zm64 192c-17.7 0-32 14.3-32 32v64H384c-17.7 0-32 14.3-32 32s14.3 32 32 32h96c17.7 0 32-14.3 32-32V352c0-17.7-14.3-32-32-32z" />
                            </svg>
                            Fullscreen
                        </button>
                    )}
                </div>
            </div>

            {/* Tag Filters */}
            {availableTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {availableTags.map(([slug, tag]) => {
                        const isActive = activeTag === slug;
                        return (
                            <button
                                key={slug}
                                type="button"
                                onClick={() => toggleTag(slug)}
                                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-all duration-150 ${isActive
                                        ? `${tag.bgClass} ${tag.textClass} ring-1 ring-current`
                                        : 'bg-violet-900/40 text-violet-400 hover:bg-violet-800/50 hover:text-violet-300'
                                    }`}
                            >
                                {tag.label}
                                {isActive && (
                                    <svg className="ml-1.5 h-3 w-3" fill="currentColor" viewBox="0 0 384 512" aria-hidden="true">
                                        <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                                    </svg>
                                )}
                            </button>
                        );
                    })}
                    {activeTag && (
                        <button
                            type="button"
                            onClick={() => setActiveTag(null)}
                            className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium text-violet-400 hover:text-violet-300 transition-colors"
                        >
                            Clear filter
                        </button>
                    )}
                </div>
            )}

            {/* Active View */}
            {view === 'list' ? (
                <ListView entries={filteredEntries} tags={tags} compact={compact} />
            ) : (
                <MapView entries={filteredEntries} tags={tags} compact={compact} />
            )}

            {/* Entry count */}
            <p className="text-xs text-violet-500">
                Showing {filteredEntries.length} of {entries.length} {entries.length === 1 ? 'person' : 'people'}
            </p>
        </div>
    );
}
