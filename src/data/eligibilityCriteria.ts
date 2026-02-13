/**
 * Eligibility Criteria Data
 *
 * Transforms award eligibility data from Directus into a format
 * suitable for rendering the eligibility comparison table.
 */

import { awards, type Award, type EligibilityValue } from "./awards";
import {
    socialEntrepreneurCriteria,
    socialVentureCriteria,
    categoryNames,
    type CriterionMapping,
} from "./criteriaMapping";

// Derive award codes from the awards data
export const awardCodes = Object.fromEntries(
    awards.map((award) => [award.code, award.name])
) as Record<string, string>;

export type AwardCode = Award["code"];

export interface EligibilityCriterion {
    name: string;
    awards: Record<AwardCode, EligibilityValue>;
}

export interface EligibilityCategory {
    name: string;
    criteria: EligibilityCriterion[];
}

/**
 * Build criteria array from mappings and awards data
 */
function buildCriteria(mappings: CriterionMapping[]): EligibilityCriterion[] {
    return mappings.map((mapping) => ({
        name: mapping.name,
        awards: Object.fromEntries(
            awards.map((award) => [
                award.code,
                award.eligibility[mapping.slug as keyof typeof award.eligibility] ?? null,
            ])
        ) as Record<AwardCode, EligibilityValue>,
    }));
}

/**
 * Eligibility data organized by category
 */
export const eligibilityData: EligibilityCategory[] = [
    {
        name: categoryNames.social_entrepreneur,
        criteria: buildCriteria(socialEntrepreneurCriteria),
    },
    {
        name: categoryNames.social_venture,
        criteria: buildCriteria(socialVentureCriteria),
    },
];

// Helper to get award keys
export const awardKeys = Object.keys(awardCodes) as AwardCode[];

// Helper to get award info by code
export function getAwardInfo(code: AwardCode) {
    const award = awards.find((a) => a.code === code);
    return award
        ? {
            name: award.name,
            stage: award.stage,
            stageLabel: award.stage === "starting-up" ? "Starting up" : "Scaling up",
            programmeName: award.programme.name,
            programmeColour: award.programme.colour,
        }
        : null;
}

// Helper function to render criterion values
export function renderCriterionValue(value: EligibilityValue): {
    type: "null" | "true" | "false" | "array" | "string";
    text?: string;
    count?: number;
} {
    if (value === null) return { type: "null" };
    if (value === true) return { type: "true" };
    if (value === false) return { type: "false" };
    if (Array.isArray(value)) return { type: "array", count: value.length };
    return { type: "string", text: value };
}
