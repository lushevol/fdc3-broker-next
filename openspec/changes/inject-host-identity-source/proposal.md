## Why

The new host currently constructs anonymous identity internally, so an approved authentication adapter has no explicit bootstrap seam for publishing authenticated sessions. Copying legacy storage and `mfe-ratan-container` globals would preserve the runtime architecture being removed.

## What Changes

- Add an optional host bootstrap identity dependency that is threaded through registry loading into every directly loaded application.
- Move the anonymous fallback into a stable, frozen host identity module with no storage or credential behavior.
- Preserve live source subscriptions so authentication, refresh, and logout can update mounted applications without remounting them.
- Characterize the legacy identity/entitlement/header flow and explicitly reject it as the production API.
- Keep current bootstrap anonymous and Authorization Limits read-only until an approved authentication adapter is provided.

## Capabilities

### New Capabilities

- `host-identity-injection`: Generic host bootstrap injection and direct delivery of a versioned live identity capability.
- `legacy-auth-separation`: Migration constraints separating new identity delivery from legacy storage, tokens, container globals, and domain entitlements.

### Modified Capabilities

None.

## Impact

- Affected code: `mvp/two-layer-federation/apps/portal-host` identity fallback, `App`/`PortalHost` props, tests, and architecture documentation.
- No changes to platform contracts/SDK, Cashflow domain APIs, registry schema, authentication endpoints, HTTP credentials, or federation topology.
- No authenticated production session is fabricated and no Authorization Limits mutation is activated.
