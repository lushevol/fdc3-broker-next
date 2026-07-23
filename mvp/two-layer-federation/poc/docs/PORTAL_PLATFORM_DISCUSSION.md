# Portal Platform Decision Register

## 1. Purpose and status

This document is the self-contained record of Portal Platform design decisions. It organizes the target platform, the MVP-first delivery sequence, current POC evidence, migration direction, and questions that still require confirmation.

No implementation is authorized by this document.

The normative rules are in [PORTAL_PLATFORM_POC_CHARTER.md](./PORTAL_PLATFORM_POC_CHARTER.md). Once a decision marked **Proposed** is confirmed, it must be changed to **Accepted** here and reflected in the constitution when normative language is needed.

Decision states:

| State | Meaning |
| --- | --- |
| Accepted | Current project direction. Design and later implementation must comply. |
| Proposed | Recommended direction requiring explicit confirmation. |
| Deferred | Relevant to the target platform but intentionally outside the current POC. |
| Rejected | Direction that must not be pursued without a new architecture decision. |
| Superseded | A former direction replaced by a newer project requirement. |

## 2. Platform at a glance

The Portal is a governed enterprise application canvas, not a generic MFE framework and not a shared business-component container.

```text
User
  -> Portal Gateway
      -> Portal Host
          -> SSO/session and entitlement-aware launcher
          -> workspace containing zero or more tile instances
          -> versioned platform capabilities
          -> runtime registry
      -> independently deployed tenant tile artifacts
      -> independently deployed tenant backend services
```

The target platform provides five capability groups:

1. **Access:** SSO, session lifecycle, entitlement-aware discovery, and authorization integration.
2. **Runtime:** registry-driven loading, compatibility checks, tile lifecycle, failure isolation, and workspace management.
3. **Foundations:** design system, observability, notifications, and FDC3 interoperability.
4. **Tenant integration:** approved UI/API routes, proxy mediation, independent deployment, and health contracts.
5. **Developer platform:** UI and Java scaffolds, local adapters, conformance tests, and CI gates.
6. **Desktop compatibility:** certified OpenFin execution with governed FDC3 interoperability.
7. **Production delivery:** static-only UI artifacts routed through Nginx.

## 3. Accepted project decisions

### A-001 — Platform ownership boundary

**State:** Accepted

- The Portal owns platform access, shell, workspace, registry, and foundational capability contracts.
- Tenants own business UI, business services, business data, release cadence, and operational support.
- Platform packages contain no tenant business semantics.

### A-002 — Two application runtime layers

**State:** Accepted

The target browser graph is `Portal Host -> Tile`. A shared runtime container must not sit between them. Reuse occurs through versioned packages or platform capabilities, not another mounted application layer.

### A-003 — Independent tenant deployment

**State:** Accepted

A compatible tile can be built and deployed without rebuilding the host. Tenant UI and backend services may deploy separately. The host discovers approved tile artifacts at runtime through registry data.

### A-004 — Registry-first governance

**State:** Accepted

The platform registry is the source of truth for tile identity, tenant, owner, display metadata, entitlement, environment, contract versions, artifact descriptor, routes, and lifecycle. Loader manifests are artifact metadata, not governance truth.

### A-005 — Tile definition and tile instance are different identities

**State:** Accepted

`tileId` identifies an onboarded application type. `instanceId` identifies one mounted occurrence. A workspace must allow multiple isolated instances of the same tile, and lifecycle operations must address instances rather than tile definitions.

### A-006 — Host-owned workspace

**State:** Accepted

The Portal owns workspace surfaces, activation, close behavior, global layering, focus, and persistence policy. A tile owns only its content and local state and cannot create a competing global root.

### A-007 — No direct cross-tile coupling

**State:** Accepted

Tiles cannot import each other, call exported functions directly, reach into another tile's DOM, share tenant business stores, or use undocumented globals. Cross-tile interaction uses FDC3 or another approved, typed, versioned platform contract.

### A-008 — Design system is mandatory

**State:** Accepted

New host and tile UI use platform semantic tokens, primitives, interaction rules, accessibility rules, platform-controlled appearance, and built-in component observability. Domain components stay with tenants. Design packages do not become runtime remotes or a third application layer.

### A-009 — Proxy-only tenant access

**State:** Accepted

Approved Nginx routes mediate browser access to tenant UI artifacts and APIs. Tiles cannot embed unregistered tenant or external service URLs. Nginx is the production data plane, while desired routing truth belongs to platform registration data.

### A-010 — Platform-owned identity and session lifecycle

**State:** Accepted

The Portal establishes SSO, owns session lifecycle behavior, and supplies a bounded session context to tiles. Tile visibility and mount are entitlement-controlled. Approved gateway requests carry the platform-defined JWT header; tenant backend services use the platform auth SDK to verify it, resolve typed identity/entitlement context, and independently authorize protected operations.

### A-011 — Foundational platform capabilities

**State:** Accepted

Observability, notification, and FDC3 are foundational platform capabilities. They use explicit versioned contracts and carry user, tenant, tile, instance, and correlation identity where relevant. Their production infrastructure is not part of POC 1.

### A-012 — Official UI and Java scaffolds

**State:** Accepted

The long-term onboarding path is a scaffold CLI for a compliant tile and a compliant Java service. Scaffolds are built only after their contracts have been proven by focused POCs.

### A-013 — MVP-first evidence sequence

**State:** Accepted

Each POC answers one primary architectural question with the smallest end-to-end journey. A POC cannot pull in production infrastructure or later platform ambitions merely because they belong to the long-term target.

### A-014 — Strangler migration

**State:** Accepted

Migration is incremental and evidence-driven, with Cashflow as the first production vertical slice. The legacy chain is decomposed by responsibility rather than copied:

```text
apps/root-config
  -> apps/base
  -> apps/mfe-ratan-container
  -> apps/mfe-cashflow-blotter
```

Legacy retirement requires consumer inventory, compatibility evidence, telemetry, controlled traffic movement, and rollback.

### A-015 — OpenFin is a required production runtime

**State:** Accepted

The Portal Host and onboarded tiles must run correctly in the supported OpenFin runtime window. The host owns the OpenFin boundary and exposes governed FDC3 behavior to tiles. OpenFin-originated and Portal-originated intents and contexts share platform identity, resolution, policy, audit, and telemetry. Tiles do not use proprietary OpenFin APIs when the platform FDC3 adapter covers the required behavior.

Production certification includes startup/lifecycle behavior, workspace/window integration, supported runtime versions, the `scb.fmptp.SearchCashflows` journey, resolver behavior, external-origin bridging, and failure containment.

### A-016 — Production UI is static and routed by Nginx

**State:** Accepted

All production Host and Tile UI builds compile to static resources. UI delivery requires no Node.js application server, server-side rendering, runtime compilation, or runtime dependency installation. Nginx is the production data plane for Portal Host assets, tenant tile artifacts, and tenant API proxy routes.

The platform registry/control plane remains the desired-state authority; Nginx configuration is governed execution state. Registry entries expose approved Nginx paths rather than direct tenant-server addresses. Hashed assets are immutable, while entry HTML and active registry/config use controlled activation and recovery cache policies.

## 4. Delivery decisions

### P-001 — POC 1 contains only the portal core

**State:** Accepted

**Recommendation:** POC 1 proves one fake login/session, registry validation, entitlement-aware launcher, two isolated Cashflow instances, instance-specific lifecycle, host lifecycle telemetry, remote failure containment, and registry changes without a host rebuild.

FDC3 behavior, notification behavior, proxy/Java integration, layout persistence, free-form canvas behavior, scaffold generation, and production delivery are excluded.

**Why:** This is the smallest complete portal product journey and keeps one primary hypothesis: can the host govern repeatable independent tile instances?

**Roadmap option retained:** FDC3 and notification behavior remain committed foundational capabilities, each proven through its own later POC rather than being folded into POC 1.

### P-002 — POC 1 workspace uses duplicate tabs

**State:** Accepted

**Recommendation:** Represent instances as `Cashflow 1` and `Cashflow 2` in a tab strip. Both remain open with isolated state; one is active at a time. Do not add panes, drag/drop, resizing, or free-form layout.

**Alternative:** Two fixed simultaneous panes would prove concurrent visibility but introduce surface layout concerns that are not necessary to prove multi-instance lifecycle.

**Roadmap option retained:** Simultaneously visible panes, followed by movable/resizable or free-form layouts if justified by user workflows, remain future workspace options after duplicate-tab behavior is proven.

### P-003 — POC 1 preserves an explicit fake login action

**State:** Accepted

**Recommendation:** Use one deterministic host-owned “login” action that establishes a fake user/session and entitlement set. Do not imitate an identity-provider protocol, token exchange, account selection, or renewal.

**Why:** It proves that discovery and workspace access occur only after the platform establishes a session while avoiding production identity scope.

**Roadmap option retained:** A pre-authenticated deterministic adapter may be added later for isolated tests, Storybook, and local developer workflows. It does not replace the explicit login acceptance journey or production SSO.

### P-004 — Module Federation is the preferred loader, not a constitutional dependency

**State:** Accepted

**Recommendation:** Continue Module Federation for the POC and expected production direction. Keep tile identity, registry, lifecycle, and platform capability contracts independent of loader-specific APIs.

**Why:** The current evidence supports Module Federation, but platform governance should survive a future loader change.

### P-005 — The first FDC3 POC uses SearchCashflows

**State:** Accepted

**Decision:** The canonical new intent is `scb.fmptp.SearchCashflows`. Its first payload uses the existing `scb.fmptp.cashflow.query` context shape with `filters` and `target`. Raise it through a host-owned FDC3 adapter and record the user, caller tile and instance, resolved target tile and instance, correlation ID, input validation outcome, and intent result.

**Compatibility decision:** The current platform declares wire intent `SearchCashflows` and uses context type `scb.fmptp.cashflow.query`. During migration, the platform temporarily aliases legacy `SearchCashflows` to canonical `scb.fmptp.SearchCashflows`. Alias use must be observable, have an owner and sunset date, and must not be offered to new consumers.

**Resolution decision:** Reuse the target when exactly one compatible Cashflow instance exists. Open a new compatible instance when none exists. Show the platform resolver when multiple compatible instances exist. The POC proves only this intent and resolution behavior.

### P-006 — General capability gateway remains evidence-driven

**State:** Accepted

**Recommendation:** Keep host capabilities small and explicit. Approve a general cross-application Capability Gateway only after at least two non-FDC3 use cases show that FDC3 intents/context and tenant backend APIs are insufficient.

**Alternative:** Commit now to a registry, schema validation, policy, versioning, provider auto-load, audit, and usage graph for general capabilities. This is powerful but creates a substantial platform product before its use cases are demonstrated.

### P-007 — Workflow orchestration is conditional

**State:** Accepted

**Recommendation:** Do not commit to a workflow engine in the portal foundation. Add lightweight orchestration only after governed capabilities exist and a real multi-step business journey requires retry, confirmation, or audit across providers.

If adopted later, it should use established workflow concepts, require caller identity, validate every step, audit execution, and require confirmation for high-risk actions.

### P-008 — Route control plane follows the proxy POC

**State:** Accepted

**Decision:** First prove one approved static UI route and one approved API route through Nginx to a minimal tenant service. Route onboarding and changes remain ADO/work-item initiated. The Portal provides status, inventory, validation results, and audit views. The control-plane API owns schema validation, conflict detection, risk classification, Nginx configuration generation, deployment/reload orchestration, health verification, and effective-state reporting. These control-plane capabilities are built only after the Nginx boundary is proven.

### P-009 — Spring Boot is the first Java scaffold

**State:** Accepted

**Decision:** Support one Spring Boot template initially. It includes gateway conventions, validation, health/readiness, structured logging, OpenTelemetry, tests, and secure configuration. It does not impose tenant domain architecture.

The template uses a versioned platform auth SDK that resolves the JWT from the approved request header, verifies signature, issuer, audience, expiry, and required claims, and exposes a typed principal and entitlement context. Tenant services remain responsible for authorizing protected business operations. Parsing or decoding a JWT without verification is not authentication.

### P-010 — Cashflow begins with a read-only migration cohort

**State:** Accepted

**Decision:** The first migration cohort raises `scb.fmptp.SearchCashflows`, resolves or opens the Cashflow Blotter, applies `scb.fmptp.cashflow.query` filters, and displays read-only results. Write, approval, and orchestration journeys wait until session delegation, proxy behavior, observability, and rollback are proven.

### P-011 — AI/chatbot is a governed caller, not a portal foundation feature

**State:** Accepted

**Decision:** Treat AI/chatbot as a future caller with its own identity. It receives no elevated authority, and high-risk or cross-tenant actions require policy validation, audit, and user confirmation. Do not include it in Portal foundation POCs 1–6.

### P-012 — Production observability integrates with the enterprise platform

**State:** Accepted

**Decision:** Portal owns event schemas, correlation, masking, and delivery contracts but does not build a separate ELK/Grafana/OpenSearch estate. Production telemetry integrates with the enterprise observation platform.

### P-013 — Ratan Design components have built-in observability

**State:** Accepted

Ratan Design provides built-in typed instrumentation functions for meaningful component interaction, state, validation, error, and duration events. Components emit through a design-observability capability injected into the design-system provider; they never call an observability backend directly.

The capability boundary must:

- enrich events with tenant, tile, instance, session pseudonym, component name/version, action, outcome, timestamp, and correlation ID;
- avoid input values, displayed business data, credentials, JWTs, and arbitrary consumer payloads;
- be centrally controllable for privacy, sampling, and event policy;
- use deterministic no-op or collecting adapters in standalone development, tests, and Storybook;
- make telemetry non-blocking so telemetry failure never changes component behavior;
- separate standard component events from tenant-defined business events.

Standard component events are enabled by default. Central platform policy owns privacy controls, sampling, masking, retention, and suppression. Individual tiles cannot silently disable mandatory platform events.

Promotion starts with the smallest cohort—one Button interaction and one form-control validation journey—before expanding to other primitives or patterns.

### P-014 — Workspace evolves from tabs to fixed panes before free-form layout

**State:** Accepted

POC 1 uses duplicate tabs with one active instance. If simultaneous visibility is justified by real workflows, the next workspace model is a bounded fixed multi-pane layout. Movable/resizable free-form tiles, drag/drop, and complex layout persistence remain later options and require evidence that fixed panes are insufficient.

### P-015 — POC registry identity uses tileId

**State:** Accepted

Rename the current POC registry field `id` to `tileId` and require the remote application identity to match it. This makes the contract distinguish product-level tile identity from `instanceId` before implementation spreads the ambiguous field.

### P-016 — Inactive tab instances remain mounted

**State:** Accepted

Keep every ready POC 1 instance mounted until explicitly closed. Inactive roots are hidden from rendering, pointer input, keyboard focus, and the accessibility tree. This is the smallest way to prove retained isolated React state; suspension and eviction are later policies.

### P-017 — Portal lifecycle event vocabulary

**State:** Accepted

Adopt the POC 1 lifecycle names `portal.session.login.succeeded`, `portal.registry.load.succeeded|failed`, `portal.tile.open.requested|denied`, `portal.tile.mount.succeeded|failed`, `portal.tile.activated`, and `portal.tile.closed`. These names cover only host lifecycle evidence and do not define tenant business or design-component telemetry.

## 5. Deferred target capabilities

These capabilities remain relevant but cannot enter POC 1:

| Capability | Earliest decision gate |
| --- | --- |
| Fixed multi-pane layouts | After duplicate-tab multi-instance behavior is proven and simultaneous-visibility workflows are documented. |
| Free-form canvas, movable/resizable tiles, drag/drop, and complex workspace persistence | Only after fixed panes are proven insufficient by measured user workflows. |
| Notification subscriptions, targeting, deduplication, throttling, durable delivery, and fan-out | After one structured notification POC. |
| Route self-service, review workflow, risk classification, config generation, deployment, and health verification | After the tenant proxy/service POC. |
| Capability registry, general invocation gateway, provider auto-load, usage graph, and semver lifecycle | After qualifying non-FDC3 use cases exist under accepted decision P-006. |
| Workflow plans, retry, abort, confirmation, and chatbot-generated execution | After governed general capabilities exist. |
| Cross-tenant capabilities and data transfer | After identity, entitlement, policy, audit, and data-classification models are production-ready. |
| Production artifact signing, SBOM, immutable promotion, canary, and registry rollback | Realworld delivery foundation, not functional POC 1. |
| Broad design-system component catalog, grid adapters, and legacy UI replacement | Measured component cohorts after the design boundary is stable. |
| Broad Ratan Design instrumentation coverage | After Button and one form-control telemetry journey prove the event contract, privacy boundary, adapter injection, and failure isolation. |

## 6. Rejected and superseded directions

| Direction | State | Current decision |
| --- | --- | --- |
| `root-config -> base -> container -> tile` as the target runtime | Rejected | Target runtime has two application layers: host and tile. |
| Shared business components accumulated in a runtime container | Rejected | Classify into platform package, design package, tenant package, or delete. |
| Host rebuild for every compatible tile release | Rejected | Registry-driven independent deployment is mandatory. |
| Direct function calls, global functions, DOM access, or shared tenant store between tiles | Rejected | Use FDC3 or an approved platform contract. |
| Tenant-controlled global theme or global overlay root | Rejected | Host and design-system rules govern the global experience. |
| One tile definition can have only one workspace occurrence | Superseded | Multiple isolated instances of the same tile are required. |
| The complete target platform is “Day 1” | Superseded | Each concern is proven through the smallest sequential POC. |
| POC packages are renamed or copied into production | Rejected | Production implementation is a separate change derived from evidence. |

## 7. Current POC evidence and gaps

### 7.1 Evidence already present

The current `mvp/two-layer-federation/poc/` demonstrates:

- direct `portal host -> application` composition;
- runtime registry parsing and validation;
- Module Federation loading;
- application and appearance contract checks;
- React/ReactDOM singleton sharing;
- tile-local routing and state;
- remote failure containment;
- host-provided capability adapters;
- package-delivered design foundations without a design runtime remote;
- isolation from Single-SPA, SystemJS, import maps, `@fm/base`, and `mfe-ratan-container`.

### 7.2 Gaps against accepted POC 1

| Gap | Architectural impact |
| --- | --- |
| Host deduplicates open applications by tile ID. | Same-tile multi-instance is not implemented. |
| Active and close behavior use tile ID instead of instance ID. | Individual instances cannot be addressed correctly. |
| Registry lacks tenant, owner, entitlement, and route metadata. | Governed onboarding is not represented. |
| Session and entitlement adapters are absent. | Discovery and mount authorization are not demonstrated. |
| Lifecycle telemetry is unvalidated console output. | Instance attribution and correlation are not reliable evidence. |

These are design observations only. They do not authorize implementation.

## 8. POC and migration sequence

| Sequence | Primary question | Explicit boundary |
| --- | --- | --- |
| POC 1 — portal core | Can the host govern entitled, repeatable tile instances? | No FDC3, notification behavior, tenant backend, scaffold, or production infrastructure. |
| POC 2 — OpenFin/FDC3 | Can an OpenFin-originated caller raise `scb.fmptp.SearchCashflows` with `scb.fmptp.cashflow.query` context and reach a resolved Cashflow tile instance through the platform? | No general capability gateway, workflow, or broad intent catalog. |
| POC 3 — Nginx tenant boundary | Can static Host and Tile UI artifacts plus one Spring Boot service communicate only through approved Nginx paths while the platform auth SDK verifies the request JWT and trace correlation is preserved? | No route control plane automation. |
| POC 4 — notification | Can one structured event be targeted, displayed, and observed? | No durable broker or broad subscription product. |
| POC 5 — design observability | Can one Button and one form control emit safe, correlated semantic events through the injected design-observability capability? | No broad component coverage or production telemetry backend. |
| POC 6 — scaffold | Can proven UI and Java contracts be generated and pass conformance? | One template of each type only. |
| Workspace evolution — roadmap | Do documented workflows require simultaneous tile visibility? | Fixed multi-pane layout first; free-form behavior remains a later evidence-driven option. |
| Realworld foundation | Can production contracts, host, registry delivery, and design foundations release independently? | No legacy migration yet. |
| Cashflow pilot | Can one bounded legacy journey operate on the new host with rollback? | One migration cohort only. |
| Migration factory | Can additional cohorts migrate without custom platform work? | Expand only from measured evidence. |

## 9. Legacy responsibility mapping

| Current asset | Target disposition | Retirement evidence |
| --- | --- | --- |
| `apps/root-config` | Registry/bootstrap behavior moves into the Portal Host; Single-SPA/import-map responsibilities retire. | All consumers inventoried, equivalent routes proven, and rollback route available. |
| `apps/base` | Session, navigation, workspace, and platform adapters become explicit host modules and contracts. Tenant-specific behavior moves out. | Journey parity, contract tests, session/entitlement behavior, and telemetry. |
| `apps/mfe-ratan-container` | Product-neutral foundations become packages; domain UI returns to tenant ownership; runtime orchestration is redesigned or removed. | Every consumer and owner classified; migrated tiles have no runtime container dependency. |
| `apps/mfe-cashflow-blotter` | Becomes the first independently deployed target tile through one bounded journey. | Functional parity, proxy/service integration, operational evidence, and tested rollback. |

## 10. Decision status and remaining questions

Confirmed on 2026-07-19:

- **P-001:** POC 1 is portal core only. FDC3 and notifications remain later dedicated POCs.
- **P-002:** POC 1 uses multiple open tabs with one active instance. Simultaneously visible panes and free-form layouts remain roadmap options.
- **P-003:** POC 1 uses one explicit fake login action. Pre-authenticated mode may later support isolated development and tests.
- **P-004:** Module Federation is the production-default loader while platform contracts remain loader-independent.
- **P-005:** The first FDC3 POC raises canonical intent `scb.fmptp.SearchCashflows` with `scb.fmptp.cashflow.query` context rather than broadcasting `fdc3.instrument`.
- **P-006/P-007:** A general Capability Gateway and Workflow Orchestrator remain evidence-driven options rather than committed portal-foundation products.
- **P-005 compatibility:** Legacy `SearchCashflows` is temporarily aliased with telemetry, owner, and sunset date; new consumers use only the canonical namespaced intent.
- **P-005 resolution:** Reuse one compatible instance, open when none exists, and show the resolver when multiple compatible instances exist.
- **P-008:** Route onboarding remains ADO/work-item initiated; Portal is the status/query UI and the control-plane API performs validation, deployment, verification, and effective-state reporting.
- **P-009:** The first Java scaffold is Spring Boot and uses the versioned platform auth SDK to verify request-header JWTs and expose typed identity/entitlement context.
- **P-010:** The first migration cohort is the read-only `scb.fmptp.SearchCashflows` journey into the Cashflow Blotter.
- **P-011:** Chatbot is a later governed caller and remains outside Portal foundation POCs 1–6.
- **P-012:** Production observability uses the enterprise observation platform.
- **P-013:** Ratan Design components provide built-in observability functions through an injected design-observability capability.
- **P-013 event policy:** Standard component events are enabled by default and governed by central privacy, sampling, masking, retention, and suppression policy.
- **P-014:** Workspace evolution proceeds from duplicate tabs to fixed multi-pane layouts before any free-form movable/resizable model.
- **P-015:** The POC registry uses `tileId` as product identity and distinguishes it from `instanceId`.
- **P-016:** Ready inactive tab instances remain mounted but are removed from view, interaction, focus, and the accessibility tree.
- **P-017:** POC 1 adopts the specified `portal.session.*`, `portal.registry.*`, and `portal.tile.*` lifecycle event vocabulary.
- **A-015:** OpenFin is a required certified production runtime, with interoperability exposed through the host-owned FDC3 boundary.
- **A-016:** All production UI is static and Nginx is the required routing data plane for Host assets, Tile artifacts, and tenant API routes.

The POC 1 specification and test plan are drafted, and their technical contract decisions P-015 through P-017 are accepted.

The following production-topology details can wait until the OpenFin/FDC3 and Nginx boundary specifications:

1. Whether standard browser execution is also a certified production target or only a development/test target alongside required OpenFin support.
2. Whether tenant static artifacts remain hosted on tenant servers behind Nginx proxy routes or are promoted into centrally operated static storage served by Nginx.
3. The supported OpenFin runtime version window and upgrade policy.

Implementation remains unauthorized until the POC 1 specification and test plan are explicitly approved as complete artifacts.
