/**
 * FDC3 Agent API
 *
 * The FDC3 Agent provides a thin wrapper API that tiles use to access FDC3 operations.
 * It acts as a client-side proxy that delegates all FDC3 calls to the central broker
 * running in the base MFE, enabling seamless interoperability across micro-frontends.
 *
 * ## Architecture
 *
 * The agent follows a client-server pattern where:
 * - Tiles (client MFEs) import and use the agent API
 * - Base MFE (server) hosts the central broker implementation
 * - Communication happens through React context and direct delegation
 *
 * ## Usage Pattern
 *
 * ```tsx
 * import { getAgentApi } from '@fm/fdc3-agent';
 *
 * // Get the FDC3 API
 * const fdc3 = getAgentApi();
 *
 * // Use standard FDC3 operations
 * await fdc3.broadcast(context);
 * await fdc3.raiseIntent('ViewChart', context);
 * ```
 *
 * @see data-model.md#L369-L390
 * @see {@link ./hooks.ts} For React hooks that provide convenient access to FDC3
 * @packageDocumentation
 */

import type { AppIdentifier, DesktopAgent, RatanDesktopAgent } from './types';

/**
 * Gets or creates the global FDC3 namespace on window.
 *
 * @returns The global FDC3 namespace object
 * @internal
 */
function getGlobalNamespace(): Window['__RATAN_FDC3__'] {
  if (typeof window === 'undefined') {
    return undefined;
  }

  if (!window.__RATAN_FDC3__) {
    window.__RATAN_FDC3__ = {};
  }

  return window.__RATAN_FDC3__;
}

/**
 * Current broker instance that will be set by the base MFE.
 *
 * This internal variable holds the reference to the DesktopAgent implementation
 * provided by the broker. It's initialized when the base MFE mounts and provides
 * the broker instance to all consuming tiles.
 *
 * The broker instance is stored in a global namespace (window.__RATAN_FDC3__)
 * to ensure it's shared across all MFEs in the micro-frontend architecture.
 *
 * @internal
 */
function getBrokerInstance(): RatanDesktopAgent | null {
  const namespace = getGlobalNamespace();
  return namespace?.brokerInstance ?? null;
}

function setBrokerInstance(broker: RatanDesktopAgent | null): void {
  const namespace = getGlobalNamespace();
  if (namespace) {
    namespace.brokerInstance = broker;
  }
}

/**
 * Sets the broker instance that the agent will delegate all FDC3 operations to.
 *
 * This function is called by the base MFE during initialization to provide the
 * DesktopAgent implementation that tiles will use. The broker instance implements
 * all FDC3 2.2 operations and manages communication between tiles.
 *
 * ## When to Use
 *
 * This function is typically called automatically by the base MFE's BrokerProvider
 * during application startup. Manual calls are rarely needed except in testing scenarios.
 *
 * ## Lifecycle
 *
 * - Called during base MFE initialization
 * - Remains active for the lifetime of the application
 * - Can be replaced by calling setBroker again with a new instance
 * - Cleared via clearBroker() during cleanup or testing
 *
 * @param broker - The DesktopAgent instance from the broker that implements FDC3 operations
 *
 * @example
 * ```tsx
 * import { Broker } from '@fm/fdc3-broker';
 * import { setBroker } from '@fm/fdc3-agent';
 *
 * // In base MFE initialization
 * const broker = new Broker({
 *   intentResolver: new IntentResolver(),
 *   channelManager: new ChannelManager()
 * });
 *
 * setBroker(broker);
 * ```
 *
 * @throws Will throw if broker is null or undefined
 *
 * @see {@link getAgentApi} For retrieving the broker instance
 * @see {@link clearBroker} For clearing the broker instance
 */
export function setBroker(broker: DesktopAgent): void {
  setBrokerInstance(broker as RatanDesktopAgent);
}

/**
 * Retrieves the FDC3 Agent API for use in tiles.
 *
 * This function provides access to the DesktopAgent interface that implements
 * all FDC3 2.2 standard operations. All method calls are delegated to the central
 * broker running in the base MFE, enabling seamless cross-MFE communication.
 *
 * ## FDC3 Operations Available
 *
 * The returned DesktopAgent provides:
 * - **Intent-based communication**: raiseIntent, raiseIntentForContext, addIntentListener
 * - **Context broadcasting**: broadcast, addContextListener
 * - **Channel operations**: joinChannel, getCurrentChannel, getUserChannels, createPrivateChannel
 * - **App discovery**: findIntent, findIntentsByContext, findApplications
 * - **Metadata**: getInfo
 *
 * ## Error Handling
 *
 * This function will throw an error if the broker hasn't been initialized yet.
 * Ensure that the base MFE has mounted and set the broker before calling this function.
 *
 * ## React Context Alternative
 *
 * For React components, consider using the {@link useFDC3} hook which provides
 * automatic error handling and context integration:
 *
 * ```tsx
 * import { useFDC3 } from '@fm/fdc3-agent';
 *
 * function MyComponent() {
 *   const fdc3 = useFDC3();
 *   // No null check needed
 * }
 * ```
 *
 * @returns The DesktopAgent instance that delegates all operations to the broker
 *
 * @throws {Error} Throws if broker instance is null (not initialized by base MFE)
 *
 * @example
 * ```tsx
 * import { getAgentApi } from '@fm/fdc3-agent';
 * import type { Context } from '@fm/fdc3-agent';
 *
 * // In a utility function or outside React
 * async function broadcastInstrument(instrument: Context) {
 *   const fdc3 = getAgentApi();
 *   await fdc3.broadcast(instrument);
 * }
 *
 * // In an event handler
 * function handleViewChart() {
 *   const fdc3 = getAgentApi();
 *   fdc3.raiseIntent('ViewChart', {
 *     type: 'fdc3.instrument',
 *     id: { ticker: 'AAPL' }
 *   });
 * }
 * ```
 *
 * @see {@link setBroker} For initializing the broker instance
 * @see {@link useFDC3} For React hook alternative
 * @see [FDC3 DesktopAgent Specification](https://fdc3.finos.org/docs/api/next/DesktopAgent/)
 */
export function getAgentApi(): RatanDesktopAgent {
  const brokerInstance = getBrokerInstance();

  if (!brokerInstance) {
    throw new Error('FDC3 Agent not initialized. Make sure BrokerProvider is mounted in base MFE.');
  }

  return brokerInstance;
}

/**
 * Clears the broker instance, primarily used for testing and cleanup.
 *
 * This function removes the current broker instance reference, causing subsequent
 * calls to getAgentApi() to throw an error until setBroker() is called again.
 *
 * ## Use Cases
 *
 * - **Testing**: Reset state between test cases
 * - **Cleanup**: Remove references during application shutdown
 * - **Reinitialization**: Clear old instance before setting a new one
 *
 * ## Warning
 *
 * After calling this function, all tiles will lose FDC3 functionality until
 * setBroker() is called again. Use with caution in production code.
 *
 * @example
 * ```tsx
 * import { setBroker, getAgentApi, clearBroker } from '@fm/fdc3-agent';
 * import { Broker } from '@fm/fdc3-broker';
 *
 * // Setup
 * const broker = new Broker();
 * setBroker(broker);
 * console.log(getAgentApi()); // DesktopAgent instance
 *
 * // Cleanup
 * clearBroker();
 * console.log(getAgentApi()); // Throws error
 * ```
 *
 * @see {@link setBroker} For setting a new broker instance
 * @see {@link getAgentApi} For retrieving the broker instance
 */
export function clearBroker(): void {
  setBrokerInstance(null);
}

// ---------------------------------------------------------------------------
// Current tile identity  (bridges MFE boundaries for FDC3 source scoping)
//
// The AgentProvider React context is NOT shared across MFE boundaries because
// ratan-fdc3-agent is bundled into each MFE independently.  To ensure that
// useFDC3() in a tile MFE receives a scoped agent, the base MFE's
// FDC3TileProvider stores the tile's identity here during render.
// ---------------------------------------------------------------------------

/**
 * Store the identity of the tile currently being rendered, so that
 * useFDC3() in child MFEs can create a properly scoped ScopedDesktopAgent.
 *
 * Called during the render phase of FDC3TileProvider (base MFE).
 */
export function setCurrentTile(tile: AppIdentifier | null): void {
  const ns = getGlobalNamespace();
  if (ns) ns.currentTile = tile;
}

/**
 * Retrieve the tile identity set by the nearest FDC3TileProvider, or null
 * when no tile is currently rendering.
 */
export function getCurrentTile(): AppIdentifier | null {
  const ns = getGlobalNamespace();
  return ns?.currentTile ?? null;
}
