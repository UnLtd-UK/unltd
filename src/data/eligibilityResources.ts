/**
 * Eligibility Resources Data
 * 
 * Resources and support options shown on eligibility confirmation pages.
 * Structured for future Directus CMS integration.
 */

export interface Resource {
    /** Unique identifier */
    id: string;
    /** Display title */
    title: string;
    /** Short description */
    description: string;
    /** URL or path - can be internal (/path) or external (https://...) */
    href: string;
    /** Whether this is an external link */
    isExternal: boolean;
    /** Font Awesome icon class */
    icon: string;
    /** Icon background color class (Tailwind) */
    iconBgColor: string;
    /** Icon color class (Tailwind) */
    iconColor: string;
    /** Sort order */
    sortOrder: number;
}

export interface SupportOption {
    /** Unique identifier */
    id: string;
    /** Display title */
    title: string;
    /** Short description */
    description: string;
    /** URL, path, or mailto link */
    href: string;
    /** Link type: 'internal' | 'external' | 'email' */
    linkType: 'internal' | 'external' | 'email';
    /** Font Awesome icon class */
    icon: string;
    /** Icon background color class for light mode */
    iconBgColorLight: string;
    /** Icon background color class for dark mode */
    iconBgColorDark: string;
    /** Icon color class for light mode */
    iconColorLight: string;
    /** Icon color class for dark mode */
    iconColorDark: string;
    /** Hover border color class for light mode */
    hoverBorderColorLight: string;
    /** Hover border color class for dark mode */
    hoverBorderColorDark: string;
    /** Arrow/action icon color on hover */
    hoverIconColor: string;
    /** Sort order */
    sortOrder: number;
}

export interface ApplicationPreviewMapping {
    /** Trading status key */
    tradingStatus: 'idea' | 'under-1-year' | 'under-4-years';
    /** URL slug for the application preview page */
    previewSlug: string;
    /** Human-readable description */
    description: string;
}

/**
 * Application preparation resources
 * Shown in the resources row below the hero
 */
export const applicationResources: Resource[] = [
    {
        id: 'application-preview',
        title: 'Application Preview',
        description: 'See the questions',
        href: '/awards/{previewSlug}', // Dynamic - replaced with trading status mapping
        isExternal: false,
        icon: 'fa-solid fa-file-lines',
        iconBgColor: 'bg-emerald-400/20',
        iconColor: 'text-emerald-300',
        sortOrder: 1,
    },
    {
        id: 'budget-guidance',
        title: 'Budget Guidance',
        description: 'Plan your spending',
        href: '/spaces/award-budget-guidance',
        isExternal: false,
        icon: 'fa-solid fa-coins',
        iconBgColor: 'bg-amber-500/20',
        iconColor: 'text-amber-300',
        sortOrder: 2,
    },
    {
        id: 'panel-meeting-guide',
        title: 'Panel Meeting Guide',
        description: 'Prepare for interview',
        href: '/spaces/panel-meeting-guide',
        isExternal: false,
        icon: 'fa-solid fa-users',
        iconBgColor: 'bg-violet-500/20',
        iconColor: 'text-violet-300',
        sortOrder: 3,
    },
    {
        id: 'info-sessions',
        title: 'Info Sessions',
        description: 'Join a live Q&A on Eventbrite',
        href: 'https://www.eventbrite.com/cc/for-social-entrepreneurs-4794111',
        isExternal: true,
        icon: 'fa-solid fa-calendar-check',
        iconBgColor: 'bg-blue-500/20',
        iconColor: 'text-blue-300',
        sortOrder: 4,
    },
];

/**
 * Additional support options
 * Shown in a separate row for accessibility and regional support
 */
export const supportOptions: SupportOption[] = [
    {
        id: 'visual-impairment',
        title: 'Visual Impairment',
        description: 'Screen reader assistance',
        href: 'mailto:awardapplications@unltd.org.uk',
        linkType: 'email',
        icon: 'fa-solid fa-eye',
        iconBgColorLight: 'bg-blue-100',
        iconBgColorDark: 'bg-blue-900/50',
        iconColorLight: 'text-blue-600',
        iconColorDark: 'text-blue-400',
        hoverBorderColorLight: 'hover:border-blue-300',
        hoverBorderColorDark: 'dark:hover:border-blue-600',
        hoverIconColor: 'group-hover:text-blue-500',
        sortOrder: 1,
    },
    {
        id: 'additional-needs',
        title: 'Additional Needs',
        description: '1-to-1 assistance sessions',
        href: '/spaces/assistance-for-those-with-additional-support-needs',
        linkType: 'internal',
        icon: 'fa-solid fa-hands-holding-heart',
        iconBgColorLight: 'bg-emerald-100',
        iconBgColorDark: 'bg-emerald-900/50',
        iconColorLight: 'text-emerald-600',
        iconColorDark: 'text-emerald-400',
        hoverBorderColorLight: 'hover:border-emerald-300',
        hoverBorderColorDark: 'dark:hover:border-emerald-600',
        hoverIconColor: 'group-hover:text-emerald-500',
        sortOrder: 2,
    },
    {
        id: 'wales-support',
        title: 'Living in Wales',
        description: 'Local support networks',
        href: '/spaces/assistance-for-those-living-in-wales',
        linkType: 'internal',
        icon: 'fa-solid fa-dragon',
        iconBgColorLight: 'bg-rose-100',
        iconBgColorDark: 'bg-rose-900/50',
        iconColorLight: 'text-rose-600',
        iconColorDark: 'text-rose-400',
        hoverBorderColorLight: 'hover:border-rose-300',
        hoverBorderColorDark: 'dark:hover:border-rose-600',
        hoverIconColor: 'group-hover:text-rose-500',
        sortOrder: 3,
    },
];

/**
 * Mapping from trading status to application preview page slugs
 * Used to generate the correct preview URL based on eligibility
 */
export const applicationPreviewMappings: ApplicationPreviewMapping[] = [
    {
        tradingStatus: 'idea',
        previewSlug: 'Idea+stage+or+not+yet+trading',
        description: 'For applicants with an idea that is not yet trading',
    },
    {
        tradingStatus: 'under-1-year',
        previewSlug: 'Trading+for+less+than+1+year',
        description: 'For applicants trading for less than 1 year',
    },
    {
        tradingStatus: 'under-4-years',
        previewSlug: 'Trading+for+more+than+1+year',
        description: 'For applicants trading for more than 1 year (scaling up)',
    },
];

/**
 * Helper to get the application preview URL for a trading status
 */
export const getApplicationPreviewUrl = (tradingStatus: string): string => {
    const mapping = applicationPreviewMappings.find(m => m.tradingStatus === tradingStatus);
    const slug = mapping?.previewSlug || applicationPreviewMappings[0].previewSlug;
    return `/awards/${slug}`;
};

/**
 * Section labels and descriptions
 * For the resources and support sections
 */
export const sectionContent = {
    resources: {
        icon: 'fa-solid fa-books',
        label: 'Resources to help you apply',
    },
    support: {
        icon: 'fa-solid fa-hand-holding-heart',
        label: "Need extra support? We're here to help",
    },
};

/**
 * Email confirmation message template
 */
export const emailConfirmation = {
    icon: 'fa-solid fa-envelope-circle-check',
    messageTemplate: "We've emailed {email} a link to this page",
};

/**
 * Multiple awards notice
 */
export const multipleAwardsNotice = {
    icon: 'fa-solid fa-info-circle',
    message: 'You can only apply for one Award at a time. Choose the programme that best fits your needs.',
};

/**
 * CTA section content
 */
export const ctaContent = {
    title: 'Ready to apply?',
    description: "You've got everything you need. If the round is open, submit your application through our portal.",
    applyButton: {
        text: 'Start Your Application',
        href: 'https://portal.unltd.org.uk/apply',
        icon: 'fa-solid fa-rocket',
    },
    closedMessage: {
        icon: 'fa-solid fa-clock',
        textTemplate: 'Applications open {date}',
        subtext: 'Use this time to prepare your application using the resources above.',
    },
};

/**
 * Placeholder card for when only one award is shown
 */
export const otherAwardsPlaceholder = {
    icon: 'fa-solid fa-question',
    title: 'Other Awards',
    description: 'Additional Awards may be available based on your eligibility',
};
