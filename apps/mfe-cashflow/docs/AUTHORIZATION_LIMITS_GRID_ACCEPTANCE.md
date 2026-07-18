# Authorization Limits grid cohort acceptance

This cohort migrates only the read-only Authorization Limits list/details behavior into `@fm/mfe-cashflow`. The unchanged legacy application remains the fallback for production data, entitlements, mutations, and maker/checker approvals.

## Package and license decision

| Item | Decision |
| --- | --- |
| Adapter | `@fm/ratan-data-grid@1.0.0` |
| Grid runtime | `ag-grid-community@32.3.0` and `ag-grid-react@32.3.0` |
| Grid license | MIT (Community edition) |
| Enterprise modules | None installed, imported, exported, or required |
| Delivery | Build-time package and application dependency; not a host capability or federation remote |
| Public API | Bounded rows, columns, identity, selection, activation, pagination, and infrastructure states |
| Deliberately blocked | Raw `GridApi`, `GridOptions`, `AgGridReact`, arbitrary grid options, enterprise modules |

## Automated evidence

| Gate | Result |
| --- | --- |
| Grid package tests | 6 passed; 100% statements/functions/lines, 97.14% branches |
| Cashflow tests after cohort | 12 passed; 96.22% statements, 86.04% branches, 93.61% functions, 96.55% lines |
| Portal regression tests | 10 passed; prior host acceptance retained |
| Packed package consumer | JavaScript, declarations, CSS export, peers, and blocked internal subpath passed |
| Boundary scan | No Ant, legacy Ratan imports, `src/Root`, enterprise grid, POC, or legacy runtime dependency |
| Browser matrix | Existing four production-pilot journeys plus Authorization Limits grid journey passed |

The grid journey verifies filtering, Community sorting, client pagination, pointer double-click, Enter-key activation, details/back routing, mutation-deferral messaging, and compact/comfortable semantic row heights. Loading, empty, error/retry, selection, unknown details, and standalone repository behavior are covered at component level.

## Bundle evidence

| Cashflow remote | Before grid cohort | After grid cohort | Delta |
| --- | ---: | ---: | ---: |
| Uncompressed total | 775.5 KB | 1,893.9 KB | +1,118.4 KB |
| Gzip total | 233.1 KB | 500.5 KB | +267.4 KB |

The isolated AG Grid JavaScript chunk is 1,111.8 KB / 294.3 KB gzip; its Community CSS chunk is 224.1 KB / 37.1 KB gzip. The aggregate gzip delta is smaller than the sum because earlier shared chunks and explicit production token CSS changed independently.

This size is accepted only for the bounded cohort. Before adding another grid-heavy application, measure route-level lazy loading and evaluate AG Grid module registration/tree-shaking. Do not solve size by sharing AG Grid or the design stack through Module Federation without a tested version/rollback matrix.

## Migrated behavior

- Typed profile, USD currency, numeric limitation, status, version, and audit metadata.
- Deterministic loading, empty, error/retry, and ready repository states.
- Filter, sort, paginate, select, double-click/Enter details, nested refresh, and back navigation.
- Scoped semantic AG Grid colors, focus, selection, compact row height, and comfortable row height.
- Host-owned appearance and application-owned repository/domain composition.

## Explicitly deferred

- Create, edit, delete, approve add/edit/delete, and reject add/edit/delete.
- Ant modal/message/form replacement for those mutation workflows.
- Production Authorization Limits service integration, authenticated principal delivery, audit submission, and concrete optimistic/concurrent update behavior. Pure entitlement and service ports are now specified and verified in [mutation ports](AUTHORIZATION_LIMITS_MUTATION_PORTS.md), but are not wired to the UI.
- User column preferences, export, enterprise filters, sidebars, ranges, or other AG Grid Enterprise features.

## Production cutover blockers

1. Replace deterministic fixtures with an approved application repository backed by the production service.
2. Supply authentication/entitlement and telemetry capabilities through versioned host contracts.
3. Capture legacy-vs-new parity fixtures for sorting, pagination, row identity, formatting, details, and error semantics.
4. Define a route/cohort canary, SLO, legacy fallback, and registry rollback through the separate production-delivery program.
5. Complete accessibility and visual review against real record volume and supported browsers/OpenFin.

Until every blocker is closed, the legacy Authorization Limits route remains authoritative and unchanged.
