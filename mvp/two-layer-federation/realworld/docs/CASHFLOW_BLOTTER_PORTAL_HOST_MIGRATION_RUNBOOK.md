# Cashflow CN to Portal Host migration runbook

Status: active runbook, updated 3 August 2026. The shared UI boundary is now
`@scdevkit/webkit`; remaining Cashflow CN compatibility debt is tracked
below and in [`CURRENT_STATE.md`](./CURRENT_STATE.md).

## Scope and status

Only the legacy Cashflow CN route is in scope. Dashboard, group management,
static administration pages, and OpenSearch are excluded.

The first MVP was a fixture-backed facsimile. It proved remote loading but did
not migrate the application. That implementation was removed. The current
remote compiles and renders the actual Cashflow CN source from
`apps/mfe-cashflow-blotter`.

Current status:

- actual Cashflow CN UI renders in Portal Host through Module Federation;
- the old Single-SPA/SystemJS runtime is not requested;
- actual list/detail/workflow code and Redux state are present;
- local development serves production-shaped list, detail, field, custom
  filter, custom view, notification, and representative action contracts on
  the unchanged legacy routes;
- the hosted acceptance test proves the actual AG Grid, two Cashflow records,
  saved filter/view controls, and Cashflow detail composition;
- production service and entitled workflow parity are not yet accepted;
- Cashflow-used Ratan implementation still needs extraction from the legacy
  repository boundary.

The governing change is
`openspec/changes/migrate-cashflow-cn-to-portal-host`.

The full original-source plan, including decomposition of
`apps/mfe-ratan-container`, ownership rules, phased exit gates, source-update
procedure, and retirement criteria, is recorded in
[`ORIGINAL_CASHFLOW_RATAN_PORTAL_MIGRATION_PLAN.md`](./ORIGINAL_CASHFLOW_RATAN_PORTAL_MIGRATION_PLAN.md).

## Source mapping

| Legacy source                               | Realworld destination                               | Treatment                                                                    |
| ------------------------------------------- | --------------------------------------------------- | ---------------------------------------------------------------------------- |
| `apps/mfe-cashflow-blotter/src/Cashflow_CN` | `apps/mfe-cashflow-blotter-mvp/src/Cashflow_CN`     | copied as the migration baseline; targeted runtime fixes only                |
| `apps/mfe-cashflow-blotter/src/Root`        | `apps/mfe-cashflow-blotter-mvp/src/Root`            | copied Cashflow-owned bridge; legacy package names resolve to local adapters |
| `apps/mfe-cashflow-blotter/src/generated`   | `apps/mfe-cashflow-blotter-mvp/src/generated`       | copied generated types required by Cashflow                                  |
| `Cashflow_Dashboard/Main/common/utils.ts`   | same relative path in MVP                           | copied single transitive date helper                                         |
| legacy route/Single-SPA lifecycle           | `src/migrated-entry.tsx`, `src/application.tsx`     | replaced by a federated React entry                                          |
| `@fm/base`                                  | `src/compat/base.tsx`                               | compile-time Portal Host compatibility adapter                               |
| `@fm/ratan_container`                       | `src/compat/ratan-container.ts`                     | compile-time facade for Cashflow-used exports                                |
| dynamic trade/cashflow `System.import`      | `related-applications.tsx`, `quick-search-items.ts` | typed host navigation handoff                                                |
| Node-oriented `stompjs` entry               | `src/compat/stomp.ts`                               | browser STOMP wrapper                                                        |

The migration copies the source so that the new workspace has visible,
reviewable ownership. The Cashflow entry itself is not an alias back to the
legacy application.

## Federation topology

```text
portal-host :9200
└── registry id cashflow-blotter
    └── mfe_cashflow_blotter :9206 / ./application
        └── MigratedCashflowCnEntry
            └── Cashflow_CN/Main (actual Redux application)
```

`react`, `react-dom`, and their subpaths are singleton shared dependencies in
both layers. The subpath shares are required because the legacy tree imports
React DOM client/runtime modules as well as the package root.

The Ratan container is not a runtime layer in this topology. Portal Host does
not register its manifest, the browser acceptance stack does not start port
`9205`, and Cashflow declares no Module Federation `remotes`. Reusable Ratan UI
comes from `@scdevkit/webkit`, `@fm/ratan-data-grid`, and temporarily bundled
migration adapters while the remaining legacy Ratan surface is extracted.

## Implementation steps

1. Characterize the legacy route and record every shell, Ratan, service,
   generated-type, global, workflow, and dynamic-module dependency.
2. Copy `Cashflow_CN` and Cashflow-owned support into the realworld workspace.
3. Point the federated application at the copied `Cashflow_CN` entry and retain
   its Redux `Main` root.
4. Alias legacy shell imports to local compile-time adapters. The shell adapter
   supplies identity, config, transport, theme, telemetry, navigation, FDC3,
   storage, and control surfaces expected by the source.
5. Replace application-owned `System.import` calls with host navigation
   handoffs.
6. Add the Ratan facade and initialize the expected static configuration.
7. Extract date formats into a cycle-free module to remove a runtime temporal
   dead-zone in the bundled graph.
8. Disable remote lazy compilation. Portal Host requests chunks from the
   remote origin; host-origin lazy-compile URLs otherwise return 404.
9. Share React package roots and subpaths as singletons to prevent two React
   dispatchers across host and remote.
10. Remove the Ratan inventory application from the Portal Host registry and
    browser startup graph; keep shared UI behind build-time package imports.
11. Add serve-only Portal Host contract middleware on the existing REST and
    GraphQL routes so the actual application receives deterministic local data.
    The middleware is excluded from production builds.
12. Register the Cashflow remote in Portal Host and validate the route at
    `/cashflow-blotter`.

## Runtime issues found and resolved

| Failure                                    | Cause                                                             | Migration fix                                   |
| ------------------------------------------ | ----------------------------------------------------------------- | ----------------------------------------------- |
| `ReactCurrentDispatcher` failure           | React/React DOM subpaths were not shared consistently             | singleton root and trailing-slash shares        |
| invalid hook call during module evaluation | legacy `getUser()` invoked hook-backed shell state at import time | pure module-level identity bridge               |
| `ratanConfig` undefined                    | legacy global side effect was absent                              | initialize Ratan static configuration in facade |
| `process` undefined                        | copied code referenced compile-time environment globals           | Rsbuild source definitions                      |
| `DateFormat` temporal dead zone            | legacy circular module became eager in the new graph              | cycle-free `dateFormats.ts`                     |
| `Provider.useContext` missing              | legacy base exposed a provider namespace, not only a component    | compatible provider/context namespace           |
| `stomp.over` missing / Node `net`          | package selected its Node entry                                   | browser STOMP adapter                           |
| remote chunk 404                           | lazy compilation generated host-relative compilation URLs         | disable remote lazy compilation                 |
| trade module runtime dependency            | Ratan quick search used `System.import("@fm/ratan_trades")`       | local quick-search adapter                      |

## Boundary verification

Run the production build before the boundary check:

```bash
npm run build
npm run check:boundaries
```

The check scans all migrated source for application-owned Single-SPA,
SystemJS, and import-map calls. It scans built assets for legacy runtime
package names. Module Federation itself contains a generic SystemJS loader
string for its supported remote formats; this framework code is not a
Cashflow runtime request and is therefore not treated as an application leak.

The expected built result is clean for:

```text
@fm/base
@fm/ratan_container
@fm/ratan_cashflow
@fm/ratan_trades
single-spa
```

## Verification commands

From `apps/mfe-cashflow-blotter-mvp`:

```bash
npm test -- --runInBand
npm run lint
npm run typecheck:shell
npm run typecheck:application
npm run build
npm run check:boundaries
```

The shell typecheck targets migration-owned federation and compatibility code.
The application typecheck follows the actual `Cashflow_CN` entry graph, owns
its ambient declarations locally, and checks it against the declared Ratan
facade. The build runs both checks after compiling assets and CSS. Restoring
strict-null checking, widening legacy lint coverage, and replacing the
temporary Ratan facade remain explicit follow-up cohorts.

Portal Host verification:

1. start Portal Host on `9200` and Cashflow remote on `9206`;
2. sign in with the local test credentials;
3. open **New tile → Cashflow CN**;
4. confirm the real filter panel appears (Cashflow ID, Trade ID, value-date
   range, currency, product taxonomy, counterparty, booking entity,
   beneficiary, state/sub-state, amount, and custom search/view);
5. confirm the grid reports `2/2` and contains `CF-CN-24001` and
   `CF-CN-24002`;
6. open **Filters** and confirm `USD pending verification`;
7. open **Views** and confirm `Operations essentials`;
8. double-click `CF-CN-24001` and confirm Trade Details and Cashflow Details
   render `TRD-CN-90001`, `USD`, and `1,250,000`;
9. confirm `mf-manifest.json` is loaded from `9206`;
10. confirm there are no Single-SPA, import-map, or legacy MFE network
    requests.

The deterministic data is installed by Portal Host only in Vite serve mode.
Production builds keep the application's existing GraphQL and REST routes and
do not contain a fixture middleware path.

## Remaining work before production confidence

1. Approve the sanitized local contracts against captured integration-service
   responses and connect the production service.
2. Exercise grid paging, notifications, export,
   and at least one entitled maker/checker workflow in Portal Host.
3. Extract every Cashflow-used Ratan module into realworld packages; remove the
   temporary `@legacy-ratan` source alias. The identity/permission,
   feature-enable, and logging cohort is already Cashflow-owned and covered by
   compatibility tests.
4. Restore strict-null checking and widen lint coverage across inherited code.
5. Reduce the approximately 8.5 MB production bundle.
6. Validate identity, authorization, FDC3, STOMP, GraphQL, REST, and environment
   contracts against the production platform.
7. Add integration rollback telemetry and failure thresholds.

## Cutover and rollback

Cut over by changing the deployed Portal Host registry entry to the accepted
Cashflow remote manifest version. Keep the legacy route available during the
acceptance window. Roll back by restoring the prior registry version; the
legacy application source is unchanged by this migration.
