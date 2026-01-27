# Data Model: FDC3 Interoperability

**Feature**: FDC3 Interoperability for MFE Platform
**Date**: 2025-12-27
**Status**: Draft

This document defines all TypeScript interfaces, types, and data structures for the FDC3 implementation packages.

**IMPORTANT**: All FDC3 types are imported from `@finos/fdc3@2.2.x` to ensure strict compliance with the FDC3 2.2 specification. No custom FDC3 type definitions are used.

---

## Table of Contents

1. [FDC3 Standard Types](#1-fdc3-standard-types-from-finosfdc3)
2. [App Directory Types](#2-app-directory-types)
3. [Broker Configuration Types](#3-broker-configuration-types)
4. [Agent API Types](#4-agent-api-types)
5. [Resolver UI Types](#5-resolver-ui-types)
6. [Internal Types](#6-internal-types)

---

## 1. FDC3 Standard Types (from @finos/fdc3)

All core FDC3 types are re-exported from `@finos/fdc3@2.2.x`. These types are used across all packages.

```typescript
// packages/fdc3-broker/src/index.ts
// packages/fdc3-agent/src/index.ts

/**
 * Re-export all FDC3 2.2 types from @finos/fdc3
 * @see https://www.npmjs.com/package/@finos/fdc3
 */
export type {
  // Core types
  Context,
  AppIdentifier,
  AppMetadata,
  Intent,
  IntentResolution,
  AppIntent,
  Channel,
  PrivateChannel,
  Listener,

  // Channel types
  DisplayMetadata,

  // Event types
  FDC3Event,

  // Implementation metadata
  ImplementationMetadata,
} from '@finos/fdc3';

/**
 * Re-export error types from @finos/fdc3
 */
export const {
  ResolveError,
  ChannelError,
  FDC3Error,
} from '@finos/fdc3';
```

### Usage Example

```typescript
import type { Context, AppIdentifier, Channel } from '@fm/fdc3-broker';
// or
import type { Context, AppIdentifier, Channel } from '@finos/fdc3';

const context: Context = {
  type: 'fdc3.instrument',
  id: {
    ticker: 'AAPL',
  },
  name: 'Apple Inc.',
};

const app: AppIdentifier = {
  appId: 'my-chart-app',
  instanceId: 'instance-123',
};
```

**Note**: Developers can also import directly from `@finos/fdc3` if preferred, but re-exporting from `@fm/fdc3-broker` and `@fm/fdc3-agent` provides a consistent API.

---

## 2. App Directory Types

Types for the App Directory service client and data structures.

### AppDefinition

```typescript
/**
 * Complete app definition from App Directory
 * Extends @finos/fdc3 AppMetadata with additional fields
 */
export interface AppDefinition {
  /** REQUIRED: Unique app identifier */
  appId: string;

  /** REQUIRED: App name */
  name: string;

  /** REQUIRED: App version */
  version: string;

  /** Short title (preferred for display over name) */
  title?: string;

  /** App description */
  description?: string;

  /** App icons */
  icons?: Array<{
    src: string;
    size?: string;
    type?: string;
  }>;

  /** App screenshots */
  images?: Array<{
    src: string;
    size?: string;
  }>;

  /** App categories (e.g., "Analytics", "Trading") */
  categories?: string[];

  /** Localization */
  lang?: string;

  /** Localized versions */
  localizedVersions?: Array<{
    lang: string;
    name: string;
    description?: string;
  }>;

  /** Interoperability configuration (FDC3 standard) */
  interop: {
    /** Intents this app listens for (handles) */
    intents?: {
      /** Intent handler declarations */
      listensFor?: Array<{
        /** Intent type */
        intent: string;

        /** Context types this intent accepts */
        contexts?: string[];

        /** Expected result type */
        resultType?: string;
      }>;

      /** Intents this app raises */
      raises?: Array<{
        /** Intent type */
        intent: string;

        /** Context types this intent raises with */
        contexts?: string[];
      }>;
    };
  };

  /** Entitlement constraints (platform-specific) */
  entitlementConstraints?: {
    /** Required user permissions */
    requiredPermissions?: string[];

    /** User groups that can access this app */
    userGroups?: string[];

    /** Minimum access level */
    minAccessLevel?: string;
  };
}
```

### AppDirectoryClient

```typescript
/**
 * App Directory client interface
 */
export interface AppDirectoryClient {
  /**
   * Get all apps the current user is entitled to access
   */
  getAllApps(): Promise<AppDefinition[]>;

  /**
   * Get app by appId
   * @param appId Application identifier
   */
  getApp(appId: string): Promise<AppDefinition | null>;

  /**
   * Find apps that can handle a specific intent
   * @param intent Intent type
   */
  findByIntent(intent: string): Promise<AppDefinition[]>;

  /**
   * Find apps that can handle a specific context type
   * @param contextType Context type (e.g., "fdc3.instrument")
   */
  findByContextType(contextType: string): Promise<AppDefinition[]>;

  /**
   * Find apps by category
   * @param category Category name
   */
  findByCategory(category: string): Promise<AppDefinition[]>;
}
```

### AppDirectoryConfig

```typescript
/**
 * App Directory client configuration
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
```

---

## 3. Broker Configuration Types

Types for configuring the broker with injected dependencies. Note: The Broker class itself implements the `DesktopAgent` interface from `@finos/fdc3`, so no custom Broker interface is needed.

### BrokerConfig

```typescript
import type { DesktopAgent } from '@finos/fdc3';

/**
 * Broker configuration
 */
export interface BrokerConfig {
  /** App Directory client configuration */
  appDirectory: AppDirectoryConfig;

  /** Callbacks for broker operations (injected from base MFE) */
  callbacks: BrokerCallbacks;

  /** Enable debug logging */
  enableDebug?: boolean;

  /** Log level */
  logLevel?: 'debug' | 'info' | 'warn' | 'error';

  /** Custom channel IDs for user channels */
  userChannelIds?: string[];

  /** Intent queue timeout in milliseconds */
  intentQueueTimeout?: number;

  /** Enable OpenFin bridge (if available) */
  enableOpenFinBridge?: boolean;
}
```

### BrokerCallbacks

```typescript
/**
 * Callbacks injected by base MFE for broker customization
 */
export interface BrokerCallbacks {
  /**
   * Check if user is logged in
   * @returns true if authenticated
   */
  onLoginStatusCheck?(): Promise<boolean>;

  /**
   * Open a tile with context
   * @param tileId Tile identifier
   * @param context Context data (from @finos/fdc3)
   */
  onTileOpen?(tileId: string, context: Context): Promise<void>;

  /**
   * Close a tile
   * @param tileId Tile identifier
   */
  onTileClose?(tileId: string): Promise<void>;

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
  onSecurityEvent?(event: string, data: any): void;

  /**
   * Display resolver UI
   * @param targets Available targets
   * @returns Selected target or null if cancelled
   */
  onShowResolverUI?(targets: ResolverTarget[]): Promise<ResolverTarget | null>;
}
```

### ResolverTarget

```typescript
import type { AppMetadata } from '@finos/fdc3';

/**
 * Target displayed in resolver UI
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
```

---

## 4. Agent API Types

Types for the FDC3 agent that tiles use to access FDC3 APIs. Note: The agent provides the same interface as `DesktopAgent` from `@finos/fdc3` but delegates to the broker.

### getAgentApi

````typescript
import type { DesktopAgent } from '@finos/fdc3';

/**
 * Get FDC3 Agent API for tiles
 * @returns DesktopAgent instance that delegates to broker
 *
 * @example
 * ```ts
 * import { getAgentApi } from '@fm/fdc3-agent';
 *
 * const fdc3 = getAgentApi();
 * await fdc3.raiseIntent('ViewChart', {
 *   type: 'fdc3.instrument',
 *   id: { ticker: 'AAPL' }
 * });
 * ```
 */
export function getAgentApi(): DesktopAgent;
````

### React Hooks

```typescript
import type { Context, Channel, Listener, AppMetadata } from '@finos/fdc3';

/**
 * React hooks for FDC3 agent
 */
export interface AgentHooks {
  /**
   * Hook for accessing FDC3 API
   * @returns DesktopAgent instance
   */
  useFDC3(): DesktopAgent;

  /**
   * Hook for intent listener
   * @param intent Intent type
   * @param handler Intent handler (receives Context from @finos/fdc3)
   */
  useIntentListener(intent: string, handler: (context: Context) => any): void;

  /**
   * Hook for context listener
   * @param contextType Context type (null = all)
   * @param handler Context handler
   */
  useContextListener(contextType: string | null, handler: (context: Context) => void): void;

  /**
   * Hook for current channel
   * @returns Current channel or null
   */
  useCurrentChannel(): Channel | null;

  /**
   * Hook for user channels list
   * @returns Array of user channels
   */
  useUserChannels(): Channel[];
}
```

---

## 5. Resolver UI Types

Types for the Resolver UI component (React + MUI).

### ResolverDialogProps

```typescript
import type { Context } from '@finos/fdc3';
import type { AppMetadata } from '@finos/fdc3';

/**
 * Props for ResolverDialog component
 */
export interface ResolverDialogProps {
  /** Whether dialog is open */
  open: boolean;

  /** Intent type being resolved */
  intent: string;

  /** Context data for the intent */
  context: Context;

  /** Available target applications */
  targets: ResolverTarget[];

  /** Callback when user selects a target */
  onSelect: (target: ResolverTarget) => void;

  /** Callback when user cancels */
  onCancel: () => void;
}
```

### AppCardProps

```typescript
import type { AppMetadata } from '@finos/fdc3';

/**
 * Props for individual app card in resolver
 */
export interface AppCardProps {
  /** App metadata (from @finos/fdc3) */
  app: AppMetadata;

  /** Instance identifier (if multiple instances) */
  instanceId?: string;

  /** Current context of this app instance (if running) */
  currentContext?: Context;

  /** Whether this card is selected */
  selected: boolean;

  /** Whether this card has keyboard focus */
  focused: boolean;

  /** Click handler */
  onClick: () => void;

  /** Double-click handler (for quick select) */
  onDoubleClick: () => void;

  /** Tab index for keyboard navigation */
  tabIndex: number;
}
```

---

## 6. Internal Types

Internal types used by broker implementation.

### TileRegistry

```typescript
/**
 * Tile instance registry
 */
export interface TileRegistry {
  /** Register a tile */
  registerTile(tile: TileInstance): void;

  /** Unregister a tile */
  unregisterTile(tileId: string): void;

  /** Get tile by ID */
  getTile(tileId: string): TileInstance | null;

  /** Get all tiles */
  getAllTiles(): TileInstance[];

  /** Get tiles by app ID */
  getTilesByAppId(appId: string): TileInstance[];
}

/**
 * Tile instance
 */
export interface TileInstance {
  /** Unique tile ID */
  tileId: string;

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
```

### IntentQueue

```typescript
/**
 * Queued intent for unmounted tiles
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
export type IntentHandler = (context: Context) => any | Promise<any>;
```

### ChannelManager

```typescript
/**
 * Channel manager
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
```

---

## Usage Examples

### Using FDC3 Types

```typescript
import type { Context, AppIdentifier, Channel } from '@fm/fdc3-broker';
// Or import directly from @finos/fdc3
import type { Context, AppIdentifier, Channel } from '@finos/fdc3';

// Create instrument context (standard FDC3 type)
const context: Context = {
  type: 'fdc3.instrument',
  id: {
    ticker: 'AAPL',
    ISIN: 'US0378331005',
  },
  name: 'Apple Inc.',
};

// Create app identifier
const app: AppIdentifier = {
  appId: 'my-chart-app',
  instanceId: 'instance-123',
};
```

### Using App Directory

```typescript
import { AppDirectoryClient } from '@fm/fdc3-app-directory';
import type { AppDefinition } from '@fm/fdc3-app-directory';

// Query App Directory
const client: AppDirectoryClient = new AppDirectoryClientImpl({
  baseUrl: 'https://app-directory.example.com',
  authToken: userToken,
});

// Find apps that handle ViewChart intent
const chartApps: AppDefinition[] = await client.findByIntent('ViewChart');

// Check if user is entitled to app
const canOpen =
  chartApps[0]?.entitlementConstraints?.requiredPermissions?.some((p) =>
    user.permissions.includes(p),
  ) ?? false;
```

### Using Broker Configuration

```typescript
import { BrokerConfig } from '@fm/fdc3-broker';
import type { BrokerCallbacks } from '@fm/fdc3-broker';

const config: BrokerConfig = {
  appDirectory: {
    baseUrl: '/api/app-directory',
    authToken: userToken,
    useMock: false,
  },
  callbacks: {
    onLoginStatusCheck: async () => {
      return store.auth.isAuthenticated;
    },
    onTileOpen: async (tileId, context) => {
      await workspaceManager.addTile(tileId, context);
    },
    onValidateEntitlements: async (tileId, action) => {
      return entitlementService.check(tileId, action);
    },
    onShowResolverUI: async (targets) => {
      return await resolverUI.show(targets);
    },
  },
  enableDebug: process.env.NODE_ENV === 'development',
  logLevel: 'info',
  userChannelIds: ['red', 'green', 'blue', 'orange', 'yellow', 'cyan', 'magenta', 'purple'],
};
```

### Using Agent API in Tiles

```typescript
import { getAgentApi } from '@fm/fdc3-agent';
import type { Context } from '@finos/fdc3';

const fdc3 = getAgentApi();

// Send intent
const context: Context = {
  type: 'fdc3.instrument',
  id: { ticker: 'AAPL' },
};

await fdc3.raiseIntent('ViewChart', context);

// Join channel
await fdc3.joinUserChannel('red');

// Broadcast context
await fdc3.broadcast(context);
```

---

## Summary

This data model provides:

1. **Strict FDC3 2.2 compliance** - All types imported from `@finos/fdc3@2.2.x`
2. **Type safety** - Full TypeScript support with comprehensive definitions
3. **Extensibility** - Callback injection points for platform-specific customization
4. **Testing support** - Mock-friendly interfaces
5. **Documentation** - TSDoc comments for all public APIs

### Package Exports

**@fm/fdc3-broker**:

- Re-exports all `@finos/fdc3` types
- Exports `BrokerConfig`, `BrokerCallbacks`, `ResolverTarget`
- Exports `Broker` class (implements `DesktopAgent` from @finos/fdc3 with extensions for source attribution)

**@fm/fdc3-agent**:

- Exports `getAgentApi`, `setBroker`
- Exports `ScopedDesktopAgent` (Internal use)
- Exports React hooks

## 7. Broker Architecture Updates

### Stateless Broker

The `Broker` class is designed to be stateless regarding the calling tile. Instead of storing `currentAppId`, all public methods dealing with context, intents, or channels accept an additional `source: AppIdentifier` argument.

```typescript
// Example modified signature
broadcast(context: Context, source: AppIdentifier): Promise<void>;
raiseIntent(intent: string, context: Context, source: AppIdentifier, target?: AppIdentifier): Promise<IntentResolution>;
```

### ScopedDesktopAgent

The `ScopedDesktopAgent` is a wrapper around the `Broker` that automatically injects the `source` argument into every call. It implements the standard `DesktopAgent` interface, ensuring tiles don't need to know about the internal source attribution mechanism.

```typescript
class ScopedDesktopAgent implements DesktopAgent {
  constructor(
    private broker: Broker,
    private source: AppIdentifier,
  ) {}

  async broadcast(context: Context) {
    return this.broker.broadcast(context, this.source);
  }
  // ... other methods
}
```

- Re-exports all `@finos/fdc3` types
- Exports `getAgentApi()` function
- Exports React hooks (`useFDC3`, `useIntentListener`, `useContextListener`)

**@fm/fdc3-app-directory**:

- Exports `AppDirectoryClient` interface
- Exports `AppDefinition` interface
- Exports `AppDirectoryConfig` interface

**@fm/fdc3-resolver-ui**:

- Exports `ResolverDialog` component
- Exports `AppCard` component
- Exports resolver UI types

---

**Next**: Implementation tasks will be generated by `/speckit.tasks` command.
