/**
 * ListView — Responsive card grid of Hope Map entries.
 */

import type { HopeMapPerson } from '../../data/hopeMap';
import PersonCard from './PersonCard';

interface ListViewProps {
    entries: HopeMapPerson[];
    compact?: boolean;
}

export default function ListView({ entries, compact = false }: ListViewProps) {
    if (entries.length === 0) {
        return (
            <div className="flex items-center justify-center py-12">
                <p className="text-violet-400 text-sm">No entries match your filters.</p>
            </div>
        );
    }

    return (
        <div className={`grid gap-4 ${compact ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
            {entries.map((person) => (
                <PersonCard key={person.id} person={person} compact={compact} />
            ))}
        </div>
    );
}
