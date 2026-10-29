# EmDash upgrade work order

This file is the handoff for upgrading the project at `/Users/tom/Documents/GitHub/unltd` to the npm `latest` release. The updater resolved the direct packages, changed and installed them where needed, refreshed the project EmDash skills, and compared the installed core migration manifests. It did not edit application code, apply a database migration, or deploy the site.

## Package changes

- `@emdash-cms/cloudflare`: `1.3.1` → `1.4.0` (`^1.4.0` → `^1.4.0`)
- `emdash`: `1.3.1` → `1.4.0` (`^1.4.0` → `^1.4.0`)

## Release entries to assess

These are the complete authored major, minor, and patch entries crossed by the direct EmDash packages in this project. Changesets dependency-bump entries and attribution wrappers have been removed. Check whether each entry affects code or configuration in this project. Do not adopt an unrelated feature merely because it appears here.

### Change 1

Applies to: `@emdash-cms/cloudflare@1.4.0` (patch)  
Source: [#4186](https://github.com/emdash-cms/emdash/pull/4186)

Fixes the Cloudflare image endpoint (`/_image` for EmDash media URLs) holding the R2 object read open after it answers with `304 Not Modified`, answers a `HEAD` request for a file it serves without transforming, or fails to transform an image.

### Change 2

Applies to: `@emdash-cms/cloudflare@1.4.0` (patch)  
Source: [#4281](https://github.com/emdash-cms/emdash/pull/4281)

Fixes sandboxed plugins with the `email:send` capability being unable to send mail on Cloudflare Workers. `ctx.email.send()` could reject with "Email is not configured" even though a host email provider was configured and the host's own emails were delivered.

### Change 3

Applies to: `@emdash-cms/cloudflare@1.4.0` (patch)  
Source: [#4278](https://github.com/emdash-cms/emdash/pull/4278)

Fixes `sandbox()` turning off sandboxed plugins in projects that have a `cloudflare.config.ts` (the config file used by `@astrojs/cloudflare` 15). When that file exists in the project root, `sandbox()` now selects the Worker Loader runner without reading any Wrangler config and without requiring `wrangler` to be installed. Add the binding with `LOADER: bindings.workerLoader()` under `worker.env`. If it is missing, EmDash logs a warning when the Worker starts instead of during the build.

### Change 4

Applies to: `@emdash-cms/cloudflare@1.4.0` (patch), `emdash@1.4.0` (patch)  
Source: [#4394](https://github.com/emdash-cms/emdash/pull/4394)

Fixes sandboxed plugin `ctx.taxonomies` mutations (`createTerm()`, `addEntryTerms()`, and `removeEntryTerms()`), `ctx.content.create()`, versioned content actions (`getVersioned()`, `publish()`, `unpublish()`, `schedule()`, `unschedule()`, `getTrashedVersioned()`, and `restore()`), and `ctx.comments.setStatus()` on Cloudflare when requests run across multiple Worker isolates. Content creation consistently uses runtime validation and hooks and preserves `translationOf` links instead of falling back to a plain database insert.
  
  Runner-created invocations without a content-create callback now receive `Content creation is not configured` rather than a database insert that bypasses runtime behavior. `createPluginTestHost()` supplies a database-backed callback with content-handler validation so transport-level tests can continue creating content and linked translations without starting the full EmDash runtime. It preserves the transport host's support for `data.slug` and `data.status`.
  
  Await these operation promises before returning from a plugin route or hook. Their RPC connection now lasts only for that invocation; unlike the previous loopback binding, it cannot support work that outlives the invocation.
  
  Publication after-hooks remain deferred. Same-entry actions attempted while an after-hook is running can return `CONTENT_ACTION_REENTRANT`; faster callback routing can expose this overlap in tests that assumed hooks had already finished. In runtime-host tests, call `await host.waitForDeferredTasks()` after an action before inspecting its after-hook effects or starting another action on the same entry. This method waits for queued deferred runtime work, including work those tasks enqueue; it does not run future scheduled tasks or wait for arbitrary unawaited plugin operations.

### Change 5

Applies to: `emdash@1.4.0` (minor)  
Source: [#3856](https://github.com/emdash-cms/emdash/pull/3856)

Adds `admin.hiddenNavItems` to hide built-in admin areas a site doesn't use. Set it to any of `calendar`, `media`, `comments`, `menus`, `redirects`, `widgets`, `sections`, `bylines`, and `import`, for example `admin: { hiddenNavItems: ["comments", "redirects"] }`. Hidden areas disappear from the sidebar and the command palette. On the dashboard, listing `media` hides the Upload Media button, and listing `calendar` keeps the Scheduled count but removes its link to the calendar. The pages and API routes stay reachable for users with the required role. An unknown name fails the build.

### Change 6

Applies to: `emdash@1.4.0` (patch)  
Source: [#4364](https://github.com/emdash-cms/emdash/pull/4364)

Fixes translating a menu on Cloudflare D1, which failed for larger menus and left an empty translated menu behind. On D1, translating or deleting a menu and reordering or replacing its items now either save completely or leave the menus unchanged.
  
  #### What should I do?
  
  If translating a menu failed before, delete the empty translated menu it left behind, then translate the menu again.

### Change 7

Applies to: `emdash@1.4.0` (patch)  
Source: [#4167](https://github.com/emdash-cms/emdash/pull/4167)

Fixes extra database round trips on `getEmDashEntry` and `getEmDashCollection` for sites that register byline custom fields or have entries with an author but no explicit byline credit. These reads now resolve bylines from the content query itself and load custom-field values in one batched step, instead of re-reading every entry's credits. On Cloudflare D1, a page that reads a few entries saves two to six sequential queries.

### Change 8

Applies to: `emdash@1.4.0` (patch)  
Source: [#4287](https://github.com/emdash-cms/emdash/pull/4287)

Fixes expired OAuth tokens and unused login codes from `emdash login` and MCP clients staying in the database forever. Scheduled cleanup now deletes them after they expire.

### Change 9

Applies to: `emdash@1.4.0` (patch)  
Source: [#4286](https://github.com/emdash-cms/emdash/pull/4286)

Fixes lost edits on D1, Durable Objects and PostgreSQL when two saves of the same entry, both based on the same version, arrive at once, for example from two MCP clients or from scripts using `emdash content update --rev`: both reported success, and the first was silently overwritten. The second save now returns `409 CONFLICT`, the same response a save based on an outdated version already gets.

### Change 10

Applies to: `emdash@1.4.0` (patch)  
Source: [#4459](https://github.com/emdash-cms/emdash/pull/4459)

Fixes `POST /_emdash/api/oauth/token` returning uppercase `INVALID_GRANT` for refresh-token and device-code failures. These responses now use the RFC-standard `invalid_grant` code so OAuth clients can recognize rejected grants and restart authorization.

### Change 11

Applies to: `emdash@1.4.0` (patch)  
Source: [#4243](https://github.com/emdash-cms/emdash/pull/4243)

Fixes Cloudflare-cached pages remaining outdated after content is deleted or unpublished. Pages using EmDash cache hints no longer send an automatic `Last-Modified` header, so Cloudflare stops answering `304 Not Modified` based on an entry timestamp that does not cover related lists or settings changes. This applies to entry, collection, publication-date, and reference-list hints. Sites using an object cache reload those content snapshots once after upgrading so cached validators from earlier versions are not reused.
  
  Taxonomy definitions and collection-to-taxonomy mappings also revalidate in the background after 30 seconds, so long-lived server processes pick up changes saved elsewhere without adding a blocking query to each render. A failed refresh retains the last good snapshot.
  
  #### What should I do?
  
  `cacheHint.lastModified` is no longer populated automatically. For an entry's displayed modification date, use `entry.data.updatedAt` instead; it is not a validator for the whole page.
  
  Pages relying on automatic validators also lose Astro's implicit `Cache-Control: no-cache` header. Set your own browser `Cache-Control` if you need a fresh check on every visit. If you want conditional requests, supply a custom `lastModified` hint to `Astro.cache.set()`. Its timestamp must advance whenever any part of the response changes, including settings, related entries, deletions, and unpublishes.

### Change 12

Applies to: `emdash@1.4.0` (patch)  
Source: [#4157](https://github.com/emdash-cms/emdash/pull/4157)

Fixes external auth providers, such as Cloudflare Access, writing the session store on every authenticated `/_emdash` request. EmDash now writes the session only when the signed-in user differs from the stored one, so sites on Cloudflare no longer spend one Workers KV write per request, which could exhaust the Workers Free plan's daily write limit and hit KV's one-write-per-second limit on a key for parallel requests.

### Change 13

Applies to: `emdash@1.4.0` (patch)  
Source: [#3192](https://github.com/emdash-cms/emdash/pull/3192)

Names media downloads after the file that was uploaded. The public media file route previously sent `Content-Disposition: attachment` with no `filename`, so browsers fell back to the last path segment of the URL and saved every PDF, DOCX or CSV under its storage key. The route now looks the original filename up by storage key and emits both the quoted ASCII `filename` and the RFC 5987 `filename*` form, so non-ASCII names survive.
  
  Media with no matching database row is served exactly as before, and a failed lookup never fails the download.

### Change 14

Applies to: `emdash@1.4.0` (patch)  
Source: [#3129](https://github.com/emdash-cms/emdash/pull/3129)

Fixes saving an entry turning an empty image or file field (`""`) into `{ "provider": "external", "id": "", "src": "" }`. A blank image or file field, or a blank image inside a repeater, is now saved as `null`, the canonical empty value. Entries with no image stop changing on every save after that.
  
  A required image or file field now returns a validation error for `""` instead of saving an empty image. This only affects API, MCP or import clients, because the admin never sends `""`.

### Change 15

Applies to: `emdash@1.4.0` (patch)  
Source: [#4296](https://github.com/emdash-cms/emdash/pull/4296)

Fixes media usage tracking in collections that have a reference field named `title` or `name`, where saving an entry recorded none of the images and files it uses. Saving now records them.
  
  #### What should I do?
  
  Entries in those collections that were saved before this release can still be missing from **Used in** after you upgrade. Open **Settings → Media usage tracking** and wait until it shows **Ready**. If it shows **Needs attention** instead, repair each affected collection once:
  
  ```sh
  npx emdash media repair-usage --collection <collection>
  ```

### Change 16

Applies to: `emdash@1.4.0` (patch)  
Source: [#4285](https://github.com/emdash-cms/emdash/pull/4285)

Fixes menus showing dead links to entries that are in the trash or not published. `getMenu()` leaves those items out. Any item `getMenu()` leaves out now takes its child items with it, instead of moving them to the top level of the menu. In edit mode, menus still link to unpublished entries. With the object cache enabled, a cached menu now refreshes when an entry or taxonomy term it links to changes.

### Change 17

Applies to: `emdash@1.4.0` (patch)  
Source: [#4365](https://github.com/emdash-cms/emdash/pull/4365)

Fixes creating a child menu item through the menu items API on PostgreSQL. A request with a `parentId` and no `sortOrder` failed; the item is now placed after its existing siblings.

### Change 18

Applies to: `emdash@1.4.0` (patch)  
Source: [#4208](https://github.com/emdash-cms/emdash/pull/4208)

Fixes content list search, in the admin and through the content list API's `q` parameter, failing when the collection has a reference field named `title` or `name`. The search now leaves out a reference field bound to a relation and matches the entry's other fields.

### Change 19

Applies to: `emdash@1.4.0` (patch)  
Source: [#4205](https://github.com/emdash-cms/emdash/pull/4205)

Fixes entry creation, entry saves and content-list search failing with `no such column` in a collection that has a reference field marked `searchable`. Adding such a field to a search-enabled collection failed, and after a seed turned search on, creating or saving any entry in that collection failed. Site search and content-list search now ignore the `searchable` flag on a reference field bound to a relation.
  
  #### What should I do?
  
  If creating or saving entries in a collection still fails after upgrading and the server log shows `no such column`, open the collection under **Content Types**, untick **Search** and save, then tick it again and save. This rebuilds the collection's search index.

### Change 20

Applies to: `emdash@1.4.0` (patch)  
Source: [#4386](https://github.com/emdash-cms/emdash/pull/4386)

Fixes entry slugs being generated from a field named `title` instead of the collection's configured title field. In a collection whose `titleField` is `name` and which also has a `title` field (a person's job title, say), typing in the editor now fills the slug from the name, and entries created through the API without a slug get one from the name too, so two people with the same job title no longer collide with `SLUG_CONFLICT`. Collections without a `titleField` keep the previous `title`, then `name`, order.

### Change 21

Applies to: `emdash@1.4.0` (patch)  
Source: [#4380](https://github.com/emdash-cms/emdash/pull/4380)

Fixes `emdash site import` failing with `COLLECTION_EXISTS` when manually deleted target collections still have media-usage cleanup pending. For these manually deleted collections, import now runs as many cleanup steps as the request budget allows, then imports the collection in the same request if enough budget remains. It waits for active deletion leases or retry delays before reusing a slug. Cancellation during this per-collection cleanup stops before importing the collection. Failed cleanup of a manually deleted collection includes recovery instructions, and collection schema error messages are preserved in status `errorDetail`.

### Change 22

Applies to: `emdash@1.4.0` (patch)  
Source: [#4276](https://github.com/emdash-cms/emdash/pull/4276)

Fixes site builds using `zustand/traditional` or other dependencies that default-import `use-sync-external-store` shims, which previously failed with a missing default export error.

### Change 23

Applies to: `emdash@1.4.0` (patch)  
Source: [#4396](https://github.com/emdash-cms/emdash/pull/4396)

Fixes keyboard navigation and entrance animations in the admin and visual editor's floating toolbars with Tiptap 3.20.3 and later. Escape closes image alt-text editing, Shift+Tab returns to the caption, and arrow keys move between toolbar controls again.

### Change 24

Applies to: `emdash@1.4.0` (patch)  
Source: [#3279](https://github.com/emdash-cms/emdash/pull/3279)

Fixes the visual editing toolbar's "Open in admin" so each entry gets its own admin window. The window name was a single constant shared by the whole site, so opening the admin for one entry navigated away from another already open in that tab. A repeat click on the same entry still reuses that entry's window.

### Change 25

Applies to: `emdash@1.4.0` (patch)  
Source: [#3596](https://github.com/emdash-cms/emdash/pull/3596)

Caches widget areas in the object cache. With an object cache configured, `<WidgetArea>`, `getWidgetArea()`, `getWidgetAreaWithCacheHint()` and `getWidgetAreas()` no longer query the database on each page load. Widget changes made in the admin, by seeding or by a site transfer invalidate the cached areas; code that writes the widget tables directly should call the new `invalidateWidgetObjectCache()` export.

### Change 26

Applies to: `emdash@1.4.0` (patch)  
Source: [#3890](https://github.com/emdash-cms/emdash/pull/3890)

Fixes importing WordPress custom post types with a hyphen in their name (such as `team-member`) through the EmDash Exporter plugin. The import created the `team_member` collection but then failed every entry with `Collection "team-member" does not exist`, and custom taxonomies for that post type were not linked to the collection. The review step now shows the collection the import will use and recognizes it on a repeated import, so field type conflicts with it are reported. The `wxrSource` import source now suggests the same valid collection names, such as `team_member` for `team-member` and `wp_content` for a post type named `content`.

## Agent skills

The updater ran:

```sh
npx --yes skills@1.7.0 add emdash-cms/skills -y
```

Use the refreshed `upgrading-emdash` skill for this work order. If the skills command reported a conflict or failure, resolve that before continuing.

## Core database migrations

Installed EmDash changed from `1.3.1` to `1.4.0`.

No core migrations were added by this upgrade.

Build the upgraded project and inspect the exact database target:

```sh
npm run build
npm exec -- emdash migrate --status
```

If the status reports pending migrations, stop before starting or deploying the upgraded application. Follow [Backups and recovery](https://docs.emdashcms.com/guides/backups/) to create a restorable recovery point. A JSON backup is not a recovery point. After a human has reviewed the target and backup, apply the pending migrations:

```sh
npm exec -- emdash migrate
```

The command shows the target and asks for confirmation. In a non-interactive shell, add `--expected-target-fingerprint` with the target fingerprint that the status command printed for the reviewed database.

Deploy the same build artifact with the project's deployment workflow, without rebuilding it. On Cloudflare Workers, run `wrangler deploy`.

Verify the deployed database against that artifact:

```sh
npm exec -- emdash migrate --check
```

## Verification

1. Assess every release entry above and make the project changes it requires.
2. Run the project's format, tests, typecheck, and build commands.
3. Inspect the migration target and pending names before applying them.
4. Verify the public site, admin sign-in, content editing, media reads, and encrypted plugin settings after deployment.
