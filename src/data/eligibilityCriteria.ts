/**
 * Eligibility Criteria Data
 *
 * Contains all eligibility requirements for each award type.
 * Used by the EligibilityCriteria component to render the comparison table.
 */

export const awardCodes = {
    STMAT: "Starting Up Millennium Awards Trust Award",
    STFFP: "Starting Up Funding Futures Programme Award",
    SCMAT: "Scaling Up Millennium Awards Trust Award",
    SCFFP: "Scaling Up Funding Futures Programme Award",
} as const;

export type AwardCode = keyof typeof awardCodes;

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
                    STMAT: "16 years old or older",
                    STFFP: "16 to 30 years old",
                    SCMAT: "16 years old or older",
                    SCFFP: "16 to 30 years old",
                },
            },
            {
                name: "Are you currently living in the United Kingdom?",
                awards: { STMAT: true, STFFP: true, SCMAT: true, SCFFP: true },
            },
            {
                name: "Are you the founder or leader of the social venture?",
                awards: { STMAT: true, STFFP: true, SCMAT: true, SCFFP: true },
            },
            {
                name: "Why are you looking for funding?",
                awards: {
                    STMAT: "To create long term social impact",
                    STFFP: "To create long term social impact",
                    SCMAT: "To create long term social impact",
                    SCFFP: "To create long term social impact",
                },
            },
            {
                name: "Are you applying primarily to fund academic qualifications?",
                awards: {
                    STMAT: false,
                    STFFP: false,
                    SCMAT: false,
                    SCFFP: false,
                },
            },
            {
                name: "Are you applying primarily to fund overseas travel?",
                awards: {
                    STMAT: false,
                    STFFP: false,
                    SCMAT: false,
                    SCFFP: false,
                },
            },
            {
                name: "Are you applying primarily to pay others to deliver the work on your behalf?",
                awards: {
                    STMAT: false,
                    STFFP: false,
                    SCMAT: false,
                    SCFFP: false,
                },
            },
            {
                name: "Do you need both UnLtd's financial and non-financial support?",
                awards: { STMAT: true, STFFP: true, SCMAT: true, SCFFP: true },
            },
        ],
    },
    {
        name: "Social venture",
        criteria: [
            {
                name: "Is it clearly driven by its social purpose?",
                awards: { STMAT: true, STFFP: true, SCMAT: true, SCFFP: true },
            },
            {
                name: "Can you demonstrate a clear need for it?",
                awards: { STMAT: true, STFFP: true, SCMAT: true, SCFFP: true },
            },
            {
                name: "Does it mainly benefit people or places within the UK?",
                awards: {
                    STMAT: false,
                    STFFP: false,
                    SCMAT: false,
                    SCFFP: false,
                },
            },
            {
                name: "Is it continuing activities that have already been running for more than four years?",
                awards: {
                    STMAT: false,
                    STFFP: false,
                    SCMAT: false,
                    SCFFP: false,
                },
            },
            {
                name: "Does it involve activities outside of the law, against public policy or anything which encourages ethnic, religious, or commercial disharmony?",
                awards: {
                    STMAT: false,
                    STFFP: false,
                    SCMAT: false,
                    SCFFP: false,
                },
            },
            {
                name: "Does it involve political, or religious campaigning?",
                awards: {
                    STMAT: false,
                    STFFP: false,
                    SCMAT: false,
                    SCFFP: false,
                },
            },
            {
                name: "Does it do more than just raise awareness of a social issue?",
                awards: {
                    STMAT: false,
                    STFFP: false,
                    SCMAT: false,
                    SCFFP: false,
                },
            },
            {
                name: "Does it have the potential to be financially sustainable with our support?",
                awards: { STMAT: true, STFFP: true, SCMAT: true, SCFFP: true },
            },
            {
                name: "How long has your idea or social venture been incorporated?",
                awards: {
                    STMAT: "Not yet or less than 4 years",
                    STFFP: "Not yet or less than 4 years",
                    SCMAT: "Between 1 to 4 years",
                    SCFFP: "Between 1 to 4 years",
                },
            },
            {
                name: "Has your idea or social venture started trading?",
                awards: {
                    STMAT: "Not yet or trading for under 1 year",
                    STFFP: "Not yet or trading for under 1 year",
                    SCMAT: "Between 1 to 4 years",
                    SCFFP: "Between 1 to 4 years",
                },
            },
            {
                name: "What sectors are you in?",
                awards: {
                    STMAT: [
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
                    STFFP: [
                        "Access to employment",
                        "Financial services and financial inclusion",
                        "Poverty reduction",
                        "Skills and training",
                    ],
                    SCMAT: [
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
                    SCFFP: [
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
                    STMAT: null,
                    STFFP: "Less than £250,000",
                    SCMAT: null,
                    SCFFP: "Less than £250,000",
                },
            },
            {
                name: "In the last 12 months, has your social venture earned over £18,000 in traded income?",
                awards: {
                    STMAT: null,
                    STFFP: "£18,000 or more",
                    SCMAT: null,
                    SCFFP: "£18,000 or more",
                },
            },
            {
                name: "Are you able to provide financial data which covers the last 12 months, along with financial projections for the next 12 months?",
                awards: {
                    STMAT: null,
                    STFFP: true,
                    SCMAT: null,
                    SCFFP: true,
                },
            },
        ],
    },
];

// Helper to get award keys
export const awardKeys = Object.keys(awardCodes) as AwardCode[];

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
