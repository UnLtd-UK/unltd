/**
 * Award Application Phases Data
 *
 * Contains the journey phases and outcomes for the application process.
 * Used by the HowApplyingWorks component to render the timeline.
 */

export interface PhaseStep {
    title: string;
    description: string;
    icon: string;
    linkKey?: "eligibility" | "preview" | "budget" | "panel";
}

export interface Phase {
    id: string;
    title: string;
    subtitle: string;
    icon: string;
    color: "emerald" | "violet" | "amber" | "sky";
    steps: PhaseStep[];
}

export interface Outcome {
    title: string;
    subtitle: string;
    icon: string;
    items: string[];
}

export const phases: Phase[] = [
    {
        id: "prepare",
        title: "Prepare",
        subtitle: "Get ready to apply",
        icon: "fa-solid fa-lightbulb",
        color: "emerald",
        steps: [
            {
                title: "Check Eligibility",
                description:
                    "Use our eligibility checker to confirm you meet all criteria before you start.",
                icon: "fa-solid fa-clipboard-check",
                linkKey: "eligibility",
            },
            {
                title: "Preview Questions",
                description:
                    "Download a copy of the application to understand what's required and draft your answers offline.",
                icon: "fa-solid fa-file-lines",
                linkKey: "preview",
            },
            {
                title: "Plan Your Budget",
                description:
                    "Learn what you can include and how to present your Award budget effectively.",
                icon: "fa-solid fa-coins",
                linkKey: "budget",
            },
        ],
    },
    {
        id: "apply",
        title: "Apply",
        subtitle: "Submit your application",
        icon: "fa-solid fa-paper-plane",
        color: "violet",
        steps: [
            {
                title: "Complete Application",
                description:
                    "Fill out all sections of the online application form through our portal.",
                icon: "fa-solid fa-pen-to-square",
            },
            {
                title: "Submit Before Deadline",
                description:
                    "We assess applications in rounds. Submit before the round closes to be considered.",
                icon: "fa-solid fa-clock",
            },
        ],
    },
    {
        id: "assess",
        title: "Assessment",
        subtitle: "We review your application",
        icon: "fa-solid fa-magnifying-glass",
        color: "amber",
        steps: [
            {
                title: "Suitability Check",
                description:
                    "Your application is reviewed against social impact, inclusion, and financial sustainability criteria.",
                icon: "fa-solid fa-shield-halved",
            },
            {
                title: "Peer Review",
                description:
                    "Support Managers discuss your application together. Strong applications progress to panel.",
                icon: "fa-solid fa-people-group",
            },
            {
                title: "Panel Meeting",
                description:
                    "Discuss your venture with staff and experienced social entrepreneurs in a supportive setting.",
                icon: "fa-solid fa-comments",
                linkKey: "panel",
            },
            {
                title: "Committee Approval",
                description:
                    "Final recommendations go to the Awards Committee for approval.",
                icon: "fa-solid fa-gavel",
            },
        ],
    },
    {
        id: "outcome",
        title: "Outcome",
        subtitle: "Receive your decision",
        icon: "fa-solid fa-envelope-open-text",
        color: "sky",
        steps: [
            {
                title: "Decision Email",
                description:
                    "We'll email you with the outcome of your application and detailed feedback.",
                icon: "fa-solid fa-envelope",
            },
        ],
    },
];

export const outcomes: Record<"success" | "unsuccessful", Outcome> = {
    success: {
        title: "If successful",
        subtitle: "Welcome to the community",
        icon: "fa-solid fa-party-horn",
        items: [
            "Welcome pack with cohort information",
            "Budget & reporting guidance",
            "Dedicated Support Manager introduction",
        ],
    },
    unsuccessful: {
        title: "If unsuccessful",
        subtitle: "Support to try again",
        icon: "fa-solid fa-arrows-rotate",
        items: [
            "Detailed feedback on your application",
            "Resources to develop your venture",
            "Encouragement to reapply",
        ],
    },
};

// Color mapping for Tailwind classes
export const colorClasses = {
    emerald: {
        bg: "bg-emerald-500",
        bgLight: "bg-emerald-50 dark:bg-emerald-950/50",
        bgLighter: "bg-emerald-100 dark:bg-emerald-900/30",
        border: "border-emerald-200 dark:border-emerald-800",
        text: "text-emerald-600 dark:text-emerald-400",
        textDark: "text-emerald-700 dark:text-emerald-300",
        ring: "ring-emerald-500/20",
        gradient: "from-emerald-500 to-teal-500",
    },
    violet: {
        bg: "bg-violet-500",
        bgLight: "bg-violet-50 dark:bg-violet-950/50",
        bgLighter: "bg-violet-100 dark:bg-violet-900/30",
        border: "border-violet-200 dark:border-violet-800",
        text: "text-violet-600 dark:text-violet-400",
        textDark: "text-violet-700 dark:text-violet-300",
        ring: "ring-violet-500/20",
        gradient: "from-violet-500 to-purple-500",
    },
    amber: {
        bg: "bg-amber-500",
        bgLight: "bg-amber-50 dark:bg-amber-950/50",
        bgLighter: "bg-amber-100 dark:bg-amber-900/30",
        border: "border-amber-200 dark:border-amber-800",
        text: "text-amber-600 dark:text-amber-400",
        textDark: "text-amber-700 dark:text-amber-300",
        ring: "ring-amber-500/20",
        gradient: "from-amber-500 to-orange-500",
    },
    sky: {
        bg: "bg-sky-500",
        bgLight: "bg-sky-50 dark:bg-sky-950/50",
        bgLighter: "bg-sky-100 dark:bg-sky-900/30",
        border: "border-sky-200 dark:border-sky-800",
        text: "text-sky-600 dark:text-sky-400",
        textDark: "text-sky-700 dark:text-sky-300",
        ring: "ring-sky-500/20",
        gradient: "from-sky-500 to-blue-500",
    },
} as const;

export type PhaseColor = keyof typeof colorClasses;

// Link configurations for steps (applied based on props)
export const stepLinks = {
    eligibility: {
        label: "Check eligibility",
        href: "/awards/eligibility",
        icon: "fa-solid fa-arrow-right",
    },
    preview: {
        label: "Download preview",
        href: "/resources/application-form-preview",
        icon: "fa-solid fa-download",
    },
    budget: {
        label: "Budget guidance",
        href: "/resources/award-budget-guidance",
        icon: "fa-solid fa-arrow-right",
    },
    panel: {
        label: "Panel guide",
        href: "/resources/panel-meeting-guide",
        icon: "fa-solid fa-arrow-right",
    },
} as const;

export type StepLinkKey = keyof typeof stepLinks;
