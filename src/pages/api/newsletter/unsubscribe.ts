export const prerender = false;

import type { APIRoute } from "astro";
import { json, readBody, unavailable } from "@lib/newsletter/api";
import { getNewsletterConfig, unsubscribeContact } from "@lib/newsletter/resend";
import { verifyToken } from "@lib/newsletter/token";

export const POST: APIRoute = async (context) => {
    const config = getNewsletterConfig();
    if (!config) return unavailable();

    const body = await readBody(context);
    if (!body || typeof body.token !== "string") return json({ error: "invalid" }, 400);

    const result = await verifyToken(config.tokenSecret, body.token, "unsubscribe");
    if (!result.ok) return json({ error: result.reason }, 400);

    try {
        await unsubscribeContact(config, result.email);
    } catch (error) {
        console.error("[newsletter] unsubscribe failed", error);
        return json({ error: "server" }, 500);
    }

    return json({ ok: true });
};
