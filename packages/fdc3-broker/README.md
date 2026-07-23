# ratan-fdc3-broker

**FDC3 2.2-compliant broker implementation for MFE platform**

## Overview

`ratan-fdc3-broker` is a central FDC3 broker that runs in the base MFE layer and provides full FDC3 2.2 DesktopAgent API functionality. It handles intent resolution, channel management, context broadcasting, and integrates with OpenFin for bidirectional routing.

### Key Features

- **Intent Resolution**: Automatic intent target resolution with support for ambiguous intent handling
- **Channel Management**: User channels (red, green, blue), app channels, and private channels
- **Context Broadcasting**: Real-time context sharing between tiles
- **App Directory Integration**: Query available applications and their intents
- **OpenFin Bridge**: Bidirectional intent routing with OpenFin applications
- **Resolver UI**: Built-in resolver dialog for ambiguous intent resolution
- **Entitlement Validation**: Permission checks for all FDC3 operations
- **Performance Tracking**: Built-in performance monitoring and logging
- **Security Event Logging**: Audit trail for all entitlement violations

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Base MFE (@fm/base)                       │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           FDC3 Broker (ratan-fdc3-broker)              │   │
│  │  - Intent Resolution (uses @finos/fdc3 types)        │   │
│  │  - Channel Management                                 │   │
│  │  - Context Broadcasting                               │   │
│  │  - App Directory Integration                          │   │
│  │  - OpenFin Bridge (bidirectional routing)            │   │
│  │  - Resolver UI Integration                            │   │
│  │  - Entitlement Validation                             │   │
│  │  - Performance Tracking                               │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↓                                  │
│                    Module Federation                         │
│                           ↓                                  │
└─────────────────────────────────────────────────────────────┘
                           ↓
        ┌──────────────────┴──────────────────┐
        ↓                  ↓                   ↓
   ┌─────────┐      ┌─────────┐         ┌─────────┐
   │  Tile 1 │      │  Tile 2 │         │  Tile 3 │
   │         │      │         │         │         │
   │ Agent   │      │ Agent   │         │ Agent   │
   │ API     │      │ API     │         │ API     │
   └─────────┘      └─────────┘         └─────────┘
```

## Installation

```bash
cd apps/base
npm install ratan-fdc3-broker ratan-fdc3-app-directory ratan-fdc3-resolver-ui
```

### Peer Dependencies

```json
{
  "@finos/fdc3": "^2.2.0",
  "react": "^18.0.0"
}
```

## Quick Start

### 1. Create a Broker Instance

Create and configure the broker in your base MFE:

```tsx
// apps/base/src/hooks/fdc3/broker.ts

import { Broker } from 'ratan-fdc3-broker';
import { AppDirectoryClientImpl } from 'ratan-fdc3-app-directory';

// Create app directory client
const appDirectory = new AppDirectoryClientImpl({
  baseUrl: process.env.APP_DIRECTORY_URL || 'https://app-directory.example.com/api',
  authToken: localStorage.getItem('token') || undefined,
  timeout: 10000,
});

// Create and configure broker
export const broker = new Broker({
  appDirectory: {
    baseUrl: process.env.APP_DIRECTORY_URL || 'https://app-directory.example.com/api',
    authToken: localStorage.getItem('token') || undefined,
    useMock: process.env.NODE_ENV === 'development',
  },

  callbacks: {
    // Inject login status check
    onLoginStatusCheck: async () => {
      const token = localStorage.getItem('token');
      return !!token;
    },

    // Inject tile opening logic
    onTileOpen: async (tileId: string, context: any) => {
      console.log('[Broker] Opening tile:', tileId, context);

      // Use your workspace/tile management logic
      // Example: await addWorkspace({ tileId, context, ... });
    },

    // Inject entitlement validation
    onValidateEntitlements: async (tileId: string, action: string) => {
      try {
        // Call your entitlement service
        // const response = await fetch(`/api/entitlements/${tileId}/${action}`);
        // const { allowed } = await response.json();
        // return allowed;
        return true; // Placeholder
      } catch (error) {
        console.error('[Broker] Entitlement check failed:', error);
        return false;
      }
    },

    // Optional: Inject resolver UI
    onShowResolverUI: async (targets) => {
      // Return a promise that resolves with the selected target
      // This should integrate with your resolver UI component
      console.log('[Broker] Multiple targets found, show resolver:', targets);
      return targets[0]; // Placeholder - return first target
    },

    // Optional: Security event logging
    onSecurityEvent: async (event: string, data: any) => {
      console.warn(`[FDC3:SECURITY] ${event}`, data);
      // Send to security monitoring service
    },
  },

  // Enable debug logging in development
  enableDebug: process.env.NODE_ENV === 'development',

  // User channels available
  userChannelIds: ['red', 'green', 'blue'],

  // Enable OpenFin bridge (auto-detects if OpenFin is available)
  enableOpenFinBridge: true,
});
```

### 2. Make Broker Available to Tiles

Set up the broker so tiles can access it via the agent:

```tsx
// apps/base/src/root.tsx or apps/base/src/hooks/provider/index.tsx

import { useEffect } from 'react';
import { broker } from './hooks/fdc3/broker';
import { setBroker } from 'ratan-fdc3-agent';

const AppWithBroker: React.FC = ({ children }) => {
  useEffect(() => {
    // Make broker available to all tiles
    setBroker(broker);

    return () => {
      // Clean up on unmount
      // setBroker(null); // Optional: clear broker
    };
  }, []);

  return <>{children}</>;
};

export default AppWithBroker;
```

### 3. Use Resolver UI (Optional)

If you want to use the built-in resolver UI for ambiguous intents:

```tsx
// apps/base/src/hooks/fdc3/broker-with-resolver.tsx

import React, { useState } from 'react';
import { Broker, ResolverTarget } from 'ratan-fdc3-broker';
import { ResolverDialog } from 'ratan-fdc3-resolver-ui';
import type { Context } from 'ratan-fdc3-broker';

export const createBrokerWithResolver = () => {
  const [resolverState, setResolverState] = useState({
    open: false,
    intent: '',
    context: null as Context | null,
    targets: [] as ResolverTarget[],
  });

  let currentResolve: ((value: ResolverTarget) => void) | null = null;
  let currentReject: ((reason?: any) => void) | null = null;

  const handleResolverSelect = (target: ResolverTarget) => {
    currentResolve?.(target);
    setResolverState((prev) => ({ ...prev, open: false }));
  };

  const handleResolverCancel = () => {
    currentReject?.(new Error('User cancelled'));
    setResolverState((prev) => ({ ...prev, open: false }));
  };

  const resolverUI = (
    <ResolverDialog
      open={resolverState.open}
      intent={resolverState.intent}
      context={resolverState.context}
      targets={resolverState.targets}
      onSelect={handleResolverSelect}
      onCancel={handleResolverCancel}
    />
  );

  // Create broker with resolver callback
  const broker = new Broker({
    appDirectory: {
      baseUrl: process.env.APP_DIRECTORY_URL || 'https://app-directory.example.com/api',
      authToken: localStorage.getItem('token') || undefined,
    },
    callbacks: {
      onLoginStatusCheck: async () => !!localStorage.getItem('token'),
      onTileOpen: async (tileId, context) => {
        // Your tile opening logic
      },
      onValidateEntitlements: async (tileId, action) => {
        // Your entitlement validation
        return true;
      },
      onShowResolverUI: async (targets, intent, context) => {
        return new Promise((resolve, reject) => {
          currentResolve = resolve;
          currentReject = reject;
          setResolverState({
            open: true,
            intent,
            context,
            targets,
          });
        });
      },
    },
    enableDebug: process.env.NODE_ENV === 'development',
    userChannelIds: ['red', 'green', 'blue'],
  });

  return { broker, resolverUI };
};
```

### 4. Verify Broker is Running

Open browser console and check:

```javascript
// You should see:
[FDC3:INFO] Broker initialized
[FDC3:INFO] App Directory connected
[FDC3:INFO] User channels loaded: red, green, blue
```

## API Reference

### Broker Class

The main FDC3 broker implementation.

```tsx
import { Broker } from 'ratan-fdc3-broker';

const broker = new Broker(config);
```

#### Constructor

```tsx
constructor(config: BrokerConfig)
```

**Parameters:**

```tsx
interface BrokerConfig {
  // App Directory client configuration
  appDirectory: AppDirectoryConfig;

  // Callbacks for integration
  callbacks: BrokerCallbacks;

  // Enable debug logging (default: false)
  enableDebug?: boolean;

  // User channel IDs available (default: ["red", "green", "blue"])
  userChannelIds?: string[];

  // Enable OpenFin bridge (default: true)
  enableOpenFinBridge?: boolean;
}

interface AppDirectoryConfig {
  baseUrl: string;
  authToken?: string;
  timeout?: number;
  useMock?: boolean;
}

interface BrokerCallbacks {
  // Check if user is logged in
  onLoginStatusCheck?: () => Promise<boolean>;

  // Open a new tile with optional context
  onTileOpen?: (tileId: string, context?: Context) => Promise<void>;

  // Close a tile
  onTileClose?: (tileId: string) => Promise<void>;

  // Validate user entitlements for an action
  onValidateEntitlements?: (tileId: string, action: string) => Promise<boolean>;

  // Create a new workspace
  onWorkspaceCreated?: (workspaceId: string) => void;

  // Log security event
  onSecurityEvent?: (event: string, data: any) => void;

  // Show resolver UI for ambiguous intents
  onShowResolverUI?: (targets: ResolverTarget[]) => Promise<ResolverTarget | null>;
}
```

### Using the Broker Directly

The broker instance implements the full FDC3 2.2 DesktopAgent API:

```tsx
import { broker } from './hooks/fdc3/broker';

// Get broker info
const info = await broker.getInfo();
console.log('[Broker] initialized', info);
// {
//   fdc3Version: "2.2",
//   provider: "fm",
//   providerVersion: "1.0.0"
// }

// Raise an intent
const resolution = await broker.raiseIntent('ViewChart', {
  type: 'fdc3.instrument',
  id: { ticker: 'AAPL' },
});

// Broadcast context
await broker.broadcast({
  type: 'fdc3.instrument',
  id: { ticker: 'AAPL' },
});

// Join a user channel
await broker.joinUserChannel('red');
```

### DesktopAgent API

The broker implements the full FDC3 2.2 DesktopAgent API:

#### Intent Operations

```typescript
// Find intent handlers for a given intent
const intents = await broker.findIntent('ViewChart');

// Find intent handlers for a given context
const intents = await broker.findIntentsByContext({ type: 'fdc3.chart' });

// Raise an intent to a specific target
const resolution = await broker.raiseIntent(
  'ViewChart',
  { type: 'fdc3.chart', id: { ticker: 'AAPL' } },
  { appId: 'chart-app', instanceId: 'chart-1' },
);

// Raise intent and let broker find best target
const resolution = await broker.raiseIntent('ViewChart', {
  type: 'fdc3.chart',
  id: { ticker: 'AAPL' },
});

// Raise intent for context (let user choose intent)
const resolution = await broker.raiseIntentForContext({
  type: 'fdc3.instrument',
  id: { ticker: 'AAPL' },
});

// Listen for intents
const listener = await broker.addIntentListener('ViewChart', (context) => {
  console.log('Received ViewChart intent:', context);
});

// Unsubscribe when done
listener.unsubscribe();
```

#### Channel Operations

```typescript
// Get all available user channels
const channels = await broker.getUserChannels();

// Join a user channel
await broker.joinUserChannel('red');

// Get current channel
const currentChannel = await broker.getCurrentChannel();

// Broadcast context to current channel
await broker.broadcast({
  type: 'fdc3.chart',
  id: { ticker: 'AAPL' },
});

// Listen for context broadcasts
const listener = await broker.addContextListener('fdc3.chart', (context) => {
  console.log('Context broadcast:', context);
});

// Leave current channel
await broker.leaveCurrentChannel();

// Get or create an app channel
const channel = await broker.getOrCreateChannel('custom-channel');

// Create a private channel
const privateChannel = await broker.createPrivateChannel();
```

#### Application Operations

```typescript
// Open an application
const appIdentifier = await broker.open(
  { appId: 'chart-app' },
  { type: 'fdc3.chart', id: { ticker: 'AAPL' } },
);

// Find application instances
const instances = await broker.findInstances({ appId: 'chart-app' });

// Get application metadata
const metadata = await broker.getAppMetadata({ appId: 'chart-app' });
```

#### Event Listeners

```typescript
// Listen for FDC3 events
const listener = await broker.addEventListener('intentRaised', (event) => {
  console.log('Intent raised:', event);
});

// Unsubscribe
listener.unsubscribe();
```

#### Implementation Metadata

```typescript
// Get broker implementation info
const info = await broker.getInfo();
// {
//   fdc3Version: "2.2",
//   provider: "fm",
//   providerVersion: "1.0.0"
// }
```

## OpenFin Integration

When running in an OpenFin environment, the broker automatically:

1. **Detects OpenFin**: Checks for `fin.desktop.fdc3` availability
2. **Bridges Intents**: Routes intents to/from OpenFin applications
3. **Synchronizes Channels**: Syncs channel operations with OpenFin

### Intent Routing

The broker supports three routing modes:

```
Internal → Internal: Direct delivery (same as browser)
Internal → External: Delegates to OpenFin FDC3 API
External → Internal: Subscribes to OpenFin intents
```

### Configuration

No additional configuration needed. The broker auto-detects OpenFin:

```typescript
const brokerConfig = {
  // ... other config
  enableOpenFinBridge: true, // Default: true
};
```

### Lazy Loading

The OpenFin bridge is lazy-loaded for optimal performance:

- **On-Demand Loading**: The OpenFin bridge module is only loaded when OpenFin is detected
- **Reduced Bundle Size**: OpenFin bridge code is not included in the initial bundle
- **Auto-Detection**: Bridge initializes automatically when `fin.desktop.fdc3` is available
- **Configurable**: Set `enableOpenFinBridge: false` to disable completely

**Benefits:**

- Smaller initial bundle size for non-OpenFin environments
- Faster page load for web-only deployments
- Automatic fallback when OpenFin is not available

**Example:**

```typescript
const broker = new Broker({
  // ... config
  enableOpenFinBridge: true, // Lazy loads when OpenFin detected
});
```

## Entitlement Validation

The broker validates user permissions before executing FDC3 operations:

### Supported Actions

- `send-intent`: Permission to send an intent
- `receive-intent`: Permission to receive/listen for intents
- `join-channel`: Permission to join a user channel
- `join-premium-channel`: Permission to join premium/private channels
- `open`: Permission to open an application

### Implementation

```typescript
const brokerConfig = {
  callbacks: {
    onValidateEntitlements: async (tileId: string, action: string) => {
      // Check user entitlements for the action
      const response = await fetch(`/api/entitlements/${tileId}/${action}`);
      const { allowed } = await response.json();
      return allowed;
    },

    // Optional: Log security violations
    onSecurityEvent: async (event: string, data: any) => {
      console.warn(`[SECURITY] ${event}`, data);
      // Send to monitoring service
    },
  },
};
```

### Security Events

All entitlement violations are logged with:

- Tile ID attempting the operation
- Intent/Channel/App being accessed
- Context type (for intents)
- Error code and reason

## Debugging

### Enable Debug Logging

```typescript
const brokerConfig = {
  enableDebug: true, // Enables detailed logging
};
```

### Debug Output

```javascript
[FDC3:DEBUG] Resolving intent: ViewChart
[FDC3:DEBUG] Found 2 targets for ViewChart
[FDC3:DEBUG] Target 1: chart-app (instance: chart-1)
[FDC3:DEBUG] Target 2: quote-app (instance: quote-1)
[FDC3:DEBUG] Showing resolver UI
[FDC3:DEBUG] User selected: chart-app
[FDC3:DEBUG] Delivering intent to chart-app
[FDC3:INFO] Intent raised: ViewChart → chart-app
```

### Performance Tracking

The broker tracks operation times and warns if operations exceed 100ms:

```javascript
[FDC3:WARN] Intent resolution took 150ms (threshold: 100ms)
```

## Error Handling

### ErrorBoundary Component

The `ErrorBoundary` component catches JavaScript errors anywhere in the broker's child component tree, logs those errors, and displays a fallback UI instead of the crashed component tree.

#### Basic Usage

```tsx
import { ErrorBoundary, BrokerProvider } from 'ratan-fdc3-broker';

<ErrorBoundary
  onError={(error, errorInfo) => {
    console.error('Broker error:', error, errorInfo);
    // Send error to monitoring service
  }}
>
  <BrokerProvider config={brokerConfig}>{children}</BrokerProvider>
</ErrorBoundary>;
```

#### Custom Fallback UI

```tsx
<ErrorBoundary
  fallback={
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>FDC3 Service Unavailable</h2>
      <p>The FDC3 broker encountered an error. Please refresh the page.</p>
      <button onClick={() => window.location.reload()}>Refresh Page</button>
    </div>
  }
  recoverable={false}
>
  <BrokerProvider config={brokerConfig}>{children}</BrokerProvider>
</ErrorBoundary>
```

#### Props

```typescript
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode; // Custom fallback UI
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  recoverable?: boolean; // Show "Try Again" button (default: true)
}
```

#### Features

- **Error Logging**: Automatically logs all errors with full stack traces to console
- **Development Details**: Shows detailed error information in development mode
- **User-Friendly**: Displays non-technical error messages to end users
- **Recovery Options**: Provides retry and dismiss buttons (configurable)
- **Custom Fallback**: Supports custom fallback UI components
- **Error Callback**: Optional callback for custom error handling/reporting

### Common Errors

```typescript
// Not entitled to send intent
try {
  await broker.raiseIntent('ViewChart', context);
} catch (error) {
  if (error.message.includes('Not entitled')) {
    // User doesn't have permission
  }
}

// No target found
try {
  await broker.raiseIntent('NonExistent', context);
} catch (error) {
  if (error.message.includes('No target found')) {
    // Handle no available target
  }
}

// User cancelled resolver
try {
  await broker.raiseIntent('ViewChart', context);
} catch (error) {
  if (error.message.includes('User cancelled')) {
    // User closed resolver dialog
  }
}
```

## Examples

### Example 1: Send Intent to Specific Tile

```tsx
import { useBroker } from 'ratan-fdc3-broker';

const ChartTile = () => {
  const { broker } = useBroker();

  const sendToNews = async () => {
    await broker.raiseIntent(
      'ViewNews',
      { type: 'fdc3.news', id: { newsId: '12345' } },
      { appId: 'news-app', instanceId: 'news-tile-1' },
    );
  };

  return <button onClick={sendToNews}>Send News</button>;
};
```

### Example 2: Listen for Context Broadcasts

```tsx
import { useBroker } from 'ratan-fdc3-broker';
import { useEffect, useState } from 'react';

const InstrumentTile = () => {
  const { broker } = useBroker();
  const [instrument, setInstrument] = useState<any>(null);

  useEffect(() => {
    let listener: any;

    const setupListener = async () => {
      await broker.joinUserChannel('red');

      listener = await broker.addContextListener('fdc3.instrument', (context) => {
        setInstrument(context);
      });
    };

    setupListener();

    return () => {
      listener?.unsubscribe();
    };
  }, [broker]);

  return <div>{instrument && <h1>Instrument: {instrument.id.ticker}</h1>}</div>;
};
```

### Example 3: Create Private Channel

```tsx
import { useBroker } from 'ratan-fdc3-broker';

const PortfolioTile = () => {
  const { broker } = useBroker();

  const sharePortfolio = async () => {
    // Create private channel
    const channel = await broker.createPrivateChannel();

    // Grant access to specific tiles
    if ('grantAccess' in channel) {
      channel.grantAccess('analysis-tile');
      channel.grantAccess('risk-tile');
    }

    // Broadcast portfolio context
    await channel.broadcast({
      type: 'fdc3.portfolio',
      id: { portfolioId: 'PORT-123' },
    });
  };

  return <button onClick={sharePortfolio}>Share Portfolio</button>;
};
```

## Testing

### Vitest Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
  },
});
```

### Test Setup

```typescript
// test/setup.ts
import { vi } from 'vitest';

// Mock OpenFin
global.fin = undefined;
```

### Example Test

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Broker } from 'ratan-fdc3-broker';
import { MockAppDirectoryService } from 'ratan-fdc3-app-directory/mock';

describe('Broker', () => {
  let broker: Broker;

  beforeEach(() => {
    broker = new Broker({
      appDirectory: new MockAppDirectoryService(),
      callbacks: {
        onLoginStatusCheck: async () => true,
        onTileOpen: async () => {},
        onShowResolverUI: async (targets) => targets[0],
      },
      enableDebug: false,
      userChannelIds: ['red', 'green', 'blue'],
    });
  });

  it('should raise intent to target', async () => {
    broker.registerTile('tile-1', 'app-a');
    broker.setCurrentTile('tile-1');

    const handler = vi.fn();
    await broker.addIntentListener('ViewChart', handler);

    const context = {
      type: 'fdc3.chart',
      id: { ticker: 'AAPL' },
    };

    await broker.raiseIntent('ViewChart', context, {
      appId: 'app-a',
      instanceId: 'tile-1',
    });

    expect(handler).toHaveBeenCalledWith(context);
  });
});
```

## TypeScript Support

All types are re-exported from `@finos/fdc3`:

```typescript
import type {
  Context,
  AppIdentifier,
  AppMetadata,
  Channel,
  IntentResolution,
  Listener,
  ImplementationMetadata,
} from 'ratan-fdc3-broker';
```

## License

MIT

## Related Packages

- [`ratan-fdc3-agent`](../fdc3-agent) - FDC3 agent for tiles
- [`ratan-fdc3-app-directory`](../fdc3-app-directory) - App Directory client
- [`ratan-fdc3-resolver-ui`](../fdc3-resolver-ui) - Resolver UI component
- [`@finos/fdc3`](https://www.npmjs.com/package/@finos/fdc3) - Official FDC3 standard
