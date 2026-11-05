# UnLtd

The UnLtd website, built with [Astro](https://astro.build) and deployed to Cloudflare Workers. All editable content lives in [EmDash](https://emdashcms.com), the CMS that runs alongside the site (admin at `/_emdash/admin`). The site is static: it reads content from EmDash's HTTP API when it builds, so published changes appear on the next deploy.

## Content

| Content                    | EmDash collection(s)                 | Loaded by                                            |
| -------------------------- | ------------------------------------ | ---------------------------------------------------- |
| Pages                      | `pages`                              | [src/data/pages.ts](src/data/pages.ts)               |
| Blog posts                 | `posts` (+ `tag` taxonomy, bylines)  | [src/lib/posts-runtime.ts](src/lib/posts-runtime.ts) (on demand; the home page uses [src/data/posts.ts](src/data/posts.ts)) |
| Resources                  | `resources`                          | [src/data/resources.ts](src/data/resources.ts)       |
| Programmes and services    | `programmes`, `services`             | [src/data/programmes.ts](src/data/programmes.ts)     |
| Awards                     | `products`, `grants`                 | [src/data/awards.ts](src/data/awards.ts)             |
| Award rounds               | `rounds`                             | [src/data/rounds.ts](src/data/rounds.ts)             |
| Application forms and PDFs | `applications`, `sections`, `fields` | [src/data/applications.ts](src/data/applications.ts) |
| Award panels               | `panels`, `people`                   | [src/data/panels.ts](src/data/panels.ts)             |
| People and teams           | `people`, `teams`, `organisations`   | [src/data/people.ts](src/data/people.ts)             |
| FAQs                       | `faqs`                               | [src/data/faq.ts](src/data/faq.ts)                   |
| Forms                      | `forms`                              | [src/data/forms.ts](src/data/forms.ts)               |

The home page content is not in EmDash; edit [src/data/home.ts](src/data/home.ts). The shared EmDash client is in [src/lib/emdash.ts](src/lib/emdash.ts).

## Setup

### 1. Configure environment variables
Add the following to `.dev.vars`:

```
FONTAWESOME_NPM_AUTH_TOKEN=your-token-here
EVENTBRITE_PRIVATE_TOKEN=your-token-here
EMDASH_TOKEN=your-emdash-api-token
# EmDash site to read content from (a localhost URL needs no token)
# EMDASH_URL=http://localhost:4321
```

`EMDASH_URL` is required for builds (`astro dev` defaults to the local server). There is a single EmDash instance: CI reads it from the `EMDASH_URL` GitHub repository variable (Settings > Secrets and variables > Actions > Variables), shared by production and every feature/fix preview, so changing instance means changing one variable. Draft content is previewed in EmDash itself.

`astro dev` has no local database: [wrangler.astro.jsonc](wrangler.astro.jsonc) binds the real D1 database and R2 bucket with `"remote": true`, so the dev server (including the blog, which is rendered on demand) shows live content, and edits made in the dev admin change live data. This needs `wrangler login`.

Create `EMDASH_TOKEN` as an API token with content read access in the EmDash admin, and add it as the `EMDASH_TOKEN` GitHub Actions secret.

### 2. Generate .npmrc
Run the setup script to generate the `.npmrc` file from the template:

```bash
npm run setup
```

### 3. Install dependencies
```bash
npm install
```

## Development

### Run dev server
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Preview
```bash
npm run preview
```

### Show drafts
By default only `published` content is fetched. To include drafts of the content built into the static pages (pages, resources, programmes and so on), set the `SHOW_DRAFTS` env var when running the dev server or build:

```bash
SHOW_DRAFTS=true npm run dev
```

This adds `draft` items to what is read from EmDash at build time (see [src/lib/emdash.ts](src/lib/emdash.ts)). It is set automatically to `true` for feature preview deploys ([.github/workflows/deploy-preview.yml](.github/workflows/deploy-preview.yml)) and `false` for production ([.github/workflows/deploy-production.yml](.github/workflows/deploy-production.yml)). It does not affect the blog: posts are rendered on demand, and drafts are previewed with EmDash's preview link (see [Blog posts](#blog-posts)).

## Redirects

Redirects within the site are managed in the EmDash admin (`/_emdash/admin`, **Redirects**). They are stored in the EmDash database, so they apply to the preview and production sites alike (both use the same D1 database), and they work for any path that has no page. Paths are matched with or without a trailing slash, and patterns such as `/spaces/[...path]` are supported.

Redirects to other sites can't be managed there (EmDash only accepts site-relative destinations), so those stay in [public/_redirects](public/_redirects).

This relies on `not_found_handling: "none"` in [wrangler.jsonc](wrangler.jsonc) and the catch-all route [src/pages/[...path].astro](src/pages/[...path].astro): together they send paths with no page to the Worker, where EmDash applies the redirect or serves the 404 page.

## Blog posts

Blog posts are managed in the EmDash admin (`/_emdash/admin`), in the **Posts** collection.

- **Fields**: title, subtitle (shown under the title and used as the page description), featured image, content, the byline(s) and a **tag** (News, Insights, Stories or How to's; only the first tag is shown). Posts with no byline show no author line.
- **Slug**: the post's URL is `/blog/<slug>`. Posts also appear under `/blog/<year>` by published date.
- **Published date**: posts are listed newest first by their published date. To back-date a post, publish it through the API with a `publishedAt` value (`POST /_emdash/api/content/posts/<id>/publish` with `{ "publishedAt": "<ISO date>" }`); this is how the migrated posts kept their original dates.
- **Images**: upload them to the **Posts** folder in the EmDash media library and give each one alt text.
- **Preview**: use EmDash's editor preview for drafts (`/blog/<slug>?_preview=<token>`). For the preview link to point at the blog, set the **Posts** collection's URL pattern to `/blog/{slug}` in the EmDash admin.
- **When it goes live**: the blog (`/blog`, `/blog/<year>`, `/blog/<slug>`) is rendered on demand from EmDash's database, so a published or edited post shows without a rebuild. Responses are route-cached ([astro.config.mjs](astro.config.mjs) `cache` and `routeRules`); EmDash purges the affected pages when content is saved or published, and entries expire after 10 minutes at most. The rest of the site, and the header, footer and round banner shown on blog pages (read from `/site-shell.json`, written at build time), are static and update on the next deploy. The production deploy workflow rebuilds every 2 hours ([.github/workflows/deploy-production.yml](.github/workflows/deploy-production.yml)), or run it manually from GitHub Actions.

## Wrangler

### Run with Wrangler (local development with worker)
```bash
npm run dev
```
This runs the Astro dev server with Wrangler integration for local worker development.

### Deploy production environment
```bash
npm run deploy:prod
```

## Git Workflow

### Branch naming
Create branches from `main` using these prefixes:

- `feature/` - New features (e.g., `feature/user-dashboard`)
- `fix/` - Bug fixes (e.g., `fix/login-error`)
- `chore/` - Maintenance tasks (e.g., `chore/update-dependencies`)

### Creating a new branch
```bash
git checkout main
git pull origin main
git checkout -b feature/your-feature-name
```

### Preview deployments
Pushing to any `feature/*`, `fix/*`, or `chore/*` branch automatically deploys a preview:

```
https://feature-your-feature-name.unltd.workers.dev
```

The preview URL will be commented on your PR automatically.

### Merging to production
1. Open a Pull Request targeting `main`
2. Review changes
3. Merge PR → automatically deploys to `unltd.org.uk`