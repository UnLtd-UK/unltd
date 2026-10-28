# Newsletter sign-up (Resend)

Double opt-in newsletter sign-up backed by [Resend](https://resend.com) Contacts and Broadcasts.

## Flow

1. Visitor submits their email (footer form or `/newsletter`) → `POST /api/newsletter/subscribe` (Turnstile + honeypot + KV rate limit).
2. A confirmation email is sent containing a signed, 24h token link to `/newsletter/confirm?token=…`. **No Resend contact exists yet.**
3. The confirm page POSTs the token to `/api/newsletter/confirm`, which creates the contact (subscribed, added to the segment/topic) and sends the welcome email. Replaying the link is harmless: the welcome email is only sent when the subscription state actually changes.
4. Unsubscribe, either:
   - **From a newsletter:** the `{{{RESEND_UNSUBSCRIBE_URL}}}` link in the broadcast footer (Resend-hosted page; Resend updates the contact).
   - **On the website:** `/newsletter/unsubscribe` → enter email → verification email (1h signed token, only sent if the address is subscribed; the response is identical either way) → confirm button → contact set to `unsubscribed: true`.

Tokens are HMAC-SHA256 signed with `NEWSLETTER_TOKEN_SECRET` and bound to a purpose, so a confirm link cannot unsubscribe and vice versa.

## One-off setup

### Resend
- Verify the sending domain (the default sender is `UnLtd <newsletter@unltd.org.uk>`; override with `NEWSLETTER_FROM`).
- Create a **Segment** for the newsletter and note its ID → `RESEND_SEGMENT_ID`.
- Optional: create a **Topic** → `RESEND_TOPIC_ID` (lets people manage preferences on Resend's unsubscribe page).
- Create an API key with sending and contacts access → `RESEND_API_KEY`.
- Settings → Unsubscribe page: add UnLtd branding.
- **Every broadcast footer must include** `{{{RESEND_UNSUBSCRIBE_URL}}}`.

### Cloudflare Turnstile
- Create a widget for `unltd.org.uk` (and `*.workers.dev` if previews should work).
- Secret key → `TURNSTILE_SECRET_KEY` (runtime secret).
- Site key → `PUBLIC_TURNSTILE_SITE_KEY`. It is public but baked into the static HTML at **build time**, so set it as a GitHub Actions repository **variable** (`vars.PUBLIC_TURNSTILE_SITE_KEY`, used by the deploy workflows).

### Secrets

Generate the token secret with e.g. `openssl rand -base64 48`.

| Name | Where | Notes |
|---|---|---|
| `RESEND_API_KEY` | runtime secret | |
| `RESEND_SEGMENT_ID` | runtime secret | |
| `RESEND_TOPIC_ID` | runtime secret | optional |
| `NEWSLETTER_FROM` | runtime secret | optional |
| `NEWSLETTER_TOKEN_SECRET` | runtime secret | rotating it invalidates outstanding email links |
| `TURNSTILE_SECRET_KEY` | runtime secret | |
| `PUBLIC_TURNSTILE_SITE_KEY` | build-time variable | |

Set runtime secrets per environment, for example:

```bash
npx wrangler secret put RESEND_API_KEY --config wrangler.jsonc --env production
```

Repeat for `--env draft` (and previews if needed). Workers missing any required secret respond to the newsletter API with a 503; if the site key is missing at build time the form is not rendered.

## Local development

Add the variables to `.dev.vars` (see the README). Cloudflare's Turnstile test keys always pass: site key `1x00000000000000000000AA`, secret key `1x0000000000000000000000000000000AA`. Use `delivered@resend.dev`-style test addresses or a real inbox with a test Resend key.

## Code map

- `src/components/NewsletterSignup.astro`: form (`mode="subscribe" | "unsubscribe"`)
- `src/pages/newsletter/{index,confirm,unsubscribe}.astro`: static pages (confirm/unsubscribe are `noindex` and excluded from the sitemap)
- `src/pages/api/newsletter/*.ts`: on-demand API routes
- `src/lib/newsletter/`: tokens, Resend client, Turnstile, rate limiting, email templates
