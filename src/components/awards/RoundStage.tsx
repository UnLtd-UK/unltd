/**
 * RoundStage Component (React)
 * Third-width card showing a single stage of the application process.
 *
 * Two visual modes based on the stage data:
 * 1. With steps (Assessment, Interview): numbered step cards + unsuccessful outcome
 * 2. Without steps (Result): successful + unsuccessful outcome cards
 *
 * Highlights the currently active stage based on round phase data.
 */

import Icon from "./Icon";
import { useRoundStatus, type ProcessedRound } from "./useRoundStatus";
import { stageColourClasses, type Stage } from "../../data/stages";

interface RoundStageProps {
    /** Stage data (icon, colour, title, steps, outcomes, etc.) */
    stage: Stage;
    /** Current/active round */
    currentRound?: ProcessedRound | null;
    /** Next upcoming round */
    nextRound?: ProcessedRound | null;
    /** Dev datetime override */
    devDateTime?: string;
}

export default function RoundStage({
    stage,
    currentRound,
    nextRound,
    devDateTime,
}: RoundStageProps) {
    const { round: displayRound } = useRoundStatus({ currentRound, nextRound, devDateTime });

    // Determine if this stage is the currently active one
    const currentPhase = displayRound?.phase ?? "";
    const isActive = stage.phase === currentPhase
        || (stage.phase === "assessment" && currentPhase === "awaiting-results");

    const colours = stageColourClasses[stage.colour];
    const hasSteps = stage.steps.length > 0;

    return (
        <div className={`rounded-2xl border ${isActive ? colours.border : "border-violet-800/30"} bg-violet-950 p-6 flex flex-col h-full transition-all duration-300 ${isActive ? `shadow-lg ${colours.glow}` : ""}`}>
            {/* Stage number label */}
            <p className={`text-xs font-semibold uppercase tracking-widest mb-3 ${isActive ? colours.text : "text-violet-500"}`}>
                Stage {stage.stage}
            </p>

            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${colours.bg} shrink-0`}>
                    <Icon name={stage.icon} style="solid" className={colours.icon} />
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-white">{stage.title}</h3>
                        {isActive && (
                            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ${colours.badge}`}>
                                <span className="relative flex h-1.5 w-1.5">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-75" />
                                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
                                </span>
                                Active
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-violet-400">{stage.subtitle}</p>
                </div>
            </div>

            {/* Steps list (for stages with steps like Assessment/Interview) */}
            {hasSteps && (
                <div className="flex flex-col gap-3 mb-4 flex-1">
                    {stage.steps.map((step, i) => (
                        <div key={i} className={`rounded-lg p-4`}>
                            <div className="flex items-start gap-3">
                                <div className={`flex h-8 w-8 items-center justify-center rounded-md ${colours.bg} shrink-0 mt-0.5`}>
                                    <Icon name={step.icon} style="solid" className={`${colours.icon} text-sm`} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-white text-sm">{step.title}</h4>
                                    <p className="text-xs text-violet-300 mt-0.5">{step.subtitle}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Successful outcome (only for Result stage) */}
            {stage.successful && (
                <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-4 mb-3">
                    <div className="flex items-center gap-2 mb-2">
                        <Icon name="circle-check" style="solid" className="text-emerald-400 text-sm" />
                        <h4 className="font-semibold text-emerald-300 text-sm">{stage.successful.title}</h4>
                    </div>
                    <p className="text-xs text-emerald-200/70">{stage.successful.description}</p>
                </div>
            )}

            {/* Unsuccessful outcome */}
            {stage.unsuccessful && (
                <div className="rounded-lg bg-white/5 border border-white/10 p-4 mt-auto">
                    <div className="flex items-center gap-2 mb-2">
                        <Icon name="comment-dots" style="solid" className="text-violet-400 text-sm" />
                        <h4 className="font-semibold text-violet-300 text-sm">
                            {stage.unsuccessful.title}
                        </h4>
                    </div>
                    <p className="text-xs text-violet-400">{stage.unsuccessful.description}</p>
                </div>
            )}
        </div>
    );
}
