/**
 * How long on-demand CMS pages are cached (astro.config.mjs enables Cloudflare
 * route caching). EmDash also purges a page when its content is saved or
 * published, so this is only the fallback for anything not purged: the header,
 * footer and round banner come from the build. It is set on found pages only,
 * so a 404 is never cached and a page published later shows straight away.
 */
export const CMS_PAGE_CACHE = { maxAge: 600, swr: 3600 } as const;
