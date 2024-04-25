/** @type {import('tailwindcss').Config} */

const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  darkMode: 'selector',
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    fontFamily: {
      'sans': ['Montserrat Variable', ...defaultTheme.fontFamily.sans],
      'ff': ['Lexend Variable', ...defaultTheme.fontFamily.sans],
      'ha': ['Caveat Variable', ...defaultTheme.fontFamily.sans],
      'mfc': ['Outfit Variable', ...defaultTheme.fontFamily.sans],
      'ate': ['Unbounded Variable', ...defaultTheme.fontFamily.sans]
    }
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")]
};
