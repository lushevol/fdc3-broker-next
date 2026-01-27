# @fm/fdc3-agent

**FDC3 agent API for MFE tiles - Thin wrapper that delegates to the central FDC3 broker**

## Overview

`@fm/fdc3-agent` provides a lightweight agent API that tiles use to access FDC3 operations. The agent is a thin wrapper that delegates all calls to the central `@fm/fdc3-broker` running in the base MFE layer.

### Key Features

- **Thin Wrapper**: Minimal overhead, delegates all operations to the broker
- **React Hooks**: Easy integration with React components
- **Type-Safe**: Full TypeScript support with re-exported FDC3 types
- **No Dependencies**: Zero runtime dependencies (peer dependency on React)
- **FDC3 2.2 Compliant**: Implements the full DesktopAgent API

### Architecture

```
┌────────────────────────────────────────────┐
│          Tile MFE (Your Application)       │
│                                            │
│  ┌──────────────────────────────────────┐  │
│  │       @fm/fdc3-agent                 │  │
│  │  - getAgentApi()                     │  │
│  │  - React Hooks (useFDC3, etc.)      │  │
│  │  - Type re-exports                   │  │
│  └──────────────────────────────────────┘  │
│                ↓ PostMessage               │
└────────────────────────────────────────────┘
                    ↓
┌────────────────────────────────────────────┐
│          Base MFE (@fm/base)               │
│                                            │
│  ┌──────────────────────────────────────┐  │
│  │       @fm/fdc3-broker                │  │
│  │  - Intent Resolution                 │  │
│  │  - Channel Management                │  │
│  │  - Context Broadcasting              │  │
│  └──────────────────────────────────────┘  │
└────────────────────────────────────────────┘
```

## Installation

```bash
cd apps/mf_tile  # or any tile app
yarn add @fm/fdc3-agent
```

### Peer Dependencies

```json
{
  "react": "^18.0.0"
}
```

## Quick Start

### Using `getAgentApi()`

The simplest way to access FDC3 functionality:

```tsx
import { getAgentApi } from '@fm/fdc3-agent';

const MyTile = () => {
  const fdc3 = getAgentApi();

  const handleViewChart = async () => {
    const context = {
      type: 'fdc3.instrument',
      id: { ticker: 'AAPL' },
    };

    await fdc3.raiseIntent('ViewChart', context);
  };

  return <button onClick={handleViewChart}>View Chart</button>;
};
```

### Using React Hooks

For better React integration, use the provided hooks:

```tsx
import { useFDC3, useIntentListener, useContextListener } from '@fm/fdc3-agent';

const MyTile = () => {
  const fdc3 = useFDC3();

  // Listen for intents
  useIntentListener('ViewChart', async (context) => {
    console.log('Received ViewChart intent:', context);
  });

  // Listen for context broadcasts
  useContextListener('fdc3.instrument', (context) => {
    console.log('Received instrument context:', context);
  });

  const handleBroadcast = async () => {
    await fdc3.broadcast({
      type: 'fdc3.instrument',
      id: { ticker: 'AAPL' },
    });
  };

  return <button onClick={handleBroadcast}>Broadcast</button>;
};
```

## API Reference

### `getAgentApi()`

Returns a DesktopAgent instance that delegates to the broker.

```tsx
const fdc3 = getAgentApi();
// fdc3 implements DesktopAgent interface from @finos/fdc3
```

The returned object implements the full FDC3 2.2 DesktopAgent API:

- `open()` - Open an application
- `findInstances()` - Find application instances
- `getAppMetadata()` - Get application metadata
- `broadcast()` - Broadcast context
- `addContextListener()` - Listen for context
- `findIntent()` - Find intent handlers
- `findIntentsByContext()` - Find intents by context
- `raiseIntent()` - Raise an intent
- `raiseIntentForContext()` - Raise intent for context
- `addIntentListener()` - Listen for intents
- `getOrCreateChannel()` - Get or create channel
- `createPrivateChannel()` - Create private channel
- `getUserChannels()` - Get user channels
- `joinUserChannel()` - Join user channel
- `getCurrentChannel()` - Get current channel
- `leaveCurrentChannel()` - Leave current channel
- `addEventListener()` - Add event listener
- `getInfo()` - Get implementation info

### `useFDC3()`

React hook that returns the DesktopAgent instance. Equivalent to `getAgentApi()` but as a hook for better React integration.

```tsx
const fdc3 = useFDC3();
```

### `useIntentListener(intent, handler)`

React hook that automatically registers an intent listener and cleans up on unmount.

```tsx
useIntentListener('ViewChart', async (context) => {
  // Handle intent
  console.log('ViewChart received:', context);
});
```

**Parameters:**

- `intent` (string): The intent name to listen for
- `handler` (ContextHandler): Async function that handles the intent

**Returns:** `void`

### `useIntentListenerWithContext(intent, handler)`

React hook that listens for intents and provides context about the intent source.

```tsx
useIntentListenerWithContext('ViewChart', async (context, metadata) => {
  // Handle intent with metadata
  console.log('ViewChart from:', metadata.appId);
});
```

**Parameters:**

- `intent` (string): The intent name to listen for
- `handler` (ContextHandlerWithMetadata): Async function that handles the intent with metadata

**Returns:** `void`

### `useContextListener(contextType, handler)`

React hook that automatically registers a context listener and cleans up on unmount.

```tsx
useContextListener('fdc3.instrument', (context) => {
  // Handle context broadcast
  console.log('Instrument context:', context);
});
```

**Parameters:**

- `contextType` (string | null): The context type to listen for, or `null` for all contexts
- `handler` (ContextHandler): Function that handles the context

**Returns:** `void`

### `useCurrentChannel()`

React hook that returns the current channel the tile has joined.

```tsx
const channel = useCurrentChannel();

if (channel) {
  console.log('Current channel:', channel.id);
}
```

**Returns:** `Channel | null`

### `useUserChannels()`

React hook that returns all available user channels.

```tsx
const channels = useUserChannels();

channels.forEach((channel) => {
  console.log('Channel:', channel.id, channel.displayMetadata?.name);
});
```

**Returns:** `Channel[]`

## Common Patterns

### Pattern 1: Send Intent

```tsx
import { getAgentApi } from '@fm/fdc3-agent';

const InstrumentTile = () => {
  const fdc3 = getAgentApi();

  const sendToChart = async () => {
    const context = {
      type: 'fdc3.instrument',
      id: { ticker: 'AAPL', exchange: 'NYSE' },
    };

    // Let broker find the best target
    const resolution = await fdc3.raiseIntent('ViewChart', context);

    console.log('Intent delivered to:', resolution.source);
  };

  return <button onClick={sendToChart}>View Chart</button>;
};
```

### Pattern 2: Send Intent to Specific App

```tsx
import { getAgentApi } from '@fm/fdc3-agent';

const InstrumentTile = () => {
  const fdc3 = getAgentApi();

  const sendToSpecificChart = async () => {
    const context = {
      type: 'fdc3.instrument',
      id: { ticker: 'AAPL' },
    };

    // Send to specific app instance
    const resolution = await fdc3.raiseIntent('ViewChart', context, {
      appId: 'advanced-chart',
      instanceId: 'chart-1',
    });
  };

  return <button onClick={sendToSpecificChart}>Send to Chart 1</button>;
};
```

### Pattern 3: Listen for Intents

```tsx
import { useIntentListener } from '@fm/fdc3-agent';

const ChartTile = () => {
  // Register intent listener
  useIntentListener('ViewChart', async (context) => {
    console.log('Received chart request for:', context);

    // Update component state
    setChartData(context);
  });

  const [chartData, setChartData] = useState(null);

  return <div>{chartData && <h1>Chart: {chartData.id.ticker}</h1>}</div>;
};
```

### Pattern 4: Join Channel and Broadcast

```tsx
import { getAgentApi } from '@fm/fdc3-agent';
import { useEffect, useState } from 'react';

const NewsTile = () => {
  const fdc3 = getAgentApi();
  const [channel, setChannel] = useState(null);

  useEffect(() => {
    // Join a channel on mount
    const joinChannel = async () => {
      await fdc3.joinUserChannel('red');
      const currentChannel = await fdc3.getCurrentChannel();
      setChannel(currentChannel);
    };

    joinChannel();
  }, [fdc3]);

  const broadcastNews = async () => {
    const context = {
      type: 'fdc3.news',
      id: { newsId: '12345' },
      headline: 'Market Update',
    };

    await fdc3.broadcast(context);
  };

  return (
    <div>
      <p>Current channel: {channel?.id || 'none'}</p>
      <button onClick={broadcastNews}>Broadcast News</button>
    </div>
  );
};
```

### Pattern 5: Listen for Context Broadcasts

```tsx
import { useContextListener, useState } from '@fm/fdc3-agent';

const InstrumentTile = () => {
  const [instrument, setInstrument] = useState(null);

  // Listen for instrument context broadcasts
  useContextListener('fdc3.instrument', (context) => {
    console.log('Instrument context received:', context);
    setInstrument(context);
  });

  return <div>{instrument && <h1>Instrument: {instrument.id.ticker}</h1>}</div>;
};
```

### Pattern 6: Private Channel for Secure Communication

```tsx
import { getAgentApi } from '@fm/fdc3-agent';
import { useState } from 'react';

const PortfolioTile = () => {
  const fdc3 = getAgentApi();
  const [privateChannel, setPrivateChannel] = useState(null);

  const createPrivateChannel = async () => {
    const channel = await fdc3.createPrivateChannel();

    // Grant access to specific tiles
    if ('grantAccess' in channel) {
      channel.grantAccess('analysis-tile');
      channel.grantAccess('risk-tile');
    }

    setPrivateChannel(channel);

    // Listen for responses on the private channel
    await channel.addContextListener('fdc3.portfolio', (context) => {
      console.log('Portfolio response:', context);
    });
  };

  const sharePortfolio = async () => {
    if (!privateChannel) return;

    await privateChannel.broadcast({
      type: 'fdc3.portfolio',
      id: { portfolioId: 'PORT-123' },
      positions: [],
    });
  };

  return (
    <div>
      <button onClick={createPrivateChannel}>Create Channel</button>
      <button onClick={sharePortfolio}>Share Portfolio</button>
    </div>
  );
};
```

### Pattern 7: Channel Lifecycle Management

```tsx
import { getAgentApi } from '@fm/fdc3-agent';
import { useEffect, useState } from 'react';

const InstrumentTile = () => {
  const fdc3 = getAgentApi();
  const [currentChannel, setCurrentChannel] = useState(null);

  useEffect(() => {
    let listener;

    const setup = async () => {
      // Join channel
      await fdc3.joinUserChannel('red');

      // Get current channel
      const channel = await fdc3.getCurrentChannel();
      setCurrentChannel(channel);

      // Add context listener
      listener = await fdc3.addContextListener('fdc3.instrument', (context) => {
        console.log('Context received:', context);
      });
    };

    setup();

    // Cleanup: leave channel and remove listener
    return () => {
      if (listener) {
        listener.unsubscribe();
      }
      fdc3.leaveCurrentChannel();
    };
  }, [fdc3]);

  return <div>Current channel: {currentChannel?.id || 'none'}</div>;
};
```

## TypeScript Support

All types from `@finos/fdc3` are re-exported for convenience:

```tsx
import type {
  Context,
  AppIdentifier,
  AppMetadata,
  Intent,
  IntentResolution,
  Channel,
  Listener,
  ImplementationMetadata,
  DisplayMetadata,
} from '@fm/fdc3-agent';

// Use in your components
const handleContext = (context: Context) => {
  console.log('Context type:', context.type);
};

const handleApp = (app: AppIdentifier) => {
  console.log('App ID:', app.appId);
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

// Mock the broker window.fdc3 object
window.fdc3 = {
  raiseIntent: vi.fn(),
  broadcast: vi.fn(),
  // ... other DesktopAgent methods
};
```

### Example Test

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { getAgentApi } from '@fm/fdc3-agent';

describe('FDC3 Agent', () => {
  beforeEach(() => {
    // Mock window.fdc3
    (window as any).fdc3 = {
      raiseIntent: vi.fn().mockResolvedValue({
        source: { appId: 'test-app', instanceId: 'test-1' },
      }),
    };
  });

  it('should get agent API', () => {
    const fdc3 = getAgentApi();
    expect(fdc3).toBeDefined();
  });

  it('should raise intent', async () => {
    const fdc3 = getAgentApi();

    const context = {
      type: 'fdc3.instrument',
      id: { ticker: 'AAPL' },
    };

    await fdc3.raiseIntent('ViewChart', context);

    expect(window.fdc3.raiseIntent).toHaveBeenCalledWith('ViewChart', context);
  });
});
```

## Error Handling

### ErrorBoundary Component

The `ErrorBoundary` component catches JavaScript errors anywhere in the agent's child component tree, logs those errors, and displays a fallback UI instead of the crashed component tree.

#### Basic Usage

```tsx
import { ErrorBoundary, AgentProvider } from '@fm/fdc3-agent';

<ErrorBoundary
  onError={(error, errorInfo) => {
    console.error('Agent error:', error, errorInfo);
    // Send error to monitoring service
  }}
>
  <AgentProvider>
    <YourTileComponent />
  </AgentProvider>
</ErrorBoundary>;
```

#### Custom Fallback UI

```tsx
<ErrorBoundary
  fallback={
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>FDC3 Connection Error</h2>
      <p>Unable to connect to FDC3 broker. Please refresh the page.</p>
      <button onClick={() => window.location.reload()}>Refresh Page</button>
    </div>
  }
  recoverable={false}
>
  <AgentProvider>{children}</AgentProvider>
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

### Async Error Handling

The agent propagates errors from the broker. Handle errors appropriately:

```tsx
import { getAgentApi } from '@fm/fdc3-agent';

const MyTile = () => {
  const fdc3 = getAgentApi();

  const handleIntent = async () => {
    try {
      await fdc3.raiseIntent('ViewChart', {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      });
    } catch (error) {
      if (error.message.includes('No target found')) {
        console.error('No app can handle ViewChart');
        // Show user-friendly message
      } else if (error.message.includes('User cancelled')) {
        console.log('User cancelled the intent');
        // Handle cancellation
      } else {
        console.error('Unexpected error:', error);
        // Handle other errors
      }
    }
  };

  return <button onClick={handleIntent}>View Chart</button>;
};
```

## Common Issues

### Issue: `window.fdc3 is undefined`

**Problem**: The broker hasn't been initialized in the base MFE, or the tile is running standalone.

**Solution**: Ensure the broker is initialized in the base MFE and the tile is running in the MFE environment.

### Issue: Intent not delivered

**Problem**: No target app is registered or running.

**Solution**: Verify that:

1. The target tile has registered the intent listener with `addIntentListener()`
2. The target tile is mounted and running
3. The intent name matches exactly (case-sensitive)

### Issue: Context listener not receiving broadcasts

**Problem**: Tile hasn't joined a channel.

**Solution**: Call `await fdc3.joinUserChannel(channelId)` before adding context listeners.

## Best Practices

### 1. Use React Hooks for Automatic Cleanup

```tsx
// ✅ Good - automatic cleanup
useIntentListener('ViewChart', handleIntent);

// ❌ Avoid - manual cleanup required
useEffect(() => {
  const listener = await fdc3.addIntentListener('ViewChart', handleIntent);
  return () => listener.unsubscribe();
}, []);
```

### 2. Join Channels Early

```tsx
// ✅ Good - join channel on component mount
useEffect(() => {
  fdc3.joinUserChannel('red');
}, []);
```

### 3. Handle Errors Gracefully

```tsx
// ✅ Good - proper error handling
try {
  await fdc3.raiseIntent('ViewChart', context);
} catch (error) {
  // Handle specific errors
  if (error.message.includes('No target')) {
    // Show user-friendly message
  }
}
```

### 4. Use Type Guards

```tsx
// ✅ Good - type-safe context handling
const isInstrument = (context: Context): context is InstrumentContext => {
  return context.type === 'fdc3.instrument';
};

useContextListener('fdc3.instrument', (context) => {
  if (isInstrument(context)) {
    // TypeScript knows this is InstrumentContext
    console.log(context.id.ticker);
  }
});
```

## License

MIT

## Related Packages

- [`@fm/fdc3-broker`](../fdc3-broker) - Central FDC3 broker
- [`@fm/fdc3-app-directory`](../fdc3-app-directory) - App Directory client
- [`@fm/fdc3-resolver-ui`](../fdc3-resolver-ui) - Resolver UI component
- [`@finos/fdc3`](https://www.npmjs.com/package/@finos/fdc3) - Official FDC3 standard
