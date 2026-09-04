import eslintPluginAstro from "eslint-plugin-astro";
import jsxA11y from "eslint-plugin-jsx-a11y";
// Import the parser directly (not the `typescript-eslint` meta package, which
// also eagerly loads @typescript-eslint/eslint-plugin — and that package hard
// refuses to run on our TS 7 install). See scripts/link-eslint-typescript.cjs
// for how this parser resolves a compatible `typescript` version internally.
import tsParser from "@typescript-eslint/parser";

export default [
    ...eslintPluginAstro.configs["flat/recommended"],
    ...eslintPluginAstro.configs["flat/jsx-a11y-recommended"],
    {
        // Astro frontmatter uses TypeScript syntax (interfaces, type imports, etc.)
        files: ["**/*.astro"],
        languageOptions: {
            parserOptions: {
                parser: tsParser,
                extraFileExtensions: [".astro"],
            },
        },
    },
    {
        // React components (.tsx/.jsx) get the standard jsx-a11y rules directly
        files: ["**/*.{jsx,tsx}"],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaFeatures: { jsx: true },
            },
            ...jsxA11y.flatConfigs.recommended.languageOptions,
        },
        plugins: {
            "jsx-a11y": jsxA11y,
        },
        rules: {
            ...jsxA11y.flatConfigs.recommended.rules,
        },
    },
    {
        ignores: ["dist/**", ".astro/**", "node_modules/**", "ghost-export/**"],
    },
];


