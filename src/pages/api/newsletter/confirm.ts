export const prerender = false;

import type { APIRoute } from "astro";
import { clientIp, json, readBody, unavailable } from "@lib/newsletter/api";
import { welcomeEmail } from "@lib/newsletter/emails";
import { getNewsletterConfig, sendEmail, subscribeContact } from "@lib/newsletter/resend";
import { hashForKey, isRateLimited } from "@lib/newsletter/rate-limit";
import { verifyToken } from "@lib/newsletter/token";

export const POST: APIRoute = async (context) => {
    const config = getNewsletterConfig();
    if (!config) return unavailable();

    const body = await readBody(context);
    if (!body || typeof body.token !== "string") return json({ error: "invalid" }, 400);

    const result = await verifyToken(config.tokenSecret, body.token, "confirm");
    if (!result.ok) return json({ error: result.reason }, 400);

    const limited =
        (await isRateLimited(`confirm-redeem:ip:${clientIp(context)}`, 30, 3600)) ||
        (await isRateLimited(`confirm-redeem:token:${await hashForKey(body.token)}`, 5, 3600));
    if (limited) return json({ error: "rate" }, 429);

    try {
        const outcome = await subscribeContact(config, result.email);
        if (outcome === "subscribed") {
            // Welcome email failure shouldn't undo a successful subscription.
            try {
                await sendEmail(config, { to: result.email, ...welcomeEmail(context.url.origin) });
            } catch (error) {
                console.error("[newsletter] welcome email failed", error);
            }
        }
    } catch (error) {
        console.error("[newsletter] confirm failed", error);
        return json({ error: "server" }, 500);
    }

    return json({ ok: true });
};
