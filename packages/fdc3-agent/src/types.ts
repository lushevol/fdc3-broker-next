/**
 * FDC3 Types
 *
 * Re-exports all FDC3 types from @finos/fdc3 for internal use.
 * This file provides a central location for type imports used throughout the agent package.
 *
 * @packageDocumentation
 */

import type { AppIdentifier, AppMetadata, DesktopAgent } from '@finos/fdc3';
import type { ModuleLoaderApi } from 'ratan-module-composition';
import type {
  WorkflowDefinition,
  WorkflowEvent,
  WorkflowEventListener,
  WorkflowEventSubscription,
  WorkflowJsonObject,
  WorkflowOptions,
  WorkflowResolution,
} from 'ratan-fdc3-broker';

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
  EventHandler,
  // Event types
  FDC3Event,
  FDC3EventTypes,
  // Implementation metadata
  ImplementationMetadata,
  Intent,
  IntentHandler,
  IntentResolution,
  Listener,
  PrivateChannel,
} from '@finos/fdc3';

export type {
  WorkflowDefinition,
  WorkflowEvent,
  WorkflowEventListener,
  WorkflowEventSubscription,
  WorkflowJsonObject,
  WorkflowOptions,
  WorkflowResolution,
  WorkflowTranscript,
  WorkflowStepResult,
} from 'ratan-fdc3-broker';

export interface WorkflowApi {
  raiseWorkflow(
    workflowId: string,
    input?: WorkflowJsonObject,
    options?: WorkflowOptions,
  ): Promise<WorkflowResolution>;
  findWorkflow(workflowId: string): Promise<WorkflowDefinition | null>;
  findWorkflowsByInput(input?: WorkflowJsonObject): Promise<WorkflowDefinition[]>;
}

export interface TileLifecycleApi {
  registerTile(instanceId: string, appId: string, metadata?: AppMetadata): Promise<void> | void;
  unregisterTile(instanceId: string): Promise<void> | void;
}

/** Platform-only composition API. It is intentionally not part of FDC3. */
export interface ModuleCompositionApi {
  readonly modules: ModuleLoaderApi;
}

export type RatanDesktopAgent = DesktopAgent &
  WorkflowApi &
  TileLifecycleApi &
  ModuleCompositionApi;

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
      brokerInstance?: RatanDesktopAgent | null;
      /**
       * Identity of the tile currently rendering, set by FDC3TileProvider.
       * Bridges MFE boundaries so that useFDC3() in a tile MFE (which cannot
       * share React context with the base MFE) can build a properly scoped
       * ScopedDesktopAgent.
       */
      currentTile?: AppIdentifier | null;
    };
  }
}
