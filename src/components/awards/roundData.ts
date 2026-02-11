/**
 * Shared Round Data Serializer
 *
 * Centralizes the round-data-to-serializable-props logic that was
 * previously duplicated across RoundBannerWrapper, RoundButtonWrapper,
 * and RoundWidgetWrapper.
 *
 * Astro wrappers import this to prepare data for React client components.
 */

import { rounds } from "@data/rounds.js";
import { processAllRounds } from "@utils/application-rounds.js";
import { getDevDateTimeString } from "@config/dev.config.js";
import type { ProcessedRound } from "./useRoundStatus";

/**
 * Serialize a server-processed round into a plain object safe for
 * Astro → React prop passing (no functions, classes, or circular refs).
 */
function serializeRound(round: any): ProcessedRound | null {
    if (!round) return null;
    return {
        id: round.id,
        opensDate: round.opensDate,
        closesDate: round.closesDate,
        assessmentStart: round.assessmentStart ?? "",
        assessmentEnd: round.assessmentEnd ?? "",
        interviewStart: round.interviewStart ?? null,
        interviewEnd: round.interviewEnd ?? null,
        resultsStart: round.resultsStart ?? "",
        resultsEnd: round.resultsEnd ?? "",
        hasCapacity: round.hasCapacity ?? false,
        capacityPercentage: round.capacityPercentage ?? 0,
        isOpen: round.isOpen ?? false,
        isUpcoming: round.isUpcoming ?? false,
        isInAssessment: round.isInAssessment ?? false,
        isInInterview: round.isInInterview ?? false,
        isInResults: round.isInResults ?? false,
        isCompleted: round.isCompleted ?? false,
        phase: round.phase ?? "",
        dates: round.dates ?? {},
        timing: round.timing,
        phaseInfo: round.phaseInfo,
    };
}

export interface RoundDataProps {
    /** Serialized current/active round */
    currentRound: ProcessedRound | null;
    /** Serialized next upcoming round */
    nextRound: ProcessedRound | null;
    /** All rounds serialized (for table display) */
    allRounds: ProcessedRound[];
    /** Dev datetime string (if DEV_DATETIME is set) */
    devDateTime: string | undefined;
}

/**
 * Fetch and serialize all round data for client components.
 * Call once in each Astro wrapper's frontmatter.
 */
export function getRoundData(): RoundDataProps {
    const {
        all: rawAll,
        currentRound: rawCurrent,
        nextOpenRound: rawNext,
    } = processAllRounds(rounds);

    return {
        currentRound: serializeRound(rawCurrent),
        nextRound: serializeRound(rawNext),
        allRounds: rawAll.map(serializeRound).filter(Boolean) as ProcessedRound[],
        devDateTime: getDevDateTimeString(),
    };
}
