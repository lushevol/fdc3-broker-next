# FDC3 Interoperability - Quickstart Guide

**Feature**: FDC3 Interoperability for MFE Platform
**Target Audience**: Developers integrating FDC3 into MFE tiles
**Date**: 2025-12-27

---

## Table of Contents

1. [Overview](#1-overview)
2. [Installation](#2-installation)
3. [For Base MFE Developers](#3-for-base-mfe-developers)
4. [For Tile Developers](#4-for-tile-developers)
5. [OpenFin Integration](#5-openfin-integration)
6. [Common Patterns](#6-common-patterns)
7. [Testing](#7-testing)
8. [Troubleshooting](#8-troubleshooting)

---

## 1. Overview

The FDC3 interoperability system consists of **four** npm packages:

### Packages

1. **`@fm/fdc3-broker`** - Core FDC3 broker (runs in base MFE)
   - Implements FDC3 2.2 DesktopAgent API using **@finos/fdc3@2.2.x** types
   - Handles intent resolution, channel management, context broadcasting
   - Integrates with existing base MFE hooks and services
   - Supports OpenFin bidirectional routing when available

2. **`@fm/fdc3-agent`** - FDC3 agent for tiles
   - Provides `getAgentApi()` for tiles to access FDC3 APIs
   - React hooks for easy integration
   - Thin wrapper that delegates to broker
   - Re-exports all FDC3 types from `@finos/fdc3`

3. **`@fm/fdc3-app-directory`** - App Directory client
   - Queries App Directory service for available applications
   - Includes mock service for development
   - Filters results by user entitlements

4. **`@fm/fdc3-resolver-ui`** - Resolver UI component (NEW!)
   - React + MUI component for intent resolution
   - Displays when multiple target applications are available
   - Full keyboard navigation and accessibility (WCAG 2.1 AA)
   - Supports multi-instance handling

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Base MFE (@fm/base)                       │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           FDC3 Broker (@fm/fdc3-broker)              │   │
│  │  - Intent Resolution (uses @finos/fdc3 types)        │   │
│  │  - Channel Management                                 │   │
│  │  - Context Broadcasting                               │   │
│  │  - App Directory Integration                          │   │
│  │  - OpenFin Bridge (bidirectional routing)            │   │
│  │  - Resolver UI Integration                            │   │
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

### Environment Support

- **Browser (Edge)**: Internal intents only (within MFE platform)
- **OpenFin**: Full bidirectional routing
  - Internal → Internal (same as browser)
  - Internal → External (delegates to OpenFin FDC3 API)
  - External → Internal (subscribes to OpenFin intents)

---

## 2. Installation

### For Base MFE

```bash
cd apps/base
yarn add @fm/fdc3-broker @fm/fdc3-app-directory @fm/fdc3-resolver-ui
```

### For Tile MFEs

```bash
cd apps/mf_tile  # or any tile app
yarn add @fm/fdc3-agent
```

### Important: FDC3 Types

All packages use **@finos/fdc3@2.2.x** for type definitions:

```typescript
// import directly from @finos/fdc3
import type { Context, AppIdentifier, Channel } from '@finos/fdc3';
```

---

## 3. For Base MFE Developers

### Step 1: Configure the Broker

Wrap your existing provider with the broker provider and inject custom logic.

```tsx
// apps/base/src/root.tsx or apps/base/src/hooks/provider/index.tsx

import React from 'react';
import { BrokerProvider } from '@fm/fdc3-broker';
import { ResolverDialog } from '@fm/fdc3-resolver-ui'; // Import resolver UI
import { useWorkspace } from './hooks/useWorkspace';
import { getService } from './hooks/service';

const AppWithBroker: React.FC = ({ children }) => {
  const { addWorkspace } = useWorkspace();
  const [resolverState, setResolverState] = React.useState({
    open: false,
    intent: '',
    context: null,
    targets: [],
  });

  // Configure broker callbacks
  const brokerConfig = {
    callbacks: {
      // Inject login status check
      onLoginStatusCheck: async () => {
        // Use existing auth state
        const token = localStorage.getItem('token');
        return !!token;
      },

      // Inject tile opening logic
      onTileOpen: async (tileId: string, context: any) => {
        console.log('[Broker] Opening tile:', tileId, context);

        // Use existing workspace hooks
        await addWorkspace({
          tileId,
          context,
          position: { x: 100, y: 100 },
          size: { width: 800, height: 600 },
        });
      },

      // Inject entitlement validation
      onValidateEntitlements: async (tileId: string, action: string) => {
        try {
          // Use existing service
          const response = await getService(`/entitlements/check`);
          return response.data.allowed;
        } catch (error) {
          console.error('[Broker] Entitlement check failed:', error);
          return false;
        }
      },

      // Inject resolver UI
      onShowResolverUI: async (targets) => {
        return new Promise((resolve, reject) => {
          setResolverState({
            open: true,
            intent: resolverState.intent,
            context: resolverState.context,
            targets,
          });

          // Store resolve/reject for dialog callbacks
          resolverState.currentResolve = resolve;
          resolverState.currentReject = reject;
        });
      },
    },

    // App Directory configuration
    appDirectory: {
      baseUrl: process.env.APP_DIRECTORY_URL || 'https://app-directory.example.com/api',
      authToken: localStorage.getItem('token') || undefined,
      useMock: process.env.NODE_ENV === 'development',
    },

    // Enable debug logging in development
    enableDebug: process.env.NODE_ENV === 'development',

    // Enable OpenFin bridge (auto-detects if OpenFin is available)
    enableOpenFinBridge: true,
  };

  // Handle resolver selection
  const handleResolverSelect = (target) => {
    resolverState.currentResolve?.(target);
    setResolverState({ ...resolverState, open: false });
  };

  // Handle resolver cancellation
  const handleResolverCancel = () => {
    resolverState.currentReject?.(new Error('User cancelled'));
    setResolverState({ ...resolverState, open: false });
  };

  return (
    <BrokerProvider config={brokerConfig}>
      {children}

      {/* Resolver UI */}
      <ResolverDialog
        open={resolverState.open}
        intent={resolverState.intent}
        context={resolverState.context}
        targets={resolverState.targets}
        onSelect={handleResolverSelect}
        onCancel={handleResolverCancel}
      />
    </BrokerProvider>
  );
};

export default AppWithBroker;
```

### Step 2: Initialize the Broker

```tsx
// apps/base/src/App.tsx or similar entry point

import React, { useEffect } from 'react';
import { useBroker } from '@fm/fdc3-broker';

const App: React.FC = () => {
  const { broker } = useBroker();

  useEffect(() => {
    // Broker auto-initializes on mount
    console.log('[Broker] initialized', broker.getInfo());
  }, [broker]);

  return (
    // Your existing app structure
    <YourExistingProviders>
      <YourExistingRoutes />
    </YourExistingProviders>
  );
};
```

### Step 3: Verify Broker is Running

Open browser console and check:

```javascript
// You should see:
[FDC3:INFO] Broker initialized
[FDC3:INFO] App Directory connected
[FDC3:INFO] User channels loaded: red, green, blue, ...
```

---

## 4. For Tile Developers

### Step 1: Get FDC3 Agent API

```tsx
// apps/mf_tile/src/components/MyTile.tsx

import React, { useEffect } from 'react';
import { getAgentApi } from '@fm/fdc3-agent';

const MyTile: React.FC = () => {
  const [fdc3, setFdc3] = useState<any>(null);

  useEffect(() => {
    // Get FDC3 agent API
    const api = getAgentApi();
    setFdc3(api);

    console.log('[Tile] FDC3 Agent loaded:', api);
  }, []);

  if (!fdc3) {
    return <div>Loading FDC3...</div>;
  }

  // ... rest of component
};
```

### Step 2: Send an Intent

```tsx
const handleViewChart = async () => {
  try {
    const context = {
      type: 'fdc3.instrument',
      id: {
        ticker: 'AAPL',
      },
      name: 'Apple Inc.',
    };

    // Raise intent to open a chart
    const resolution = await fdc3.raiseIntent('ViewChart', context);

    console.log('[Tile] Intent resolved by:', resolution.source);

    // Optionally get result from intent handler
    const result = await resolution.getResult();
    console.log('[Tile] Intent result:', result);
  } catch (error) {
    console.error('[Tile] Intent failed:', error);
  }
};

return <button onClick={handleViewChart}>View AAPL Chart</button>;
```

### Step 3: Listen for Intents

```tsx
import { useIntentListener } from '@fm/fdc3-agent';

const MyTile: React.FC = () => {
  // Listen for ViewChart intents
  useIntentListener('ViewChart', async (context) => {
    console.log('[Tile] Received ViewChart intent:', context);

    // Update your component state based on context
    if (context.type === 'fdc3.instrument') {
      const instrument = context as any;
      // Display instrument in your tile
      setCurrentInstrument(instrument);
    }

    // Optionally return a result
    return {
      type: 'fdc3.chart',
      status: 'displayed',
    };
  });

  // ... rest of component
};
```

### Step 4: Broadcast Context

```tsx
const handleInstrumentSelect = async (instrument: any) => {
  try {
    const context = {
      type: 'fdc3.instrument',
      id: {
        ticker: instrument.ticker,
      },
      name: instrument.name,
    };

    // Broadcast to currently joined channel
    await fdc3.broadcast(context);

    console.log('[Tile] Broadcasted instrument:', context);
  } catch (error) {
    console.error('[Tile] Broadcast failed:', error);
  }
};
```

### Step 5: Listen for Context

```tsx
import { useContextListener } from '@fm/fdc3-agent';

const MyTile: React.FC = () => {
  const [currentInstrument, setCurrentInstrument] = useState<any>(null);

  // Listen for instrument context
  useContextListener('fdc3.instrument', (context) => {
    console.log('[Tile] Received context:', context);

    // Only update if it's an instrument
    if (context.type === 'fdc3.instrument') {
      setCurrentInstrument(context);
    }
  });

  // ... rest of component
};
```

### Step 6: Join/Leave Channels

```tsx
import { useFDC3 } from '@fm/fdc3-agent';

const MyTile: React.FC = () => {
  const fdc3 = useFDC3();

  const joinChannel = async (channelId: string) => {
    try {
      await fdc3.joinUserChannel(channelId);
      console.log('[Tile] Joined channel:', channelId);
    } catch (error) {
      console.error('[Tile] Failed to join channel:', error);
    }
  };

  const leaveChannel = async () => {
    try {
      await fdc3.leaveCurrentChannel();
      console.log('[Tile] Left channel');
    } catch (error) {
      console.error('[Tile] Failed to leave channel:', error);
    }
  };

  return (
    <div>
      <button onClick={() => joinChannel('red')}>Join Red Channel</button>
      <button onClick={leaveChannel}>Leave Channel</button>
    </div>
  );
};
```

---

## 5. OpenFin Integration

The broker automatically detects OpenFin and enables bidirectional routing when available.

### Environment Detection

The broker automatically detects if it's running in OpenFin:

```typescript
// Automatic - no code needed
// Broker checks: typeof fin !== 'undefined' && fin?.desktop?.fdc3
```

### Bidirectional Intent Routing

#### Internal → Internal (Browser or OpenFin)

```tsx
// Target exists in MFE platform
await fdc3.raiseIntent('ViewChart', context);
// → Routes to internal MFE tile
```

#### Internal → External (OpenFin only)

```tsx
// Target NOT in MFE platform, but exists in OpenFin
await fdc3.raiseIntent('ViewOrder', context);
// → Broker delegates to fin.desktop.fdc3.raiseIntent()
// → External OpenFin app handles the intent
// → Result returned to MFE tile
```

#### External → Internal (OpenFin only)

```typescript
// External OpenFin app sends intent
fin.desktop.fdc3.raiseIntent('ViewChart', context);
// → Broker (subscribed to OpenFin) receives intent
// → Routes to internal MFE tile
// → Result returned to external app
```

### Channel Synchronization

When running in OpenFin, channel operations synchronize with external apps:

```tsx
// Join channel
await fdc3.joinUserChannel('red');
// → Joins internal channel
// → Calls fin.desktop.fdc3.joinUserChannel('red')
// → Tile now receives context from BOTH internal AND external apps on 'red'

// Broadcast context
await fdc3.broadcast({
  type: 'fdc3.instrument',
  id: { ticker: 'AAPL' },
});
// → Broadcasts to internal tiles on 'red'
// → Calls fin.desktop.fdc3.broadcast()
// → External OpenFin apps on 'red' also receive context
```

### Testing OpenFin Integration

```typescript
// Mock OpenFin for browser testing
global.fin = {
  desktop: {
    fdc3: {
      raiseIntent: jest.fn(),
      joinUserChannel: jest.fn(),
      broadcast: jest.fn(),
      addIntentListener: jest.fn(),
    },
  },
};

// Test external routing
describe('OpenFin Integration', () => {
  it('should route externally when no internal target', async () => {
    const fdc3 = getAgentApi();

    await fdc3.raiseIntent('ViewExternalApp', context);

    expect(fin.desktop.fdc3.raiseIntent).toHaveBeenCalledWith('ViewExternalApp', context);
  });
});
```

### Configuration

Enable/disable OpenFin bridge in broker config:

```typescript
const brokerConfig = {
  // ... other config

  // Auto-detects OpenFin (default: true)
  enableOpenFinBridge: true,

  // Or disable to force browser-only mode
  // enableOpenFinBridge: false,
};
```

---

## 6. Common Patterns

### Pattern 1: View Chart from Watchlist

```tsx
// Watchlist tile
const WatchlistItem: React.FC<{ instrument: any }> = ({ instrument }) => {
  const fdc3 = useFDC3();

  const viewChart = async () => {
    const context = {
      type: 'fdc3.instrument',
      id: { ticker: instrument.ticker },
      name: instrument.name,
    };

    await fdc3.raiseIntent('ViewChart', context);
  };

  return (
    <tr onClick={viewChart}>
      <td>{instrument.ticker}</td>
      <td>{instrument.name}</td>
    </tr>
  );
};

// Chart tile
const ChartTile: React.FC = () => {
  const [instrument, setInstrument] = useState<any>(null);

  useIntentListener('ViewChart', async (context) => {
    if (context.type === 'fdc3.instrument') {
      setInstrument(context);
    }
  });

  return <div>{instrument && <Chart ticker={instrument.id?.ticker} />}</div>;
};
```

### Pattern 2: Link Tiles with Channels

```tsx
// Multiple tiles linked on same channel
const LinkedTile: React.FC = () => {
  const fdc3 = useFDC3();

  // Join red channel on mount
  useEffect(() => {
    fdc3.joinUserChannel('red');
  }, [fdc3]);

  const handleItemClick = async (item: any) => {
    const context = {
      type: 'fdc3.instrument',
      id: { ticker: item.ticker },
    };

    // Broadcast to all tiles on red channel
    await fdc3.broadcast(context);
  };

  // Listen for context updates
  useContextListener('fdc3.instrument', (context) => {
    console.log('Received:', context);
    // Update tile display
  });

  return <YourTileUI />;
};
```

### Pattern 3: Send Intent with Result

```tsx
// Sending tile
const Sender: React.FC = () => {
  const fdc3 = useFDC3();

  const getOrderDetails = async () => {
    const context = {
      type: 'fdc3.instrument',
      id: { ticker: 'AAPL' },
    };

    const resolution = await fdc3.raiseIntent('ViewOrder', context);

    // Get result from intent handler
    const result = await resolution.getResult();

    console.log('Order details:', result);
  };

  return <button onClick={getOrderDetails}>Get Order</button>;
};

// Receiving tile
const Receiver: React.FC = () => {
  useIntentListener('ViewOrder', async (context) => {
    // Fetch order details
    const order = await fetchOrderDetails(context.id?.ticker);

    // Return result to sender
    return {
      type: 'fdc3.order',
      orderId: order.id,
      status: order.status,
      price: order.price,
    };
  });

  return <div>Order Tile</div>;
};
```

### Pattern 4: Handle Multiple Instances

```tsx
// If multiple instances of Chart tile are open,
// the resolver UI will appear
const Watchlist: React.FC = () => {
  const fdc3 = useFDC3();

  const viewChart = async (instrument: any) => {
    const context = {
      type: 'fdc3.instrument',
      id: { ticker: instrument.ticker },
    };

    // If multiple Chart tiles exist, resolver UI appears
    // If no target specified, user can select which instance
    await fdc3.raiseIntent('ViewChart', context);

    // To target specific instance:
    // await fdc3.raiseIntent('ViewChart', context, {
    //   appId: 'chart',
    //   instanceId: 'chart-instance-2',
    // });
  };

  return <YourWatchlistUI />;
};
```

---

## 7. Testing

### Testing with Mock Agent

```tsx
// MyTile.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { mockAgentApi } from '@fm/fdc3-agent';
import { MyTile } from './MyTile';

// Mock FDC3 agent
jest.mock('@fm/fdc3-agent');

describe('MyTile', () => {
  beforeEach(() => {
    // Setup mock agent
    mockAgentApi.mockReturnValue({
      raiseIntent: jest.fn().mockResolvedValue({
        source: { appId: 'chart', name: 'Chart' },
        getResult: jest.fn().mockResolvedValue({ status: 'ok' }),
      }),
      broadcast: jest.fn().mockResolvedValue(undefined),
      joinUserChannel: jest.fn().mockResolvedValue(undefined),
    });
  });

  it('should raise intent when button clicked', async () => {
    render(<MyTile />);

    const button = screen.getByText('View Chart');
    button.click();

    await waitFor(() => {
      expect(mockAgentApi().raiseIntent).toHaveBeenCalledWith(
        'ViewChart',
        expect.objectContaining({
          type: 'fdc3.instrument',
        }),
      );
    });
  });
});
```

### Testing Broker Configuration

```tsx
// BrokerConfig.test.tsx
import { renderHook } from '@testing-library/react';
import { useBroker } from '@fm/fdc3-broker';

describe('Broker Configuration', () => {
  it('should validate entitlements before opening tile', async () => {
    const mockValidate = jest.fn().mockResolvedValue(false);

    const { result } = renderHook(() =>
      useBroker({
        callbacks: {
          onValidateEntitlements: mockValidate,
        },
      }),
    );

    // Try to open tile without entitlement
    await expect(result.current.raiseIntent('ViewChart', context)).rejects.toThrow('Unauthorized');

    expect(mockValidate).toHaveBeenCalledWith('chart', 'open');
  });
});
```

---

## 8. Troubleshooting

### Issue: "FDC3 not available"

**Cause**: Broker not initialized in base MFE.

**Solution**:

1. Check that base MFE has `<BrokerProvider>` wrapping app
2. Check browser console for broker initialization logs
3. Verify `@fm/fdc3-broker` is installed in base MFE

```bash
cd apps/base
yarn info @fm/fdc3-broker
```

### Issue: "No apps found for intent"

**Cause**: No tiles registered for that intent in App Directory.

**Solution**:

1. Check App Directory has apps registered
2. Verify tiles declare intent handlers in manifest
3. Check user is entitled to access those apps

```javascript
// Check available apps
const apps = await fdc3.findIntentsByContext({
  type: 'fdc3.instrument',
});
console.log('Available apps:', apps);
```

### Issue: Intent resolver UI doesn't appear

**Cause**: Only one target available or callback not configured.

**Solution**:

1. Verify multiple target tiles are mounted
2. Check `onShowResolverUI` callback is configured in base MFE
3. Check browser console for resolver errors

### Issue: Context not received in tile

**Cause**: Not on same channel or context type mismatch.

**Solution**:

1. Verify tiles are on same channel:

```javascript
const channel = await fdc3.getCurrentChannel();
console.log('Current channel:', channel?.id);
```

2. Check context type filter:

```javascript
// Use null to receive all context types
addContextListener(null, (context) => {
  console.log('Received:', context);
});
```

### Issue: "Unauthorized to send intent"

**Cause**: Entitlement validation failed.

**Solution**:

1. Check user is logged in
2. Verify tile has permission to send that intent type
3. Check `onValidateEntitlements` callback returns `true`

```javascript
// Test entitlements
const canSend = await entitlementService.check('my-tile', 'send-intent');
console.log('Can send intent:', canSend);
```

### Issue: "Intent not routing to external OpenFin app"

**Cause**: OpenFin bridge not enabled or unavailable.

**Solution**:

1. Check OpenFin is available: `typeof fin !== 'undefined'`
2. Verify `enableOpenFinBridge: true` in broker config
3. Check browser console for OpenFin initialization errors

```javascript
// Check OpenFin availability
if (typeof fin !== 'undefined' && fin?.desktop?.fdc3) {
  console.log('OpenFin FDC3 is available');
} else {
  console.log('Running in browser mode (no OpenFin)');
}
```

### Issue: "External intents not reaching MFE tiles"

**Cause**: Broker not subscribed to OpenFin intents or intent type not registered.

**Solution**:

1. Check broker logs for "Subscribed to OpenFin intents" message
2. Verify tile's intent handlers are registered in App Directory
3. Check that tile has called `addIntentListener()` for the intent type

```javascript
// In tile, ensure intent listener is registered
useEffect(() => {
  const setupListener = async () => {
    const fdc3 = getAgentApi();
    await fdc3.addIntentListener('ViewChart', (context) => {
      console.log('Received ViewChart:', context);
    });
  };

  setupListener();
}, []);
```

### Issue: "Channel not syncing with OpenFin apps"

**Cause**: OpenFin channel synchronization not working.

**Solution**:

1. Verify you've joined the channel (not just created it)
2. Check that OpenFin apps are also on the same channel
3. Ensure channel IDs match exactly (case-sensitive)

```javascript
// Correct: join channel (syncs with OpenFin)
await fdc3.joinUserChannel('red');

// Incorrect: create app channel (does NOT sync)
await fdc3.getOrCreateChannel('red'); // This won't sync!
```

---

## Next Steps

1. **Explore Examples**: Check `/apps/mf_tile` and `/apps/base` for working examples
2. **Read API Docs**: See TypeDoc-generated API documentation
3. **FDC3 Spec**: Review [FDC3 2.2 Specification](https://fdc3.finos.org/docs/api/spec)
4. **@finos/fdc3**: Browse [@finos/fdc3 npm package](https://www.npmjs.com/package/@finos/fdc3)
5. **Run Tests**: `yarn test` in each package directory
6. **Resolver UI**: Check `@fm/fdc3-resolver-ui` for customization options

---

## Support

For questions or issues:

1. Check this quickstart guide
2. Review data model documentation (`data-model.md`)
3. Check FDC3 official documentation
4. Review implementation plan (`plan.md`) for architecture details
5. Contact platform team

---

**Happy coding! 🚀**
