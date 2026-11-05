import type { AstroGlobal } from "astro";
import type { headerNavigation, FooterLinkGroup } from "@data/menu.ts";
import type { RoundEntry } from "@data/rounds.ts";

/** The content shared by every page's header, footer and round banner. */
export interface SiteShell {
  navigation: typeof headerNavigation;
  footerLinks: FooterLinkGroup[];
  rounds: RoundEntry[];
}

type ShellContext = Pick<AstroGlobal, "isPrerendered" | "url" | "request">;

const SHELL_PATH = "/site-shell.json";
const shellByRequest = new WeakMap<Request, Promise<SiteShell>>();

/**
 * Prerendered pages read the shell from EmDash during the build. On-demand
 * pages run in the Worker, which can't do that work (it fetches over HTTP at
 * module load), so they read the copy the build wrote to /site-shell.json.
 * Menus and rounds therefore still update on a rebuild, not on a CMS edit.
 */
export function loadSiteShell(context: ShellContext): Promise<SiteShell> {
  if (context.isPrerendered) return loadFromBuild();
  let shell = shellByRequest.get(context.request);
  if (!shell) {
    shell = loadFromAssets(context.url);
    shellByRequest.set(context.request, shell);
  }
  return shell;
}

async function loadFromBuild(): Promise<SiteShell> {
  const [{ headerNavigation, footerLinks }, { rounds }] = await Promise.all([
    import("@data/menu.ts"),
    import("@data/rounds.ts"),
  ]);
  return { navigation: headerNavigation, footerLinks, rounds };
}

async function loadFromAssets(url: URL): Promise<SiteShell> {
  const shellUrl = new URL(SHELL_PATH, url);
  // A Worker can't fetch its own public URL, so read the static file through
  // the ASSETS binding. `astro dev` has no built assets; its server serves the
  // endpoint instead.
  const response = import.meta.env.DEV
    ? await fetch(shellUrl)
    : await (await import("cloudflare:workers")).env.ASSETS.fetch(shellUrl);
  if (!response.ok) {
    throw new Error(`Could not load ${SHELL_PATH} (${response.status}); was the site built?`);
  }
  return (await response.json()) as SiteShell;
}
