import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import alpinejs from "@astrojs/alpinejs";

export default defineConfig({
  integrations: [svelte(), tailwind(), mdx(), alpinejs()]
});