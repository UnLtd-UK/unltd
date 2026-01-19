/**
 * Embed Loader Configuration
 * 
 * This file contains site-specific configuration for the EmbedLoader component.
 * When copying this component to a new website, update this file with the
 * correct Zaraz consent purpose IDs from your Cloudflare dashboard.
 * 
 * To find your purpose IDs:
 * 1. Go to Cloudflare Dashboard → Zaraz → Consent Management → Purposes
 * 2. Copy the ID for each purpose
 */

// =============================================================================
// CONSENT PURPOSE IDS
// Update these with your Zaraz purpose IDs from the Cloudflare dashboard
// =============================================================================

export const CONSENT_PURPOSE_IDS = {
    /** Purpose ID for video embeds (YouTube) */
    VIDEOS: 'fAeW',
    /** Purpose ID for form embeds (Typeform) */
    FORMS: 'IaZk',
} as const;

// =============================================================================
// PRODUCTION HOSTNAME
// The hostname where consent checks should be enforced
// On other hostnames (localhost, preview URLs), consent is bypassed for testing
// =============================================================================

export const PRODUCTION_HOSTNAME = 'unltd.org.uk';

// =============================================================================
// PLATFORM CONFIGURATIONS
// Add or modify platforms as needed for your site
// =============================================================================

export interface PlatformConfig {
    name: string;
    owner: string;
    privacyPolicyUrl: string;
    type: 'video' | 'form' | 'embed' | 'social' | 'map';
    consentPurposeId: string;
    /** URL patterns to match (checked with includes()) */
    urlPatterns: string[];
}

export const PLATFORMS: PlatformConfig[] = [
    {
        name: 'YouTube',
        owner: 'Google',
        privacyPolicyUrl: 'https://policies.google.com/privacy',
        type: 'video',
        consentPurposeId: CONSENT_PURPOSE_IDS.VIDEOS,
        urlPatterns: ['youtube.com', 'youtu.be', 'youtube-nocookie.com'],
    },
    {
        name: 'Typeform',
        owner: 'Typeform',
        privacyPolicyUrl: 'https://www.typeform.com/help/a/gdpr-and-typeform-4405272379156/',
        type: 'form',
        consentPurposeId: CONSENT_PURPOSE_IDS.FORMS,
        urlPatterns: ['typeform.com'],
    },
];

// =============================================================================
// COOKIE CONFIGURATION
// =============================================================================

/** The name of the Zaraz consent cookie */
export const CONSENT_COOKIE_NAME = 'zaraz-consent';

// =============================================================================
// ANALYTICS CONFIGURATION
// =============================================================================

/** Purpose ID for analytics tools (PostHog, etc.) */
export const ANALYTICS_CONSENT_PURPOSE_ID = '';

// =============================================================================
// DEBUG / TESTING
// =============================================================================

/** 
 * Set to true to force consent checks on non-production environments.
 * Useful for testing the consent flow locally.
 */
export const FORCE_CONSENT_CHECK = true;

// =============================================================================
// EMBED LOADER STYLING
// Tailwind CSS classes for the EmbedLoader component states
// =============================================================================

export const EMBED_STYLES = {
    /** Loading state container */
    loading: {
        container: 'relative w-full h-full flex items-center justify-center bg-violet-950 rounded-md',
        text: 'animate-pulse text-violet-400 text-sm',
    },
    /** Iframe when consent is granted */
    iframe: 'rounded-md',
    /** Consent placeholder (when user hasn't consented yet) */
    consent: {
        container: 'absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-violet-950 to-violet-900 rounded-md p-6 text-center border border-violet-800',
        buttonPrimary: 'px-4 py-2 text-sm font-semibold text-amber-950 bg-amber-500 hover:bg-amber-400 rounded-md transition-colors cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-amber-400/50',
        buttonSecondary: 'px-4 py-2 text-sm font-medium text-violet-300 border border-violet-700 hover:bg-violet-800/50 hover:border-violet-600 rounded-md transition-colors focus:outline-hidden focus:ring-2 focus:ring-violet-400/50',
        disclaimer: 'text-xs text-violet-400 max-w-xs leading-relaxed',
        link: 'underline underline-offset-2 hover:text-violet-300 transition-colors',
    },
    /** Error state for unrecognized platforms */
    error: {
        container: 'relative w-full h-full flex items-center justify-center bg-violet-950 border border-red-800/50 rounded-md p-6',
        text: 'text-red-400 text-sm text-center',
    },
} as const;