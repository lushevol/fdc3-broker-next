/**
 * FDC3 Broker - Core Type Definitions
 *
 * This file re-exports all FDC3 2.2 types from @finos/fdc3
 * and defines broker-specific types for configuration and callbacks.
 *
 * @see https://www.npmjs.com/package/@finos/fdc3
 */

/* eslint-disable */
// Import and re-export all FDC3 2.2 types from @finos/fdc3
import type {
  AppIdentifier,
  AppIntent,
  AppMetadata,
  Channel,
  Context,
  DesktopAgent,
  DisplayMetadata,
  EventHandler,
  FDC3Event,
  ImplementationMetadata,
  Intent,
  IntentResolution,
  Listener,
  PrivateChannel,
  PrivateChannelEventTypes,
} from '@finos/fdc3';
import type { AppDirectoryClient } from 'ratan-fdc3-app-directory';
import type { LogLevel } from './logger';
import type { WorkflowDefinition } from './workflow-types';

export type {
  AppIdentifier,
  AppIntent,
  AppMetadata,
  Channel,
  // Core types
  Context,
  // DesktopAgent interface
  DesktopAgent,
  // Channel types
  DisplayMetadata,
  // Event types
  EventHandler,
  FDC3Event,
  // Implementation metadata
  ImplementationMetadata,
  Intent,
  IntentResolution,
  Listener,
  PrivateChannel,
  PrivateChannelEventTypes,
} from '@finos/fdc3';
export type { AppDefinition } from 'ratan-fdc3-app-directory';
/* eslint-enable */

// Note: Error types (ResolveError, ChannelError, FDC3Error) are re-exported from errors.ts

/**
 * Broker configuration interface
 * @see data-model.md#L254-L282
 */
export interface BrokerConfig {
  /** App Directory client configuration */
  appDirectory: AppDirectoryClient;

  /** Callbacks for broker operations (injected from base MFE) */
  callbacks: BrokerCallbacks;

  /** Enable debug logging */
  enableDebug?: boolean;

  /** Log level */
  logLevel?: LogLevel;

  /** Custom channel IDs for user channels */
  userChannelIds?: string[];

  /** Intent queue timeout in milliseconds */
  intentQueueTimeout?: number;

  /** Platform workflow declarations available through raiseWorkflow */
  workflows?: WorkflowDefinition[];

  /** Enable OpenFin bridge (if available) */
  enableOpenFinBridge?: boolean;

  /** Enable PostMessage bridge for cross-domain FDC3 */
  enablePostMessageBridge?: boolean;

  /** PostMessage bridge options */
  postMessageBridgeOptions?: PostMessageBridgeOptions;

  /** OpenFin bridge options */
  openFinBridgeOptions?: OpenFinBridgeOptions;

  onLogin: (callback: () => Promise<any>) => Promise<void>;
  onLogout: (callback: () => Promise<any>) => Promise<void>;
}

/**
 * OpenFin bridge configuration options
 */
export interface OpenFinBridgeOptions {
  /** Global intents to subscribe to (defaults to standard FDC3 intents) */
  globalIntents?: string[];

  /**
   * Incoming OpenFin intents that should be resolved by their context type instead
   * of being delivered as the original external intent name.
   */
  contextRoutingIntents?: string[];
}

/**
 * PostMessage bridge configuration options
 */
export interface PostMessageBridgeOptions {
  /** Allowed origins for cross-domain messaging */
  allowedOrigins: string[];
  /** Request timeout in ms (default: 5000) */
  timeout?: number;
  /**
   * Incoming PostMessage intents that should be resolved by their context type
   * instead of being delivered as the original external intent name.
   */
  contextRoutingIntents?: string[];
}

/**
 * Callbacks injected by base MFE for broker customization
 * @see data-model.md#L284-L338
 */
export interface BrokerCallbacks {
  /**
   * Check if user is logged in
   * @returns true if authenticated
   */
  onLoginStatusCheck?(): Promise<boolean>;

  /**
   * Open a tile with context
   * @param app App identifier (from @finos/fdc3)
   */
  onTileOpen?(app: AppIdentifier): Promise<AppIdentifier>;

  /**
   * Close a tile
   * @param app App identifier (from @finos/fdc3)
   */
  onTileClose?(app: AppIdentifier): Promise<void>;

  /**
   * Validate user entitlements for an action
   * @param tileId Tile identifier
   * @param action Action type (e.g., "open", "send-intent")
   * @returns true if entitled
   */
  onValidateEntitlements?(tileId: string, action: string): Promise<boolean>;

  /**
   * Create a new workspace
   * @param workspaceId Workspace identifier
   */
  onWorkspaceCreated?(workspaceId: string): void;

  /**
   * Log security event
   * @param event Event description
   * @param data Event data
   */
  onSecurityEvent?(event: string, data: unknown): void;

  /**
   * Display resolver UI
   * @param targets Available targets
   * @returns Selected target or null if cancelled
   */
  onShowResolverUI?(
    targets: ResolverTarget[],
    context?: Context,
    intent?: string,
  ): Promise<ResolverTarget | null>;

  /**
   * Called when a tile fails to open
   * @param failure Failure details
   */
  onTileOpenFailure?(failure: TileOpenFailureDetails): void;
}

/**
 * Details provided when a tile fails to open
 */
export interface TileOpenFailureDetails {
  /** App identifier that failed to open */
  appId: string;

  /** Error message describing the failure */
  reason: string;

  /** Error code for programmatic handling (optional) */
  errorCode?: string;

  /** Original error if available (optional) */
  error?: Error;
}

/**
 * Target displayed in resolver UI
 * @see data-model.md#L340-L361
 */
export interface ResolverTarget {
  /** App identifier */
  appId: string;

  /** Instance ID (if targeting specific instance) */
  instanceId?: string;

  /** App metadata (from @finos/fdc3) */
  metadata: AppMetadata;

  /** Current context of the target (if any) */
  currentContext?: Context;
}

/**
 * App Directory configuration
 * @see data-model.md#L225-L244
 */
export interface AppDirectoryConfig {
  /** Base URL of App Directory service */
  baseUrl: string;

  /** Auth token for entitlement filtering */
  authToken?: string;

  /** Request timeout in milliseconds */
  timeout?: number;

  /** Enable mock mode for development */
  useMock?: boolean;
}

/**
 * Tile instance registry
 * @see data-model.md#L518-L583
 */
export interface TileRegistry {
  /** Register a tile */
  registerTile(tile: TileInstance): void;

  /** Unregister a tile */
  unregisterTile(instanceId: string): void;

  /** Get tile by ID */
  getTile(instanceId: string): TileInstance | null;

  /** Get all tiles */
  getAllTiles(): TileInstance[];

  /** Get tiles by app ID */
  getTilesByAppId(appId: string): TileInstance[];
}

/**
 * Tile instance
 */
export interface TileInstance {
  /** App ID */
  appId: string;

  /** Instance ID */
  instanceId: string;

  /** Current state */
  state: 'mounting' | 'mounted' | 'unmounted';

  /** Registered intent listeners */
  intentListeners: Set<string>;

  /** Registered context listeners */
  contextListeners: Set<ContextListener>;

  /** Current channel (if any) */
  currentChannel?: Channel;

  /** Tile metadata */
  metadata?: AppMetadata;
}

/**
 * Context listener registration
 */
export interface ContextListener {
  /** Listener ID */
  id: string;

  /** Context type filter (null = all) */
  contextType: string | null;

  /** Handler function */
  handler: (context: Context) => void;
}

/**
 * Queued intent for unmounted tiles
 * @see data-model.md#L585-L635
 */
export interface QueuedIntent {
  /** Intent ID */
  id: string;

  /** Intent type */
  intent: string;

  /** Context data */
  context: Context;

  /** Source app */
  source: AppIdentifier;

  /** Timestamp */
  timestamp: number;
}

/**
 * Intent queue manager
 */
export interface IntentQueue {
  /** Queue intent for tile */
  queueIntent(tileId: string, intent: QueuedIntent): void;

  /** Deliver queued intents to tile */
  deliverQueued(tileId: string, handler: IntentHandler): Promise<void>;

  /** Get queued intents for tile */
  getQueuedIntents(tileId: string): QueuedIntent[];

  /** Save queue to persistent storage */
  saveToPersistence(): void;

  /** Load queue from persistent storage */
  loadFromPersistence(): void;

  /** Clear queue for tile */
  clearQueue(tileId: string): void;
}

/**
 * Intent handler function
 */
export type IntentHandler = (context: Context) => unknown | Promise<unknown>;

/**
 * Channel manager
 * @see data-model.md#L637-L676
 */
export interface ChannelManager {
  /** Create a new channel */
  createChannel(id: string, type: 'user' | 'app' | 'private'): Channel;

  /** Get channel by ID */
  getChannel(id: string): Channel | null;

  /** Get all user channels */
  getUserChannels(): Channel[];

  /** Join tile to channel */
  joinChannel(tileId: string, channelId: string): Promise<void>;

  /** Leave tile from channel */
  leaveChannel(tileId: string): Promise<void>;

  /** Broadcast context to channel */
  broadcast(channelId: string, context: Context): Promise<void>;

  /** Add context listener to channel */
  addContextListener(
    channelId: string,
    tileId: string,
    contextType: string | null,
    handler: (context: Context) => void,
  ): Listener;

  /** Get current channel for tile */
  getTileChannel(tileId: string): Channel | null;
}
