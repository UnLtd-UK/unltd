import handler, {
  createScheduledHandler,
  PluginBridge,
} from "@emdash-cms/cloudflare/worker";

// PluginBridge must be exported from the Worker entry so EmDash's sandboxed
// (registry) plugins can resolve their bridge through the LOADER binding.
export { PluginBridge };

export default {
  ...handler,
  scheduled: createScheduledHandler(),
} satisfies ExportedHandler;
