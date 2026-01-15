/**
 * Topic Configuration
 * Centralized configuration for resource topics with labels, icons, and colors
 */

export interface TopicConfig {
    label: string;
    icon: string;
    color: string;
    bgClass: string;
    textClass: string;
    ringClass: string;
}

export const topicConfig: Record<string, TopicConfig> = {
    "strategy-foundations": {
        label: "Strategy & Foundations",
        icon: "compass",
        color: "violet",
        bgClass: "bg-violet-500/20",
        textClass: "text-violet-300",
        ringClass: "ring-violet-400/30",
    },
    "product-technology": {
        label: "Product & Technology",
        icon: "laptop",
        color: "sky",
        bgClass: "bg-sky-500/20",
        textClass: "text-sky-300",
        ringClass: "ring-sky-400/30",
    },
    "legal-compliance": {
        label: "Legal & Compliance",
        icon: "shield-halved",
        color: "slate",
        bgClass: "bg-slate-500/20",
        textClass: "text-slate-300",
        ringClass: "ring-slate-400/30",
    },
    "growth-marketing": {
        label: "Growth & Marketing",
        icon: "chart-line",
        color: "emerald",
        bgClass: "bg-emerald-500/20",
        textClass: "text-emerald-300",
        ringClass: "ring-emerald-400/30",
    },
    "finance-operations": {
        label: "Finance & Operations",
        icon: "coins",
        color: "amber",
        bgClass: "bg-amber-500/20",
        textClass: "text-amber-300",
        ringClass: "ring-amber-400/30",
    },
    "team-culture": {
        label: "Team & Culture",
        icon: "users",
        color: "rose",
        bgClass: "bg-rose-500/20",
        textClass: "text-rose-300",
        ringClass: "ring-rose-400/30",
    },
    "personal-development": {
        label: "Personal Development",
        icon: "user",
        color: "teal",
        bgClass: "bg-teal-500/20",
        textClass: "text-teal-300",
        ringClass: "ring-teal-400/30",
    },
    "unltd-award": {
        label: "UnLtd Award",
        icon: "award",
        color: "fuchsia",
        bgClass: "bg-fuchsia-500/20",
        textClass: "text-fuchsia-300",
        ringClass: "ring-fuchsia-400/30",
    },
};

/**
 * Get the label for a topic slug
 * Falls back to the slug if not found
 */
export function getTopicLabel(slug: string | undefined): string | null {
    if (!slug) return null;
    return topicConfig[slug]?.label || slug;
}

/**
 * Get the full config for a topic slug
 */
export function getTopicConfig(slug: string | undefined): TopicConfig | null {
    if (!slug) return null;
    return topicConfig[slug] || null;
}

/**
 * Topic display order for "By Topic" view
 */
export const topicOrder = [
    "strategy-foundations",
    "product-technology",
    "legal-compliance",
    "growth-marketing",
    "finance-operations",
    "team-culture",
    "personal-development",
    "unltd-award",
];
