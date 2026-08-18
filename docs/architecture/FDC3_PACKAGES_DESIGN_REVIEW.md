# FDC3 Packages Design Review

- **Review date:** 2026-08-18
- **Baseline commit:** `2a8d49b`
- **Status:** Current-state design and conformance review; not an official FDC3 certification

## Scope

This review covers:

- `packages/fdc3-agent`
- `packages/fdc3-app-directory`
- `packages/fdc3-broker`
- `packages/fdc3-resolver-ui`

The review asks two questions:

1. Do the public contracts and observable behavior follow the official FDC3 2.2 APIs?
2. Can the FDC3 implementation be used independently of the repository's existing micro-frontend (MFE) runtime?

The primary references are the live [FDC3 documentation](https://fdc3.finos.org/)
and the version-pinned [FINOS FDC3 v2.2 source and schemas](https://github.com/finos/FDC3/tree/v2.2).

## Executive Conclusion

The packages provide substantial FDC3-related functionality, but the current design is neither fully FDC3 2.2 conformant nor independent of the existing MFE platform. Several observable `DesktopAgent` behaviors conflict with the standard, the App Directory model and response handling do not match the 2.2 schema, and standards-facing packages expose concrete broker, module-composition, React, tile, and global-window concerns.

The recommended direction is to establish a small standards core whose public boundary is the official `@finos/fdc3` contract, then inject app launch, identity, directory transport, persistence, and platform integration through adapters. MFE composition, workflow extensions, diagnostics, OpenFin integration, and React UI should remain optional packages outside that core.

## Prioritized Findings

### P1 - App Directory v2.2 contract is incompatible

**Impact:** A conforming FDC3 2.2 App Directory response cannot be consumed reliably. Discovery, intent filtering, metadata mapping, and downstream resolution can fail or operate on the wrong data shape.

**Evidence:**

- `packages/fdc3-app-directory/src/types.ts:39` defines a custom `AppDefinition` with legacy required fields such as `name` and `version`; `title` is optional at `types.ts:88`.
- The example at `packages/fdc3-app-directory/src/types.ts:24` models `interop.intents.listensFor` as an array of `{ intent, contexts }` records rather than an object keyed by intent name.
- `packages/fdc3-app-directory/src/client.ts:237` declares `getAllApps()` as returning `AppDefinition[]`, and `client.ts:246` deserializes `GET /v2/apps` directly as that array.

FDC3 2.2 defines an application record with required `appId`, `title`, `type`, and `details`. Its intent metadata is keyed by intent name. The v2 App Directory endpoint returns an object containing `applications` and an optional `message`, not a bare application array. See the official [App Directory schema](https://github.com/finos/FDC3/blob/v2.2/packages/fdc3-standard/src/app-directory/specification/appd.schema.json) and [App Directory API](https://fdc3.finos.org/docs/app-directory/spec).

**Remediation:** Replace the public directory model with the official 2.2 schema or generated types. Decode the endpoint envelope explicitly, validate responses at the transport boundary, and map any organization-specific metadata into a separate extension model.

### P1 - Intent delivery failures are reported as successful resolutions

**Impact:** Callers can receive a successful `IntentResolution` even though no handler received the intent. Handler failures can be silently converted to an undefined result, undermining retry, error handling, telemetry, and interoperability.

**Evidence:**

- `packages/fdc3-broker/src/broker.ts:2366` invokes handlers, but the catch at `broker.ts:2381` only logs the rejection; `broker.ts:2405` still creates a successful resolution.
- Missing listeners and unavailable instances are queued and immediately reported as successful at `packages/fdc3-broker/src/broker.ts:2420` and `broker.ts:2436`.
- Listener timeout is swallowed at `packages/fdc3-broker/src/broker.ts:2501`, followed by a successful resolution at `broker.ts:2510`.

FDC3 distinguishes failure to deliver an intent (`ResolveError.IntentDeliveryFailed`) from a handler rejecting its result (`ResultError.IntentHandlerRejected`). See [DesktopAgent.raiseIntent](https://fdc3.finos.org/docs/api/ref/DesktopAgent#raiseintent), [ResolveError](https://fdc3.finos.org/docs/api/ref/Errors#resolveerror), and [ResultError](https://fdc3.finos.org/docs/api/ref/Errors#resulterror).

**Remediation:** Reject resolution when delivery cannot be established. Preserve handler rejection in the `IntentResolution.getResult()` path using the official result error value. Add conformance tests for unavailable instances, missing listeners, listener timeout, and handler rejection.

### P1 - `open(app, context)` discards context

**Impact:** An application opened with context does not receive the context required by the FDC3 contract.

**Evidence:**

- `packages/fdc3-broker/src/broker.ts:669` accepts the optional context.
- `packages/fdc3-broker/src/broker.ts:702` invokes `onTileOpen(appIdentifier)` without passing that context.
- The callback at `packages/fdc3-broker/src/types.ts:160` cannot carry context.

FDC3 requires the opened application to receive the supplied context through its context listener. See [DesktopAgent.open](https://fdc3.finos.org/docs/api/ref/DesktopAgent#open).

**Remediation:** Introduce an implementation-neutral launcher port that accepts both `AppIdentifier` and `Context`. Complete `open()` only after launch and context delivery semantics have been satisfied, with tests against a non-MFE adapter.

### P1 - Intent discovery ignores mandatory filters

**Impact:** Discovery can return applications that do not accept the supplied context or cannot produce the requested result type. Resolution choices may therefore be invalid.

**Evidence:**

- `packages/fdc3-broker/src/broker.ts:1011` accepts `context` and `resultType`, but `broker.ts:1014` searches only by intent name.
- `packages/fdc3-broker/src/broker.ts:1057` accepts `resultType`, but `broker.ts:1060` filters only by context type.

FDC3 requires `findIntent` and `findIntentsByContext` to apply the supplied context and result-type constraints. See [DesktopAgent.findIntent](https://fdc3.finos.org/docs/api/ref/DesktopAgent#findintent) and [DesktopAgent.findIntentsByContext](https://fdc3.finos.org/docs/api/ref/DesktopAgent#findintentsbycontext).

**Remediation:** Normalize directory intent metadata into a queryable standards model. Apply context-type and result-type matching centrally, and test combinations of omitted, matching, and non-matching filters.

### P1 - Off-channel `broadcast()` has non-standard behavior

**Impact:** Standards-compliant applications that broadcast before joining a channel receive an unexpected rejection.

**Evidence:**

- `packages/fdc3-broker/src/broker.ts:809` checks current tile state.
- `packages/fdc3-broker/src/broker.ts:811` treats absent channel membership as an error and throws `No channel joined` at `broker.ts:814`.
- Existing tests assert this behavior at `packages/fdc3-broker/test/broker-channel.test.ts:278` and `packages/fdc3-broker/test/broker-conformance-remediation.test.ts:236`.

FDC3 specifies that `broadcast()` has no effect when the calling application is not joined to a channel; it should not reject for that condition. See [DesktopAgent.broadcast](https://fdc3.finos.org/docs/api/ref/DesktopAgent#broadcast).

**Remediation:** Return a resolved promise without delivery when there is no current channel. Replace the existing assertions with a conformance test for the no-op behavior.

### P1 - The public agent is coupled to the MFE implementation

**Impact:** A third-party FDC3 Desktop Agent cannot be substituted without adopting the concrete broker, tile lifecycle, module loader, and global namespace conventions. This prevents reuse in another shell, browser host, Electron container, or native desktop integration.

**Evidence:**

- `packages/fdc3-agent/src/scoped-agent.ts:1` imports the concrete `Broker`; `scoped-agent.ts:2` imports `ModuleLoaderApi`.
- `packages/fdc3-agent/src/types.ts:76` extends `DesktopAgent` with workflow, tile lifecycle, and module-composition APIs.
- `packages/fdc3-agent/src/agent.ts:41` discovers shared state through `window.__RATAN_FDC3__`.
- `packages/fdc3-agent/src/types.ts:82` documents that global as an MFE state-sharing mechanism.

The official API boundary is `DesktopAgent`; vendor-specific capabilities may exist but should not be required to consume standard functionality. See [DesktopAgent](https://fdc3.finos.org/docs/api/ref/DesktopAgent) and the [FDC3 API specification](https://fdc3.finos.org/docs/api/spec).

**Remediation:** Make `fdc3-agent` depend on the official interfaces or a minimal local port, not the concrete broker. Supply source identity through an injected agent factory. Move workflows, tile lifecycle, and module composition behind separately imported extension interfaces.

### P1 - Published dependency contracts are incomplete

**Impact:** Generated declarations can reference packages that are unavailable to registry consumers, causing installation or TypeScript resolution failures.

**Evidence:**

- `packages/fdc3-agent/src/scoped-agent.ts:1` exposes the `Broker` type from `ratan-fdc3-broker`.
- `packages/fdc3-agent/package.json:48` declares `ratan-fdc3-broker` only as a development dependency.
- The broker's public type surface consumes App Directory types, while its manifest does not make that package contract explicit for consumers.

This is a package-boundary defect rather than an FDC3 conformance rule, but it makes the standards API less portable.

**Remediation:** First remove concrete cross-package types from public declarations. Where a public declaration must retain a package type, declare that package as a production or peer dependency and verify the packed artifacts in an isolated consumer project.

### P2 - Standard errors are replaced with arbitrary prose

**Impact:** Consumers cannot reliably branch on official error values and may fail interoperability or conformance checks.

**Evidence:**

- `packages/fdc3-broker/src/broker.ts:1017` throws `No apps found for intent: ...`.
- `packages/fdc3-broker/src/broker.ts:1291` throws `User cancelled intent resolution`.
- Tests encode those strings at `packages/fdc3-broker/test/broker-app-directory-integration.test.ts:154` and `packages/fdc3-broker/test/broker-raise-intent.test.ts:259`.

FDC3 defines stable error values including `NoAppsFound` and `UserCancelledResolution`. See [ResolveError](https://fdc3.finos.org/docs/api/ref/Errors#resolveerror).

**Remediation:** Centralize creation and propagation of official FDC3 error values. Keep diagnostic detail in error causes, structured logs, or platform telemetry rather than changing the public error contract.

### P2 - Core and UI dependency direction is reversed

**Impact:** The broker carries React and platform composition concerns, while resolver diagnostics depend on broker implementation details. This increases bundle requirements and makes headless or alternate-host use difficult.

**Evidence:**

- `packages/fdc3-broker/src/index.ts:12` exports React error-boundary types and `index.ts:14` exports the component from the broker root.
- `packages/fdc3-broker/package.json:28` requires React and ReactDOM peers and `package.json:35` requires `ratan-module-composition`.
- `packages/fdc3-resolver-ui/src/ResolverErrorBoundary.ts:24` imports and re-exports the broker's error boundary.
- `packages/fdc3-resolver-ui/src/fdc3-log/fdc3LogService.ts:100` reads `__RATAN_FDC3__`, then accesses broker-private `tileRegistry` at `fdc3LogService.ts:106`.

**Remediation:** Keep the broker core headless. Move React components into UI packages, expose diagnostics through an injected read-only diagnostics interface, and ensure UI packages depend on official contracts or narrow ports rather than private broker state.

## Proposed Target Architecture

```text
Application code
    |
    v
Official FDC3 2.2 DesktopAgent facade
    |
    v
Headless standards core
    |-- channel and private-channel semantics
    |-- intent discovery, resolution, delivery, and result handling
    |-- official error mapping
    |-- normalized App Directory 2.2 model
    |
    +--> App directory port ------> HTTP App Directory adapter
    +--> App launcher port --------> Single-SPA/MFE adapter
    |                         `----> alternate host adapter
    +--> Source identity port -----> MFE identity adapter
    +--> Persistence/transport ----> browser, OpenFin, or native adapter
    +--> Diagnostics port ---------> telemetry/log adapter

Optional packages
    |-- React resolver UI, depending on official types and resolver ports
    |-- React hooks, depending on DesktopAgent only
    |-- workflow extension API
    |-- tile lifecycle extension API
    `-- module-composition extension API
```

Key boundary rules:

- The standards facade exports official FDC3 types and behavior only.
- The headless core has no React, DOM, Single-SPA, Module Federation, or tile-registry dependency.
- Platform identity is supplied when creating a scoped agent; it is not discovered from a global window object.
- App launch is a port. The MFE launcher is one adapter, not a broker callback embedded in the standards contract.
- Extensions use explicit capability interfaces and separate entry points; they do not widen the `DesktopAgent` type required by normal clients.
- Resolver UI consumes a resolver interface and observable state, never private broker fields.

## Staged Recommendations

### Stage 1 - Establish an executable conformance baseline

- Add behavior-focused tests for official errors, no-channel broadcast, `open()` context delivery, discovery filters, intent delivery failure, and rejected handler results.
- Add representative official App Directory 2.2 fixtures and validate the endpoint envelope and metadata schema.
- Keep existing behavior tests where they describe platform extensions, but label them separately from FDC3 conformance tests.

### Stage 2 - Correct standards behavior and data contracts

- Adopt the official App Directory 2.2 schema and response envelope.
- Implement mandatory discovery filters.
- Correct intent resolution and result error propagation.
- Make off-channel broadcast a no-op.
- Carry context through the app launch and initialization path.
- Return official FDC3 error values at the public boundary.

### Stage 3 - Extract the headless standards core

- Define narrow ports for directory access, app launch, source identity, transport, and diagnostics.
- Remove React, module-composition, tile registry, and global-window knowledge from the core.
- Keep identity scoping in a factory or facade that depends only on the `DesktopAgent` contract.

### Stage 4 - Move platform behavior into adapters and extensions

- Implement the existing Single-SPA/Module Federation behavior as an MFE launcher and identity adapter.
- Move workflow, tile lifecycle, module composition, OpenFin, and other vendor capabilities to optional extension entry points.
- Make resolver UI and logging depend on stable resolver and diagnostics ports.

### Stage 5 - Harden distribution and interoperability

- Verify dependency declarations and packed `.d.ts` files in isolated consumer projects.
- Test the core with both the MFE adapter and a minimal non-MFE adapter.
- Run the applicable FINOS FDC3 conformance tooling and document exact supported versions and any intentional extensions.

## Verification

At the reviewed baseline, the package-local test and lint commands passed for all four packages:

| Package | `npm test` | `npm run lint` |
| --- | --- | --- |
| `fdc3-agent` | Pass | Pass |
| `fdc3-app-directory` | Pass | Pass |
| `fdc3-broker` | Pass | Pass |
| `fdc3-resolver-ui` | Pass | Pass |

Passing tests and lint do not prove FDC3 conformance. Some current tests explicitly assert behavior that conflicts with FDC3 2.2, including rejection of off-channel broadcast and prose error messages. This review did not perform or claim official certification.

## Limitations

- The review is a static and package-test assessment of baseline commit `2a8d49b`; it is not an exhaustive runtime interoperability exercise.
- The GitNexus index was current, but GitNexus MCP `query` and `context` operations were unavailable during the review. Evidence was therefore verified directly against source, tests, manifests, and the official FDC3 2.2 primary references.
- No FINOS certification or official conformance result is claimed.
