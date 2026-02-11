/**
 * RoundBanner Component (React)
 * Full-width banner showing application round status.
 *
 * 4 states:
 * - Closed:  hidden (returns null)
 * - Opening: indigo — "Applications open {date}"
 * - Open:    emerald — "Apply now — closes {date}"
 * - Closing: amber/red — "Closing {date}" + countdown
 */

import Icon from "./Icon";
import CountdownText from "./CountdownText";
import { useRoundStatus, type ProcessedRound } from "./useRoundStatus";

interface RoundBannerProps {
    round?: ProcessedRound | null;
    nextRound?: ProcessedRound | null;
    devDateTime?: string;
    eligibilityUrl?: string;
    awardsUrl?: string;
}

export default function RoundBanner({
    round,
    nextRound,
    devDateTime,
    eligibilityUrl = "/awards#eligibility-checker",
    awardsUrl = "/awards",
}: RoundBannerProps) {
    const { state, round: displayRound, urgency, closesCountdown, opensCountdown, roundName } =
        useRoundStatus({ currentRound: round, nextRound, devDateTime });

    // Don't render when closed
    if (state === "closed" || !displayRound) {
        return null;
    }

    // ─── Styling maps ───────────────────────────────────────────────────

    const styleMap = {
        opening: {
            bar: "bg-linear-to-r from-indigo-500 to-indigo-400",
            iconBg: "bg-indigo-500/20",
            iconColor: "text-indigo-400",
            badge: "bg-indigo-500/20 text-indigo-400 ring-indigo-500/30",
            cta: "bg-indigo-500 hover:bg-indigo-400 text-white",
            icon: "calendar-clock",
        },
        open: {
            bar: "bg-linear-to-r from-emerald-500 to-emerald-400",
            iconBg: "bg-emerald-500/20",
            iconColor: "text-emerald-400",
            badge: "bg-emerald-500/20 text-emerald-400 ring-emerald-500/30",
            cta: "bg-emerald-500 hover:bg-emerald-400 text-white",
            icon: "door-open",
        },
        closing: {
            bar: urgency === "critical"
                ? "bg-linear-to-r from-red-500 to-red-400"
                : "bg-linear-to-r from-amber-500 to-amber-400",
            iconBg: urgency === "critical" ? "bg-red-500/20" : "bg-amber-500/20",
            iconColor: urgency === "critical" ? "text-red-400" : "text-amber-400",
            badge: urgency === "critical"
                ? "bg-red-500/20 text-red-400 ring-red-500/30"
                : "bg-amber-500/20 text-amber-400 ring-amber-500/30",
            cta: urgency === "critical"
                ? "bg-red-500 hover:bg-red-400 text-white"
                : "bg-amber-500 hover:bg-amber-400 text-white",
            icon: "clock",
        },
    } as const;

    const s = styleMap[state] ?? styleMap.open;

    // ─── Subtitle text ──────────────────────────────────────────────────

    const renderSubtitle = () => {
        switch (state) {
            case "opening":
                return (
                    <>
                        Opens <span className="font-medium text-white">{displayRound.dates.opens}</span>
                        {opensCountdown.totalDays > 0 && (
                            <span className="text-violet-400 ml-1">
                                ({opensCountdown.totalDays} {opensCountdown.totalDays === 1 ? "day" : "days"})
                            </span>
                        )}
                    </>
                );
            case "open":
                return (
                    <>
                        Closes <span className="font-medium text-white">{displayRound.dates.closes}</span>
                        {closesCountdown.totalDays > 0 && (
                            <span className="text-violet-400 ml-1">
                                ({closesCountdown.totalDays} {closesCountdown.totalDays === 1 ? "day" : "days"} left)
                            </span>
                        )}
                    </>
                );
            case "closing":
                return (
                    <>
                        Closing <span className="font-medium text-white">{displayRound.dates.closes}</span>
                    </>
                );
            default:
                return null;
        }
    };

    // ─── Badge text ─────────────────────────────────────────────────────

    const renderBadge = () => {
        switch (state) {
            case "opening":
                return (
                    <>
                        <Icon name="clock" style="regular" className="text-[10px]" />
                        Coming soon
                    </>
                );
            case "open":
                return (
                    <>
                        <span className="relative flex h-1.5 w-1.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-75" />
                            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
                        </span>
                        Open
                    </>
                );
            case "closing":
                return (
                    <>
                        <span className="relative flex h-1.5 w-1.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-75" />
                            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
                        </span>
                        Closing soon
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="relative overflow-hidden bg-linear-to-r from-violet-950 via-violet-900 to-violet-950 border-b border-violet-800/50">
            {/* Status indicator bar */}
            <div className={`absolute top-0 left-0 right-0 h-1 ${s.bar}`} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Left: Status and round info */}
                    <div className="flex items-center gap-4">
                        <div className={`hidden sm:flex h-10 w-10 items-center justify-center rounded-lg ${s.iconBg} shrink-0`}>
                            <Icon name={s.icon} style="solid" className={s.iconColor} />
                        </div>

                        <div>
                            <div className="flex items-center gap-3 flex-wrap">
                                <h3 className="text-base font-semibold text-white">
                                    {roundName} Round
                                </h3>
                                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${s.badge}`}>
                                    {renderBadge()}
                                </span>
                            </div>
                            <p className="text-sm text-violet-300 mt-0.5">
                                {renderSubtitle()}
                            </p>
                        </div>
                    </div>

                    {/* Center: Countdown timer (closing state only) */}
                    {state === "closing" && (
                        <div className="flex items-center gap-4 lg:flex-1 lg:justify-center lg:max-w-md shrink-0">
                            <CountdownText
                                targetDateTime={displayRound.closesDate}
                                devDateTime={devDateTime}
                                label="Closes in"
                            />
                        </div>
                    )}

                    {/* Right: CTA */}
                    <div className="flex items-center gap-3 shrink-0">
                        <a
                            href={eligibilityUrl}
                            className={`inline-flex items-center gap-2 px-4 py-2 font-semibold rounded-lg text-sm transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 ${s.cta}`}
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
