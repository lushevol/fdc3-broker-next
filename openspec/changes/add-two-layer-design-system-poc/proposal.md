## Why

The completed two-layer Module Federation MVP proves direct `host -> application` composition, but its host and Cashflow application still define independent literal CSS and have no versioned appearance contract or shared component implementation. A bounded design-system POC is needed now to prove that independently built applications can consume one MUI/Emotion-based UI package while the host remains the authority for theme and density without reintroducing a runtime UI container.

## What Changes

- Add a private `@fm/ratan-design-poc` build-time package containing semantic CSS-variable tokens, light/dark themes, compact/comfortable density, an MUI/Emotion provider, visible focus treatment, and the first shared `Button`, `TextField`, and `StatusBadge` components.
- Extend the POC platform contract and SDK with a versioned appearance snapshot/capability supporting host-owned theme and density changes.
- Make `portal-host-poc` initialize, persist, expose, and render controls for appearance state using the shared design package.
- Make `mfe-cashflow-poc` consume the appearance capability through its own local design provider and replace representative local controls with shared design components.
- Preserve direct `host -> application` runtime composition: the design package is bundled into host and application builds and is never registered or loaded as a remote.
- Add contract, component, host, application, standalone, build, and browser E2E verification for live theme/density propagation, visible focus, compatibility rejection, and absence of a runtime Ratan UI layer.
- Document the boundary between POC packages, the future production design-system API, host responsibilities, and application/domain composition.

## Capabilities

### New Capabilities

- `ratan-design-system-poc`: Semantic token output, MUI/Emotion provider, shared foundational components, accessibility behavior, and build-time-only delivery.
- `federated-appearance-contract`: Versioned appearance state and subscription capability controlled by the host and consumed independently by federated applications.
- `federated-design-adoption`: Consistent shared component usage in both host and Cashflow while preserving standalone application rendering and two-layer runtime isolation.

### Modified Capabilities

None. Existing production capabilities remain unchanged; this change is isolated to the greenfield MVP.

## Impact

- Adds `mvp/two-layer-federation/packages/ratan-design-poc` and registers it as an npm workspace dependency.
- Updates the MVP platform contracts and SDK, host, Cashflow application, tests, root MVP scripts, and isolated documentation.
- Adds MUI and Emotion dependencies to the POC design package and consuming MVP workspaces without adding them to the Module Federation shared scope.
- Does not modify the legacy Single-SPA/SystemJS runtime, production applications, existing `packages/ratan-design`, or `mfe-ratan-container`.
