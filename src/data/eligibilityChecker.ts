/**
 * Eligibility Checker Data
 *
 * Configuration for the eligibility checker component.
 */

export interface CheckerBenefit {
    text: string;
    icon: string;
}

export const benefits: CheckerBenefit[] = [
    { text: "No account required", icon: "fa-regular fa-circle-check" },
    { text: "Instant results", icon: "fa-regular fa-sparkles" },
    { text: "Email confirmation", icon: "fa-regular fa-envelope" },
];

export const checkerUrl = "https://unltduk.typeform.com/awards-checker";

// Typeform live embed ID
export const typeformLiveId = "01KA7RWQS22SHZE07GHDBWDV37";
