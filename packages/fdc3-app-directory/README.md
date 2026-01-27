# @fm/fdc3-app-directory

**App Directory client for discovering FDC3 applications with entitlement filtering**

## Overview

`@fm/fdc3-app-directory` provides a client for querying the App Directory service to discover available FDC3 applications. It filters results based on user entitlements and supports both production HTTP client and in-memory mock service for development.

### Key Features

- **HTTP Client**: Query real App Directory API with authentication
- **Mock Service**: In-memory implementation for development and testing
- **Entitlement Filtering**: Automatic filtering based on user permissions
- **Type-Safe**: Full TypeScript support with comprehensive type definitions
- **Flexible Querying**: Find apps by intent, context type, or category
- **Error Handling**: Robust timeout and error handling

### Architecture

```
┌─────────────────────────────────────────────────┐
│           Base MFE (@fm/base)                  │
│                                                │
│  ┌──────────────────────────────────────────┐  │
│  │      @fm/fdc3-broker                    │  │
│  │  - Uses AppDirectoryClient              │  │
│  │  - Queries available apps               │  │
│  │  - Resolves intents                     │  │
│  └──────────────┬───────────────────────────┘  │
│                 ↓                               │
│  ┌──────────────────────────────────────────┐  │
│  │  @fm/fdc3-app-directory                │  │
│  │  ┌────────────────────────────────────┐ │  │
│  │  │ AppDirectoryClientImpl             │ │  │
│  │  │ - HTTP requests to API            │ │  │
│  │  │ - Auth token management            │ │  │
│  │  │ - Timeout handling                 │ │  │
│  │  └────────────────────────────────────┘ │  │
│  │  ┌────────────────────────────────────┐ │  │
│  │  │ MockAppDirectoryService           │ │  │
│  │  │ - In-memory storage               │ │  │
│  │  │ - Same interface as real client   │ │  │
│  │  │ - Development & testing           │ │  │
│  │  └────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
                    ↓
        ┌───────────────────────┐
        │  App Directory API    │
        │  (External Service)   │
        └───────────────────────┘
```

## Installation

```bash
cd apps/base
yarn add @fm/fdc3-app-directory
```

### Peer Dependencies

None (zero runtime dependencies)

## Quick Start

### Using the Real Client (Production)

```tsx
import { AppDirectoryClientImpl } from '@fm/fdc3-app-directory';

const client = new AppDirectoryClientImpl({
  baseUrl: 'https://app-directory.example.com/api',
  authToken: localStorage.getItem('token'),
  timeout: 10000, // Optional: 10 second timeout
});

// Get all apps the user is entitled to
const allApps = await client.getAllApps();

// Find apps that handle a specific intent
const chartApps = await client.findByIntent('ViewChart');

// Get a specific app
const chartApp = await client.getApp('my-chart-app');

// Find apps by context type
const instrumentApps = await client.findByContextType('fdc3.instrument');

// Find apps by category
const analyticsApps = await client.findByCategory('Analytics');
```

### Using the Mock Service (Development)

```tsx
import { MockAppDirectoryService } from '@fm/fdc3-app-directory';

const mockService = new MockAppDirectoryService();

// Register apps for development/testing
mockService.registerApp({
  appId: 'my-chart-app',
  name: 'Advanced Chart',
  version: '1.0.0',
  title: 'Advanced Charting Tool',
  description: 'Professional charting with technical indicators',
  categories: ['Analytics', 'Charts'],
  icons: [
    {
      src: 'https://example.com/icons/chart.png',
      size: '64x64',
      type: 'image/png',
    },
  ],
  interop: {
    intents: {
      listensFor: [
        {
          intent: 'ViewChart',
          contexts: ['fdc3.instrument', 'fdc3.chart'],
        },
      ],
    },
  },
});

// Use the same interface as the real client
const apps = await mockService.findByIntent('ViewChart');
```

## API Reference

### `AppDirectoryClientImpl`

HTTP client for querying the App Directory API.

#### Constructor

```tsx
constructor(config: AppDirectoryConfig)
```

**Parameters:**

- `config.baseUrl` (string): Base URL of the App Directory API
- `config.authToken` (string?, optional): Authentication token for API requests
- `config.timeout` (number?, optional): Request timeout in milliseconds (default: 10000)

#### Methods

##### `getAllApps()`

Get all apps the user is entitled to access.

```tsx
const apps: Promise<AppDefinition[]> = client.getAllApps();
```

**Returns:** `Promise<AppDefinition[]>`

**API Endpoint:** `GET /v2/apps`

##### `getApp(appId)`

Get a specific app by ID.

```tsx
const app: Promise<AppDefinition | null> = client.getApp('my-chart-app');
```

**Parameters:**

- `appId` (string): Application identifier

**Returns:** `Promise<AppDefinition | null>` (returns `null` if not found)

**API Endpoint:** `GET /v2/apps/{appId}`

##### `findByIntent(intent)`

Find apps that can handle a specific intent.

```tsx
const apps: Promise<AppDefinition[]> = client.findByIntent('ViewChart');
```

**Parameters:**

- `intent` (string): Intent type (e.g., "ViewChart")

**Returns:** `Promise<AppDefinition[]>`

**API Endpoint:** `GET /v2/apps?intent={intent}`

##### `findByContextType(contextType)`

Find apps that can handle a specific context type.

```tsx
const apps: Promise<AppDefinition[]> = client.findByContextType('fdc3.instrument');
```

**Parameters:**

- `contextType` (string): Context type (e.g., "fdc3.instrument")

**Returns:** `Promise<AppDefinition[]>`

**API Endpoint:** `GET /v2/apps?contextType={contextType}`

##### `findByCategory(category)`

Find apps by category.

```tsx
const apps: Promise<AppDefinition[]> = client.findByCategory('Analytics');
```

**Parameters:**

- `category` (string): Category name

**Returns:** `Promise<AppDefinition[]>`

**API Endpoint:** `GET /v2/apps?category={category}`

### `MockAppDirectoryService`

In-memory App Directory implementation for development and testing. Implements the same interface as `AppDirectoryClientImpl`.

#### Constructor

```tsx
constructor();
```

No parameters required.

#### Methods

##### `registerApp(app)`

Register an app for development/testing.

```tsx
mockService.registerApp({
  appId: 'test-app',
  name: 'Test App',
  version: '1.0.0',
  interop: {
    intents: {
      listensFor: [
        {
          intent: 'ViewChart',
          contexts: ['fdc3.instrument'],
        },
      ],
    },
  },
});
```

**Parameters:**

- `app` (AppDefinition): App definition to register

**Returns:** `void`

##### `unregisterApp(appId)`

Unregister an app.

```tsx
mockService.unregisterApp('test-app');
```

**Parameters:**

- `appId` (string): App ID to unregister

**Returns:** `void`

##### `clear()`

Clear all registered apps.

```tsx
mockService.clear();
```

**Returns:** `void`

##### `getAllApps()`, `getApp()`, `findByIntent()`, `findByContextType()`, `findByCategory()`

Same signatures as `AppDirectoryClientImpl`.

## Type Definitions

### `AppDirectoryConfig`

```tsx
interface AppDirectoryConfig {
  baseUrl: string;
  authToken?: string;
  timeout?: number;
}
```

### `AppDefinition`

```tsx
interface AppDefinition {
  appId: string;
  name: string;
  version: string;
  title?: string;
  description?: string;
  icons?: Array<{
    src: string;
    size?: string;
    type?: string;
  }>;
  images?: Array<{
    src: string;
    size?: string;
  }>;
  categories?: string[];
  interop: {
    intents?: {
      listensFor?: Array<{
        intent: string;
        contexts?: string[];
        resultType?: string;
      }>;
      raises?: Array<{
        intent: string;
        contexts?: string[];
      }>;
    };
  };
  entitlementConstraints?: {
    requiredPermissions?: string[];
    userGroups?: string[];
    minAccessLevel?: string;
  };
}
```

## Usage Patterns

### Pattern 1: Integration with Broker

```tsx
import { AppDirectoryClientImpl } from '@fm/fdc3-app-directory';
import { Broker } from '@fm/fdc3-broker';

const appDirectory = new AppDirectoryClientImpl({
  baseUrl: process.env.APP_DIRECTORY_URL || 'https://app-directory.example.com/api',
  authToken: localStorage.getItem('token'),
  timeout: 10000,
});

const broker = new Broker({
  appDirectory,
  callbacks: {
    onLoginStatusCheck: async () => !!localStorage.getItem('token'),
    onTileOpen: async (tileId, context) => {
      // Open tile logic
    },
    onShowResolverUI: async (targets) => targets[0],
  },
  enableDebug: process.env.NODE_ENV === 'development',
  userChannelIds: ['red', 'green', 'blue'],
});
```

### Pattern 2: Development with Mock Service

```tsx
import { MockAppDirectoryService } from '@fm/fdc3-app-directory';

// Create mock service
const mockAppDirectory = new MockAppDirectoryService();

// Register test apps
mockAppDirectory.registerApp({
  appId: 'chart-app',
  name: 'Chart',
  version: '1.0.0',
  interop: {
    intents: {
      listensFor: [{ intent: 'ViewChart', contexts: ['fdc3.instrument'] }],
    },
  },
});

mockAppDirectory.registerApp({
  appId: 'news-app',
  name: 'News',
  version: '1.0.0',
  interop: {
    intents: {
      listensFor: [{ intent: 'ViewNews', contexts: ['fdc3.instrument'] }],
    },
  },
});

// Use with broker
const broker = new Broker({
  appDirectory: mockAppDirectory,
  callbacks: {
    /* ... */
  },
});
```

### Pattern 3: Environment-Based Selection

```tsx
import { AppDirectoryClientImpl, MockAppDirectoryService } from '@fm/fdc3-app-directory';

const appDirectory =
  process.env.NODE_ENV === 'development'
    ? new MockAppDirectoryService()
    : new AppDirectoryClientImpl({
        baseUrl: process.env.APP_DIRECTORY_URL!,
        authToken: localStorage.getItem('token') || undefined,
      });

// Register development apps if using mock
if (appDirectory instanceof MockAppDirectoryService) {
  appDirectory.registerApp({
    appId: 'dev-chart',
    name: 'Dev Chart',
    version: '1.0.0',
    interop: {
      intents: {
        listensFor: [{ intent: 'ViewChart', contexts: ['fdc3.instrument'] }],
      },
    },
  });
}
```

### Pattern 4: Querying by Multiple Criteria

```tsx
import { AppDirectoryClientImpl } from '@fm/fdc3-app-directory';

const client = new AppDirectoryClientImpl({
  baseUrl: 'https://app-directory.example.com/api',
  authToken: localStorage.getItem('token'),
});

// Get all charting apps
const chartApps = await client.findByIntent('ViewChart');

// Get all apps that handle instruments
const instrumentApps = await client.findByContextType('fdc3.instrument');

// Get all analytics apps
const analyticsApps = await client.findByCategory('Analytics');

// Combine results
const allRelevantApps = [...chartApps, ...instrumentApps, ...analyticsApps].filter(
  (app, index, self) => index === self.findIndex((a) => a.appId === app.appId),
); // Remove duplicates
```

### Pattern 5: Error Handling

```tsx
import { AppDirectoryClientImpl } from '@fm/fdc3-app-directory';

const client = new AppDirectoryClientImpl({
  baseUrl: 'https://app-directory.example.com/api',
  authToken: localStorage.getItem('token'),
  timeout: 5000,
});

try {
  const apps = await client.getAllApps();
  console.log(`Found ${apps.length} apps`);
} catch (error) {
  if (error.message.includes('timeout')) {
    console.error('App Directory request timed out');
  } else if (error.message.includes('401')) {
    console.error('Authentication failed');
  } else if (error.message.includes('404')) {
    console.error('App not found');
  } else {
    console.error('Unexpected error:', error);
  }
}
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

// No special setup needed for mock service
```

### Example Tests

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { MockAppDirectoryService } from '@fm/fdc3-app-directory';

describe('MockAppDirectoryService', () => {
  let mockService: MockAppDirectoryService;

  beforeEach(() => {
    mockService = new MockAppDirectoryService();
  });

  it('should register and retrieve apps', async () => {
    mockService.registerApp({
      appId: 'test-app',
      name: 'Test App',
      version: '1.0.0',
      interop: {
        intents: {
          listensFor: [{ intent: 'ViewChart', contexts: ['fdc3.instrument'] }],
        },
      },
    });

    const apps = await mockService.getAllApps();
    expect(apps).toHaveLength(1);
    expect(apps[0].appId).toBe('test-app');
  });

  it('should find apps by intent', async () => {
    mockService.registerApp({
      appId: 'chart-app',
      name: 'Chart',
      version: '1.0.0',
      interop: {
        intents: {
          listensFor: [{ intent: 'ViewChart', contexts: ['fdc3.instrument'] }],
        },
      },
    });

    mockService.registerApp({
      appId: 'news-app',
      name: 'News',
      version: '1.0.0',
      interop: {
        intents: {
          listensFor: [{ intent: 'ViewNews', contexts: ['fdc3.instrument'] }],
        },
      },
    });

    const chartApps = await mockService.findByIntent('ViewChart');
    expect(chartApps).toHaveLength(1);
    expect(chartApps[0].appId).toBe('chart-app');
  });

  it('should return null for non-existent app', async () => {
    const app = await mockService.getApp('non-existent');
    expect(app).toBeNull();
  });
});
```

## Error Handling

### Common Errors

#### Timeout Error

```tsx
try {
  const apps = await client.getAllApps();
} catch (error) {
  if (error.message.includes('timeout')) {
    // Handle timeout
    console.error('Request timed out after', client['timeout'], 'ms');
  }
}
```

#### Authentication Error

```tsx
try {
  const apps = await client.getAllApps();
} catch (error) {
  if (error.message.includes('401')) {
    // Handle auth error
    console.error('Invalid or expired auth token');
    // Redirect to login or refresh token
  }
}
```

#### Not Found Error

```tsx
const app = await client.getApp('non-existent-app');
if (app === null) {
  console.log('App not found');
  // Handle gracefully
}
```

## Best Practices

### 1. Always Handle Errors

```tsx
// ✅ Good - proper error handling
try {
  const apps = await client.getAllApps();
} catch (error) {
  console.error('Failed to fetch apps:', error);
  // Show user-friendly error message
}

// ❌ Bad - no error handling
const apps = await client.getAllApps();
```

### 2. Set Appropriate Timeouts

```tsx
// ✅ Good - explicit timeout
const client = new AppDirectoryClientImpl({
  baseUrl: 'https://app-directory.example.com/api',
  authToken: token,
  timeout: 10000, // 10 seconds
});

// ❌ Bad - uses default timeout
const client = new AppDirectoryClientImpl({
  baseUrl: 'https://app-directory.example.com/api',
  authToken: token,
});
```

### 3. Use Mock Service in Development

```tsx
// ✅ Good - environment-based selection
const appDirectory =
  process.env.NODE_ENV === 'development'
    ? new MockAppDirectoryService()
    : new AppDirectoryClientImpl({
        /* ... */
      });

// ❌ Bad - always uses real API
const appDirectory = new AppDirectoryClientImpl({
  /* ... */
});
```

### 4. Cache Results When Appropriate

```tsx
// ✅ Good - cache app directory results
let cachedApps: AppDefinition[] | null = null;

const getAllApps = async () => {
  if (cachedApps) return cachedApps;

  cachedApps = await client.getAllApps();
  return cachedApps;
};
```

## License

MIT

## Related Packages

- [`@fm/fdc3-broker`](../fdc3-broker) - FDC3 broker (uses this package)
- [`@fm/fdc3-agent`](../fdc3-agent) - FDC3 agent for tiles
- [`@fm/fdc3-resolver-ui`](../fdc3-resolver-ui) - Resolver UI component
- [`@finos/fdc3`](https://www.npmjs.com/package/@finos/fdc3) - Official FDC3 standard
