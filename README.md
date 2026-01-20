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
https://unltd-feature-your-feature-name.unltd-uk.workers.dev
```

The preview URL will be commented on your PR automatically.

### Merging to production
1. Open a Pull Request targeting `main`
2. Review changes
3. Merge PR → automatically deploys to `unltd.org.uk`