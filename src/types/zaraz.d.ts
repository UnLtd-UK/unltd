// Global type declaration for Cloudflare Zaraz
declare global {
    interface Window {
        zaraz?: {
            showConsentModal?: () => void;
            consent?: {
                get: (purposeId: string) => boolean | undefined;
                getAll: () => Record<string, boolean>;
                set: (purposes: Record<string, boolean>) => void;
                setAll: (consentStatus: boolean) => void;
                APIReady?: boolean;
            };
        };
    }
}

export { };