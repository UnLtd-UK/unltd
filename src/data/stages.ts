/**
 * Application Process Stages Data
 *
 * Defines the 3 stages of the application process:
 * Assessment → Interview → Result
 *
 * Used by the RoundStage component to display the application journey.
 * Stage phases map to RoundPhase values for active-stage highlighting.
 */

export interface StageStep {
    icon: string;
    title: string;
    subtitle: string;
}

export interface StageOutcome {
    /** FontAwesome icon name */
    icon?: string;
    title?: string;
    subtitle?: string;
}

export interface Stage {
    /** FontAwesome icon name */
    icon: string;
    /** Tailwind colour key for theming */
    colour: "purple" | "yellow" | "blue";
    /** Stage heading */
    title: string;
    /** Short description under heading */
    subtitle: string;
    /** Sub-steps within this stage (empty for result) */
    steps: StageStep[];
    /** Maps to the round phase for active highlighting */
    phase: string;
    /** Stage number in the application process */
    stage: number;
    /** Outcome if successful (only for result stage) */
    successful: StageOutcome | null;
    /** Outcome if unsuccessful */
    unsuccessful: StageOutcome | null;
}

export const stages: Stage[] = [
    {
        icon: "button-pointer",
        colour: "purple",
        title: "Apply",
        subtitle: "Get ready to apply to submit your application.",
        steps: [
            {
                icon: "pen-to-square",
                title: "Submit your application",
                subtitle:
                    "Complete all sections of the application form through our portal.",
            },
            {
                icon: "hourglass-half",
                title: "Submit before deadline",
                subtitle:
                    "We assess applications in rounds. Submit before the round closes to be considered.",
            },
        ],
        phase: "apply",
        stage: 1,
        successful: {},
        unsuccessful: {},
    },
    {
        icon: "magnifying-glass",
        colour: "purple",
        title: "Application review",
        subtitle: "We review your application",
        steps: [
            {
                icon: "clipboard-list",
                title: "Suitability check",
                subtitle:
                    "Your application is reviewed against our eligibility criteria and our three key assessment areas: social impact, inclusion and financial sustainability.",
            },
            {
                icon: "users",
                title: "Support Manager assessment",
                subtitle:
                    "Support Managers discuss your application together. Strong applications are invited to panel.",
            },
        ],
        phase: "assessment",
        stage: 2,
        successful: {},
        unsuccessful: {
            icon: "envelope-open-text",
            title: "If unsuccessful",
            subtitle:
                "Receive feedback on the main reason your application was unsuccessful and links to other funding and support available.",
        },
    },
    {
        icon: "comments",
        colour: "purple",
        title: "Panel & recommendation",
        subtitle: "Meet with our panel",
        steps: [
            {
                icon: "people-group",
                title: "Panel meeting",
                subtitle:
                    "Discuss your venture with staff and experienced social entrepreneurs in a supportive setting.",
            },
            {
                icon: "gavel",
                title: "Committee approval",
                subtitle:
                    "Final recommendations go to our Awards Committee for approval.",
            },
        ],
        phase: "interview",
        stage: 3,
        successful: {},
        unsuccessful: {
            icon: "envelope-open-text",
            title: "If unsuccessful",
            subtitle:
                "Receive feedback on your venture highlighting strengths, suggestions for improvement and links to other funding and support available.",
        },
    },
    {
        icon: "award",
        colour: "purple",
        title: "Result",
        subtitle: "Receive your decision",
        steps: [
            {
                icon: "certificate",
                title: "Award approval",
                subtitle:
                    "Receive your Award amount, approved budget and details on how to accept our offer.",
            }
        ],
        phase: "results",
        stage: 4,
        successful: {
            icon: "handshake",
            title: "Welcome to the community",
            subtitle:
                "Invitation to our welcome workshop and an introduction to your dedicated Support Manager.",
        },
        unsuccessful: {},
    },
];

/**
 * Colour classes for stage theming.
 * Maps the stage `colour` key to Tailwind utility classes.
 */
export const stageColourClasses: Record<
    Stage["colour"],
    {
        bg: string;
        bgLight: string;
        border: string;
        text: string;
        icon: string;
        badge: string;
        glow: string;
    }
> = {
    purple: {
        bg: "bg-purple-500/20",
        bgLight: "bg-purple-500/10",
        border: "border-purple-400/30",
        text: "text-purple-300",
        icon: "text-purple-400",
        badge: "bg-purple-500/20 text-purple-300 ring-purple-500/30",
        glow: "shadow-purple-500/20",
    },
    yellow: {
        bg: "bg-amber-500/20",
        bgLight: "bg-amber-500/10",
        border: "border-amber-400/30",
        text: "text-amber-300",
        icon: "text-amber-400",
        badge: "bg-amber-500/20 text-amber-300 ring-amber-500/30",
        glow: "shadow-amber-500/20",
    },
    blue: {
        bg: "bg-sky-500/20",
        bgLight: "bg-sky-500/10",
        border: "border-sky-400/30",
        text: "text-sky-300",
        icon: "text-sky-400",
        badge: "bg-sky-500/20 text-sky-300 ring-sky-500/30",
        glow: "shadow-sky-500/20",
    },
};
