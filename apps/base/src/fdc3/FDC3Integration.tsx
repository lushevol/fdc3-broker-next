/**
 * FDC3 Integration Example for Base MFE
 *
 * This example demonstrates the complete setup and integration of the FDC3 broker
 * in the base MFE. It shows how to initialize the broker, configure callbacks,
 * integrate the resolver UI, and provide error handling.
 *
 * @packageDocumentation
 */

import { type AppIdentifier, setBroker } from 'ratan-fdc3-agent';
import { AppDirectoryClientImpl } from 'ratan-fdc3-app-directory';
import {
  type AppDefinition,
  Broker,
  type BrokerConfig,
  type Context,
  LogLevel,
  type ResolverTarget,
} from 'ratan-fdc3-broker';
import { ResolverDialog } from 'ratan-fdc3-resolver-ui';
import type React from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useFDC3WorkspaceHelper } from './useFDC3WorkspaceHelper';
import fdc3Definitions from './declarations/fdc3-definitions.json';

// ============================================================================
// Mock App Directory for Development
// ============================================================================

/**
 * Mock app directory for development and testing.
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
  // ========================================================================
  // State Management
  // ========================================================================

  const [brokerInitialized, setBrokerInitialized] = useState(false);
  const [brokerInitializedWithTiles, setBrokerInitializedWithTiles] = useState(false);
  const [brokerError, setBrokerError] = useState<string | null>(null);
  const [resolverOpen, setResolverOpen] = useState(false);
  const [resolverIntent, setResolverIntent] = useState('');
  const [resolverContext, setResolverContext] = useState<Context | null>(null);
  const [resolverTargets, setResolverTargets] = useState<ResolverTarget[]>([]);
  const [resolverResolve, setResolverResolve] = useState<((target: ResolverTarget) => void) | null>(
    null,
  );
  const [resolverReject, setResolverReject] = useState<((error: Error) => void) | null>(null);

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

  useEffect(() => {
    workspaceOpenTileRef.current = workspaceOpenTile;
  }, [workspaceOpenTile]);

  const localApps = useMemo<AppDefinition[]>(() => {
    return allAccessibleTiles.map((tile) => {
      const appId = tile.tile?.replace('/', '');
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
  }, [allAccessibleTiles]);

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

      // Enable debug logging (set to false in production)
      enableDebug: process.env.NODE_ENV === 'development',

      // Log level
      logLevel: LogLevel.DEBUG,

      // Login/logout handler registration
      onLogin: async (callback: () => Promise<any>) => {
        // Register login callback - called when user logs in
        console.log('[FDC3] Login handler registered');
        await callback();
      },

      onLogout: async (callback: () => Promise<any>) => {
        // Register logout callback - called when user logs out
        console.log('[FDC3] Logout handler registered');
        await callback();
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

            // Use ref to access the latest workspaceOpenTile function
            // This prevents stale closures when the hook's dependencies change
            const openStatus = await workspaceOpenTileRef.current(
              {
                tile: app.appId,
              },
              {
                workspaceId: app?.instanceId,
              },
            );

            console.log(`Tile opened: ${app.appId}`, openStatus);

            if (!openStatus.opened) {
              throw new Error(openStatus.failedReason);
            }

            return {
              ...app,
              instanceId: openStatus?.workspaceId,
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
        onShowResolverUI: async (targets: ResolverTarget[]): Promise<ResolverTarget | null> => {
          return new Promise((resolve, reject) => {
            // Update resolver state to show dialog
            setResolverTargets(targets);
            setResolverResolve(() => (target: ResolverTarget) => {
              setResolverOpen(false);
              resolve(target);
            });
            setResolverReject(() => (error: Error) => {
              setResolverOpen(false);
              reject(error);
            });
            setResolverOpen(true);
          });
        },
      },
    }),
    [appDirectory],
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

    // Skip if app directory has no tiles yet (still loading)
    if (allAccessibleTiles.length === 0) {
      return;
    }

    const initializeBroker = async () => {
      try {
        console.log('[FDC3] Initializing broker...');

        // Create the broker instance
        const broker = new Broker(brokerConfig);

        // Make broker available to all tiles
        setBroker(broker);

        // Mark as initialized to prevent re-initialization
        brokerInitializedRef.current = true;
        setBrokerInitialized(true);
        setBrokerInitializedWithTiles(true);

        console.log('[FDC3] Broker initialized successfully');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setBrokerError(`Failed to initialize broker: ${errorMessage}`);
        console.error('[FDC3] Broker initialization failed:', error);
      }
    };

    initializeBroker();
  }, [brokerConfig, allAccessibleTiles.length]);

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
      <ResolverDialog
        open={resolverOpen}
        intent={resolverIntent}
        context={resolverContext as Context}
        targets={resolverTargets}
        onSelect={handleResolverSelect}
        onCancel={handleResolverCancel}
      />

      {/* Broker Status Indicator (for development) */}
      {/* {process.env.NODE_ENV === 'development' && (
        <BrokerStatusBadge initialized={brokerInitialized} error={brokerError} />
      )} */}
    </>
  );
};

// ============================================================================
// Broker Status Badge Component (Development Only)
// ============================================================================

interface BrokerStatusBadgeProps {
  initialized: boolean;
  error: string | null;
}

const BrokerStatusBadge: React.FC<BrokerStatusBadgeProps> = ({ initialized, error }) => {
  if (error) {
    return (
      <div
        style={{
          position: 'fixed',
          bottom: '10px',
          right: '10px',
          padding: '10px 15px',
          backgroundColor: '#f44336',
          color: '#fff',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: 500,
          zIndex: 10000,
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        }}
      >
        FDC3 Error: {error}
      </div>
    );
  }

  if (!initialized) {
    return (
      <div
        style={{
          position: 'fixed',
          bottom: '10px',
          right: '10px',
          padding: '10px 15px',
          backgroundColor: '#ff9800',
          color: '#fff',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: 500,
          zIndex: 10000,
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        }}
      >
        FDC3 Initializing...
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        padding: '10px 15px',
        backgroundColor: '#4caf50',
        color: '#fff',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: 500,
        zIndex: 10000,
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
      }}
    >
      FDC3 Ready
    </div>
  );
};

export default FDC3Integration;
