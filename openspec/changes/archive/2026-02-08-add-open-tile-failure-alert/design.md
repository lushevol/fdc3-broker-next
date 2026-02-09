## Context

The FDC3 broker handles tile opening via the `open` API. Currently, when a tile fails to open (due to entitlements, login status, or other errors), the broker throws an error but consuming applications have no way to intercept or display this failure to users. The broker already uses a callback pattern via `BrokerCallbacks` interface for UI interactions (e.g., `onTileOpen`, `onShowResolverUI`), providing an established pattern to follow.

## Goals / Non-Goals

**Goals:**

- Add an `onTileOpenFailure` callback to `BrokerCallbacks` interface
- Invoke callback when `open` API fails for any reason (entitlement denied, login required, etc.)
- Pass failure details (tile ID, error message, error code) to consuming application
- Maintain backwards compatibility (callback is optional)

**Non-Goals:**

- Building UI components for displaying failures (consuming application handles this)
- Changing existing error throwing behavior (errors still thrown for API consumers)
- Adding retry logic for failed tile opens

## Decisions

### 1. Add `onTileOpenFailure` to `BrokerCallbacks` interface

**Decision:** Extend `BrokerCallbacks` with new optional callback:

```typescript
onTileOpenFailure?(failure: TileOpenFailureDetails): void;
```

**Rationale:**

- Follows existing `onTileOpen` naming convention
- Consistent with security event callback pattern (`onSecurityEvent`)
- Optional to maintain backwards compatibility

**Alternative Considered:** Add to `BrokerConfig` instead. Rejected because:

- `BrokerCallbacks` is specifically for UI/interaction callbacks
- Failure notification is analogous to successful open notification (`onTileOpen`)

### 2. TileOpenFailureDetails interface

**Decision:** Define failure details structure:

```typescript
interface TileOpenFailureDetails {
  /** App identifier that failed to open */
  appId: string;
  /** Error message describing the failure */
  reason: string;
  /** Error code for programmatic handling */
  errorCode?: string;
  /** Original error if available */
  error?: Error;
}
```

**Rationale:**

- Mirrors `EntitlementCheckResult` structure used in entitlements
- Includes optional `error` field for debugging

### 3. Callback invocation points

**Decision:** Invoke callback at these failure points in `open` method:

1. **Login check failure** (line ~462-465 in broker.ts)
2. **Entitlement denied** (thrown from `canOpenTile`)
3. **onTileOpen callback throws** (line ~479-482)

**Rationale:**

- Catches all failure scenarios in the `open` flow
- Uses try/catch wrapper around existing code to avoid refactoring

### 4. Invocation timing

**Decision:** Invoke `onTileOpenFailure` before throwing the error.

**Rationale:**

- Allows consuming application to handle UI notification while error still propagates
- Consistent with `onSecurityEvent` pattern which logs before throwing

## Risks / Trade-offs

- **[Risk]** Consuming application may not handle callback and users still see no feedback
  - **Mitigation:** Document clearly that this callback is for UI feedback
  - **Mitigation:** Log at `warn` level when callback is not provided but tile fails

- **[Risk]** Callback throwing could interfere with error handling
  - **Mitigation:** Wrap callback invocation in try/catch with error logging
  - **Mitigation:** Original error always takes precedence (still thrown after callback)

- **[Risk]** Breaking change if consuming apps implement `BrokerCallbacks` interface
  - **Mitigation:** TypeScript interfaces are extendable; new optional property won't break
  - **Mitigation:** Callback is optional with no-op fallback
