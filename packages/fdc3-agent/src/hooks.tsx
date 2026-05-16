/**
 * React Hooks for FDC3 Agent
 *
 * This module provides convenient React hooks that tiles can use to access FDC3 operations
 * with automatic lifecycle management. Hooks handle listener cleanup, context integration,
 * and state synchronization for common FDC3 workflows.
 *
 * ## Features
 *
 * - **Automatic cleanup**: All hooks properly unsubscribe listeners on unmount
 * - **React integration**: Seamless integration with React component lifecycle
 * - **Type safety**: Full TypeScript support with proper type inference
 * - **Error handling**: Graceful fallbacks when context is unavailable
 *
 * ## Provider Setup
 *
 * Before using hooks in a tile, wrap your application with AgentProvider:
 *
 * ```tsx
 * import { AgentProvider } from '@fm/fdc3-agent';
 *
 * function App() {
 *   return (
 *     <AgentProvider>
 *       <YourTileComponents />
 *     </AgentProvider>
 *   );
 * }
 * ```
 *
 * @see data-model.md#L392-L438
 * @packageDocumentation
 */

import type { Broker } from 'ratan-fdc3-broker';
import React, { useContext, useEffect, useState } from 'react';
import { getAgentApi } from './agent';
import { ScopedDesktopAgent } from './scoped-agent';
import type { AppIdentifier, Channel, Context, Listener, RatanDesktopAgent } from './types';

/**
 * Internal React context that holds the FDC3 DesktopAgent instance.
 *
 * This context is populated by AgentProvider and consumed by the useFDC3 hook
 * to provide access to FDC3 operations throughout the component tree.
 *
 * @internal
 */
const AgentContext = React.createContext<{
  agent: RatanDesktopAgent | null;
  app?: AppIdentifier;
}>({
  agent: null,
});

/**
 * React provider component that makes the FDC3 Agent API available to all child components.
 *
 * AgentProvider initializes the FDC3 DesktopAgent instance and provides it through React
 * context, enabling all child components to access FDC3 operations via hooks.
 *
 * ## Placement
 *
 * This provider should be mounted at the root of your tile application, typically
 * in the main App component or root config:
 *
 * ```tsx
 * import { AgentProvider } from '@fm/fdc3-agent';
 *
 * export function App(props) {
 *   return (
 *     <AgentProvider appIdentifier={props.appIdentifier}>
 *       <YourTile />
 *     </AgentProvider>
 *   );
 * }
 * ```
 *
 * ## Provider Hierarchy
 *
 * In the MFE architecture:
 * - Base MFE: Sets up the broker and calls setBroker()
 * - Tile MFE: Wraps components with AgentProvider to access FDC3
 *
 * ## Error Handling
 *
 * The provider will throw during initialization if the broker hasn't been set
 * by the base MFE. Ensure proper initialization order:
 *
 * 1. Base MFE initializes broker
 * 2. Base MFE calls setBroker()
 * 3. Tile MFEs can then use AgentProvider
 *
 * @param props - The provider props
 * @param props.children - React child components that will have access to FDC3 hooks
 * @param props.appIdentifier - Optional identifier for the current tile. If provided, creates a scoped agent.
 *
 * @example
 * ```tsx
 * import { AgentProvider } from '@fm/fdc3-agent';
 *
 * function TileRoot() {
 *   return (
 *     <AgentProvider>
 *       <InstrumentTile />
 *       <ChartTile />
 *       <NewsTile />
 *     </AgentProvider>
 *   );
 * }
 * ```
 *
 * @see {@link useFDC3} For accessing the FDC3 API in components
 * @see {@link setBroker} For initializing the broker before using the provider
 */
export const AgentProvider: React.FC<{
  /** React child components that will have access to FDC3 hooks */
  children: React.ReactNode;
  /** Optional identifier for the current tile. If provided, FDC3 operations will be scoped to this ID. */
  appIdentifier?: AppIdentifier;
}> = ({ children, appIdentifier }) => {
  const [agent, setAgent] = React.useState<RatanDesktopAgent | null>(null);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    let mounted = true;

    // Try to get the broker instance
    const tryGetAgent = () => {
      try {
        const brokerInstance = getAgentApi();
        if (mounted) {
          if (appIdentifier) {
            // If app identifier is provided, create a scoped agent
            // This ensures that all FDC3 calls from this provider are attributed to this app
            setAgent(new ScopedDesktopAgent(brokerInstance as unknown as Broker, appIdentifier));
          }
          setError(null);
        }
      } catch (err) {
        // Broker not initialized yet, retry after a delay
        if (mounted) {
          setError(err as Error);
          // Retry every 100ms
          setTimeout(tryGetAgent, 100);
        }
      }
    };

    tryGetAgent();

    return () => {
      mounted = false;
    };
  }, [appIdentifier]);

  const value = React.useMemo(() => ({ agent, appIdentifier }), [agent, appIdentifier]);

  // Show error if broker is not available after multiple retries
  if (error && !agent) {
    return (
      <div
        style={{
          padding: '16px',
          backgroundColor: '#ffebee',
          color: '#c62828',
        }}
      >
        <strong>FDC3 Error:</strong> {error.message}
        <br />
        <small>Make sure FDC3 Broker is initialized in the base MFE.</small>
      </div>
    );
  }

  return <AgentContext.Provider value={value}>{children}</AgentContext.Provider>;
};

/**
 * React hook that provides access to the FDC3 DesktopAgent API.
 *
 * This hook retrieves the FDC3 DesktopAgent instance from React context or falls back
 * to getAgentApi() if the context is not available. It provides the primary interface
 * for all FDC3 operations within React components.
 *
 * ## Use Cases
 *
 * Use this hook when you need direct access to FDC3 operations:
 * - Raising intents
 * - Broadcasting context
 * - Joining/leaving channels
 * - Finding intents or applications
 * - Getting implementation metadata
 *
 * ## Error Handling
 *
 * The hook will throw an error if:
 * - The broker hasn't been initialized by the base MFE
 * - getAgentApi() returns null
 *
 * This ensures fail-fast behavior rather than silent failures.
 *
 * ## FDC3 Operations Available
 *
 * ```tsx
 * const fdc3 = useFDC3();
 *
 * // Intent-based communication
 * await fdc3.raiseIntent('ViewChart', context);
 * await fdc3.raiseIntentForContext(context);
 * fdc3.addIntentListener('ViewChart', (context) => { ... });
 *
 * // Context operations
 * await fdc3.broadcast(context);
 * fdc3.addContextListener('fdc3.instrument', (context) => { ... });
 *
 * // Channel operations
 * await fdc3.joinChannel('channel-id');
 * const channel = await fdc3.getCurrentChannel();
 * const channels = await fdc3.getUserChannels();
 * const privateChannel = await fdc3.createPrivateChannel();
 *
 * // Discovery
 * const intent = await fdc3.findIntent('ViewChart');
 * const intents = await fdc3.findIntentsByContext(context);
 * const apps = await fdc3.findApplications({ name: 'App' });
 *
 * // Metadata
 * const info = await fdc3.getInfo();
 * ```
 *
 * @returns The DesktopAgent instance for FDC3 operations
 *
 * @throws {Error} If the broker hasn't been initialized by the base MFE
 *
 * @example
 * ```tsx
 * import { useFDC3 } from '@fm/fdc3-agent';
 * import type { Context } from '@fm/fdc3-agent';
 *
 * function InstrumentTile() {
 *   const fdc3 = useFDC3();
 *
 *   const handleBroadcast = async (instrument: Context) => {
 *     await fdc3.broadcast(instrument);
 *   };
 *
 *   const handleViewChart = async (instrument: Context) => {
 *     const resolution = await fdc3.raiseIntent('ViewChart', instrument);
 *     console.log('Intent resolved to:', resolution.source);
 *   };
 *
 *   return (
 *     <div>
 *       <button onClick={() => handleBroadcast({ type: 'fdc3.instrument', id: { ticker: 'AAPL' } })}>
 *         Broadcast AAPL
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 *
 * @see {@link AgentProvider} For setting up the FDC3 context
 * @see {@link useIntentListener} For listening to intents with automatic cleanup
 * @see {@link useContextListener} For listening to context changes with automatic cleanup
 * @see [FDC3 DesktopAgent Specification](https://fdc3.finos.org/docs/api/next/DesktopAgent/)
 */
export function useFDC3(): RatanDesktopAgent {
  const { agent } = useContext(AgentContext);
  if (!agent) {
    // Fallback to getAgentApi() if context not available
    return getAgentApi();
  }
  return agent;
}

/**
 * React hook that provides access to the FDC3 AppIdentifier.
 *
 * This hook retrieves the AppIdentifier from React context. It is used to identify
 * the application in FDC3 operations.
 *
 * @returns The AppIdentifier for the current application
 *
 * @example
 * ```tsx
 * import { useAppIdentifier } from '@fm/fdc3-agent';
 *
 * function App() {
 *   const appIdentifier = useAppIdentifier();
 *   console.log('App Identifier:', appIdentifier);
 *   return <div>App Identifier: {appIdentifier?.appId}</div>;
 * }
 * ```
 *
 * @see {@link AgentProvider} For setting up the FDC3 context
 * @see [FDC3 AppIdentifier Specification](https://fdc3.finos.org/docs/api/next/AppIdentifier/)
 */
export function useAppIdentifier(): AppIdentifier | undefined {
  const { app } = useContext(AgentContext);
  return app;
}

/**
 * React hook that automatically sets up and cleans up an intent listener.
 *
 * This hook registers a listener for a specific FDC3 intent and automatically handles
 * cleanup when the component unmounts or dependencies change. The listener receives
 * context data when other applications raise the intent.
 *
 * ## Lifecycle Management
 *
 * - Listener is registered when the component mounts
 * - Listener is automatically unsubscribed when component unmounts
 * - Listener is replaced if intent or handler dependencies change
 * - Prevents memory leaks through automatic cleanup
 *
 * ## Use Cases
 *
 * Use this hook when your tile needs to respond to intent-based communication:
 * - Receiving view requests from other tiles
 * - Processing user actions from other applications
 * - Handling workflows initiated by other MFEs
 *
 * ## Intent vs Context
 *
 * - **Intent listeners** (this hook): Respond to specific intent names like 'ViewChart'
 * - **Context listeners** (useContextListener): Respond to any context broadcast
 *
 * @param intent - The intent name to listen for (e.g., 'ViewChart', 'ViewOrder')
 * @param handler - Callback function invoked when the intent is raised
 * @param handler.context - The context data passed with the intent
 *
 * @example
 * ```tsx
 * import { useIntentListener } from '@fm/fdc3-agent';
 * import type { Context } from '@fm/fdc3-agent';
 *
 * function ChartTile() {
 *   useIntentListener('ViewChart', (context: Context) => {
 *     console.log('Received ViewChart intent:', context);
 *     if (context.type === 'fdc3.instrument') {
 *       // Render chart for the instrument
 *       renderChart(context);
 *     }
 *   });
 *
 *   return <div>Chart Component</div>;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Listening to multiple intents
 * function OrderTile() {
 *   useIntentListener('ViewOrder', (context) => {
 *     showOrderDetails(context);
 *   });
 *
 *   useIntentListener('EditOrder', (context) => {
 *     openOrderEditor(context);
 *   });
 *
 *   return <div>Order Management</div>;
 * }
 * ```
 *
 * @see {@link useContextListener} For listening to context broadcasts instead of intents
 * @see {@link useFDC3} For direct access to addIntentListener method
 * @see [FDC3 Intents Specification](https://fdc3.finos.org/docs/api/next/DesktopAgent/#addintentlistener)
 */
export function useIntentListener(
  intent: string,
  handler: (context: Context) => any | Promise<any>,
): void {
  const fdc3 = useFDC3();

  useEffect(() => {
    let listener: Listener | null = null;

    const setupListener = async () => {
      try {
        listener = await fdc3.addIntentListener(intent, handler);
      } catch (error) {
        console.error('Error adding intent listener:', error);
      }
    };

    setupListener();

    return () => {
      if (listener) {
        listener.unsubscribe();
      }
    };
  }, [fdc3, intent, handler]);
}

/**
 * React hook that automatically sets up and cleans up a context listener.
 *
 * This hook registers a listener for FDC3 context broadcasts and automatically handles
 * cleanup when the component unmounts or dependencies change. Context listeners receive
 * data when any application broadcasts context to the current channel.
 *
 * ## Lifecycle Management
 *
 * - Listener is registered when the component mounts
 * - Listener is automatically unsubscribed when component unmounts
 * - Listener is replaced if contextType or handler dependencies change
 * - Prevents memory leaks through automatic cleanup
 *
 * ## Filtering by Type
 *
 * - **Specific type**: Pass context type string (e.g., 'fdc3.instrument')
 * - **All contexts**: Pass null to receive all context broadcasts
 *
 * ## Use Cases
 *
 * Use this hook when your tile needs to react to context changes:
 * - Updating display when instrument selection changes
 * - Synchronizing state across multiple tiles
 * - Responding to user selections in other applications
 *
 * ## Intent vs Context
 *
 * - **Intent listeners** (useIntentListener): Respond to specific intent names
 * - **Context listeners** (this hook): Respond to any context broadcast
 *
 * @param contextType - The context type to filter by, or null to receive all contexts
 * @param handler - Callback function invoked when matching context is broadcast
 * @param handler.context - The context data that was broadcast
 *
 * @example
 * ```tsx
 * import { useContextListener } from '@fm/fdc3-agent';
 *
 * function InstrumentTile() {
 *   const [instrument, setInstrument] = useState(null);
 *
 *   // Listen only to instrument context
 *   useContextListener('fdc3.instrument', (context) => {
 *     console.log('New instrument selected:', context);
 *     setInstrument(context);
 *   });
 *
 *   return <div>Current: {instrument?.id?.ticker}</div>;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Listen to all context broadcasts
 * function DebugTile() {
 *   useContextListener(null, (context) => {
 *     console.log('Context broadcast received:', context);
 *   });
 *
 *   return <div>Debug Console</div>;
 * }
 * ```
 *
 * @see {@link useIntentListener} For listening to specific intents instead of broadcasts
 * @see {@link useFDC3} For direct access to addContextListener method
 * @see [FDC3 Context Specification](https://fdc3.finos.org/docs/api/next/DesktopAgent/#addcontextlistener)
 */
export function useContextListener(
  contextType: string | null,
  handler: (context: Context) => void,
): void {
  const fdc3 = useFDC3();

  useEffect(() => {
    let listener: Listener | null = null;

    const setupListener = async () => {
      try {
        listener = await fdc3.addContextListener(contextType, handler);
      } catch (error) {
        console.error('Error adding context listener:', error);
      }
    };

    setupListener();

    return () => {
      if (listener) {
        listener.unsubscribe();
      }
    };
  }, [fdc3, contextType, handler]);
}

/**
 * React hook that retrieves and tracks the current FDC3 channel.
 *
 * This hook fetches the current channel that the application has joined and monitors
 * it in component state. The channel is fetched once on mount and will not update
 * automatically if the application joins a different channel.
 *
 * ## Channel Lifecycle
 *
 * - Channel is fetched when the component mounts
 * - Returns null if the application hasn't joined any channel
 * - Does not automatically update if channel changes (use fdc3.getCurrentChannel()
 *   directly or re-render to fetch latest)
 *
 * ## Use Cases
 *
 * - Displaying the current channel name in the UI
 * - Conditionally enabling features based on channel membership
 * - Showing channel-specific controls or information
 *
 * ## Channel vs Context
 *
 * - **Channels**: Logical communication channels (app channels, user channels)
 * - **Context**: Data passed through channels (instruments, orders, etc.)
 *
 * @returns The current channel, or null if not joined to a channel
 *
 * @example
 * ```tsx
 * import { useCurrentChannel } from '@fm/fdc3-agent';
 *
 * function ChannelIndicator() {
 *   const channel = useCurrentChannel();
 *
 *   if (!channel) {
 *     return <div>Not in a channel</div>;
 *   }
 *
 *   return (
 *     <div>
 *       Current Channel: {channel.displayMetadata?.name || channel.id}
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Conditional rendering based on channel
 * function ChannelAwareTile() {
 *   const channel = useCurrentChannel();
 *   const isPrivateChannel = channel?.type === 'private';
 *
 *   return (
 *     <div>
 *       {isPrivateChannel ? (
 *         <PrivateChannelUI />
 *       ) : (
 *         <PublicChannelUI />
 *       )}
 *     </div>
 *   );
 * }
 * ```
 *
 * @see {@link useUserChannels} For getting the list of available user channels
 * @see {@link useFDC3} For direct access to getCurrentChannel and joinChannel methods
 * @see [FDC3 Channels Specification](https://fdc3.finos.org/docs/api/next/DesktopAgent/#getcurrentchannel)
 */
export function useCurrentChannel(): Channel | null {
  const [channel, setChannel] = useState<Channel | null>(null);
  const fdc3 = useFDC3();

  useEffect(() => {
    // Get initial channel
    let mounted = true;

    const getCurrentChannel = async () => {
      try {
        const currentChannel = await fdc3.getCurrentChannel();
        if (mounted) {
          setChannel(currentChannel);
        }
      } catch (error) {
        console.error('Error getting current channel:', error);
      }
    };

    getCurrentChannel();

    return () => {
      mounted = false;
    };
  }, [fdc3]);

  return channel;
}

/**
 * React hook that retrieves and tracks the list of available user channels.
 *
 * This hook fetches all available user channels (app channels) that the application
 * can join. User channels are predefined communication channels that users can
 * create and manage for sharing context between applications.
 *
 * ## Channel Lifecycle
 *
 * - Channels are fetched once when the component mounts
 * - Does not automatically update if channels are added/removed
 * - Empty array indicates no user channels are available
 *
 * ## Use Cases
 *
 * - Displaying a channel switcher UI
 * - Showing available channels in a dropdown
 * - Allowing users to select which channel to join
 *
 * ## User Channels vs App Channels
 *
 * In FDC3 2.0+ terminology:
 * - **User channels**: Predefined channels that users can join (formerly "app channels")
 * - **Private channels**: Created dynamically via createPrivateChannel()
 *
 * ## Channel Types
 *
 * User channels returned by this hook have:
 * - Unique channel ID
 * - Display metadata (name, description, color)
 * - Broadcast context that listeners can receive
 *
 * @returns Array of available user channels (empty array if none available)
 *
 * @example
 * ```tsx
 * import { useUserChannels } from '@fm/fdc3-agent';
 * import { useFDC3 } from '@fm/fdc3-agent';
 *
 * function ChannelSwitcher() {
 *   const channels = useUserChannels();
 *   const fdc3 = useFDC3();
 *
 *   const handleJoinChannel = async (channelId: string) => {
 *     await fdc3.joinChannel(channelId);
 *   };
 *
 *   return (
 *     <select onChange={(e) => handleJoinChannel(e.target.value)}>
 *       <option value="">Select a channel...</option>
 *       {channels.map((channel) => (
 *         <option key={channel.id} value={channel.id}>
 *           {channel.displayMetadata?.name || channel.id}
 *         </option>
 *       ))}
 *     </select>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Display all available channels
 * function ChannelList() {
 *   const channels = useUserChannels();
 *
 *   if (channels.length === 0) {
 *     return <div>No user channels available</div>;
 *   }
 *
 *   return (
 *     <ul>
 *       {channels.map((channel) => (
 *         <li key={channel.id}>
 *           <h3>{channel.displayMetadata?.name || channel.id}</h3>
 *           <p>{channel.displayMetadata?.description}</p>
 *         </li>
 *       ))}
 *     </ul>
 *   );
 * }
 * ```
 *
 * @see {@link useCurrentChannel} For getting the currently active channel
 * @see {@link useFDC3} For direct access to getUserChannels and joinChannel methods
 * @see [FDC3 Channels Specification](https://fdc3.finos.org/docs/api/next/DesktopAgent/#getuserchannels)
 */
export function useUserChannels(): Channel[] {
  const [channels, setChannels] = useState<Channel[]>([]);
  const fdc3 = useFDC3();

  useEffect(() => {
    let mounted = true;

    const fetchChannels = async () => {
      try {
        const userChannels = await fdc3.getUserChannels();
        if (mounted) {
          setChannels(userChannels);
        }
      } catch (error) {
        console.error('Error fetching user channels:', error);
      }
    };

    fetchChannels();

    return () => {
      mounted = false;
    };
  }, [fdc3]);

  return channels;
}
