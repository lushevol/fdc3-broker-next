## Why

The current `root-config -> mfe-base -> mfe-ratan-container -> application` runtime chain couples business applications to multiple orchestration layers and to the oversized `@fm/base` runtime API. A greenfield MVP is needed to prove that a two-layer Module Federation architecture can load independently deployable applications directly from a new host while keeping Ratan components and functions as ordinary typed dependencies.

## What Changes

- Add a standalone `portal-host-poc` React application that does not load single-spa, SystemJS, or import maps.
- Add runtime application discovery from a validated registry and direct Module Federation loading with loading, retry, and failure isolation.
- Define typed application manifests, application entry modules, and host capability contracts.
- Add minimal Ratan SDK and UI packages consumed as build-time dependencies rather than a runtime container.
- Add a representative federated Cashflow pilot with local routing, local state, shared Ratan UI, and host capability usage.
- Add unit, integration, and Playwright coverage proving independent application delivery and the end-to-end workspace journey.
- Keep the existing production platform unchanged so the MVP runs alongside it.

## Capabilities

### New Capabilities

- `federated-application-host`: Runtime registry discovery, validated application loading, route selection, workspace composition, and remote failure isolation.
- `federated-application-contract`: Typed and runtime-validated contracts between the host and independently deployed applications.
- `ratan-shared-dependencies`: Ratan domain functions and components delivered as normal workspace packages without a runtime container layer.
- `cashflow-federated-pilot`: A representative Cashflow application loaded directly by the new host and communicating only through platform capabilities.

### Modified Capabilities

None. The MVP is additive and leaves existing production capabilities unchanged.

## Impact

- New workspaces under `mvp/two-layer-federation/apps/` for the host and pilot application.
- New workspaces under `mvp/two-layer-federation/packages/` for platform contracts, platform SDK, Ratan SDK, and Ratan UI.
- The MVP owns its Playwright configuration and E2E suite under `mvp/two-layer-federation/`; root scripts provide convenient entry points.
- Module Federation, React, Rsbuild, Zod, Vitest, and Playwright are used by the new workspaces.
- Existing `apps/root-config`, `apps/base`, `apps/mfe-ratan-container`, and `apps/mfe-cashflow-blotter` are not modified as part of the MVP runtime.
