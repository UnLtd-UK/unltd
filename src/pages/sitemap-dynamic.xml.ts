import type { APIRoute } from "astro";
import { getAllPosts, postYears } from "@lib/posts-runtime";
import { getPageSlugs } from "@lib/pages-runtime";
import { getResourceGroups } from "@lib/resources-runtime";
import { getAllEmails } from "@lib/emails-runtime";

// The blog, CMS pages, resources and contact pages are rendered on demand, so the sitemap integration
// can't see them at build time. This lists them from EmDash; the integration
// links to it from sitemap-index.xml (see `customSitemaps` in astro.config.mjs).
export const prerender = false;

const escapeXml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export const GET: APIRoute = async ({ site, cache }) => {
  const [
    { posts, cacheHints: postHints },
    { pages, cacheHints: pageHints },
    { groups, cacheHints: resourceHints },
    { emails, cacheHints: emailHints },
  ] = await Promise.all([getAllPosts(), getPageSlugs(), getResourceGroups(), getAllEmails()]);
  if (cache?.enabled) {
    [...postHints, ...pageHints, ...resourceHints, ...emailHints].forEach((hint) => cache.set(hint));
    cache.set({ maxAge: 3600, swr: 86400 });
  }

  const origin = String(site).replace(/\/$/, "");
  const urls: { path: string; lastmod?: string | null }[] = [
    ...pages.map((page) => ({ path: `/${page.slug}`, lastmod: page.updatedAt })),
    { path: "/resources" },
    // Hidden resources are only reachable by direct link, so they are left out.
    ...groups.flatMap((group) => group.resources.map((resource) => ({ path: resource.href }))),
    { path: "/contact" },
    ...emails.map((email) => ({ path: `/contact/${email.slug}` })),
    { path: "/blog" },
    ...postYears(posts).map((year) => ({ path: `/blog/${year}` })),
    ...posts.map((post) => ({ path: `/blog/${post.slug}`, lastmod: post.date })),
  ];

  const body = urls
    .map(
      ({ path, lastmod }) =>
        `  <url><loc>${escapeXml(origin + path)}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}</url>`,
    )
    .join("\n");

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`,
    { headers: { "Content-Type": "application/xml; charset=utf-8" } },
  );
};
