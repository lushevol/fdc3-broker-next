## Context

The two-layer federation MVP has a standalone host and independently built Cashflow remote, with React and ReactDOM as the only shared singleton dependencies. Host and application styles are currently unrelated plain CSS with literal values. The platform contract has no appearance capability, and `@fm/ratan-ui-poc` demonstrates build-time UI delivery but is domain-specific rather than a design system.

The POC must preserve the proven two-layer runtime. `mfe-ratan-container`, Single-SPA, SystemJS, import maps, and a federated component remote are prohibited. The design implementation must work when the Cashflow application runs under the host and when it runs standalone.

## Goals / Non-Goals

**Goals:**

- Prove a build-time MUI/Emotion design package used independently by host and application.
- Establish semantic CSS-variable tokens for light/dark schemes and compact/comfortable density.
- Establish a typed, versioned, host-owned appearance capability with snapshot and subscription behavior.
- Give each React root its own local MUI provider without relying on a cross-remote React context.
- Replace a representative interactive, form, and semantic-status slice in both host and Cashflow.
- Verify compatibility failures, accessibility fundamentals, standalone operation, and runtime isolation.

**Non-Goals:**

- Building the complete production component library.
- Migrating legacy production applications or the realworld `@fm/ratan-design` package.
- Migrating AG Grid, Ant Design, dialogs, or full Cashflow workflows in this slice.
- Publishing production package identities or designing the final release pipeline.
- Sharing MUI, Emotion, or the design package through Module Federation.

## Decisions

### Add a POC-only design package

Create `@fm/ratan-design-poc` under the isolated MVP. It is a private evidence package, not the production API. It exposes tokens, `DesignSystemProvider`, `Button`, `TextField`, and `StatusBadge`.

Alternative: add design behavior to `@fm/ratan-ui-poc`. Rejected because that package already depends on Ratan domain models; the design foundation must be product/domain neutral.

### Use MUI and Emotion behind semantic components

MUI supplies accessible component behavior and Emotion supplies typed component styling. The package exposes bounded semantic props rather than re-exporting MUI. React, ReactDOM, MUI, and Emotion are peer dependencies for library correctness and normal dependencies of consuming applications for deterministic bundling.

Alternative: plain CSS components. Rejected because it would not prove the intended production implementation or MUI theme adapter.

### Use CSS variables as rendering infrastructure and a typed capability as the contract

The package emits prefixed `--ratan-*` variables scoped by `data-ratan-theme` and `data-ratan-density`. The host sets attributes on its shell and application mount boundary. A typed appearance capability supplies the initial snapshot and subscription events, allowing applications to create their own local MUI theme and work outside the host with a local controller.

Alternative: rely only on document attributes. Rejected because it creates a hidden contract and is difficult to validate, test, or adapt to future isolation boundaries.

Alternative: share one React theme context from the host. Rejected because it couples application rendering to host React provider internals and conflicts with independent roots.

### Keep host appearance state authoritative

The host owns scheme and density state, persists it in local storage, updates its own provider, and passes a stable appearance capability to the active application. Applications subscribe and render; they do not mutate host state directly.

The capability uses an external-store shape: `getSnapshot()` and `subscribe(listener)`. This makes its lifetime explicit and compatible with `useSyncExternalStore`.

### Version the token contract separately

Add `APPEARANCE_CONTRACT_VERSION = '1.0.0'`. Application manifests declare their required appearance contract version. The host rejects a remote whose application or appearance contract is incompatible before rendering it.

The design package version remains a build-time diagnostic. The token/appearance contract is the host/runtime compatibility boundary.

### Bundle the design package into each build

Do not add MUI, Emotion, or `@fm/ratan-design-poc` to Module Federation shared dependencies. Only React and ReactDOM remain singleton shared. This proves deterministic, independently deployable UI package consumption and avoids a third runtime layer.

### Scope the first component slice deliberately

- `Button` proves interactive states, focus, variants, and density.
- `TextField` proves labels, form semantics, focus, and density.
- `StatusBadge` proves semantic status color across schemes.

AG Grid and dialogs are deferred until the host/application appearance boundary is proven.

### Use test-first implementation

Contract and component tests are written before implementation. Host and application tests prove behavior independently. E2E proves live host-to-remote propagation and network/runtime isolation.

## Risks / Trade-offs

- [MUI and Emotion increase POC bundle size] → Accept the cost for architectural proof and record build output; optimize only after measurement.
- [Separate MUI/Emotion bundles may generate different class names] → Visual consistency comes from shared tokens and component code; avoid cross-root selectors and test host/application together.
- [Document attributes can leak globally] → Scope component tokens to provider roots and use the capability as the authoritative application input.
- [Local storage can make E2E order-dependent] → Reset appearance storage in tests and provide deterministic defaults.
- [A remote may declare an incompatible appearance contract] → Reject it through the existing controlled application compatibility boundary.
- [POC API may be mistaken for production API] → Retain `-poc`, private packages, and explicit documentation; production packages are a later change.

## Migration Plan

1. Specify and test the appearance contract and compatibility validation.
2. Add the POC design package tests, tokens, provider, and three components.
3. Integrate host appearance ownership and replace representative host controls.
4. Integrate Cashflow subscription and representative shared controls while preserving standalone mode.
5. Add build, lint, unit, and browser E2E gates.
6. Use the results to define the production `@fm/ratan-design` and platform contract change; do not rename the POC package in place.

Rollback is isolated: revert the POC commits or stop its dev servers. The legacy production portal remains unchanged.

## Open Questions

- Whether the production package remains `@fm/ratan-design` or adopts a portal-neutral name is deferred until this POC proves the boundary.
- The production host's supported rolling window for appearance-contract majors is deferred.
- The first real Cashflow route and AG Grid migration are deferred to the production migration change.
