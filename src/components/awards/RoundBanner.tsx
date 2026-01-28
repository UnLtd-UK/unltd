/**
 * RoundBanner Component (React)
 * Full-width banner showing application round status
 * Returns null when no rounds exist
 *
 * States:
 * - No rounds: returns null (hidden)
 * - Future round: countdown to opening
 * - Open round: shows deadline, capacity, countdown when critical
 * - Closed/Assessing/Results: shows status info
 */

import { useMemo } from "react";
import Icon from "./Icon";
import CountdownText from "./CountdownText";
import { useCountdown, getCurrentDateTime } from "./useCountdown";

// Types for processed round data from server
interface ProcessedRound {
    id: number;
    opensDate: string;
    closesDate: string;
    resultsStart: string;
    resultsEnd: string;
    hasCapacity: boolean;
    capacityPercentage: number;
    isOpen: boolean;
    isUpcoming: boolean;
    isInAssessment: boolean;
    isInResults: boolean;
    isCompleted: boolean;
    dates: {
        opens: string;
        closes: string;
        resultsStart: string;
        resultsEnd: string;
    };
}

interface RoundBannerProps {
    /** Current/active round (processed server-side) */
    round?: ProcessedRound | null;
    /** Next upcoming round if current is closed */
    nextRound?: ProcessedRound | null;
    /** Dev datetime override for testing (ISO string) */
    devDateTime?: string;
    /** URL for eligibility checker */
    eligibilityUrl?: string;
    /** URL for awards page */
    awardsUrl?: string;
}

type RoundStatus = "open" | "upcoming" | "assessing" | "results" | "completed" | "no-rounds";
type UrgencyLevel = "critical" | "warning" | "normal";

// Capacity bar segments
const CAPACITY_SEGMENTS = [20, 40, 60, 80, 100];

/**
 * Get capacity urgency based on percentage
 */
function getCapacityUrgency(percentage: number): UrgencyLevel {
    if (percentage >= 80) return "critical";
    if (percentage >= 60) return "warning";
    return "normal";
}

/**
 * Get round name based on results dates
 */
function getRoundName(round: ProcessedRound): string {
    if (!round.resultsStart) return "Application Round";

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

export default function RoundBanner({
    round,
    nextRound,
    devDateTime,
    eligibilityUrl = "/awards#eligibility-checker",
    awardsUrl = "/awards",
}: RoundBannerProps) {
    // Determine which round to display and its status
    const { displayRound, status } = useMemo(() => {
        if (!round && !nextRound) {
            return { displayRound: null, status: "no-rounds" as RoundStatus };
        }

        const currentTime = getCurrentDateTime(devDateTime);

        // Check round phases based on current time
        if (round) {
            const opens = new Date(round.opensDate);
            const closes = new Date(round.closesDate);
            const resultsStart = new Date(round.resultsStart);
            const resultsEnd = new Date(round.resultsEnd);

            if (currentTime < opens) {
                return { displayRound: round, status: "upcoming" as RoundStatus };
            }
            if (currentTime >= opens && currentTime <= closes) {
                // Check if at capacity
                if (round.hasCapacity && round.capacityPercentage >= 100) {
                    // At capacity - show next round if available
                    if (nextRound) {
                        return { displayRound: nextRound, status: "upcoming" as RoundStatus };
                    }
                }
                return { displayRound: round, status: "open" as RoundStatus };
            }
            if (currentTime > closes && currentTime < resultsEnd) {
                // In assessment or results phase
                if (currentTime >= resultsStart) {
                    return { displayRound: round, status: "results" as RoundStatus };
                }
                return { displayRound: round, status: "assessing" as RoundStatus };
            }
            // Round completed
            if (nextRound) {
                return { displayRound: nextRound, status: "upcoming" as RoundStatus };
            }
            return { displayRound: round, status: "completed" as RoundStatus };
        }

        if (nextRound) {
            return { displayRound: nextRound, status: "upcoming" as RoundStatus };
        }

        return { displayRound: null, status: "no-rounds" as RoundStatus };
    }, [round, nextRound, devDateTime]);

    // Get countdown for deadline/urgency calculations
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

    // Don't render if no rounds
    if (!displayRound || status === "no-rounds") {
        return null;
    }

    const roundName = getRoundName(displayRound);
    const isOpen = status === "open";
    const hasCapacity = displayRound.hasCapacity;
    const capacityPercentage = displayRound.capacityPercentage;
    const capacityUrgency = hasCapacity ? getCapacityUrgency(capacityPercentage) : "normal";

    // Determine overall urgency (deadline OR capacity)
    const deadlineUrgency = isOpen ? closesCountdown.urgency : "normal";
    const showCriticalUrgency = deadlineUrgency === "critical" || (hasCapacity && capacityUrgency === "critical");
    const showWarningUrgency = deadlineUrgency === "warning" || (hasCapacity && capacityUrgency === "warning");

    // Status-based styling
    const getIndicatorBarColor = () => {
        if (isOpen) {
            if (showCriticalUrgency) return "bg-linear-to-r from-red-500 to-red-400";
            if (showWarningUrgency) return "bg-linear-to-r from-amber-500 to-amber-400";
            return "bg-linear-to-r from-emerald-500 to-emerald-400";
        }
        switch (status) {
            case "upcoming": return "bg-linear-to-r from-indigo-500 to-indigo-400";
            case "assessing": return "bg-linear-to-r from-amber-500 to-amber-400";
            case "results": return "bg-linear-to-r from-purple-500 to-purple-400";
            default: return "bg-linear-to-r from-slate-500 to-slate-400";
        }
    };

    const getIconStyles = () => {
        if (isOpen) {
            if (showCriticalUrgency) return { bg: "bg-red-500/20", color: "text-red-400" };
            if (showWarningUrgency) return { bg: "bg-amber-500/20", color: "text-amber-400" };
            return { bg: "bg-emerald-500/20", color: "text-emerald-400" };
        }
        switch (status) {
            case "upcoming": return { bg: "bg-indigo-500/20", color: "text-indigo-400" };
            case "assessing": return { bg: "bg-amber-500/20", color: "text-amber-400" };
            case "results": return { bg: "bg-purple-500/20", color: "text-purple-400" };
            default: return { bg: "bg-slate-500/20", color: "text-slate-400" };
        }
    };

    const getBadgeStyles = () => {
        if (isOpen) {
            if (showCriticalUrgency) return "bg-red-500/20 text-red-400 ring-red-500/30";
            if (showWarningUrgency) return "bg-amber-500/20 text-amber-400 ring-amber-500/30";
            return "bg-emerald-500/20 text-emerald-400 ring-emerald-500/30";
        }
        switch (status) {
            case "upcoming": return "bg-indigo-500/20 text-indigo-400 ring-indigo-500/30";
            case "assessing": return "bg-amber-500/20 text-amber-400 ring-amber-500/30";
            case "results": return "bg-purple-500/20 text-purple-400 ring-purple-500/30";
            default: return "bg-slate-500/20 text-slate-400 ring-slate-500/30";
        }
    };

    const getCtaStyles = () => {
        if (isOpen) {
            if (showCriticalUrgency) return "bg-red-500 hover:bg-red-400 text-white";
            if (showWarningUrgency) return "bg-amber-500 hover:bg-amber-400 text-white";
            return "bg-emerald-500 hover:bg-emerald-400 text-white";
        }
        switch (status) {
            case "upcoming": return "bg-indigo-500 hover:bg-indigo-400 text-white";
            case "assessing": return "bg-amber-500 hover:bg-amber-400 text-white";
            case "results": return "bg-purple-500 hover:bg-purple-400 text-white";
            default: return "bg-slate-500 hover:bg-slate-400 text-white";
        }
    };

    const getStatusIcon = () => {
        if (isOpen) return "door-open";
        switch (status) {
            case "upcoming": return "calendar-clock";
            case "assessing": return "magnifying-glass-chart";
            case "results": return "envelope";
            default: return "circle-check";
        }
    };

    const iconStyles = getIconStyles();

    return (
        <div className="relative overflow-hidden bg-linear-to-r from-violet-950 via-violet-900 to-violet-950 border-b border-violet-800/50">
            {/* Status indicator bar */}
            <div className={`absolute top-0 left-0 right-0 h-1 ${getIndicatorBarColor()}`} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Left: Status and round info */}
                    <div className="flex items-center gap-4">
                        {/* Icon */}
                        <div className={`hidden sm:flex h-10 w-10 items-center justify-center rounded-lg ${iconStyles.bg} shrink-0`}>
                            <Icon name={getStatusIcon()} style="solid" className={iconStyles.color} />
                        </div>

                        <div>
                            <div className="flex items-center gap-3 flex-wrap">
                                <h3 className="text-base font-semibold text-white">
                                    {roundName} Round
                                </h3>
                                {/* Status badge */}
                                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${getBadgeStyles()}`}>
                                    {isOpen ? (
                                        <>
                                            <span className="relative flex h-1.5 w-1.5">
                                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-75" />
                                                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
                                            </span>
                                            Open
                                        </>
                                    ) : status === "upcoming" ? (
                                        <>
                                            <Icon name="clock" style="regular" className="text-[10px]" />
                                            Coming soon
                                        </>
                                    ) : status === "assessing" ? (
                                        <>
                                            <Icon name="spinner" style="solid" className="text-[10px]" />
                                            Assessing
                                        </>
                                    ) : status === "results" ? (
                                        <>
                                            <Icon name="envelope" style="regular" className="text-[10px]" />
                                            Sending results
                                        </>
                                    ) : (
                                        <>
                                            <Icon name="circle-check" style="regular" className="text-[10px]" />
                                            Complete
                                        </>
                                    )}
                                </span>
                            </div>

                            {/* Subtitle based on status */}
                            <p className="text-sm text-violet-300 mt-0.5">
                                {isOpen ? (
                                    <>
                                        Closes <span className="font-medium text-white">{displayRound.dates.closes}</span>
                                        {closesCountdown.totalDays > 0 && (
                                            <span className="text-violet-400 ml-1">
                                                ({closesCountdown.totalDays} {closesCountdown.totalDays === 1 ? "day" : "days"} left)
                                            </span>
                                        )}
                                    </>
                                ) : status === "upcoming" ? (
                                    <>
                                        Opens <span className="font-medium text-white">{displayRound.dates.opens}</span>
                                        {opensCountdown.totalDays > 0 && (
                                            <span className="text-violet-400 ml-1">
                                                ({opensCountdown.totalDays} {opensCountdown.totalDays === 1 ? "day" : "days"})
                                            </span>
                                        )}
                                    </>
                                ) : status === "assessing" ? (
                                    <>
                                        Results from <span className="font-medium text-white">{displayRound.dates.resultsStart}</span>
                                    </>
                                ) : status === "results" ? (
                                    <>
                                        Results until <span className="font-medium text-white">{displayRound.dates.resultsEnd}</span>
                                    </>
                                ) : (
                                    <>No upcoming rounds scheduled</>
                                )}
                            </p>
                        </div>
                    </div>

                    {/* Center: Capacity and/or Countdown (when open) */}
                    {isOpen && (
                        <div className="flex items-center gap-4 lg:flex-1 lg:justify-center lg:max-w-md">
                            {/* Capacity bar - only when capacity tracking is enabled */}
                            {hasCapacity && (
                                <div className="flex-1 max-w-48">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs text-violet-400">Capacity</span>
                                        <span className={`text-xs font-semibold ${capacityUrgency === "critical" ? "text-red-400" :
                                                capacityUrgency === "warning" ? "text-amber-400" :
                                                    "text-emerald-400"
                                            }`}>
                                            {capacityPercentage}% filled
                                        </span>
                                    </div>
                                    <div className="flex gap-0.5">
                                        {CAPACITY_SEGMENTS.map((threshold) => (
                                            <div
                                                key={threshold}
                                                className={`h-1.5 flex-1 rounded-full transition-all ${capacityPercentage >= threshold
                                                        ? threshold <= 40 ? "bg-emerald-400"
                                                            : threshold <= 60 ? "bg-amber-400"
                                                                : "bg-red-400"
                                                        : "bg-white/10"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Countdown timer - shows within 48 hours */}
                            {closesCountdown.urgency === "critical" && (
                                <div className="shrink-0">
                                    <CountdownText
                                        targetDateTime={displayRound.closesDate}
                                        devDateTime={devDateTime}
                                        label="Closes in"
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {/* Right: CTA */}
                    <div className="flex items-center gap-3 shrink-0">
                        <a
                            href={eligibilityUrl}
                            className={`inline-flex items-center gap-2 px-4 py-2 font-semibold rounded-lg text-sm transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 ${getCtaStyles()}`}
                        >
                            <Icon name="clipboard-check" style="solid" className="text-xs" />
                            Check Eligibility
                        </a>

                        <a
                            href={awardsUrl}
                            className="hidden lg:inline-flex items-center gap-1.5 text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors"
                        >
                            View Awards
                            <Icon name="arrow-right" style="solid" className="text-xs" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
