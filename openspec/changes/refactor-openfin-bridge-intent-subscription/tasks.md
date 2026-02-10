## 1. Dependencies and Imports

- [ ] 1.1 Add `@rathena/fdc3-app-directory` or relative import for `AppDirectoryClient` to `openfin-bridge.ts`
- [ ] 1.2 Import `AppDefinition` type from app-directory types

## 2. Global Intents Configuration

- [ ] 2.1 Define `GLOBAL_INTENTS` constant array with standard FDC3 intents (e.g., `ViewChart`, `StartCall`, `ViewContact`, `ViewInstrument`)
- [ ] 2.2 Export the constant for testing if needed

## 3. OpenFinBridge Class Modifications

- [ ] 3.1 Add optional `appDirectoryClient` property to store the injected client
- [ ] 3.2 Update constructor to accept optional `AppDirectoryClient` parameter and store it
- [ ] 3.3 Update constructor JSDoc to document the new optional dependency

## 4. Intent Discovery Method

- [ ] 4.1 Implement private `getEntitledIntents()` method:
  - Call `appDirectoryClient.getAllApps()` to get entitled apps
  - Extract unique intent names from each app's `interop.intents.listensFor`
  - Combine with `GLOBAL_INTENTS`
  - Return deduplicated array of intent names
- [ ] 4.2 Add error handling for app directory failures with fallback to global intents only
- [ ] 4.3 Add logging for intent discovery results

## 5. Initialization Method

- [ ] 5.1 Implement public `initializeIntents()` async method
- [ ] 5.2 Call `getEntitledIntents()` to get combined intent list
- [ ] 5.3 Subscribe to each intent via existing `subscribeToIntents()` logic (internal)
- [ ] 5.4 Log successful subscription with intent count

## 6. Update Existing subscribeToIntents

- [ ] 6.1 Make `subscribeToIntents()` private or rename to `subscribeToIntentsInternal()`
- [ ] 6.2 Remove or deprecate public API documentation for manual intent subscription

## 7. Broker Modification to Prevent Infinite Loops

- [ ] 7.1 Add private flag `isReroutingFromOpenFin` to `Broker` class
- [ ] 7.2 Modify `raiseIntent()` to accept optional `skipExternalRouting` parameter
- [ ] 7.3 Add condition: only route to OpenFin when `!skipExternalRouting`
- [ ] 7.4 Add error handling around `raiseIntent()` call in `handleOpenFinIntent()`

## 8. OpenFin Bridge Intent Handling Refactor

- [ ] 8.1 Keep `handleOpenFinIntent()` existing listener check and delivery logic
- [ ] 8.2 Add fallback: if no listeners, call `this.raiseIntent(intent, context, undefined, source)`
- [ ] 8.3 Wrap `raiseIntent()` call in try-catch to prevent OpenFin errors
- [ ] 8.4 Add logging for intent routing decisions

## 9. Testing

- [ ] 9.1 Add unit tests for `GLOBAL_INTENTS` constant
- [ ] 9.2 Add unit tests for `getEntitledIntents()` with mock `AppDirectoryClient`
- [ ] 9.3 Add unit tests for fallback behavior when app directory fails
- [ ] 9.4 Add integration test for `initializeIntents()` end-to-end
- [ ] 9.5 Add unit test for `handleOpenFinIntent()` delivering to existing listener
- [ ] 9.6 Add unit test for `handleOpenFinIntent()` triggering raiseIntent call
- [ ] 9.7 Add unit test verifying no infinite loop occurs
- [ ] 9.8 Verify existing tests pass after refactor
