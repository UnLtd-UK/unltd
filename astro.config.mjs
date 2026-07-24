import { defineConfig, fontProviders, envField } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import alpinejs from "@astrojs/alpinejs";
import react from "@astrojs/react";
import markdoc from "@astrojs/markdoc";
import sitemap from "@astrojs/sitemap";
import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  integrations: [alpinejs(), react(), markdoc(), sitemap()],
  site: 'https://unltd.org.uk',
  trailingSlash: 'never',
  // Output stays fully static by default; @astrojs/cloudflare only adds
  // on-demand rendering capability for routes that opt in via
  // `export const prerender = false` (e.g. src/pages/blog/[post]/preview.astro).
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
  env: {
    schema: {
      // `optional: true` is deliberate: if this secret isn't set on a given
      // deployed Worker (e.g. it was never pushed via `wrangler secret put`),
      // we want the preview route to fail gracefully with its own 403
      // "Forbidden" response, not a hard 500 from schema validation.
      DIRECTUS_PREVIEW_TOKEN: envField.string({ context: "server", access: "secret", optional: true }),
    },
  },
  vite: {
    plugins: [tailwindcss()],
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