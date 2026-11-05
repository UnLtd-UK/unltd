import { env } from "cloudflare:workers";
import { hashForKey } from "./rate-limit";

const INITIAL_VERSION = "0";

function getSessionKv(): KVNamespace {
    const kv = (env as { SESSION?: KVNamespace }).SESSION;
    if (!kv) throw new Error("Newsletter consent storage is unavailable");
    return kv;
}

async function versionKey(email: string): Promise<string> {
    return `newsletter:consent:${await hashForKey(email)}`;
}

export async function getNewsletterConsentVersion(email: string): Promise<string> {
    return (await getSessionKv().get(await versionKey(email))) ?? INITIAL_VERSION;
}

export async function advanceNewsletterConsentVersion(email: string, expectedVersion: string): Promise<boolean> {
    const kv = getSessionKv();
    const key = await versionKey(email);
    const currentVersion = (await kv.get(key)) ?? INITIAL_VERSION;
    if (currentVersion !== expectedVersion) return false;

    await kv.put(key, crypto.randomUUID());
    return true;
}