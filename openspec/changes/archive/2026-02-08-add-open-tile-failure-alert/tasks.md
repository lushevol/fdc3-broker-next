## 1. Type Definitions

- [x] 1.1 Add `TileOpenFailureDetails` interface to `packages/fdc3-broker/src/types.ts`
- [x] 1.2 Add `onTileOpenFailure` optional callback to `BrokerCallbacks` interface in `packages/fdc3-broker/src/types.ts`

## 2. Broker Implementation

- [x] 2.1 Update `open` method in `packages/fdc3-broker/src/broker.ts` to invoke `onTileOpenFailure` on login failure
- [x] 2.2 Update `open` method to invoke `onTileOpenFailure` on entitlement denial
- [x] 2.3 Update `open` method to invoke `onTileOpenFailure` when `onTileOpen` callback throws
- [x] 2.4 Add try/catch wrapper around callback invocation with error logging
- [x] 2.5 Add WARN level logging when callback not configured but tile fails

## 3. Testing

- [x] 3.1 Add unit test for `onTileOpenFailure` invoked on login failure
- [x] 3.2 Add unit test for `onTileOpenFailure` invoked on entitlement denial
- [x] 3.3 Add unit test for `onTileOpenFailure` invoked when `onTileOpen` throws
- [x] 3.4 Add unit test for graceful handling when callback throws
- [x] 3.5 Add unit test for silent fallback when callback not configured
