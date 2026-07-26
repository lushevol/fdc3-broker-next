/**
 * FDC3 Integration Example for Base MFE
 *
 * This example demonstrates the complete setup and integration of the FDC3 broker
 * in the base MFE. It shows how to initialize the broker, configure callbacks,
 * integrate the resolver UI, and provide error handling.
 *
 * @packageDocumentation
 */

import { AgentProvider, setBroker, useFDC3 } from 'ratan-fdc3-agent';
import { AppDirectoryClientImpl } from 'ratan-fdc3-app-directory';
import {
  type AppDefinition,
  type AppIdentifier,
  Broker,
  type BrokerConfig,
  type Context,
  LogLevel,
  type ResolverTarget,
} from 'ratan-fdc3-broker';
import {
  FDC3ConsoleWidget,
  initFDC3LogService,
  destroyFDC3LogService,
  ResolverDialog,
} from 'ratan-fdc3-resolver-ui';
import { ModuleLoader, SystemJsModuleAdapter } from 'ratan-module-composition';
import type React from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useFDC3WorkspaceHelper } from './useFDC3WorkspaceHelper';
import { getSingleViewBrokerOptions, isSingleViewTarget } from './singleView';
import fdc3Definitions from './declarations/fdc3-definitions.json';
import { getBrowserInteropBrokerOptions } from './postmessage';
import { getOpenFinBrokerOptions } from './openfin';
import workflows from './declarations/workflows.json';
import { useContext as useAppContext } from '../hooks/provider';
import {
  createSingleViewContainer,
  findSingleViewTile,
  isSingleViewRequest,
  SINGLE_VIEW_QUERY_PARAM,
} from '../pages/Home/common/singleView';

// ============================================================================
// FDC3 Tile Provider for Base Workspace Containers
// ============================================================================

/**
 * Wraps remote workspace tiles with the FDC3 agent context and registers their
 * tile lifecycle with the broker. Keeping this in base centralizes FDC3 tile
 * wiring while `Container` remains focused on loading/rendering remote MFEs.
 */
type FDC3TileAppIdentifier = {
  appId: string;
  instanceId: string;
};

const getFdc3AppId = (tile: string): string => tile.replace(/\//g, '');

const FDC3TileLifecycle: React.FC<{
  appIdentifier: FDC3TileAppIdentifier;
  children: React.ReactNode;
}> = ({ appIdentifier, children }) => {
  const fdc3 = useFDC3();
  const { appId, instanceId } = appIdentifier;

  useEffect(() => {
    try {
      void Promise.resolve(fdc3.registerTile(instanceId, appId)).catch((error) => {
        console.error('Failed to register tile:', error);
      });
    } catch (error) {
      console.error('Failed to register tile:', error);
    }

    return () => {
      try {
        void Promise.resolve(fdc3.unregisterTile(instanceId)).catch((error) => {
          console.error('Failed to unregister tile:', error);
        });
      } catch (error) {
        console.error('Failed to unregister tile:', error);
      }
    };
  }, [appId, fdc3, instanceId]);

  return <>{children}</>;
};

export const FDC3TileProvider: React.FC<{
  children: React.ReactNode;
  instanceId: string;
  tile: string;
}> = ({ children, instanceId, tile }) => {
  const appIdentifier = useMemo(
    () => ({
      appId: getFdc3AppId(tile),
      instanceId,
    }),
    [instanceId, tile],
  );

  return (
    <AgentProvider appIdentifier={appIdentifier}>
      <FDC3TileLifecycle appIdentifier={appIdentifier}>{children}</FDC3TileLifecycle>
    </AgentProvider>
  );
};

// ============================================================================
// FDC3 Integration Component
// ============================================================================

/**
 * Props for FDC3Integration component
 */
interface FDC3IntegrationProps {
  /** Child components that will have access to FDC3 */
  children: React.ReactNode;
}

/**
 * FDC3Integration Component
 *
 * This component demonstrates the complete FDC3 broker setup for the base MFE.
 * It initializes the broker, provides configuration callbacks, integrates the
 * resolver UI, and handles errors gracefully.
 *
 * ## Features Demonstrated
 *
 * 1. **BrokerProvider Setup**: Complete configuration with all callbacks
 * 2. **ResolverDialog Integration**: How to wire up the resolver UI
 * 3. **Error Boundary Usage**: Wrapping with ErrorBoundary
 * 4. **State Management**: Managing resolver state
 * 5. **App Directory Setup**: Real vs mock app directory selection
 * 6. **Complete Flow**: From broker init to intent resolution
 *
 * ## Example Structure
 *
 * ```tsx
 * // In your base MFE root component:
 * <FDC3Integration>
 *   <YourAppComponents />
 * </FDC3Integration>
 * ```
 *
 * @example
 * ```tsx
 * function App() {
 *
 *   return (
 *     <FDC3Integration>
 *       <Routing />
 *     </FDC3Integration>
 *   );
 * }
 * ```
 */
export const FDC3Integration: React.FC<FDC3IntegrationProps> = ({ children }) => {
  const singleViewRequest = isSingleViewRequest();
  // ========================================================================
  // State Management
  // ========================================================================

  const [, setBrokerInitialized] = useState(false);
  const [, setBrokerInitializedWithTiles] = useState(false);
  const [, setBrokerError] = useState<string | null>(null);
  const [resolverOpen, setResolverOpen] = useState(false);
  const [resolverIntent, setResolverIntent] = useState('');
  const [resolverContext, setResolverContext] = useState<Context | null>(null);
  const [resolverTargets, setResolverTargets] = useState<ResolverTarget[]>([]);
  const [resolverResolve, setResolverResolve] = useState<((target: ResolverTarget) => void) | null>(
    null,
  );
  const [resolverReject, setResolverReject] = useState<((error: Error) => void) | null>(null);
  const [store] = useAppContext();
  const singleViewTileId = new URLSearchParams(window.location.search).get(SINGLE_VIEW_QUERY_PARAM);
  const singleViewTile = findSingleViewTile(
    singleViewTileId,
    store.drawers?.flatMap((drawer) => drawer.tiles),
  );
  const singleViewContainer = singleViewTile
    ? createSingleViewContainer(singleViewTile)
    : undefined;
  const singleViewAppId = singleViewContainer ? getFdc3AppId(singleViewContainer.tile) : undefined;

  // ========================================================================
  // FDC3 Workspace Helper
  // ========================================================================

  const { workspaceOpenTile, allAccessibleTiles } = useFDC3WorkspaceHelper();

  // ========================================================================
  // Refs for stable callback access
  // ========================================================================

  /**
   * Ref to hold the latest workspaceOpenTile function.
   * This ensures that the broker callbacks always use the latest version of the hook
   * without requiring the broker to be re-initialized.
   */
  const workspaceOpenTileRef = useRef(workspaceOpenTile);
  const loginCallbacksRef = useRef(new Set<() => Promise<unknown>>());
  const brokerRef = useRef<Broker | null>(null);

  useEffect(() => {
    const timeouts: number[] = [];

    const replayQueuedIntents = () => {
      loginCallbacksRef.current.forEach((callback) => {
        void callback();
      });
      void brokerRef.current?.processQueuedIntents?.();
    };

    const handleStorageUpdated = (event: Event) => {
      const { detail } = event as CustomEvent<{ key?: string }>;
      if (detail?.key !== 'SET_TOKEN') {
        return;
      }

      [500, 1500, 3000].forEach((delay) => {
        timeouts.push(window.setTimeout(replayQueuedIntents, delay));
      });
    };

    window.addEventListener('ratan-storage-updated', handleStorageUpdated);
    return () => {
      window.removeEventListener('ratan-storage-updated', handleStorageUpdated);
      timeouts.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  useEffect(() => {
    workspaceOpenTileRef.current = workspaceOpenTile;
  }, [workspaceOpenTile]);

  useEffect(() => {
    if (!store.token) {
      return;
    }

    const replay = () => {
      loginCallbacksRef.current.forEach((callback) => {
        void callback();
      });
      void brokerRef.current?.processQueuedIntents?.();
    };

    // Immediate replay attempt
    replay();

    // Self-terminating poll: stops once the persisted queue is empty
    const intervalId = window.setInterval(() => {
      const queue = localStorage.getItem('fdc3-intent-queue');
      if (!queue || queue === JSON.stringify([])) {
        window.clearInterval(intervalId);
        return;
      }
      replay();
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [store.token, allAccessibleTiles.length]);

  /**
   * Local app directory definitions for development and local-only discovery.
   *
   * In production, replace this with your actual App Directory implementation:
   * ```typescript
   * import { AppDirectoryClient } from '@fm/fdc3-app-directory';
   * const appDirectory = new AppDirectoryClient({
   *   baseUrl: 'https://your-app-directory.com',
   *   authToken: userAuthToken
   * });
   * ```
   */
  const localApps = useMemo<AppDefinition[]>(() => {
    if (singleViewRequest) {
      const selectedTile = allAccessibleTiles.find(
        (tile) => tile.tile && getFdc3AppId(tile.tile) === singleViewAppId,
      );

      if (!selectedTile || !singleViewAppId) {
        return [];
      }

      return [
        {
          appId: singleViewAppId,
          name: selectedTile.title,
          version: '',
          description: '',
          icon: '',
          type: '',
          url: '',
          interop: fdc3Definitions.find((app) => app.appId === singleViewAppId)?.interop ?? {},
        },
      ];
    }

    if (allAccessibleTiles.length === 0) {
      return fdc3Definitions.map((app) => ({
        appId: app.appId,
        name: app.appId,
        version: '',
        description: '',
        icon: '',
        type: '',
        url: '',
        interop: app.interop ?? {},
      }));
    }

    return allAccessibleTiles.map((tile) => {
      const appId = tile.tile?.replace(/\//g, '') ?? '';
      return {
        appId,
        name: tile.title,
        version: '',
        description: '',
        icon: '',
        type: '',
        url: '',
        interop: fdc3Definitions.find((app) => app.appId === appId)?.interop ?? {},
      };
    });
  }, [allAccessibleTiles, singleViewAppId, singleViewRequest]);

  // ========================================================================
  // Broker Configuration
  // ========================================================================

  /**
   * Select app directory client based on environment
   *
   * In development, use mock for faster iteration without external dependencies.
   * In production, use the real App Directory client.
   */
  const appDirectory = useMemo(
    () =>
      new AppDirectoryClientImpl({
        baseUrl: 'https://your-real-app-directory.com',
        getAuthToken: () => localStorage.getItem('authToken'),
        timeout: 5000,
        localApps,
        mode: 'local-only',
      }),
    [localApps],
  );

  /**
   * Broker callbacks configuration
   *
   * These callbacks are injected by the base MFE to customize broker behavior.
   * They integrate with your existing MFE infrastructure (auth, routing, etc.).
   */
  const brokerConfig = useMemo<BrokerConfig>(
    () => ({
      // App Directory configuration
      appDirectory,

      // Custom channel IDs for user channels
      userChannelIds: ['red', 'green', 'blue', 'orange', 'purple'],

      workflows,

      // Platform extension, not an FDC3 API. Module Federation hosts can add a
      // ModuleFederationModuleAdapter with their runtime's loadRemote function.
      moduleLoader: new ModuleLoader([
        new SystemJsModuleAdapter((moduleId) => System.import(moduleId)),
      ]),

      // Enable debug logging (set to false in production)
      enableDebug: process.env.NODE_ENV === 'development',

      // Log level
      logLevel: LogLevel.DEBUG,

      ...getBrowserInteropBrokerOptions(),

      ...getOpenFinBrokerOptions(),

      ...getSingleViewBrokerOptions(singleViewContainer),

      // Login/logout handler registration
      onLogin: async (callback: () => Promise<unknown>) => {
        // Register login callback - called when user logs in
        console.log('[FDC3] Login handler registered');
        loginCallbacksRef.current.add(callback);
      },

      onLogout: async (callback: () => Promise<unknown>) => {
        // Register logout callback - called when user logs out
        console.log('[FDC3] Logout handler registered');
        loginCallbacksRef.current.add(callback);
      },

      // Callbacks for broker operations
      callbacks: {
        /**
         * Check if user is logged in
         *
         * This is called before opening tiles or raising intents to ensure
         * the user is authenticated. Integrate with your auth system.
         */
        onLoginStatusCheck: async (): Promise<boolean> => {
          try {
            // Integrate with your auth system
            // Example: Check if user has a valid token
            const token = localStorage.getItem('SET_TOKEN');
            return !!token;
          } catch (error) {
            console.error('Login status check failed:', error);
            return false;
          }
        },

        /**
         * Open a tile with context
         *
         * This is called when the broker needs to open a new tile.
         * Integrate with your Single-SPA or routing system.
         */
        onTileOpen: async (app: AppIdentifier): Promise<AppIdentifier> => {
          try {
            console.log(`Opening tile: ${app.appId}`, app);

            if (singleViewRequest) {
              if (!isSingleViewTarget(app, singleViewContainer, singleViewAppId)) {
                throw new Error('Single view cannot open a tile other than its target.');
              }

              if (!singleViewContainer || !singleViewAppId) {
                throw new Error('Single-view target is unavailable.');
              }

              return {
                appId: singleViewAppId,
                instanceId: singleViewContainer.id,
              };
            }

            // Use ref to access the latest workspaceOpenTile function.
            // This prevents stale closures when the hook's dependencies change.
            const openStatus = await workspaceOpenTileRef.current(
              {
                tile: app.appId,
              },
              {
                workspaceId: app.instanceId,
              },
            );

            console.log(`Tile opened: ${app.appId}`, openStatus);

            if (!openStatus.opened) {
              throw new Error(openStatus.failedReason);
            }

            return {
              ...app,
              instanceId: openStatus.workspaceId,
            };
          } catch (error) {
            console.error('Failed to open tile:', error);
            throw error;
          }
        },

        /**
         * Close a tile
         *
         * This is called when the broker needs to close a tile.
         * Integrate with your Single-SPA or routing system.
         */
        onTileClose: async (app: AppIdentifier): Promise<void> => {
          try {
            console.log(`Closing tile: ${app.appId}`);

            // Integrate with your routing/Single-SPA system
            // Example:
            // import { navigateToUrl } from 'single-spa';
            // navigateToUrl('/home');

            console.log(`[FDC3] Tile close requested: ${app.appId}`);
          } catch (error) {
            console.error('Failed to close tile:', error);
            throw error;
          }
        },

        /**
         * Validate user entitlements for an action
         *
         * This is called before performing sensitive operations.
         * Integrate with your entitlement/permission system.
         */
        onValidateEntitlements: async (tileId: string, action: string): Promise<boolean> => {
          try {
            console.log(`Checking entitlements: ${tileId} - ${action}`);

            // Integrate with your entitlement system
            // Example: Call your entitlement API
            // const response = await fetch(`/api/entitlements/${tileId}/${action}`);
            // return response.ok;

            // For demonstration, allow all actions
            return true;
          } catch (error) {
            console.error('Entitlement check failed:', error);
            return false;
          }
        },

        /**
         * Create a new workspace
         *
         * This is called when a new workspace is created.
         * Integrate with your workspace management system.
         */
        onWorkspaceCreated: (workspaceId: string): void => {
          console.log(`Workspace created: ${workspaceId}`);

          // Integrate with your workspace system
          // Example:
          // workspaceManager.createWorkspace(workspaceId);
        },

        /**
         * Log security event
         *
         * This is called for security-relevant events.
         * Integrate with your audit logging system.
         */
        onSecurityEvent: (event: string, data: unknown): void => {
          console.log(`Security event: ${event}`, data);

          // Integrate with your audit logging system
          // Example:
          // auditLogger.log(event, data);
        },

        /**
         * Display resolver UI
         *
         * This is called when multiple targets can handle an intent.
         * Returns a promise that resolves when user selects a target.
         *
         * IMPORTANT: This integrates with the ResolverDialog component.
         */
        onShowResolverUI: async (
          targets: ResolverTarget[],
          context?: Context,
          intent?: string,
        ): Promise<ResolverTarget | null> =>
          new Promise((resolve, reject) => {
            // Update resolver state to show dialog
            setResolverTargets(targets);
            setResolverContext(context ?? null);
            setResolverIntent(intent ?? '');
            setResolverResolve(() => (target: ResolverTarget) => {
              setResolverOpen(false);
              resolve(target);
            });
            setResolverReject(() => (error: Error) => {
              setResolverOpen(false);
              reject(error);
            });
            setResolverOpen(true);
          }),
      },
    }),
    [appDirectory, singleViewAppId, singleViewContainer, singleViewRequest],
  );

  // ========================================================================
  // Broker Initialization
  // ========================================================================

  /**
   * Initialize the broker when component mounts
   *
   * This creates the Broker instance and makes it available to all tiles
   * via the setBroker() function from @fm/fdc3-agent.
   *
   * Note: We use a ref to track if initialization has occurred to prevent
   * re-initialization due to brokerConfig reference changes. The brokerConfig
   * object is stable via useMemo, but we add an extra guard to ensure
   * the broker is only initialized once.
   */
  const brokerInitializedRef = useRef(false);

  useEffect(() => {
    // Skip if already initialized
    if (brokerInitializedRef.current) {
      return;
    }

    const initializeBroker = async () => {
      try {
        console.log('[FDC3] Initializing broker...');

        // Create the broker instance
        const broker = new Broker(brokerConfig);
        brokerRef.current = broker;

        // Make broker available to all tiles
        setBroker(broker);

        // Mark as initialized to prevent re-initialization
        brokerInitializedRef.current = true;
        setBrokerInitialized(true);
        setBrokerInitializedWithTiles(allAccessibleTiles.length > 0);

        console.log('[FDC3] Broker initialized successfully');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setBrokerError(`Failed to initialize broker: ${errorMessage}`);
        console.error('[FDC3] Broker initialization failed:', error);
      }
    };

    initializeBroker();
  }, [brokerConfig, allAccessibleTiles.length]);

  // Separate effect for FDC3 log service — not coupled to broker config changes
  useEffect(() => {
    initFDC3LogService();

    return () => {
      destroyFDC3LogService();
    };
  }, []);

  // ========================================================================
  // Resolver Dialog Handlers
  // ========================================================================

  /**
   * Handle user selecting a target in the resolver dialog
   */
  const handleResolverSelect = useCallback(
    (target: ResolverTarget) => {
      console.log('[FDC3 Resolver] Target selected:', target);
      if (resolverResolve) {
        resolverResolve(target);
      }
    },
    [resolverResolve],
  );

  /**
   * Handle user cancelling the resolver dialog
   */
  const handleResolverCancel = useCallback(() => {
    console.log('[FDC3 Resolver] Cancelled by user');
    if (resolverReject) {
      resolverReject(new Error('User cancelled intent resolution'));
    }
  }, [resolverReject]);

  // ========================================================================
  // Render
  // ========================================================================

  return (
    <>
      {/* Main application content */}
      {children}

      {/* FDC3 Resolver Dialog */}
      {!singleViewRequest && (
        <ResolverDialog
          open={resolverOpen}
          intent={resolverIntent}
          context={resolverContext as Context}
          targets={resolverTargets}
          onSelect={handleResolverSelect}
          onCancel={handleResolverCancel}
        />
      )}

      {/* Floating FDC3 Console — only in dev mode when logged in */}
      {!singleViewRequest && process.env.NODE_ENV === 'development' && store.token && (
        <FDC3ConsoleWidget />
      )}

      {/* Broker Status Indicator (for development) */}
      {/* {process.env.NODE_ENV === 'development' && (
        <BrokerStatusBadge initialized={brokerInitialized} error={brokerError} />
      )} */}
    </>
  );
};

export default FDC3Integration;
