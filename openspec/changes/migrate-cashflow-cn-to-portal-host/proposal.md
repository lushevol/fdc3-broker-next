## Why

The production `apps/mfe-cashflow-blotter/src/Cashflow_CN` workflow cannot run in Portal Host because it imports Single-SPA-era shell and Ratan-container bridges and dynamically loads SystemJS modules. A separately authored fixture screen does not migrate that application; the actual Cashflow CN source and behavior must cross the two-layer federation boundary.

## What Changes

- Compile and render the actual legacy `Cashflow_CN` component tree, Redux state, grid, queries, details, notifications, and workflow actions from the realworld Module Federation remote.
- Move Cashflow CN-owned source into the realworld application or a Cashflow-owned package; temporary source linkage is allowed only as an auditable transition and not as the completed state.
- Replace `@fm/base`, `@fm/ratan_container`, `src/Root/import`, and other shell bridge usage with explicit application/platform adapters and build-time shared packages.
- Replace every `System.import` trade/cashflow dependency with a typed action/navigation adapter.
- Preserve production GraphQL/REST endpoint behavior behind explicit service ports; deterministic fixtures may support tests and local development but MUST NOT replace the migrated production path.
- Preserve the Cashflow CN search, custom views, server paging, details, notification refresh, export, and entitled workflow actions.
- Remove the newly authored fixture facsimile after the real workflow becomes the federated application entry.
- Add source-coverage boundary checks, parity tests, builds, and Portal Host browser acceptance for the actual workflow.

## Capabilities

### New Capabilities

- `cashflow-cn-portal-migration`: Defines source provenance, functional parity, service behavior, workflow actions, Portal Host integration, forbidden runtime boundaries, and acceptance of the actual Cashflow CN application.

### Modified Capabilities

None.

## Impact

- Migrated source: `apps/mfe-cashflow-blotter/src/Cashflow_CN` and the Cashflow-specific portions of its `src/Root` support layer.
- Target: `mvp/two-layer-federation/realworld/apps/mfe-cashflow-blotter-mvp`.
- Shared build-time UI/utilities may be extracted from `apps/mfe-ratan-container`, but no Ratan container remote may be loaded at runtime.
- Portal Host registry/contracts change only where explicit capabilities are required.
- Other blotter routes remain out of scope.
- Forbidden runtime dependencies are Single-SPA, SystemJS/import maps, `@fm/base`, and `@fm/ratan_container`.
