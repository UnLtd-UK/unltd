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