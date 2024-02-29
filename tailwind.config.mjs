/** @type {import('tailwindcss').Config} */

const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    fontFamily: {
      sans: ["'nunito'", ...defaultTheme.fontFamily.sans],
    }
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
  safelist: [
    { pattern: /^bg-/ },
    { pattern: /^text-/ },
    { pattern: /^border-/, variants: ['hover'] },
    { pattern: /^from-/ },
    { pattern: /^to-/ },
    { pattern: /^shadow-/, variants: ['hover'] }
  ]
};
