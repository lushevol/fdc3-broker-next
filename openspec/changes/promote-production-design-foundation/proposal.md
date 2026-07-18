## Why

The two-layer POC proved that a host-owned appearance contract and build-time MUI/Emotion package can unify independently deployed applications without recreating a runtime UI container. The next step is to establish production package identities and compatibility rules before migrating the new host or real application workflows.

## What Changes

- **BREAKING** Promote the previously unconsumed internal `packages/ratan-design` workspace from the experimental Ant-oriented `ratan-design@0.x` API to the production `@fm/ratan-design@1.0.0` foundation API, now owned under `mvp/two-layer-federation/realworld/packages/ratan-design`.
- Define one product-neutral semantic token source, generated/scoped CSS variables, light/dark schemes, compact/comfortable density, and visible-focus behavior.
- Provide a local MUI/Emotion `DesignSystemProvider` and bounded production `Button`, `TextField`, and `StatusBadge` APIs without re-exporting MUI.
- Add production `@fm/platform-contracts` and `@fm/platform-sdk` packages for versioned application/appearance manifests, stable appearance subscription, compatibility validation, and standalone controllers.
- Remove Ant Design from the production foundation package; legacy Ant adapters and application migration remain separate cohorts.
- Add package export, semver, coverage, accessibility, and forbidden-runtime-dependency gates.
- Document the compatibility window and promotion path from private POC evidence to production consumers.

## Capabilities

### New Capabilities

- `production-design-foundation`: Production semantic tokens, local provider, bounded foundational components, accessibility behavior, and build-time-only delivery.
- `production-federated-contracts`: Versioned application and appearance contracts, compatibility validation, typed host capabilities, and standalone SDK behavior.
- `design-release-governance`: Package identity, semver rules, dependency boundaries, public export controls, and verification requirements for independent application adoption.

### Modified Capabilities

None. Existing extraction-oriented design-token and component-style specifications remain unchanged; this introduces a production runtime-independent design contract.

## Impact

- Replaces the public API and package identity now located at `mvp/two-layer-federation/realworld/packages/ratan-design`; repository search confirmed it had no application consumers at promotion time.
- Adds `mvp/two-layer-federation/realworld/packages/platform-contracts` and `mvp/two-layer-federation/realworld/packages/platform-sdk` as production workspaces derived from POC-proven behavior, not runtime remotes.
- Changes root lockfile/workspace metadata and adds MUI/Emotion production dependencies.
- Does not yet migrate `apps/base`, `apps/root-config`, `apps/mfe-ratan-container`, or `apps/mfe-cashflow-blotter`; those changes follow after the production foundation passes its own gates.
- Does not change the proven two-layer rule: only React and ReactDOM may be federation singletons, and design packages are bundled into consumers.
