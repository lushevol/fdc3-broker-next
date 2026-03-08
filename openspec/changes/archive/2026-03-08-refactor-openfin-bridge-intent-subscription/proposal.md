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
- **NEW:** Pre-login intent queue with deduplication: queue intents before login, filter by entitlements after login, then raise internally
- **NEW:** Configurable global intents via broker configuration with sensible defaults
- **NEW:** Session-based intent refresh: always fetch fresh intent list on each initialization
- **NEW:** Ambiguous intent resolution: always show resolver UI when multiple apps can handle an intent
- Remove or deprecate the manual `subscribeToIntents()` public method (implementation detail)

## Capabilities

### New Capabilities

- `openfin-bridge-intent-subscription`: Automatic intent subscription combining predefined global intents with entitlements-filtered intents from the appDirectory

### Modified Capabilities

None

## Impact

- **Modified Files:**
  - `packages/fdc3-broker/src/openfin-bridge.ts` - new intent discovery, initialization
  - `packages/fdc3-broker/src/broker.ts` - pre-login queue, skipExternalRouting flag, resolver UI
- **New Dependencies:** `packages/fdc3-broker` depends on `packages/fdc3-app-directory` for `AppDirectoryClient`
- **API Changes:**
  - `BrokerConfig` adds `globalIntents?: string[]` option
  - `OpenFinBridge` constructor accepts optional `AppDirectoryClient`
  - `subscribeToIntents()` becomes internal/private
- **New Behavior:**
  - Pre-login intents queued and delivered after successful login
  - Deduplication by intent+context.type+context.id
  - Session-based intent refresh (no caching)
  - Resolver UI always shown for ambiguous intents
