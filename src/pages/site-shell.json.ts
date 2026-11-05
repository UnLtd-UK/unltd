import { headerNavigation, footerLinks } from "@data/menu.ts";
import { rounds } from "@data/rounds.ts";

// Built once with the site so on-demand pages (the blog) can render the same
// header, footer and round banner without reading EmDash themselves.
export const prerender = true;

export function GET() {
  return Response.json({ navigation: headerNavigation, footerLinks, rounds });
}
