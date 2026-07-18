## Why

The production two-layer pilot is accepted, but it uses a native table and therefore does not prove the portal’s dominant data-grid boundary. The legacy Authorization Limits list/details journey is the smallest real Cashflow cohort that can validate an AG Grid adapter, design tokens, independent federation, and staged legacy coexistence without also migrating mutation and approval workflows.

## What Changes

- Add `@fm/ratan-data-grid@1.0.0` as a versioned adapter package separate from the foundational `@fm/ratan-design` package.
- Define a bounded generic row/column API, semantic grid states, token-aligned AG Grid theme, row identity, sorting, pagination, keyboard behavior, and activation callbacks without making raw AG Grid configuration the default application contract.
- Add a read-only Authorization Limits list and details route to `@fm/mfe-cashflow`, using captured legacy record semantics and the new adapter.
- Add loading, empty, error, filtering, sorting, pagination, selection, double-click/keyboard activation, details, and responsive appearance acceptance tests.
- Keep create, edit, delete, approve, reject, legacy services, Ant messages/modals, and legacy Ratan runtime imports out of this cohort.
- Preserve the legacy Authorization Limits route as rollback/fallback; this change does not edit `apps/mfe-cashflow-blotter`.

## Capabilities

### New Capabilities

- `ratan-data-grid-adapter`: Versioned accessible AG Grid adapter API, semantic theming, state handling, dependency boundaries, and release compatibility.
- `authorization-limits-readonly-cohort`: Read-only Authorization Limits list/filter/sort/page/select/details behavior inside the new independent Cashflow application.
- `grid-cohort-conformance`: Behavior parity evidence, appearance/browser matrix, forbidden legacy imports, bundle/license evidence, and explicit cohort exit gates.

### Modified Capabilities

None.

## Impact

- Adds `mvp/two-layer-federation/realworld/packages/ratan-data-grid` with AG Grid community/react peer dependencies and package tests.
- Extends `mvp/two-layer-federation/realworld/apps/mfe-cashflow` routes and domain composition; the host and platform contract do not change.
- Adds new production-pilot browser coverage and dependency-ordered root commands.
- Establishes the adapter pattern for later Cashflow grids while keeping the design foundation free of AG Grid.
