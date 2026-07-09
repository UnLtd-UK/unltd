# UnLtd

## Setup

### 1. Configure environment variables
Add the following to `.dev.vars`:

```
FONTAWESOME_NPM_AUTH_TOKEN=your-token-here
EVENTBRITE_PRIVATE_TOKEN=your-token-here
```

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
By default only `published` content is fetched from Directus. To include `draft` (and `archived`, where applicable) items — e.g. draft blog posts, resources, programmes — set the `SHOW_DRAFTS` env var when running the dev server or build:

```bash
SHOW_DRAFTS=true npm run dev
```

This is checked in [src/data/resources.js](src/data/resources.js), [src/data/programmes.js](src/data/programmes.js), [src/data/subjects.js](src/data/subjects.js) and [src/data/sesm.js](src/data/sesm.js), and is set automatically to `true` for feature preview deploys ([.github/workflows/deploy-feature-preview.yml](.github/workflows/deploy-feature-preview.yml)) and `false` for production ([.github/workflows/deploy.yml](.github/workflows/deploy.yml)).

## Wrangler

### Run with Wrangler (local development with worker)
```bash
npm run dev
```
This runs the Astro dev server with Wrangler integration for local worker development.

### Deploy preview environment
```bash
npm run deploy:preview
```

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
https://unltd-feature-your-feature-name.unltd.workers.dev
```

The preview URL will be commented on your PR automatically.

### Merging to production
1. Open a Pull Request targeting `main`
2. Review changes
3. Merge PR → automatically deploys to `unltd.org.uk`