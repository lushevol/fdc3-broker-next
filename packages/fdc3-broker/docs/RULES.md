# ratan-fdc3-broker — Rules

> Parent: [Monorepo rules](../../../docs/rules.md) · [AGENTS.md](../../../AGENTS.md)

## Instantiation

- Always instantiate `Broker` with a `BrokerConfig` that includes at least the `onShowResolverUI` callback.

## App Directory

- Provide `AppDirectoryClientImpl` for production. Provide `MockAppDirectoryService` for development.

## Entitlements

- All intent, channel, and open operations pass through `EntitlementValidator`. Use the `onValidateEntitlements` callback for custom validation logic.

## Error Handling

- Use the `ErrorBoundary` component (import from this package) to wrap FDC3 integrations. Supports `agent`, `broker`, and `resolver` themes.

## Intent Queue

- Pre-login intents are queued in localStorage and delivered via `IntentQueueImpl` after tile registration.

## OpenFin

- `OpenFinBridge` lazily initializes when `fin.desktop.fdc3` is detected. No manual setup required.

## Logging

- Use `Logger` with `LogLevel.DEBUG` for development and `LogLevel.WARN` for production. Security events are always logged regardless of level.
