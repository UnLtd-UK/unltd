/**
 * PersonCard — Shared card component for Hope Map entries.
 * Used in both ListView (as a grid card) and MapView (in popup).
 */

import type { HopeMapPerson, HopeMapTagConfig } from '../../data/hopeMap';

interface PersonCardProps {
    person: HopeMapPerson;
    tags: Record<string, HopeMapTagConfig>;
    compact?: boolean;
}

export default function PersonCard({ person, tags, compact = false }: PersonCardProps) {
    return (
        <div className={`rounded-xl border border-violet-700/30 bg-violet-950/60 ${compact ? 'p-4' : 'p-5'} transition-all hover:border-violet-600/50 hover:shadow-lg hover:shadow-violet-500/10`}>
            {/* Header */}
            <div className="mb-3">
                <h3 className={`font-semibold text-violet-100 ${compact ? 'text-base' : 'text-lg'}`}>
                    {person.name}
                </h3>
                <p className={`font-medium text-violet-300 ${compact ? 'text-sm' : 'text-base'}`}>
                    {person.organisation}
                </p>
            </div>

            {/* Location */}
            <div className="mb-3 flex items-center gap-1.5">
                <svg className="h-3.5 w-3.5 text-violet-400" fill="currentColor" viewBox="0 0 384 512" aria-hidden="true">
                    <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
                </svg>
                <span className="text-sm text-violet-400">{person.location}</span>
            </div>

            {/* Description */}
            <p className={`mb-3 text-violet-200 ${compact ? 'text-sm line-clamp-2' : 'text-sm'}`}>
                {person.description}
            </p>

            {/* Act of Hope Quote */}
            <blockquote className="mb-4 border-l-2 border-amber-500/60 pl-3">
                <p className={`italic text-amber-200/90 ${compact ? 'text-sm line-clamp-2' : 'text-sm'}`}>
                    &ldquo;{person.actOfHope}&rdquo;
                </p>
            </blockquote>

            {/* Tags */}
            <div className="mb-3 flex flex-wrap gap-1.5">
                {person.tags.map((tagSlug) => {
                    const tag = tags[tagSlug];
                    if (!tag) return null;
                    return (
                        <span
                            key={tagSlug}
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${tag.bgClass} ${tag.textClass}`}
                        >
                            {tag.label}
                        </span>
                    );
                })}
            </div>

            {/* Website Link */}
            <a
                href={person.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors"
            >
                Visit website
                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 512 512" aria-hidden="true">
                    <path d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32h82.7L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3V192c0 17.7 14.3 32 32 32s32-14.3 32-32V32c0-17.7-14.3-32-32-32H320zM80 32C35.8 32 0 67.8 0 112V432c0 44.2 35.8 80 80 80H400c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32V432c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16H192c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z" />
                </svg>
            </a>
        </div>
    );
}
