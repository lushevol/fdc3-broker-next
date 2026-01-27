# FDC3 Examples

This directory contains comprehensive examples demonstrating how to use the FDC3 packages in MFE tiles and the base MFE.

## Overview

These examples serve as the primary learning resources for developers using the FDC3 packages. Each example is production-ready, fully typed, and includes extensive documentation.

## Examples

### 1. ChartTile Example (`ChartTile.tsx`)

**Location**: `packages/fdc3-agent/examples/ChartTile.tsx`

**Purpose**: Demonstrates all common FDC3 operations that a tile would use in a realistic scenario.

**Features Demonstrated**:

- ✅ Send Intent: Button to raise ViewChart intent with instrument context
- ✅ Listen for Intent: useIntentListener to handle ViewChart requests
- ✅ Broadcast Context: Button to broadcast instrument context to all apps
- ✅ Listen for Context: useContextListener to receive instrument broadcasts
- ✅ Channel Management: Join user channels, display current channel
- ✅ Display State: Show current instrument, channel, listener status
- ✅ Error Handling: All FDC3 operations wrapped in try-catch
- ✅ Activity Logging: Real-time log of FDC3 operations

**Key Code Patterns**:

```tsx
import {
  useFDC3,
  useIntentListener,
  useContextListener,
  useCurrentChannel,
  useUserChannels,
} from '@fm/fdc3-agent';

function ChartTile() {
  const fdc3 = useFDC3();
  const currentChannel = useCurrentChannel();
  const userChannels = useUserChannels();

  // Listen for intents
  useIntentListener('ViewChart', (context) => {
    console.log('ViewChart received:', context);
  });

  // Listen for context broadcasts
  useContextListener('fdc3.instrument', (context) => {
    console.log('Instrument broadcast:', context);
  });

  // Raise intent
  const handleViewChart = async (instrument: Context) => {
    try {
      await fdc3.raiseIntent('ViewChart', instrument);
    } catch (error) {
      console.error('Intent failed:', error);
    }
  };

  // Broadcast context
  const handleBroadcast = async (instrument: Context) => {
    try {
      await fdc3.broadcast(instrument);
    } catch (error) {
      console.error('Broadcast failed:', error);
    }
  };
}
```

**Usage**:

```tsx
import { AgentProvider } from '@fm/fdc3-agent';
import { ChartTile } from '@fm/fdc3-agent/examples/ChartTile';

function App() {
  return (
    <AgentProvider>
      <ChartTile />
    </AgentProvider>
  );
}
```

**Best Practices Shown**:

- ✅ Use hooks for automatic listener cleanup
- ✅ Handle errors gracefully with try-catch
- ✅ Display informative status messages
- ✅ Type-safe operations with TypeScript
- ✅ Semantic HTML structure
- ✅ Clear visual hierarchy

---

### 2. FDC3 Integration Example (`FDC3Integration.tsx`)

**Location**: `apps/base/src/examples/FDC3Integration.tsx`

**Purpose**: Demonstrates complete FDC3 broker setup for the base MFE.

**Features Demonstrated**:

- ✅ BrokerProvider Setup: Complete configuration with all callbacks
- ✅ ResolverDialog Integration: How to wire up the resolver UI
- ✅ Error Boundary Usage: Wrapping with ErrorBoundary
- ✅ State Management: Managing resolver state
- ✅ App Directory Setup: Real vs mock app directory selection
- ✅ Complete Flow: From broker init to intent resolution

**Key Integration Steps**:

#### Step 1: Installation

```bash
yarn add @fm/fdc3-broker @fm/fdc3-resolver-ui @fm/fdc3-app-directory
```

#### Step 2: Wrap Your App

```tsx
import { FDC3Integration } from './examples/FDC3Integration';
import { AppDirectoryClient } from '@fm/fdc3-app-directory';

const appDirectoryClient = new AppDirectoryClient({
  baseUrl: 'https://your-app-directory.com',
  authToken: userToken,
});

function App() {
  return (
    <FDC3Integration
      useMockAppDirectory={process.env.NODE_ENV === 'development'}
      appDirectoryClient={appDirectoryClient}
      userAuthToken={userToken}
    >
      <YourAppComponents />
    </FDC3Integration>
  );
}
```

#### Step 3: Configure Callbacks

The example shows how to configure all broker callbacks:

```tsx
const brokerConfig: BrokerConfig = {
  appDirectory: {
    baseUrl: 'https://your-app-directory.com',
    authToken: userToken,
  },
  userChannelIds: ['red', 'green', 'blue'],
  enableDebug: true,
  callbacks: {
    onLoginStatusCheck: async () => {
      /* ... */
    },
    onTileOpen: async (tileId, context) => {
      /* ... */
    },
    onTileClose: async (tileId) => {
      /* ... */
    },
    onValidateEntitlements: async (tileId, action) => {
      /* ... */
    },
    onShowResolverUI: async (targets) => {
      /* ... */
    },
  },
};
```

**Integration Points**:

1. **Authentication**: Integrate `onLoginStatusCheck` with your auth system
2. **Routing**: Integrate `onTileOpen` and `onTileClose` with Single-SPA or your router
3. **Entitlements**: Integrate `onValidateEntitlements` with your permission system
4. **Resolver UI**: The resolver dialog is integrated via `onShowResolverUI` callback
5. **Audit Logging**: Use `onSecurityEvent` to log security-relevant events

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    Base MFE                              │
│  ┌─────────────────────────────────────────────────┐   │
│  │         FDC3Integration Component               │   │
│  │  - Initializes Broker                           │   │
│  │  - Configures callbacks                         │   │
│  │  - Integrates Resolver UI                       │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │         FDC3 Broker (fdc3-broker)              │   │
│  │  - Intent routing                              │   │
│  │  - Context broadcasting                        │   │
│  │  - Channel management                          │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                          ↑
                          │ Delegates to
                          │
┌─────────────────────────────────────────────────────────┐
│                    Tile MFEs                             │
│  ┌─────────────────────────────────────────────────┐   │
│  │         AgentProvider (fdc3-agent)              │   │
│  │  - Provides FDC3 API to components              │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │         ChartTile Example                       │   │
│  │  - useFDC3()                                    │   │
│  │  - useIntentListener()                          │   │
│  │  - useContextListener()                         │   │
│  │  - useCurrentChannel()                          │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## Running the Examples

### Prerequisites

1. Ensure all dependencies are installed:

   ```bash
   yarn install
   ```

2. Build the FDC3 packages:
   ```bash
   yarn workspace @fm/fdc3-agent build
   yarn workspace @fm/fdc3-broker build
   yarn workspace @fm/fdc3-resolver-ui build
   yarn workspace @fm/fdc3-app-directory build
   ```

### Run ChartTile Example

1. In your tile MFE, create a component that uses ChartTile:

   ```tsx
   import { AgentProvider } from '@fm/fdc3-agent';
   import { ChartTile } from '@fm/fdc3-agent/examples/ChartTile';

   export function App() {
     return (
       <AgentProvider>
         <ChartTile />
       </AgentProvider>
     );
   }
   ```

2. Start your tile MFE:
   ```bash
   cd apps/your-tile-mfe
   yarn dev
   ```

### Run FDC3Integration Example

1. Update your base MFE root component:

   ```tsx
   import { FDC3Integration } from './examples/FDC3Integration';

   export function App() {
     return (
       <FDC3Integration useMockAppDirectory={true}>
         <YourExistingContent />
       </FDC3Integration>
     );
   }
   ```

2. Start your base MFE:
   ```bash
   cd apps/base
   yarn dev
   ```

---

## Common Use Cases

### 1. Display a Chart When User Clicks Instrument

```tsx
function WatchlistTile() {
  const fdc3 = useFDC3();

  const handleInstrumentClick = async (instrument: Context) => {
    await fdc3.raiseIntent('ViewChart', instrument);
  };

  return (
    <ul>
      {instruments.map((inst) => (
        <li key={inst.id.ticker} onClick={() => handleInstrumentClick(inst)}>
          {inst.name}
        </li>
      ))}
    </ul>
  );
}

function ChartTile() {
  useIntentListener('ViewChart', (context) => {
    renderChart(context);
  });

  return <Chart />;
}
```

### 2. Sync Instrument Across Multiple Tiles

```tsx
// Any tile can broadcast to sync all others
function InstrumentSelector() {
  const fdc3 = useFDC3();

  const handleChange = async (ticker: string) => {
    await fdc3.broadcast({
      type: 'fdc3.instrument',
      id: { ticker },
    });
  };
}

// All tiles listening will automatically update
function AnyTile() {
  const [instrument, setInstrument] = useState(null);

  useContextListener('fdc3.instrument', (context) => {
    setInstrument(context);
  });
}
```

### 3. Context-Aware Communication with Channels

```tsx
function WorkspaceManager() {
  const channels = useUserChannels();
  const fdc3 = useFDC3();

  // Create separate workspaces by joining different channels
  const createWorkspace = async (channelId: string) => {
    await fdc3.joinChannel(channelId);
  };

  return (
    <div>
      <button onClick={() => createWorkspace('red')}>Red Workspace</button>
      <button onClick={() => createWorkspace('green')}>Green Workspace</button>
      <button onClick={() => createWorkspace('blue')}>Blue Workspace</button>
    </div>
  );
}
```

---

## Testing

### Testing ChartTile Component

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { AgentProvider } from '@fm/fdc3-agent';
import { ChartTile } from '@fm/fdc3-agent/examples/ChartTile';
import { setBroker } from '@fm/fdc3-agent';
import { Broker } from '@fm/fdc3-broker';

// Mock broker
const mockBroker = new Broker({
  appDirectory: { baseUrl: 'http://mock', useMock: true },
  callbacks: {},
});

setBroker(mockBroker);

test('broadcasts instrument on button click', async () => {
  render(
    <AgentProvider>
      <ChartTile />
    </AgentProvider>,
  );

  const broadcastButton = await screen.findByText(/Broadcast AAPL/i);
  fireEvent.click(broadcastButton);

  // Verify broadcast was called
  expect(await screen.findByText(/Broadcast: AAPL/)).toBeInTheDocument();
});
```

### Testing FDC3Integration Component

```tsx
import { render, screen } from '@testing-library/react';
import { FDC3Integration } from './examples/FDC3Integration';

test('initializes broker on mount', async () => {
  render(
    <FDC3Integration useMockAppDirectory={true}>
      <div>Child Content</div>
    </FDC3Integration>,
  );

  // Wait for broker to initialize
  expect(await screen.findByText(/FDC3 Ready/)).toBeInTheDocument();
});
```

---

## Troubleshooting

### Broker Not Initialized

**Problem**: `FDC3 Agent not initialized` error

**Solution**: Ensure `FDC3Integration` is mounted before any tiles use FDC3 hooks:

```tsx
// ❌ Wrong: Tiles try to use FDC3 before broker is ready
function App() {
  return (
    <>
      <TileUsingFDC3 /> {/* Will throw error */}
      <FDC3Integration />
    </>
  );
}

// ✅ Correct: Broker is initialized before tiles use it
function App() {
  return (
    <FDC3Integration>
      <TileUsingFDC3 /> {/* Works correctly */}
    </FDC3Integration>
  );
}
```

### Resolver Dialog Not Showing

**Problem**: Intent raised but resolver doesn't appear

**Solution**: Verify `onShowResolverUI` callback returns a Promise:

```tsx
callbacks: {
  onShowResolverUI: async (targets) => {
    return new Promise((resolve, reject) => {
      // Show resolver UI and call resolve(target) or reject(error)
      setResolverTargets(targets);
      setResolverOpen(true);
      setResolverResolve(() => resolve);
      setResolverReject(() => reject);
    });
  };
}
```

### Context Not Reaching Listeners

**Problem**: Broadcast sent but listeners don't receive

**Solution**: Ensure apps are on the same channel:

```tsx
// Check current channel
const channel = await fdc3.getCurrentChannel();
console.log('Current channel:', channel?.id);

// Join the same channel in all apps
await fdc3.joinChannel('red');
```

---

## Additional Resources

- [FDC3 Specification](https://fdc3.finos.org/docs/api/next/)
- [FDC3 Intents](https://fdc3.finos.org/docs/intents/overview/)
- [ChartTile.tsx](./ChartTile.tsx) - Full source code
- [FDC3Integration.tsx](../../../apps/base/src/examples/FDC3Integration.tsx) - Full source code

---

## Contributing

When adding new examples:

1. **Make it production-ready**: Include error handling, TypeScript types, and documentation
2. **Demonstrate best practices**: Use hooks, handle errors, display helpful status
3. **Add comments**: Explain complex logic and FDC3 operations
4. **Keep it focused**: Each example should demonstrate specific features
5. **Include tests**: Add unit tests for complex interactions

---

## License

These examples are part of the FDC3 MFE packages. See the main project LICENSE file for details.
