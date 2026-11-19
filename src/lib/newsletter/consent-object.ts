import { DurableObject } from "cloudflare:workers";

export const INITIAL_CONSENT_VERSION = "0";

export type RedeemResult<T> = { ok: true; value: T } | { ok: false };

// One instance per email address. Durable Object storage is strongly
// consistent and the queue below serialises redemptions, so validating the
// version, mutating the provider and advancing the version happen atomically
// with respect to other redemptions for the same address.
export class NewsletterConsent extends DurableObject {
    private queue: Promise<unknown> = Promise.resolve();

    async getVersion(): Promise<string> {
        return (await this.ctx.storage.get<string>("version")) ?? INITIAL_CONSENT_VERSION;
    }

    async redeem<T>(expectedVersion: string, mutate: () => Promise<T>): Promise<RedeemResult<T>> {
        const run = this.queue.then(async (): Promise<RedeemResult<T>> => {
            if ((await this.getVersion()) !== expectedVersion) return { ok: false };
            const value = await mutate();
            await this.ctx.storage.put("version", crypto.randomUUID());
            return { ok: true, value };
        });
        this.queue = run.catch(() => undefined);
        return run;
    }
}
