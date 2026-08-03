# Platform identity capability acceptance

Status: capability contract accepted; runtime login status updated 3 August 2026. See [`../../../docs/CURRENT_STATE.md`](../../../docs/CURRENT_STATE.md).

## Outcome

The production two-layer platform has an additive, independently versioned
identity contract. The host owns the capability; federated applications consume
a minimal read-only snapshot. The local host now starts anonymous and can
publish an authenticated snapshot through its deterministic verification login.
This does not claim production authentication and does not by itself activate
Authorization Limits mutations.

## Public contract

`IdentitySnapshot` is a strict discriminated union:

- anonymous: `state` and `contractVersion` only;
- authenticated: `state`, non-empty `userId`, unique non-empty `permissions`, and `contractVersion`.

The public capability contains only synchronous `getSnapshot()` and `subscribe()` operations. It deliberately excludes tokens, cookies, credentials, provider claims, login/logout, refresh, storage, and transport behavior. Published snapshots and nested permission arrays are cloned and frozen.

## Ownership

| Owner                        | Responsibility                                                                                                                                    |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Portal host                  | Adapt an approved authentication/session source into identity snapshots and deliver the capability directly to applications                       |
| Platform contracts           | Define identity states, runtime validation, capability types, version negotiation, and stable compatibility errors                                |
| Platform SDK                 | Provide optional client access and a validated observable identity controller                                                                     |
| Cashflow application         | Declare supported identity contract version and translate an authenticated snapshot into an application-domain principal only at composition time |
| Authorization Limits backend | Remain authoritative for authorization regardless of UI permission affordances                                                                    |

Applications must not derive identity from browser storage, URL state, legacy globals, display labels, or credentials. The design system has no identity or authorization responsibility.

## Compatibility and versions

- `@fm/platform-contracts`: `1.1.0`
- `@fm/platform-sdk`: `1.1.0`
- application contract: `1.0.0`
- appearance contract: `1.0.0`
- identity contract: `1.0.0`

Identity fields are optional for applications that do not request the capability. When the registry includes `identity`, both its entry and the remote manifest must declare exactly the supported identity contract version; otherwise loading fails with `IDENTITY_CONTRACT_UNSUPPORTED`. Package semantic versions and runtime protocol versions therefore evolve independently.

## Current local runtime behavior

The registry requests identity for the relevant applications and each remote
declares identity contract `1.0.0`. Before login, the host holds
`{ state: "anonymous", contractVersion: "1.0.0" }`. The local `test` / `test`
adapter then supplies an authenticated `test` identity with deterministic
verification permissions. Production session credentials are never placed in
the identity snapshot. Authorization Limits services and mutation policy remain
separate activation concerns.

## Activation gate

Activation requires all of the following:

1. An approved host authentication adapter publishes a validated authenticated snapshot.
2. The permission taxonomy and mapping to `AuthorizationLimitsPrincipal` are approved and tested.
3. An environment-configured authenticated transport is injected at the Cashflow bootstrap boundary.
4. Endpoint fixtures, cookies/token behavior, CSRF, timeouts, cancellation, tracing, and failure telemetry are verified.
5. Server authorization remains authoritative and every mutation has authenticated non-production browser coverage.
6. A cohort flag and legacy fallback remain available until parity and rollback gates pass.

Identity alone is never sufficient to activate mutations.

## Acceptance evidence

The acceptance run covers strict identity validation, rejected extra credential fields, conditional compatibility, stable error codes, optional SDK behavior, observable immutable snapshots, host-owned anonymous delivery, standalone behavior, Cashflow read-only regression, package builds, lint, two-layer runtime boundaries, and browser rollback journeys.

| Gate                 | Result                                                                                               |
| -------------------- | ---------------------------------------------------------------------------------------------------- |
| Platform contracts   | 19 tests passed; 100% statements/functions/lines; lint and declaration build passed                  |
| Platform SDK         | 8 tests passed; 100% statements/branches/functions/lines; lint and declaration build passed          |
| Portal host          | Latest focused run: 46 tests; lint and production build passed                                       |
| Cashflow             | Latest focused run: 84 tests; lint and production build passed                                       |
| Runtime boundaries   | Exactly `portal-host` and `federated-application`; only React and ReactDOM singleton shares          |
| Browser verification | Live Chrome passed login, profile identity rendering, active remote loading, and workspace lifecycle |
| Specification        | `openspec validate add-platform-identity-capability --strict` passed                                 |

The historical bundle figures associated with the original capability change
are no longer a current baseline after the WebKit and verification-application
migrations. The two-layer and shared-singleton policies remain unchanged.
