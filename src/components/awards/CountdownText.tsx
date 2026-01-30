/**
 * CountdownText Component
 * Compact inline countdown display for RoundBanner and RoundButton
 *
 * Shows:
 * - "X days" when more than 48 hours remaining
 * - "HH:MM:SS" live timer when less than 48 hours
 * - Urgency-based text colors (red/amber/normal)
 */

import { useCountdown, type UrgencyLevel } from "./useCountdown";

interface CountdownTextProps {
    /** Target datetime to count down to (ISO string) */
    targetDateTime: string;
    /** Optional dev datetime override (ISO string) */
    devDateTime?: string;
    /** Label to show before the countdown (e.g., "Opens in", "Closes in") */
    label?: string;
    /** Whether to show the label (default: true) */
    showLabel?: boolean;
    /** Size variant */
    size?: "sm" | "md";
}

// Urgency-based styling
const urgencyStyles: Record<UrgencyLevel, { text: string; bg: string }> = {
    critical: { text: "text-red-400", bg: "bg-red-500/20" },
    warning: { text: "text-amber-400", bg: "bg-amber-500/20" },
    normal: { text: "text-violet-300", bg: "bg-violet-500/20" },
};

/**
 * Pad number with leading zero
 */
const pad = (n: number) => String(n).padStart(2, "0");

export default function CountdownText({
    targetDateTime,
    devDateTime,
    label = "Time left",
    showLabel = true,
    size = "sm",
}: CountdownTextProps) {
    const countdown = useCountdown({ targetDateTime, devDateTime });

    if (countdown.isExpired) {
        return (
            <span className="text-slate-400 text-sm font-medium">Closed</span>
        );
    }

    const styles = urgencyStyles[countdown.urgency];
    const textSize = size === "sm" ? "text-xs" : "text-sm";
    const timerSize = size === "sm" ? "text-sm" : "text-base";

    // Show live HH:MM:SS timer when critical (<48 hours)
    if (countdown.urgency === "critical") {
        return (
            <div className="flex items-center gap-1.5">
                {showLabel && (
                    <span className={`${textSize} font-medium ${styles.text}`}>
                        {label}
                    </span>
                )}
                <div
                    className={`flex items-center gap-0.5 font-mono ${timerSize} font-bold text-white px-2 py-0.5 rounded ${styles.bg}`}
                >
                    <span>{pad(countdown.hours)}</span>
                    <span className={`animate-pulse ${styles.text}`}>:</span>
                    <span>{pad(countdown.minutes)}</span>
                    <span className={`animate-pulse ${styles.text}`}>:</span>
                    <span>{pad(countdown.seconds)}</span>
                </div>
            </div>
        );
    }

    // Show days remaining for warning and normal states
    const daysText =
        countdown.totalDays === 1
            ? "1 day"
            : `${countdown.totalDays} days`;

    return (
        <div className="flex items-center gap-1.5">
            {showLabel && (
                <span className={`${textSize} font-medium ${styles.text}`}>
                    {label}
                </span>
            )}
            <span
                className={`${textSize} font-semibold ${countdown.urgency === "warning"
                        ? styles.text
                        : "text-white"
                    }`}
            >
                {daysText}
            </span>
        </div>
    );
}
