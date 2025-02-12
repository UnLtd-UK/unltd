import { defineConfig } from "astro/config";
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
  }
});