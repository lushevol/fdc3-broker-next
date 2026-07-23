# Portal Platform POC Constitution

## 1. Status and authority

This document defines the architectural rules for the Portal Platform POC and the non-negotiable direction of the target platform. It is a specification, not an implementation plan.

The keywords **MUST**, **MUST NOT**, **SHOULD**, and **MAY** are normative.

This constitution consolidates the current project decisions from:

- The current repository architecture and engineering rules.
- The long-term product goals agreed for the Portal Platform.
- The evidence already present under `mvp/two-layer-federation/poc/`.

This repository document is self-contained and is the governing design baseline for the POC. A production architecture decision record is required before changing a long-term rule.

## 2. Product definition

The Portal Platform is the central, governed application environment for independently owned tenant applications.

It provides:

- single sign-on and session management;
- application discovery and entitlement-aware launch;
- a user workspace containing tile instances;
- foundational platform capabilities, initially observability, notification, and FDC3 interoperability;
- governed runtime registration and loading;
- a design system and application scaffolds;
- a gateway boundary through which tenant UI artifacts and backend services are reached.
- certified execution in OpenFin with FDC3 interoperability;
- production delivery of all UI as static resources routed through Nginx.

It does not own tenant business behavior, tenant business data, or tenant-specific UI composition.

## 3. Canonical terms

| Term | Meaning |
| --- | --- |
| Portal Host | The platform-owned browser runtime and shell. It owns session context, launcher, workspace, tile lifecycle, and platform capability adapters. |
| Tile | A tenant-owned application UI that is registered with and opened inside the Portal. A tile is a product concept, independent of its loader technology. |
| Tile definition | The registry record describing one tile type, including identity, entry location, contract versions, entitlements, routes, and ownership. |
| Tile instance | One mounted occurrence of a tile definition in a workspace. Multiple instances of the same tile definition are valid and distinct. |
| Tenant | The team and deployment boundary that owns a tile and its business services. |
| Workspace | The platform-owned canvas containing zero or more tile instances. |
| Platform capability | A host-provided, versioned API such as session context, telemetry, notification, workspace lifecycle, or FDC3 access. |
| Registry | The platform-owned source of truth for approved tile definitions and their environment-specific runtime locations. |
| Gateway | The Nginx production data-plane boundary that routes approved static UI and API paths to tenant deployments. Desired route state remains platform-controlled. |
| POC | Disposable evidence for one small set of architectural hypotheses. It is not a production platform. |

## 4. Long-term architectural rules

### R-001 — Platform and tenant ownership are separate

- The Portal Host **MUST** own platform shell behavior only.
- A tenant **MUST** own its tile UI, business behavior, backend service, release, and operational support.
- Platform packages **MUST NOT** contain tenant-specific business semantics.
- A tenant tile **MUST NOT** take ownership of portal navigation, global session lifecycle, the workspace root, or global overlays.

### R-002 — The browser runtime has two application layers

- The target runtime graph **MUST** be `Portal Host -> Tile`.
- A shared runtime container between the host and a tile **MUST NOT** become a third application layer.
- Reusable code **MUST** be classified as a versioned platform package, a versioned design-system package, a tenant package, or deleted.
- Module Federation is the current POC loader choice. Loader mechanics **MUST NOT** redefine ownership or platform contracts.

### R-003 — Tiles deploy independently

- A tenant **MUST** be able to release a compatible tile without rebuilding or redeploying the Portal Host.
- The host **MUST** discover tiles from registry data at runtime.
- The host **MUST NOT** import tenant source code or contain a compile-time list of tenant implementations.
- Runtime compatibility **MUST** be checked before a tile is mounted.
- Production host and tile UI builds **MUST** produce static resources only. UI delivery **MUST NOT** require a Node.js application server, server-side rendering, runtime compilation, or dependency installation.
- Static host, remote manifest/entry, JavaScript, CSS, font, image, and source-map policies **MUST** be explicit in the production artifact contract.

### R-004 — The registry is the loading source of truth

- Every tile **MUST** have an approved registry record.
- The record **MUST** include stable tile identity, tenant identity, owner, display metadata, entitlement requirement, runtime entry descriptor, application-contract version, environment, and approved UI/API routes.
- A loader manifest **MAY** describe build artifacts, but it **MUST NOT** replace the platform registry as the governance source of truth.
- Unknown, invalid, incompatible, or unentitled tiles **MUST NOT** mount.

### R-005 — Tenant traffic crosses the gateway boundary

- Browser access to tenant UI artifacts and backend APIs **MUST** use approved portal/gateway routes.
- A tile **MUST NOT** embed an unregistered tenant-server or external-service URL.
- UI artifact routing and API routing **MAY** target different tenant deployments.
- Nginx **MUST** be the production routing data plane for Portal Host resources, tenant tile static resources, and tenant API routes.
- Platform registry/control-plane data **MUST** remain the source of desired route state. Nginx configuration is generated or governed execution state and **MUST NOT** become the only source of routing truth.
- Tile registry entries **MUST** use approved Nginx-facing paths rather than embedding direct tenant-server addresses.
- Hashed static assets **MUST** use immutable caching. Host entry HTML, active registry/config, and any mutable routing descriptor **MUST** use a cache policy that permits controlled activation and recovery.
- Client-side deep links and Module Federation artifact paths **MUST** have explicit, non-conflicting Nginx routing rules.
- Environment routes **MUST NOT** cross dev, test, and production boundaries.

### R-006 — Identity and session are platform capabilities

- The Portal **MUST** establish SSO and own the browser session lifecycle.
- Tiles **MUST** consume a bounded, read-only session/user context through a versioned platform contract.
- Raw identity-provider tokens **MUST NOT** be exposed to arbitrary tile code when a delegated or gateway-mediated mechanism can be used.
- Approved gateway requests to tenant services **MUST** carry the platform-defined JWT header, and tenant services **MUST** resolve it through the versioned platform auth SDK.
- The auth SDK **MUST** verify signature, issuer, audience, expiry, and required claims before exposing a typed principal and entitlement context; decoding without verification is prohibited.
- Logout, expiry, renewal failure, and session revocation **MUST** produce consistent platform behavior across all open tile instances.
- A POC **MAY** use deterministic fakes; it **MUST NOT** claim that fake identity proves production SSO or session security.

### R-007 — Entitlement is enforced twice

- The launcher **MUST** show only tiles the current user is entitled to discover.
- The host **MUST** re-check entitlement before mounting a tile.
- Tenant backend services **MUST** independently authorize every protected operation; launcher visibility is not authorization.
- Entitlement changes during a session **MUST** have a defined refresh and revocation behavior before production migration.

### R-008 — The workspace owns tile instances

- A workspace **MUST** support multiple simultaneous instances of the same tile definition.
- Every mounted instance **MUST** have a unique, stable `instanceId` distinct from `tileId`.
- Close, activate, restore, telemetry, notification targeting, and FDC3 context routing **MUST** identify the tile instance where relevant.
- Instance-local UI state **MUST NOT** leak into another instance unless an explicit platform interaction causes it.
- A tile **MUST** render only inside a platform-provided workspace surface.
- The Portal **MUST** own global focus, layering, lifecycle, and workspace persistence policy.

### R-009 — Cross-tile coupling is prohibited

- A tile **MUST NOT** import another tile, call a function exported by another tile, reach into another tile's DOM, or use an undocumented global event.
- Interoperability **MUST** use the platform FDC3 adapter or another explicitly approved, versioned platform contract.
- Shared browser stores **MUST NOT** be used for tenant business state.
- Platform events **MUST** be typed, bounded, observable, and attributable to a caller and instance.

### R-010 — FDC3 is the interoperability foundation

- The Portal **MUST** expose FDC3 through a versioned platform adapter.
- Tenant tiles **MUST NOT** depend on host implementation details to raise intents, broadcast context, or resolve applications.
- FDC3 actions **MUST** preserve user, caller tile, caller instance, target, correlation, and outcome metadata for policy and telemetry.
- OpenFin **MUST** be a certified production runtime for the Portal Host and onboarded tiles.
- The host **MUST** own the OpenFin integration boundary and expose standards-based FDC3 behavior to tiles. Tiles **MUST NOT** depend directly on proprietary OpenFin APIs when the platform FDC3 adapter can provide the behavior.
- OpenFin-originated and Portal-originated FDC3 intents and contexts **MUST** interoperate through one governed identity, resolver, policy, and telemetry model.
- Production readiness **MUST** define and verify a supported OpenFin runtime/version window, startup and lifecycle behavior, window/workspace integration, FDC3 conformance journeys, and failure containment.
- A dedicated interoperability POC **MUST** prove one minimal context/intent journey before FDC3 is promoted into production contracts; broad intent catalogs, workflows, and cross-tenant policy are later work.

### R-011 — Observability is built into the contract

- The host **MUST** emit lifecycle telemetry for registry resolution, load, mount, activation, unmount, and failure.
- Tiles **MUST** use the platform telemetry API for platform-correlated events.
- Ratan Design components **MUST** expose built-in observability through a typed design-observability capability injected by the design-system provider.
- Built-in component instrumentation **MUST** emit semantic interaction, state, validation, error, and duration events where meaningful; consumers **MUST NOT** reimplement routine component telemetry manually.
- Design components **MUST NOT** send telemetry directly to a network endpoint, depend on the Portal Host, record input values or other business payloads, or fail UI behavior when telemetry is unavailable.
- The injected adapter **MUST** enrich component events with tenant, tile, instance, session pseudonym, component/version, correlation, action, outcome, and timestamp as applicable.
- Standard component events **MUST** be enabled by default. Sampling, masking, retention, and event suppression **MUST** be controlled by central platform privacy and observability policy, not independently by each tile.
- Standalone development, tests, and Storybook **MUST** use deterministic no-op or collecting adapters.
- Required correlation fields are `tenantId`, `tileId`, `instanceId`, `user/session pseudonym`, `eventName`, `timestamp`, `correlationId`, and outcome where applicable.
- Sensitive values **MUST NOT** be logged in plaintext.
- The Portal **MUST** define event schemas and delivery contracts; it **MUST NOT** build a competing observability backend when the enterprise observation platform is available.

### R-012 — Notifications are platform-mediated

- Tenant services and tiles **MUST** publish structured notification events; they **MUST NOT** control global portal presentation directly.
- The platform **MUST** apply entitlement, user/session, tenant, topic, deduplication, and rate policies before delivery.
- Notification delivery and user interaction **MUST** be observable.
- A dedicated notification POC **MUST** prove a single in-memory journey before notification contracts are promoted; durable messaging and production fan-out are later work.

### R-013 — The design system is mandatory infrastructure

- All new host and tile UI **MUST** consume semantic design tokens and approved primitives.
- Approved Ratan Design primitives **MUST** use the design-system observability functions for their standard interactions and states.
- A tile **MUST NOT** define a competing global theme, CSS reset, z-index scale, typography system, or motion system.
- Generated CSS classes or host DOM structure **MUST NOT** be used as a cross-root contract.
- React and ReactDOM **MAY** be shared runtime singletons; design-system libraries, styling engines, and domain UI **MUST NOT** become federated runtime application layers.
- A tenant **MAY** own domain components, layouts, forms, charts, and grids when they obey platform tokens, accessibility, loading, empty, error, and interaction rules.
- Exceptions **MUST** have an owner, reason, bounded scope, risk level, expiry date, and replacement plan.

### R-014 — Platform capabilities are explicit and versioned

- Tiles **MUST** receive capabilities through the application contract, not by importing host internals or reading arbitrary globals.
- Each capability **MUST** define ownership, version, compatibility policy, errors, timeout behavior, and test doubles.
- A tile **MUST** be able to run locally with deterministic capability adapters.
- The platform capability set **MUST** include a typed design-observability adapter consumed by Ratan Design through its provider boundary.
- Adding a capability to the POC **MUST** be justified by a POC acceptance journey; speculative APIs are prohibited.

### R-015 — Official scaffolds are the production onboarding path

- Every new production tile and tenant Java service **MUST** be created from an approved scaffold CLI.
- The tile template **MUST** include the application contract, design-system setup, local platform adapters, telemetry, FDC3 access, tests, linting, build configuration, and CI conformance gates.
- The Java service template **MUST** use the platform auth SDK to verify the approved request JWT and expose typed identity/entitlement context. It **MUST** also include gateway path conventions, authorization integration points, health/readiness endpoints, structured logging, OpenTelemetry, input validation, tests, and secure configuration.
- Generated projects **MUST** be independently buildable and deployable.
- The scaffold **MUST NOT** be built in the first runtime/workspace POC. It starts only after the contracts it would generate are proven.

### R-016 — POCs are minimal and disposable

- Every POC **MUST** state one primary hypothesis, a bounded acceptance journey, evidence, and exit criteria before code is changed.
- A POC **MUST** implement the minimum behavior needed to resolve its named uncertainty.
- Production control planes, broad abstraction frameworks, generalized component catalogs, and speculative features **MUST NOT** be added to make a POC look complete.
- POC package identities **MUST** retain `-poc`, remain private, and stay isolated from `realworld` packages.
- POC code **MUST NOT** be promoted by renaming or copying wholesale. Proven contracts are redesigned and implemented through a separate production change.
- Failure to meet an exit criterion **MUST** produce a recorded decision, not concealed scope expansion.

### R-017 — Migration is a measured strangler, not a rewrite

- The target migration chain is explicitly:

  ```text
  apps/root-config
    -> apps/base
    -> apps/mfe-ratan-container
    -> apps/mfe-cashflow-blotter
  ```

- The first production vertical slice **MUST** prove replacement of a bounded Cashflow journey on the new host.
- Legacy and new runtimes **MAY** coexist behind controlled routes during migration.
- A cohort **MUST** have compatibility evidence, telemetry, rollback, and ownership before traffic moves.
- `root-config`, `base`, and `mfe-ratan-container` **MUST NOT** be retired until their remaining consumers are inventoried and migrated or explicitly removed.
- No new business feature **SHOULD** increase dependence on the legacy container layer.

## 5. Smallest Portal POC

### 5.1 Primary hypothesis

One platform host can establish a deterministic session, discover an entitled independently built tenant tile at runtime, and run two isolated instances of that same tile without a shared runtime container.

This is the smallest useful Portal POC because it tests the defining product boundary: one governed platform canvas hosting independently owned, repeatable tile instances.

### 5.2 Required acceptance journey

The POC is complete only when the automated acceptance suite demonstrates all of the following through one primary user journey plus focused failure and registry evidence:

1. The user performs one explicit fake login action and the host establishes a deterministic user/session.
2. The launcher is generated from a runtime registry and hides an unentitled registry entry.
3. The user opens the entitled Cashflow tile twice.
4. The workspace displays two distinct instance identities for the same `tileId`.
5. A state change in one instance does not mutate the other instance.
6. Host lifecycle telemetry identifies each instance during open, activate, close, and failure events.
7. Closing one instance leaves the other instance mounted and usable.
8. An incompatible or failed remote is contained without crashing the host or the healthy instance.
9. Changing the registry entry can select a compatible tile artifact without rebuilding the host.

### 5.3 Included scope

- One Portal Host.
- One real tile definition: Cashflow.
- Two concurrent Cashflow tile instances.
- One synthetic unentitled registry entry used only to prove filtering.
- Static, runtime-loaded registry data with schema validation.
- Module Federation as the POC loader.
- One explicit fake login action backed by deterministic session and entitlement adapters.
- Minimal workspace open, activate, close, and instance identity behavior.
- Existing bounded appearance/design-system proof.
- One in-memory host lifecycle telemetry sink.
- Load/contract failure isolation.
- Unit, contract, boundary, and browser evidence.

### 5.4 Explicitly excluded scope

The first Portal POC **MUST NOT** add:

- a real identity provider, production token handling, or distributed session store;
- a production Nginx, gateway, route-control service, or tenant deployment;
- a real tenant Java backend;
- the scaffold CLI or template generation;
- a production notification broker or WebSocket service;
- notification product behavior beyond an existing no-op/local test adapter;
- FDC3 context, intent, or resolver behavior;
- an enterprise telemetry backend or dashboards;
- a general capability gateway, workflow orchestrator, policy engine, chatbot integration, or AI actions;
- workspace layout persistence, drag/drop, free-form resizing, or cross-device restore;
- multiple tile types, multiple tenants, or cross-tenant communication;
- a complete FDC3 implementation or catalog;
- production signing, SBOM, canary, promotion, or rollback automation;
- a broad design-system component catalog;
- changes under `mvp/two-layer-federation/realworld/`;
- migration of any current production application.

### 5.5 Evidence and exit gates

| Gate | Required evidence |
| --- | --- |
| Runtime boundary | Network/build evidence shows `host -> tile`; no Single-SPA, SystemJS, import map, base remote, or Ratan runtime container. |
| Registry | Invalid and incompatible records are rejected before mount; registry change does not require a host build. |
| Multi-instance | Two instances share `tileId`, have different `instanceId` values, and retain isolated local state. |
| Entitlement | An unentitled tile is absent from discovery and cannot be mounted through a direct route. |
| Observability | Host lifecycle events cross a typed in-memory adapter and include tile and instance attribution. |
| Failure isolation | One failing instance does not crash the host or another healthy instance. |
| Design boundary | No cross-root theme context, generated class dependency, or design-system runtime remote. |
| Quality | Tests precede implementation, affected bounded packages meet the repository coverage rule, lint has zero warnings, and build/boundary checks pass. |
| Scope | None of the explicit exclusions are introduced. |

Passing this POC authorizes a production architecture proposal. It does not authorize direct promotion of POC code.

## 6. Sequence after the first POC

Only one slice should be active at a time.

| Slice | Question answered | Earliest output |
| --- | --- | --- |
| POC 1 — portal core | Can a governed host establish a fake session, filter registered tiles by entitlement, and safely run repeatable independent tile instances? | Evidence described in section 5. |
| POC 2 — OpenFin/FDC3 boundary | Can an OpenFin-originated caller raise canonical intent `scb.fmptp.SearchCashflows` with `scb.fmptp.cashflow.query` context through the host-owned FDC3 adapter with identity, resolution, and correlation? | Reuse the target when exactly one compatible instance exists, open one when none exists, and show the resolver when multiple exist. Temporarily alias legacy `SearchCashflows` with telemetry and a sunset date. No general capability gateway, workflow, or broad intent catalog. |
| POC 3 — Nginx tenant boundary | Can static Host and Tile UI artifacts plus one minimal Spring Boot service operate only through approved Nginx routes, with the platform auth SDK verifying the request-header JWT and producing trace correlation? | One UI/API vertical journey; no route control plane automation. |
| POC 4 — notification boundary | Can one structured tenant event be safely targeted, delivered, displayed, and observed through a platform adapter? | One in-memory end-to-end event; no durable broker. |
| POC 5 — design observability | Can one Button and one form control emit safe, correlated semantic events through an injected design-observability adapter without changing UI behavior? | Two component journeys; no broad instrumentation catalog or production telemetry backend. |
| POC 6 — scaffold | Can the proven UI and Java contracts be generated and pass conformance without manual platform wiring? | One CLI command per template and generated-project verification. |
| Workspace evolution — roadmap | Do real workflows require simultaneous visibility beyond duplicate tabs? | Prove fixed multi-pane layouts before considering free-form movement, resizing, or drag/drop. |
| Realworld 1 — platform foundation | Can production host/contracts/design foundations be released independently with explicit compatibility? | Production-owned packages and host skeleton. |
| Realworld 2 — Cashflow pilot | Can one bounded journey from the legacy chain run on the new host with rollback and operational evidence? | First migration cohort. |
| Migration factory | Can additional tiles migrate repeatably without custom platform work? | Templates, runbooks, automated gates, and cohort tracking. |

No later slice may be pulled into an earlier POC merely because it is part of the final platform.

## 7. Change control

Any proposal that violates an `R-*` rule must include:

1. the exact rule being challenged;
2. the architectural force that cannot be satisfied otherwise;
3. at least two alternatives considered;
4. the smallest time-bounded exception;
5. owner, expiry date, migration plan, and evidence required to remove the exception.

Silence, schedule pressure, or existing legacy behavior is not approval for an exception.
