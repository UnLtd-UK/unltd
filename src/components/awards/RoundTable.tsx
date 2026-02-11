/**
 * RoundTable Component (React)
 * Full-width table showing all application round dates and statuses.
 *
 * Highlights the current/active round row based on useRoundStatus.
 * Displays: Round name, Opens, Closes, Assessment, Results, Status badge.
 */

import Icon from "./Icon";
import { useRoundStatus, getRoundName, formatTime, type ProcessedRound } from "./useRoundStatus";

interface RoundTableProps {
    /** All rounds (processed server-side) */
    rounds: ProcessedRound[];
    /** Current/active round */
    currentRound?: ProcessedRound | null;
    /** Next upcoming round */
    nextRound?: ProcessedRound | null;
    /** Dev datetime override */
    devDateTime?: string;
}

/** Status badge styling by phase */
function getStatusBadgeClass(round: ProcessedRound): string {
    if (round.isUpcoming) return "bg-indigo-500/80 text-white border border-indigo-400/50";
    if (round.isOpen) return "bg-emerald-500/80 text-white border border-emerald-400/50";
    if (round.phase === "closed") return "bg-slate-600/80 text-white border border-slate-500/50";
    if (round.isInAssessment) return "bg-amber-500/80 text-white border border-amber-400/50";
    if (round.isInInterview) return "bg-yellow-500/80 text-white border border-yellow-400/50";
    if (round.phase === "awaiting-results") return "bg-sky-500/80 text-white border border-sky-400/50";
    if (round.isInResults) return "bg-violet-500/80 text-white border border-violet-400/50";
    if (round.phase === "completed") return "bg-slate-600/80 text-white border border-slate-500/50";
    return "bg-slate-500/80 text-white border border-slate-400/50";
}

/** Status label by phase */
function getStatusLabel(round: ProcessedRound): string {
    if (round.isUpcoming) return "Coming soon";
    if (round.isOpen) return "Open now";
    if (round.phase === "closed") return "Closed";
    if (round.isInAssessment) return "Assessing";
    if (round.isInInterview) return "Interviewing";
    if (round.phase === "awaiting-results") return "Assessments complete";
    if (round.isInResults) return "Emailing results";
    if (round.phase === "completed") return "Complete";
    return round.phaseInfo?.shortLabel || "Unknown";
}

export default function RoundTable({
    rounds,
    currentRound,
    nextRound,
    devDateTime,
}: RoundTableProps) {
    const { round: displayRound } = useRoundStatus({ currentRound, nextRound, devDateTime });

    if (!rounds || rounds.length === 0) {
        return null;
    }

    const getRowClass = (round: ProcessedRound): string => {
        if (displayRound && round.id === displayRound.id) {
            return "bg-violet-800/40 border-l-4 border-l-violet-400";
        }
        if (round.isOpen) return "bg-emerald-900/20";
        if (round.isUpcoming) return "bg-indigo-900/10";
        if (round.phase === "completed") return "opacity-60";
        return "";
    };

    return (
        <div className="bg-violet-950 text-white rounded-2xl p-6 md:p-8">
            <h3 className="text-xl font-bold mb-6 text-violet-100 flex items-center gap-2">
                <Icon name="calendar-days" style="solid" className="text-violet-300" />
                Application Rounds
            </h3>

            <div className="overflow-x-auto -mx-2">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-violet-700/50">
                            <th className="text-left py-3 px-2 font-semibold text-violet-300 text-xs uppercase tracking-wide">Status</th>
                            <th className="text-left py-3 px-2 font-semibold text-violet-300 text-xs uppercase tracking-wide">Opens</th>
                            <th className="text-left py-3 px-2 font-semibold text-violet-300 text-xs uppercase tracking-wide">Closes</th>
                            <th className="text-left py-3 px-2 font-semibold text-violet-300 text-xs uppercase tracking-wide hidden md:table-cell">Assessment</th>
                            <th className="text-left py-3 px-2 font-semibold text-violet-300 text-xs uppercase tracking-wide hidden md:table-cell">Interview</th>
                            <th className="text-left py-3 px-2 font-semibold text-violet-300 text-xs uppercase tracking-wide hidden md:table-cell">Results</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rounds.map((round) => (
                            <tr key={round.id} className={`border-b border-violet-800/30 ${getRowClass(round)}`}>
                                <td className="py-3 px-2">
                                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${getStatusBadgeClass(round)}`}>
                                        {getStatusLabel(round)}
                                    </span>
                                </td>
                                <td className="py-3 px-2">
                                    <span className={`font-medium ${round.id === displayRound?.id ? "text-white" : round.phase === "completed" ? "text-violet-400" : "text-violet-200"}`}>
                                        {round.dates.opensShort}
                                    </span>
                                </td>
                                <td className={`py-3 px-2 ${round.phase === "completed" ? "text-violet-500" : "text-violet-300"}`}>
                                    {round.dates.closesShort}
                                </td>
                                <td className={`py-3 px-2 hidden md:table-cell ${round.phase === "completed" ? "text-violet-500" : "text-violet-300"}`}>
                                    {round.dates.assessmentStartShort} – {round.dates.assessmentEndShort}
                                </td>
                                <td className={`py-3 px-2 hidden md:table-cell ${round.phase === "completed" ? "text-violet-500" : "text-violet-300"}`}>
                                    {round.dates.interviewStartShort && round.dates.interviewEndShort
                                        ? `${round.dates.interviewStartShort} – ${round.dates.interviewEndShort}`
                                        : <span className="text-violet-600">—</span>
                                    }
                                </td>
                                <td className={`py-3 px-2 hidden md:table-cell ${round.phase === "completed" ? "text-violet-500" : "text-violet-300"}`}>
                                    {round.dates.resultsStartShort} – {round.dates.resultsEndShort}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
