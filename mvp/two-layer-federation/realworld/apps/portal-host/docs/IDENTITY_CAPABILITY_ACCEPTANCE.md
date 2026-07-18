# Platform identity capability acceptance

## Outcome

The production two-layer platform now has an additive, independently versioned identity contract. The host owns the capability; federated applications consume a minimal read-only snapshot. The current host publishes only a truthful anonymous snapshot, so this change does not claim that authentication exists and does not activate Authorization Limits mutations.

## Public contract

`IdentitySnapshot` is a strict discriminated union:

- anonymous: `state` and `contractVersion` only;
- authenticated: `state`, non-empty `userId`, unique non-empty `permissions`, and `contractVersion`.

The public capability contains only synchronous `getSnapshot()` and `subscribe()` operations. It deliberately excludes tokens, cookies, credentials, provider claims, login/logout, refresh, storage, and transport behavior. Published snapshots and nested permission arrays are cloned and frozen.

## Ownership

| Owner | Responsibility |
| --- | --- |
| Portal host | Adapt an approved authentication/session source into identity snapshots and deliver the capability directly to applications |
| Platform contracts | Define identity states, runtime validation, capability types, version negotiation, and stable compatibility errors |
| Platform SDK | Provide optional client access and a validated observable identity controller |
| Cashflow application | Declare supported identity contract version and translate an authenticated snapshot into an application-domain principal only at composition time |
| Authorization Limits backend | Remain authoritative for authorization regardless of UI permission affordances |

Applications must not derive identity from browser storage, URL state, legacy globals, display labels, or credentials. The design system has no identity or authorization responsibility.

## Compatibility and versions

- `@fm/platform-contracts`: `1.1.0`
- `@fm/platform-sdk`: `1.1.0`
- application contract: `1.0.0`
- appearance contract: `1.0.0`
- identity contract: `1.0.0`

Identity fields are optional for applications that do not request the capability. When the registry includes `identity`, both its entry and the remote manifest must declare exactly the supported identity contract version; otherwise loading fails with `IDENTITY_CONTRACT_UNSUPPORTED`. Package semantic versions and runtime protocol versions therefore evolve independently.

## Current runtime behavior

The production registry requests identity for Cashflow, Cashflow declares identity `1.0.0`, and the host supplies `{ state: "anonymous", contractVersion: "1.0.0" }`. The standalone Cashflow preview supplies the same state. No code constructs an Authorization Limits mutation capability from this snapshot, and no HTTP adapter is instantiated.

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

| Gate | Result |
| --- | --- |
| Platform contracts | 19 tests passed; 100% statements/functions/lines; lint and declaration build passed |
| Platform SDK | 8 tests passed; 100% statements/branches/functions/lines; lint and declaration build passed |
| Portal host | 11 tests passed; lint, strict TypeScript, and production build passed |
| Cashflow | 72 tests passed; 97.16% statements, 93.87% branches, 95.4% functions, 97.91% lines; lint, strict TypeScript, and production build passed |
| Runtime boundaries | Exactly `portal-host` and `federated-application`; only React and ReactDOM singleton shares |
| Browser rollback | 5/5 Chrome journeys passed, including explicit absence of Create, Edit, Delete, Approve Add, and Reject Add |
| Specification | `openspec validate add-platform-identity-capability --strict` passed |

Built size was 530.3 KB / 158.6 KB gzip for the host and 1928.8 KB / 509.8 KB gzip for Cashflow. Compared with the preceding rounded baseline, identity support adds approximately 1.6 KB total / 0.8 KB gzip while preserving the same runtime layers and shared-singleton policy.
