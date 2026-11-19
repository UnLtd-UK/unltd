import type { APIContext } from "astro";

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function json(body: Record<string, unknown>, status = 200): Response {
    return new Response(JSON.stringify(body), {
        status,
        headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
}

export const unavailable = () => json({ error: "The newsletter is not available right now. Please try again later." }, 503);

export function normaliseEmail(value: unknown): string | null {
    if (typeof value !== "string") return null;
    const email = value.trim().toLowerCase();
    return email.length <= 254 && EMAIL_PATTERN.test(email) ? email : null;
}

// Parses a same-origin JSON body; returns null for cross-origin or malformed requests.
export async function readBody(context: APIContext): Promise<Record<string, unknown> | null> {
    const origin = context.request.headers.get("origin");
    if (origin && origin !== context.url.origin) return null;
    try {
        const body = await context.request.json();
        return body && typeof body === "object" ? (body as Record<string, unknown>) : null;
    } catch {
        return null;
    }
}

export function clientIp(context: APIContext): string {
    return context.request.headers.get("cf-connecting-ip") ?? "unknown";
}
