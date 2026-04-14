# ratan-fdc3-broker — Architecture

## Tech Stack

- TypeScript
- tsup (ESM + CJS)
- Vitest
- @testing-library/react

## Directory Structure

```
src/
  broker.ts              Core Broker (1600+ lines)
  channel.ts             Channel implementations
  channel-manager.ts     Channel lifecycle & lookup
  intent-resolver.ts     Intent resolution logic
  intent-queue.ts        Pre-login intent queuing
  entitlements.ts        EntitlementValidator
  tile-registry.ts       Tile registration & tracking
  logger.ts              Logger with levels
  performance.ts         Performance tracking
  openfin-bridge.ts      OpenFin FDC3 bridge
  postmessage-bridge.ts  PostMessage bridge for iframes
  errors.ts              Custom FDC3 error types
  ErrorBoundary.tsx      React error boundary (agent/broker/resolver themes)
```

## Core API — DesktopAgent Methods

| Method                              | Category  |
| ----------------------------------- | --------- |
| `open`                              | Intents   |
| `findInstances`                     | Discovery |
| `broadcast`                         | Channels  |
| `addContextListener`                | Channels  |
| `findIntent`                        | Intents   |
| `raiseIntent`                       | Intents   |
| `raiseIntentForContext`             | Intents   |
| `addIntentListener`                 | Intents   |
| `getOrCreateChannel`                | Channels  |
| `joinChannel` / `getCurrentChannel` | Channels  |
| `leaveCurrentChannel`               | Channels  |
| `getChannel` / `getUserChannels`    | Channels  |
| `addEventListener`                  | Events    |
| `getInfo`                           | Discovery |

## Inter-Package Dependencies

```
fdc3-broker → fdc3-app-directory   (AppDirectoryClient + AppDefinition types)
```

## Tile Registration

- `registerTile(appId, …)` / `unregisterTile(appId)` track mounting state, intent listeners, and context listeners.

## Channel System

- **User channels** — 8 colour-named channels
- **App channels** — Created via `getOrCreateChannel`
- **Private channels** — Access-controlled, event-driven

## Broker Config

`BrokerConfig` provides callbacks:

| Callback                 | Purpose                       |
| ------------------------ | ----------------------------- |
| `onShowResolverUI`       | Show intent resolver dialog   |
| `onOpenTile`             | Open a new tile               |
| `onCloseTile`            | Close a tile                  |
| `onValidateEntitlements` | Custom entitlement validation |

## Build

- **Bundler:** tsup
- **Outputs:** ESM, CJS, DTS
- **Externals:** react, react-dom, @finos/fdc3

## Testing

- 24 test files, 540 tests (88% passing)
- FDC3 conformance verified
