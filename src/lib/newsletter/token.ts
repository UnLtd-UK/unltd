// Stateless, signed, expiring tokens for newsletter email links.
// Format: base64url(JSON payload) + "." + base64url(HMAC-SHA256(payload)).
export type TokenPurpose = "confirm" | "unsubscribe";

export interface TokenPayload {
    email: string;
    purpose: TokenPurpose;
    exp: number; // unix seconds
}

export const TOKEN_TTL_SECONDS: Record<TokenPurpose, number> = {
    confirm: 60 * 60 * 24,
    unsubscribe: 60 * 60,
};

const encoder = new TextEncoder();

function toBase64Url(bytes: Uint8Array): string {
    let binary = "";
    for (const byte of bytes) binary += String.fromCharCode(byte);
    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): Uint8Array {
    const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
    const binary = atob(padded);
    return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function hmacKey(secret: string, usage: KeyUsage): Promise<CryptoKey> {
    return crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, [usage]);
}

export async function createToken(
    secret: string,
    email: string,
    purpose: TokenPurpose,
    now: number = Math.floor(Date.now() / 1000),
): Promise<string> {
    const payload: TokenPayload = { email, purpose, exp: now + TOKEN_TTL_SECONDS[purpose] };
    const body = toBase64Url(encoder.encode(JSON.stringify(payload)));
    const signature = await crypto.subtle.sign("HMAC", await hmacKey(secret, "sign"), encoder.encode(body));
    return `${body}.${toBase64Url(new Uint8Array(signature))}`;
}

export type VerifyResult =
    | { ok: true; email: string }
    | { ok: false; reason: "invalid" | "expired" };

export async function verifyToken(
    secret: string,
    token: string,
    purpose: TokenPurpose,
    now: number = Math.floor(Date.now() / 1000),
): Promise<VerifyResult> {
    const [body, signature, ...rest] = token.split(".");
    if (!body || !signature || rest.length > 0) return { ok: false, reason: "invalid" };

    try {
        // subtle.verify compares in constant time.
        const valid = await crypto.subtle.verify(
            "HMAC",
            await hmacKey(secret, "verify"),
            fromBase64Url(signature),
            encoder.encode(body),
        );
        if (!valid) return { ok: false, reason: "invalid" };

        const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(body))) as Partial<TokenPayload>;
        if (payload.purpose !== purpose || typeof payload.email !== "string" || typeof payload.exp !== "number") {
            return { ok: false, reason: "invalid" };
        }
        if (payload.exp < now) return { ok: false, reason: "expired" };
        return { ok: true, email: payload.email };
    } catch {
        return { ok: false, reason: "invalid" };
    }
}
