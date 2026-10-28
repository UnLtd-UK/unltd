import {
    NEWSLETTER_FROM,
    NEWSLETTER_TOKEN_SECRET,
    RESEND_API_KEY,
    RESEND_SEGMENT_ID,
    RESEND_TOPIC_ID,
    TURNSTILE_SECRET_KEY,
} from "astro:env/server";

export interface NewsletterConfig {
    apiKey: string;
    segmentId: string;
    topicId?: string;
    from: string;
    tokenSecret: string;
    turnstileSecret: string;
}

// Returns null when the worker isn't configured (e.g. branch previews) so
// routes can respond with a graceful 503.
export function getNewsletterConfig(): NewsletterConfig | null {
    if (!RESEND_API_KEY || !RESEND_SEGMENT_ID || !NEWSLETTER_TOKEN_SECRET || !TURNSTILE_SECRET_KEY) {
        return null;
    }
    return {
        apiKey: RESEND_API_KEY,
        segmentId: RESEND_SEGMENT_ID,
        topicId: RESEND_TOPIC_ID || undefined,
        from: NEWSLETTER_FROM || "UnLtd <newsletter@unltd.org.uk>",
        tokenSecret: NEWSLETTER_TOKEN_SECRET,
        turnstileSecret: TURNSTILE_SECRET_KEY,
    };
}

const API = "https://api.resend.com";

// Resend defaults to 2 requests/second, so retry once on 429.
async function resendFetch(config: NewsletterConfig, path: string, init: RequestInit = {}): Promise<Response> {
    const request = () =>
        fetch(`${API}${path}`, {
            ...init,
            headers: {
                Authorization: `Bearer ${config.apiKey}`,
                "Content-Type": "application/json",
                ...init.headers,
            },
        });

    let response = await request();
    if (response.status === 429) {
        const wait = Math.min(Number(response.headers.get("retry-after")) || 1, 3);
        await new Promise((resolve) => setTimeout(resolve, wait * 1000));
        response = await request();
    }
    return response;
}

async function assertOk(response: Response, action: string): Promise<void> {
    if (!response.ok) {
        throw new Error(`Resend ${action} failed: ${response.status} ${await response.text()}`);
    }
}

const contactPath = (email: string) => `/contacts/${encodeURIComponent(email)}`;

export interface Contact {
    id: string;
    unsubscribed: boolean;
}

export async function getContact(config: NewsletterConfig, email: string): Promise<Contact | null> {
    const response = await resendFetch(config, contactPath(email));
    if (response.status === 404) return null;
    await assertOk(response, "get contact");
    const data = (await response.json()) as Contact;
    return { id: data.id, unsubscribed: data.unsubscribed };
}

export async function isSubscribed(config: NewsletterConfig, email: string): Promise<boolean> {
    const contact = await getContact(config, email);
    return contact !== null && !contact.unsubscribed;
}

// Returns whether anything changed, so callers only send the welcome email
// on a genuine new/re-subscription (confirm links can be replayed).
export async function subscribeContact(config: NewsletterConfig, email: string): Promise<"subscribed" | "unchanged"> {
    const topics = config.topicId ? [{ id: config.topicId, subscription: "opt_in" }] : undefined;
    const existing = await getContact(config, email);

    if (!existing) {
        const response = await resendFetch(config, "/contacts", {
            method: "POST",
            body: JSON.stringify({
                email,
                unsubscribed: false,
                segments: [{ id: config.segmentId }],
                ...(topics && { topics }),
            }),
        });
        await assertOk(response, "create contact");
        return "subscribed";
    }

    if (!existing.unsubscribed) return "unchanged";

    await assertOk(
        await resendFetch(config, contactPath(email), {
            method: "PATCH",
            body: JSON.stringify({ unsubscribed: false }),
        }),
        "update contact",
    );
    await assertOk(
        await resendFetch(config, `${contactPath(email)}/segments/${config.segmentId}`, { method: "POST" }),
        "add contact to segment",
    );
    if (topics) {
        await assertOk(
            await resendFetch(config, `${contactPath(email)}/topics`, {
                method: "PATCH",
                body: JSON.stringify({ topics }),
            }),
            "update contact topics",
        );
    }
    return "subscribed";
}

export async function unsubscribeContact(config: NewsletterConfig, email: string): Promise<void> {
    const existing = await getContact(config, email);
    if (!existing || existing.unsubscribed) return;
    await assertOk(
        await resendFetch(config, contactPath(email), {
            method: "PATCH",
            body: JSON.stringify({ unsubscribed: true }),
        }),
        "unsubscribe contact",
    );
}

export interface OutgoingEmail {
    to: string;
    subject: string;
    html: string;
    text: string;
    headers?: Record<string, string>;
}

export async function sendEmail(config: NewsletterConfig, email: OutgoingEmail): Promise<void> {
    await assertOk(
        await resendFetch(config, "/emails", {
            method: "POST",
            body: JSON.stringify({ from: config.from, ...email }),
        }),
        "send email",
    );
}
