/** @type {import('tailwindcss').Config} */
import defaultTheme from "tailwindcss/defaultTheme";
import forms from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";

export default {
  darkMode: 'selector',
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    fontFamily: {
      'sans': ['Nunito Variable', ...defaultTheme.fontFamily.sans],
      'ff': ['Unbounded Variable', ...defaultTheme.fontFamily.sans],
      'ha': ['Caveat Variable', ...defaultTheme.fontFamily.sans],
      'mfc': ['Outfit Variable', ...defaultTheme.fontFamily.sans],
      'ate': ['Inter Variable', ...defaultTheme.fontFamily.sans]
    }
  },
  plugins: [forms, typography]
};
