import { env } from "cloudflare:workers";
import type { NewsletterConsent, RedeemResult } from "./consent-object";
import { hashForKey } from "./rate-limit";

async function getConsentObject(email: string): Promise<DurableObjectStub<NewsletterConsent>> {
    const namespace = (env as { NEWSLETTER_CONSENT?: DurableObjectNamespace<NewsletterConsent> }).NEWSLETTER_CONSENT;
    if (!namespace) throw new Error("Newsletter consent storage is unavailable");
    return namespace.get(namespace.idFromName(await hashForKey(email)));
}

export async function getNewsletterConsentVersion(email: string): Promise<string> {
    return (await getConsentObject(email)).getVersion();
}

// Runs `mutate` only if the consent version still matches, serialised per email
// by a Durable Object, and advances the version once it succeeds. Returns
// `{ ok: false }` when the version is stale; if `mutate` throws, the version is
// left unchanged.
export async function redeemNewsletterConsent<T>(
    email: string,
    expectedVersion: string,
    mutate: () => Promise<T>,
): Promise<RedeemResult<T>> {
    return (await getConsentObject(email)).redeem(expectedVersion, mutate);
}
