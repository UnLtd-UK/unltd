/**
 * useRoundStatus Hook
 * Shared logic for determining application round state across all round components.
 *
 * Maps server-processed round data into 4 simple states:
 * 1. Closed   — No present or future rounds (or at full capacity)
 * 2. Opening  — No present round but a future round exists
 * 3. Open     — Present round is accepting applications
 * 4. Closing  — Present round closes within 7 days
 *
 * All 5 round-related components (Banner, Button, Table, Apply, Stage)
 * consume this hook as their single source of truth.
 */

import { useMemo } from "react";
import { useCountdown, getCurrentDateTime, type CountdownState } from "./useCountdown";

// ─── Types ──────────────────────────────────────────────────────────────────

/** The 4 possible display states for a round */
export type RoundState = "closed" | "opening" | "open" | "closing";

/** The lifecycle phase of a round (from server processing) */
export type RoundPhase =
    | "upcoming"
    | "open"
    | "closed"
    | "assessment"
    | "interview"
    | "awaiting-results"
    | "results"
    | "completed";

/** Urgency level for countdown display */
export type UrgencyLevel = "critical" | "warning" | "normal";

/** Serializable round data passed from Astro wrappers */
export interface ProcessedRound {
    id: number;
    opensDate: string;
    closesDate: string;
    assessmentStart: string;
    assessmentEnd: string;
    interviewStart: string | null;
    interviewEnd: string | null;
    resultsStart: string;
    resultsEnd: string;
    hasCapacity: boolean;
    capacityPercentage: number;
    isOpen: boolean;
    isUpcoming: boolean;
    isInAssessment: boolean;
    isInInterview: boolean;
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
        interviewStart: string | null;
        interviewStartShort: string | null;
        interviewEnd: string | null;
        interviewEndShort: string | null;
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
        label: string;
        shortLabel: string;
        description: string;
        indicatorClass: string;
        badgeClass: string;
        icon: string;
    };
}

/** Return value from useRoundStatus */
export interface RoundStatusResult {
    /** One of the 4 display states */
    state: RoundState;
    /** Human-readable status label (e.g. "Applications open", "Closing on 14 March") */
    label: string;
    /** The relevant date as formatted text */
    dateText: string;
    /** Current urgency level */
    urgency: UrgencyLevel;
    /** The round being displayed (may be current or next) */
    round: ProcessedRound | null;
    /** The next upcoming round (if different from displayed round) */
    nextRound: ProcessedRound | null;
    /** Countdown to closes (for open/closing states) */
    closesCountdown: CountdownState;
    /** Countdown to opens (for opening state) */
    opensCountdown: CountdownState;
    /** Round display name (e.g. "March–April 2026") */
    roundName: string;
}

interface UseRoundStatusOptions {
    /** Current/active round from server processing */
    currentRound?: ProcessedRound | null;
    /** Next upcoming round */
    nextRound?: ProcessedRound | null;
    /** Dev datetime override for testing */
    devDateTime?: string;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Get round display name based on results dates.
 * e.g. "March 2026" or "March–April 2026"
 */
export function getRoundName(round: ProcessedRound | null | undefined): string {
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
export function formatTime(isoString: string): string {
    const date = new Date(isoString);
    return date.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
}

// ─── Hook ───────────────────────────────────────────────────────────────────

/**
 * useRoundStatus — single source of truth for round state.
 *
 * @example
 * ```tsx
 * const { state, label, dateText, round, closesCountdown } = useRoundStatus({
 *   currentRound: roundData,
 *   nextRound: nextRoundData,
 *   devDateTime,
 * });
 *
 * if (state === "closed") return <ClosedBanner />;
 * if (state === "closing") return <UrgentBanner countdown={closesCountdown} />;
 * ```
 */
export function useRoundStatus({
    currentRound,
    nextRound,
    devDateTime,
}: UseRoundStatusOptions): RoundStatusResult {
    // Determine which round to display and its state
    const { displayRound, state, relevantDate } = useMemo(() => {
        const now = getCurrentDateTime(devDateTime);

        // No rounds at all
        if (!currentRound && !nextRound) {
            return {
                displayRound: null,
                state: "closed" as RoundState,
                relevantDate: "",
            };
        }

        // Check current round
        if (currentRound) {
            const opens = new Date(currentRound.opensDate);
            const closes = new Date(currentRound.closesDate);

            // Before opening → check if this is a future round
            if (now < opens) {
                return {
                    displayRound: currentRound,
                    state: "opening" as RoundState,
                    relevantDate: currentRound.dates.opens,
                };
            }

            // Within open window
            if (now >= opens && now <= closes) {
                // Full capacity = closed
                if (currentRound.hasCapacity && currentRound.capacityPercentage >= 100) {
                    if (nextRound) {
                        return {
                            displayRound: nextRound,
                            state: "opening" as RoundState,
                            relevantDate: nextRound.dates.opens,
                        };
                    }
                    return {
                        displayRound: currentRound,
                        state: "closed" as RoundState,
                        relevantDate: "",
                    };
                }

                // Check if closing within 7 days
                const msRemaining = closes.getTime() - now.getTime();
                if (msRemaining <= SEVEN_DAYS_MS) {
                    return {
                        displayRound: currentRound,
                        state: "closing" as RoundState,
                        relevantDate: currentRound.dates.closes,
                    };
                }

                return {
                    displayRound: currentRound,
                    state: "open" as RoundState,
                    relevantDate: currentRound.dates.closes,
                };
            }

            // Past close date — fall through to next round
            if (nextRound) {
                return {
                    displayRound: nextRound,
                    state: "opening" as RoundState,
                    relevantDate: nextRound.dates.opens,
                };
            }

            return {
                displayRound: currentRound,
                state: "closed" as RoundState,
                relevantDate: "",
            };
        }

        // Only next round exists
        if (nextRound) {
            return {
                displayRound: nextRound,
                state: "opening" as RoundState,
                relevantDate: nextRound.dates.opens,
            };
        }

        return {
            displayRound: null,
            state: "closed" as RoundState,
            relevantDate: "",
        };
    }, [currentRound, nextRound, devDateTime]);

    // Live countdown to closing deadline
    const closesCountdown = useCountdown({
        targetDateTime: displayRound?.closesDate || new Date().toISOString(),
        devDateTime,
        live: state === "open" || state === "closing",
    });

    // Live countdown to opening
    const opensCountdown = useCountdown({
        targetDateTime: displayRound?.opensDate || new Date().toISOString(),
        devDateTime,
        live: state === "opening",
    });

    // Derive label and urgency from state
    const { label, dateText, urgency } = useMemo(() => {
        switch (state) {
            case "closed":
                return {
                    label: "Applications closed",
                    dateText: "",
                    urgency: "normal" as UrgencyLevel,
                };
            case "opening":
                return {
                    label: `Applications open ${relevantDate}`,
                    dateText: relevantDate,
                    urgency: "normal" as UrgencyLevel,
                };
            case "open":
                return {
                    label: `Apply now — closes ${relevantDate}`,
                    dateText: relevantDate,
                    urgency: closesCountdown.urgency,
                };
            case "closing":
                return {
                    label: `Closing on ${relevantDate}`,
                    dateText: relevantDate,
                    urgency: closesCountdown.urgency,
                };
            default:
                return {
                    label: "",
                    dateText: "",
                    urgency: "normal" as UrgencyLevel,
                };
        }
    }, [state, relevantDate, closesCountdown.urgency]);

    const roundName = getRoundName(displayRound);

    return {
        state,
        label,
        dateText,
        urgency,
        round: displayRound,
        nextRound: state === "opening" && displayRound?.id !== nextRound?.id ? nextRound ?? null : nextRound ?? null,
        closesCountdown,
        opensCountdown,
        roundName,
    };
}

export default useRoundStatus;
