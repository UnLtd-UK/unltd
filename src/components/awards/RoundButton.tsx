/**
 * RoundButton Component (React)
 * Apply button with contextual state based on round status
 *
 * States:
 * - No rounds: disabled with "No rounds scheduled" message
 * - Future round: disabled with countdown to opening
 * - Open round: active "Apply Now" button with optional urgency styling
 * - Closing soon: active with urgency colors and countdown
 */

import Icon from "./Icon";
import CountdownText from "./CountdownText";
import { useCountdown, getCurrentDateTime } from "./useCountdown";

interface RoundButtonProps {
    /** Whether a round is currently open for applications */
    isOpen: boolean;
    /** Date/time when applications open (ISO string) - for future rounds */
    opensDateTime?: string;
    /** Date/time when applications close (ISO string) - for open rounds */
    closesDateTime?: string;
    /** Formatted open date for display (e.g., "1 April 2026") */
    opensDateFormatted?: string;
    /** URL for the application portal */
    applyUrl?: string;
    /** Dev datetime override for testing (ISO string) */
    devDateTime?: string;
    /** Visual variant */
    variant?: "primary" | "hero";
}

export default function RoundButton({
    isOpen,
    opensDateTime,
    closesDateTime,
    opensDateFormatted,
    applyUrl = "https://unltd.microsoftcrmportals.com/applications",
    devDateTime,
    variant = "primary",
}: RoundButtonProps) {
    // Countdown to opening (for closed state)
    const opensCountdown = useCountdown({
        targetDateTime: opensDateTime || new Date().toISOString(),
        devDateTime,
        live: !isOpen && !!opensDateTime,
    });

    // Countdown to closing (for urgency display)
    const closesCountdown = useCountdown({
        targetDateTime: closesDateTime || new Date().toISOString(),
        devDateTime,
        live: isOpen && !!closesDateTime,
    });

    // No rounds at all
    if (!isOpen && !opensDateTime) {
        return (
            <div>
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-slate-500/20 text-slate-300 font-semibold rounded-xl text-lg ring-1 ring-slate-500/30 cursor-not-allowed">
                    <Icon name="calendar-xmark" style="solid" />
                    No rounds scheduled
                </div>
                <p className="text-slate-400 text-sm mt-2">
                    Check back soon for upcoming application rounds
                </p>
            </div>
        );
    }

    // Future round - show countdown to opening
    if (!isOpen && opensDateTime) {
        return (
            <div>
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-500/20 text-white font-semibold rounded-xl text-lg ring-1 ring-indigo-500/30 cursor-not-allowed">
                    <Icon name="clock" style="solid" className="text-indigo-400" />
                    <span>
                        Applications open{" "}
                        <span className="text-indigo-300">{opensDateFormatted}</span>
                    </span>
                </div>
                <div className="flex items-center gap-2 mt-3">
                    <CountdownText
                        targetDateTime={opensDateTime}
                        devDateTime={devDateTime}
                        label="Opens in"
                        showLabel={true}
                    />
                </div>
                <p className="text-indigo-200/70 text-sm mt-2">
                    Bookmark this page and come back when applications open
                </p>
            </div>
        );
    }

    // Open round - determine urgency
    const urgency = closesCountdown.urgency;
    const isHeroVariant = variant === "hero";

    // Button styling based on urgency
    const getButtonStyles = () => {
        if (isHeroVariant) {
            // Hero variant: white background
            if (urgency === "critical") {
                return "bg-white text-red-700 hover:bg-red-50";
            }
            if (urgency === "warning") {
                return "bg-white text-amber-700 hover:bg-amber-50";
            }
            return "bg-white text-emerald-700 hover:bg-emerald-50";
        }

        // Primary variant: colored background
        if (urgency === "critical") {
            return "bg-red-500 text-white hover:bg-red-400";
        }
        if (urgency === "warning") {
            return "bg-amber-500 text-white hover:bg-amber-400";
        }
        return "bg-emerald-500 text-white hover:bg-emerald-400";
    };

    return (
        <div>
            <a
                href={applyUrl}
                className={`inline-flex items-center gap-3 px-8 py-4 font-bold rounded-xl text-lg transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105 ${getButtonStyles()}`}
            >
                Apply Now
                <Icon name="arrow-right" style="solid" />
            </a>

            {/* Show urgency info below button */}
            {urgency !== "normal" && closesDateTime && (
                <div className="mt-3">
                    <CountdownText
                        targetDateTime={closesDateTime}
                        devDateTime={devDateTime}
                        label={urgency === "critical" ? "Closes in" : "Deadline in"}
                        showLabel={true}
                        size="md"
                    />
                </div>
            )}
        </div>
    );
}
