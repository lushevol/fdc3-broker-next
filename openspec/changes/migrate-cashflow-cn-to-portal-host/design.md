## Context

`Cashflow_CN` is a 250-file React/Redux workflow. Its real entry creates the legacy Redux store and renders `Main`, which initializes business-field metadata before composing quick search, preset/custom queries, quick filters, grid footer/export, the Cashflow grid, details, notifications, and maker/checker workflow dialogs.

The source itself imports application-owned utilities plus four legacy boundary classes:

1. `src/Root/import` / `Import` — `@fm/base` shell services, router, controls, analytics, FDC3, and dispatch.
2. `src/Root/import/ratancomponents`, `ratanutils`, and `ratandialog` — runtime exports from `@fm/ratan_container`.
3. Root analysis, RTK Query, notification, feature-flag, field, and query helpers.
4. `System.import("@fm/ratan_trades")` and `System.import("@fm/ratan_cashflow")`.

The current realworld implementation is a fixture-backed rewrite and is not source migration. It will be removed.

## Goals / Non-Goals

**Goals:**

- Make the actual Cashflow CN component tree the federated application rendered by Portal Host.
- Preserve the existing Redux-driven state and production service semantics during the composition migration.
- Replace runtime shell/container dependencies with versioned build-time packages and typed Portal Host/application adapters.
- Preserve the existing user journeys and entitled actions, with fixtures used only for local/test adapters.
- Make source provenance and forbidden-runtime checks mechanical.

**Non-Goals:**

- Migrating other routes from `mfe-cashflow-blotter`.
- Retaining a fixture facsimile as the production federated entry.
- Loading the legacy base or Ratan container remote behind an alias.
- Rewriting all Cashflow CN business logic during the composition migration.

## Decisions

### 1. Migrate source before refactoring behavior

The actual `Cashflow_CN` source will first compile through an explicit compatibility layer. Business logic remains recognizable and parity-testable. Once the true application renders, adapters can be replaced incrementally with realworld packages.

The prior clean-room vertical slice is rejected because it proves only federation mechanics and drops most production behavior.

### 2. Use compile-time adapters, never runtime remote aliases

Legacy bridge module specifiers will resolve to Cashflow-owned adapter modules during the transition. Those adapters may import extracted build-time packages, platform contracts, or application utilities. They may not import `@fm/base`, `@fm/ratan_container`, Single-SPA, or SystemJS.

Completion requires migrated source under the realworld/Cashflow ownership boundary. Direct compilation from `apps/mfe-cashflow-blotter` is a temporary characterization mechanism, not the final deployment layout.

### 3. Preserve Redux and service contracts initially

The legacy store, actions, reducers, GraphQL query generation, REST actions, field configuration, and feature gates remain during the first parity milestone. Host identity, transport, telemetry, notification-center, and configuration are injected through application adapters.

Replacing them with a smaller repository/state model is deferred until after parity.

### 4. Extract required Ratan implementation into build-time ownership

Cashflow-used Ratan components/utilities will move to versioned realworld packages or Cashflow-owned adapters. Importing source from `apps/mfe-ratan-container` may be used to identify required exports, but the finished remote cannot depend on the Ratan container application or its runtime namespace.

### 5. Replace dynamic modules with typed actions

Trade details, cashflow details, and un-net flows currently loaded through `System.import` become typed action interfaces. Implementations can render a local migrated component or request host navigation through a versioned capability.

### 6. Test provenance and parity

Tests will prove that the federated entry imports the migrated legacy root, that key legacy components/workflows are present, and that the fixture facsimile is absent. Browser acceptance will exercise the actual quick-search/grid/details flow and inspect network requests and browser errors.

## Risks / Trade-offs

- [Large dependency surface] → Compile the real entry early and resolve failures by boundary class rather than rewriting screens.
- [React 18-era UI under React 19 host] → Keep React singleton compatibility under test; use imperative isolation only if a concrete incompatibility appears.
- [Ratan components are not yet packaged] → Extract only the transitive Cashflow-used surface into build-time packages with source parity tests.
- [Production APIs unavailable locally] → Provide transport-level fixtures matching captured contracts without changing the production adapter or UI state machine.
- [Legacy globals and generated types] → Make each global explicit in compatibility typings and eliminate it when its owning module is migrated.

## Migration Plan

1. Wire the realworld build to the actual Cashflow CN entry and record all unresolved modules.
2. Add explicit compatibility adapters for shell/platform concerns.
3. Extract or migrate the required Ratan UI/utilities.
4. Replace dynamic SystemJS calls.
5. Move the proven source into realworld Cashflow ownership and remove the temporary linkage.
6. Remove the fixture facsimile.
7. Run parity, boundary, build, and hosted browser acceptance.

Rollback remains a Portal Host registry/version rollback; the legacy application is unchanged until cutover.
