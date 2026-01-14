/**
 * CountdownCard Component
 * Large visual countdown card for RoundWidget
 *
 * Displays days/hours/minutes/seconds in styled boxes
 * with urgency-based coloring (red/amber/green)
 */

import { useCountdown, type UrgencyLevel } from "./useCountdown";
import Icon from "./Icon";

interface CountdownCardProps {
    /** Target datetime to count down to (ISO string) */
    targetDateTime: string;
    /** Optional dev datetime override (ISO string) */
    devDateTime?: string;
    /** Title to show above the countdown (e.g., "Closes in", "Opens in") */
    title?: string;
    /** Whether this is counting down to opening (vs closing) */
    isOpening?: boolean;
}

// Urgency-based styling
const urgencyStyles: Record<
    UrgencyLevel,
    {
        border: string;
        bg: string;
        text: string;
        icon: string;
        pulse: boolean;
    }
> = {
    critical: {
        border: "border-red-400/30",
        bg: "bg-red-500/20",
        text: "text-red-300",
        icon: "text-red-400",
        pulse: true,
    },
    warning: {
        border: "border-amber-400/30",
        bg: "bg-amber-500/20",
        text: "text-amber-300",
        icon: "text-amber-400",
        pulse: false,
    },
    normal: {
        border: "border-violet-400/30",
        bg: "bg-violet-500/20",
        text: "text-violet-300",
        icon: "text-violet-400",
        pulse: false,
    },
};

// Opening countdown always uses indigo styling
const openingStyles = {
    border: "border-indigo-400/30",
    bg: "bg-indigo-500/20",
    text: "text-indigo-300",
    icon: "text-indigo-400",
    pulse: false,
};

/**
 * Pad number with leading zero
 */
const pad = (n: number) => String(n).padStart(2, "0");

export default function CountdownCard({
    targetDateTime,
    devDateTime,
    title,
    isOpening = false,
}: CountdownCardProps) {
    const countdown = useCountdown({ targetDateTime, devDateTime });

    if (countdown.isExpired) {
        return (
            <div className="rounded-xl p-4 bg-slate-500/20 border border-slate-400/30">
                <div className="flex items-center gap-2">
                    <Icon
                        name="circle-check"
                        style="solid"
                        className="text-slate-400"
                    />
                    <span className="text-sm font-semibold text-slate-300">
                        {isOpening ? "Now Open" : "Closed"}
                    </span>
                </div>
            </div>
        );
    }

    const styles = isOpening ? openingStyles : urgencyStyles[countdown.urgency];
    const displayTitle = title || (isOpening ? "Opens in" : "Closes in");

    // Determine what time units to show based on urgency
    const showLiveTimer = !isOpening && countdown.urgency === "critical";

    return (
        <div className={`rounded-xl p-4 ${styles.bg} border ${styles.border}`}>
            {/* Header */}
            <div className="flex items-center gap-2 mb-3">
                <span
                    className={`h-3 w-3 rounded-full ${styles.icon.replace("text-", "bg-")} ${styles.pulse ? "animate-pulse" : ""
                        }`}
                />
                <span className={`text-sm font-semibold ${styles.text}`}>
                    {displayTitle}
                </span>
            </div>

            {/* Countdown display */}
            {showLiveTimer ? (
                // Live HH:MM:SS timer for critical urgency
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 font-mono text-2xl font-bold text-white">
                        <span>{pad(countdown.hours)}</span>
                        <span className={`animate-pulse ${styles.text}`}>:</span>
                        <span>{pad(countdown.minutes)}</span>
                        <span className={`animate-pulse ${styles.text}`}>:</span>
                        <span>{pad(countdown.seconds)}</span>
                    </div>
                    <span className={`text-sm ${styles.text}`}>remaining</span>
                </div>
            ) : (
                // Days/hours display for normal cases
                <div className="flex items-baseline gap-2">
                    {countdown.totalDays > 0 && (
                        <>
                            <span className="text-3xl font-bold text-white">
                                {countdown.totalDays}
                            </span>
                            <span className={`text-sm ${styles.text}`}>
                                {countdown.totalDays === 1 ? "day" : "days"}
                            </span>
                        </>
                    )}
                    {countdown.totalDays === 0 && (
                        <>
                            <span className="text-3xl font-bold text-white">
                                {countdown.hours}
                            </span>
                            <span className={`text-sm ${styles.text}`}>
                                {countdown.hours === 1 ? "hour" : "hours"}
                            </span>
                        </>
                    )}
                </div>
            )}

            {/* Additional context for warning state */}
            {!isOpening && countdown.urgency === "warning" && (
                <p className={`text-xs ${styles.text} mt-2`}>
                    Deadline approaching — apply soon
                </p>
            )}
        </div>
    );
}
