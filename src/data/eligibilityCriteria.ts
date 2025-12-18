/**
 * Eligibility Criteria Data
 *
 * Contains all eligibility requirements for each award type.
 * Used by the EligibilityCriteria component to render the comparison table.
 */

import { awards, type Award } from "./awards";

// Derive award codes from the awards data
export const awardCodes = Object.fromEntries(
    awards.map((award) => [award.code, award.name])
) as Record<string, string>;

export type AwardCode = Award["code"];

export interface EligibilityCriterion {
    name: string;
    awards: Record<AwardCode, boolean | string | string[] | null>;
}

export interface EligibilityCategory {
    name: string;
    criteria: EligibilityCriterion[];
}

export const eligibilityData: EligibilityCategory[] = [
    {
        name: "Social entrepreneur",
        criteria: [
            {
                name: "How old are you?",
                awards: {
                    stmat: "16 years old or older",
                    stffp: "16 to 30 years old",
                    scmat: "16 years old or older",
                    scffp: "16 to 30 years old",
                },
            },
            {
                name: "Are you currently living in the United Kingdom?",
                awards: { stmat: true, stffp: true, scmat: true, scffp: true },
            },
            {
                name: "Are you the founder or leader of the social venture?",
                awards: { stmat: true, stffp: true, scmat: true, scffp: true },
            },
            {
                name: "Why are you looking for funding?",
                awards: {
                    stmat: "To create long term social impact",
                    stffp: "To create long term social impact",
                    scmat: "To create long term social impact",
                    scffp: "To create long term social impact",
                },
            },
            {
                name: "Are you applying primarily to fund academic qualifications?",
                awards: {
                    stmat: false,
                    stffp: false,
                    scmat: false,
                    scffp: false,
                },
            },
            {
                name: "Are you applying primarily to fund overseas travel?",
                awards: {
                    stmat: false,
                    stffp: false,
                    scmat: false,
                    scffp: false,
                },
            },
            {
                name: "Are you applying primarily to pay others to deliver the work on your behalf?",
                awards: {
                    stmat: false,
                    stffp: false,
                    scmat: false,
                    scffp: false,
                },
            },
            {
                name: "Do you need both UnLtd's financial and non-financial support?",
                awards: { stmat: true, stffp: true, scmat: true, scffp: true },
            },
        ],
    },
    {
        name: "Social venture",
        criteria: [
            {
                name: "Is it clearly driven by its social purpose?",
                awards: { stmat: true, stffp: true, scmat: true, scffp: true },
            },
            {
                name: "Can you demonstrate a clear need for it?",
                awards: { stmat: true, stffp: true, scmat: true, scffp: true },
            },
            {
                name: "Does it mainly benefit people or places within the UK?",
                awards: {
                    stmat: false,
                    stffp: false,
                    scmat: false,
                    scffp: false,
                },
            },
            {
                name: "Is it continuing activities that have already been running for more than four years?",
                awards: {
                    stmat: false,
                    stffp: false,
                    scmat: false,
                    scffp: false,
                },
            },
            {
                name: "Does it involve activities outside of the law, against public policy or anything which encourages ethnic, religious, or commercial disharmony?",
                awards: {
                    stmat: false,
                    stffp: false,
                    scmat: false,
                    scffp: false,
                },
            },
            {
                name: "Does it involve political, or religious campaigning?",
                awards: {
                    stmat: false,
                    stffp: false,
                    scmat: false,
                    scffp: false,
                },
            },
            {
                name: "Does it do more than just raise awareness of a social issue?",
                awards: {
                    stmat: false,
                    stffp: false,
                    scmat: false,
                    scffp: false,
                },
            },
            {
                name: "Does it have the potential to be financially sustainable with our support?",
                awards: { stmat: true, stffp: true, scmat: true, scffp: true },
            },
            {
                name: "How long has your idea or social venture been incorporated?",
                awards: {
                    stmat: "Not yet or less than 4 years",
                    stffp: "Not yet or less than 4 years",
                    scmat: "Between 1 to 4 years",
                    scffp: "Between 1 to 4 years",
                },
            },
            {
                name: "Has your idea or social venture started trading?",
                awards: {
                    stmat: "Not yet or trading for under 1 year",
                    stffp: "Not yet or trading for under 1 year",
                    scmat: "Between 1 to 4 years",
                    scffp: "Between 1 to 4 years",
                },
            },
            {
                name: "What sectors are you in?",
                awards: {
                    stmat: [
                        "Access to education",
                        "Access to employment",
                        "Access to legal services",
                        "Business support",
                        "Climate change and energy",
                        "Care in the community",
                        "Conservation",
                        "Creative industries",
                        "Criminal justice",
                        "Digital products or services",
                        "Environmental sustainability",
                        "Equity, diversity, and inclusion",
                        "Financial services and financial inclusion",
                        "Food, nutrition, or agriculture",
                        "Healthy ageing",
                        "Housing and/or homelessness",
                        "Loneliness and/or social isolation",
                        "Manufacturing",
                        "Mental health and wellbeing",
                        "Poverty reduction",
                        "Quality of life",
                        "Skills and training",
                        "Social care",
                        "Sport and physical health",
                        "Technology",
                        "Urban environments/community",
                        "Water and sanitation",
                        "Youth",
                        "Other",
                    ],
                    stffp: [
                        "Access to employment",
                        "Financial services and financial inclusion",
                        "Poverty reduction",
                        "Skills and training",
                    ],
                    scmat: [
                        "Access to education",
                        "Access to employment",
                        "Access to legal services",
                        "Business support",
                        "Climate change and energy",
                        "Care in the community",
                        "Conservation",
                        "Creative industries",
                        "Criminal justice",
                        "Digital products or services",
                        "Environmental sustainability",
                        "Equity, diversity, and inclusion",
                        "Financial services and financial inclusion",
                        "Food, nutrition, or agriculture",
                        "Healthy ageing",
                        "Housing and/or homelessness",
                        "Loneliness and/or social isolation",
                        "Manufacturing",
                        "Mental health and wellbeing",
                        "Poverty reduction",
                        "Quality of life",
                        "Skills and training",
                        "Social care",
                        "Sport and physical health",
                        "Technology",
                        "Urban environments/community",
                        "Water and sanitation",
                        "Youth",
                        "Other",
                    ],
                    scffp: [
                        "Access to employment",
                        "Financial services and financial inclusion",
                        "Poverty reduction",
                        "Skills and training",
                    ],
                },
            },
            {
                name: "What was your social ventures turnover in its last financial year?",
                awards: {
                    stmat: null,
                    stffp: "Less than £250,000",
                    scmat: null,
                    scffp: "Less than £250,000",
                },
            },
            {
                name: "In the last 12 months, has your social venture earned over £18,000 in traded income?",
                awards: {
                    stmat: null,
                    stffp: "£18,000 or more",
                    scmat: null,
                    scffp: "£18,000 or more",
                },
            },
            {
                name: "Are you able to provide financial data which covers the last 12 months, along with financial projections for the next 12 months?",
                awards: {
                    stmat: null,
                    stffp: true,
                    scmat: null,
                    scffp: true,
                },
            },
        ],
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
export function renderCriterionValue(value: boolean | string | string[] | null): {
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
