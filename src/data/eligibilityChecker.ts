/**
 * Eligibility Checker Data
 *
 * Configuration for the eligibility checker component.
 */

export interface CheckerBenefit {
    text: string;
    iconName: string;
    iconStyle: "solid" | "regular" | "brands";
}

export const benefits: CheckerBenefit[] = [
    { text: "No account required", iconName: "circle-check", iconStyle: "regular" },
    { text: "Instant results", iconName: "sparkles", iconStyle: "regular" },
    { text: "Email confirmation", iconName: "envelope", iconStyle: "regular" },
];

export const checkerUrl = "https://unltduk.typeform.com/awards-checker";

// Typeform live embed ID
export const typeformLiveId = "01KA7RWQS22SHZE07GHDBWDV37";
