## Why

The OpenFin bridge currently requires manual intent subscription via `subscribeToIntents()`, but for seamless FDC3 interoperability, the bridge should automatically subscribe to:
1. Predefined global intents that are always listened for
2. All intents from the appDirectory that the current user is entitled to access

This eliminates the need for callers to manually specify intents and ensures the bridge only listens for intents the user can actually act on.

## What Changes

- Add predefined global intent constants (e.g., `ViewChart`, `StartCall`) that the bridge always subscribes to
- Add `AppDirectoryClient` dependency to `OpenFinBridge` to fetch entitled apps
- Dynamically extract all unique intent types from entitled apps' `interop.intents.listensFor`
- Combine global intents with entitlement-filtered intents for subscription
- Add `initializeIntents()` method to perform one-time intent subscription setup
- **NEW:** Transform incoming OpenFin intents to use `raiseIntent`-like logic:
  - If internal listener exists → deliver directly (current behavior)
  - If no internal listener → find capable apps, optionally open target, deliver intent
- Remove or deprecate the manual `subscribeToIntents()` public method (implementation detail)

## Capabilities

### New Capabilities
- `openfin-bridge-intent-subscription`: Automatic intent subscription combining predefined global intents with entitlements-filtered intents from the appDirectory

### Modified Capabilities
None

## Impact

- **Modified Files:** `packages/fdc3-broker/src/openfin-bridge.ts`
- **New Dependencies:** `packages/fdc3-broker` depends on `packages/fdc3-app-directory` for `AppDirectoryClient`
- **API Changes:** `OpenFinBridge` constructor accepts optional `AppDirectoryClient`; `subscribeToIntents()` becomes internal
