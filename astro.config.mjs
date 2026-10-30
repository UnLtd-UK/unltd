import { defineConfig, fontProviders } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import alpinejs from "@astrojs/alpinejs";
import react from "@astrojs/react";
import markdoc from "@astrojs/markdoc";
import sitemap from "@astrojs/sitemap";
import cloudflare from "@astrojs/cloudflare";
import fs from "node:fs";

import emdash from "emdash/astro";
import { d1, r2, sandbox } from "@emdash-cms/cloudflare";
import { cloudflareEmail } from "@emdash-cms/cloudflare/plugins";

// Host of the EmDash site the build reads posts from (EMDASH_URL, as set in CI
// or .dev.vars). Post images are served from it, so astro:assets must be
// allowed to fetch from it.
function readEmdashHost() {
  let url = process.env.EMDASH_URL;
  if (!url) {
    try {
      url = fs.readFileSync(".dev.vars", "utf8").match(/^EMDASH_URL\s*=\s*(.+)$/m)?.[1];
    } catch {
      // no .dev.vars (e.g. in CI, where EMDASH_URL is set in the environment)
    }
  }
  try {
    return new URL(url.trim().replace(/^["']|["']$/g, "")).hostname;
  } catch {
    return null;
  }
}
const emdashHost = readEmdashHost();

// Prerendered pages render in Node (prerenderEnvironment: "node" below), where
// the `cloudflare:workers` module EmDash's middleware imports doesn't exist.
// Stub it for that environment only; on-demand routes still run in workerd.
const stubCloudflareWorkersInPrerender = {
  name: "stub-cloudflare-workers-in-prerender",
  enforce: "pre",
  resolveId(id) {
    if (id === "cloudflare:workers" && this.environment?.name === "prerender") {
      return "\0stub:cloudflare-workers";
    }
  },
  load(id) {
    if (id === "\0stub:cloudflare-workers") {
      // The sandbox runner (registry plugins) also imports these classes and
      // `exports`; they are never used while prerendering.
      return "export const waitUntil = undefined; export const env = {}; export const exports = {}; export class RpcTarget {}; export class WorkerEntrypoint {}; export class DurableObject {}";
    }
  },
};

// https://astro.build/config
export default defineConfig({
  integrations: [alpinejs(), react(), markdoc(), sitemap(), emdash({
    database: d1({ binding: "DB" }),
    storage: r2({ binding: "MEDIA" }),
    // Runs registry plugins in isolated Worker Loader sandboxes. Needs the
    // LOADER worker_loaders binding (Workers paid plan) in wrangler.jsonc.
    sandboxRunner: sandbox(),
    // Uses the `EMAIL` send_email binding in wrangler.jsonc. The sender domain
    // must be onboarded for Cloudflare Email Sending.
    plugins: [
      cloudflareEmail({
        from: { email: "cms@unltd.org.uk", name: "UnLtd CMS" },
        replyTo: "digital@unltd.org.uk",
      }),
    ],
    admin: {
      hiddenNavItems: ["comments", "widgets"],
    }
  })],
  site: 'https://unltd.org.uk',
  trailingSlash: 'never',
  // Output stays fully static by default; @astrojs/cloudflare only adds
  // on-demand rendering capability for routes that opt in via
  // `export const prerender = false` (EmDash's own routes do).
  // Uses a dedicated local-only Wrangler config (see wrangler.astro.jsonc) so
  // it doesn't conflict with wrangler.jsonc's `main`, which is owned by the
  // separate `wrangler pages functions build` step for functions/*.ts.
  // prerenderEnvironment stays "node" (not the adapter's default "workerd")
  // because existing data loaders (src/data/load.js, src/lib/generate-application-pdf.ts)
  // use Node's fs/path APIs at build time, which the workerd sandbox doesn't support.
  // NOTE: do NOT add nodejs_compat to wrangler.astro.jsonc — it breaks on-demand
  // rendering (see comment in that file for details).
  adapter: cloudflare({
    configPath: "./wrangler.astro.jsonc",
    prerenderEnvironment: "node",
  }),
  vite: {
    plugins: [tailwindcss(), stubCloudflareWorkersInPrerender],
    ssr: {
      noExternal: ['react', 'react-dom']
    }
  },
  image: {
    // Allows astro:assets <Image>/<Picture> to fetch, resize and reformat
    // remote images at build time instead of passing them through unprocessed:
    // Directus-hosted images, and post images served by the EmDash site.
    domains: ["unltd.directus.app", ...(emdashHost ? [emdashHost] : [])],
  },
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: "Nunito",
      cssVariable: "--font-nunito",
      weights: ["200 1000"],
      styles: ["normal", "italic"],
      fallbacks: ["sans-serif"],
    },
    {
      provider: fontProviders.fontsource(),
      name: "Unbounded",
      cssVariable: "--font-unbounded",
      weights: ["200 900"],
      styles: ["normal"],
      fallbacks: ["sans-serif"],
    },
    {
      provider: fontProviders.fontsource(),
      name: "Caveat",
      cssVariable: "--font-caveat",
      weights: ["400 700"],
      styles: ["normal"],
      fallbacks: ["cursive"],
    },
    {
      provider: fontProviders.fontsource(),
      name: "Outfit",
      cssVariable: "--font-outfit",
      weights: ["100 900"],
      styles: ["normal"],
      fallbacks: ["sans-serif"],
    },
    {
      provider: fontProviders.fontsource(),
      name: "Inter",
      cssVariable: "--font-inter",
      weights: ["100 900"],
      styles: ["normal", "italic"],
      fallbacks: ["sans-serif"],
    },
  ],
  // CSP disabled: Alpine.js requires unsafe-eval (uses new Function() for expressions),
  // which is incompatible with Astro 6's hash-based CSP. Migrating to @alpinejs/csp
  // would be needed to re-enable this. See: https://alpinejs.dev/essentials/csp
});