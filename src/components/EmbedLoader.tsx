import { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpRightFromSquare } from '@awesome.me/kit-0ff725f684/icons/classic/solid';
import '../types/zaraz.d';
import {
    PLATFORMS,
    CONSENT_COOKIE_NAME,
    PRODUCTION_HOSTNAME,
    FORCE_CONSENT_CHECK,
    EMBED_STYLES,
    type PlatformConfig,
} from '../config/embed.config';

interface EmbedLoaderProps {
    src: string;
    title: string;
    className?: string;
}

const CONSENT_EVENT_NAME = 'media_consent_granted';
const ZARAZ_CONSENT_UPDATED_EVENT = 'zarazConsentChoicesUpdated';

// Parse the zaraz-consent cookie to check for specific purpose consent
function getConsentFromCookie(purposeId: string): boolean {
    if (typeof document === 'undefined') return false;

    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === CONSENT_COOKIE_NAME && value) {
            try {
                // Try parsing as plain JSON first (Zaraz format)
                const consent = JSON.parse(value);
                return consent[purposeId] === true;
            } catch {
                try {
                    // Fall back to URL-decoded if that fails
                    const decoded = decodeURIComponent(value);
                    const consent = JSON.parse(decoded);
                    return consent[purposeId] === true;
                } catch {
                    return false;
                }
            }
        }
    }
    return false;
}

// Detect platform from URL and return platform config
function getPlatformConfig(url: string): Omit<PlatformConfig, 'urlPatterns'> | null {
    for (const platform of PLATFORMS) {
        if (platform.urlPatterns.some(pattern => url.includes(pattern))) {
            return platform;
        }
    }
    return null;
}

/**
 * Convert any supported URL to its embed-friendly version
 * 
 * Supports:
 * - YouTube: watch URLs, short URLs, and embed URLs → youtube-nocookie.com/embed
 * - Typeform: regular URLs → embed URLs with embed parameter
 */
function convertToEmbedUrl(url: string): string {
    // =========================================================================
    // YOUTUBE
    // =========================================================================

    // Already using nocookie embed
    if (url.includes('youtube-nocookie.com/embed/')) {
        return url;
    }

    // youtube.com/embed/ → convert to nocookie
    if (url.includes('youtube.com/embed/')) {
        return url.replace('youtube.com/embed/', 'youtube-nocookie.com/embed/');
    }

    // youtube.com/watch?v=VIDEO_ID → nocookie embed
    const youtubeWatchMatch = url.match(/youtube\.com\/watch\?v=([^&]+)/);
    if (youtubeWatchMatch) {
        return `https://www.youtube-nocookie.com/embed/${youtubeWatchMatch[1]}`;
    }

    // youtu.be/VIDEO_ID → nocookie embed
    const youtubeShortMatch = url.match(/youtu\.be\/([^?]+)/);
    if (youtubeShortMatch) {
        return `https://www.youtube-nocookie.com/embed/${youtubeShortMatch[1]}`;
    }

    // =========================================================================
    // TYPEFORM
    // =========================================================================

    // Typeform URLs generally work as-is for iframe embeds
    // Just ensure it has the embed parameter
    if (url.includes('typeform.com') && !url.includes('typeform-embed')) {
        const separator = url.includes('?') ? '&' : '?';
        return `${url}${separator}typeform-embed=embed-widget`;
    }

    // Return unchanged if no conversion needed
    return url;
}

// Get action button text
function getActionText(platformName: string) {
    return `Load ${platformName} embed`;
}

export default function EmbedLoader({
    src,
    title,
    className = '',
}: EmbedLoaderProps) {
    const [hasConsent, setHasConsent] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Get platform config from URL
    const platformConfig = getPlatformConfig(src);

    // If platform not recognized, don't render the embed
    if (!platformConfig) {
        console.warn(`EmbedLoader: Unrecognized platform for URL: ${src}. Please add this platform to embed.config.ts`);
        return (
            <div className={`${EMBED_STYLES.error.container} ${className}`}>
                <p className={EMBED_STYLES.error.text}>
                    This embed platform is not configured. Please contact the site administrator.
                </p>
            </div>
        );
    }

    const consentPurposeId = platformConfig.consentPurposeId;

    // Convert URL to embed-friendly version (e.g., watch URLs → embed URLs)
    const embedSrc = convertToEmbedUrl(src);

    // Check if we should bypass consent (non-production environment)
    const shouldBypassConsent = useCallback(() => {
        if (FORCE_CONSENT_CHECK) return false; // Force consent check for testing
        if (typeof window === 'undefined') return false;
        return window.location.hostname !== PRODUCTION_HOSTNAME;
    }, []);

    // Check current consent status
    const checkConsentStatus = useCallback(() => {
        if (shouldBypassConsent()) {
            setHasConsent(true);
            setIsLoading(false);
            return;
        }

        // Check Zaraz API first (this is the source of truth)
        if (typeof window !== 'undefined' && window.zaraz?.consent) {
            const consent = window.zaraz.consent.get(consentPurposeId);
            setHasConsent(consent === true);
            setIsLoading(false);
            return;
        }

        // Zaraz not yet loaded, retry after a short delay
        setTimeout(() => {
            if (typeof window !== 'undefined' && window.zaraz?.consent) {
                const consent = window.zaraz.consent.get(consentPurposeId);
                setHasConsent(consent === true);
            } else {
                // Fall back to cookie if Zaraz API still not available
                const cookieConsent = getConsentFromCookie(consentPurposeId);
                setHasConsent(cookieConsent);
            }
            setIsLoading(false);
        }, 1000);
    }, [shouldBypassConsent, consentPurposeId]);

    // Handle consent granted event from other embed loaders (only if same purpose)
    const handleConsentGranted = useCallback((event: Event) => {
        const customEvent = event as CustomEvent<{ purposeId?: string }>;
        // Only update if the consent is for the same purpose, or no purpose specified (legacy)
        if (!customEvent.detail?.purposeId || customEvent.detail.purposeId === consentPurposeId) {
            setHasConsent(true);
        }
    }, [consentPurposeId]);

    // Handle Zaraz consent choices updated (including revocation)
    const handleZarazConsentUpdated = useCallback(() => {
        if (shouldBypassConsent()) {
            return;
        }

        // Check Zaraz API first (this is the source of truth)
        if (typeof window !== 'undefined' && window.zaraz?.consent) {
            const consent = window.zaraz.consent.get(consentPurposeId);
            setHasConsent(consent === true);
        } else {
            // Fall back to cookie only if Zaraz API not available
            const cookieConsent = getConsentFromCookie(consentPurposeId);
            setHasConsent(cookieConsent);
        }
    }, [shouldBypassConsent, consentPurposeId]);

    useEffect(() => {
        checkConsentStatus();

        // Listen for consent events from other embed loaders
        window.addEventListener(CONSENT_EVENT_NAME, handleConsentGranted);

        // Listen for Zaraz consent changes (including revocation)
        document.addEventListener(ZARAZ_CONSENT_UPDATED_EVENT, handleZarazConsentUpdated);

        return () => {
            window.removeEventListener(CONSENT_EVENT_NAME, handleConsentGranted);
            document.removeEventListener(ZARAZ_CONSENT_UPDATED_EVENT, handleZarazConsentUpdated);
        };
    }, [checkConsentStatus, handleConsentGranted, handleZarazConsentUpdated]);

    // Handle "Load Content" button click
    const handleLoadEmbed = () => {
        // Update via Zaraz API if available (this is the source of truth)
        if (typeof window !== 'undefined' && window.zaraz?.consent) {
            window.zaraz.consent.set({ [consentPurposeId]: true });
        }

        // Update local state
        setHasConsent(true);

        // Dispatch custom event to sync other embed loaders on the page (include purpose ID)
        window.dispatchEvent(new CustomEvent(CONSENT_EVENT_NAME, {
            detail: { purposeId: consentPurposeId }
        }));
    };

    // Show loading state
    if (isLoading) {
        return (
            <div className={`${EMBED_STYLES.loading.container} ${className}`}>
                <div className={EMBED_STYLES.loading.text}>
                    Loading...
                </div>
            </div>
        );
    }

    // Show iframe if consent is granted
    if (hasConsent) {
        return (
            <iframe
                src={embedSrc}
                title={title}
                frameBorder="0"
                allow="fullscreen; autoplay; encrypted-media"
                allowFullScreen
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                className={`${EMBED_STYLES.iframe} ${className}`}
            />
        );
    }

    // Show consent placeholder
    return (
        <div
            className={`${EMBED_STYLES.consent.container} ${className}`}
        >
            {/* Action buttons */}
            <div className="flex gap-3 items-center">
                {/* Load Content */}
                <button
                    onClick={handleLoadEmbed}
                    className={EMBED_STYLES.consent.buttonPrimary}
                >
                    {getActionText(platformConfig.name)}
                </button>

                {/* Open in new tab */}
                <a
                    href={src}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={EMBED_STYLES.consent.buttonSecondary}
                >
                    Open on {platformConfig.name} <FontAwesomeIcon icon={faUpRightFromSquare} className="ml-1" />
                </a>
            </div>

            {/* Disclaimer */}
            <p className={EMBED_STYLES.consent.disclaimer}>
                By loading this embed, you agree to external media using your browser storage.{' '}
                {platformConfig.owner ? (
                    <>
                        We use {platformConfig.name}, which is owned by {platformConfig.owner}. Please read{' '}
                        <a
                            href={platformConfig.privacyPolicyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={EMBED_STYLES.consent.link}
                        >
                            their privacy policy
                        </a>.
                    </>
                ) : (
                    <>
                        Please read the provider's privacy policy before loading.
                    </>
                )}
            </p>
        </div>
    );
}
