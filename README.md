# UnLtd

The UnLtd website, built with [Astro](https://astro.build) and deployed to Cloudflare Workers. All editable content lives in [EmDash](https://emdashcms.com), the CMS that runs alongside the site (admin at `/_emdash/admin`). Most of the site is static: it reads content from EmDash's HTTP API when it builds, so published changes appear on the next deploy. The blog, pages, resources and contact (email) pages are rendered on demand, so they update without a rebuild.

## EmDash links

| What | URL |
| ---- | --- |
| Admin | https://unltd.org.uk/_emdash/admin |
| MCP server | https://unltd.org.uk/_emdash/api/mcp |

The MCP server is for connecting an AI client (such as VS Code) to the CMS. Sign-in uses OAuth, and the connection reads and writes the same content as the admin. Locally, `astro dev` serves both at `http://localhost:4321/_emdash/...`.

## Content

| Content                    | EmDash collection(s)                 | Loaded by                                            |
| -------------------------- | ------------------------------------ | ---------------------------------------------------- |
| Pages                      | `pages`                              | [src/lib/pages-runtime.ts](src/lib/pages-runtime.ts) (on demand; menus use [src/data/pages.ts](src/data/pages.ts)) |
| Blog posts                 | `posts` (+ `tag` taxonomy, bylines)  | [src/lib/posts-runtime.ts](src/lib/posts-runtime.ts) (on demand; the home page uses [src/data/posts.ts](src/data/posts.ts)) |
| Resources                  | `resources`                          | [src/lib/resources-runtime.ts](src/lib/resources-runtime.ts) (on demand; the application PDFs use [src/data/resources.ts](src/data/resources.ts)) |
| Programmes and services    | `programmes`, `services`             | [src/data/programmes.ts](src/data/programmes.ts)     |
| Awards                     | `products`, `grants`                 | [src/data/awards.ts](src/data/awards.ts)             |
| Award rounds               | `rounds`                             | [src/data/rounds.ts](src/data/rounds.ts)             |
| Application forms and PDFs | `applications`, `sections`, `fields` | [src/data/applications.ts](src/data/applications.ts) |
| Award panels               | `panels`, `people`, `social_entrepreneurs` | [src/lib/panels-runtime.ts](src/lib/panels-runtime.ts) (on demand; saving a panel or anyone on it refreshes the page) |
| People and teams           | `people`, `teams`, `organisations`   | [src/data/people.ts](src/data/people.ts)             |
| FAQs                       | `faqs`                               | [src/data/faq.ts](src/data/faq.ts)                   |
| Emails (contact pages)     | `forms`                              | [src/lib/emails-runtime.ts](src/lib/emails-runtime.ts) (on demand; the menu uses [src/data/forms.ts](src/data/forms.ts)) |

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

Because previews and local dev share the production database, they never run EmDash database migrations: `migrations` in [astro.config.mjs](astro.config.mjs) is `check` in dev, and `EMDASH_MIGRATIONS_MODE` in [wrangler.jsonc](wrangler.jsonc) is `check` for preview Workers and `auto` for production. If a branch upgrades EmDash and the database needs a migration, the preview (or dev server) answers 503 "Database migrations are required" until production is deployed with that EmDash version, which applies it.

Create `EMDASH_TOKEN` as an API token with content read access in the EmDash admin, and add it as the `EMDASH_TOKEN` GitHub Actions secret.

### 2. Generate .npmrc
Run the setup script to generate the `.npmrc` file from the template (it needs `FONTAWESOME_NPM_AUTH_TOKEN` in `.dev.vars` or the environment):

```bash
bash scripts/setup-npmrc.sh
```

### 3. Install dependencies
This project uses [pnpm](https://pnpm.io) (the version is pinned in `package.json`'s `packageManager`; enable it with `corepack enable` or install pnpm directly).

```bash
pnpm install
```

## Development

### Run dev server
```bash
pnpm dev
```

### Build
```bash
pnpm build
```

### Preview
```bash
pnpm preview
```

### Drafts
Only `published` content is read at build time. Drafts are previewed in EmDash itself: the blog, pages, resources and contact pages are rendered on demand, so open a draft with EmDash's preview link (see [Pages](#pages) and [Blog posts](#blog-posts)). Content that is built into the static pages (programmes, awards, people and so on) has no preview: it appears after it is published and the site is next deployed.

## Redirects

Redirects within the site are managed in the EmDash admin (`/_emdash/admin`, **Redirects**). They are stored in the EmDash database, so they apply to the preview and production sites alike (both use the same D1 database), and they work for any path that has no page. A page and a redirect from the same path are both live, and the redirect wins: delete a redirect when you publish a page at its path. Paths are matched with or without a trailing slash, and patterns such as `/spaces/[...path]` are supported.

Redirects to other sites can't be managed there (EmDash only accepts site-relative destinations), so those stay in [public/_redirects](public/_redirects).

This relies on `not_found_handling: "none"` in [wrangler.jsonc](wrangler.jsonc) and the catch-all route [src/pages/[...path].astro](src/pages/[...path].astro): together they send paths with no page to the Worker, where EmDash applies the redirect or serves the 404 page.

## Pages

Pages are managed in the EmDash admin, in the **Pages** collection, and are served at `/<slug>`. Like the blog they are rendered on demand ([src/pages/[page].astro](src/pages/[page].astro)), so a new, edited or published page shows without a rebuild, and a draft can be previewed with EmDash's preview link (`/<slug>?_preview=<token>`). Pages with their own file in `src/pages` (such as `awards` and `contact`) take priority over a CMS page with the same slug. The menus still read the page list at build time, so a new page added to a menu appears in it after the next deploy.

**Editing on the page**: log in to the admin, then open a page on the site. An **Edit** pill appears; click it to open the page's uncached editing view, where EmDash's toolbar has an **Edit mode** switch. With it on you can edit the title, subtitle and body text in place, and the toolbar shows the draft status and a **Publish** button. This works on pages, resources, email (contact) pages and blog posts: each route spreads `entry.edit.title` and `entry.edit.subtitle` (EmDash's visual-editing attributes) onto the title and subtitle in [Default.astro](src/components/heroes/Default.astro) (pages and resources) or [heroes/Post.astro](src/components/heroes/Post.astro) (posts), and [PortableContent.astro](src/components/emdash/PortableContent.astro) hands the body straight to EmDash's editor. `toolbar: "client"` in [astro.config.mjs](astro.config.mjs) keeps the public HTML identical for everyone so route caching still works.

Resources (`/resources` and `/resources/<slug>`) work the same way ([src/pages/resources](src/pages/resources)); set the **Resources** collection's URL pattern to `/resources/{slug}` so the Preview button links correctly. A resource marked hidden is still served at its link but is not listed or indexed. The upcoming events shown on `/resources` come from Eventbrite at build time ([src/pages/programme-events.json.ts](src/pages/programme-events.json.ts)), so they update on the next deploy.

Email pages (`/contact` and `/contact/<slug>`, the **Emails** collection) work the same way ([src/pages/contact](src/pages/contact)): the title, subtitle and email address are editable on the page, while the pop-up dialog fields are edited in the admin panel. Set the collection's URL pattern to `/contact/{slug}` so the Preview button links correctly. The menu still resolves email links at build time, so a new email page appears in the menu on the next deploy.

`/sitemap-dynamic.xml` ([src/pages/sitemap-dynamic.xml.ts](src/pages/sitemap-dynamic.xml.ts)) lists the pages, resources, contact pages and blog posts for search engines and is linked from `sitemap-index.xml`.

## Blog posts

Blog posts are managed in the EmDash admin (`/_emdash/admin`), in the **Posts** collection.

- **Fields**: title, subtitle (shown under the title and used as the page description), featured image, content, the byline(s) and a **tag** (News, Insights, Stories or How to's; only the first tag is shown). Posts with no byline show no author line.
- **Slug**: the post's URL is `/blog/<slug>`. Posts also appear under `/blog/<year>` by published date.
- **Published date**: posts are listed newest first by their published date. To back-date a post, publish it through the API with a `publishedAt` value (`POST /_emdash/api/content/posts/<id>/publish` with `{ "publishedAt": "<ISO date>" }`); this is how the migrated posts kept their original dates.
- **Images**: upload them to the **Posts** folder in the EmDash media library and give each one alt text.
- **Preview**: use EmDash's editor preview for drafts (`/blog/<slug>?_preview=<token>`). For the preview link to point at the blog, set the **Posts** collection's URL pattern to `/blog/{slug}` in the EmDash admin.
- **When it goes live**: the blog (`/blog`, `/blog/<year>`, `/blog/<slug>`) is rendered on demand from EmDash's database, so a published or edited post shows without a rebuild. Responses are route-cached ([astro.config.mjs](astro.config.mjs) `cache`; [src/lib/route-cache.ts](src/lib/route-cache.ts)); EmDash purges the affected pages when content is saved or published, and entries expire after 10 minutes at most. The rest of the site, and the header, footer and round banner shown on blog pages (read from `/site-shell.json`, written at build time), are static and update on the next deploy. The production deploy workflow rebuilds every 2 hours ([.github/workflows/deploy-production.yml](.github/workflows/deploy-production.yml)), or run it manually from GitHub Actions.

## Wrangler

### Run with Wrangler (local development with worker)
```bash
pnpm dev
```
This runs the Astro dev server with Wrangler integration for local worker development.

### Deploy production environment
```bash
pnpm deploy:prod
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