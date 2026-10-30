# UnLtd

## Setup

### 1. Configure environment variables
Add the following to `.dev.vars`:

```
FONTAWESOME_NPM_AUTH_TOKEN=your-token-here
EVENTBRITE_PRIVATE_TOKEN=your-token-here
DIRECTUS_API_TOKEN=your-token-here
EMDASH_TOKEN=your-emdash-api-token
# EmDash site to read pages and blog posts from (a localhost URL needs no token)
# EMDASH_URL=http://localhost:4321
```

`EMDASH_URL` is required for builds (`astro dev` defaults to the local server). There is a single EmDash instance: CI reads it from the `EMDASH_URL` GitHub repository variable (Settings > Secrets and variables > Actions > Variables), shared by production and every feature/fix preview, so changing instance means changing one variable. Draft content is previewed in EmDash itself.

Pages and blog posts are read from the EmDash `pages` and `posts` collections over its HTTP API when the site builds (see [src/data/pages.ts](src/data/pages.ts), [src/data/posts.ts](src/data/posts.ts) and the shared client in [src/lib/emdash.ts](src/lib/emdash.ts)). Create `EMDASH_TOKEN` as an API token with content read access in the EmDash admin, and add it as the `EMDASH_TOKEN` GitHub Actions secret.

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
By default only `published` content is fetched. To include drafts — e.g. draft blog posts, resources, programmes — set the `SHOW_DRAFTS` env var when running the dev server or build:

```bash
SHOW_DRAFTS=true npm run dev
```

For EmDash content (pages and blog posts, via [src/lib/emdash.ts](src/lib/emdash.ts)) this adds `draft` items, and `scheduled` posts as well. For Directus content it adds `draft` (and `archived`, where applicable) items; this is checked in [src/data/resources.js](src/data/resources.js), [src/data/programmes.js](src/data/programmes.js), [src/data/subjects.js](src/data/subjects.js) and [src/data/sesm.js](src/data/sesm.js). It is set automatically to `true` for feature preview deploys ([.github/workflows/deploy-preview.yml](.github/workflows/deploy-preview.yml)) and `false` for production ([.github/workflows/deploy-production.yml](.github/workflows/deploy-production.yml)).

## Blog posts

Blog posts are managed in the EmDash admin (`/_emdash/admin`), in the **Posts** collection. They used to be in Directus; that collection is no longer read by the site.

- **Fields**: title, subtitle (shown under the title and used as the page description), featured image, content, the byline(s) and a **tag** (News, Insights, Stories or How to's; only the first tag is shown). Posts with no byline show no author line.
- **Slug**: the post's URL is `/blog/<slug>`. Posts also appear under `/blog/<year>` by published date.
- **Published date**: posts are listed newest first by their published date. To back-date a post, publish it through the API with a `publishedAt` value (`POST /_emdash/api/content/posts/<id>/publish` with `{ "publishedAt": "<ISO date>" }`); this is how the migrated posts kept their original dates.
- **Images**: upload them to the **Posts** folder in the EmDash media library and give each one alt text.
- **Preview**: use EmDash's editor preview for drafts. There is no separate preview page.
- **When it goes live**: the site is static, so a published post appears on the next deploy. The production deploy workflow rebuilds every 2 hours ([.github/workflows/deploy-production.yml](.github/workflows/deploy-production.yml)), or run it manually from GitHub Actions.

The old Directus posts were copied across with [scripts/migrate-posts-to-emdash.mjs](scripts/migrate-posts-to-emdash.mjs) (`npm run migrate:posts`). How it works, and the plan for moving the site off Directus posts, are in [docs/emdash-migration-plan.md](docs/emdash-migration-plan.md) and [docs/emdash-posts-switchover-plan.md](docs/emdash-posts-switchover-plan.md).

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