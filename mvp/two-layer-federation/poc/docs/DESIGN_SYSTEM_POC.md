# Two-layer design-system POC

## Purpose

This POC proves that one visual system can be delivered to independently built federated applications without creating a UI runtime layer. The runtime graph remains exactly `portal host -> application`. React and ReactDOM are the only Module Federation singletons. MUI, Emotion, tokens, and components are normal build-time dependencies bundled into each deployable.

The implementation is evidence for a production API, not the production API itself.

## Ownership boundaries

### 1. MVP-only `*-poc` packages

Everything under `mvp/two-layer-federation/poc` is private and disposable evidence:

- `@fm/ratan-design-poc` owns product-neutral tokens, `DesignSystemProvider`, `Button`, `TextField`, and `StatusBadge`.
- `@fm/ratan-ui-poc` owns Ratan domain composition such as `CashflowTable` and consumes the design package.
- `@fm/platform-contracts-poc` owns the runtime-validated application and appearance contract.
- `@fm/platform-sdk-poc` adapts host capabilities for applications and supplies a local appearance controller for standalone rendering.
- `@fm/ratan-sdk-poc` remains UI-free domain logic.

These packages stay private, retain their `-poc` names, and must not be renamed in place or published as production packages.

### 2. Future production design-system package/API

The production package will be a product-neutral, versioned package derived from proven behavior rather than copied wholesale. It should expose semantic tokens, provider adapters, bounded components, accessibility contracts, and test utilities. It must not expose raw MUI components as its public API, import Ratan domain models, own routing/workspace behavior, or be registered as a federated remote.

The promoted implementation now lives at `mvp/two-layer-federation/realworld/packages/ratan-design`. Its production identity was selected through an explicit major reset; the historical package location did not silently define the new public API.

### 3. Host-owned global bootstrap responsibilities

The production host owns the authoritative appearance preference and resolved snapshot: scheme, density, locale, direction, and appearance-contract version. It persists user preference, applies a provider to host UI, exposes a stable `getSnapshot`/`subscribe` capability, validates application manifests, contains incompatible or failed applications, and provides global foundations such as font loading and reset policy.

The host does not provide a React theme context across federated roots and does not serve a component container. CSS variables are rendering infrastructure scoped to provider roots; the typed capability is the runtime contract.

### 4. Application-owned composition and domain UI

Each application owns its route-level layouts, workflows, state, data fetching, and domain semantics. It subscribes to the appearance capability, creates its own local design provider, and composes package-delivered foundations with domain packages. It must also supply deterministic local capability defaults so it renders in isolation, tests, Storybook, and development servers.

`@fm/ratan-ui-poc` demonstrates the direction: a domain table can use the product-neutral `StatusBadge` and `Button` without becoming a runtime dependency of the host.

## Runtime and package delivery rules

- Keep exactly two runtime layers: host/base platform and independently deployed applications.
- Do not register `ratan-design`, `ratan-ui`, MUI, or Emotion as Module Federation remotes or shared singletons.
- Do not depend on `mfe-ratan-container`, Single-SPA, SystemJS, or import maps.
- Consume design and domain libraries through semver-pinned package releases and bundle them into each application build.
- Keep React and ReactDOM aligned as strict singleton dependencies at the federation boundary.
- Scope all public custom properties with `--ratan-*` and all theme/density selectors to a provider root.
- Do not style another federated root by relying on generated Emotion class names or host DOM structure.

## Compatibility and version policy

There are three independent version axes:

| Axis | Checked by | Rule |
| --- | --- | --- |
| Application contract | Host against registry and remote manifest | Exact supported major; reject before rendering when unsupported |
| Appearance/token contract | Host against registry and remote manifest | Independently versioned; snapshot includes its version; breaking token or snapshot changes require a major |
| Design package | Package manager and application build | Normal semver; applications upgrade independently inside the supported appearance-contract window |

The POC supports application contract `1.0.0` and appearance contract `1.0.0`. A production host should declare a tested rolling compatibility window rather than infer compatibility from package versions. Additive optional fields and components are minor releases. Removed/renamed tokens, changed semantic meaning, or required snapshot fields are major releases. Patch releases must not alter public behavior.

During rolling deployment, publish packages and contract schemas first, deploy applications that remain compatible with the current host, then deploy the host. Never require every application to release atomically. Registry rollback must be sufficient to return an application to its previous compatible manifest.

## MUI, Emotion, Ant Design, and AG Grid

MUI supplies accessible primitives and Emotion implements typed styling behind bounded design APIs. Consumers may not import MUI directly for a component already covered by the design package. MUI and Emotion remain consumer dependencies/peers, not federation runtime services.

Ant Design migration should be component-by-component: inventory behavior, add parity tests, implement the bounded replacement, migrate consumers, then remove the Ant dependency only when no imports remain. Running both libraries temporarily is acceptable but each screen must have one authoritative component implementation.

AG Grid remains an application/domain dependency. A later `DataGrid` adapter should centralize design tokens, density, typography, status renderers, selection, loading/empty/error states, and accessibility defaults while keeping column definitions and business actions application-owned. Do not begin a full grid migration until the appearance boundary and foundational controls are stable.

## Promotion gates

The POC can inform a production package only after all of these remain true:

- Host and application unit suites exceed 90% line and branch coverage; foundational packages reach 100% for their bounded surface.
- Production builds and type checks resolve public package exports rather than source-only aliases.
- Browser tests prove live scheme/density propagation, persistence, standalone rendering, deep routes, keyboard focus, failure isolation, and incompatible-contract containment.
- Captured network traffic contains only host and application federation artifacts—no design remote, Ratan container, legacy loader, or import map.
- Light/dark and compact/comfortable behavior is semantic and does not depend on cross-root generated class names.
- Bundle-size evidence and accessibility review are recorded before expanding the component catalog.

## Next production slice

The smallest production follow-up is a separate change that decides the package name and publishes only the semantic token schema, appearance adapter, provider, Button, TextField, and StatusBadge. Pilot it in the new production host and one independently deployed application. Keep dialogs, navigation, AG Grid, charts, and complete Ant removal out of that slice; add them through measured component cohorts after the contract and release process are proven.

## Commands

From the repository root:

```bash
npm run poc:test
npm run poc:build
npm run poc:test:e2e
```

The E2E command builds packages in dependency order before starting isolated static servers on ports 9100 and 9101.
