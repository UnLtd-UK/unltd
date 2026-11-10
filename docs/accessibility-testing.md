# Accessibility testing

This repo has two independent accessibility checks:

1. **Lint** – `eslint-plugin-astro`'s `jsx-a11y` rules and `eslint-plugin-jsx-a11y` catch obvious
   markup mistakes (missing labels, redundant ARIA roles, `autoFocus`, etc.) directly in source
   files, in seconds, no build required.
2. **Scan** – [pa11y-ci](https://github.com/pa11y/pa11y-ci) crawls every URL in the built site's
   sitemap with a real headless Chrome and runs both the `axe` and `htmlcs` engines against WCAG2AA.
   This needs a production build and takes several minutes (~400+ pages).

## Commands

| Command              | What it does                                                                                                                                                           |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm run lint:a11y`  | Lints `.astro`/`.jsx`/`.tsx` files for accessibility issues. Fast, no build needed.                                                                                    |
| `pnpm run test:a11y`  | Builds nothing itself — builds `dist/`, boots `astro preview`, then scans the whole sitemap with pa11y-ci, then shuts the server down.                                 |
| `pnpm run test`       | Runs `lint:a11y` then `test:a11y`.                                                                                                                                     |
| `pnpm run build:test` | Runs `pnpm run build` (site build + wrangler dry-run deploy check), then `pnpm run test`. Use this when you want one command that builds **and** verifies accessibility. |

For quick local iteration, prefer `pnpm run lint:a11y` — it's the one you'll run most often while
editing components. Run `pnpm run build:test` before opening a PR — these checks are local-only
and do not run in CI (see below).

## How the sitemap scan works

`astro.config.mjs` sets `site: 'https://unltd.org.uk'`, so the generated sitemap
(`dist/client/sitemap-index.xml` → `sitemap-0.xml`) always lists production URLs, even in a local
build. `pnpm run test:a11y:scan` fetches the sitemap from the local preview server but rewrites every
URL from `https://unltd.org.uk` to `http://localhost:4321` before pa11y-ci visits it
(`--sitemap-find` / `--sitemap-replace`), so it tests your local build, not the live site.

Shared scan rules (WCAG level, timeout, ignored severities, Chrome flags) live in
[.pa11yci.json](/.pa11yci.json).

## Notes / gotchas

- **`astro preview` and AI coding assistants**: `astro preview` auto-detects when it's run from
  inside an AI agent/coding-assistant terminal and silently switches to a detached background
  mode, which breaks `start-server-and-test` (it looks like the server "closed unexpectedly").
  If you hit this, set `ASTRO_PREVIEW_BACKGROUND=1` in the environment to force foreground mode,
  e.g. `ASTRO_PREVIEW_BACKGROUND=1 pnpm run test:a11y`. Normal terminals/CI aren't affected.
- **Full scan is slow**: scanning the whole sitemap (~400+ pages) can take 20-30+ minutes locally.
  For a quick smoke test of a couple of pages instead of the whole site, run pa11y-ci directly
  against specific URLs (needs a preview server already running):
  ```sh
  pnpm exec pa11y-ci --config .pa11yci.json http://localhost:4321/ http://localhost:4321/awards
  ```
- **TypeScript version mismatch**: `@typescript-eslint/parser` refuses to run on TypeScript 7
  (which this project uses everywhere else). [.pnpmfile.cjs](/.pnpmfile.cjs) works around this:
  its `readPackage` hook gives every `@typescript-eslint/*` package (and `ts-api-utils`) its own
  `typescript@^6` dependency instead of the project's TypeScript 7, so only the linter sees TS 6.
  Keep the `TS6` range in that file on a 6.x release — pointing it at 7.x (even by accident)
  brings back the "typescript-eslint does not support TS 7.0" error.

## CI

Accessibility checks are intentionally **not** run in GitHub Actions — the full sitemap scan is too
slow for CI turnaround. Run `pnpm run build:test` (or `pnpm run test` against an existing build)
locally before opening a PR instead.
