# SCB Next migration specification

This specification defines the result that a migration into `scb-next` must
produce. [MIGRATION.md](MIGRATION.md) defines the execution procedure and
[VERIFICATION_GUIDE.md](VERIFICATION_GUIDE.md) defines the evidence required to
prove compliance.

The terms **MUST**, **MUST NOT**, **SHOULD**, and **MAY** are normative.

## Goal

Convert the active SCB portal, Ratan container, and Cashflow applications from
the legacy Webpack/Single-SPA/SystemJS composition to Vite and nested Module
Federation while preserving production behavior, styling, identity,
permissions, navigation, data contracts, and operational rollback.

The accepted target consists of:

- Base as the browser host;
- Ratan as the first federated remote and Cashflow route owner;
- Cashflow as the second federated remote and business-screen owner;
- unchanged platform and tenant backend contracts behind owner-specific same-origin `/api/` routing;
- deterministic development replay for frontend acceptance;
- one platform-owned Nginx edge delegating tenant path families to independently operated, tenant-owned Nginx edges.

## Non-goals

Unless a separate specification explicitly adds them, this migration does not
include:

- React 19;
- Ratan or Cashflow dependency upgrades;
- MUI, Ant Design, AG Grid, GraphQL, Redux, router, or Spring major upgrades;
- business-rule rewrites or route/schema redesign;
- migration of unrelated dormant Ratan SystemJS applications;
- data migration or reversal of BFF writes;
- replacing the legacy source as rollback evidence;
- claiming production service parity from fixture-backed acceptance alone.

## Runtime topology

| Module                           | Role                  | Local origin            | Required federated interface                                         |
| -------------------------------- | --------------------- | ----------------------- | -------------------------------------------------------------------- |
| `mfe-base-origin`                | portal host           | `http://127.0.0.1:8001` | consumes `mfe_ratan_container/application`                           |
| `mfe-ratan-container-origin`     | container remote      | `http://127.0.0.1:8009` | exposes `./application`; consumes `mfe_cashflow_blotter/application` |
| `mfe-cashflow-blotter-origin`    | business remote       | `http://127.0.0.1:8015` | exposes `./application`                                              |
| `portal-auth-service`            | auth runtime owner    | environment-defined     | owns `/api/auth/*` except admin and `/api/sso/*`                     |
| `portal-tile-management-service` | tile runtime owner    | environment-defined     | owns `/api/auth/v1/fmo/admin/*`                                      |
| `portal-telemetry-service`       | telemetry owner       | environment-defined     | owns `/api/analytics/*`                                              |
| `single-ui-bff`                  | fallback HTTP service | environment-defined     | retains unmatched platform `/api/*` contracts                        |

`mfe-root-config-origin` MUST remain outside the active npm workspaces, startup
graph, build, packaging, and production deployment. It MAY remain in source as
migration history.

## Composition invariants

1. The active path MUST use Vite and `@module-federation/vite`.
2. Base MUST render through React `createRoot` and lazy-load Ratan through its
   declared federation module.
3. Ratan MUST preserve provider/router ownership around the Cashflow remote.
4. Cashflow MUST render the copied business application, not a facsimile or
   iframe.
5. React and ReactDOM MUST resolve to compatible React 18 singleton shares in
   all three origins.
6. React Router MUST be shared between Ratan and Cashflow while router context
   crosses that boundary.
7. UI libraries MUST remain local to their origin unless a separately tested
   federation contract changes this rule.
8. Development ports MUST be strict: `8001`, `8009`, and `8015`.
9. Canonical production remote paths MUST be `/static/ratan/container/` and
   `/static/ratan/cashflow/`. `/remotes/ratan/` and `/remotes/cashflow/` MUST
   remain compatibility aliases until a separately coordinated removal.
10. The active Cashflow path MUST NOT require Single-SPA, SystemJS, import-map
    overrides, Webpack runtime globals, or source files under `scb/`.

Dormant legacy loaders MAY remain only when they are unreachable from the
supported drawer/routes and are explicitly treated as migration references.

## Source transition invariants

- `scb/` MUST be read-only during target migration and remain available as the
  rollback baseline.
- Every migrated stage MUST record the legacy source revision and target
  starting revision.
- Business source, tests, styles, assets, and generated contracts MAY be copied
  when their ownership remains unchanged.
- Target build, lifecycle, compatibility, test, dependency, and deployment
  files MUST remain target-owned and MUST be translated rather than overwritten
  from legacy.
- Generated output and dependency directories MUST NOT be copied or committed.
- Whole-directory synchronization MUST NOT be used as a migration strategy.
- Every new or changed behavior MUST have a specification and a regression
  test at its observable contract seam before implementation.
- Each completed stage MUST be committed independently from unrelated changes,
  dependency majors, and broad refactors.

## Dependency invariants

- React and ReactDOM MUST remain on the React 18 line in every active origin.
- Base MUST use the dependency architecture recorded in
  [UI_PACKAGE_IMPLEMENTATION.md](UI_PACKAGE_IMPLEMENTATION.md): Material/icons
  5.18.0, Data Grid 6.20.4, and date pickers 6.20.2. Storybook 10, ESLint 9,
  Vite 8, Vitest 4, and Emotion 11 remain on their audited lines.
- Ratan and Cashflow MUST retain their MUI 5 and existing application package
  versions unless a separate migration changes them.
- The npm installation MUST preserve nested workspace dependency isolation.
- Base MUST resolve its own MUI 5 tree. Ratan and Cashflow MUST each resolve
  their declared MUI 5 tree and icon entry points.
- A single root lockfile MUST describe all SCB Next workspaces. Child workspace
  lockfiles MUST NOT be introduced.
- Private package or Maven artifact availability MUST be treated as a release
  prerequisite, not bypassed with an unverified public replacement.
- Runtime packages MUST be declared in `dependencies`; build/test-only packages
  SHOULD be declared in `devDependencies`.

## Compatibility-facade invariants

Compatibility facades MUST provide narrow typed platform capabilities while
the copied business source is adapted to the new runtime.

- A facade MUST preserve the legacy export shape consumed by migrated source.
- A facade MUST NOT contain a second implementation of Cashflow business logic.
- A new capability MUST have a contract test.
- Identity access used during module initialization MUST be safe outside React
  render and MUST NOT invoke hook-backed state at import time.
- Base facades MUST preserve identity, entitlements, service transport,
  storage, telemetry, navigation, portal components, and the canonical MUI
  theme required by their consumers.
- The Cashflow Ratan facade MUST preserve consumed Ratan configuration,
  components, dialogs, utilities, grid skin, and field configuration.
- Cross-application navigation MUST use a typed host handoff rather than a new
  active `System.import`.
- Browser STOMP imports MUST resolve to a browser-compatible entry.

## UI and style invariants

The migration MUST preserve observable production styling, not merely render
the same text.

- The host theme class MUST propagate into nested remotes.
- Poppins typography and compact control defaults MUST remain visible.
- Base's theme injection MUST NOT replace the accepted MUI presentation
  inside unchanged MUI 5 remotes.
- Ratan's CSS namespace MUST remain `MicroWebUI_ratan_container`.
- Cashflow's CSS namespace MUST remain `MicroWebUI_cashflow_cn`.
- Cashflow MUST bundle the required Ratan AG Grid skin locally.
- Ant Design theme tokens, portals, dialog z-index, and overlay contrast MUST
  remain usable in dark and light modes.
- Remote fonts, images, stylesheets, icons, and chunks MUST load from the
  correct origin/base path.
- Fixed-format grids, dialogs, toolbars, selectors, tabs, and buttons MUST NOT
  overlap, clip required controls, or resize unpredictably at accepted desktop
  and `1024x768` viewports.
- Loading, empty, disabled, failure, hover, selected, and dialog states MUST be
  accepted where the migrated journey reaches them.

## Service invariants

Until an independent service migration is accepted, production behavior MUST
preserve:

- HTTP method and pathname;
- query names and encoding;
- authorization and application headers;
- REST/GraphQL request bodies and operation names;
- response envelopes, field names, nullability, paging, ordering, and errors;
- entitlement checks and user-visible disabled/hidden behavior;
- SockJS/STOMP endpoint and message semantics;
- exports, maker/checker actions, and other side effects;
- timeout, retry, loading, empty, and error behavior visible to users.

The platform edge MUST route `/api/auth/v1/fmo/admin/*` to
`portal-tile-management-service` before routing other `/api/auth/*` and
`/api/sso/*` paths to `portal-auth-service`. It MUST route `/api/analytics/*`
to `portal-telemetry-service` and unmatched platform `/api/*` paths to the
retained `single-ui-bff`. Public paths, rewrites, payloads, and headers MUST
remain compatible. The Kubernetes platform edge MUST delegate Ratan API and
static path families only to a Ratan-owned edge. The platform edge MUST NOT
contain or directly reach Ratan
application upstreams. The Ratan edge MUST own specific and fallback
`/api/ratan/*` routing, static aliases, rewrites, WebSocket behavior, caching,
health, and rollout. All browser traffic MUST enter through the platform edge;
application upstreams and tenant edges MUST remain private.

The target BFF MUST compile and pass its tests in a provisioned corporate
environment. Fixture-backed acceptance MUST be labeled frontend-only.

## Development mock invariants

The development mock is a contract replay, not a universal fake backend.

1. Cross-MFE request handling MUST be owned by Base's Vite serve-only
   middleware.
2. Sanitized fixtures MUST live under `scb-next/devops/mock-bff/fixtures/`.
3. The middleware MUST match method and pathname and SHOULD match query/body
   markers when one endpoint carries multiple operations.
4. Specific journey matches MUST run before the generic `/api/` fallback.
5. Fixture IDs and business values MUST remain consistent across list, search,
   details, accounting, and related responses.
6. Login MUST provide the identity, entitlements, drawer, and authorization
   header required by the tested UI.
7. Custom filter/view responses MUST use the builder types requested by the
   Cashflow application and contain usable saved entries.
8. SockJS JSONP requests MUST receive executable callback frames, not ordinary
   JSON. XHR streaming, EventSource, and HTMLfile receivers MUST receive their
   transport-specific framing over an open response. A notification session MUST
   send `CONNECTED` only after receiving the client's STOMP `CONNECT` or `STOMP`
   frame, and MUST release its receive stream and heartbeat when the client closes
   it. Notification startup and workspace removal MUST not create syntax errors,
   stale JSONP callback errors, or reconnect alerts.
9. Raw production credentials, JWTs, secrets, and unrelated personal data MUST
   NOT be committed.
10. Unknown API calls MAY receive a deterministic empty envelope when no
    user-visible behavior depends on them.

The minimum accepted captured journey is:

```text
login
  -> open New Tile drawer
  -> open Cashflow Blotter
  -> render four preset metrics and initial grid
  -> search M0P56753524
  -> double-click the row and render details
  -> render empty accounting lookup
  -> process currency-holiday lookup
  -> open Custom Search and show a saved filter
  -> open Custom View and show a saved view/builder
  -> initialize notifications without a mock transport error
```

The production Nginx mock MUST pass the same journey before it can be used as
production-style parity evidence. It MUST use the same canonical request
handler as development and support the notification transport selected by the
browser without generating failed-transport console errors.

## Functional acceptance criteria

### Login and portal

- Local credentials `mock.cashflow` / `acceptance` MUST authenticate through
  the mock route when normal login is enabled.
- The portal MUST render theme controls, time control, avatar, workspace tabs,
  New Tile, add/remove workspace behavior, and useful remote-load errors.
- The drawer MUST expose the eight accepted Cashflow tiles with permissions
  derived from the login response.

### Cashflow Blotter

- Quick Search MUST render complete controls and accepted MUI styling.
- Four preset metric requests MUST resolve and display Pending Operator and
  Pending Verification counts for both date groups.
- The initial grid MUST render accepted columns, controls, result count, and
  production-shaped records.
- Searching `M0P56753524` MUST yield exactly the captured row and a success
  state.
- Double-clicking that row MUST show a Cashflow Detail dialog containing the
  same ID, trade `56753524`, `WAITING`, `USD`, `11.10`, `2026-08-14`, and
  Pending Operator state without an unable-to-fetch fallback.
- Accounting Detail MUST render the captured empty result as an intentional
  empty state.
- Custom Search MUST open, remain viewport-constrained and closable, and show
  `Pending operator cashflows`.
- The Views selector MUST show `Cashflow operations`; View Builder MUST open,
  remain viewport-constrained and closable, and retain its controls/fields.
- Notification startup MUST not show the interrupted/reconnect alert during
  the accepted mock journey.

### Other Cashflow routes

Every drawer route MUST render either its accepted business screen or its
intentional entitlement gate. It MUST NOT render a blank workspace, missing
remote, uncaught exception, or unrelated application.

## Test and evidence criteria

- Architecture tests MUST prove Vite/Vitest usage, federation topology, strict
  ports, environment-configurable remote paths, deployment controls, CSS
  namespaces, and local grid skin.
- Mock tests MUST cover every specific request branch and the generic fallback.
- New migration modules MUST maintain at least 90% line and branch coverage.
- Playwright MUST exercise login, both federation boundaries, Cashflow loading,
  the captured interaction journey, and production edge when applicable.
- Live Browser MUST inspect visible layout, dialogs, styles, console, and
  request failures at accepted viewports.
- Built artifacts MUST contain no active reference to `scb/`, Single-SPA,
  import maps, or legacy runtime package names.
- Verification evidence MUST record commands, results, environment, commit SHA,
  screenshots or trace paths, warnings, blockers, and rollback revision.
- Historical test counts MUST NOT replace results from the current checkout.

Warnings are acceptable only when identified as inherited debt, shown not to
break the accepted journey, and recorded. New uncaught exceptions, failed
remote/chunk requests, notification errors, or API contract failures block
acceptance.

## Deployment invariants

- Production builds MUST execute Cashflow, then Ratan, then Base.
- Edge, Base, all three portal domain services, retained `single-ui-bff`, Ratan
  container, Cashflow, and tenant backend artifacts MUST have independent
  immutable identities and rollback targets.
- A release record MUST identify the compatible set and accepted commit SHA
  without requiring unrelated units to be rebuilt.
- `remoteEntry.js` MUST use `Cache-Control: no-store`.
- Hashed assets SHOULD use immutable caching.
- The Nginx edge MUST expose `/healthz`, security headers, same-origin remote
  paths, canonical and compatibility tenant paths, WebSocket forwarding, and
  independently configurable platform and tenant API upstreams.
- Containers MUST use read-only filesystems, required `tmpfs` paths, and
  `no-new-privileges` as specified by the deployment configuration.
- VM/Ansible MUST remain the production method until a separate infrastructure
  decision approves Kubernetes or another substrate.
- A Kubernetes deployment MUST expose only the edge through Ingress, keep all
  upstream Services `ClusterIP`, and verify NetworkPolicy on an enforcing CNI.
- Each portal domain service MUST have its own Deployment, ClusterIP Service,
  probes, resources, restricted security context, replica control, ownership
  labels, and PodDisruptionBudget. Compatible `single-ui-bff` code MAY be used
  initially, but runtime isolation MUST NOT be described as source or data
  isolation.
- Production certification MUST use the real platform and tenant BFFs plus production identity,
  authorization, CSP/CORS, browser/OpenFin, license, and telemetry contracts.

## Rollback invariants

- The accepted legacy revision and route MUST remain available during the
  rollback window.
- Rollback MUST restore routing to the legacy root-config/import-map deployment
  rather than modifying the preserved source baseline.
- Failed target artifacts and evidence MUST be retained for diagnosis.
- Generated target artifacts MUST NOT be patched in place.
- Operators MUST be able to roll back one failed platform or tenant unit
  without rebuilding or reverting unrelated units.
- Data, workflow, or schema effects MUST have a separate backward-compatible
  rollback plan.

## Definition of done

A migration is done only when all of the following are true:

- every in-scope legacy behavior has a target owner and parity evidence;
- the active runtime has no source/build/runtime dependency on `scb/`;
- dependency isolation and React singleton contracts pass;
- focused, workspace, architecture, mock, build, and applicable browser gates
  pass from the current checkout;
- development mock and any claimed production mock cover the complete accepted
  journey;
- backend-connected acceptance passes for production certification;
- evidence and commits are traceable to both source and target revisions;
- the rollback route and owner are recorded.
