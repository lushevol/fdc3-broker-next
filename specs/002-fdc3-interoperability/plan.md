# Implementation Plan: FDC3 Interoperability for MFE Platform

**Branch**: `002-fdc3-interoperability` | **Date**: 2025-12-27 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-fdc3-interoperability/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Create **four** npm packages to implement FDC3 2.2-compliant interoperability for the MFE platform:

1. **@fm/fdc3-broker** - Core FDC3 DesktopAgent implementation running in base MFE with dependency injection for custom logic (login hooks, tile management, entitlement validation). Uses **@finos/fdc3@2.2.x** for strict FDC3 2.2 API type definitions.
2. **@fm/fdc3-agent** - Thin agent API wrapper for tiles to access FDC3 operations via `getAgentApi()`.
3. **@fm/fdc3-app-directory** - App Directory client with mock service for development and real REST API integration for production.
4. **@fm/fdc3-resolver-ui** - Resolver UI component (React + MUI) for intent resolution when multiple target applications are available. Supports keyboard navigation, accessibility (WCAG 2.1 AA), and multi-instance handling.

The implementation uses **tsup** for building, **Vitest** for testing, and **Changesets** for versioning, with a multi-layer dependency injection pattern (Context + Factory + Callback Registry) to integrate with existing base MFE hooks while maintaining testability and cross-MFE compatibility.

**OpenFin Integration**: The broker supports bidirectional intent routing:

- **Browser (Edge)**: Internal intents only (within MFE platform)
- **OpenFin Environment**:
  - Internal → Internal: Same as browser
  - Internal → External: Broker routes intents to external OpenFin apps via OpenFin FDC3 API
  - External → Internal: Broker subscribes to OpenFin FDC3 API and routes incoming intents to internal MFE tiles

## Technical Context

**Language/Version**: TypeScript 5.x with strict mode enabled
**Primary Dependencies**:

- Build: tsup 8.x (esbuild-based bundler for libraries)
- Testing: Vitest 3.x + React Testing Library
- React: 19.x (peer dependency)
- FDC3 Types: **@finos/fdc3@2.2.x** (strict dependency for type definitions - no functions, only types)
- UI: MUI 5.x (for Resolver UI components)
- Versioning: Changesets
- Existing: Single-SPA, Module Federation, yarn workspaces
- OpenFin: @openfin/core (optional peer dependency for OpenFin environment)

**Storage**:

- localStorage/sessionStorage for intent queue persistence
- In-memory Map for runtime tile registry and channel management
- External REST service for App Directory (to be implemented by user as Java Spring)

**Testing**:

- Unit tests: Vitest with jsdom environment
- Component tests: React Testing Library
- Integration tests: Cross-package communication tests
- Contract tests: FDC3 API compliance

**Target Platform**:

- Browser: Edge (primary development target)
- OpenFin: Runtime environment with bidirectional FDC3 bridging

**Project Type**: Packages (monorepo npm packages)
**Performance Goals**:

- Intent resolution and delivery: <100ms (p95)
- Channel context broadcasts: <100ms (p95)
- Resolver UI rendering: <200ms
- Broker operations: No main thread blocking >16ms
- Bundle sizes: broker <200KB, agent <100KB, app-directory <50KB (all gzipped)

**Constraints**:

- Must use **@finos/fdc3@2.2.x types** exclusively (no custom FDC3 type definitions)
- Must work in both browser (Edge) and OpenFin environments
- Must support bidirectional intent routing in OpenFin (internal ↔ external)
- Must integrate with existing base MFE hooks without breaking changes
- Must support entitlement validation via injected callbacks
- Must handle tiles mounting/unmounting gracefully with intent queuing
- Must follow FDC3 2.2 specification for full compliance
- Resolver UI must be accessible (WCAG 2.1 AA) with full keyboard navigation

**Scale/Scope**:

- Support 10-20 concurrent tiles in a single session
- Support 8 standard user channels + unlimited app/private channels
- Support unlimited intent listeners per tile
- Support persistent intent queue across page refreshes (localStorage)
- Initial deployment: 3-5 tile types, expanding to 10+ over time

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

Review against `.specify/memory/constitution.md`:

- [x] **Code Quality**: TypeScript strict mode, ESLint passing, JSDoc on public APIs
  - All packages will use TypeScript strict mode with comprehensive type definitions
  - Don't use any as possible
  - Public APIs will have TSDoc comments for documentation generation
  - ESLint configured with TypeScript rules

- [x] **Testing Standards**: Unit test coverage >95%, integration tests for federation boundaries
  - Vitest for unit tests with >95% coverage threshold (both line coverage and condition coverage)
  - Integration tests for broker-app directory, broker-agent, and Module Federation boundaries
  - Contract tests using FDC3 conformance test suite

- [x] **UX Consistency**: Uses `@fm/base` components, error boundaries implemented, responsive design
  - Resolver UI will use `@fm/base` MUI components
  - Error boundaries wrap broker and agent providers
  - Error messages follow MFE platform conventions

- [x] **Performance**: Bundle size <500KB, lazy loading configured, singleton sharing enabled
  - broker: <200KB gzipped (core logic only)
  - agent: <100KB gzipped (thin wrapper)
  - app-directory: <50KB gzipped (client + types)
  - Lazy loading: Resolver UI loaded on-demand
  - Module Federation singleton config for React/ReactDOM

- [x] **Observability**: Structured logging, error tracking, version metadata exposed
  - Structured logger with debug/info/warn/error levels
  - Performance tracking for intent resolution and channel operations
  - Version metadata in `getInfo()` API
  - Security event logging for entitlement violations

**Complexity Justification** (required if any gates have violations):

| Violation | Why Needed                                   | Simpler Alternative Rejected Because |
| --------- | -------------------------------------------- | ------------------------------------ |
| N/A       | All requirements meet constitution standards | N/A                                  |

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
packages/                    # NEW: Shared npm packages for FDC3
├── fdc3-broker/             # Core FDC3 broker implementation
│   ├── src/
│   │   ├── broker.ts        # Main Broker class (DesktopAgent implementation)
│   │   ├── intent-resolver.ts    # Intent resolution logic (internal + external)
│   │   ├── channel-manager.ts    # Channel management
│   │   ├── tile-registry.ts      # Runtime tile instance registry
│   │   ├── intent-queue.ts       # Intent queue for unmounted tiles
│   │   ├── entitlements.ts       # Entitlement validation
│   │   ├── logger.ts             # Structured logging
│   │   ├── openfin-bridge.ts     # OpenFin bidirectional bridge
│   │   └── index.ts              # Package exports
│   ├── test/
│   │   ├── unit/                 # Unit tests
│   │   ├── integration/          # Integration tests
│   │   └── setup.ts              # Test setup
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsup.config.ts
│   ├── vitest.config.ts
│   └── README.md
├── fdc3-agent/              # FDC3 agent for tiles
│   ├── src/
│   │   ├── agent.ts          # AgentAPI implementation
│   │   ├── hooks.ts          # React hooks (useFDC3, useIntentListener, etc.)
│   │   └── index.ts          # Package exports
│   ├── test/
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsup.config.ts
│   ├── vitest.config.ts
│   └── README.md
├── fdc3-app-directory/      # App Directory client
│   ├── src/
│   │   ├── client.ts         # AppDirectoryClient implementation
│   │   ├── mock-service.ts   # Development mock service
│   │   ├── types.ts          # App definition types
│   │   └── index.ts          # Package exports
│   ├── test/
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsup.config.ts
│   ├── vitest.config.ts
│   └── README.md
└── fdc3-resolver-ui/        # Resolver UI component (NEW!)
    ├── src/
    │   ├── ResolverDialog.tsx    # Main resolver dialog component
    │   ├── AppCard.tsx           # App selection card component
    │   ├── ContextPreview.tsx    # Context data preview component
    │   ├── useResolverKeyboard.ts # Keyboard navigation hook
    │   └── index.ts              # Package exports
    ├── test/
    │   ├── accessibility.test.tsx # Accessibility tests
    │   └── integration.test.tsx   # Integration tests with broker
    ├── package.json
    ├── tsconfig.json
    ├── tsup.config.ts
    ├── vitest.config.ts
    └── README.md

apps/base/                  # EXISTING: Base MFE (enhanced with broker)
├── src/
│   ├── hooks/
│   │   ├── broker/          # NEW: Broker integration
│   │   │   ├── BrokerProvider.tsx
│   │   │   ├── useBroker.ts
│   │   │   └── config.ts
│   │   └── [existing hooks]
│   └── root.tsx             # UPDATED: Export broker types

apps/mf_tile/               # EXISTING: Tile MFE (enhanced with agent)
├── src/
│   ├── components/
│   │   └── [existing components enhanced with FDC3]
│   └── root.tsx             # UPDATED: Import @fm/fdc3-agent

specs/002-fdc3-interoperability/    # THIS FEATURE SPEC
├── spec.md                  # Feature specification
├── plan.md                  # This file (implementation plan)
├── research.md              # Phase 0: Research findings
├── data-model.md            # Phase 1: Data model and types
├── quickstart.md            # Phase 1: Developer quickstart guide
├── contracts/               # Phase 1: API contracts
│   └── app-directory-api.yaml
└── tasks.md                 # Phase 2: Implementation tasks (NOT created yet)
```

**Structure Decision**: **Four** npm packages in `packages/` directory following monorepo best practices:

1. **@fm/fdc3-broker** - Core broker with OpenFin bridge for bidirectional intent routing
2. **@fm/fdc3-agent** - Thin wrapper for tiles
3. **@fm/fdc3-app-directory** - App Directory client
4. **@fm/fdc3-resolver-ui** - React + MUI resolver component with full accessibility

The broker integrates with existing base MFE hooks and services, while the agent provides a thin wrapper for tiles. The resolver UI is a separate package to allow lazy loading and independent versioning.

---

## OpenFin Bidirectional Intent Routing Architecture

### Environment Detection

The broker automatically detects the runtime environment:

```typescript
// packages/fdc3-broker/src/environment.ts
export function isOpenFinAvailable(): boolean {
  try {
    return typeof fin !== 'undefined' && fin?.desktop?.fdc3 !== undefined;
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

### Intent Routing Strategy

#### Browser Environment (Edge)

**Internal intents only** - All intents stay within the MFE platform:

```
┌────────────────────────────────────────────────┐
│              MFE Platform (Browser)            │
│                                                │
│  Tile A ──raiseIntent──> Broker ──resolve──>   │
│                                      ↓          │
│                                  Resolver UI   │
│                                      ↓          │
│  Tile B <────deliver intent───── Tile C        │
└────────────────────────────────────────────────┘
```

**Flow:**

1. Tile calls `raiseIntent('ViewChart', context)`
2. Broker queries App Directory for internal tiles
3. If multiple targets, show Resolver UI
4. Broker delivers intent to selected tile
5. Result (if any) returned to sender

#### OpenFin Environment

**Bidirectional routing** - Intents can flow internally and externally:

```
┌─────────────────────────────────────────────────────────────┐
│                    OpenFin Desktop Environment              │
│                                                             │
│  ┌──────────────────┐              ┌──────────────────┐    │
│  │   MFE Platform   │              │  External App 1  │    │
│  │                  │              │  (Java/原生/.NET) │    │
│  │  Tile A ────────>│<────────────>│  OpenFin FDC3    │    │
│  │                  │  Broker      │                   │    │
│  │  Tile B <───────>│  Bridge ─────>│  API             │    │
│  │                  │              │                   │    │
│  └──────────────────┘              └──────────────────┘    │
│                                                             │
│                       Other External Apps                  │
└─────────────────────────────────────────────────────────────┘
```

**Flow 1: Internal → Internal (same as browser)**

1. Tile calls `raiseIntent('ViewChart', context)`
2. Broker checks if target exists in App Directory (internal)
3. If yes, route internally (same as browser flow)

**Flow 2: Internal → External**

1. Tile calls `raiseIntent('ViewChart', context)`
2. Broker checks App Directory - no internal target found
3. Broker delegates to OpenFin FDC3 API:
   ```typescript
   const openFin = fin.desktop.fdc3;
   await openFin.raiseIntent(intent, context, target);
   ```
4. External OpenFin app handles intent
5. Result returned to MFE tile via broker

**Flow 3: External → Internal**

1. External app calls OpenFin FDC3 API:
   ```typescript
   fin.desktop.fdc3.raiseIntent('ViewChart', context);
   ```
2. Broker (subscribed to OpenFin) receives intent
3. Broker queries App Directory for internal tiles
4. Broker routes to appropriate MFE tile
5. Result returned to external app via OpenFin

### OpenFin Bridge Implementation

```typescript
// packages/fdc3-broker/src/openfin-bridge.ts
import type { DesktopAgent, Intent, Context, AppIdentifier, IntentResolution } from '@finos/fdc3';

export class OpenFinBridge {
  private openFin: DesktopAgent;
  private internalBroker: DesktopAgent;

  constructor(internalBroker: DesktopAgent) {
    if (!isOpenFinAvailable()) {
      throw new Error('OpenFin is not available');
    }
    this.openFin = fin.desktop.fdc3;
    this.internalBroker = internalBroker;
  }

  /**
   * Subscribe to intents from external OpenFin apps
   */
  async subscribeToIntents(): Promise<void> {
    // Subscribe to intent types that internal tiles can handle
    const appDirectory = await this.getAppDirectory();
    const internalApps = await appDirectory.getAllApps();

    // Collect all intent types from internal apps
    const intentTypes = new Set<string>();
    for (const app of internalApps) {
      for (const listener of app.interop?.intents?.listensFor || []) {
        intentTypes.add(listener.intent);
      }
    }

    // Subscribe to each intent type
    for (const intent of intentTypes) {
      this.openFin.addIntentListener(intent, async (context: Context) => {
        // Route to internal broker
        return await this.internalBroker.raiseIntent(intent, context);
      });
    }
  }

  /**
   * Raise intent to external app via OpenFin
   */
  async raiseIntentExternal(
    intent: string,
    context: Context,
    target?: AppIdentifier,
  ): Promise<IntentResolution> {
    return await this.openFin.raiseIntent(intent, context, target);
  }

  /**
   * Join user channel in OpenFin (sync with external apps)
   */
  async joinUserChannel(channelId: string): Promise<void> {
    await this.openFin.joinUserChannel(channelId);
  }

  /**
   * Broadcast context to OpenFin channel
   */
  async broadcast(context: Context): Promise<void> {
    await this.openFin.broadcast(context);
  }

  /**
   * Get current channel from OpenFin
   */
  async getCurrentChannel(): Promise<Channel | null> {
    return await this.openFin.getCurrentChannel();
  }

  /**
   * Get user channels from OpenFin
   */
  async getUserChannels(): Promise<Channel[]> {
    return await this.openFin.getUserChannels();
  }

  /**
   * Subscribe to context broadcasts from external apps
   */
  async subscribeToContext(channelId: string, handler: (context: Context) => void): Promise<void> {
    const channel = await this.openFin.getOrCreateChannel(channelId);
    await channel.addContextListener(null, handler);
  }
}
```

### Broker Integration

```typescript
// packages/fdc3-broker/src/broker.ts
import type {
  DesktopAgent,
  Intent,
  Context,
  AppIdentifier,
  IntentResolution,
  Channel,
} from '@finos/fdc3';

export class Broker implements DesktopAgent {
  private openFinBridge?: OpenFinBridge;
  private internalResolver: InternalIntentResolver;
  private appDirectory: AppDirectoryClient;

  constructor(config: BrokerConfig) {
    this.appDirectory = config.appDirectory;
    this.internalResolver = new InternalIntentResolver(config);

    // Initialize OpenFin bridge if available
    if (isOpenFinAvailable()) {
      this.openFinBridge = new OpenFinBridge(this);

      // Subscribe to external intents
      this.openFinBridge.subscribeToIntents().catch((err) => {
        console.error('[Broker] Failed to subscribe to OpenFin intents:', err);
      });
    }
  }

  /**
   * Raise intent with automatic routing (internal or external)
   */
  async raiseIntent(
    intent: string,
    context: Context,
    target?: AppIdentifier,
  ): Promise<IntentResolution> {
    // Step 1: Check if target exists in internal App Directory
    const internalTargets = await this.appDirectory.findByIntent(intent);

    const hasInternalTarget = internalApps.some((app) => !target || app.appId === target.appId);

    // Step 2: Route internally if target found
    if (hasInternalTarget) {
      return await this.internalResolver.resolve(intent, context, target);
    }

    // Step 3: Route externally if OpenFin available and no internal target
    if (this.openFinBridge && !hasInternalTarget) {
      console.log(`[Broker] Routing intent externally: ${intent}`);
      return await this.openFinBridge.raiseIntentExternal(intent, context, target);
    }

    // Step 4: No target found (internal or external)
    throw new Error(`No target found for intent: ${intent}`);
  }

  /**
   * Join user channel (syncs with OpenFin if available)
   */
  async joinUserChannel(channelId: string): Promise<void> {
    // Join internal channel
    await this.internalResolver.joinChannel(channelId);

    // Sync with OpenFin
    if (this.openFinBridge) {
      await this.openFinBridge.joinUserChannel(channelId);
    }
  }

  /**
   * Broadcast context (to internal and OpenFin if on channel)
   */
  async broadcast(context: Context): Promise<void> {
    // Broadcast internally
    await this.internalResolver.broadcast(context);

    // Broadcast to OpenFin if on channel
    const currentChannel = await this.getCurrentChannel();
    if (this.openFinBridge && currentChannel) {
      await this.openFinBridge.broadcast(context);
    }
  }

  /**
   * Get user channels (internal + OpenFin)
   */
  async getUserChannels(): Promise<Channel[]> {
    const internalChannels = await this.internalResolver.getUserChannels();

    if (this.openFinBridge) {
      const openFinChannels = await this.openFinBridge.getUserChannels();
      // Merge and deduplicate by channel ID
      const allChannels = [...internalChannels];
      for (const openFinChannel of openFinChannels) {
        if (!allChannels.find((ch) => ch.id === openFinChannel.id)) {
          allChannels.push(openFinChannel);
        }
      }
      return allChannels;
    }

    return internalChannels;
  }

  // ... other DesktopAgent methods
}
```

### Channel Synchronization

When running in OpenFin, the broker synchronizes channel operations:

```typescript
// Join channel
await fdc3.joinUserChannel('red');
// → Joins internal channel
// → Calls fin.desktop.fdc3.joinUserChannel('red')
// → Tile now receives context from both internal and external apps on 'red'

// Broadcast context
await fdc3.broadcast({ type: 'fdc3.instrument', id: { ticker: 'AAPL' } });
// → Broadcasts to internal tiles on 'red'
// → Calls fin.desktop.fdc3.broadcast()
// → External OpenFin apps on 'red' also receive context
```

### Testing OpenFin Integration

```typescript
// Mock OpenFin for testing
global.fin = {
  desktop: {
    fdc3: {
      raiseIntent: jest.fn(),
      joinUserChannel: jest.fn(),
      broadcast: jest.fn(),
      addIntentListener: jest.fn(),
      // ... other methods
    },
  },
};

// Test bidirectional routing
describe('Broker OpenFin Integration', () => {
  it('should route externally when no internal target', async () => {
    const broker = new Broker(config);
    const intent = 'ViewOrder';
    const context = { type: 'fdc3.instrument', id: { ticker: 'AAPL' } };

    await broker.raiseIntent(intent, context);

    expect(fin.desktop.fdc3.raiseIntent).toHaveBeenCalledWith(intent, context);
  });

  it('should subscribe to external intents', async () => {
    const broker = new Broker(config);

    await broker.openFinBridge.subscribeToIntents();

    expect(fin.desktop.fdc3.addIntentListener).toHaveBeenCalled();
  });
});
```

---
