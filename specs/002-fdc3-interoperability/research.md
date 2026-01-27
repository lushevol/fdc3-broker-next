# Research: FDC3 Interoperability Implementation

**Date**: 2025-12-27
**Feature**: FDC3 Interoperability for MFE Platform
**Branch**: `002-fdc3-interoperability`

---

## Executive Summary

This document consolidates research findings for implementing FDC3 2.2-compliant npm packages in the MFE platform. The research covers the FDC3 2.2 specification, npm package architecture for monorepos, and dependency injection patterns for micro-frontend environments.

**Key Decision**: Create three npm packages using tsup for building, Vitest for testing, and dependency injection patterns for extensibility.

---

## 1. FDC3 2.2 Specification Analysis

### Decision: Implement Full FDC3 2.2 DesktopAgent API

**Rationale**: The FDC3 2.2 specification is the industry standard for financial desktop interoperability. Implementing the full API ensures compliance and future-proofs the platform.

**Required API Surface**:

#### DesktopAgent Interface (MUST Implement)

```typescript
interface DesktopAgent {
  // Application Management
  open(app: AppIdentifier, context?: Context): Promise<AppIdentifier>;
  findInstances(app: AppIdentifier): Promise<Array<AppIdentifier>>;
  getAppMetadata(app: AppIdentifier): Promise<AppMetadata>;

  // Context Operations
  broadcast(context: Context): Promise<void>;
  addContextListener(contextType: string | null, handler: ContextHandler): Promise<Listener>;

  // Intent Operations
  findIntent(intent: string, context?: Context, resultType?: string): Promise<AppIntent>;
  findIntentsByContext(context: Context, resultType?: string): Promise<Array<AppIntent>>;
  raiseIntent(intent: string, context: Context, app?: AppIdentifier): Promise<IntentResolution>;
  raiseIntentForContext(context: Context, app?: AppIdentifier): Promise<IntentResolution>;
  addIntentListener(intent: string, handler: IntentHandler): Promise<Listener>;

  // Channel Operations
  getOrCreateChannel(channelId: string): Promise<Channel>;
  createPrivateChannel(): Promise<PrivateChannel>;
  getUserChannels(): Promise<Array<Channel>>;

  // Event Handling
  addEventListener(type: FDC3EventTypes | null, handler: EventHandler): Promise<Listener>;

  // Implementation Info
  getInfo(): Promise<ImplementationMetadata>;

  // OPTIONAL (RECOMMENDED)
  joinUserChannel(channelId: string): Promise<void>;
  getCurrentChannel(): Promise<Channel | null>;
  leaveCurrentChannel(): Promise<void>;
}
```

#### Channel Interface

```typescript
interface Channel {
  id: string;
  type: 'user' | 'app' | 'private';
  displayMetadata?: DisplayMetadata;

  broadcast(context: Context): Promise<void>;
  getCurrentContext(contextType?: string): Promise<Context | null>;
  addContextListener(contextType: string | null, handler: ContextHandler): Promise<Listener>;
}
```

**Alternatives Considered**:

- Implement only subset of APIs → Rejected because non-compliant
- Wait for FDC3 2.3 → Rejected because 2.2 is current stable standard
- Use existing FDC3 library (@finos/fdc3) → Rejected because we need custom broker logic for MFE architecture

**Critical Requirements**:

1. Intent resolution with resolver UI when multiple targets available
2. Support for return values from intent handlers (Promise-based)
3. Three channel types: user (public), app (developer-created), private (intent-returned)
4. Context type validation against FDC3 standard types
5. Error handling with specific error types (ResolveError, ResultError, ChannelError)

---

## 2. Package Architecture for Monorepo

### Decision: Use tsup for Building + Vitest for Testing + Changesets for Versioning

**Rationale**: These tools are modern, fast, purpose-built for TypeScript packages, and work seamlessly with pnpm workspaces.

**Package Structure**:

```
packages/
├── fdc3-broker/          # Core broker running in base MFE
│   ├── src/
│   │   ├── broker.ts
│   │   ├── intent-resolver.ts
│   │   ├── channel-manager.ts
│   │   └── types.ts
│   ├── test/
│   └── package.json
├── fdc3-agent/           # Agent API for tiles
│   ├── src/
│   │   ├── agent.ts
│   │   ├── hooks.ts
│   │   └── types.ts
│   ├── test/
│   └── package.json
└── fdc3-app-directory/   # App directory client (with mock service)
    ├── src/
    │   ├── client.ts
    │   ├── mock-service.ts
    │   └── types.ts
    ├── test/
    └── package.json
```

**Build Tool: tsup**

```typescript
// tsup.config.ts
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'], // Dual format for compatibility
  dts: true, // Generate TypeScript declarations
  sourcemap: true,
  clean: true,
  target: 'es2020',
  external: ['react', 'react-dom', 'fdc3-2.1'], // Don't bundle peer deps
});
```

**Why tsup over alternatives**:

- Faster than webpack/rollup (powered by esbuild)
- Better TypeScript support than Vite for libraries
- Zero-config with sensible defaults
- Automatic declaration generation

**Alternatives Considered**:

- Webpack → Rejected because overkill for libraries, slower builds
- Rollup → Rejected because more configuration needed
- Vite → Rejected because optimized for apps, not libraries
- Rslib (already used) → Viable alternative, but tsup is simpler for pure packages

**Testing: Vitest + React Testing Library**

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
});
```

**Why Vitest**:

- Native ESM support (Jest struggles with ESM)
- Faster than Jest (no jest-transform)
- Jest-compatible API (easy migration)
- Built-in TypeScript support

**Dependencies Configuration**:

```json
{
  "peerDependencies": {
    "react": ">=16.9.0",
    "react-dom": ">=16.9.0",
    "fdc3-2.1": "npm:@finos/fdc3@2.1.x"
  },
  "peerDependenciesMeta": {
    "fdc3-2.1": {
      "optional": true
    }
  }
}
```

**Peer Dependencies Strategy**:

- React/ReactDOM as peer deps (consumers provide them)
- FDC3 as optional peer dep (broker works without global fdc3)
- Internal packages use `workspace:*` protocol

---

## 3. Dependency Injection Patterns

### Decision: Multi-Layer Injection (Context + Factory + Callback Registry)

**Rationale**: The broker needs to integrate with existing base MFE logic (login hooks, tile management, workspace management) while being testable and working across MFE boundaries.

**Three-Layer Injection Architecture**:

#### Layer 1: React Context for Configuration

```typescript
// BrokerContext.tsx
interface BrokerCallbacks {
  onLoginStatusCheck?: () => Promise<boolean>;
  onTileOpen?: (tileId: string, context: any) => Promise<void>;
  onTileClose?: (tileId: string) => Promise<void>;
  onValidateEntitlements?: (tileId: string, action: string) => Promise<boolean>;
  onWorkspaceCreated?: (workspaceId: string) => void;
}

interface BrokerConfig {
  callbacks: BrokerCallbacks;
  enableDebug?: boolean;
  appDirectoryUrl?: string;
}

const BrokerContext = createContext<BrokerConfig | null>(null);

export const BrokerProvider: React.FC<{
  children: ReactNode;
  config: Partial<BrokerConfig>;
}> = ({ children, config }) => {
  const mergedConfig: BrokerConfig = {
    callbacks: config.callbacks || {},
    enableDebug: config.enableDebug ?? false,
    appDirectoryUrl: config.appDirectoryUrl,
  };

  return (
    <BrokerContext.Provider value={mergedConfig}>
      {children}
    </BrokerContext.Provider>
  );
};
```

**Why Context First**: React Context is the idiomatic way to share configuration across component trees. It allows the base MFE to configure the broker once, and all tiles inherit the configuration.

#### Layer 2: Factory Pattern for Tile-Specific Customization

```typescript
// BrokerFactory.ts
export interface BrokerDependencies {
  loginValidator: () => Promise<boolean>;
  tileManager: {
    openTile: (id: string, context: any) => Promise<void>;
    closeTile: (id: string) => Promise<void>;
    listTiles: () => string[];
  };
  entitlementValidator: (tileId: string, action: string) => Promise<boolean>;
  eventLogger?: (event: string, data: any) => void;
}

export const createBroker = (deps: BrokerDependencies): BrokerAPI => {
  return {
    openTile: async (tileId: string, context?: any) => {
      const loggedIn = await deps.loginValidator();
      if (!loggedIn) {
        throw new Error('User not logged in');
      }

      const entitled = await deps.entitlementValidator(tileId, 'open');
      if (!entitled) {
        throw new Error('User not entitled to open this tile');
      }

      await deps.tileManager.openTile(tileId, context || {});

      if (deps.eventLogger) {
        deps.eventLogger('tile:opened', { tileId, context });
      }
    },
    // ... other methods
  };
};
```

**Why Factory Pattern**: Allows tiles to create broker instances with their own implementations while keeping the core broker logic testable. Factory can be called with mock dependencies in tests.

#### Layer 3: Cross-MFE Callback Registry

```typescript
// federation-utils.ts
class CrossMFERegistry {
  private callbacks = new Map<string, Function>();
  private callbackId = 0;

  register(callback: Function, sourceMFE: string): SerializedCallback {
    const id = `cb_${this.callbackId++}_${sourceMFE}`;
    this.callbacks.set(id, callback);
    return {
      __callbackId: id,
      __mfeSource: sourceMFE,
      __version: '1.0.0',
    };
  }

  get(serialized: SerializedCallback): Function | undefined {
    return this.callbacks.get(serialized.__callbackId);
  }

  cleanupMFE(sourceMFE: string): void {
    for (const [id] of this.callbacks.entries()) {
      if (id.includes(sourceMFE)) {
        this.callbacks.delete(id);
      }
    }
  }
}

export const crossMFERegistry = new CrossMFERegistry();
```

**Why Registry**: Module Federation breaks standard function serialization across boundaries. The registry ensures callbacks work correctly when passed between MFEs and cleans up when MFEs unmount.

**Alternatives Considered**:

- Single dependency injection container → Rejected because over-engineered for React
- Pure hook-based injection → Rejected because doesn't work across MFE boundaries
- Event-based communication → Rejected because less type-safe than callbacks

---

## 4. Integration with Existing Base MFE Architecture

### Decision: Enhance Existing HooksBase Pattern with Broker

**Rationale**: The base MFE already has a HooksBase pattern (`/apps/base/src/hooks/HooksBase.ts`) and provider pattern (`/apps/base/src/hooks/provider/`). Building on these patterns ensures consistency.

**Integration Strategy**:

```typescript
// apps/base/src/hooks/HooksBase.ts (enhanced)
export interface HooksBase {
  store: RootModel;
  setStore: (store: RootModel) => void;
  setBaseDispatch: (dispatch: Dispatch<IAction>) => void;

  // NEW: Broker integration
  broker?: BrokerAPI;
  setBroker?: (broker: BrokerAPI) => void;
}

export const hooksBase: HooksBase = {
  store: initialData,
  setStore(store: RootModel) {
    this.store = store;
  },
  setBaseDispatch(dispatch: Dispatch<IAction>) {
    this.baseDispatch = dispatch;
  },
  // NEW: Broker setter
  setBroker(broker: BrokerAPI) {
    this.broker = broker;
  },
};
```

**Provider Enhancement**:

```typescript
// apps/base/src/hooks/provider/index.tsx (enhanced)
import { BrokerProvider } from "../broker/BrokerProvider";

const Provider: React.FC<ProviderPropsDefault> = (props): ReactElement => {
  const [store, dispatch] = React.useReducer(reducers, {
    ...initialData,
    ...props.data,
  });

  // Broker configuration from existing hooks
  const brokerConfig = useMemo(() => ({
    callbacks: {
      onLoginStatusCheck: async () => {
        return !!store.token;  // Use existing auth state
      },
      onTileOpen: async (tileId: string, context: any) => {
        // Use existing workspace hooks
        const workspace = findWorkspaceByTile(/* ... */);
        if (!workspace) {
          await addWorkspace({ /* tile config */ });
        }
      },
      onValidateEntitlements: async (tileId: string, action: string) => {
        // Use existing service hooks
        const response = await getService(`/entitlements/check`);
        return response.data.allowed;
      },
    },
    enableDebug: process.env.FEDERATION_DEBUG === 'true',
  }), [store]);

  return (
    <BrokerProvider config={brokerConfig}>
      <AppContext.Provider value={[store, dispatch]}>
        {props.children}
      </AppContext.Provider>
    </BrokerProvider>
  );
};
```

**Why This Approach**:

- Reuses existing state management (store, dispatch)
- Reuses existing services (entitlement validation)
- Reuses existing workspace management hooks
- Minimal changes to existing base MFE code

---

## 5. App Directory Service Architecture

### Decision: Client-Server Architecture with Mock Service for Development

**Rationale**: The App Directory needs to be a centralized service that can be queried by the broker. For development, a mock service allows tiles to be registered locally. For production, a real Spring service will be implemented by the user.

**Package Structure**:

```
packages/fdc3-app-directory/
├── src/
│   ├── client.ts              # HTTP client for App Directory API
│   ├── types.ts               # TypeScript interfaces
│   ├── mock-service.ts        # Development mock server
│   └── index.ts
└── test/
    ├── client.test.ts
    └── mock-service.test.ts
```

**Client Interface**:

```typescript
// client.ts
export interface AppDirectoryClient {
  // Query all apps the user is entitled to
  getAllApps(): Promise<AppDefinition[]>;

  // Query by intent type
  findByIntent(intent: string): Promise<AppDefinition[]>;

  // Query by app ID
  getApp(appId: string): Promise<AppDefinition | null>;

  // Query by context type
  findByContextType(contextType: string): Promise<AppDefinition[]>;
}

export class AppDirectoryClientImpl implements AppDirectoryClient {
  constructor(
    private baseUrl: string,
    private authToken?: string,
  ) {}

  async getAllApps(): Promise<AppDefinition[]> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    const response = await fetch(`${this.baseUrl}/v2/apps`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`App Directory error: ${response.statusText}`);
    }

    return response.json();
  }

  // ... other methods
}
```

**Mock Service for Development**:

```typescript
// mock-service.ts
export class MockAppDirectoryService {
  private apps = new Map<string, AppDefinition>();

  // Register apps (for development/testing)
  registerApp(app: AppDefinition): void {
    this.apps.set(app.appId, app);
  }

  // Implement same interface as real client
  async getAllApps(): Promise<AppDefinition[]> {
    return Array.from(this.apps.values());
  }

  async findByIntent(intent: string): Promise<AppDefinition[]> {
    return Array.from(this.apps.values()).filter((app) =>
      app.interop?.intents.listensFor?.some((l) => l.intent === intent),
    );
  }

  // ... other methods
}

// Singleton instance
export const mockAppDirectory = new MockAppDirectoryService();
```

**App Definition Schema** (based on FDC3 App Directory spec):

```typescript
// types.ts
export interface AppDefinition {
  appId: string;
  name: string;
  version: string;
  title: string;
  description: string;
  icons?: Array<{ src: string; size: string; type: string }>;
  images?: Array<{ src: string; size: string }>;
  categories?: string[];
  interop: {
    intents: {
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
  };
}
```

**Why Client-Server**:

- Separates concerns (broker doesn't need to know about app storage)
- Allows production service to be Java Spring (as user requested)
- Mock service enables development without backend
- Easy to test with mock data

**Alternatives Considered**:

- Embedded app registry in broker → Rejected because doesn't scale, can't share across instances
- Local file-based registry → Rejected because can't handle dynamic entitlements
- Direct database access from broker → Rejected because couples broker to database schema

---

## 6. OpenFin Integration Strategy

### Decision: Conditional Bridge Pattern

**Rationale**: The broker must work in both browser and OpenFin environments. A conditional bridge detects the environment and delegates to OpenFin when available.

**Environment Detection**:

```typescript
// environment.ts
export function isOpenFinAvailable(): boolean {
  try {
    return typeof fin !== 'undefined' && fin?.DesktopAgent !== undefined;
  } catch {
    return false;
  }
}

export async function getRuntimeEnvironment(): Promise<'browser' | 'openfin'> {
  if (isOpenFinAvailable()) {
    return 'openfin';
  }
  return 'browser';
}
```

**OpenFin Bridge Implementation**:

```typescript
// openfin-bridge.ts
export class OpenFinBridge {
  private openFin: any;

  constructor() {
    if (!isOpenFinAvailable()) {
      throw new Error('OpenFin is not available');
    }
    this.openFin = fin;
  }

  async raiseIntent(
    intent: string,
    context: Context,
    target?: AppIdentifier,
  ): Promise<IntentResolution> {
    // Delegate to OpenFin's FDC3 implementation
    return await this.openFin.desktop.fdc3.raiseIntent(intent, context, target);
  }

  async joinChannel(channelId: string): Promise<void> {
    return await this.openFin.desktop.fdc3.joinUserChannel(channelId);
  }

  // ... other FDC3 methods
}
```

**Broker with Conditional Delegation**:

```typescript
// broker.ts
export class Broker {
  private openFinBridge?: OpenFinBridge;
  private internalResolver: InternalIntentResolver;

  constructor(config: BrokerConfig) {
    if (isOpenFinAvailable()) {
      this.openFinBridge = new OpenFinBridge();
    }
    this.internalResolver = new InternalIntentResolver(config);
  }

  async raiseIntent(
    intent: string,
    context: Context,
    target?: AppIdentifier,
  ): Promise<IntentResolution> {
    // If target is external app and OpenFin is available, delegate
    if (target?.instanceId && this.openFinBridge) {
      return await this.openFinBridge.raiseIntent(intent, context, target);
    }

    // Otherwise, resolve internally
    return await this.internalResolver.resolve(intent, context, target);
  }

  async joinUserChannel(channelId: string): Promise<void> {
    if (this.openFinBridge) {
      // Sync with OpenFin channel
      await this.openFinBridge.joinChannel(channelId);
    }
    // Join internal channel
    await this.internalResolver.joinChannel(channelId);
  }

  // ... other methods
}
```

**Why Conditional Bridge**:

- Gracefully degrades in browser (no OpenFin)
- Allows hybrid workflows (internal + external apps)
- Minimal overhead when OpenFin not available
- Easy to test both environments

**Alternatives Considered**:

- Always require OpenFin → Rejected because limits usability
- Separate implementations → Rejected because code duplication
- Adapter pattern for all environments → Rejected because over-engineered for two environments

---

## 7. Performance Considerations

### Decision: Async Intent Queue + Lazy Loading + Bundle Size Limits

**Rationale**: The broker must handle high-frequency intent operations without blocking the UI.

**Intent Queue for Unmounted Tiles**:

```typescript
// intent-queue.ts
export class IntentQueue {
  private queue = new Map<string, QueuedIntent[]>();

  // Queue intent for unmounted tile
  queueIntent(tileId: string, intent: QueuedIntent): void {
    if (!this.queue.has(tileId)) {
      this.queue.set(tileId, []);
    }
    this.queue.get(tileId)!.push(intent);
  }

  // Deliver queued intents when tile mounts
  async deliverQueued(tileId: string, handler: IntentHandler): Promise<void> {
    const queued = this.queue.get(tileId) || [];
    this.queue.delete(tileId);

    for (const intent of queued) {
      await handler(intent.context);
    }
  }

  // Persistent queue for unauthenticated users
  saveToPersistence(): void {
    const data = JSON.stringify(Array.from(this.queue.entries()));
    localStorage.setItem('fdc3-intent-queue', data);
  }

  loadFromPersistence(): void {
    const data = localStorage.getItem('fdc3-intent-queue');
    if (data) {
      this.queue = new Map(JSON.parse(data));
      localStorage.removeItem('fdc3-intent-queue');
    }
  }
}
```

**Bundle Size Targets**:

- `@fm/fdc3-broker`: <200KB gzipped (core logic)
- `@fm/fdc3-agent`: <100KB gzipped (thin wrapper)
- `@fm/fdc3-app-directory`: <50KB gzipped (client + types)

**Code Splitting Strategy**:

- Resolver UI: Lazy load only when needed
- OpenFin bridge: Separate chunk, loaded only in OpenFin
- Context validators: Load per type as needed

---

## 8. Testing Strategy

### Decision: Unit Tests + Integration Tests + Contract Tests

**Rationale**: Three-layer testing ensures correctness at unit, integration, and contract boundaries.

**Unit Tests (Vitest)**:

- Intent resolution logic
- Channel management
- Context validation
- Error handling

**Integration Tests**:

- Broker + App Directory client
- Broker + Resolver UI
- Cross-MFE callback execution
- OpenFin bridge (with mocked fin object)

**Contract Tests**:

- FDC3 API compliance (use official FDC3 test suite)
- App Directory API compliance
- Module Federation boundaries

**Test Example**:

```typescript
// broker.test.ts
describe('Broker', () => {
  it('should resolve intent to single target', async () => {
    const mockAppDir = createMockAppDirectory([{ appId: 'chart', intents: ['ViewChart'] }]);

    const broker = new Broker({ appDirectory: mockAppDir });
    const result = await broker.raiseIntent('ViewChart', {
      type: 'fdc3.instrument',
    });

    expect(result.source.appId).toBe('chart');
  });

  it('should queue intent for unmounted tile', async () => {
    const broker = new Broker({
      /* ... */
    });

    // Tile not mounted yet
    await broker.raiseIntent('ViewChart', context, { appId: 'chart' });

    // Verify intent queued
    expect(broker.getQueuedIntents('chart')).toHaveLength(1);

    // Mount tile and verify delivery
    await broker.mountTile('chart', handler);
    expect(broker.getQueuedIntents('chart')).toHaveLength(0);
  });
});
```

---

## 9. Observability and Debugging

### Decision: Structured Logging + Debug Mode + Performance Metrics

**Structured Logger**:

```typescript
// logger.ts
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export class Logger {
  private level: LogLevel;
  private enabled: boolean;

  constructor(enabled: boolean = false, level: LogLevel = LogLevel.INFO) {
    this.enabled = enabled;
    this.level = level;
  }

  debug(event: string, data: any): void {
    if (this.enabled && this.level <= LogLevel.DEBUG) {
      console.log(`[FDC3:DEBUG] ${event}`, data);
    }
  }

  info(event: string, data: any): void {
    if (this.enabled && this.level <= LogLevel.INFO) {
      console.info(`[FDC3:INFO] ${event}`, data);
    }
  }

  warn(event: string, data: any): void {
    if (this.enabled && this.level <= LogLevel.WARN) {
      console.warn(`[FDC3:WARN] ${event}`, data);
    }
  }

  error(event: string, error: Error, data?: any): void {
    if (this.enabled && this.level <= LogLevel.ERROR) {
      console.error(`[FDC3:ERROR] ${event}`, error, data);
    }
  }
}
```

**Performance Tracking**:

```typescript
// performance.ts
export class PerformanceTracker {
  private marks = new Map<string, number>();

  start(operation: string): void {
    this.marks.set(operation, performance.now());
  }

  end(operation: string): number {
    const start = this.marks.get(operation);
    if (!start) {
      return 0;
    }

    const duration = performance.now() - start;
    this.marks.delete(operation);

    // Log if operation took too long
    if (duration > 100) {
      console.warn(`[FDC3:Perf] ${operation} took ${duration.toFixed(2)}ms`);
    }

    return duration;
  }
}
```

---

## 10. Security and Entitlements

### Decision: Pre-Flight Validation + Audit Logging

**Entitlement Validator Interface**:

```typescript
// entitlements.ts
export interface EntitlementValidator {
  canSendIntent(fromTile: string, intent: string): Promise<boolean>;
  canReceiveIntent(toTile: string, intent: string): Promise<boolean>;
  canJoinChannel(tile: string, channel: string): Promise<boolean>;
  canOpenTile(tile: string): Promise<boolean>;
}
```

**Validation in Broker**:

```typescript
// broker.ts
async raiseIntent(
  intent: string,
  context: Context,
  target?: AppIdentifier
): Promise<IntentResolution> {
  // Validate sender entitlements
  const fromTile = this.getCurrentTileId();
  const canSend = await this.entitlements.canSendIntent(fromTile, intent);

  if (!canSend) {
    this.logger.error('Intent send denied', new Error('Unauthorized'), {
      fromTile,
      intent,
    });
    throw new Error(`Unauthorized to send intent: ${intent}`);
  }

  // Validate receiver entitlements
  if (target) {
    const canReceive = await this.entitlements.canReceiveIntent(
      target.appId,
      intent
    );

    if (!canReceive) {
      throw new Error(`Target not entitled to receive intent: ${intent}`);
    }
  }

  // ... proceed with intent resolution
}
```

---

## Summary of Key Decisions

| Area              | Decision                       | Rationale                                   |
| ----------------- | ------------------------------ | ------------------------------------------- |
| **FDC3 API**      | Implement full FDC3 2.2 spec   | Compliance, future-proofing                 |
| **Build Tool**    | tsup                           | Fast, zero-config, great TS support         |
| **Testing**       | Vitest + React Testing Library | Native ESM, fast, Jest-compatible           |
| **Versioning**    | Changesets                     | Designed for monorepos, semantic versioning |
| **Injection**     | Context + Factory + Registry   | Multi-layer for flexibility                 |
| **App Directory** | Client-server with mock        | Separation of concerns, testable            |
| **OpenFin**       | Conditional bridge             | Works in both browser and OpenFin           |
| **Logging**       | Structured + debug mode        | Debuggable production system                |
| **Security**      | Pre-flight validation          | Security-first approach                     |

---

## Next Steps (Phase 1)

1. **Generate data-model.md**: Define all TypeScript interfaces and types
2. **Generate contracts/**: Create API contracts for App Directory service
3. **Generate quickstart.md**: Write developer getting-started guide
4. **Update agent context**: Run update script to document new technologies

---

## Sources

- [FDC3 2.2 Specification](https://fdc3.finos.org/docs/api/spec)
- [FDC3 App Directory API](https://fdc3.finos.org/docs/app-directory/spec)
- [tsup Documentation](https://tsup.egoist.dev/)
- [Vitest Documentation](https://vitest.dev/)
- [Changesets Documentation](https://github.com/changesets/changesets)
- [pnpm Workspaces](https://pnpm.io/workspaces)
- [Module Federation Guide](https://module-federation.io/)
- [React Context Patterns](https://react.dev/reference/react/useContext)
