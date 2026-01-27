/**
 * FDC3 Types
 *
 * Re-exports all FDC3 types from @finos/fdc3 for internal use.
 * This file provides a central location for type imports used throughout the agent package.
 *
 * @packageDocumentation
 */

import type { DesktopAgent } from '@finos/fdc3';

// Re-export all FDC3 types from @finos/fdc3
export type {
  AppIdentifier,
  AppIntent,
  AppMetadata,
  Channel,
  // Core types
  Context,
  // DesktopAgent
  DesktopAgent,
  // Channel types
  DisplayMetadata,
  // Event types
  FDC3Event,
  // Implementation metadata
  ImplementationMetadata,
  Intent,
  IntentResolution,
  Listener,
  PrivateChannel,
} from '@finos/fdc3';

/**
 * Global namespace for FDC3 state sharing across MFEs.
 *
 * In a micro-frontend architecture with Module Federation, each bundle can have
 * its own scope for module-level variables. To share state across different MFEs,
 * we use a global namespace on the window object.
 *
 * @internal
 */
declare global {
  interface Window {
    __RATAN_FDC3__?: {
      brokerInstance?: DesktopAgent | null;
    };
  }
}
