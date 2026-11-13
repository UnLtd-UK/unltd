import type { AstroGlobal } from "astro";

type Context = Pick<AstroGlobal, "url">;
export type PhosphorWeight = "regular" | "fill";

// An icon never changes, so each is kept for as long as the Worker instance lives.
const cache = new Map<string, Promise<string>>();

/**
 * The SVG for a Phosphor icon, or "" if there is no such icon. The files are
 * written at build time (see src/pages/ph) and read from the assets, not
 * bundled into the Worker. `astro dev` serves them from its own server.
 */
export function loadPhosphorIcon(context: Context, name: string, weight: PhosphorWeight): Promise<string> {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/^ph-/, "")
    .replace(/[\s_]+/g, "-");
  // Only a Phosphor-style name is looked up, so a CMS value can't point anywhere else.
  if (!/^[a-z0-9-]+$/.test(slug)) return Promise.resolve("");

  const key = `${weight}/${slug}`;
  let svg = cache.get(key);
  if (!svg) {
    svg = fetchIcon(new URL(`/ph/${key}.svg`, context.url)).then((result) => {
      // Don't remember a failure: a missing file today may exist after the next deploy.
      if (!result) cache.delete(key);
      return result;
    });
    cache.set(key, svg);
  }
  return svg;
}

async function fetchIcon(url: URL): Promise<string> {
  try {
    const response = import.meta.env.DEV
      ? await fetch(url)
      : await (await import("cloudflare:workers")).env.ASSETS.fetch(url);
    if (!response.ok) return "";
    const text = await response.text();
    return text.startsWith("<svg") ? text : "";
  } catch {
    return "";
  }
}
