# Change: Add PostMessage Bridge for FDC3 Broker

## Why

The FDC3 broker currently only supports OpenFin as an external bridge for inter-application communication. When running in a standard browser environment, there is no way for the MFE platform to communicate with external domains (e.g., embedded iframes from partner systems, cross-origin applications) using FDC3 protocols. The PostMessage bridge fills this gap by enabling bidirectional FDC3 communication via the browser's `window.postMessage` API.

## What Changes

- **ADDED**: New `PostMessageBridge` class in `packages/fdc3-broker/src/postmessage-bridge.ts` implementing cross-domain messaging
- **ADDED**: Message protocol types and serialization for FDC3 operations over PostMessage
- **ADDED**: Environment detection for PostMessage bridge availability
- **ADDED**: Configuration option `enablePostMessageBridge` in `BrokerConfig`
- **ADDED**: Broker integration to use PostMessage bridge when enabled and in browser environment
- **ADDED**: Unit tests for PostMessage bridge functionality

## Scope

The initial implementation covers:

- **Intents**: `raiseIntent`, `addIntentListener`, intent forwarding
- **Open**: `open()` to request external app launch
- **App Discovery**: `findIntent`, `findIntentsByContext` proxying

**Placeholder** (future work):

- **Channels**: Basic structure for channel sync, full implementation deferred

## Impact

- **Affected specs**: New `postmessage-bridge` capability
- **Affected code**:
  - `packages/fdc3-broker/src/postmessage-bridge.ts` (new)
  - `packages/fdc3-broker/src/types.ts` (config addition)
  - `packages/fdc3-broker/src/broker.ts` (bridge integration)
  - `packages/fdc3-broker/src/environment.ts` (detection utilities)
  - `packages/fdc3-broker/test/postmessage-bridge.test.ts` (new)
