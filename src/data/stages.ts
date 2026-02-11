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
    title: string;
    description: string;
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
        icon: "magnifying-glass",
        colour: "purple",
        title: "Assessment",
        subtitle: "We review your application",
        steps: [
            {
                icon: "circle-check",
                title: "Suitability Check",
                subtitle:
                    "Reviewed against social impact and sustainability criteria.",
            },
            {
                icon: "people-group",
                title: "Peer Review",
                subtitle:
                    "Support Managers discuss your application together.",
            },
        ],
        phase: "assessment",
        stage: 2,
        successful: null,
        unsuccessful: {
            title: "Basic feedback",
            description:
                "General feedback on eligibility criteria and application strength to help you understand areas for improvement.",
        },
    },
    {
        icon: "comments",
        colour: "yellow",
        title: "Interview",
        subtitle: "Meet with our panel",
        steps: [
            {
                icon: "people-group",
                title: "Panel Discussion",
                subtitle:
                    "Meet with staff and entrepreneurs to discuss your venture.",
            },
            {
                icon: "circle-question",
                title: "Q&A Session",
                subtitle:
                    "Answer questions about your plans and goals.",
            },
        ],
        phase: "interview",
        stage: 3,
        successful: null,
        unsuccessful: {
            title: "Detailed feedback",
            description:
                "Specific feedback on your venture proposition and interview performance, with actionable suggestions for development.",
        },
    },
    {
        icon: "envelope",
        colour: "blue",
        title: "Result",
        subtitle: "Receive your decision",
        steps: [],
        phase: "results",
        stage: 4,
        successful: {
            title: "Welcome to the community",
            description:
                "Welcome pack with cohort information. Budget & reporting guidance. Dedicated Support Manager introduction.",
        },
        unsuccessful: {
            title: "Detailed feedback",
            description:
                "In-depth feedback on your application journey. Development resources and recommendations. Personalised guidance for reapplication.",
        },
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
