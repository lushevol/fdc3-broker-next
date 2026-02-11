## Context

The `OpenFinBridge` class in `packages/fdc3-broker/src/openfin-bridge.ts` enables bidirectional FDC3 communication between the MFE platform and OpenFin applications. Currently, intent subscription requires callers to manually pass a list of supported intent types via `subscribeToIntents()`.

For seamless interoperability, the bridge should automatically discover and subscribe to all intents that the current user is entitled to use, eliminating manual configuration.

## Goals / Non-Goals

**Goals:**

- Automatically subscribe to predefined global intents (e.g., `ViewChart`, `StartCall`)
- Dynamically discover all intents available to the current user from the appDirectory
- Combine global and entitlement-filtered intents into a unified subscription set
- All incoming OpenFin intents use `raiseIntent()` for delivery (no internal listener bypass)
- Queue intents received before login and process after successful login

**Non-Goals:**

- Changes to the appDirectory API or data model
- Adding new FDC3 standard intents
- Modifying intent resolution logic
- Supporting runtime intent discovery (only on initialization)

## Decisions

### 1. Global Intent Constants

Define a constant array of predefined global intents that the bridge always subscribes to:

```typescript
const GLOBAL_INTENTS = ['ViewChart', 'StartCall'] as const;
```

**Rationale:** Provides a fallback set of core FDC3 intents that are always available, regardless of what apps are installed.

### 2. AppDirectoryClient Integration

Inject `AppDirectoryClient` via constructor:

```typescript
constructor(appDirectoryClient?: AppDirectoryClient)
```

**Rationale:** Makes the dependency optional for testing and allows fallbacks (mock client in tests).

### 3. Intent Extraction Strategy

Extract unique intent names from entitled apps:

```typescript
const intents = new Set<string>(GLOBAL_INTENTS);
for (const app of await client.getAllApps()) {
  app.interop?.intents?.listensFor?.forEach((handler) => {
    intents.add(handler.intent);
  });
}
return Array.from(intents);
```

**Rationale:** Uses `Set` to deduplicate intents across multiple apps. The appDirectory already filters by user entitlements.

### 4. Initialization Method

Add `initializeIntents()` async method:

```typescript
async initializeIntents(): Promise<void>
```

**Rationale:** Async because appDirectory lookup is async. Called separately from constructor for proper error handling.

### 5. Intent Forwarding via raiseIntent (Always)

All incoming OpenFin intents always use `raiseIntent()` for delivery:

```typescript
private async handleOpenFinIntent(
  intent: string,
  context: Context,
  source?: AppIdentifier,
): Promise<void> {
  // Check if user is logged in
  const isLoggedIn = await this.checkLoginStatus();
  if (!isLoggedIn) {
    // Queue intent for after login
    this.intentQueue.enqueue(PRELOGIN_TILE_ID, intent, context, source || { appId: 'external' });
    return;
  }

  // Always use raiseIntent for delivery (finds apps, resolves, opens, delivers)
  await this.raiseIntent(intent, context, undefined, source);
}
```

**Rationale:** Consistent delivery - `raiseIntent()` handles all resolution and delivery logic.

### 6. Loop Prevention via Source Heuristic

OpenFinBridge detects if intent source is external:

```typescript
// In OpenFinBridge
isIntentFromExternalOpenFinSource(source?: AppIdentifier): boolean {
  // No source means external (e.g., pre-login queued intents)
  if (!source) return true;
  // 'external' is our placeholder for OpenFin source, internal sources have real appIds
  return source.appId !== 'external';
}

// In Broker.raiseIntent()
if (result.type === 'not-found' && this.openFinBridge?.isIntentFromExternalOpenFinSource(source)) {
  // Only route to OpenFin if source is NOT from OpenFin
  return await openFinBridge.raiseIntentExternal(intent, context, targetApp);
}
```

**Rationale:** Using source heuristic instead of flag is cleaner. External OpenFin sources have real appIds, while queued intents use `'external'` placeholder.

### 7. Pre-Login Intent Queue (USE existing intentQueue)

When user is not logged in, incoming OpenFin intents are queued using the **existing** `intentQueue` with a special key `'__prelogin__'`:

```typescript
private readonly PRELOGIN_TILE_ID = '__prelogin__';

// In constructor
if (config.onLogin) {
  config.onLogin(this.processQueuedIntentsAfterLogin.bind(this));
}

private async handleOpenFinIntent(
  intent: string,
  context: Context,
  source?: AppIdentifier,
): Promise<void> {
  // Check if user is logged in
  const isLoggedIn = await this.checkLoginStatus();
  if (!isLoggedIn) {
    // Queue intent for after login
    this.intentQueue.enqueue(PRELOGIN_TILE_ID, intent, context, source || { appId: 'external' });
    return;
  }

  // Always use raiseIntent
  await this.raiseIntent(intent, context, undefined, source);
}

private async processQueuedIntentsAfterLogin() {
  const queued = this.intentQueue.getQueuedIntents(PRELOGIN_TILE_ID);
  if (queued.length === 0) return;

  // Filter by entitlements
  for (const queuedIntent of queued) {
    const entitlementCheck = await this.entitlementValidator.canSendIntent(
      queuedIntent.source?.appId || '',
      queuedIntent.intent,
      queuedIntent.context,
    );
    if (entitlementCheck.allowed) {
      await this.raiseIntent(queuedIntent.intent, queuedIntent.context, undefined, queuedIntent.source);
    }
  }

  // Clear queue
  this.intentQueue.clearQueue(PRELOGIN_TILE_ID);
}
```

**Rationale:** Directly use `this.intentQueue` - no new queue implementation needed. Uses `onLogin` callback to trigger post-login processing.

### 8. Configurable Global Intents

Global intents are passed via broker configuration:

```typescript
interface BrokerConfig {
  // ... existing config ...
  openFinBridgeOptions?: {
    globalIntents?: string[];  // Configurable list of global intents
  };
  onLogin?: (callback: () => Promise<void>) => Promise<void>;
  onLogout?: (callback: () => Promise<void>) => Promise<void>;
}

const DEFAULT_GLOBAL_INTENTS = ['ViewChart', 'StartCall', 'ViewContact', 'ViewInstrument'];
```

**Rationale:** Different deployments may need different global intents without code changes.

### 9. Session-Based Intent Refresh

Intent list is refreshed on each session/initialization:

```typescript
async initializeIntents(): Promise<void> {
  // Always refresh from app directory on each call
  const entitledApps = await this.appDirectory.getAllApps();
  const entitledIntents = this.extractIntentsFromApps(entitledApps);

  // Combine with global intents
  const allIntents = new Set([...this.config.globalIntents, ...entitledIntents]);

  // Subscribe to all intents
  for (const intent of allIntents) {
    await this.subscribeToIntent(intent);
  }
}
```

**Rationale:** Apps and entitlements may change between sessions. Always fetch fresh intent list.

### 10. Ambiguous Intent Resolution

When multiple apps can handle an intent, show the resolver UI:

```typescript
if (result.type === 'ambiguous' && result.targets) {
  // Always show resolver UI for ambiguous intents
  const selected = await this.intentResolver.showResolverUI(result.targets);
  if (!selected) {
    throw new Error('User cancelled intent resolution');
  }
  result.target = selected;
}
```

**Rationale:** User should choose which app handles their intent, not have system auto-select.

## Open Questions

1. Should global intents be configurable or hardcoded? - **Answered: Yes, configurable with defaults**
2. Should we cache the intent list or refetch on each session? - **Answered: Refetch each session**
3. How should ambiguous intent resolution be handled? - **Answered: Always show resolver UI**
