# Portal POC 1 Specification

## 1. Status

- **Status:** Proposed for design review
- **POC:** Portal core
- **Implementation:** Not authorized
- **Normative parent:** [PORTAL_PLATFORM_POC_CHARTER.md](./PORTAL_PLATFORM_POC_CHARTER.md)
- **Decision record:** [PORTAL_PLATFORM_DISCUSSION.md](./PORTAL_PLATFORM_DISCUSSION.md)

The keywords **MUST**, **MUST NOT**, **SHOULD**, and **MAY** are normative.

## 2. Primary hypothesis

One Portal Host can establish a deterministic fake session, discover an entitled independently built Cashflow tile from runtime registry data, and retain two isolated instances of that tile without a shared runtime container.

POC 1 answers only this question. It does not prove production identity, OpenFin, FDC3, Nginx routing, tenant backend integration, notification behavior, Ratan Design component observability, scaffolding, or production delivery.

## 3. Primary user journey

```text
Anonymous portal
  -> explicit fake login
  -> entitled application launcher
  -> open Cashflow 1
  -> set instance-local filter
  -> open Cashflow 2
  -> set a different instance-local filter
  -> switch between tabs and verify retained isolated state
  -> close Cashflow 2
  -> Cashflow 1 remains mounted and usable
```

Focused acceptance tests separately prove remote failure containment and registry selection without a host rebuild.

## 4. Scope

### 4.1 Included

- One Portal Host.
- One real tile definition: Cashflow.
- One deterministic anonymous-to-authenticated fake session transition.
- Entitlement-aware discovery and mount checks.
- A runtime-loaded, schema-validated registry.
- Two or more instances of the Cashflow tile definition.
- Duplicate tabs with one active instance at a time.
- Retained instance-local Cashflow filter state.
- Host-owned open, activate, close, load-failure, and compatibility behavior.
- Host lifecycle telemetry through a typed in-memory collector.
- Module Federation as the POC loader.
- Existing bounded appearance/design-system behavior as a regression boundary.
- Existing standalone Cashflow rendering as a regression boundary.
- Automated contract, unit, component, boundary, build, and browser evidence.

### 4.2 Excluded

- Real SSO, JWTs, auth SDK, token renewal, logout, revocation, or distributed sessions.
- OpenFin runtime integration or certification.
- FDC3 contexts, intents, resolver behavior, or the `scb.fmptp.SearchCashflows` journey.
- Production Nginx, static-resource routing, tenant servers, or route-control automation.
- A Spring Boot tenant service or any tenant API call.
- Notification product behavior.
- Tenant business telemetry and Ratan Design component observability.
- Free-form canvas, fixed panes, drag/drop, resizing, or layout persistence.
- Workspace restore after reload or across devices.
- Instance-specific deep-link routing.
- Multiple real tile types, multiple tenants, or cross-tenant behavior.
- General Capability Gateway, Workflow Orchestrator, chatbot, or AI behavior.
- Scaffold CLI or template generation.
- Production artifact signing, SBOM, promotion, canary, or rollback automation.
- Any change under `mvp/two-layer-federation/realworld/`.
- Migration of a legacy application.

Existing POC behavior outside this scope MAY remain if it does not expand and all POC 1 boundaries remain enforceable. It is not part of POC 1 acceptance evidence.

## 5. Identity model

### 5.1 Tile definition identity

`tileId` identifies one registered application type. For the real POC tile:

| Field | Value |
| --- | --- |
| `tileId` | `cashflow` |
| `tenantId` | `ratan` |
| Display name | `Cashflow` |
| Required entitlement | `cashflow.read` |

The Module Federation remote name and manifest URL are deployment metadata and MUST NOT be used as product identity.

### 5.2 Tile instance identity

`instanceId` identifies one mounted occurrence of a tile definition.

Rules:

- Every successful open request **MUST** allocate a new `instanceId`.
- The POC format **MUST** be deterministic and human-verifiable: `cashflow-1`, `cashflow-2`, and so on.
- An `instanceId` **MUST NOT** be reused during the current page session after its instance closes.
- Tabs **MUST** be labelled `Cashflow 1`, `Cashflow 2`, and so on, but the label **MUST NOT** replace `instanceId` as identity.
- Activate, close, mount state, errors, and telemetry **MUST** address `instanceId`, not only `tileId`.

## 6. Fake session and entitlement contract

### 6.1 Session states

POC 1 has exactly two session states:

| State | Allowed behavior |
| --- | --- |
| Anonymous | Show the POC login screen. Registry-backed launcher and workspace are unavailable. |
| Authenticated | Show the entitled launcher and workspace. Allow entitled mount requests. |

No intermediate identity-provider state is modelled.

### 6.2 Fake login

- The user **MUST** perform one explicit `Login` action.
- Login **MUST** establish the same deterministic fake identity for every acceptance run.
- The fake session **MUST** contain a stable user ID, session pseudonym, and entitlement set.
- The entitled user **MUST** contain `cashflow.read`.
- The POC session **MUST NOT** create, parse, store, or imitate a real token.
- Session persistence across a full browser reload is not required.

### 6.3 Entitlement enforcement

- A registry entry **MUST** declare `requiredEntitlements`.
- The launcher **MUST** omit entries for which the authenticated user lacks any required entitlement.
- The host **MUST** repeat the entitlement check immediately before allocating or mounting an instance.
- A direct route **MUST NOT** mount an unentitled tile.
- Entitlement denial **MUST** produce a controlled host result and a lifecycle telemetry event; it **MUST NOT** attempt remote loading.
- Dynamic entitlement refresh and revocation are deferred.

One synthetic unentitled registry entry MAY be used for evidence. It is not a second real application and MUST NOT load a remote.

## 7. Registry contract

The POC registry remains runtime-loaded and schema-validated.

### 7.1 Required entry data

| Field | Purpose | POC rule |
| --- | --- | --- |
| `tileId` | Stable product identity | Lowercase kebab-case; unique. |
| `tenantId` | Owning tenant identity | Required; lowercase identifier. |
| `displayName` | Launcher and tab base label | Required and non-empty. |
| `remoteName` | Module Federation runtime name | Required and unique for the active registry. |
| `manifestUrl` | Runtime artifact descriptor | Valid absolute URL in the local POC. |
| `exposedModule` | Federated application export | Required and schema-valid. |
| `basePath` | POC client route | Unique, non-root path without trailing slash. |
| `contractVersion` | Application contract | Must equal the supported POC application contract. |
| `appearanceContractVersion` | Appearance contract | Must equal the supported POC appearance contract. |
| `requiredEntitlements` | Discovery and mount gate | Required array; may be empty only for an explicitly public tile. |
| `capabilities` | Existing capability negotiation | No new capability is added by POC 1. |

Owner, approved Nginx routes, lifecycle state, artifact digest, and production release metadata are target registry fields but are outside the POC 1 schema.

### 7.2 Registry behavior

- The host **MUST** validate the complete registry before using its entries.
- Duplicate tile IDs, remote names, or base paths **MUST** be rejected.
- An invalid registry **MUST** produce a bounded host error and **MUST NOT** partially mount entries.
- Registry selection **MUST** occur at runtime.
- The same host build **MUST** load a compatible changed `manifestUrl` supplied by alternate registry data.
- Hot registry refresh while a page is running is not required.

### 7.3 Application compatibility

Before rendering, the host **MUST** verify:

- remote application identity equals the registry `tileId`;
- application contract version is supported;
- appearance contract version is supported;
- the remote exposes the required application component contract.

Failure of any check **MUST** remain inside the affected instance boundary.

## 8. Workspace and lifecycle contract

### 8.1 Workspace state

The host owns:

- the ordered list of tile instances;
- `activeInstanceId`;
- per-instance load state;
- per-instance runtime handle and error state;
- monotonically increasing instance counters per tile definition.

Tenant state is not stored in the host.

### 8.2 Open

For each open request, the host **MUST** perform this logical order:

1. Resolve the tile definition.
2. Verify the authenticated session.
3. Verify entitlement.
4. Allocate a new `instanceId`.
5. Add an opening tab.
6. Load and validate the remote module.
7. Mount the application with its `instanceId`.
8. Mark the instance ready and active, or failed and closable.

Opening a tile **MUST NOT** deduplicate by `tileId`.

### 8.3 Activate and retain

- Exactly one open instance **MUST** be active when the workspace is non-empty.
- All ready instances **MUST** remain mounted until explicitly closed so their local React state is retained.
- Inactive instances **MUST** be hidden from view, keyboard focus, pointer interaction, and the accessibility tree.
- Activating an instance **MUST NOT** remount it.
- POC 1 does not define suspension, memory eviction, or background refresh policy.

### 8.4 Instance isolation

- A Cashflow filter change in one instance **MUST NOT** change another instance's filter or result set.
- Platform capabilities supplied to a tile **MUST** be bound to that instance.
- One instance's load error **MUST NOT** modify another instance's ready state.
- No shared tenant business store is allowed.

### 8.5 Close

- Close **MUST** address `instanceId`.
- Closing an inactive instance **MUST NOT** change the active instance.
- Closing the active instance **MUST** activate the most recently active remaining instance.
- If no instance remains, the host **MUST** show the empty workspace.
- Closing **MUST** unmount only the selected instance and release its instance-bound host resources.
- Existing retry behavior MAY remain for a failed instance, but retry is not a POC 1 exit requirement.

### 8.6 Routing boundary

- The active Cashflow instance MAY use `/cashflow` as the POC browser path.
- Switching between duplicate instances at the same base path does not require a URL change.
- Nested routes, refresh restoration, per-instance URLs, and history semantics are outside POC 1.
- A direct base path MAY open one entitled instance after authentication; it MUST NOT bypass entitlement.

## 9. Host lifecycle telemetry contract

POC 1 uses a typed in-memory collector. It does not send network telemetry and does not implement Ratan Design component instrumentation.

### 9.1 Required events

| Event | Required condition |
| --- | --- |
| `portal.session.login.succeeded` | Fake session established. |
| `portal.registry.load.succeeded` | Registry validated and accepted. |
| `portal.registry.load.failed` | Registry rejected. |
| `portal.tile.open.requested` | Entitled open begins and an instance is allocated. |
| `portal.tile.open.denied` | Session or entitlement denies an open before remote loading. |
| `portal.tile.mount.succeeded` | Compatible remote mounts. |
| `portal.tile.mount.failed` | Load or compatibility check fails. |
| `portal.tile.activated` | Active instance changes. |
| `portal.tile.closed` | Selected instance unmounts and closes. |

### 9.2 Required envelope data

| Data | Rule |
| --- | --- |
| Event contract version | Required for every event. |
| Event name | One of the approved POC lifecycle names. |
| Timestamp | Required and supplied by the adapter clock. |
| Correlation ID | Required; stable across one logical open/load/mount operation. |
| Session pseudonym | Required after login; not a real user identifier. |
| `tenantId` and `tileId` | Required for tile-scoped events. |
| `instanceId` | Required after allocation; absent for pre-allocation denial. |
| Outcome | Required for completion and denial events. |
| Error code | Controlled code only for failure/denial; raw payloads and stack traces are excluded from the event envelope. |

Rules:

- Event collection failure **MUST NOT** change host or tile behavior.
- No filter value, cashflow record, token, credential, or arbitrary business payload may be recorded.
- Tests **MUST** use a deterministic clock, correlation-ID source, and collecting adapter.
- Console output is not acceptance evidence.

## 10. Failure containment

- Each tile instance **MUST** have its own application error/load boundary.
- A failed instance **MUST** show a bounded `Application unavailable` state with the tile and instance identity.
- Failed instances **MUST** remain closable.
- The launcher, tabs, host appearance controls, and healthy instances **MUST** remain usable.
- A late remote resolution after an instance closes **MUST** be ignored.
- A failed or incompatible remote **MUST NOT** mutate the registry, session, or another instance.

## 11. Design and accessibility boundary

- Host login, launcher, tabs, workspace, empty state, and error state **MUST** use Ratan Design tokens and approved controls.
- Tabs **MUST** expose correct tab roles, active selection, unique accessible names, and keyboard operation.
- Inactive instance content **MUST NOT** remain focusable or announced.
- Login, launcher, close, failure, and empty states **MUST** be keyboard accessible.
- Existing light/dark and density propagation behavior **MUST** remain green.
- POC 1 does not add component-level observability functions.

## 12. Quality constraints

- Specification-driven and test-driven development are mandatory if implementation is later authorized.
- Tests MUST be written or updated before source changes.
- Affected bounded packages and applications MUST exceed 90% line and branch coverage.
- Lint MUST complete with zero warnings.
- Type checks, builds, boundary verification, and browser acceptance MUST pass.
- No production or `realworld` package identity may enter the POC dependency graph.
- No Single-SPA, SystemJS, import map, `@fm/base`, or `mfe-ratan-container` runtime dependency may enter the POC.

## 13. Acceptance and exit

POC 1 passes only when:

1. The requirements in this specification have automated evidence mapped in the test plan.
2. The primary browser journey proves login, entitlement discovery, duplicate instances, isolated retained state, activation, and instance-specific close.
3. Focused tests prove denial before loading, failure isolation, compatibility rejection, and alternate registry selection without rebuilding the host.
4. Required lifecycle events and correlation are asserted through the in-memory collector.
5. Existing appearance, standalone application, build, and architectural boundary evidence remains green.
6. No excluded capability or infrastructure is introduced.

Passing POC 1 authorizes design review of POC 2. It does not authorize production promotion, code copying into `realworld`, or legacy migration.

## 14. Review checklist

Reviewers should answer:

- Is every requirement necessary to prove the primary hypothesis?
- Is any requirement accidentally designing OpenFin, FDC3, Nginx, notification, Java, or production behavior?
- Are tile definition and tile instance identities unambiguous?
- Can instance isolation be demonstrated using the existing Cashflow filter?
- Can every telemetry event be asserted without logging business data?
- Are direct-route and entitlement behaviors safe but minimal?
- Are the exit gates objective enough to stop scope expansion?

Implementation remains unauthorized until this specification and its test plan are explicitly approved.
