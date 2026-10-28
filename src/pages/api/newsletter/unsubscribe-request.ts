export const prerender = false;

import type { APIRoute } from "astro";
import { clientIp, json, normaliseEmail, readBody, unavailable } from "@lib/newsletter/api";
import { unsubscribeVerificationEmail } from "@lib/newsletter/emails";
import { hashForKey, isRateLimited } from "@lib/newsletter/rate-limit";
import { getNewsletterConfig, isSubscribed, sendEmail } from "@lib/newsletter/resend";
import { createToken } from "@lib/newsletter/token";
import { verifyTurnstile } from "@lib/newsletter/turnstile";

// Same response whether or not the address is subscribed, so this endpoint
// can't be used to discover who is on the list.
const GENERIC_OK = {
    ok: true,
    message: "If that address is subscribed, we've sent you an email with a link to confirm unsubscribing.",
};

export const POST: APIRoute = async (context) => {
    const config = getNewsletterConfig();
    if (!config) return unavailable();

    const body = await readBody(context);
    if (!body) return json({ error: "Invalid request." }, 400);

    if (typeof body.website === "string" && body.website.length > 0) return json(GENERIC_OK);

    const email = normaliseEmail(body.email);
    if (!email) return json({ error: "Please enter a valid email address." }, 400);

    const ip = clientIp(context);
    if (!(await verifyTurnstile(config.turnstileSecret, String(body.turnstileToken ?? ""), ip))) {
        return json({ error: "We couldn't verify you're human. Please try again." }, 400);
    }

    const limited =
        (await isRateLimited(`unsubscribe:ip:${ip}`, 10, 3600)) ||
        (await isRateLimited(`unsubscribe:email:${await hashForKey(email)}`, 1, 600));
    if (limited) return json({ error: "Too many requests. Please try again in a few minutes." }, 429);

    try {
        if (await isSubscribed(config, email)) {
            const token = await createToken(config.tokenSecret, email, "unsubscribe");
            const url = `${context.url.origin}/newsletter/unsubscribe?token=${encodeURIComponent(token)}`;
            await sendEmail(config, { to: email, ...unsubscribeVerificationEmail(url) });
        }
    } catch (error) {
        console.error("[newsletter] unsubscribe request failed", error);
        return json({ error: "Something went wrong. Please try again later." }, 500);
    }

    return json(GENERIC_OK);
};
