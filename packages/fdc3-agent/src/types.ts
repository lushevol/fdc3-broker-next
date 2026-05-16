/**
 * FDC3 Types
 *
 * Re-exports all FDC3 types from @finos/fdc3 for internal use.
 * This file provides a central location for type imports used throughout the agent package.
 *
 * @packageDocumentation
 */

import type { DesktopAgent } from '@finos/fdc3';
import type {
  WorkflowDefinition,
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
  // Event types
  FDC3Event,
  // Implementation metadata
  ImplementationMetadata,
  Intent,
  IntentResolution,
  Listener,
  PrivateChannel,
} from '@finos/fdc3';

export type {
  WorkflowDefinition,
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

export type RatanDesktopAgent = DesktopAgent & WorkflowApi;

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
    };
  }
}
