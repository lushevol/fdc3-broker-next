## Context

The current browser runtime composes Cashflow through `root-config -> @fm/base -> @fm/ratan_container -> @fm/ratan_cashflow_blotter`. The new architecture has two runtime layers only: a host and applications. Ratan components and functions are horizontal package dependencies. The repository already uses Rsbuild and contains a basic Module Federation example, but that example has hard-coded remotes, no runtime contract, and no production-relevant failure or routing behavior.

The MVP must be a greenfield host that runs beside the existing platform. It must prove the intended endpoint rather than embed single-spa compatibility into the new composition root.

## Goals / Non-Goals

**Goals:**

- Prove direct `host -> application` runtime composition with Module Federation v2.
- Resolve remote manifests from runtime registry data without rebuilding the host.
- Establish typed and runtime-validated host/application contracts.
- Keep host state private and expose narrow capabilities to applications.
- Consume Ratan domain logic and UI through normal packages.
- Demonstrate local application routing, failure isolation, retry, and independent remote version selection.
- Verify the complete journey in Chromium with Playwright.

**Non-Goals:**

- Migrating the production authentication, FDC3 broker, chatbot, or full Cashflow application.
- Loading existing SystemJS applications inside the new host.
- Replacing or modifying the existing production runtime.
- Federating primitive UI components independently.
- Designing the final production deployment pipeline.

## Decisions

### Use a standalone Rsbuild React host

The host uses a normal React root and Module Federation runtime. It does not depend on single-spa, SystemJS, or import maps. This makes the POC representative of the long-term endpoint.

Alternative: preserve single-spa and load federated modules inside it. Rejected because it would prove a transitional hybrid rather than the final two-layer architecture.

### Register remotes from validated runtime data

The host fetches `/registry.json`, validates it with Zod, calls `registerRemotes`, and loads the configured expose with `loadRemote`. Remote URLs are absent from the host build configuration.

Alternative: configure `remotes` in `module-federation.config.ts`. Rejected because changing an application address would require rebuilding the host.

### Expose a React application module with a narrow capability object

Each application exposes `{ manifest, Application }`. The host supplies an instance ID, assigned base path, and platform capabilities. Applications never receive the host reducer, token storage, or router object.

Alternative: expose single-spa lifecycle functions. Rejected because the target host does not use single-spa. A framework-neutral mount contract remains a future option if non-React applications become a real requirement.

### Keep Ratan reuse as packages

`@fm/ratan-sdk-poc` contains domain models/functions and `@fm/ratan-ui-poc` contains composed React UI. They are workspace dependencies of Cashflow and not remotes.

Alternative: keep `mfe-ratan-container` as a federated runtime dependency. Rejected because it restores a third runtime composition layer and an additional failure boundary.

### Use browser history with host-owned base route selection

The host owns `/cashflow/*` selection. The Cashflow remote interprets only the path below `/cashflow` and uses the host navigation capability to change the URL. A dev-server history fallback supports nested refresh.

### Share only provider-sensitive runtime dependencies

React and ReactDOM are configured as singleton shared dependencies. Other dependencies remain bundled until measurement demonstrates a reason to share them.

### Keep the registry immutable during one host session

The POC loads the registry during bootstrap and permits retry of a failed remote. Registry version changes are demonstrated by changing the served registry and reloading the page. Hot-swapping an already mounted remote is excluded because forcing replacement of a loaded share scope is unsafe for the MVP.

## Risks / Trade-offs

- [Dynamic remote types can drift from runtime manifests] → Define the stable application contract in a local package, validate manifests at runtime, and test incompatible contract rejection.
- [React may be bundled twice] → Configure React and ReactDOM as singletons in both host and remote and verify the rendered application uses host capabilities successfully.
- [A remote can fail during download or render] → Use separate load and render error boundaries with retry and diagnostics.
- [Package-based Ratan UI requires application rebuilds for upgrades] → Accept deterministic builds for shared components; independently deployed high-level features remain applications/remotes.
- [POC auth and FDC3 capabilities are not production implementations] → Keep them outside the MVP capability set and avoid claims that those migrations are complete.
- [A static registry is not a production control plane] → Exercise the runtime contract now; replace the transport with a backend registry later without changing application modules.

## Migration Plan

1. Build and verify the POC on separate ports and routes.
2. Evaluate the contracts, performance, failure behavior, and developer workflow.
3. Promote the POC host foundation into a production host project if accepted.
4. Add production capabilities and a bounded legacy migration strategy in later changes.
5. Roll back the POC by stopping its independent dev servers; existing applications are unaffected.

## Open Questions

- Which production Cashflow route should become the first real migration slice after this representative MVP?
- Which platform capabilities need synchronous access versus asynchronous command APIs?
- What registry signing, promotion, and rollback controls are required in production?
