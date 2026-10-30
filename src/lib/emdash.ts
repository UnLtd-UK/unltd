import { EmDashClient } from "emdash/client";
import { resolveEnvVar } from "./env.ts";

// Content is fetched over EmDash's HTTP API at build time. The prerender step
// runs in Node (see astro.config.mjs), where the D1 binding that EmDash's
// in-process queries need isn't available.
// `astro dev` serves EmDash itself (with dev-bypass auth), so read from it by
// default there. Builds must say which EmDash instance to read from.
export const EMDASH_URL = (
  (await resolveEnvVar("EMDASH_URL")) ??
  (import.meta.env?.DEV ? "http://localhost:4321" : "")
).replace(/\/$/, "");

if (!EMDASH_URL) {
  throw new Error(
    "EMDASH_URL is required to build pages (the EmDash site to read from, e.g. https://feature-emdash.unltd.workers.dev).",
  );
}

const EMDASH_TOKEN = await resolveEnvVar("EMDASH_TOKEN");
const isLocal = /^https?:\/\/(localhost|127\.0\.0\.1)(:|\/|$)/.test(EMDASH_URL);

export const showDrafts = process.env.SHOW_DRAFTS === "true";
console.log(`Show Drafts: ${showDrafts}`);

/** Statuses to read: published content, plus drafts and scheduled when SHOW_DRAFTS=true. */
export const contentStatuses = showDrafts
  ? ["published", "scheduled", "draft"]
  : ["published"];

/**
 * The client has no public method for a post's taxonomy terms, so call its
 * JSON request method (private in the types, available at runtime).
 */
export function emdashRequest<T>(client: EmDashClient, method: string, path: string): Promise<T> {
  const raw = client as unknown as {
    request: (method: string, path: string) => Promise<T>;
  };
  return raw.request(method, path);
}

/** Client for reading content. `what` names the content in the error if no token is set. */
export function createEmDashClient(what: string): EmDashClient {
  if (!EMDASH_TOKEN && !isLocal) {
    throw new Error(
      `EMDASH_TOKEN is required to read ${what} from ${EMDASH_URL} (create an API token in the EmDash admin with content read access).`,
    );
  }

  return new EmDashClient({
    baseUrl: EMDASH_URL,
    token: EMDASH_TOKEN,
    devBypass: !EMDASH_TOKEN && isLocal,
  });
}
