/**
 * @fm/fdc3-broker
 *
 * FDC3 2.2-compliant broker implementation for MFE platform.
 */

// Export broker components
export { Broker } from './broker';
// Export channel components
export { ChannelImpl, PrivateChannelImpl, USER_CHANNEL_IDS } from './channel';
export { ChannelManager } from './channel-manager';
export type { ErrorBoundaryProps } from './ErrorBoundary';
// Export Error Boundary
export { ErrorBoundary } from './ErrorBoundary';
export { EntitlementValidator } from './entitlements';
// Export environment utilities
export * from './environment';
// Export error types
export * from './errors';
export { IntentQueueImpl } from './intent-queue';
export { IntentResolver } from './intent-resolver';
// Export logger
export { Logger, LogLevel } from './logger';
// Export OpenFin bridge
export { OpenFinBridge } from './openfin-bridge';
// Export performance tracker
export { PerformanceTracker } from './performance';
// Export PostMessage bridge
export {
  PostMessageBridge,
  type PostMessageBridgeOptions,
  type PostMessageEnvelope,
  type PostMessageEvent,
  type PostMessageRequest,
  type PostMessageResponse,
} from './postmessage-bridge';
export { TileRegistryImpl } from './tile-registry';
// Export all types
export * from './types';
