/**
 * @fm/fdc3-agent
 *
 * FDC3 agent API for MFE tiles providing seamless cross-MFE interoperability.
 *
 * ## Overview
 *
 * The fdc3-agent package provides a lightweight client-side API that tiles use to
 * access FDC3 (Financial Desktop Connectivity and Collaboration Consortium) operations.
 * It acts as a proxy that delegates all FDC3 calls to the central broker running in
 * the base MFE, enabling seamless communication across micro-frontends.
 *
 * ## Architecture
 *
 * ```
 * ┌─────────────────────────────────────────────────────────┐
 * │                    Base MFE                              │
 * │  ┌─────────────────────────────────────────────────┐   │
 * │  │         FDC3 Broker (fdc3-broker)              │   │
 * │  │  - Intent routing                              │   │
 * │  │  - Context broadcasting                        │   │
 * │  │  - Channel management                          │   │
 * │  └─────────────────────────────────────────────────┘   │
 * └─────────────────────────────────────────────────────────┘
 *                           ↑
 *                           │ Delegates to
 *                           │
 * ┌─────────────────────────────────────────────────────────┐
 * │                    Tile MFEs                             │
 * │  ┌─────────────────────────────────────────────────┐   │
 * │  │         FDC3 Agent (this package)               │   │
 * │  │  - getAgentApi()                               │   │
 * │  │  - useFDC3() hook                              │   │
 * │  │  - useIntentListener()                         │   │
 * │  │  - useContextListener()                        │   │
 * │  │  - AgentProvider                               │   │
 * │  └─────────────────────────────────────────────────┘   │
 * └─────────────────────────────────────────────────────────┘
 * ```
 *
 * ## Installation
 *
 * ```bash
 * yarn add @fm/fdc3-agent
 * ```
 *
 * ## Quick Start
 *
 * ### 1. Setup in Base MFE (One-time)
 *
 * The base MFE initializes the broker and sets it globally:
 *
 * ```tsx
 * import { Broker } from '@fm/fdc3-broker';
 * import { setBroker } from '@fm/fdc3-agent';
 *
 * // Initialize broker
 * const broker = new Broker({
 *   intentResolver: new IntentResolver(),
 *   channelManager: new ChannelManager()
 * });
 *
 * // Make available to all tiles
 * setBroker(broker);
 * ```
 *
 * ### 2. Use in Tile MFEs
 *
 * **Option A: Using React Hooks (Recommended)**
 *
 * ```tsx
 * import { AgentProvider, useFDC3 } from '@fm/fdc3-agent';
 * import type { Context } from '@fm/fdc3-agent';
 *
 * function App() {
 *   return (
 *     <AgentProvider>
 *       <InstrumentTile />
 *     </AgentProvider>
 *   );
 * }
 *
 * function InstrumentTile() {
 *   const fdc3 = useFDC3();
 *
 *   const handleBroadcast = async (instrument: Context) => {
 *     await fdc3.broadcast(instrument);
 *   };
 *
 *   const handleViewChart = async (instrument: Context) => {
 *     await fdc3.raiseIntent('ViewChart', instrument);
 *   };
 *
 *   return (
 *     <button onClick={() => handleBroadcast({ type: 'fdc3.instrument', id: { ticker: 'AAPL' } })}>
 *       Broadcast AAPL
 *     </button>
 *   );
 * }
 * ```
 *
 * **Option B: Using getAgentApi Directly**
 *
 * ```tsx
 * import { getAgentApi } from '@fm/fdc3-agent';
 * import type { Context } from '@fm/fdc3-agent';
 *
 * function broadcastInstrument(instrument: Context) {
 *   const fdc3 = getAgentApi();
 *   fdc3.broadcast(instrument);
 * }
 * ```
 *
 * ## Key Features
 *
 * - **FDC3 2.2 Compliant**: Full implementation of the FDC3 2.2 standard
 * - **Type-Safe**: Comprehensive TypeScript types exported from @finos/fdc3
 * - **React Hooks**: Convenient hooks for automatic lifecycle management
 * - **Zero Configuration**: Works out of the box once broker is set up
 * - **Automatic Cleanup**: Hooks handle listener subscription/unsubscription
 *
 * ## Available APIs
 *
 * ### Core Agent API
 * - {@link getAgentApi} - Get the DesktopAgent instance
 * - {@link setBroker} - Set the broker instance (base MFE only)
 * - {@link clearBroker} - Clear the broker instance (testing)
 *
 * ### React Hooks
 * - {@link AgentProvider} - Provider component for React context
 * - {@link useFDC3} - Access the FDC3 DesktopAgent API
 * - {@link useIntentListener} - Listen for intents with automatic cleanup
 * - {@link useContextListener} - Listen for context broadcasts with automatic cleanup
 * - {@link useCurrentChannel} - Get the current FDC3 channel
 * - {@link useUserChannels} - Get list of available user channels
 *
 * ### Types
 * All types from @finos/fdc3 are re-exported for convenience:
 * - Context, AppIdentifier, AppMetadata, Intent, IntentResolution, AppIntent
 * - Channel, PrivateChannel, Listener
 * - DisplayMetadata, FDC3Event, ImplementationMetadata
 *
 * ## Common Patterns
 *
 * ### Intent-Based Communication
 *
 * ```tsx
 * import { useIntentListener, useFDC3 } from '@fm/fdc3-agent';
 *
 * function ChartTile() {
 *   const fdc3 = useFDC3();
 *
 *   // Listen for intent
 *   useIntentListener('ViewChart', (context) => {
 *     renderChart(context);
 *   });
 *
 *   // Raise intent
 *   const showChart = (context: Context) => {
 *     fdc3.raiseIntent('ViewChart', context);
 *   };
 * }
 * ```
 *
 * ### Context Broadcasting
 *
 * ```tsx
 * import { useFDC3 } from '@fm/fdc3-agent';
 *
 * function InstrumentSelector() {
 *   const fdc3 = useFDC3();
 *
 *   const onInstrumentChange = async (ticker: string) => {
 *     await fdc3.broadcast({
 *       type: 'fdc3.instrument',
 *       id: { ticker }
 *     });
 *   };
 * }
 * ```
 *
 * ### Channel Management
 *
 * ```tsx
 * import { useUserChannels, useCurrentChannel, useFDC3 } from '@fm/fdc3-agent';
 *
 * function ChannelSwitcher() {
 *   const channels = useUserChannels();
 *   const currentChannel = useCurrentChannel();
 *   const fdc3 = useFDC3();
 *
 *   const joinChannel = async (channelId: string) => {
 *     await fdc3.joinChannel(channelId);
 *   };
 *
 *   return (
 *     <select value={currentChannel?.id} onChange={(e) => joinChannel(e.target.value)}>
 *       {channels.map(ch => (
 *         <option key={ch.id} value={ch.id}>
 *           {ch.displayMetadata?.name || ch.id}
 *         </option>
 *       ))}
 *     </select>
 *   );
 * }
 * ```
 *
 * @packageDocumentation
 */

// ============================================================================
// FDC3 Types from @finos/fdc3
// ============================================================================

/**
 * Re-exports all FDC3 types from the @finos/fdc3 package.
 *
 * These types provide full TypeScript support for FDC3 operations:
 *
 * ## Core Types
 * - **Context**: Standardized context data structure for sharing information
 * - **AppIdentifier**: Unique identifier for an application
 * - **AppMetadata**: Metadata about an application
 * - **Intent**: Represents an intent that can be raised
 * - **IntentResolution**: Result of raising an intent
 * - **AppIntent**: Combination of intent and app metadata
 *
 * ## Channel Types
 * - **Channel**: User channel for broadcasting context
 * - **PrivateChannel**: Private channel for app-to-app communication
 * - **DisplayMetadata**: Display information for channels
 *
 * ## Listener & Events
 * - **Listener**: Handle for unsubscribing from intents/contexts
 * - **FDC3Event**: FDC3 event types
 *
 * ## Metadata
 * - **ImplementationMetadata**: FDC3 implementation details
 *
 * @example
 * ```tsx
 * import type { Context, AppIdentifier, IntentResolution } from '@fm/fdc3-agent';
 *
 * const context: Context = {
 *   type: 'fdc3.instrument',
 *   id: { ticker: 'AAPL' }
 * };
 *
 * const app: AppIdentifier = {
 *   appId: 'my-chart-app'
 * };
 * ```
 */

// Re-export all FDC3 types from @finos/fdc3
export type {
  AppIdentifier,
  AppIntent,
  AppMetadata,
  Channel,
  // Core types
  Context,
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
export type { ModuleCompositionApi, RatanDesktopAgent, TileLifecycleApi } from './types';
export type { ExposedModule, ModuleLoaderApi, ModuleReference } from 'ratan-module-composition';

// ============================================================================
// Agent API
// ============================================================================

/**
 * Core agent API functions for FDC3 operations.
 *
 * These functions provide the foundation for FDC3 agent functionality:
 *
 * - **getAgentApi**: Retrieves the DesktopAgent instance for FDC3 operations
 * - **setBroker**: Sets the broker instance (called by base MFE)
 * - **clearBroker**: Clears the broker instance (for testing)
 *
 * @example
 * ```tsx
 * import { getAgentApi } from '@fm/fdc3-agent';
 *
 * const fdc3 = getAgentApi();
 * await fdc3.broadcast({ type: 'fdc3.instrument', id: { ticker: 'AAPL' } });
 * ```
 *
 * @see {@link ./agent.ts} For detailed documentation
 */
export { clearBroker, getAgentApi, setBroker, setCurrentTile, getCurrentTile } from './agent';

// ============================================================================
// React Hooks
// ============================================================================

/**
 * React hooks for convenient FDC3 integration in tile components.
 *
 * These hooks provide automatic lifecycle management for FDC3 operations:
 *
 * - **AgentProvider**: React context provider for FDC3 access
 * - **useFDC3**: Hook to access the DesktopAgent API
 * - **useIntentListener**: Hook for listening to intents with automatic cleanup
 * - **useContextListener**: Hook for listening to context broadcasts with automatic cleanup
 * - **useCurrentChannel**: Hook to get the current FDC3 channel
 * - **useUserChannels**: Hook to get list of available user channels
 *
 * @example
 * ```tsx
 * import { AgentProvider, useFDC3, useIntentListener } from '@fm/fdc3-agent';
 *
 * function App() {
 *   return (
 *     <AgentProvider>
 *       <ChartTile />
 *     </AgentProvider>
 *   );
 * }
 *
 * function ChartTile() {
 *   const fdc3 = useFDC3();
 *
 *   useIntentListener('ViewChart', (context) => {
 *     console.log('Received:', context);
 *   });
 *
 *   return <div>Chart</div>;
 * }
 * ```
 *
 * @see {@link ./hooks.ts} For detailed documentation
 */
export {
  AgentProvider,
  useAppIdentifier,
  useContextListener,
  useCurrentChannel,
  useFDC3,
  useIntentListener,
  useUserChannels,
} from './hooks';

// ============================================================================
// Error Boundary
// ============================================================================

export type { ErrorBoundaryProps } from './ErrorBoundary';
/**
 * React Error Boundary component for FDC3 agent operations.
 *
 * Provides error handling for FDC3 agent hooks and operations, catching
 * JavaScript errors in child components and displaying fallback UI.
 *
 * @example
 * ```tsx
 * import { ErrorBoundary, AgentProvider } from '@fm/fdc3-agent';
 *
 * <ErrorBoundary onError={(error) => console.error(error)}>
 *   <AgentProvider>{children}</AgentProvider>
 * </ErrorBoundary>
 * ```
 *
 * @see {@link ./ErrorBoundary} For detailed documentation
 */
export { ErrorBoundary } from './ErrorBoundary';
