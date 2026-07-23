## Why

Cashflow now receives a trustworthy platform identity and has a transport-independent Authorization Limits service, but its federated application export has no application-owned seam for composing them. Without that seam, activation would either couple the host to domain services or encourage module globals and fabricated principals.

## What Changes

- Add a Cashflow application factory that accepts optional application-owned runtime dependencies while preserving the standard federated `ApplicationProps` boundary.
- Compose Authorization Limits repository and mutation capability only from the injected service and current platform identity snapshot.
- Subscribe to live identity changes so logout immediately removes mutation affordances and a later authenticated session can enable only policy-authorized actions.
- Keep the default federated export and standalone preview read-only until an approved service bootstrap is supplied.
- Add acceptance coverage for anonymous, authenticated, missing-service, logout, dependency isolation, and current browser rollback behavior.

## Capabilities

### New Capabilities

- `cashflow-runtime-composition`: Application-owned composition of platform identity and optional Authorization Limits domain service at the Cashflow federation boundary.
- `cashflow-activation-safety`: Fail-closed activation, live identity downgrade, host/domain isolation, and rollback requirements.

### Modified Capabilities

None.

## Impact

- Affected code: `mvp/two-layer-federation/realworld/apps/mfe-cashflow` application export, runtime composition helper, tests, and migration documentation.
- The platform contracts, portal host, design system, grid, endpoint adapter, and federation topology remain unchanged.
- No concrete HTTP client, environment URL, credential policy, authentication adapter, or production mutation activation is introduced.
