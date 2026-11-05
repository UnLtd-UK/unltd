import { programmeEvents } from "@data/eventCollections.ts";

// Built once with the site so on-demand pages (the resources list) can show
// upcoming events without reading Eventbrite themselves.
export const prerender = true;

export function GET() {
  return Response.json(programmeEvents);
}
