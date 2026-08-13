# SCB Next migration specification

## Goal

Replace the copied SCB web composition runtime with Vite, Vitest, and Module Federation while preserving the existing business UI, styles, and BFF HTTP interfaces.

## Runtime topology

| Module | Role | Local origin | Federated interface |
| --- | --- | --- | --- |
| `mfe-base-origin` | Portal host | `http://127.0.0.1:8001` | Loads the Ratan remote and owns login, navigation, and workspace tabs |
| `mfe-ratan-container-origin` | Container remote | `http://127.0.0.1:8009` | Exposes the existing Ratan application and loads the Cashflow remote |
| `mfe-cashflow-blotter-origin` | Business remote | `http://127.0.0.1:8015` | Exposes the existing Cashflow blotter application |
| `single-ui-bff` | Owned HTTP service | Existing configured port | Keeps existing HTTP request/response interfaces |

`mfe-root-config-origin` is retained only as migration history. It is not part of the new runtime because the base origin now owns the host interface.

## Stable interfaces and test seams

1. **Host interface**: loading the base origin renders the existing portal, login flow, top navigation, and workspace.
2. **Federated application interface**: each remote exposes a React application module; the host/container can load it, render it into the workspace, and surface a useful error when loading fails.
3. **Business application interface**: the copied Ratan and Cashflow React trees keep their existing props, routing behavior, data requests, and style assets.
4. **Service interface**: the copied BFF retains its existing HTTP routes and schemas.
5. **User journey**: login, open New Tile, select Cashflow, observe the blotter, and close the workspace tab.

Tests exercise these interfaces only. Build-tool internals and private collaborators are not test seams.

## Functional acceptance criteria

- No runtime or build dependency on `single-spa`, `single-spa-react`, `single-spa-layout`, SystemJS, or import-map overrides remains in the active three-origin runtime.
- All three web origins build with Vite and run on their assigned ports.
- The two remotes publish Module Federation remote entries and share a single compatible React/ReactDOM runtime.
- Unit tests run with Vitest and maintain at least 90% line and branch coverage for newly introduced migration modules.
- Existing UI code, CSS/Less, images, and design-system providers remain present and load without visual regressions.
- Compatibility facades preserve the portal's complete MUI theme contract, including typography and compact component defaults, so nested remotes cannot replace production styles with later-injected Material UI defaults.
- The BFF compiles and its tests pass without route/schema changes.
- Playwright exercises the three-origin journey and records screenshots for visual comparison.
- Live Browser acceptance confirms there are no visible layout breaks or uncaught console errors on the accepted journey.

## Dependency policy

- Use current stable releases confirmed from primary sources.
- Prefer direct replacements for deprecated packages only when the replacement preserves behavior and has an official migration path.
- Record every retained compatibility pin and its reason in the dependency research report.
- Do not combine a framework migration with speculative business-logic rewrites.

## Rollback

The source `scb/` tree is unchanged. Rollback consists of stopping the `scb-next` origins and returning traffic to the original root-config/import-map deployment.
