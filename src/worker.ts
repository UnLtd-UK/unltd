import handler, {
  createScheduledHandler,
  EmDashRoom,
  EmDashRoomSite,
  PluginBridge,
} from "@emdash-cms/cloudflare/worker";
import { NewsletterConsent } from "./lib/newsletter/consent-object";

// PluginBridge must be exported from the Worker entry so EmDash's sandboxed
// (registry) plugins can resolve their bridge through the LOADER binding.
// EmDashRoom and EmDashRoomSite run co-editing rooms (EMDASH_ROOMS binding).
export { EmDashRoom, EmDashRoomSite, PluginBridge };

// Durable Object that serialises newsletter consent changes per email address.
export { NewsletterConsent };

export default {
  ...handler,
  scheduled: createScheduledHandler(),
} satisfies ExportedHandler;
