# Production two-layer pilot acceptance

Status: historical pilot evidence. The architecture remains valid, but package,
test, bundle, and UI details are superseded by the 3 August 2026
[`current-state record`](../../../docs/CURRENT_STATE.md).

This evidence originally covered `@fm/portal-host@1.0.0` and
`@fm/mfe-cashflow@1.0.0` consuming the first production platform/design
packages. The historical `*-poc` workspaces were neither imported nor loaded.

## Automated acceptance

| Gate                             | Result                                                                                |
| -------------------------------- | ------------------------------------------------------------------------------------- |
| Cashflow unit/component tests    | 7 passed; 100% statements, branches, functions, and lines                             |
| Portal host unit/component tests | 10 passed; 95.07% statements, 83.78% branches, 93.1% functions, 95.87% lines          |
| Lint and TypeScript              | Both deployables passed independently                                                 |
| Production builds                | Contracts, SDK, design system, Cashflow remote, and host passed in dependency order   |
| Runtime boundary scan            | Two layers; React/ReactDOM only singleton shares; no POC or legacy runtime references |
| Browser acceptance               | 4 passed in headless Chrome                                                           |
| OpenSpec                         | Strict validation passed before final acceptance                                      |

The browser journeys cover registry bootstrap, direct remote loading, filter/select/details/notification behavior, host-owned live theme and density, persisted appearance, nested-route refresh, close/reopen state reset, standalone application execution, and remote failure/retry.

## Build evidence

| Deployable           | Uncompressed total | Gzip total | Notable entry                             |
| -------------------- | -----------------: | ---------: | ----------------------------------------- |
| Cashflow application |           775.5 KB |   233.1 KB | `remoteEntry.js`: 258.3 KB / 78.0 KB gzip |
| Portal host          |           509.2 KB |   153.3 KB | host entry: 118.3 KB / 33.4 KB gzip       |

The duplicated deployable-local MUI/Emotion cost is accepted for the first pilot because it preserves independent design-package rollout. A later optimization must prove measurable benefit, a compatible version matrix, and safe rollback before adding any design-stack singleton sharing.

## Proven ownership boundary

- Host: registry bootstrap, compatibility, global appearance persistence, navigation, notifications, telemetry, workspace lifecycle, route composition, and failure containment.
- Application: Cashflow records, filters, selection, detail composition, local state, local `DesignSystemProvider`, and standalone behavior.
- Packages at the time: versioned contracts, capability client, semantic
  tokens, MUI adapter, and bounded primitives. Current active UI composition is
  provided by `@scdevkit/webkit`.
- Not runtime layers: `root-config`, `base`, `mfe-ratan-container`, Ratan component/function packages, MUI, and Emotion.

## First legacy domain/grid cohort

Migrate the read-only **Cashflow Authorization Limits list and details view** first from `apps/mfe-cashflow-blotter/src/Cashflow_Authorization_Limits` into the new `@fm/mfe-cashflow` application.

Why this cohort:

- It is a bounded business journey with a small record model: profile, currency, limitation, and status/action metadata.
- Its list uses the legacy Ratan `DataGrid` wrapper over AG Grid, so it proves the required grid-adapter strategy without beginning with the much larger Cashflow CN workflow graph.
- Double-click/details behavior gives a meaningful accessibility, routing, and selection acceptance surface.
- Create, edit, delete, approve, and reject workflows can remain explicitly deferred until list/detail parity is stable.

Entry criteria for that cohort:

1. Define a package-level, versioned `RatanDataGrid` adapter API that owns AG Grid theme/token mapping but does not export raw grid instances as the default component contract.
2. Keep `ag-grid-community` and `ag-grid-react` application/build dependencies, never host capabilities or federation remotes.
3. Capture behavior tests for sorting, pagination, keyboard navigation, row identity, selection, double-click details, formatting, loading, empty, and error states before moving code.
4. Replace Ant messages/modals and legacy Ratan imports only inside the selected cohort; do not attempt a whole-application library rewrite.
5. Require visual/keyboard evidence in light/dark and compact/comfortable appearances and a bundle/license check for the chosen AG Grid edition.

Exit criteria:

- List/detail behavior matches the captured legacy contract with no `src/Root/import/ratancomponents`, Ant, `@fm/base`, or `mfe-ratan-container` dependency.
- The cohort runs standalone and through the new host, uses production appearance/platform contracts, and passes its browser matrix.
- Mutation/approval workflows remain routed to legacy until their own explicit cohort is accepted.
