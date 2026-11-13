import handler, {
  createScheduledHandler,
  EmDashRoom,
  EmDashRoomSite,
  PluginBridge,
} from "@emdash-cms/cloudflare/worker";

// PluginBridge must be exported from the Worker entry so EmDash's sandboxed
// (registry) plugins can resolve their bridge through the LOADER binding.
// EmDashRoom and EmDashRoomSite run co-editing rooms (EMDASH_ROOMS binding).
export { EmDashRoom, EmDashRoomSite, PluginBridge };

export default {
  ...handler,
  scheduled: createScheduledHandler(),
} satisfies ExportedHandler;
