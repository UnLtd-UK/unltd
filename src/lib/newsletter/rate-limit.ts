import { env } from "cloudflare:workers";

// Best-effort fixed-window limiter on the existing SESSION KV namespace.
// KV is eventually consistent, so this deters casual abuse; Turnstile is the
// primary defence. Fails open if KV is unavailable.
export async function isRateLimited(key: string, limit: number, windowSeconds: number): Promise<boolean> {
    const kv = (env as { SESSION?: KVNamespace }).SESSION;
    if (!kv) return false;

    const windowId = Math.floor(Date.now() / (windowSeconds * 1000));
    const kvKey = `newsletter:rl:${key}:${windowId}`;
    try {
        const current = Number((await kv.get(kvKey)) ?? 0);
        if (current >= limit) return true;
        // KV requires an expiration TTL of at least 60 seconds; the window is part
        // of the key so counts reset at the window boundary.
        await kv.put(kvKey, String(current + 1), { expirationTtl: Math.max(windowSeconds, 60) });
        return false;
    } catch (error) {
        console.error("[newsletter] rate limit check failed", error);
        return false;
    }
}

export async function hashForKey(value: string): Promise<string> {
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value.toLowerCase()));
    return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}
