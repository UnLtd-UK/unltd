import { defineConfig, fontProviders } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import alpinejs from "@astrojs/alpinejs";
import react from "@astrojs/react";
import markdoc from "@astrojs/markdoc";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  integrations: [alpinejs(), react(), markdoc(), sitemap()],
  site: 'https://unltd.org.uk',
  trailingSlash: 'never',
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