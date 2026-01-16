import { useCallback } from 'react';
import type { AnchorHTMLAttributes, MouseEvent } from 'react';
import '../../types/zaraz.d';
import { ANALYTICS_CONSENT_PURPOSE_ID, CONSENT_COOKIE_NAME } from '../../config/embed.config';

// Extend Window interface for Zaraz-managed PostHog
declare global {
    interface Window {
        posthog?: {
            capture: (event: string, properties?: Record<string, unknown>) => void;
            opt_out_capturing: () => void;
            has_opted_out_capturing: () => boolean;
        };
    }
}

// Check if PostHog consent is granted via Zaraz
function hasPosthogConsent(): boolean {
    if (typeof window === 'undefined') return false;

    // Check Zaraz consent API
    if (window.zaraz?.consent) {
        const consent = window.zaraz.consent.get(ANALYTICS_CONSENT_PURPOSE_ID);
        return consent === true;
    }

    // Fall back to checking the consent cookie directly
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === CONSENT_COOKIE_NAME && value) {
            try {
                const consent = JSON.parse(value);
                return consent[ANALYTICS_CONSENT_PURPOSE_ID] === true;
            } catch {
                try {
                    const decoded = decodeURIComponent(value);
                    const consent = JSON.parse(decoded);
                    return consent[ANALYTICS_CONSENT_PURPOSE_ID] === true;
                } catch {
                    return false;
                }
            }
        }
    }
    return false;
}

type PosthogTrackedLinkProps = {
    eventName: string;
    eventProperties?: Record<string, unknown>;
} & AnchorHTMLAttributes<HTMLAnchorElement>;

const PosthogTrackedLink = ({
    eventName,
    eventProperties,
    onClick,
    ...rest
}: PosthogTrackedLinkProps) => {
    const handleClick = useCallback(
        (event: MouseEvent<HTMLAnchorElement>) => {
            if (onClick) {
                onClick(event);
            }

            if (event.defaultPrevented) {
                return;
            }

            // Only capture if PostHog exists AND user has consented
            if (typeof window !== 'undefined' && window.posthog && hasPosthogConsent()) {
                window.posthog.capture(eventName, eventProperties);
            }
        },
        [eventName, eventProperties, onClick],
    );

    return <a {...rest} onClick={handleClick} />;
};

export default PosthogTrackedLink;
