## Why

The production design foundation and platform contracts are now package-consumer verified, but only the isolated `*-poc` applications prove direct host-to-application federation. A bounded production-identity pilot is needed to prove that a new host and an independently built application can consume the production packages without reviving `root-config`, `base`, or `mfe-ratan-container` as runtime UI layers.

## What Changes

- Add a new production-identity portal host that owns registry bootstrap, routing/workspace composition, global appearance persistence, platform capabilities, remote compatibility validation, and failure containment.
- Add one independent production-identity Cashflow application that owns domain composition and local UI state, consumes `@fm/ratan-design` and `@fm/platform-sdk`, and supports both federated and standalone execution.
- Share only React and ReactDOM as federation singletons; consume the design system, MUI, and Emotion at build time per deployable so design-package minor versions can roll independently.
- Prove live host-owned appearance propagation across the federation boundary while each React root installs its own `DesignSystemProvider`.
- Add unit, boundary, build, and browser acceptance gates that reject legacy Single-SPA/SystemJS, `@fm/base`, and `mfe-ratan-container` dependencies.
- Keep every `mvp/two-layer-federation/**/-poc` workspace unchanged as historical proof, not as a production dependency.

## Capabilities

### New Capabilities

- `production-portal-host`: Direct registry-driven application loading, compatibility checks, host-owned capabilities, appearance bootstrap, workspace routing, and failure isolation in the new host.
- `production-federated-application`: Independent Cashflow delivery, local design provider, standalone mode, domain-owned composition, and explicit platform capability consumption.
- `production-runtime-conformance`: Build-time package and federation boundaries, forbidden legacy-runtime dependencies, production builds, and browser acceptance evidence.

### Modified Capabilities

None.

## Impact

- Adds new workspaces under `apps/portal-host` and `apps/mfe-cashflow`; it does not modify or route production traffic away from the legacy platform.
- Consumes `@fm/platform-contracts`, `@fm/platform-sdk`, and `@fm/ratan-design` through their published package APIs.
- Adds root scripts and a dedicated Playwright configuration for the production pilot.
- Establishes the executable baseline required by the separate `productionize-two-layer-federation-delivery` DevOps/control-plane program.
