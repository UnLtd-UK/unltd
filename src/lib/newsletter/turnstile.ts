export async function verifyTurnstile(secret: string, token: string, ip?: string | null): Promise<boolean> {
    if (!token) return false;

    const body = new FormData();
    body.append("secret", secret);
    body.append("response", token);
    if (ip) body.append("remoteip", ip);

    try {
        const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
            method: "POST",
            body,
        });
        const result = (await response.json()) as { success?: boolean };
        return result.success === true;
    } catch (error) {
        console.error("[newsletter] Turnstile verification failed", error);
        return false;
    }
}
