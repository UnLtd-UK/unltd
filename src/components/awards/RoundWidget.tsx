/**
 * RoundWidget Component (React)
 * Large widget showing round information + all rounds table
 *
 * Features:
 * - Current round status with countdown
 * - Capacity tracking (optional)
 * - Timeline dates grid
 * - All rounds table with status badges
 */

import { useMemo } from "react";
import Icon from "./Icon";
import CountdownCard from "./CountdownCard";
import { useCountdown, getCurrentDateTime } from "./useCountdown";

// Types for processed round data from server
interface ProcessedRound {
    id: number;
    opensDate: string;
    closesDate: string;
    assessmentStart: string;
    assessmentEnd: string;
    resultsStart: string;
    resultsEnd: string;
    hasCapacity: boolean;
    capacityPercentage: number;
    isOpen: boolean;
    isUpcoming: boolean;
    isInAssessment: boolean;
    isInResults: boolean;
    isCompleted: boolean;
    phase: string;
    dates: {
        opens: string;
        opensShort: string;
        closes: string;
        closesShort: string;
        assessmentStartShort: string;
        assessmentEndShort: string;
        resultsStart: string;
        resultsStartShort: string;
        resultsEnd: string;
        resultsEndShort: string;
    };
    timing?: {
        daysRemaining: number;
        daysUntilOpen: number;
    };
    phaseInfo?: {
        shortLabel: string;
        description: string;
        indicatorClass: string;
    };
}

interface RoundWidgetProps {
    /** All rounds (processed server-side) */
    rounds: ProcessedRound[];
    /** Current/active round */
    currentRound?: ProcessedRound | null;
    /** Next upcoming round */
    nextRound?: ProcessedRound | null;
    /** Dev datetime override for testing (ISO string) */
    devDateTime?: string;
}

type RoundStatus = "open" | "upcoming" | "assessing" | "results" | "completed" | "no-rounds";

/**
 * Get round name based on results dates
 */
function getRoundName(round: ProcessedRound | null | undefined): string {
    if (!round?.resultsStart) return "Application Round";

    const resultsStart = new Date(round.resultsStart);
    const resultsEnd = new Date(round.resultsEnd);
    const startMonth = resultsStart.toLocaleDateString("en-GB", { month: "long" });
    const endMonth = resultsEnd.toLocaleDateString("en-GB", { month: "long" });
    const year = resultsStart.getFullYear();

    if (startMonth === endMonth) {
        return `${startMonth} ${year}`;
    }
    return `${startMonth}–${endMonth} ${year}`;
}

/**
 * Format time from ISO date string (24-hour clock)
 */
function formatTime(isoString: string): string {
    const date = new Date(isoString);
    return date.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
}

/**
 * Get status badge styling
 */
function getStatusBadgeClass(round: ProcessedRound): string {
    if (round.isUpcoming) return "bg-indigo-500/80 text-white border border-indigo-400/50";
    if (round.isOpen) return "bg-emerald-500/80 text-white border border-emerald-400/50";
    if (round.phase === "closed") return "bg-slate-600/80 text-white border border-slate-500/50";
    if (round.isInAssessment) return "bg-amber-500/80 text-white border border-amber-400/50";
    if (round.phase === "awaiting-results") return "bg-sky-500/80 text-white border border-sky-400/50";
    if (round.isInResults) return "bg-violet-500/80 text-white border border-violet-400/50";
    if (round.phase === "completed") return "bg-slate-600/80 text-white border border-slate-500/50";
    return "bg-slate-500/80 text-white border border-slate-400/50";
}

/**
 * Get status label
 */
function getStatusLabel(round: ProcessedRound): string {
    if (round.isUpcoming) return "Coming soon";
    if (round.isOpen) return "Open now";
    if (round.phase === "closed") return "Closed";
    if (round.isInAssessment) return "Assessing";
    if (round.phase === "awaiting-results") return "Assessments complete";
    if (round.isInResults) return "Emailing results";
    if (round.phase === "completed") return "Complete";
    return round.phaseInfo?.shortLabel || "Unknown";
}

// Capacity progress thresholds
const PROGRESS_THRESHOLDS = [20, 40, 60, 80, 100];

export default function RoundWidget({
    rounds,
    currentRound,
    nextRound,
    devDateTime,
}: RoundWidgetProps) {
    // Determine which round to display and its status
    const { displayRound, status } = useMemo(() => {
        if (!rounds || rounds.length === 0) {
            return { displayRound: null, status: "no-rounds" as RoundStatus };
        }

        if (!currentRound && !nextRound) {
            return { displayRound: null, status: "no-rounds" as RoundStatus };
        }

        const currentTime = getCurrentDateTime(devDateTime);

        if (currentRound) {
            const opens = new Date(currentRound.opensDate);
            const closes = new Date(currentRound.closesDate);
            const resultsStart = new Date(currentRound.resultsStart);
            const resultsEnd = new Date(currentRound.resultsEnd);

            if (currentTime < opens) {
                return { displayRound: currentRound, status: "upcoming" as RoundStatus };
            }
            if (currentTime >= opens && currentTime <= closes) {
                if (currentRound.hasCapacity && currentRound.capacityPercentage >= 100) {
                    if (nextRound) {
                        return { displayRound: nextRound, status: "upcoming" as RoundStatus };
                    }
                }
                return { displayRound: currentRound, status: "open" as RoundStatus };
            }
            if (currentTime > closes && currentTime < resultsEnd) {
                if (currentTime >= resultsStart) {
                    return { displayRound: currentRound, status: "results" as RoundStatus };
                }
                return { displayRound: currentRound, status: "assessing" as RoundStatus };
            }
            if (nextRound) {
                return { displayRound: nextRound, status: "upcoming" as RoundStatus };
            }
            return { displayRound: currentRound, status: "completed" as RoundStatus };
        }

        if (nextRound) {
            return { displayRound: nextRound, status: "upcoming" as RoundStatus };
        }

        return { displayRound: null, status: "no-rounds" as RoundStatus };
    }, [rounds, currentRound, nextRound, devDateTime]);

    // Countdowns for display
    const closesCountdown = useCountdown({
        targetDateTime: displayRound?.closesDate || new Date().toISOString(),
        devDateTime,
        live: status === "open",
    });

    const opensCountdown = useCountdown({
        targetDateTime: displayRound?.opensDate || new Date().toISOString(),
        devDateTime,
        live: status === "upcoming",
    });

    const roundName = getRoundName(displayRound);
    const hasCapacity = displayRound?.hasCapacity ?? false;
    const capacityPercentage = displayRound?.capacityPercentage ?? 0;

    // Urgency calculations
    const isDeadlineCritical = status === "open" && closesCountdown.urgency === "critical";
    const isDeadlineWarning = status === "open" && closesCountdown.urgency === "warning";

    // Row styling for table
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
        <div className="flex flex-col gap-8">
            {/* Header */}
            <div className="text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-violet-900 dark:text-violet-100 mb-4">
                    When to apply
                </h2>
                <p className="text-lg text-violet-700 dark:text-violet-300 max-w-2xl mx-auto">
                    Applications to our Awards open in set application rounds throughout
                    the year. Each round has clear opening and closing dates, followed
                    by an assessment period and results timeline.
                </p>
            </div>

            {/* Main content card */}
            <div id="when-to-apply" className="bg-violet-950 text-white rounded-2xl p-8">
                <div className="flex flex-col gap-6">
                    {/* Top section: Round info + Countdown card */}
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        {/* Left: Round info */}
                        <div className="flex-1">
                            <h3 className="text-2xl font-bold mb-2">
                                {roundName} Application Round
                            </h3>

                            <p className="text-violet-300">
                                {status === "no-rounds" ? (
                                    <>There are currently no application rounds scheduled. Check back soon for updates.</>
                                ) : status === "open" ? (
                                    <>
                                        We're accepting applications until{" "}
                                        <strong className="text-white">{displayRound?.dates?.closes}</strong>{" "}
                                        or until we reach capacity, whichever comes first.
                                        {closesCountdown.totalDays > 0 && (
                                            <>
                                                {" "}You have{" "}
                                                <strong className="text-white">
                                                    {closesCountdown.totalDays} {closesCountdown.totalDays === 1 ? "day" : "days"}
                                                </strong>{" "}
                                                left to apply. We have four application rounds each year. Each round has clear application opening and closing dates, followed by an assessment period and results timeline.
                                            </>
                                        )}
                                        {closesCountdown.totalDays === 0 && !closesCountdown.isExpired && (
                                            <> <strong className="text-white">Last day to apply!</strong></>
                                        )}
                                    </>
                                ) : status === "upcoming" ? (
                                    <>
                                        Applications open{" "}
                                        <strong className="text-white">{displayRound?.dates?.opens}</strong>.
                                        {opensCountdown.totalDays > 0 && (
                                            <>
                                                {" "}That's in{" "}
                                                <strong className="text-white">
                                                    {opensCountdown.totalDays} {opensCountdown.totalDays === 1 ? "day" : "days"}
                                                </strong>.
                                            </>
                                        )}
                                    </>
                                ) : status === "assessing" ? (
                                    <>
                                        Applications are being assessed. Results will be sent from{" "}
                                        <strong className="text-white">{displayRound?.dates?.resultsStart}</strong>.
                                        {nextRound && (
                                            <>
                                                {" "}The next application round opens{" "}
                                                <strong className="text-white">{nextRound.dates.opens}</strong>.
                                            </>
                                        )}
                                    </>
                                ) : status === "results" ? (
                                    <>
                                        We're sending out results until{" "}
                                        <strong className="text-white">{displayRound?.dates?.resultsEnd}</strong>.
                                        {nextRound && (
                                            <>
                                                {" "}The next application round opens{" "}
                                                <strong className="text-white">{nextRound.dates.opens}</strong>.
                                            </>
                                        )}
                                    </>
                                ) : status === "completed" ? (
                                    <>
                                        This round has completed.
                                        {nextRound ? (
                                            <>
                                                {" "}The next application round opens{" "}
                                                <strong className="text-white">{nextRound.dates.opens}</strong>.
                                            </>
                                        ) : (
                                            <> No upcoming rounds are currently scheduled.</>
                                        )}
                                    </>
                                ) : (
                                    <>{displayRound?.phaseInfo?.description ?? "Check back for updates."}</>
                                )}
                            </p>
                        </div>

                        {/* Right: Countdown/Status card */}
                        <div className="lg:w-72 shrink-0">
                            {status === "open" ? (
                                <CountdownCard
                                    targetDateTime={displayRound?.closesDate || ""}
                                    devDateTime={devDateTime}
                                    title="Closes in"
                                    isOpening={false}
                                />
                            ) : status === "upcoming" ? (
                                <CountdownCard
                                    targetDateTime={displayRound?.opensDate || ""}
                                    devDateTime={devDateTime}
                                    title="Opens in"
                                    isOpening={true}
                                />
                            ) : status === "assessing" ? (
                                <div className="rounded-xl p-4 bg-amber-500/20 border border-amber-400/30">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="h-3 w-3 rounded-full bg-amber-400 animate-pulse" />
                                        <span className="text-sm font-semibold text-amber-300">In Assessment</span>
                                    </div>
                                    <p className="text-sm text-amber-200">
                                        Results from <strong className="text-white">{displayRound?.dates?.resultsStart}</strong>
                                    </p>
                                </div>
                            ) : status === "results" ? (
                                <div className="rounded-xl p-4 bg-purple-500/20 border border-purple-400/30">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="h-3 w-3 rounded-full bg-purple-400 animate-pulse" />
                                        <span className="text-sm font-semibold text-purple-300">Sending Results</span>
                                    </div>
                                    <p className="text-sm text-purple-200">
                                        Until <strong className="text-white">{displayRound?.dates?.resultsEnd}</strong>
                                    </p>
                                </div>
                            ) : status === "completed" ? (
                                <div className="rounded-xl p-4 bg-slate-500/20 border border-slate-400/30">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="h-3 w-3 rounded-full bg-slate-400" />
                                        <span className="text-sm font-semibold text-slate-300">Round Complete</span>
                                    </div>
                                    <p className="text-sm text-slate-200">
                                        {nextRound ? (
                                            <>Next round opens <strong className="text-white">{nextRound.dates.opens}</strong></>
                                        ) : (
                                            <>No upcoming rounds scheduled</>
                                        )}
                                    </p>
                                </div>
                            ) : (
                                <div className="rounded-xl p-4 bg-slate-500/20 border border-slate-400/30">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="h-3 w-3 rounded-full bg-slate-400" />
                                        <span className="text-sm font-semibold text-slate-300">No rounds scheduled</span>
                                    </div>
                                    <p className="text-sm text-slate-200">Check back soon for updates.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Capacity bar (only for open rounds with capacity tracking) */}
                    {status === "open" && hasCapacity && (
                        <div className="max-w-md">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-violet-400">Round Capacity</span>
                                <span className={`text-sm font-semibold ${capacityPercentage >= 80 ? "text-red-400" :
                                    capacityPercentage >= 60 ? "text-amber-400" :
                                        "text-emerald-400"
                                    }`}>
                                    {capacityPercentage}% filled
                                </span>
                            </div>
                            <div className="flex gap-1">
                                {PROGRESS_THRESHOLDS.map((threshold) => (
                                    <div
                                        key={threshold}
                                        className={`h-2 flex-1 rounded-sm ${capacityPercentage >= threshold
                                            ? threshold <= 40 ? "bg-emerald-400"
                                                : threshold <= 60 ? "bg-amber-400"
                                                    : "bg-red-400"
                                            : "bg-white/20"
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Timeline dates grid */}
                    {displayRound && (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mt-4">
                            <div className={`text-center px-3 py-4 rounded-lg border ${status === "open" || status === "upcoming"
                                ? "bg-violet-500/30 border-violet-400/30"
                                : "bg-white/5 border-white/10"
                                }`}>
                                <Icon name="calendar-day" style="solid" className="h-5 w-5 mx-auto mb-2 text-violet-300" />
                                <p className="text-violet-400 text-xs uppercase tracking-wide">Opens</p>
                                <p className="font-semibold text-sm mt-1">{displayRound.dates.opensShort}</p>
                                <p className="text-xs text-violet-400 mt-0.5">{formatTime(displayRound.opensDate)}</p>
                            </div>
                            <div className={`text-center px-3 py-4 rounded-lg ${status === "open" ? "bg-violet-500/30 border border-violet-400/30" : "bg-white/10"
                                }`}>
                                <Icon name="clock" style="regular" className="h-5 w-5 mx-auto mb-2 text-violet-300" />
                                <p className="text-violet-400 text-xs uppercase tracking-wide">Closes</p>
                                <p className="font-semibold text-sm mt-1">{displayRound.dates.closesShort}</p>
                                <p className="text-xs text-violet-400 mt-0.5">{formatTime(displayRound.closesDate)}</p>
                            </div>
                            <div className={`text-center px-3 py-4 rounded-lg ${status === "assessing" ? "bg-amber-500/20 border border-amber-400/30" : "bg-white/10"
                                }`}>
                                <Icon name="magnifying-glass-chart" style="solid" className="h-5 w-5 mx-auto mb-2 text-violet-300" />
                                <p className="text-violet-400 text-xs uppercase tracking-wide">Assessment Starts</p>
                                <p className="font-semibold text-sm mt-1">{displayRound.dates.assessmentStartShort}</p>
                                <p className="text-xs text-violet-400 mt-0.5">{formatTime(displayRound.assessmentStart)}</p>
                            </div>
                            <div className={`text-center px-3 py-4 rounded-lg ${status === "assessing" ? "bg-amber-500/20 border border-amber-400/30" : "bg-white/10"
                                }`}>
                                <Icon name="clipboard-check" style="solid" className="h-5 w-5 mx-auto mb-2 text-violet-300" />
                                <p className="text-violet-400 text-xs uppercase tracking-wide">Assessment Ends</p>
                                <p className="font-semibold text-sm mt-1">{displayRound.dates.assessmentEndShort}</p>
                                <p className="text-xs text-violet-400 mt-0.5">{formatTime(displayRound.assessmentEnd)}</p>
                            </div>
                            <div className={`text-center px-3 py-4 rounded-lg ${status === "results" ? "bg-purple-500/20 border border-purple-400/30" : "bg-white/10"
                                }`}>
                                <Icon name="envelope" style="regular" className="h-5 w-5 mx-auto mb-2 text-violet-300" />
                                <p className="text-violet-400 text-xs uppercase tracking-wide">Results Start</p>
                                <p className="font-semibold text-sm mt-1">{displayRound.dates.resultsStartShort}</p>
                                <p className="text-xs text-violet-400 mt-0.5">{formatTime(displayRound.resultsStart)}</p>
                            </div>
                            <div className={`text-center px-3 py-4 rounded-lg ${status === "results" ? "bg-purple-500/20 border border-purple-400/30" : "bg-white/10"
                                }`}>
                                <Icon name="circle-check" style="regular" className="h-5 w-5 mx-auto mb-2 text-violet-300" />
                                <p className="text-violet-400 text-xs uppercase tracking-wide">Results End</p>
                                <p className="font-semibold text-sm mt-1">{displayRound.dates.resultsEndShort}</p>
                                <p className="text-xs text-violet-400 mt-0.5">{formatTime(displayRound.resultsEnd)}</p>
                            </div>
                        </div>
                    )}

                    {/* All Rounds Table */}
                    {rounds.length > 1 && (
                        <div className="mt-6 pt-6 border-t border-violet-700/50">
                            <h4 className="text-lg font-semibold mb-4 text-violet-100 flex items-center">
                                <Icon name="calendar-days" style="solid" className="mr-2 text-violet-300" />
                                All Application Rounds
                            </h4>
                            <div className="overflow-x-auto -mx-2">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-violet-700/50">
                                            <th className="text-left py-3 px-2 font-semibold text-violet-300 text-xs uppercase tracking-wide">Status</th>
                                            <th className="text-left py-3 px-2 font-semibold text-violet-300 text-xs uppercase tracking-wide">Opens</th>
                                            <th className="text-left py-3 px-2 font-semibold text-violet-300 text-xs uppercase tracking-wide">Closes</th>
                                            <th className="text-left py-3 px-2 font-semibold text-violet-300 text-xs uppercase tracking-wide hidden md:table-cell">Assessment</th>
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
                                                    {round.dates.resultsStartShort} – {round.dates.resultsEndShort}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
