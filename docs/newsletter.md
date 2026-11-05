# Newsletter sign-up (Resend)

Double opt-in newsletter sign-up backed by [Resend](https://resend.com) Contacts and Broadcasts.

## Flow

1. Visitor submits their email (footer form or `/newsletter`) → `POST /api/newsletter/subscribe` (Turnstile + honeypot + KV rate limit).
2. A confirmation email is sent containing a signed, 24h token link to `/newsletter/confirm?token=…`. **No Resend contact exists yet.**
3. The confirm page POSTs the token to `/api/newsletter/confirm`, which creates the contact (subscribed, added to the segment and opted in to every configured topic) and sends the welcome email when the subscription state changes. Links carry the consent version current when they were issued, so a later subscription choice makes earlier links stale. The version lives in a per-email `NewsletterConsent` Durable Object (strongly consistent), which serialises each redemption: version check, Resend change and version advance. Welcome delivery uses a stable idempotency key to prevent duplicate messages on concurrent confirmations; delivery failure does not undo a successful subscription.
4. Unsubscribe, either:
   - **From a newsletter:** the `{{{RESEND_UNSUBSCRIBE_URL}}}` link in the broadcast footer (Resend-hosted page; Resend updates the contact).
   - **On the website:** `/newsletter/unsubscribe` → enter email → verification email (1h signed token, only sent if the address is subscribed; the response is identical either way) → confirm button → opt out of all configured newsletter topics, or remove the contact from the newsletter segment when no topics are configured. This does not unsubscribe the contact from unrelated Resend topics or broadcasts.

Tokens are HMAC-SHA256 signed with `NEWSLETTER_TOKEN_SECRET` and bound to a purpose, so a confirm link cannot unsubscribe and vice versa. They are also bound to the Resend segment (`RESEND_SEGMENT_ID`), so a Worker configured for a different segment rejects them. Give each preview its own segment and `NEWSLETTER_TOKEN_SECRET` rather than sharing production's.

## One-off setup

### Resend
- Verify the sending domain (the default sender is `UnLtd <newsletter@unltd.org.uk>`; override with `NEWSLETTER_FROM`).
- Create a **Segment** for the newsletter and note its ID → `RESEND_SEGMENT_ID`.
- Optional: create **Topics** (currently Social Entrepreneur and Partnerships) and set their IDs, comma-separated → `RESEND_TOPIC_IDS`. Subscribers are opted in to all of them and can opt out of each on Resend's unsubscribe page. Update the wording in `NewsletterSignup.astro` if the topics change.
- Create an API key with sending and contacts access → `RESEND_API_KEY`.
- Settings → Unsubscribe page: add UnLtd branding.
- **Every broadcast footer must include** `{{{RESEND_UNSUBSCRIBE_URL}}}`.

### Cloudflare Turnstile
- Create a widget for `unltd.org.uk` (and `*.workers.dev` if previews should work).
- Secret key → `TURNSTILE_SECRET_KEY` (runtime secret).
- Site key → `PUBLIC_TURNSTILE_SITE_KEY`. It is public but baked into the static HTML at **build time**, so set it as a GitHub Actions repository **variable** (`vars.PUBLIC_TURNSTILE_SITE_KEY`, used by the deploy workflows).

### Secrets

Generate the token secret with e.g. `openssl rand -base64 48`.

| Name                        | Where               | Notes                                           |
| --------------------------- | ------------------- | ----------------------------------------------- |
| `RESEND_API_KEY`            | runtime secret      |                                                 |
| `RESEND_SEGMENT_ID`         | runtime secret      |                                                 |
| `RESEND_TOPIC_IDS`          | runtime secret      | optional, comma-separated topic IDs             |
| `NEWSLETTER_FROM`           | runtime secret      | optional                                        |
| `NEWSLETTER_TOKEN_SECRET`   | runtime secret      | rotating it invalidates outstanding email links |
| `TURNSTILE_SECRET_KEY`      | runtime secret      |                                                 |
| `PUBLIC_TURNSTILE_SITE_KEY` | build-time variable |                                                 |

Set runtime secrets per environment, for example:

```bash
npx wrangler secret put RESEND_API_KEY --config wrangler.jsonc --env production
```

Branch previews are separate Workers named from the branch (slashes become hyphens and names are lowercased; for example, `feature/newsletter` becomes `feature-newsletter`). Set the same secrets on that preview worker with `--name`, for example:

```bash
npx wrangler secret put RESEND_API_KEY --config wrangler.jsonc --name feature-newsletter
```

Workers missing any required secret respond to the newsletter API with a 503; if the site key is missing at build time the form is not rendered.

## Local development

Add the variables to `.dev.vars` (see the README). Cloudflare's Turnstile test keys always pass: site key `1x00000000000000000000AA`, secret key `1x0000000000000000000000000000000AA`. Use `delivered@resend.dev`-style test addresses or a real inbox with a test Resend key.

## Code map

- `src/components/NewsletterSignup.astro`: form (`mode="subscribe" | "unsubscribe"`)
- `src/pages/newsletter/{index,confirm,unsubscribe}.astro`: static pages (confirm/unsubscribe are `noindex` and excluded from the sitemap)
- `src/pages/api/newsletter/*.ts`: on-demand API routes
- `src/lib/newsletter/`: tokens, Resend client, Turnstile, rate limiting, email templates
