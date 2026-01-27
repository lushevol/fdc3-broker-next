# Implementation Tasks

## 1. Core PostMessage Bridge Implementation

- [x] 1.1 Create `postmessage-bridge.ts` with `PostMessageBridge` class
- [x] 1.2 Define message protocol types (`PostMessageRequest`, `PostMessageResponse`, etc.)
- [x] 1.3 Implement message serialization and correlation (request/response matching)
- [x] 1.4 Add origin validation and security checks

## 2. FDC3 Method Implementation

- [x] 2.1 Implement `raiseIntentExternal()` for raising intents to external apps
- [x] 2.2 Implement `subscribeToIntents()` for receiving intents from external sources
- [x] 2.3 Implement `open()` proxy for requesting external app launch
- [x] 2.4 Implement `findIntent()` and `findIntentsByContext()` proxying
- [x] 2.5 Add channel method placeholders (`joinUserChannel`, `broadcast`, etc.)

## 3. Configuration and Integration

- [x] 3.1 Add `enablePostMessageBridge` to `BrokerConfig` in `types.ts`
- [x] 3.2 Add `PostMessageBridgeOptions` interface for origin allowlists
- [x] 3.3 Add `isPostMessageBridgeAvailable()` to `environment.ts`
- [x] 3.4 Integrate bridge initialization in `Broker` class (lazy-loaded like OpenFin bridge)
- [x] 3.5 Wire up intent forwarding to PostMessage bridge in broker

## 4. Testing

- [x] 4.1 Create `postmessage-bridge.test.ts` with message mocks
- [x] 4.2 Test intent raising and receiving
- [x] 4.3 Test origin validation and security
- [x] 4.4 Test correlation and timeout handling
- [/] 4.5 Run full test suite: `cd packages/fdc3-broker && yarn test`

## 5. Documentation

- [ ] 5.1 Update `packages/fdc3-broker/README.md` with PostMessage bridge usage
