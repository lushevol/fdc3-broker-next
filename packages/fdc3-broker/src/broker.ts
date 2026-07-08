/**
 * FDC3 Broker
 *
 * Core FDC3 2.2 DesktopAgent implementation for MFE platform.
 * @see plan.md#L451-L565
 * @see research.md#L25-L61 (FDC3 API surface)
 */

import type { ContextMetadata } from '@finos/fdc3';
import type { AppDirectoryClient } from 'ratan-fdc3-app-directory';
import { ChannelManager } from './channel-manager';
import { EntitlementValidator } from './entitlements';
import { IntentQueueImpl } from './intent-queue';
import { IntentResolver } from './intent-resolver';
import { Logger, LogLevel } from './logger';
import { PerformanceTracker } from './performance';
import { TileRegistryImpl } from './tile-registry';
import type {
  AppIdentifier,
  AppIntent,
  AppMetadata,
  BrokerConfig,
  Channel,
  Context,
  DesktopAgent,
  ImplementationMetadata,
  IntentResolution,
  Listener,
  PrivateChannel,
  ResolverTarget,
  TileOpenFailureDetails,
} from './types';
import { WorkflowExecutor } from './workflow-executor';
import type {
  WorkflowDefinition,
  WorkflowJsonObject,
  WorkflowOptions,
  WorkflowResolution,
} from './workflow-types';

// Lazy load OpenFin bridge only when needed
type OpenFinBridgeType = typeof import('./openfin-bridge').OpenFinBridge;
let openFinBridgeClass: OpenFinBridgeType | null = null;

// Pre-login tile ID for intent queue
const PRELOGIN_TILE_ID = '__prelogin__';
const EXTERNAL_OPENFIN_SOURCE_APP_ID = 'external';

type PendingIntentListener = {
  intent: string;
  resolve: () => void;
  reject: (error: Error) => void;
  timeoutId?: ReturnType<typeof setTimeout>;
};

// Lazy load PostMessage bridge only when needed
type PostMessageBridgeType = typeof import('./postmessage-bridge').PostMessageBridge;
let postMessageBridgeClass: PostMessageBridgeType | null = null;

/**
 * FDC3 Broker Implementation
 *
 * Core FDC3 2.2 DesktopAgent implementation for MFE platform.
 * Provides intent-based communication, context broadcasting, channel management,
 * and interoperability with OpenFin applications.
 *
 * @example
 * ```typescript
 * const broker = new Broker({
 *   appDirectory: appDirectoryClient,
 *   userChannelIds: ['red', 'green', 'blue'],
 *   enableDebug: true,
 *   callbacks: {
 *     onTileOpen: async (appId, context) => { ... },
 *     onLoginStatusCheck: async () => true,
 *     onValidateEntitlements: async (appId, action) => true,
 *   }
 * });
 *
 * // Open an app
 * await broker.open({ appId: 'my-app' }, context);
 *
 * // Raise an intent
 * const resolution = await broker.raiseIntent('ViewChart', context);
 *
 * // Join a user channel
 * await broker.joinUserChannel('red');
 * await broker.broadcast(context);
 * ```
 *
 * @see FDC3 2.2 Specification
 * @see DesktopAgent
 */
export class Broker implements DesktopAgent {
  private logger: Logger;
  private perf: PerformanceTracker;
  private intentResolver: IntentResolver;
  private tileRegistry: TileRegistryImpl;
  private intentQueue: IntentQueueImpl;
  private channelManager: ChannelManager;
  private appDirectory: AppDirectoryClient;
  private config: BrokerConfig;
  private openFinBridge: InstanceType<OpenFinBridgeType> | null;
  private postMessageBridge: InstanceType<PostMessageBridgeType> | null;
  private entitlementValidator: EntitlementValidator;
  private workflowExecutor: WorkflowExecutor;

  // Track listeners
  private intentListeners = new Map<string, Listener[]>();
  private contextListeners = new Map<string, Listener>();
  private listenerIds = new WeakMap<Listener, string>();
  private nextListenerId = 0;

  // Track channels (kept for backward compatibility, now delegated to ChannelManager)
  private channels = new Map<string, Channel>();
  private privateChannels = new Map<string, PrivateChannel>();

  // Track pending intent listeners (waits for app launch)
  private pendingIntentListeners = new Map<string, PendingIntentListener[]>();

  /**
   * Creates a new FDC3 Broker instance
   *
   * @param config - Broker configuration including app directory, channels, and callbacks
   * @throws Error if app directory is not provided
   *
   * @example
   * ```typescript
   * const broker = new Broker({
   *   appDirectory: appDirectoryClient,
   *   userChannelIds: ['red', 'green', 'blue'],
   *   enableDebug: true,
   *   callbacks: {
   *     onTileOpen: async (appId, context) => {
   *       // Handle tile opening
   *     },
   *     onLoginStatusCheck: async () => {
   *       // Check if user is logged in
   *       return true;
   *     },
   *     onValidateEntitlements: async (appId, action) => {
   *       // Validate user entitlements
   *       return true;
   *     }
   *   }
   * });
   * ```
   */
  constructor(config: BrokerConfig) {
    this.config = config;
    this.logger = new Logger(config.enableDebug ?? false, config.logLevel ?? LogLevel.INFO);
    this.perf = new PerformanceTracker();
    this.appDirectory = config.appDirectory;
    this.tileRegistry = new TileRegistryImpl();
    this.intentQueue = new IntentQueueImpl();
    this.channelManager = new ChannelManager(config.userChannelIds, config.enableDebug);

    // Lazy initialize OpenFin bridge (only when enabled and OpenFin is detected)
    this.openFinBridge = null;

    // Lazy initialize PostMessage bridge (only when enabled and browser is detected)
    this.postMessageBridge = null;

    // Initialize entitlement validator
    this.entitlementValidator = new EntitlementValidator(config);
    this.workflowExecutor = new WorkflowExecutor(config.workflows ?? [], (intent, context, target) =>
      target
        ? this.raiseIntent(intent, context as Context, target as AppIdentifier)
        : this.raiseIntent(intent, context as Context),
    );

    // Initialize intent resolver
    this.intentResolver = new IntentResolver(
      this.appDirectory,
      this.tileRegistry,
      config.callbacks,
      config.enableDebug,
      config.logLevel,
    );

    // Load queued intents from persistence
    this.intentQueue.loadFromPersistence();

    // Conditionally set up OpenFin intent forwarding
    if (config.enableOpenFinBridge) {
      this.setupOpenFinIntentForwarding();
    }

    // Conditionally set up PostMessage intent forwarding
    if (config.enablePostMessageBridge) {
      this.setupPostMessageIntentForwarding();
    }

    if (config.onLogin) {
      config.onLogin(this.processQueuedIntentsAfterLogin.bind(this));
    }

    this.logger.info('Broker initialized', {
      enableDebug: config.enableDebug,
      userChannels: config.userChannelIds,
      openFinEnabled: this.isOpenFinEnabled(),
      postMessageEnabled: this.isPostMessageEnabled(),
    });
  }

  /**
   * Subscribes to log events from the broker's logger.
   * Returns an unsubscribe function.
   *
   * Use this to stream FDC3 broker logs in real time to a console widget
   * or other monitoring tool.
   *
   * @param callback - Called with each log event emitted by the broker
   * @returns Function to unsubscribe
   *
   * @example
   * ```typescript
   * const unsub = broker.subscribeToLogs((event) => {
   *   console.log(`[${event.level}] ${event.message}`);
   * });
   * // Later: unsub();
   * ```
   */
  subscribeToLogs(
    callback: (event: import('./logger').LogEvent) => void,
  ): () => void {
    return this.logger.subscribe(callback);
  }

  /**
   * Set up OpenFin intent forwarding
   * Subscribes to intents from OpenFin and forwards them to internal tiles
   *
   * Lazily loads the OpenFin bridge only when OpenFin is detected.
   */
  private async setupOpenFinIntentForwarding(): Promise<void> {
    // Check if OpenFin is available in the environment
    const isOpenFinDetected = !!(globalThis as any).fin?.desktop;

    if (!isOpenFinDetected) {
      this.logger.debug('OpenFin not detected, skipping bridge initialization');
      return;
    }

    // Lazy load OpenFin bridge class
    if (!openFinBridgeClass) {
      try {
        const module = await import('./openfin-bridge');
        openFinBridgeClass = module.OpenFinBridge;
      } catch (error) {
        this.logger.error('Failed to load OpenFin bridge module:', error as Error);
        return;
      }
    }

    // Initialize bridge
    const initBridge = async () => {
      try {
        if (!openFinBridgeClass) {
          throw new Error('OpenFin bridge class not initialized');
        }
        const OpenFinBridge = openFinBridgeClass;
        // Pass appDirectoryClient for intent discovery
        this.openFinBridge = new OpenFinBridge(this.appDirectory);
        this.logger.info('OpenFin bridge initialized (lazy loaded)');

        // Get global intents from config or use defaults
        const globalIntents = this.config.openFinBridgeOptions?.globalIntents;

        // Initialize intents (discovers entitled apps and subscribes)
        await this.openFinBridge.initializeIntents(globalIntents);

        // Set the intent handler for receiving intents
        this.openFinBridge.setIntentHandler(this.handleOpenFinIntent.bind(this));

        this.logger.info('OpenFin intent forwarding set up');
      } catch (error) {
        this.logger.error('Failed to initialize OpenFin bridge:', error as Error);
      }
    };

    // Initialize bridge asynchronously
    initBridge();
  }

  /**
   * Handle incoming intent from OpenFin
   */
  private async handleOpenFinIntent(
    intent: string,
    context: Context,
    source?: AppIdentifier,
  ): Promise<void> {
    this.logger.debug('Received intent from OpenFin', {
      intent,
      context,
      source,
    });

    // Check if user is logged in
    const isLoggedIn = await this.checkLoginStatus();
    if (!isLoggedIn) {
      // Queue intent for after login
      const sourceId: AppIdentifier = this.createExternalOpenFinSource(source);
      this.intentQueue.enqueue(PRELOGIN_TILE_ID, intent, context, sourceId);
      this.logger.debug('User not logged in, queued intent for post-login', { intent });
      return;
    }

    // No internal listeners - raise intent internally (will find apps, resolve, open, deliver)
    // Pass skipExternalRouting=true to prevent infinite loop back to OpenFin
    try {
      await this.routeOpenFinIntent(intent, context, source);
    } catch (error) {
      this.logger.error(`Error raising intent ${intent} from OpenFin:`, error as Error);
    }
  }

  private createExternalOpenFinSource(source?: AppIdentifier): AppIdentifier {
    return {
      ...source,
      appId: EXTERNAL_OPENFIN_SOURCE_APP_ID,
    };
  }

  private shouldRouteOpenFinIntentByContext(intent: string): boolean {
    return this.config.openFinBridgeOptions?.contextRoutingIntents?.includes(intent) ?? false;
  }

  private async routeOpenFinIntent(
    intent: string,
    context: Context,
    source?: AppIdentifier,
  ): Promise<IntentResolution> {
    const openFinSource = this.createExternalOpenFinSource(source);

    if (this.shouldRouteOpenFinIntentByContext(intent)) {
      return this.raiseIntentForContext(context, undefined, openFinSource);
    }

    return this.raiseIntent(intent, context, undefined, openFinSource);
  }

  private shouldRouteMissingTargetExternally(source?: AppIdentifier): boolean {
    return source?.appId !== EXTERNAL_OPENFIN_SOURCE_APP_ID;
  }

  /**
   * Check if user is logged in
   */
  private async checkLoginStatus(): Promise<boolean> {
    if (this.config.callbacks.onLoginStatusCheck) {
      return this.config.callbacks.onLoginStatusCheck();
    }
    return true; // Default to logged in if no callback
  }

  /**
   * Process queued intents after login
   */
  private async processQueuedIntentsAfterLogin(): Promise<void> {
    const isLoggedIn = await this.checkLoginStatus();
    if (!isLoggedIn) return;

    const queued = this.intentQueue.getQueuedIntents(PRELOGIN_TILE_ID);
    if (queued.length === 0) return;

    this.logger.info(`Processing ${queued.length} queued intents after login`);

    // Filter by entitlements
    const validIntents = [];
    for (const queuedIntent of queued) {
      const entitlementCheck = await this.entitlementValidator.canSendIntent(
        queuedIntent.source?.appId || '',
        queuedIntent.intent,
        queuedIntent.context,
      );
      if (entitlementCheck.allowed) {
        validIntents.push(queuedIntent);
      }
    }

    // Raise filtered intents
    for (const queuedIntent of validIntents) {
      try {
        await this.routeOpenFinIntent(
          queuedIntent.intent,
          queuedIntent.context,
          queuedIntent.source,
        );
      } catch (error) {
        this.logger.error(`Error raising queued intent ${queuedIntent.intent}:`, error as Error);
      }
    }

    // Clear queue after replay so a persisted SSO handoff is handled once.
    this.intentQueue.clearQueue(PRELOGIN_TILE_ID);
    this.logger.info('Cleared pre-login intent queue');
  }

  async processQueuedIntents(): Promise<void> {
    await this.processQueuedIntentsAfterLogin();
  }

  /**
   * Check if OpenFin bridge is enabled
   */
  private isOpenFinEnabled(): boolean {
    return this.openFinBridge?.isEnabled() || false;
  }

  /**
   * Get the OpenFin bridge instance (lazy loads if needed)
   */
  private async getOpenFinBridge(): Promise<InstanceType<OpenFinBridgeType> | null> {
    if (this.openFinBridge) {
      return this.openFinBridge;
    }

    // Lazy load if not yet initialized
    if (!openFinBridgeClass) {
      try {
        const module = await import('./openfin-bridge');
        openFinBridgeClass = module.OpenFinBridge;
      } catch (error) {
        this.logger.error('Failed to load OpenFin bridge module:', error as Error);
        return null;
      }
    }

    try {
      const OpenFinBridge = openFinBridgeClass;
      this.openFinBridge = new OpenFinBridge();
      return this.openFinBridge;
    } catch (error) {
      this.logger.error('Failed to initialize OpenFin bridge:', error as Error);
      return null;
    }
  }

  /**
   * Set up PostMessage intent forwarding
   * Subscribes to intents from external domains and forwards them to internal tiles
   *
   * Lazily loads the PostMessage bridge only when browser postMessage is available.
   */
  private async setupPostMessageIntentForwarding(): Promise<void> {
    // Check if browser postMessage is available
    if (typeof window === 'undefined' || typeof window.postMessage !== 'function') {
      this.logger.debug('PostMessage not available, skipping bridge initialization');
      return;
    }

    // Check if options are configured
    if (!this.config.postMessageBridgeOptions) {
      this.logger.debug('PostMessage bridge options not configured');
      return;
    }

    // Lazy load PostMessage bridge class
    if (!postMessageBridgeClass) {
      try {
        const module = await import('./postmessage-bridge');
        postMessageBridgeClass = module.PostMessageBridge;
      } catch (error) {
        this.logger.error('Failed to load PostMessage bridge module:', error as Error);
        return;
      }
    }

    // Initialize bridge
    const initBridge = async () => {
      try {
        if (!postMessageBridgeClass) {
          throw new Error('PostMessage bridge class not initialized');
        }
        const PostMessageBridge = postMessageBridgeClass;
        this.postMessageBridge = new PostMessageBridge(this.config.postMessageBridgeOptions!);
        this.logger.info('PostMessage bridge initialized (lazy loaded)');

        // Subscribe to intents from external domains
        this.postMessageBridge.subscribeToIntents(
          async (intent: string, context: Context, source?: AppIdentifier) => {
            this.logger.debug('Received intent from PostMessage', {
              intent,
              context,
              source,
            });

            // Find internal tiles that can handle this intent
            const listeners = this.intentListeners.get(intent);
            if (listeners && listeners.length > 0) {
              // Forward to internal listeners
              for (const listener of listeners) {
                const handler = (listener as unknown as Record<string, unknown>).handler as
                  | ((context: Context) => Promise<void>)
                  | undefined;
                if (handler) {
                  try {
                    await handler(context);
                  } catch (error) {
                    this.logger.error(
                      `Error forwarding PostMessage intent ${intent}:`,
                      error as Error,
                    );
                  }
                }
              }
            }
          },
          Array.from(this.intentListeners.keys()),
        );

        this.logger.info('PostMessage intent forwarding set up');
      } catch (error) {
        this.logger.error('Failed to initialize PostMessage bridge:', error as Error);
      }
    };

    // Initialize bridge asynchronously
    initBridge();
  }

  /**
   * Check if PostMessage bridge is enabled
   */
  private isPostMessageEnabled(): boolean {
    return this.postMessageBridge?.isEnabled() || false;
  }

  /**
   * Get the PostMessage bridge instance (lazy loads if needed)
   */
  private async getPostMessageBridge(): Promise<InstanceType<PostMessageBridgeType> | null> {
    if (this.postMessageBridge) {
      return this.postMessageBridge;
    }

    // Check if the bridge is explicitly enabled
    if (!this.config.enablePostMessageBridge) {
      return null;
    }

    // Check if options are configured
    if (!this.config.postMessageBridgeOptions) {
      return null;
    }

    // Lazy load if not yet initialized
    if (!postMessageBridgeClass) {
      try {
        const module = await import('./postmessage-bridge');
        postMessageBridgeClass = module.PostMessageBridge;
      } catch (error) {
        this.logger.error('Failed to load PostMessage bridge module:', error as Error);
        return null;
      }
    }

    try {
      const PostMessageBridge = postMessageBridgeClass;
      this.postMessageBridge = new PostMessageBridge(this.config.postMessageBridgeOptions);
      return this.postMessageBridge;
    } catch (error) {
      this.logger.error('Failed to initialize PostMessage bridge:', error as Error);
      return null;
    }
  }

  /**
   * Application Management
   */

  /**
   * Opens an application with optional context data
   *
   * Validates entitlements, checks login status, and triggers the tile opening callback.
   * The application will receive the context data after launching.
   *
   * @param app - App identifier specifying which application to open
   * @param context - Optional context data to pass to the opened application
   * @returns Promise resolving to the app identifier that was opened
   * @throws Error if user is not logged in
   * @throws Error if user lacks entitlements to open the application
   *
   * @example
   * ```typescript
   * const context = { type: 'fdc3.instrument', name: 'Apple Inc.', id: { ticker: 'AAPL' } };
   * await broker.open({ appId: 'chart-app' }, context);
   * ```
   *
   * @see addIntentListener
   * @see raiseIntent
   */

  async open(
    app: AppIdentifier | string,
    context?: Context,
    source?: AppIdentifier,
  ): Promise<AppIdentifier> {
    const appIdentifier: AppIdentifier = typeof app === 'string' ? { appId: app } : app;
    this.logger.debug('open', { app: appIdentifier, context });

    return this.perf.measure('open', async () => {
      // Check login status
      const loggedIn = await this.checkLoginStatus();
      if (!loggedIn) {
        const reason = 'User not logged in';
        this.notifyTileOpenFailure(appIdentifier.appId, reason);
        throw new Error(reason);
      }

      // Validate tile open entitlements using EntitlementValidator
      const entitlementCheck = await this.entitlementValidator.canOpenTile(
        appIdentifier.appId,
        context,
      );

      if (!entitlementCheck.allowed) {
        // Security event already logged by EntitlementValidator
        const reason = entitlementCheck.reason || 'Not entitled to open this application';
        this.notifyTileOpenFailure(appIdentifier.appId, reason, entitlementCheck.errorCode);
        throw new Error(reason);
      }

      // Open tile via callback
      if (this.config.callbacks.onTileOpen) {
        try {
          return await this.config.callbacks.onTileOpen(appIdentifier);
        } catch (error) {
          const reason = error instanceof Error ? error.message : 'Unknown error';
          this.notifyTileOpenFailure(appIdentifier.appId, reason, undefined, error as Error);
          throw error;
        }
      }

      return appIdentifier;
    });
  }

  /**
   * Finds all running instances of an application
   *
   * Returns mounted tile instances that are registered for the specified app ID.
   * Each instance includes both the app ID and a unique instance ID.
   *
   * @param app - App identifier to find instances for
   * @returns Promise resolving to array of app identifiers with instance IDs
   *
   * @example
   * ```typescript
   * const instances = await broker.findInstances({ appId: 'chart-app' });
   * // Returns: [{ appId: 'chart-app', instanceId: 'chart-app-123' }]
   * ```
   */
  async findInstances(app: AppIdentifier): Promise<AppIdentifier[]> {
    this.logger.debug('findInstances', { app });

    const tiles = this.tileRegistry.getTilesByAppId(app.appId);
    const mountedTiles = tiles.filter((t) => t.state === 'mounted');

    return mountedTiles.map((tile) => ({
      appId: tile.appId,
      instanceId: tile.instanceId,
    }));
  }

  /**
   * Retrieves metadata for an application from the app directory
   *
   * Returns detailed information about the application including name, title,
   * description, and version from the app directory service.
   *
   * @param app - App identifier to retrieve metadata for
   * @returns Promise resolving to app metadata
   * @throws Error if app is not found in the app directory
   *
   * @example
   * ```typescript
   * const metadata = await broker.getAppMetadata({ appId: 'chart-app' });
   * console.log(metadata.name, metadata.version);
   * ```
   */
  async getAppMetadata(app: AppIdentifier): Promise<AppMetadata> {
    this.logger.debug('getAppMetadata', { app });

    const appDef = await this.appDirectory.getApp(app.appId);
    if (!appDef) {
      throw new Error(`App not found: ${app.appId}`);
    }

    return {
      appId: appDef.appId,
      name: appDef.name,
      title: appDef.title,
      description: appDef.description,
      version: appDef.version,
    };
  }

  /**
   * Context Operations
   */

  /**
   * Broadcasts context to the current channel
   *
   * Sends context data to all applications listening on the current channel.
   * The current tile must have joined a channel before broadcasting.
   * Also synchronizes with OpenFin if available.
   *
   * @param context - Context data to broadcast
   * @returns Promise that resolves when broadcast is complete
   * @throws Error if no channel has been joined
   *
   * @example
   * ```typescript
   * await broker.joinUserChannel('red');
   * const context = { type: 'fdc3.instrument', name: 'Apple Inc.', id: { ticker: 'AAPL' } };
   * await broker.broadcast(context);
   * ```
   *
   * @see joinUserChannel
   * @see addContextListener
   */
  async broadcast(context: Context, source?: AppIdentifier): Promise<void> {
    this.logger.debug('broadcast', {
      context,
      currentTile: source,
    }, 'context');

    return this.perf.measure('broadcast', async () => {
      const currentTile = this.tileRegistry.getTile(source?.instanceId || '');
      if (!currentTile || !currentTile.currentChannel) {
        const errMsg = 'No channel joined';
        this.logger.warn('broadcast failed: no channel', { source }, 'context');
        throw new Error(errMsg);
      }

      const channel = currentTile.currentChannel;
      this.logger.info('Broadcasting context', {
        contextType: context?.type,
        channelId: channel.id,
        tileId: source?.instanceId,
      }, 'context');

      // Broadcast to internal channel
      await channel.broadcast(context);
      this.logger.debug('Context broadcast to internal channel', {
        contextType: context?.type,
        channelId: channel.id,
      }, 'context');

      // Sync with OpenFin if available
      const bridge = await this.getOpenFinBridge();
      if (bridge?.isEnabled()) {
        await bridge.broadcast(context, channel.id);
      }

      // Sync with PostMessage if available
      const postMessageBridge = await this.getPostMessageBridge();
      if (postMessageBridge?.isEnabled()) {
        await postMessageBridge.broadcast(context, channel.id);
      }
    });
  }

  /**
   * Adds a context listener to the current channel
   *
   * Registers a handler function that will be called when context is broadcast
   * on the current channel. The listener can filter by context type or receive all contexts.
   *
   * @param contextType - Context type to filter on, or null to receive all contexts
   * @param handler - Function to call when matching context is broadcast
   * @returns Promise resolving to a Listener object with unsubscribe method
   * @throws Error if no channel has been joined
   *
   * @example
   * ```typescript
   * // Listen for all contexts
   * const listener = await broker.addContextListener(null, (context) => {
   *   console.log('Received context:', context);
   * });
   *
   * // Listen for specific context type
   * const instrumentListener = await broker.addContextListener(
   *   'fdc3.instrument',
   *   (context) => {
   *     console.log('Instrument:', context.name);
   *   }
   * );
   *
   * // Unsubscribe when done
   * listener.unsubscribe();
   * ```
   *
   * @see broadcast
   * @see joinUserChannel
   */
  async addContextListener(
    contextTypeOrHandler: string | null | ((context: Context, metadata?: ContextMetadata) => void),
    handlerOrSource?: ((context: Context, metadata?: ContextMetadata) => void) | AppIdentifier,
    source?: AppIdentifier,
  ): Promise<Listener> {
    const contextType = typeof contextTypeOrHandler === 'function' ? null : contextTypeOrHandler;

    const handler = (
      typeof contextTypeOrHandler === 'function'
        ? contextTypeOrHandler
        : typeof handlerOrSource === 'function'
          ? handlerOrSource
          : undefined
    ) as (context: Context, metadata?: ContextMetadata) => void;

    if (!handler) {
      throw new Error('Handler is required');
    }

    const actualSource =
      typeof handlerOrSource === 'object' && 'appId' in handlerOrSource ? handlerOrSource : source;

    this.logger.info('addContextListener', {
      contextType,
      appId: actualSource?.appId,
      instanceId: actualSource?.instanceId,
    }, 'context');

    // Get current tile's channel
    const currentChannel = await this.getCurrentChannel(actualSource);

    if (!currentChannel) {
      throw new Error('No channel joined. Call joinUserChannel() first.');
    }

    // Add listener to channel
    const listener = await currentChannel.addContextListener(contextType, handler);

    // Also track in tile registry for cleanup
    if (actualSource?.instanceId) {
      this.tileRegistry.addContextListener(actualSource.instanceId, {
        id: (listener as any).id,
        contextType,
        handler,
      });

      return {
        ...listener,
        unsubscribe: async () => {
          await listener.unsubscribe();
          this.tileRegistry.removeContextListener(actualSource.instanceId!, (listener as any).id);
        },
      };
    }

    return listener;
  }

  /**
   * Intent Operations
   */

  /**
   * Finds applications that can handle a specific intent
   *
   * Queries the app directory for applications that have registered a listener
   * for the specified intent type. Returns intent details and matching apps.
   *
   * @param intent - Intent type to find handlers for
   * @param context - Optional context data to help filter results
   * @param resultType - Optional result type filter
   * @returns Promise resolving to AppIntent with intent and apps array
   * @throws Error if no apps found for the intent
   *
   * @example
   * ```typescript
   * const appIntent = await broker.findIntent('ViewChart');
   * console.log(`Found ${appIntent.apps.length} apps that can ViewChart`);
   * appIntent.apps.forEach(app => console.log(app.name));
   * ```
   *
   * @see raiseIntent
   * @see findIntentsByContext
   */
  async findIntent(intent: string, context?: Context, resultType?: string): Promise<AppIntent> {
    this.logger.debug('findIntent', { intent, context, resultType });

    const apps = await this.appDirectory.findByIntent(intent);

    if (apps.length === 0) {
      throw new Error(`No apps found for intent: ${intent}`);
    }

    return {
      intent: {
        name: intent,
        displayName: intent,
      },
      apps: apps.map((app) => ({
        appId: app.appId,
        name: app.name,
        title: app.title,
        description: app.description,
        version: app.version,
      })),
    };
  }

  /**
   * Finds all intents that can handle a specific context type
   *
   * Queries the app directory for intents that support the provided context type.
   * Returns an array of AppIntent objects, each containing an intent and matching apps.
   *
   * @param context - Context data to find intents for
   * @param resultType - Optional result type filter
   * @returns Promise resolving to array of AppIntents
   *
   * @example
   * ```typescript
   * const context = { type: 'fdc3.instrument', name: 'Apple', id: { ticker: 'AAPL' } };
   * const intents = await broker.findIntentsByContext(context);
   * intents.forEach(appIntent => {
   *   console.log(`${appIntent.intent}: ${appIntent.apps.length} apps`);
   * });
   * ```
   *
   * @see findIntent
   * @see raiseIntentForContext
   */
  async findIntentsByContext(context: Context, resultType?: string): Promise<AppIntent[]> {
    this.logger.debug('findIntentsByContext', { context, resultType });

    const apps = await this.appDirectory.findByContextType(context.type);

    // Map apps to intents
    const intentMap = new Map<string, AppIntent>();

    for (const app of apps) {
      const intents = app.interop?.intents?.listensFor || [];
      for (const intentDef of intents) {
        if (!intentDef.contexts || intentDef.contexts.includes(context.type)) {
          if (!intentMap.has(intentDef.intent)) {
            intentMap.set(intentDef.intent, {
              intent: {
                name: intentDef.intent,
                displayName: intentDef.intent,
              },
              apps: [],
            });
          }
          intentMap.get(intentDef.intent)!.apps.push({
            appId: app.appId,
            name: app.name,
            title: app.title,
            description: app.description,
            version: app.version,
          });
        }
      }
    }

    return Array.from(intentMap.values());
  }

  /**
   * Raises an intent to a target application
   *
   * Sends an intent with context data to a target application. If no target is specified,
   * will find available apps and resolve ambiguity if multiple targets exist.
   * Validates sender entitlements before delivery.
   *
   * @param intent - Intent type to raise
   * @param context - Context data to send with the intent
   * @param target - Optional target app identifier
   * @param source - Source app identifier
   * @returns Promise resolving to IntentResolution with source app details
   * @throws Error if sender lacks entitlements to send this intent
   * @throws Error if no target is found for the intent
   * @throws Error if user cancels intent resolution
   *
   * @example
   * ```typescript
   * const context = { type: 'fdc3.instrument', name: 'Apple', id: { ticker: 'AAPL' } };
   *
   * // Raise to any available app
   * const resolution = await broker.raiseIntent('ViewChart', context);
   * console.log('Intent handled by:', resolution.source.appId);
   *
   * // Raise to specific app
   * const resolution2 = await broker.raiseIntent('ViewChart', context, { appId: 'my-chart' });
   * ```
   *
   * @see addIntentListener
   * @see findIntent
   */
  async raiseIntent(
    intent: string,
    context: Context,
    target?: AppIdentifier | string,
    source?: AppIdentifier,
  ): Promise<IntentResolution> {
    const targetApp: AppIdentifier | undefined =
      typeof target === 'string' ? { appId: target } : target;

    const ctxType = context?.type ?? 'unknown';
    const appLabel = source?.appId ?? 'unknown-source';

    this.logger.debug('raiseIntent', {
      intent,
      context,
      target: targetApp,
      sourceTile: source,
    });
    this.logger.info(`Intent flow: raiseIntent("${intent}", "${ctxType}") from ${appLabel}`, {
      intent, contextType: ctxType, context, target: targetApp, source,
    }, 'intent');

    return this.perf.measure('raiseIntent', async () => {
      // ── Step 1: Validate sender entitlements ──
      this.logger.info(`→ step 1: check sender entitlements for ${appLabel} → ${intent}`, {
        source: source?.appId, intent,
      }, 'intent');
      const entitlementCheck = await this.entitlementValidator.canSendIntent(
        source?.appId || '',
        intent,
        context,
      );

      if (!entitlementCheck.allowed) {
        this.logger.warn(`→ step 1 ✗: entitlement DENIED for ${appLabel} → ${intent}: ${entitlementCheck.reason}`, {
          source: source?.appId, intent, reason: entitlementCheck.reason,
        }, 'intent');
        throw new Error(entitlementCheck.reason || 'Not entitled to send this intent');
      }
      this.logger.info(`→ step 1 ✓: entitlements OK for ${appLabel} → ${intent}`, {}, 'intent');

      // ── Step 2: Resolve target ──
      this.logger.info(`→ step 2: resolving target for intent "${intent}"`, { intent, contextType: ctxType, target: targetApp }, 'intent');
      const result = await this.intentResolver.resolve(intent, context, targetApp);

      if (result.type === 'not-found') {
        this.logger.info(`→ step 2: no internal target found for "${intent}"`, { intent }, 'intent');

        if (this.shouldRouteMissingTargetExternally(source)) {
          // Try routing to OpenFin if available
          const openFinBridge = await this.getOpenFinBridge();
          if (openFinBridge?.isEnabled()) {
            this.logger.info(`→ step 2: routing "${intent}" to OpenFin bridge`, { intent, context }, 'intent');
            return await openFinBridge.raiseIntentExternal(intent, context, targetApp);
          }

          // Try routing to PostMessage bridge if available
          const postMessageBridge = await this.getPostMessageBridge();
          if (postMessageBridge?.isEnabled()) {
            this.logger.info(`→ step 2: routing "${intent}" to PostMessage bridge`, { intent, context }, 'intent');
            return await postMessageBridge.raiseIntentExternal(intent, context, targetApp);
          }
        }

        this.logger.warn(`→ step 2 ✗: no target found for intent "${intent}" (not routed externally)`, { intent }, 'intent');
        throw new Error(`No target found for intent: ${intent}`);
      }

      if (result.type === 'ambiguous' && result.targets) {
        this.logger.info(`→ step 2: ${result.targets.length} targets available — showing resolver UI`, {
          intent, count: result.targets.length, targets: result.targets.map((t: any) => t.appId),
        }, 'intent');
        const selected = await this.intentResolver.showResolverUI(result.targets, context, intent);
        if (!selected) {
          this.logger.warn(`→ step 2: resolver UI cancelled by user for "${intent}"`, { intent }, 'intent');
          throw new Error('User cancelled intent resolution');
        }
        this.logger.info(`→ step 2: user selected target "${selected.appId}"`, { appId: selected.appId, instanceId: selected.instanceId }, 'intent');
        result.target = selected;
      } else {
        this.logger.info(`→ step 2 ✓: resolved to single target "${result.target?.appId}"`, {
          appId: result.target?.appId, instanceId: result.target?.instanceId,
        }, 'intent');
      }

      if (!result.target) {
        this.logger.warn(`→ step 2 ✗: no target selected for "${intent}"`, { intent }, 'intent');
        throw new Error('No target selected');
      }

      // ── Step 3: Deliver intent to target ──
      this.logger.info(`→ step 3: delivering intent "${intent}" to target "${result.target.appId}" (instance: ${result.target.instanceId ?? 'new'})`, {
        intent, target: result.target,
      }, 'intent');
      return await this.deliverIntent(intent, context, result.target, source);
    });
  }

  /**
   * Raises an intent based on context type
   *
   * Finds intents that support the given context type and raises one.
   * If multiple intents are available, uses the first one by default.
   *
   * @param context - Context data to determine which intent to raise
   * @param target - Optional target app identifier
   * @returns Promise resolving to IntentResolution
   * @throws Error if no intents found for the context type
   *
   * @example
   * ```typescript
   * const context = { type: 'fdc3.instrument', name: 'Apple', id: { ticker: 'AAPL' } };
   * const resolution = await broker.raiseIntentForContext(context);
   * ```
   *
   * @see raiseIntent
   * @see findIntentsByContext
   */
  async raiseIntentForContext(
    context: Context,
    target?: AppIdentifier | string,
    source?: AppIdentifier,
  ): Promise<IntentResolution> {
    const targetApp: AppIdentifier | undefined =
      typeof target === 'string' ? { appId: target } : target;

    this.logger.debug('raiseIntentForContext', { context, target: targetApp });

    // Find intents that can handle this context type
    const intents = await this.findIntentsByContext(context);

    if (intents.length === 0) {
      throw new Error(`No intents found for context: ${context.type}`);
    }

    if (intents.length === 1) {
      // Only one intent, use it
      const intent = intents[0].intent;
      const contextTarget =
        !targetApp && intents[0].apps.length === 1
          ? { appId: intents[0].apps[0].appId }
          : targetApp;
      return this.raiseIntent(intent.name, context, contextTarget, source);
    }

    // Multiple intents available - default to first one
    // (Could enhance to show intent picker)
    const intent = intents[0].intent;
    const contextTarget =
      !targetApp && intents[0].apps.length === 1
        ? { appId: intents[0].apps[0].appId }
        : targetApp;
    return this.raiseIntent(intent.name, context, contextTarget, source);
  }

  async raiseWorkflow(
    workflowId: string,
    input: WorkflowJsonObject = {},
    _options?: WorkflowOptions,
  ): Promise<WorkflowResolution> {
    return {
      workflowId,
      getResult: () => this.workflowExecutor.execute(workflowId, input),
    };
  }

  async findWorkflow(workflowId: string): Promise<WorkflowDefinition | null> {
    return this.workflowExecutor.findWorkflow(workflowId);
  }

  async findWorkflowsByInput(input?: WorkflowJsonObject): Promise<WorkflowDefinition[]> {
    return this.workflowExecutor.findWorkflowsByInput(input);
  }

  /**
   * Registers a handler for a specific intent type
   *
   * Registers the current tile as a target for the specified intent.
   * When another application raises this intent, the handler will be called
   * with the context data. Validates receiver entitlements before registration.
   *
   * @param intent - Intent type to listen for
   * @param handler - Function to handle incoming intent with context
   * @returns Promise resolving to Listener with unsubscribe method
   * @throws Error if tile lacks entitlements to receive this intent
   *
   * @example
   * ```typescript
   * const listener = await broker.addIntentListener('ViewChart', async (context) => {
   *   console.log('Received ViewChart intent:', context);
   *   // Handle the intent and return a result
   *   return { chartType: 'candlestick', data: context };
   * });
   *
   * // Unsubscribe when done
   * listener.unsubscribe();
   * ```
   *
   * @see raiseIntent
   * @see findIntent
   */
  async addIntentListener(
    intent: string,
    handler: (context: Context) => any | Promise<any>,
    source?: AppIdentifier,
  ): Promise<Listener> {
    const appLabel = source?.appId ?? '?';
    const instanceLabel = source?.instanceId ?? '(unscoped)';

    // Validate receiver entitlements using EntitlementValidator
    this.logger.info(`  subscription: checking receive entitlement for ${appLabel} on "${intent}"`, {
      source: source?.appId, intent,
    }, 'intent');
    const entitlementCheck = await this.entitlementValidator.canReceiveIntent(
      source?.appId || '',
      intent,
    );

    if (!entitlementCheck.allowed) {
      this.logger.warn(`  subscription ✗: receive entitlement DENIED for ${appLabel} on "${intent}": ${entitlementCheck.reason}`, {
        source: source?.appId, intent, reason: entitlementCheck.reason,
      }, 'intent');
      throw new Error(entitlementCheck.reason || 'Not entitled to receive this intent');
    }
    this.logger.info(`  subscription ✓: receive entitlement OK for ${appLabel} on "${intent}"`, {}, 'intent');

    const listenerId = `intent_${this.nextListenerId++}`;
    const listener = {
      id: listenerId,
      source, // Store source for scoping and cleanup
      unsubscribe: async () => {
        // Determine tile ID (prioritize instanceId)
        const instanceId = source?.instanceId;
        if (instanceId) {
          const currentTile = this.tileRegistry.getTile(instanceId);
          if (currentTile) {
            this.tileRegistry.removeIntentListener(instanceId, intent);
          }
        }

        const listeners = this.intentListeners.get(intent);
        if (listeners) {
          const index = listeners.findIndex((l) => this.listenerIds.get(l) === listenerId);
          if (index >= 0) {
            const [removed] = listeners.splice(index, 1);
            if (removed) {
              this.listenerIds.delete(removed);
            }
          }
        }
      },
    };

    // Store listener ID in WeakMap
    this.listenerIds.set(listener, listenerId);

    // Register with tile registry
    // Prioritize instanceId, fallback to appId
    const instanceId = source?.instanceId;
    if (instanceId) {
      this.removeDuplicateIntentListeners(intent, source, listenerId);
      this.tileRegistry.addIntentListener(instanceId, intent);
    }

    // Store listener
    if (!this.intentListeners.has(intent)) {
      this.intentListeners.set(intent, []);
    }
    this.intentListeners.get(intent)!.push(listener);

    // Store handler with listener
    (listener as any).handler = handler;

    this.logger.info(`Intent listener: "${intent}" registered by ${appLabel}[${instanceLabel}]`, {
      intent, appId: source?.appId, instanceId: source?.instanceId,
    }, 'intent');

    // // Sync with OpenFin if this is a new intent type
    // const isNewIntentType = this.intentListeners.get(intent)!.length === 1;
    // const bridge = await this.getOpenFinBridge();
    // if (isNewIntentType && bridge?.isEnabled()) {
    //   bridge.subscribeToIntents(this.handleOpenFinIntent.bind(this), [intent]);
    // }

    // Check if any pending waits for this intent from this app
    if (source?.appId) {
      const pendingForApp = this.pendingIntentListeners.get(source.appId);
      if (pendingForApp) {
        const matchingWaits = pendingForApp.filter((p) => p.intent === intent);
        if (matchingWaits.length > 0) {
          this.logger.info(`  subscription ✓: resolving ${matchingWaits.length} pending delivery(ies) for "${intent}" on ${appLabel}`, {
            intent, appId: source.appId, pendingCount: matchingWaits.length,
          }, 'intent');
        }
        matchingWaits.forEach((wait) => this.resolvePendingIntentListener(source.appId, wait));
      }
    }

    this.logger.info(`✓ listener registered: "${intent}" on ${appLabel}[${instanceLabel}]`, {
      intent, appId: source?.appId, instanceId: source?.instanceId,
    }, 'intent');
    return listener;
  }

  private removeDuplicateIntentListeners(
    intent: string,
    source: AppIdentifier,
    currentListenerId: string,
  ): void {
    const listeners = this.intentListeners.get(intent);
    if (!listeners || !source.instanceId) {
      return;
    }

    for (let index = listeners.length - 1; index >= 0; index--) {
      const existing = listeners[index];
      const existingSource = (existing as any).source as AppIdentifier | undefined;
      const existingListenerId = this.listenerIds.get(existing);
      if (
        existingListenerId !== currentListenerId &&
        existingSource?.instanceId === source.instanceId &&
        existingSource?.appId === source.appId
      ) {
        listeners.splice(index, 1);
        this.listenerIds.delete(existing);
      }
    }
  }

  private resolvePendingIntentListener(appId: string, wait: PendingIntentListener): void {
    this.removePendingIntentListener(appId, wait);
    if (wait.timeoutId) {
      clearTimeout(wait.timeoutId);
    }
    wait.resolve();
  }

  private rejectPendingIntentListener(
    appId: string,
    wait: PendingIntentListener,
    error: Error,
  ): void {
    this.removePendingIntentListener(appId, wait);
    wait.reject(error);
  }

  private removePendingIntentListener(appId: string, wait: PendingIntentListener): void {
    const pending = this.pendingIntentListeners.get(appId);
    if (!pending) {
      return;
    }

    const nextPending = pending.filter((pendingWait) => pendingWait !== wait);
    if (nextPending.length > 0) {
      this.pendingIntentListeners.set(appId, nextPending);
    } else {
      this.pendingIntentListeners.delete(appId);
    }
  }

  /**
   * Channel Operations
   */

  /**
   * Retrieves an existing channel or creates a new one
   *
   * Gets a channel by ID. If the channel doesn't exist, creates a new app channel.
   * App channels are different from user channels and can be created dynamically.
   *
   * @param channelId - Unique identifier for the channel
   * @returns Promise resolving to the Channel object
   *
   * @example
   * ```typescript
   * const channel = await broker.getOrCreateChannel('my-custom-channel');
   * await channel.broadcast(context);
   * ```
   *
   * @see getUserChannels
   * @see joinUserChannel
   */
  async getOrCreateChannel(channelId: string): Promise<Channel> {
    this.logger.debug('getOrCreateChannel', { channelId });

    return this.perf.measure('getOrCreateChannel', async () => {
      // Use ChannelManager to create or get channel
      let channel = this.channelManager.getChannel(channelId);

      if (!channel) {
        channel = this.channelManager.createChannel(channelId);
        // Also add to local channels map for compatibility
        this.channels.set(channelId, channel);
      }

      return channel;
    });
  }

  /**
   * Creates a private channel for secure communication
   *
   * Creates a private channel that can only be accessed by applications that
   * have a direct reference to it. The creator is automatically granted access.
   * Private channels are useful for sensitive data sharing between specific apps.
   *
   * @returns Promise resolving to PrivateChannel object
   *
   * @example
   * ```typescript
   * const privateChannel = await broker.createPrivateChannel();
   *
   * // Grant access to another tile
   * privateChannel.addTile('other-tile-id');
   *
   * // Broadcast context on private channel
   * await privateChannel.broadcast(context);
   * ```
   *
   * @see getOrCreateChannel
   * @see getUserChannels
   */
  async createPrivateChannel(source?: AppIdentifier): Promise<PrivateChannel> {
    this.logger.debug('createPrivateChannel', {});

    return this.perf.measure('createPrivateChannel', async () => {
      // Use ChannelManager to create private channel
      const privateChannel = this.channelManager.createPrivateChannel();

      // Also add to local privateChannels map for compatibility
      this.privateChannels.set(privateChannel.id, privateChannel);

      // Grant access to current tile
      if (source?.appId) {
        // @ts-expect-error - PrivateChannelImpl has addTile method but FDC3 PrivateChannel interface doesn't
        privateChannel.addTile(source.appId);
        if ('grantAccess' in privateChannel) {
          (privateChannel as any).grantAccess(source.appId);
        }
      }

      return privateChannel;
    });
  }

  /**
   * Retrieves all available user channels
   *
   * Returns the list of predefined user channels (e.g., red, green, blue).
   * Merges internal channels with OpenFin channels if available.
   *
   * @returns Promise resolving to array of user Channel objects
   *
   * @example
   * ```typescript
   * const channels = await broker.getUserChannels();
   * channels.forEach(channel => {
   *   console.log(`${channel.displayMetadata?.name}: ${channel.id}`);
   * });
   * ```
   *
   * @see joinUserChannel
   * @see getOrCreateChannel
   */
  async getUserChannels(): Promise<Channel[]> {
    this.logger.debug('getUserChannels', {});

    return this.perf.measure('getUserChannels', async () => {
      // Get internal user channels
      const internalChannels = this.channelManager.getUserChannels();
      const mergedChannels = [...internalChannels];
      const mergedChannelIds = new Set(internalChannels.map((channel) => channel.id));

      // Merge with OpenFin channels if available
      const bridge = await this.getOpenFinBridge();
      if (bridge?.isEnabled()) {
        const openFinChannels = await bridge.getUserChannels();

        // Merge OpenFin channels that don't exist internally
        for (const openFinChannel of openFinChannels) {
          if (!mergedChannelIds.has(openFinChannel.id)) {
            mergedChannels.push(openFinChannel);
            mergedChannelIds.add(openFinChannel.id);
          }
        }
      }

      // Merge with PostMessage channels if available
      const postMessageBridge = await this.getPostMessageBridge();
      if (postMessageBridge?.isEnabled()) {
        const postMessageChannels = await postMessageBridge.getUserChannels();

        for (const postMessageChannel of postMessageChannels) {
          if (!mergedChannelIds.has(postMessageChannel.id)) {
            mergedChannels.push(postMessageChannel);
            mergedChannelIds.add(postMessageChannel.id);
          }
        }
      }

      return mergedChannels;
    });
  }

  /**
   * Alias for joinUserChannel to satisfy DesktopAgent interface
   */
  async joinChannel(channelId: string): Promise<void> {
    return this.joinUserChannel(channelId);
  }

  /**
   * Alias for getUserChannels to satisfy DesktopAgent interface
   */
  async getSystemChannels(): Promise<Channel[]> {
    return this.getUserChannels();
  }

  /**
   * Joins a user channel for context sharing
   *
   * Connects the current tile to a user channel, enabling it to broadcast
   * context and receive broadcasts from other applications on the same channel.
   * Validates entitlements before joining. Also syncs with OpenFin if available.
   *
   * @param channelId - ID of the user channel to join (e.g., 'red', 'green')
   * @returns Promise that resolves when joined
   * @throws Error if no current tile context exists
   * @throws Error if tile lacks entitlements to join the channel
   * @throws Error if channel is not found
   *
   * @example
   * ```typescript
   * await broker.joinUserChannel('red');
   * // Now can broadcast and receive context on the red channel
   * await broker.broadcast(context);
   * ```
   *
   * @see getUserChannels
   * @see leaveCurrentChannel
   * @see broadcast
   */
  async joinUserChannel(channelId: string, source?: AppIdentifier): Promise<void> {
    this.logger.info('joinUserChannel', {
      channelId,
      appId: source?.appId,
      instanceId: source?.instanceId,
    }, 'channel');

    return this.perf.measure('joinUserChannel', async () => {
      if (!source?.appId || !source.instanceId) {
        throw new Error('No current tile context');
      }

      // Validate channel join entitlements using EntitlementValidator
      const entitlementCheck = await this.entitlementValidator.canJoinChannel(
        source.appId,
        channelId,
      );

      if (!entitlementCheck.allowed) {
        // Security event already logged by EntitlementValidator
        throw new Error(entitlementCheck.reason || 'Not entitled to join this channel');
      }

      // Get channel
      const channel = this.channelManager.getChannel(channelId);
      if (!channel) {
        throw new Error(`Channel not found: ${channelId}`);
      }

      // Use ChannelManager to join channel
      this.channelManager.joinChannel(source.instanceId, channel);

      // Update tile registry
      this.tileRegistry.setTileChannel(source.instanceId, channel);

      // Sync with OpenFin if available
      const bridge = await this.getOpenFinBridge();
      if (bridge?.isEnabled()) {
        await bridge.joinUserChannel(channel);
      }

      // Sync with PostMessage if available
      const postMessageBridge = await this.getPostMessageBridge();
      if (postMessageBridge?.isEnabled()) {
        await postMessageBridge.joinUserChannel(channel);
      }
    });
  }

  /**
   * Retrieves the current channel for the tile
   *
   * Returns the channel that the current tile has joined, if any.
   *
   * @returns Promise resolving to current Channel or null if not joined
   *
   * @example
   * ```typescript
   * const channel = await broker.getCurrentChannel();
   * if (channel) {
   *   console.log('Currently on channel:', channel.id);
   * }
   * ```
   *
   * @see joinUserChannel
   * @see leaveCurrentChannel
   */
  async getCurrentChannel(source?: AppIdentifier): Promise<Channel | null> {
    this.logger.debug('getCurrentChannel', {
      appId: source?.appId,
      instanceId: source?.instanceId,
    });

    if (!source?.instanceId) {
      return null;
    }

    // Use ChannelManager to get tile's channel
    return this.channelManager.getTileChannel(source.instanceId);
  }

  /**
   * Leaves the current channel
   *
   * Removes the current tile from its channel, stopping context broadcasts
   * and listeners for that channel.
   *
   * @returns Promise that resolves when left
   *
   * @example
   * ```typescript
   * await broker.joinUserChannel('red');
   * // ... work on red channel ...
   * await broker.leaveCurrentChannel();
   * ```
   *
   * @see joinUserChannel
   * @see getCurrentChannel
   */
  async leaveCurrentChannel(source?: AppIdentifier): Promise<void> {
    this.logger.debug('leaveCurrentChannel', {
      appId: source?.appId,
      instanceId: source?.instanceId,
    }, 'channel');

    if (!source?.instanceId) {
      return;
    }

    // Use ChannelManager to leave channel
    this.channelManager.leaveChannel(source.instanceId);

    // Update tile registry
    this.tileRegistry.setTileChannel(source.instanceId, undefined as any);
  }

  /**
   * Event Handling
   */

  /**
   * Adds an event listener for FDC3 system events
   *
   * Registers a handler for FDC3 events such as 'app-shared-context', 'intent-delivered', etc.
   *
   * @param eventType - Event type to listen for, or null for all events
   * @param handler - Function to handle events
   * @returns Promise resolving to Listener with unsubscribe method
   *
   * @example
   * ```typescript
   * const listener = await broker.addEventListener('intent-delivered', (event) => {
   *   console.log('Intent delivered:', event);
   * });
   * ```
   */
  async addEventListener(eventType: any, _handler: (event: any) => void): Promise<Listener> {
    this.logger.debug('addEventListener', { eventType });

    const listenerId = `evt_${this.nextListenerId++}`;
    const listener = {
      id: listenerId,
      unsubscribe: async () => {
        // Implementation for removing event listener
      },
    };

    // Store listener ID in WeakMap
    this.listenerIds.set(listener, listenerId);

    return listener;
  }

  /**
   * Implementation Info
   */

  /**
   * Retrieves implementation metadata
   *
   * Returns information about the FDC3 implementation including
   * FDC3 version, provider name, and provider version.
   *
   * @returns Promise resolving to ImplementationMetadata
   *
   * @example
   * ```typescript
   * const info = await broker.getInfo();
   * console.log(`FDC3 Version: ${info.fdc3Version}`);
   * console.log(`Provider: ${info.provider} ${info.providerVersion}`);
   * ```
   */
  async getInfo(): Promise<ImplementationMetadata> {
    this.logger.debug('getInfo', {});

    return {
      fdc3Version: '2.2',
      provider: '@fm/fdc3-broker',
      providerVersion: '0.0.1',
      optionalFeatures: {
        // Optional features supported by this implementation
        OriginatingAppMetadata: true,
        UserChannelMembershipAPIs: true,
        DesktopAgentBridging: false,
      },
      appMetadata: undefined as any,
    };
  }

  /**
   * Internal Methods
   */

  /**
   * Notifies the consuming application that a tile failed to open
   *
   * @param appId - The app ID that failed to open
   * @param reason - Error message describing the failure
   * @param errorCode - Optional error code for programmatic handling
   * @param error - Optional original error
   */
  private notifyTileOpenFailure(
    appId: string,
    reason: string,
    errorCode?: string,
    error?: Error,
  ): void {
    const failureDetails: TileOpenFailureDetails = {
      appId,
      reason,
      errorCode,
      error,
    };

    const callback = this.config.callbacks.onTileOpenFailure;
    if (callback) {
      try {
        callback(failureDetails);
      } catch (callbackError) {
        this.logger.error('Error in onTileOpenFailure callback:', callbackError as Error);
      }
    } else {
      this.logger.warn('Tile open failed', {
        appId,
        reason,
        errorCode,
      });
    }
  }

  /**
   * Registers a tile instance with the broker
   *
   * Registers a new tile (MFE instance) and enables it to participate in FDC3 operations.
   * Delivers any queued intents that were sent to this tile before it was mounted.
   *
   * @param instanceId - Unique identifier for the tile instance
   * @param appId - Application ID that this tile belongs to
   * @param metadata - Optional app metadata
   * @returns Promise that resolves when registration is complete
   *
   * @example
   * ```typescript
   * await broker.registerTile('tile-123', 'my-app', {
   *   appId: 'my-app',
   *   name: 'My App',
   *   version: '1.0.0'
   * });
   * ```
   *
   * @see unregisterTile
   * @see setCurrentTile
   */
  async registerTile(instanceId: string, appId: string, metadata?: AppMetadata): Promise<void> {
    this.logger.info('registerTile', { instanceId, appId }, 'lifecycle');

    this.tileRegistry.registerTile({
      appId,
      instanceId,
      state: 'mounting',
      intentListeners: new Set(),
      contextListeners: new Set(),
      metadata,
    });

    // Update state to mounted
    this.tileRegistry.updateTileState(instanceId, 'mounted');

    // Deliver any queued intents
    const queued = this.intentQueue.getQueuedIntents(instanceId);
    if (queued.length > 0) {
      this.logger.info(`Delivering ${queued.length} queued intents to tile ${instanceId}`, {
        intents: queued.map((q) => q.intent),
      }, 'lifecycle');

      // Deliver intents
      for (const queuedIntent of queued) {
        const listeners = this.intentListeners.get(queuedIntent.intent);
        if (listeners && listeners.length > 0) {
          // Filter listeners for this specific instance if possible
          // In queued flow, we are targeting this instance specifically
          for (const listener of listeners) {
            const listenerSource = (listener as any).source as AppIdentifier;
            if (
              listenerSource &&
              listenerSource.instanceId &&
              listenerSource.instanceId !== instanceId
            ) {
              continue; // Skip listeners from other instances
            }

            const handler = (listener as any).handler;
            if (handler) {
              try {
                await handler(queuedIntent.context);
              } catch (error) {
                this.logger.error(
                  `Error delivering queued intent ${queuedIntent.id}:`,
                  error as Error,
                );
              }
            }
          }
        }
      }

      this.intentQueue.clearQueue(instanceId);
    }
  }

  /**
   * Unregisters a tile instance from the broker
   *
   * Removes a tile from the registry and cleans up its resources.
   * The tile will no longer receive intents or context broadcasts.
   *
   * @param instanceId - Unique identifier of the tile to unregister
   *
   * @example
   * ```typescript
   * broker.unregisterTile('tile-123');
   * ```
   *
   * @see registerTile
   */
  unregisterTile(instanceId: string): void {
    this.logger.info('unregisterTile', { instanceId }, 'lifecycle');

    // Clean up intent listeners for this tile
    const tile = this.tileRegistry.getTile(instanceId);
    if (tile && tile.intentListeners.size > 0) {
      for (const intent of tile.intentListeners) {
        const listeners = this.intentListeners.get(intent);
        if (listeners) {
          // Remove listeners belonging to this instance
          // We need to mutate the array in-place or replace it
          for (let i = listeners.length - 1; i >= 0; i--) {
            const listener = listeners[i];
            const source = (listener as any).source as AppIdentifier | undefined;
            // Check if listener belongs to this instance
            // Either explicit instanceId match or appId match (for legacy/simple cases)
            // But prefer explicit instanceId check to avoid removing other instances' listeners
            if (source?.instanceId === instanceId) {
              listeners.splice(i, 1);
              this.listenerIds.delete(listener);
            }
          }
        }
      }
    }

    this.tileRegistry.updateTileState(instanceId, 'unmounted');
    this.tileRegistry.unregisterTile(instanceId);
  }

  /**
   * Deliver intent to target
   * @param intent Intent type
   * @param context Context data
   * @param target Target app
   * @returns Intent resolution
   */
  private async deliverIntent(
    intent: string,
    context: Context,
    target: ResolverTarget,
    source?: AppIdentifier,
  ): Promise<IntentResolution> {
    const appLabel = target?.appId ?? '?';
    const instanceLabel = target?.instanceId ?? '(new)';
    const ctxType = context?.type ?? 'unknown';

    this.logger.info(`→ step 3: deliverIntent("${intent}", "${ctxType}") → ${appLabel} [${instanceLabel}]`, {
      intent, contextType: ctxType, target, source,
    }, 'intent');

    // ── Step 3a: Check if target instance is mounted ──
    if (target.instanceId) {
      const tile = this.tileRegistry.getTile(target.instanceId);
      if (tile && tile.state === 'mounted') {
        this.logger.info(`→ step 3a: target ${appLabel}[${target.instanceId}] is mounted`, { instanceId: target.instanceId }, 'intent');

        // Find intent listeners for this intent
        const listeners = this.intentListeners.get(intent);
        if (listeners && listeners.length > 0) {
          this.logger.info(`→ step 3b: found ${listeners.length} listener(s) for "${intent}" on ${appLabel}[${target.instanceId}]`, {
            listenerCount: listeners.length, intent, instanceId: target.instanceId,
          }, 'intent');

          // ── Step 3c: Call handler ──
          const results: any[] = [];
          for (const listener of listeners) {
            // Filter by instanceId if target specifies it
            const listenerSource = (listener as any).source as AppIdentifier;
            if (
              target.instanceId &&
              listenerSource?.instanceId &&
              listenerSource.instanceId !== target.instanceId
            ) {
              continue;
            }

            const handler = (listener as any).handler;
            if (handler) {
              this.logger.info(`→ step 3c: invoking intent handler for "${intent}" on ${appLabel}[${target.instanceId}]`, {
                intent, instanceId: target.instanceId,
              }, 'intent');
              try {
                const result = await handler(context);
                this.logger.info(`→ step 3c ✓: intent handler completed for "${intent}" on ${appLabel}[${target.instanceId}]`, {
                  intent, instanceId: target.instanceId,
                }, 'intent');
                results.push(result);
              } catch (error) {
                this.logger.error(`→ step 3c ✗: intent handler FAILED for "${intent}" on ${appLabel}[${target.instanceId}]:`, error as Error, {
                  target, source,
                }, 'intent');
              }
            }
          }

          // Return first result
          this.logger.info(`✓ intent "${intent}" fully delivered to ${appLabel}[${target.instanceId}]`, {
            intent, target, source,
          }, 'intent');
          return this.intentResolver.createIntentResolution(target, intent, results[0]);
        }

        this.logger.warn(`→ step 3b: no listeners for "${intent}" on ${appLabel}[${target.instanceId}] — queuing intent`, {
          intent, instanceId: target.instanceId,
        }, 'intent');
        this.intentQueue.enqueue(target.instanceId, intent, context, {
          appId: source?.appId || '',
          instanceId: source?.instanceId,
        });
        return this.intentResolver.createIntentResolution(target, intent);
      }

      // Target specified but not mounted
      this.logger.info(`→ step 3a: target ${appLabel}[${target.instanceId}] is NOT mounted — queuing intent`, {
        instanceId: target.instanceId, tileState: tile?.state ?? 'unknown',
      }, 'intent');
      this.intentQueue.enqueue(target.instanceId, intent, context, {
        appId: source?.appId || '',
        instanceId: source?.instanceId,
      });
      return this.intentResolver.createIntentResolution(target, intent);
    }

    // ── Step 3a: No instance — open new instance ──
    this.logger.info(`→ step 3a: target ${appLabel} has no running instance — opening new tile`, {
      appId: target.appId,
    }, 'intent');
    await this.open(target);
    this.logger.info(`→ step 3a: opened new instance of ${appLabel}`, { appId: target.appId }, 'intent');

    // Wait for the app to register the intent listener
    if (target.appId) {
      this.logger.info(`→ step 3d: waiting for ${appLabel} to register intent listener for "${intent}" (timeout: 30s)`, {
        appId: target.appId, intent,
      }, 'intent');
      try {
        await this.waitForIntentListener(target.appId, intent);
        this.logger.info(`→ step 3d ✓: ${appLabel} registered listener for "${intent}"`, {
          appId: target.appId, intent,
        }, 'intent');

        // Now that listener is registered, we can try delivering again
        const instances = await this.findInstances({ appId: target.appId });
        if (instances.length > 0) {
          const newTarget = {
            ...target,
            instanceId: instances[0].instanceId,
          };
          this.logger.info(`→ step 3e: re-delivering intent "${intent}" to new instance ${newTarget.instanceId}`, {
            intent, instanceId: newTarget.instanceId,
          }, 'intent');
          return await this.deliverIntent(intent, context, newTarget, source);
        }
        this.logger.warn(`→ step 3e: no instances found for ${appLabel} after listener registration`, { appId: target.appId }, 'intent');
      } catch (error) {
        this.logger.warn(
          `→ step 3d: timeout waiting for ${appLabel} to register listener for "${intent}" — returning resolution without delivery`,
          undefined, 'intent',
        );
      }
    }

    return this.intentResolver.createIntentResolution(target, intent);
  }

  /**
   * Waits for a specific app to register an intent listener
   */
  private waitForIntentListener(appId: string, intent: string, timeoutMs = 30000): Promise<void> {
    this.logger.info(`  waitForListener: awaiting "${intent}" listener on ${appId} (timeout: ${timeoutMs}ms)`, {
      appId, intent, timeoutMs,
    }, 'intent');
    return new Promise<void>((resolve, reject) => {
      // Check if already registered (race condition check)
      const tiles = this.tileRegistry.getTilesByAppId(appId);
      const hasListener = tiles.some((t) => t.intentListeners.has(intent));
      if (hasListener) {
        this.logger.info(`  waitForListener: "${intent}" listener already registered on ${appId}`, {
          appId, intent,
        }, 'intent');
        resolve();
        return;
      }

      // Add to pending waits
      if (!this.pendingIntentListeners.has(appId)) {
        this.pendingIntentListeners.set(appId, []);
      }
      const wait: PendingIntentListener = { intent, resolve, reject };
      this.pendingIntentListeners.get(appId)!.push(wait);

      this.logger.debug(`  waitForListener: registered pending wait for "${intent}" on ${appId}`, {
        appId, intent,
      }, 'intent');

      // Set timeout
      wait.timeoutId = setTimeout(() => {
        this.logger.warn(`  waitForListener ✗: timeout (${timeoutMs}ms) waiting for "${intent}" listener on ${appId}`, {
          appId, intent, timeoutMs,
        }, 'intent');
        this.rejectPendingIntentListener(
          appId,
          wait,
          new Error(`Timeout waiting for intent listener: ${intent}`),
        );
      }, timeoutMs);
    });
  }
}
