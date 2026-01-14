/**
 * useCountdown Hook
 * Shared countdown logic for all round-related components
 *
 * Features:
 * - Real-time countdown updates every second
 * - DEV_DATETIME support for testing
 * - Urgency levels: 'critical' (<48hrs), 'warning' (<7 days), 'normal'
 * - Returns weeks, days, hours, minutes, seconds breakdown
 */

import { useState, useEffect, useRef, useMemo } from "react";

export type UrgencyLevel = "critical" | "warning" | "normal";

export interface CountdownState {
    /** Total weeks remaining */
    weeks: number;
    /** Days remaining after weeks (0-6) */
    days: number;
    /** Hours remaining after days (0-23) */
    hours: number;
    /** Minutes remaining after hours (0-59) */
    minutes: number;
    /** Seconds remaining after minutes (0-59) */
    seconds: number;
    /** Total hours remaining (for urgency calculations) */
    totalHours: number;
    /** Total days remaining */
    totalDays: number;
    /** Whether the countdown has expired */
    isExpired: boolean;
    /** Urgency level based on time remaining */
    urgency: UrgencyLevel;
    /** Raw milliseconds remaining */
    remainingMs: number;
}

interface UseCountdownOptions {
    /** Target date/time to count down to (ISO string) */
    targetDateTime: string;
    /** Optional dev datetime override (ISO string) - simulates current time */
    devDateTime?: string;
    /** Whether to update every second (default: true) */
    live?: boolean;
}

/**
 * Calculate urgency level based on hours remaining
 */
function getUrgency(totalHours: number): UrgencyLevel {
    if (totalHours <= 48) return "critical";
    if (totalHours <= 168) return "warning"; // 7 days = 168 hours
    return "normal";
}

/**
 * Calculate countdown state from milliseconds remaining
 */
function calculateState(remainingMs: number): CountdownState {
    if (remainingMs <= 0) {
        return {
            weeks: 0,
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            totalHours: 0,
            totalDays: 0,
            isExpired: true,
            urgency: "normal",
            remainingMs: 0,
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

/**
 * useCountdown Hook
 *
 * @param options - Configuration object
 * @returns CountdownState with all time breakdown values
 *
 * @example
 * ```tsx
 * const countdown = useCountdown({
 *   targetDateTime: "2026-03-15T17:00:00",
 *   devDateTime: import.meta.env.DEV_DATETIME
 * });
 *
 * if (countdown.isExpired) return <div>Closed</div>;
 * if (countdown.urgency === 'critical') return <LiveTimer {...countdown} />;
 * return <div>{countdown.totalDays} days left</div>;
 * ```
 */
export function useCountdown({
    targetDateTime,
    devDateTime,
    live = true,
}: UseCountdownOptions): CountdownState {
    // Store mount time for dev datetime offset calculation
    const mountTimeRef = useRef(Date.now());

    // Parse target time once
    const targetTime = useMemo(
        () => new Date(targetDateTime).getTime(),
        [targetDateTime]
    );

    // Parse base time (dev datetime or null for real time)
    const baseTime = useMemo(
        () => (devDateTime ? new Date(devDateTime).getTime() : null),
        [devDateTime]
    );

    // Calculate current simulated/real time
    const getCurrentTime = () => {
        if (baseTime) {
            // Dev mode: start from devDateTime, add elapsed real time since mount
            const elapsedSinceMount = Date.now() - mountTimeRef.current;
            return baseTime + elapsedSinceMount;
        }
        return Date.now();
    };

    // Initial state calculation
    const [state, setState] = useState<CountdownState>(() => {
        const now = getCurrentTime();
        return calculateState(targetTime - now);
    });

    useEffect(() => {
        if (!live) return;

        const updateCountdown = () => {
            const now = getCurrentTime();
            const newState = calculateState(targetTime - now);
            setState(newState);

            if (newState.isExpired) {
                clearInterval(timer);
            }
        };

        // Update immediately
        updateCountdown();

        // Update every second
        const timer = setInterval(updateCountdown, 1000);

        return () => clearInterval(timer);
    }, [targetTime, baseTime, live]);

    return state;
}

/**
 * Get the current datetime, respecting devDateTime if provided
 * Useful for determining round status outside of countdown display
 */
export function getCurrentDateTime(devDateTime?: string): Date {
    if (devDateTime) {
        return new Date(devDateTime);
    }
    return new Date();
}

export default useCountdown;
