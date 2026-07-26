## Context

The platform currently mixes SystemJS single-spa modules and Rspack Module Federation applications. Some application code calls `System.import` directly to render remote roots, but there is no stable producer contract for a tile to expose a component to another tile. The FDC3 broker and agent already distinguish the FDC3-standard `DesktopAgent` surface from Ratan-specific workflow and tile-lifecycle additions.

## Goals / Non-Goals

**Goals:**

- Define one typed `ModuleLoaderApi` that returns a normalized React component export.
- Support SystemJS immediately and Module Federation through the same public contract.
- Make the capability available as `RatanDesktopAgent.modules` without adding it to, or claiming it is part of, FDC3.
- Keep runtime-specific loader functions supplied by the platform host.
- Provide predictable errors and a cache for repeat loads of the same module reference.

**Non-Goals:**

- Changing FDC3 DesktopAgent, intents, contexts, channels, App Directory, or tile-launch semantics.
- Loading an arbitrary URL, loading a producer's single-spa lifecycle root, or creating an automatic component catalog UI.
- Solving cross-origin isolation, remote deployment, design-system sharing, or React singleton configuration. These remain host runtime responsibilities.
- Prop serialization, remote event RPC, or automatic context propagation; consumers pass React props and use FDC3 normally for interop.

## Decisions

### Create a dependency-light `ratan-module-composition` package

The shared package owns public contracts, adapter implementations, validation, caching, and error classes. It uses React types only, so it does not bundle a React runtime. The FDC3 agent and broker consume its types and delegate capability methods to it.

This keeps bundler-runtime code out of the FDC3 implementation while still allowing a single platform client. Adding the code directly to the agent was rejected because the broker/host would lose a central policy injection point; adding direct SystemJS and MF dependencies to the broker was rejected because it couples FDC3 conformance to host build tooling.

### Normalize intentional component exports

`ModuleReference` identifies `{ loader, moduleId, exportName? }`. SystemJS identifies a module by import-map specifier; Module Federation identifies a fully-qualified remote/expose key. Both adapters validate that the selected export is a component-like function and normalize it to `{ Component, metadata }`.

The component export name defaults to `default`, but catalog/consumer declarations can opt into a named export. A remote tile must publish a dedicated component entry point; an application root is not an embeddable contract.

### Use injected runtime functions

`SystemJsModuleAdapter` receives a `System.import`-compatible function. `ModuleFederationModuleAdapter` receives a `loadRemote`-compatible function. The adapters never read a federation global or take a dependency on a particular MF runtime. The base host chooses and registers the appropriate runtime function.

### Broker owns optional capability exposure

`BrokerConfig.moduleLoader` is optional to preserve existing broker initialization. The broker exposes a disabled loader when absent, which produces a typed unavailable error. When present, the same loader is surfaced to direct and scoped agents as the `modules` property. Future entitlement and catalog controls can wrap this injected loader at the broker boundary.

### Cache successes and in-flight loads by stable reference

The service caches the Promise for a complete reference. This avoids duplicate remote fetches from parallel React renders and returns the same normalized module for subsequent requests. A rejected load is evicted so an operator or a later retry can recover.

## Risks / Trade-offs

- [A remote exports a non-component value] → Validate exports and fail with a typed module-load error containing loader/module/export details.
- [Duplicate React or design-system instances cross the boundary] → Document that the SystemJS import map and MF shared configuration must resolve platform singletons; do not hide this runtime integration concern in the loader.
- [Untrusted code executes through a remote declaration] → This initial capability only loads host-supplied references; future catalog resolution must enforce origin/integrity and entitlement policy before calling the loader.
- [The MF runtime differs across hosts] → Depend only on an injected `loadRemote` function with a small adapter contract.

## Migration Plan

1. Add the new package and make broker configuration optional, so no existing tile changes behavior.
2. Add `modules` to the extended, non-standard agent type and delegate it through scoped agents.
3. Configure a host loader with the existing SystemJS runtime for the first producer/consumer adoption.
4. Add the host's Module Federation `loadRemote` function when MF exposed components are adopted.
5. Roll back by omitting `moduleLoader` from broker configuration; all standard FDC3 operations remain unaffected.

## Open Questions

- Whether production declarations live as an App Directory extension or in a dedicated module catalog.
- The entitlement action and audit-event names used when catalog-based resolution is introduced.
- Whether a host-rendered `RemoteComponent` convenience component belongs in this package or a separate React UI package.
