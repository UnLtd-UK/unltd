/**
 * RoundApply Component (React)
 * Full-width section showing current round apply dates and info.
 *
 * 4 states:
 * - Closed:  muted card — "No rounds currently open"
 * - Opening: indigo card — "Opens {date}" with countdown
 * - Open:    emerald card — dates + countdown
 * - Closing: amber/red card — dates + urgency countdown
 */

import Icon from "./Icon";
import CountdownText from "./CountdownText";
import { useRoundStatus, getRoundName, formatTime, type ProcessedRound } from "./useRoundStatus";

interface RoundApplyProps {
    currentRound?: ProcessedRound | null;
    nextRound?: ProcessedRound | null;
    devDateTime?: string;
}

export default function RoundApply({
    currentRound,
    nextRound,
    devDateTime,
}: RoundApplyProps) {
    const { state, round: displayRound, urgency, closesCountdown, opensCountdown, roundName, dateText } =
        useRoundStatus({ currentRound, nextRound, devDateTime });

    // ─── Header ─────────────────────────────────────────────────────────

    const stateStyles = {
        closed: {
            border: "border-slate-700/50",
            bg: "bg-slate-900/50",
            accent: "text-slate-400",
            icon: "calendar-xmark",
        },
        opening: {
            border: "border-indigo-500/30",
            bg: "bg-indigo-950/50",
            accent: "text-indigo-400",
            icon: "calendar-clock",
        },
        open: {
            border: "border-emerald-500/30",
            bg: "bg-emerald-950/50",
            accent: "text-emerald-400",
            icon: "door-open",
        },
        closing: {
            border: urgency === "critical" ? "border-red-500/30" : "border-amber-500/30",
            bg: urgency === "critical" ? "bg-red-950/50" : "bg-amber-950/50",
            accent: urgency === "critical" ? "text-red-400" : "text-amber-400",
            icon: "clock",
        },
    };

    const s = stateStyles[state];

    // ─── Description text ───────────────────────────────────────────────

    const renderDescription = () => {
        switch (state) {
            case "closed":
                return "There are currently no application rounds open. Check back soon for upcoming rounds.";
            case "opening":
                return (
                    <>
                        The next application round opens{" "}
                        <strong className="text-white">{displayRound?.dates.opens}</strong>.
                        {opensCountdown.totalDays > 0 && (
                            <>
                                {" "}That's in{" "}
                                <strong className="text-white">
                                    {opensCountdown.totalDays} {opensCountdown.totalDays === 1 ? "day" : "days"}
                                </strong>.
                            </>
                        )}
                    </>
                );
            case "open":
                return (
                    <>
                        We're accepting applications until{" "}
                        <strong className="text-white">{displayRound?.dates.closes}</strong>.
                        {closesCountdown.totalDays > 0 && (
                            <>
                                {" "}You have{" "}
                                <strong className="text-white">
                                    {closesCountdown.totalDays} {closesCountdown.totalDays === 1 ? "day" : "days"}
                                </strong>{" "}
                                left to apply.
                            </>
                        )}
                    </>
                );
            case "closing":
                return (
                    <>
                        Applications close{" "}
                        <strong className="text-white">{displayRound?.dates.closes}</strong>.
                        {closesCountdown.totalDays === 0 && !closesCountdown.isExpired && (
                            <strong className="text-white"> Last day to apply!</strong>
                        )}
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className={`rounded-2xl border ${s.border} ${s.bg} p-6 md:p-8`}>
            <p className={`text-xs font-semibold uppercase tracking-widest mb-3 text-violet-500`}>
                Stage 1
            </p>
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                {/* Left: Round info */}
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 shrink-0`}>
                            <Icon name={s.icon} style="solid" className={s.accent} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">
                                {roundName} Round
                            </h3>
                            <p className={`text-sm ${s.accent}`}>
                                {state === "closed" && "No active rounds"}
                                {state === "opening" && "Coming soon"}
                                {state === "open" && "Now accepting applications"}
                                {state === "closing" && "Closing soon"}
                            </p>
                        </div>
                    </div>

                    <p className="text-violet-300 mb-4">
                        {renderDescription()}
                    </p>

                </div>

                {/* Right: Countdown */}
                <div className="lg:w-64 shrink-0 flex flex-col items-center lg:items-end gap-3">
                    {state === "closing" && displayRound && (
                        <CountdownText
                            targetDateTime={displayRound.closesDate}
                            devDateTime={devDateTime}
                            label={urgency === "critical" ? "Closes in" : "Deadline in"}
                            showLabel={true}
                            size="md"
                        />
                    )}

                    {state === "opening" && displayRound && (
                        <div className="text-center lg:text-right">
                            <CountdownText
                                targetDateTime={displayRound.opensDate}
                                devDateTime={devDateTime}
                                label="Opens in"
                                showLabel={true}
                                size="md"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
