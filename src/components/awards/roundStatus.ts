/**
 * Round Status Utility (Static / Build-time)
 *
 * Pure-function equivalent of useRoundStatus + useCountdown.
 * Computes the same 4 display states at build time — no React, no hooks.
 *
 * States:
 * 1. Closed   — No present or future rounds (or at full capacity)
 * 2. Opening  — No present round but a future round exists
 * 3. Open     — Present round is accepting applications
 * 4. Closing  — Present round closes within 7 days
 *
 * Rebuilt every ~2 hours via GitHub Actions so values stay current.
 */

import type { ProcessedRound } from "./useRoundStatus";

// ─── Types ──────────────────────────────────────────────────────────────────

export type RoundState = "closed" | "opening" | "open" | "closing";
export type UrgencyLevel = "critical" | "warning" | "normal";

export interface CountdownState {
    weeks: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    totalHours: number;
    totalDays: number;
    isExpired: boolean;
    urgency: UrgencyLevel;
    remainingMs: number;
}

export interface RoundStatusResult {
    state: RoundState;
    label: string;
    dateText: string;
    urgency: UrgencyLevel;
    round: ProcessedRound | null;
    nextRound: ProcessedRound | null;
    closesCountdown: CountdownState;
    opensCountdown: CountdownState;
    roundName: string;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

function getUrgency(totalHours: number): UrgencyLevel {
    if (totalHours <= 48) return "critical";
    if (totalHours <= 168) return "warning";
    return "normal";
}

function calculateCountdown(remainingMs: number): CountdownState {
    if (remainingMs <= 0) {
        return {
            weeks: 0, days: 0, hours: 0, minutes: 0, seconds: 0,
            totalHours: 0, totalDays: 0,
            isExpired: true, urgency: "normal", remainingMs: 0,
        };
    }

    const totalSeconds = Math.floor(remainingMs / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = remainingMs / (1000 * 60 * 60);
    const totalDays = Math.floor(totalHours / 24);
    const weeks = Math.floor(totalDays / 7);

    return {
        weeks,
        days: totalDays % 7,
        hours: Math.floor(totalHours) % 24,
        minutes: totalMinutes % 60,
        seconds: totalSeconds % 60,
        totalHours,
        totalDays,
        isExpired: false,
        urgency: getUrgency(totalHours),
        remainingMs,
    };
}

/** Round display name from results dates, e.g. "March 2026" or "March–April 2026" */
export function getRoundName(round: ProcessedRound | null | undefined): string {
    if (!round?.resultsStart) return "Application Round";

    const resultsStart = new Date(round.resultsStart);
    const resultsEnd = new Date(round.resultsEnd);
    const startMonth = resultsStart.toLocaleDateString("en-GB", { month: "long" });
    const endMonth = resultsEnd.toLocaleDateString("en-GB", { month: "long" });
    const year = resultsStart.getFullYear();

    if (startMonth === endMonth) return `${startMonth} ${year}`;
    return `${startMonth}–${endMonth} ${year}`;
}

/** Format time from ISO string (24-hour clock) */
export function formatTime(isoString: string): string {
    const date = new Date(isoString);
    return date.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
}

// ─── Main function ──────────────────────────────────────────────────────────

interface GetRoundStatusOptions {
    currentRound?: ProcessedRound | null;
    nextRound?: ProcessedRound | null;
    devDateTime?: string;
}

/**
 * Compute round status at build time — pure function, no hooks.
 */
export function getRoundStatus({
    currentRound,
    nextRound,
    devDateTime,
}: GetRoundStatusOptions): RoundStatusResult {
    const now = devDateTime ? new Date(devDateTime) : new Date();

    // ── Determine display round & state ─────────────────────────────────

    let displayRound: ProcessedRound | null = null;
    let state: RoundState = "closed";
    let relevantDate = "";

    if (!currentRound && !nextRound) {
        // No rounds at all
    } else if (currentRound) {
        const opens = new Date(currentRound.opensDate);
        const closes = new Date(currentRound.closesDate);

        if (now < opens) {
            displayRound = currentRound;
            state = "opening";
            relevantDate = currentRound.dates.opens;
        } else if (now >= opens && now <= closes) {
            // Full capacity → closed (or fall to next)
            if (currentRound.hasCapacity && currentRound.capacityPercentage >= 100) {
                if (nextRound) {
                    displayRound = nextRound;
                    state = "opening";
                    relevantDate = nextRound.dates.opens;
                } else {
                    displayRound = currentRound;
                    state = "closed";
                }
            } else {
                const msRemaining = closes.getTime() - now.getTime();
                displayRound = currentRound;
                state = msRemaining <= SEVEN_DAYS_MS ? "closing" : "open";
                relevantDate = currentRound.dates.closes;
            }
        } else {
            // Past close date
            if (nextRound) {
                displayRound = nextRound;
                state = "opening";
                relevantDate = nextRound.dates.opens;
            } else {
                displayRound = currentRound;
                state = "closed";
            }
        }
    } else if (nextRound) {
        displayRound = nextRound;
        state = "opening";
        relevantDate = nextRound.dates.opens;
    }

    // ── Countdowns (static snapshot) ────────────────────────────────────

    const closesCountdown = calculateCountdown(
        displayRound ? new Date(displayRound.closesDate).getTime() - now.getTime() : 0,
    );

    const opensCountdown = calculateCountdown(
        displayRound ? new Date(displayRound.opensDate).getTime() - now.getTime() : 0,
    );

    // ── Label & urgency ─────────────────────────────────────────────────

    let label = "";
    let dateText = "";
    let urgency: UrgencyLevel = "normal";

    switch (state) {
        case "closed":
            label = "Applications closed";
            break;
        case "opening":
            label = `Applications open ${relevantDate}`;
            dateText = relevantDate;
            break;
        case "open":
            label = `Apply now — closes ${relevantDate}`;
            dateText = relevantDate;
            urgency = closesCountdown.urgency;
            break;
        case "closing":
            label = `Closing on ${relevantDate}`;
            dateText = relevantDate;
            urgency = closesCountdown.urgency;
            break;
    }

    return {
        state,
        label,
        dateText,
        urgency,
        round: displayRound,
        nextRound: nextRound ?? null,
        closesCountdown,
        opensCountdown,
        roundName: getRoundName(displayRound),
    };
}
