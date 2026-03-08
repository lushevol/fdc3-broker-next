## 1. Dependencies and Imports

- [x] 1.1 Add `AppDirectoryClient` import to `openfin-bridge.ts`
- [x] 1.2 Import `AppDefinition` type from app-directory types

## 2. Global Intents Configuration

- [x] 2.1 Define `DEFAULT_GLOBAL_INTENTS` constant array with standard FDC3 intents
- [x] 2.2 Export the constant for testing

## 3. OpenFinBridge Class Modifications

- [x] 3.1 Add optional `appDirectoryClient` property to store the injected client
- [x] 3.2 Update constructor to accept optional `AppDirectoryClient` parameter and store it
- [x] 3.3 Update constructor JSDoc to document the new optional dependency

## 4. Intent Discovery Method

- [x] 4.1 Implement private `getEntitledIntents()` method
- [x] 4.2 Add error handling for app directory failures with fallback to global intents only
- [x] 4.3 Add logging for intent discovery results

## 5. Initialization Method

- [x] 5.1 Implement public `initializeIntents()` async method
- [x] 5.2 Call `getEntitledIntents()` to get combined intent list
- [x] 5.3 Subscribe to each intent via existing `subscribeToIntents()` logic (internal)
- [x] 5.4 Log successful subscription with intent count

## 6. Loop Prevention via Source Heuristic

- [x] 6.1 Add `isIntentFromExternalOpenFinSource()` method to OpenFinBridge
- [x] 6.2 Use heuristic: source.appId !== 'external' means internal source
- [x] 6.3 Update `raiseIntent()` to use `isIntentFromExternalOpenFinSource()` check

## 7. Intent Forwarding (Always via raiseIntent)

- [x] 7.1 Remove internal listener check in `handleOpenFinIntent()`
- [x] 7.2 Always use `raiseIntent()` for delivery after login check
- [x] 7.3 Add login status check before processing intent
- [x] 7.4 Wrap `raiseIntent()` call in try-catch for graceful error handling

## 8. Pre-Login Intent Queue (USE existing intentQueue)

- [x] 8.1 Define constant `PRELOGIN_TILE_ID = '__prelogin__'`
- [x] 8.2 In `handleOpenFinIntent()`, queue when not logged in with `{ appId: 'external' }`
- [x] 8.3 Implement `processQueuedIntentsAfterLogin()`:
  - Retrieve via `intentQueue.getQueuedIntents(PRELOGIN_TILE_ID)`
  - Filter by entitlements (reuse `EntitlementValidator`)
  - Raise via `raiseIntent()`
  - Clear via `intentQueue.clearQueue(PRELOGIN_TILE_ID)`
- [x] 8.4 Implement `checkLoginStatus()` using existing `onLoginStatusCheck` callback
- [x] 8.5 Register callback via `config.onLogin()` in constructor

## 9. Configurable Global Intents

- [x] 9.1 Add `OpenFinBridgeOptions` interface with `globalIntents` option
- [x] 9.2 Add `openFinBridgeOptions` to `BrokerConfig` interface
- [x] 9.3 Add `onLogin` and `onLogout` callbacks to `BrokerConfig`
- [x] 9.4 Pass global intents to `OpenFinBridge` during initialization

## 10. Session-Based Intent Refresh

- [x] 10.1 `initializeIntents()` fetches fresh intents from app directory on each call
- [x] 10.2 Extract unique intents from all entitled apps
- [x] 10.3 Combine global intents with entitled intents (deduplicate)
- [x] 10.4 Subscribe to all intents via OpenFin's `addIntentListener()`
- [x] 10.5 Call `initializeIntents()` during bridge setup (not cached)

## 11. Ambiguous Intent Resolution UI

- [x] 11.1 `raiseIntent()` already shows resolver UI for ambiguous intents (existing behavior)
- [x] 11.2 Resolver UI works for all `raiseIntent()` calls including from OpenFin bridge

## 12. Testing

- [x] 12.1 Add unit tests for `DEFAULT_GLOBAL_INTENTS` constant
- [x] 12.2 Add unit tests for `getEntitledIntents()` with mock `AppDirectoryClient`
- [x] 12.3 Add unit tests for fallback behavior when app directory fails
- [x] 12.4 Add integration test for `initializeIntents()` end-to-end
- [x] 12.5 Add unit test for `handleOpenFinIntent()` triggering raiseIntent call
- [x] 12.6 Add unit test verifying no infinite loop occurs
- [x] 12.7 Add unit test for pre-login intent queue deduplication
- [x] 12.8 Add unit test for post-login entitlement filtering
- [x] 12.9 Add unit test for configurable global intents
- [x] 12.10 Add unit test for `isIntentFromExternalOpenFinSource()` heuristic
- [x] 12.11 Add unit test for ambiguous intent resolver UI
- [x] 12.12 Verify existing tests pass after refactor
