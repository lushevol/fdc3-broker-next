# OpenFin Platform Provider FDC3 Intent Requirements

## Purpose

Support FDC3 intent routing when the MFE platform runs inside an OpenFin/Here Core Platform whose manifest uses a `platform.providerUrl` page. The Platform Provider owns the OpenFin Interop Broker override and decides which OpenFin view/window should receive an external intent. The MFE base app owns internal tile routing after an intent is delivered into the MFE window.

This document consolidates the requirements from the implementation prompts and the real-case screenshots supplied on 2026-07-05.

## Real Runtime Shape

The real OpenFin manifest is a Platform manifest, not only a single `startup_app` manifest.

Observed manifest requirements from the supplied screenshot:

- The manifest defines `devtools_port`, observed as `9090` in the real case.
- The manifest defines `runtime.arguments` with verbose/inspector support, observed as `--v=1 --inspect`.
- The manifest defines a stable runtime version, observed as `stable-v41`, with future version `stable-v42`.
- The manifest defines `platform.uuid`, `platform.name`, and `platform.autoShow`.
- The platform name is observed as `ratan`.
- The platform `autoShow` flag is observed as `false`.
- The manifest grants platform permissions such as `webAPIs: ["openExternal"]`.
- The manifest points `platform.providerUrl` to `platform-provider.html`.
- The manifest defines default window options for platform views, including view visibility behavior such as showing views on splitter drag and resize.
- The manifest enables FDC3 interop with `fdc3InteropApi: "2.0"`.
- The manifest may define content navigation allowlists for permitted MFE origins.

The Platform Provider HTML loads code that overrides OpenFin/Here Core Interop Broker intent behavior.

Observed provider behavior from the supplied screenshot:

- It exports an async `getInteropBrokerOverride`.
- It fetches OpenFin app configuration, including an app-name to app-url registry.
- It returns an override class that extends `OpenFin.InteropBroker`.
- The override implements `handleFiredIntent(intent, clientIdentity)`.
- The override resolves a target app from `intent.name` and `intent.context.type`.
- It calls `super.getAllClientInfo()` to check whether the target view already exists.
- The existing target check is based on client/view `name` matching the resolved target app.
- If the target view does not exist, it looks up the target app URL from config.
- If no URL exists for the resolved target app, the provider throws a clear error and does not deliver the message.
- If a URL exists, the provider creates a new application window/view for that target app.
- It calls `super.setIntentTarget(intent, targetIdentity)` so the Interop Broker can deliver the intent when the target registers its handler.
- If the target view already exists, `setIntentTarget` receives the existing view identity.
- If the target view was just created, `setIntentTarget` receives the platform UUID and target app name used for the newly created window/view.

Reference behavior from Here Core docs:

- Platform intent handling requires overriding `InteropBroker.handleFiredIntent`.
- The override is responsible for launching/selecting the application that can handle the intent.
- The override should call `InteropBroker.setIntentTarget` with the launched/selected view identity.
- After the target view registers its intent handler, Interop Broker delivers the fired intent to that view.

Source: https://resources.here.io/docs/core/container/interop/#the-core-apis-for-platform-intents

## Provider Contract From Real Case

The MFE broker requirements depend on the Platform Provider contract. The expected contract is:

```text
external OpenFin view
  -> fireIntent / fdc3.raiseIntent
  -> platform InteropBroker.handleFiredIntent override
  -> resolveTarget(intent.name, intent.context.type)
  -> find existing target with getAllClientInfo()
  -> create target app window/view when missing
  -> setIntentTarget(intent, selectedTargetIdentity)
  -> target MFE window registers intent listener
  -> OpenFin delivers intent to the MFE window
  -> MFE broker routes intent to internal tile
```

The MFE broker must not replace the Platform Provider's responsibility to create or select the OpenFin window/view. The MFE broker is responsible only after the intent is delivered into the MFE base window.

The Platform Provider is expected to own:

- Manifest-level `providerUrl` startup.
- `getInteropBrokerOverride`.
- `handleFiredIntent`.
- `resolveTarget(intent.name, intent.context.type)`.
- `getAllClientInfo` lookup for already-running targets.
- Target app URL lookup from OpenFin app config.
- Target window/view creation.
- `setIntentTarget`.

The MFE broker is expected to own:

- OpenFin runtime detection inside base.
- OpenFin FDC3 listener registration after base loads.
- Classification of provider-delivered intents as external.
- Context-based conversion of provider-level intents into internal tile intents.
- Opening and delivering to internal tiles.
- Pre-login persistence and replay.
- Internal-to-external fallback for intents that have no internal target.
- Loop prevention so external-originated unresolved intents do not bounce back to Provider.

## Actors

- External OpenFin/Here Core view: Any OpenFin window/view outside the MFE base window that calls `fin.me.interop.fireIntent` or `fdc3.raiseIntent`.
- Platform Provider: The OpenFin `platform-provider.html` runtime page that overrides `InteropBroker.handleFiredIntent`.
- MFE base app: The always-mounted `@fm/base` shell that initializes `ratan-fdc3-broker`.
- MFE broker: The `ratan-fdc3-broker` instance running inside base.
- Tile: An internal MFE tile opened by base and registered with the broker.
- External OpenFin app: A target outside the MFE tile system that should receive an intent raised from inside the MFE.

## End-To-End External To Internal Flow

1. OpenFin launches the Platform manifest.
2. The Platform Provider initializes and installs its Interop Broker override.
3. An external OpenFin view fires an intent.
4. Platform Provider `handleFiredIntent` receives the intent.
5. Provider resolves target app from `intent.name` and `intent.context.type`.
6. If the MFE target window/view is not running, provider creates it from the configured app URL.
7. Provider calls `setIntentTarget(intent, { uuid, name })` for the selected MFE window/view.
8. The MFE base window loads and initializes FDC3/OpenFin bridge support.
9. The MFE broker subscribes to the entitled/global OpenFin intents.
10. OpenFin delivers the intent to the MFE window after the listener is registered.
11. The MFE broker routes the received intent to the correct internal tile.
12. If the tile is not open, the MFE broker opens the tile and delivers/queues until its intent listener is ready.

## End-To-End Internal To External Flow

1. A tile or base component raises an intent through the MFE broker.
2. The broker first tries to resolve and deliver the intent to internal tile targets.
3. If no internal target exists, and the intent did not originate from external OpenFin, the broker forwards the intent to OpenFin via the OpenFin bridge.
4. The Platform Provider / OpenFin Interop layer resolves the external target app.
5. If an explicit OpenFin target is supplied, the broker must pass it through.

## Functional Requirements

### Platform Manifest Compatibility

- The feature must support a real OpenFin Platform manifest whose `platform.providerUrl` points at a Platform Provider HTML page.
- The feature must not assume the OpenFin app starts as a standalone `startup_app` window.
- The implementation and e2e tests should distinguish between:
  - a lightweight OpenFin runtime harness used for smoke coverage
  - the real Platform Provider flow used in production
- The broker must remain compatible with Platform manifests that use `fdc3InteropApi: "2.0"`.
- The broker must tolerate OpenFin runtime startup latency and delayed FDC3 API availability.
- The broker must not require the Platform Provider page to be same-origin with the MFE base app, as long as OpenFin permissions and content navigation allow it.

### Platform Provider Intent Handling

- The Platform Provider must override `InteropBroker.handleFiredIntent`.
- The override must resolve target app from both `intent.name` and `intent.context.type`.
- The override must look for an already-running target client before creating a new window/view.
- The override must create a target window/view when the resolved target does not already exist.
- The override must fail clearly when target resolution succeeds but no app URL exists for the target app.
- The override must call `InteropBroker.setIntentTarget` with the identity of the existing or newly created target.
- The override must let OpenFin deliver the intent only after the selected target registers the matching intent handler.
- The MFE broker must be prepared to receive the intent after this provider-controlled delivery step.

### OpenFin Bridge Enablement

- When the base app runs in OpenFin, `enableOpenFinBridge` must be `true`.
- Outside OpenFin, `enableOpenFinBridge` must remain disabled.
- OpenFin runtime detection must use the available OpenFin global, including `fin.desktop`.
- The bridge must support `window.fdc3` and `fin.desktop.fdc3` access paths.
- The bridge must wait for `fdc3Ready` when the FDC3 API is not immediately available.

### Incoming OpenFin Intent Support

- The broker must subscribe to OpenFin intents that can be handled by local apps.
- Subscription must include configured global OpenFin intents.
- Subscription must include local app-directory intent declarations where available.
- Provider-delivered intents must be handled by the broker asynchronously.
- The bridge listener must return/chain the broker handling promise so the OpenFin provider flow can wait for internal routing where the runtime supports it.

### Routing External Intents To Internal Tiles

- The broker must accept intents delivered from other OpenFin windows/views.
- The broker must identify provider-delivered external OpenFin source as external. Current implementation normalizes this source as `appId: "external"`.
- Configured OpenFin launch/update intents must route by context type rather than by the provider-level intent name.
- Current configured context-routing intents:
  - `scb.ViewLaunch`
  - `scb.ViewUpdate`
- Example: `scb.ViewLaunch` + `scb.fmptp.cashflow` should resolve to the internal tile intent declared for `scb.fmptp.cashflow`.
- If context routing resolves exactly one app for the context, the broker must preserve that app target when raising the actual internal intent.
- The broker must not widen a context-selected single-app route back into an ambiguous intent-only resolver path.
- If the target tile is not open, the broker must open the tile and deliver the intent after the tile registers its listener.
- If the target tile is open, the broker must deliver directly to the mounted tile listener.

### Pre-Login External Intent Persistence

- If base is not logged in when an external OpenFin intent arrives, the broker must not drop the intent.
- The broker must persist the incoming intent in durable browser storage, currently `localStorage`, under the pre-login queue.
- The persisted intent must survive a reload caused by SSO redirect/login.
- The persisted data must include at least:
  - intent name
  - context payload
  - source marker identifying it as external OpenFin
  - timestamp/id sufficient for queue management
- After login, the broker must replay persisted pre-login intents.
- Replay must happen even if the in-memory broker instance was lost during SSO reload.
- After successful replay attempt, the pre-login queue must be cleared so the same intent is handled once.
- If replay fails for one queued intent, the broker should log the error and continue processing other queued intents.

### Internal To External Intent Dispatch

- If an internal MFE intent has no internal target, the broker must forward it to external OpenFin when the OpenFin bridge is enabled.
- The broker must preserve the original intent name and context.
- If the internal caller supplies an explicit external target app, the broker must pass that target to OpenFin.
- If the internal caller does not supply a target, the broker must let OpenFin/Platform Provider resolve the target.
- If an internal target exists, the broker must not call the external OpenFin provider path.

### Loop Prevention

- An unresolved intent that originated from external OpenFin must not be routed back to OpenFin.
- This prevents bounce loops between the MFE broker and the Platform Provider.
- Source classification must be explicit and test-covered.

### Error Handling

- If Platform Provider cannot resolve a target app from `intent.name` and `intent.context.type`, it should fail with a clear error.
- If Provider resolves a target app but cannot find an app URL in config, it should fail with a clear error.
- If broker cannot route an external OpenFin-originated intent internally, it must not forward it back externally.
- If broker cannot route an internal-originated intent internally and OpenFin bridge is unavailable, it should reject with a clear routing error.

## Non-Functional Requirements

- The OpenFin bridge must be lazy and safe outside OpenFin.
- Tests must run in non-OpenFin CI without failing; OpenFin-specific tests should skip unless explicitly enabled.
- Real OpenFin e2e tests must support slower runtime/interop startup latency.
- The bridge must not depend on a single specific OpenFin API path if both `window.fdc3` and `fin.desktop.fdc3` are possible.
- Queue persistence must be deterministic enough to survive SSO reloads and not depend on React component memory.

## Acceptance Criteria

- A Platform manifest with `platform.providerUrl` can launch the Provider page and MFE base app flow.
- A Provider override can receive an intent in `handleFiredIntent`, resolve a target from intent/context, create/select the MFE target, and call `setIntentTarget`.
- Once OpenFin delivers the provider-targeted intent into the MFE window, base routes it to the internal tile.
- In OpenFin, base initializes with `enableOpenFinBridge: true`.
- Outside OpenFin, base initializes with `enableOpenFinBridge: false`.
- An external OpenFin `scb.ViewLaunch` intent with `scb.fmptp.cashflow` context opens/routes to the matching internal tile.
- An external OpenFin `scb.ViewUpdate` intent with `scb.fmptp.cashflow` context opens/routes to the matching internal tile.
- An external OpenFin direct internal intent, such as `ViewCashflow`, routes to the matching tile.
- An external OpenFin intent received before login is stored in `localStorage`.
- The same pre-login intent remains stored after an SSO-style reload.
- After login, the persisted intent is replayed to the matching tile.
- After replay, the pre-login queue no longer contains `__prelogin__`.
- An unresolved external OpenFin-originated intent does not call OpenFin `raiseIntent` again.
- An internal intent with no internal target calls OpenFin `raiseIntent`.
- An internal intent with an explicit external target passes that target to OpenFin.
- An internal intent with a valid internal tile target does not call OpenFin `raiseIntent`.

## E2E Test Requirements

OpenFin e2e tests should cover as much of the real platform shape as feasible.

Required coverage:

- Real OpenFin runtime availability and FDC3 API availability.
- Platform manifest fixture with a `platform.providerUrl`.
- Provider override fixture that implements `handleFiredIntent`.
- Provider fixture target resolution from `intent.name` and `intent.context.type`.
- Provider fixture target creation when the MFE target is not already running.
- Provider fixture `setIntentTarget` call with the selected MFE identity.
- External OpenFin context-routing intent to tile.
- External OpenFin direct intent to tile.
- Pre-login queue creation.
- SSO-style reload persistence.
- Post-login replay and queue clear.
- No-bounce behavior for unresolved external OpenFin intents.
- Internal-to-external fallback without target.
- Internal-to-external fallback with explicit target.
- Internal target takes precedence over external fallback.

Future fidelity improvement:

- Replace or supplement the current lightweight OpenFin e2e launcher with a real Platform manifest fixture that includes a `platform.providerUrl`.
- The fixture provider should override `InteropBroker.handleFiredIntent`, create/select the MFE window/view, and call `setIntentTarget`.
- The fixture should mirror the real provider screenshots closely enough to validate the Provider to MFE delivery path end to end.
- The fixture should include a minimal app config map equivalent to `openfinConfigs.apps[targetApp]`.
- The fixture should include an explicit `resolveTarget(intent.name, intent.context.type)` map for test intents.

## Open Questions To Grill

1. What is the canonical mapping table for `resolveTarget(intent.name, intent.context.type)` in the Platform Provider?
2. Is `resolveTarget` owned entirely by the Platform Provider, or should base keep a mirrored copy for internal context routing?
3. Should `scb.ViewLaunch` and `scb.ViewUpdate` always route by context type, or are there cases where their intent names should route directly?
4. Which exact app name does Provider resolve for the MFE base window in the real config?
5. When Provider creates the MFE target, is the target an OpenFin Window, a View, or can it be either depending on app config?
6. What exact identity does Provider pass to `setIntentTarget` for MFE: platform UUID + target app name, created window identity, or view identity?
7. Does the MFE target register intent handlers through `window.fdc3.addIntentListener`, `fin.me.interop.registerIntentHandler`, or both in the real environment?
8. Should the MFE broker treat every OpenFin source as external, or only sources with `appId: "external"`?
9. If Provider-delivered source metadata is not `appId: "external"` in production, what source fields are stable enough for loop prevention?
10. If multiple internal tiles can handle the same context-routed intent, should base show resolver UI, choose the first declaration, or should Provider resolve to a more specific target?
11. If a pre-login persisted intent fails replay after login, should it be cleared, retained for retry, or moved to a dead-letter/error queue?
12. Should multiple pre-login intents replay in arrival order, newest first, or coalesced by context type?
13. Does SSO redirect always preserve `localStorage`, or do we need a fallback persistence mechanism for environments where storage is cleared?
14. Are there external intents raised by internal tiles that should never be forwarded to OpenFin even when no internal target exists?
15. Should OpenFin outbound dispatch use `fdc3.raiseIntent`, `fin.me.interop.fireIntent`, or support both depending on runtime?
16. Should the e2e harness launch a real Platform Provider now, or is current real-runtime bridge coverage acceptable until provider code/config can be supplied?
17. Should the test Platform Provider use a Window target, a View target, or both to match production?
18. What is the expected behavior when `getAllClientInfo()` finds a stale target name whose window/view is not ready to receive intents?
19. Should Provider create a new window on every target miss, or should it reuse a pending creation promise to avoid duplicate windows when multiple intents arrive quickly?
20. Should the MFE broker acknowledge/return an intent resolution result to OpenFin after internal tile delivery, or is fire-and-forget acceptable for Provider callers?

## Current Implementation Notes

- `apps/base/src/fdc3/openfin.ts` enables OpenFin bridge only in OpenFin runtime.
- `packages/fdc3-broker/src/openfin-bridge.ts` handles OpenFin FDC3 API discovery and intent subscription.
- `packages/fdc3-broker/src/broker.ts` handles incoming OpenFin intents, pre-login persistence, context routing, internal delivery, and outbound fallback.
- `tests/e2e/openfin-fdc3-bridge.spec.ts` contains the current OpenFin e2e coverage.
