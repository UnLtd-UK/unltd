# Moving to EmDash CMS: Benefits

## 1. No rebuilds for content changes

- Edits are visible and previewable immediately, and can be pushed live immediately.
- Applies today to **pages, resources and posts**.
- Planned: extend to all content types soon.

## 2. Much lower running cost

- Previously: hosted by Directus, roughly **£1,200+ per year**.
- Now: hosted on Cloudflare's platform, roughly **£5+ per month**.
- This was always going to be questioned alongside the website rebuild; the saving removes that concern.

## 3. Visual editor

- Edit directly on the page and make quick changes.
- Applies today to **posts, pages and resources**.

## 4. MCP support (talk to the website)

- Make changes to the site through a chatbot of your choice.
- Copilot is not supported directly, but it works through the GitHub chatbot interface by logging in with GitHub.
- Using a personal account (e.g. your own Claude) is fine: changes are still attributed to you and can be revoked.

## 5. What still needs a build

- **PDF generation** and the **awards page** still require a build.
- The PDFs and the date banner at the top of the site will always need one, so the site will rebuild **every 24 hours**.
- Next step: look at making the awards page previewable and editable in real time.

## 6. Redirects and broken-link visibility

- Admins can set up redirects themselves.
- We can now see when visitors hit pages that don't resolve (404s). Previously there was no visibility of these errors.
- Those hits show where a redirect is needed, so we can fix them quickly.

## 7. Editable header and footer menus

- Header and footer menus were not editable in Directus.
- They are now fully editable under **Menus** in the CMS.

## 8. Familiar, WordPress-style experience

- The CMS is inspired by WordPress.
- A far more familiar experience for anyone reviewing the new website (e.g. IE) than the previous architecture.

## 9. More secure

- Authentication is **passkeys or magic links only**.
- No passwords to manage or leak.
- Role-based access rules.

## 10. Performance maintained

- The site should be as fast as before.
- Easier for us to make changes.

## 11. Built for AI-assisted development

- This architecture suits AI tooling.
- Adding new functionality is remarkably easy.
