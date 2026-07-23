# Portal POC 1 Test Plan

## 1. Status

- **Status:** Proposed for test-strategy review
- **Implementation:** Not authorized
- **Specification:** [PORTAL_POC1_SPEC.md](./PORTAL_POC1_SPEC.md)
- **Method:** Specification-driven development followed by strict TDD

This plan identifies required evidence and test order. It does not authorize creation or modification of test or source files.

## 2. Test principles

1. Tests are derived from requirement IDs in this plan, not from implementation structure.
2. The first implementation change, if later authorized, must be a failing test.
3. Contract and state-model tests precede React component tests.
4. Component tests precede browser tests.
5. Each test proves one behavior or one closely related state transition.
6. Mocks remain at external boundaries: Module Federation runtime, clock, ID source, registry fetch, and telemetry collector.
7. Cashflow's existing filter supplies the instance-local state evidence; no demo counter or new business behavior is introduced.
8. OpenFin, FDC3, Nginx, backend, notification, component-observability, and scaffold tests are prohibited in POC 1.

## 3. Requirement catalogue

### 3.1 Session and entitlement

| ID | Requirement |
| --- | --- |
| SES-001 | Anonymous users see the fake login screen and cannot access launcher/workspace behavior. |
| SES-002 | Explicit login establishes the deterministic fake session and entitlement set. |
| ENT-001 | Launcher displays the Cashflow tile when `cashflow.read` is present. |
| ENT-002 | Launcher omits a synthetic tile whose required entitlement is absent. |
| ENT-003 | Mount performs a second entitlement check. |
| ENT-004 | Direct routing cannot mount an unentitled tile. |
| ENT-005 | Denial occurs before Module Federation registration/loading. |

### 3.2 Registry and compatibility

| ID | Requirement |
| --- | --- |
| REG-001 | Registry accepts a valid entry with tile, tenant, artifact, contract, base-path, entitlement, and capability data. |
| REG-002 | Registry rejects duplicate tile IDs, remote names, and base paths. |
| REG-003 | Registry rejects malformed identifiers, URLs, paths, contracts, or entitlements. |
| REG-004 | Invalid registry produces a bounded host error and no partial launcher. |
| REG-005 | Alternate runtime registry data selects a compatible changed manifest URL without rebuilding the host. |
| CMP-001 | Remote identity must match registry `tileId`. |
| CMP-002 | Unsupported application or appearance contract fails before application rendering. |
| CMP-003 | Required remote application export must exist. |

### 3.3 Instance lifecycle

| ID | Requirement |
| --- | --- |
| INS-001 | Every open allocates a new monotonically increasing instance ID for the tile. |
| INS-002 | Opening the same tile twice creates `cashflow-1` and `cashflow-2`; it does not deduplicate by tile ID. |
| INS-003 | Tabs have unique accessible names `Cashflow 1` and `Cashflow 2`. |
| INS-004 | Exactly one non-empty workspace instance is active. |
| INS-005 | Switching tabs activates by instance ID without remounting either ready instance. |
| INS-006 | Inactive instance content is not visible, focusable, pointer-interactive, or exposed in the accessibility tree. |
| INS-007 | Different Cashflow filters and result sets remain isolated and retained across tab switches. |
| INS-008 | Closing an inactive instance leaves the active instance unchanged. |
| INS-009 | Closing the active instance activates the most recently active remaining instance. |
| INS-010 | Closing the last instance shows the empty workspace. |
| INS-011 | Closed instance IDs are not reused during the page session. |

### 3.4 Telemetry

| ID | Requirement |
| --- | --- |
| TEL-001 | Successful fake login emits `portal.session.login.succeeded`. |
| TEL-002 | Valid and invalid registry outcomes emit the matching registry event. |
| TEL-003 | Entitled open emits requested, mount succeeded, and activated events with one operation correlation ID. |
| TEL-004 | Denied open emits `portal.tile.open.denied` and no mount event. |
| TEL-005 | Load or compatibility failure emits `portal.tile.mount.failed` with a controlled error code. |
| TEL-006 | Activation and close events identify the correct instance. |
| TEL-007 | Event envelope contains required contract, time, session, tile, tenant, instance, outcome, and correlation data. |
| TEL-008 | Event collection failure does not change UI or lifecycle behavior. |
| TEL-009 | Events contain no Cashflow filter values, records, tokens, credentials, or arbitrary payloads. |

### 3.5 Failure, design, and boundaries

| ID | Requirement |
| --- | --- |
| FLR-001 | Failure in one instance does not crash the host or a healthy instance. |
| FLR-002 | Failed instance shows a bounded error with tile/instance identity and remains closable. |
| FLR-003 | Late remote resolution after close is ignored. |
| DES-001 | Login, launcher, tabs, close, error, and empty states use approved Ratan Design foundations. |
| DES-002 | Existing appearance propagation, persistence, density, focus, and standalone rendering remain green. |
| ARC-001 | Runtime graph remains direct `Portal Host -> Tile`. |
| ARC-002 | No legacy runtime or design-system runtime remote appears in network/build evidence. |
| ARC-003 | POC dependencies remain isolated from `realworld`. |
| SCP-001 | No explicitly excluded POC 2+ capability or production infrastructure is introduced. |

## 4. TDD implementation order

If implementation is later authorized, tests must be added in this order.

### Phase 1 — Contract tests

Target area: `packages/platform-contracts-poc`.

Write failing tests for:

1. Registry entry `tileId`, `tenantId`, and `requiredEntitlements` validation.
2. Duplicate tile ID, remote name, and base-path rejection.
3. Application manifest identity compatibility with `tileId`.
4. Typed lifecycle telemetry envelope validation.
5. Allowed event names and controlled failure codes.

Exit: all new contract tests fail for the expected missing contract behavior before contract source changes.

### Phase 2 — Pure host state tests

Target area: the smallest host-owned session/workspace state module.

Write failing tests for:

1. Anonymous and authenticated fake session transitions.
2. Entitlement filtering and pre-mount denial.
3. Monotonic per-tile instance allocation.
4. Duplicate open behavior.
5. Active-instance selection.
6. Closing inactive, active, and final instances.
7. Instance IDs never being reused.

Exit: state behavior is fully specified without rendering React or loading a remote.

### Phase 3 — Telemetry adapter tests

Target area: host lifecycle telemetry adapter and collecting test double.

Write failing tests for:

1. Deterministic clock and correlation IDs.
2. Operation-level correlation across requested/mount/activate.
3. Correct instance attribution.
4. Controlled error codes.
5. Payload allow-listing and sensitive-data exclusion.
6. Collector failure isolation.

Exit: lifecycle events can be asserted without console spies.

### Phase 4 — Portal component tests

Target areas: Portal entry/login, launcher, workspace, tabs, and remote boundary.

Write failing tests for:

1. Anonymous login screen and inaccessible launcher.
2. Login revealing only entitled registry entries.
3. Direct unentitled route denial without runtime calls.
4. Duplicate Cashflow tabs and unique instance props.
5. Both ready remotes staying mounted while only one is interactive/accessible.
6. Tab switching without remount.
7. Close behavior by instance ID.
8. One failed and one healthy instance coexisting.
9. Late resolution after close remaining ignored.

Exit: component behavior passes using a fake Module Federation runtime.

### Phase 5 — Cashflow isolation regression

Target area: federated Cashflow application component tests.

Prove that two mounted application roots with different `instanceId` props maintain independent filter and selection state. Do not change the domain UI solely to make the test easier.

### Phase 6 — Browser acceptance

Target area: `tests/e2e`.

Add the primary portal-core journey and focused evidence cases described in section 6. Browser tests come last because the lower layers must already identify failures precisely.

## 5. Unit and component test matrix

| Proposed test group | Primary requirement coverage |
| --- | --- |
| Registry schema and compatibility tests | REG-001–REG-005, CMP-001–CMP-003 |
| Fake session tests | SES-001–SES-002, TEL-001 |
| Entitlement selector/guard tests | ENT-001–ENT-005, TEL-004 |
| Workspace state tests | INS-001–INS-005, INS-008–INS-011 |
| Workspace render/accessibility tests | INS-003–INS-006, DES-001 |
| Instance isolation component test | INS-005–INS-007 |
| Lifecycle telemetry tests | TEL-001–TEL-009 |
| Remote boundary tests | FLR-001–FLR-003, CMP-001–CMP-003 |
| Existing appearance/design tests | DES-002 |
| Boundary verification | ARC-001–ARC-003, SCP-001 |

Exact filenames are an implementation detail and should follow the smallest owning module. Existing tests should be extended when they already own the behavior; parallel duplicate suites should not be created.

## 6. Browser acceptance suite

### 6.1 Journey A — Portal core

This is the primary user journey.

1. Navigate to the host root.
2. Verify the login screen is present and the application launcher is absent.
3. Select `Login`.
4. Verify Cashflow is visible and the synthetic unentitled entry is absent.
5. Open Cashflow and verify tab `Cashflow 1` and application instance `cashflow-1`.
6. In Cashflow 1, set filter `USD`; verify two records.
7. Open Cashflow again and verify tabs `Cashflow 1` and `Cashflow 2`, with instance `cashflow-2` active.
8. In Cashflow 2, set filter `EUR`; verify one record.
9. Activate `Cashflow 1`; verify filter `USD` and two records are retained.
10. Activate `Cashflow 2`; verify filter `EUR` and one record are retained.
11. Close `Cashflow 2` by its unique close control.
12. Verify `Cashflow 1` is active, still mounted, still filtered to `USD`, and usable.
13. Close `Cashflow 1`; verify the empty workspace.
14. Open Cashflow again; verify the new instance is `cashflow-3`, proving IDs are not reused.
15. Read the in-memory evidence adapter and verify the expected lifecycle events, instance IDs, outcomes, and correlations.

### 6.2 Journey B — Entitlement and direct route denial

1. Supply a registry containing Cashflow and one synthetic unentitled entry.
2. Login with the deterministic fake user.
3. Verify the synthetic entry is absent.
4. Navigate directly to its base path.
5. Verify no remote registration or load request occurs.
6. Verify a controlled denial state and `portal.tile.open.denied` event.

### 6.3 Journey C — Failure isolation

1. Login and open healthy Cashflow 1.
2. Configure the next Cashflow manifest request to fail.
3. Open Cashflow again, creating failed instance `cashflow-2`.
4. Verify Cashflow 1 remains mounted, activatable, and retains its state.
5. Verify Cashflow 2 displays `Application unavailable` and remains closable.
6. Verify `portal.tile.mount.failed` identifies `cashflow-2` and uses a controlled error code.
7. Close Cashflow 2 and verify Cashflow 1 remains usable.

Existing retry behavior may receive regression coverage but is not required for POC 1 exit.

### 6.4 Journey D — Registry selection without host rebuild

1. Use the unchanged host build.
2. Fulfil `registry.json` with a compatible alternate Cashflow `manifestUrl`, identifiable as release B.
3. Login and open Cashflow.
4. Verify the release-B manifest URL is requested and the application mounts.
5. Verify no legacy runtime or design-system remote request occurs.

### 6.5 Journey E — Compatibility and host containment

1. Use registry data with an unsupported application or appearance contract.
2. Login and open Cashflow.
3. Verify application content never renders.
4. Verify the instance displays a bounded compatibility error and remains closable.
5. Verify the launcher and host controls remain usable.
6. Verify the controlled mount-failure telemetry event.

## 7. Telemetry assertions

The collecting adapter must permit tests to query events without exposing a production-like global debug API.

For Journey A, assert at minimum:

- one successful login event;
- one successful registry event;
- three distinct open-operation correlation IDs;
- mount success for `cashflow-1`, `cashflow-2`, and `cashflow-3`;
- activation events identifying the selected instance;
- close events for `cashflow-2` and `cashflow-1`;
- no filter values, cashflow IDs, record data, tokens, or arbitrary payloads.

Time and IDs must be deterministic in unit/component tests. Browser tests may assert schema and relationships rather than literal timestamp values.

## 8. Accessibility evidence

Automated component and browser evidence must verify:

- unique tab accessible names;
- correct `tablist`, `tab`, and selected-state semantics;
- keyboard activation and close controls;
- visible focus;
- inactive instances excluded from focus and accessibility traversal;
- error and denial states announced appropriately;
- login, launcher, and empty workspace operable without a pointer;
- no duplicate element IDs across Cashflow instances.

An automated accessibility engine MAY supplement these assertions but does not replace behavioral keyboard tests.

## 9. Architecture and network evidence

The browser suite and boundary script must prove:

- the only runtime application composition is `Portal Host -> Cashflow`;
- the Cashflow Module Federation manifest and chunks originate from the configured POC remote;
- registry release B is selected at runtime;
- no Single-SPA, SystemJS, import map, `@fm/base`, or Ratan container resource is requested;
- no Ratan Design runtime remote is requested;
- no OpenFin, FDC3, Nginx control-plane, backend, WebSocket, notification broker, or enterprise telemetry integration is introduced;
- POC workspaces do not import `realworld` packages.

## 10. Required verification commands

Run from the repository root if implementation is later authorized:

```bash
npm run poc:test
npm run poc:build
npm run poc:lint
npm run poc:verify:boundaries
npm run poc:check
npm run poc:test:e2e
```

The final handoff must record command results, coverage for affected bounded workspaces, and any intentionally retained non-acceptance behavior.

## 11. Entry gates for implementation

Implementation may begin only after:

1. The constitution, decision register, this specification, and this test plan are approved.
2. Requirement IDs and acceptance journeys have no unresolved product decision.
3. The accepted registry field migration from current `id` to `tileId` is reflected consistently in all planned tests.
4. The accepted strategy for retaining inactive mounted instances is reflected consistently in lifecycle and accessibility tests.
5. The accepted lifecycle telemetry event names and required envelope fields are reflected consistently in contract and acceptance tests.
6. The working tree is reviewed so unrelated user changes remain untouched.

## 12. Exit gates

POC 1 is complete only when:

- all requirement IDs have passing automated evidence;
- affected line and branch coverage exceed 90%;
- lint completes with zero warnings;
- type checks and production builds pass;
- boundary verification passes;
- all five browser journeys pass reliably;
- excluded-capability checks pass;
- no implementation exists under `realworld`;
- evidence is reviewed against the primary hypothesis;
- failures and discoveries are recorded as decisions rather than hidden by added scope.

Passing tests do not automatically authorize production promotion or POC 2 implementation.
