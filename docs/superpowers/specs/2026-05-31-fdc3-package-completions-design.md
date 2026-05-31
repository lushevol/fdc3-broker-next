# FDC3 Package Completions Design

## Scope

Complete the direct unfinished and failing items found in the FDC3 packages:

- Replace `PostMessageBridge` channel no-ops with request/response forwarding for user channel join, broadcast, current channel lookup, and user channel discovery.
- Fix the `ratan-fdc3-resolver-ui` AppCard transition behavior so its existing test suite passes.

Coverage uplift is intentionally out of scope for this pass.

## Approach

The PostMessage bridge already has a typed request envelope, response correlation, timeout handling, and origin validation. Channel support will reuse that protocol instead of introducing another transport. Action methods (`joinUserChannel`, `broadcast`) should reject when the bridge is disabled, matching the existing `open` and `raiseIntentExternal` behavior. Query methods (`getCurrentChannel`, `getUserChannels`) should degrade to `null` or `[]` when disabled, matching the existing find methods.

Each channel method will accept an optional `targetOrigin` parameter while preserving existing call sites:

- `joinUserChannel(channel, targetOrigin = '*')`
- `broadcast(context, channelId?, targetOrigin = '*')`
- `getCurrentChannel(targetOrigin = '*')`
- `getUserChannels(targetOrigin = '*')`

The broker will also sync internal channel actions to PostMessage when the bridge is enabled, parallel to the existing OpenFin sync path.

The AppCard failure is a root-cause mismatch between the existing test/documentation expectation (`all 0.2s`) and the current shared card style (`border-color 0.2s, box-shadow 0.2s`). This pass will align the component style with the existing contract.

## Testing

Use TDD for new PostMessage channel behavior by rewriting the current placeholder tests to expect outbound request envelopes and successful response handling before implementing the bridge methods. Use the existing failing AppCard test as the regression case for resolver-ui.

Verification commands:

- `npm test` in `packages/fdc3-broker`
- `npm test` in `packages/fdc3-resolver-ui`
- `npm run build` in dependency order for `fdc3-app-directory`, `fdc3-broker`, `fdc3-agent`, and `fdc3-resolver-ui`

