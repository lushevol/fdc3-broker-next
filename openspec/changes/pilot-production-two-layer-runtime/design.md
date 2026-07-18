## Context

The isolated MVP proves direct Module Federation under `mvp/two-layer-federation/`, and the production `@fm/platform-contracts`, `@fm/platform-sdk`, and `@fm/ratan-design` packages now have stable `1.0.0` APIs and packed-consumer evidence. Production identities do not yet consume those packages. The legacy runtime remains three layers and cannot be treated as the long-term host.

## Goals / Non-Goals

**Goals:**

- Prove a genuinely new host directly loads an independent Cashflow application.
- Prove host-owned global bootstrap and appearance without a cross-MFE React context or mutable global theme object.
- Prove application-owned domain composition with local provider roots and standalone execution.
- Establish executable boundaries and acceptance gates before migrating real domain/grid cohorts.

**Non-Goals:**

- Production traffic cutover, authentication, entitlements, FDC3, chatbot, or enterprise deployment automation.
- Migrating the legacy Cashflow implementation or AG Grid in this change.
- Turning `@fm/ratan-design` into a federation remote or exposing raw MUI APIs.
- Editing the `*-poc` workspaces or the separate DevOps delivery change.

## Decisions

### Create production identities beside, not from, the POC

The pilot uses `mvp/two-layer-federation/apps/portal-host` and `mvp/two-layer-federation/apps/mfe-cashflow`. They are production-identity candidates, but remain physically isolated beside the POC until the replacement runtime is approved for rollout. The `*-poc` workspaces remain separate evidence and cannot become an import, workspace dependency, source alias, or runtime URL. This makes both accidental legacy integration and accidental POC promotion detectable.

### Keep exactly two runtime layers

The host discovers, validates, and mounts the application directly. Neither `root-config`, `base`, nor `mfe-ratan-container` participates. Ratan UI and platform helpers are ordinary versioned build-time packages.

### Share only provider-sensitive React runtime state

React and ReactDOM are strict singleton shares. `@fm/ratan-design`, MUI, and Emotion are package/build dependencies of each deployable and are not federation shares. Each application can therefore adopt compatible design-package minors independently, while its local provider creates a coherent MUI/Emotion tree.

Alternative: share the design stack as singletons. Rejected for this pilot because it creates host/application lockstep and turns package rollout into runtime coupling.

### Use typed capability objects for cross-boundary behavior

The host creates stable navigation, notification, telemetry, workspace, and appearance capabilities. The remote receives only `ApplicationProps`; it never imports host source. Compatibility validation occurs before React renders the remote.

### Scope appearance per React root

The host persists the authoritative appearance snapshot and pushes updates through the versioned appearance capability. Host and application each install `DesignSystemProvider`; semantic CSS custom properties are scoped below those provider roots. No provider state crosses the federation boundary.

### Use a static validated registry for the local pilot

The host fetches a public registry document at bootstrap and validates it with the production schema. Immutable revisions, environment pointers, signatures, and promotion belong to `productionize-two-layer-federation-delivery` after this executable baseline exists.

## Risks / Trade-offs

- [Duplicated MUI/Emotion code increases bytes] → Measure both builds now; revisit vendor sharing only with compatibility and rollback evidence.
- [The bounded Cashflow fixture is not the legacy product] → Treat it as architecture acceptance, then migrate one behavior-tested legacy vertical slice.
- [Static registry is not production release control] → Keep it clearly marked as pilot configuration and defer activation policy to the delivery program.
- [Visual CSS can leak outside scoped roots] → Boundary tests reject global selectors from application and design-system styles; host reset remains host-owned.
- [Exact protocol `1.0.0` is initially narrow] → Keep protocol and package versions separate; add rolling-major matrices before external team onboarding.

## Migration Plan

1. Add failing host/application/boundary tests using only production package imports.
2. Implement the independent Cashflow application and standalone shell.
3. Implement host registry bootstrap, capabilities, routing, appearance, and direct remote loading.
4. Add build and browser gates, then record artifact and architecture evidence.
5. Use the verified pilot to select the first legacy Cashflow domain/grid cohort.

Rollback is removal of the pilot routes/scripts because no production traffic is changed.

## Open Questions

- Which real Cashflow journey is small enough to migrate first while still exercising AG Grid behavior?
- Which host capabilities must become production-ready before that cohort can receive real users?
- What bundle-size threshold would justify controlled MUI/Emotion vendor sharing?
