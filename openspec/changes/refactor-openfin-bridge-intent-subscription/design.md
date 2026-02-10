## Context

The `OpenFinBridge` class in `packages/fdc3-broker/src/openfin-bridge.ts` enables bidirectional FDC3 communication between the MFE platform and OpenFin applications. Currently, intent subscription requires callers to manually pass a list of supported intent types via `subscribeToIntents()`.

For seamless interoperability, the bridge should automatically discover and subscribe to all intents that the current user is entitled to use, eliminating manual configuration.

## Goals / Non-Goals

**Goals:**
- Automatically subscribe to predefined global intents (e.g., `ViewChart`, `StartCall`)
- Dynamically discover all intents available to the current user from the appDirectory
- Combine global and entitlement-filtered intents into a unified subscription set
- Maintain backward compatibility for existing code that uses `subscribeToIntents()`

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
  app.interop?.intents?.listensFor?.forEach(handler => {
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

## Risks / Trade-offs

- **[Risk]** AppDirectory unavailable at startup → **Mitigation:** Log warning, subscribe only to global intents
- **[Risk]** Large number of intents from many apps → **Mitigation:** OpenFin can handle many listeners; deduplication reduces overhead
- **[Trade-off]** Initialization delay while fetching apps → **Mitigation:** Non-blocking; callers can await before expecting intent delivery

### 5. Intent Forwarding via raiseIntent Reuse

Incoming OpenFin intents directly call `raiseIntent()` when no internal listener exists:

```typescript
private async handleOpenFinIntent(
  intent: string,
  context: Context,
  source?: AppIdentifier,
): Promise<void> {
  // Check for existing internal listeners (current behavior)
  const listeners = this.intentListeners.get(intent);
  if (listeners && listeners.length > 0) {
    // Forward to internal listeners
    for (const listener of listeners) {
      const handler = (listener as any).handler;
      if (handler) {
        await handler(context);
      }
    }
    return;
  }

  // NEW: No internal listeners → reuse raiseIntent directly
  // This handles: entitlement check, app resolution, opening, delivery
  await this.raiseIntent(intent, context, undefined, source);
}
```

**To prevent infinite loops**, modify `raiseIntent()` to accept an optional flag:

```typescript
private isReroutingFromOpenFin = false;

async raiseIntent(..., skipExternalRouting = false) {
  // ... existing logic ...

  if (result.type === 'not-found' && !skipExternalRouting) {
    // Only route to OpenFin if NOT already routing from OpenFin
    const openFinBridge = await this.getOpenFinBridge();
    if (openFinBridge?.isEnabled()) {
      return await openFinBridge.raiseIntentExternal(intent, context, targetApp);
    }
  }
}
```

**Rationale:** `raiseIntent()` already handles all the complex logic (entitlements, resolution, app opening). We just need to prevent re-routing back to OpenFin.

### 6. Broker Integration

No new methods needed. The bridge calls existing `raiseIntent()` with a private flag to prevent OpenFin re-routing.

## Open Questions

1. Should global intents be configurable or hardcoded?
2. Should we cache the intent list or refetch on each session?
3. How should ambiguous intent resolution be handled (show resolver UI vs default)?
