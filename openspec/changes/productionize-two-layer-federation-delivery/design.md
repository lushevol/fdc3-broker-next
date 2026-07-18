## Context

The completed MVP under `mvp/two-layer-federation/` proves the long-term two-layer runtime: a standalone React host discovers validated registry entries and loads an independently built Cashflow application directly through Module Federation. Ratan functions and UI are build-time packages rather than a runtime container. The existing production platform remains `root-config -> base -> containers/applications` over Single-SPA, SystemJS, import maps, and application-specific Azure DevOps/Helm deployment patterns.

The MVP deliberately uses local servers, a host-colocated registry, exact contract `1.0.0`, no generated federation types, no artifact signing, and no production promotion or observability. The production change crosses application code, pipeline templates, artifact infrastructure, security policy, monitoring, and organizational ownership. Stakeholders are platform engineering, application teams, DevOps/SRE, security, release owners, and FDC3/OpenFin integration owners.

## Goals / Non-Goals

**Goals:**

- Build the host and every application once, publish immutable artifacts, and promote the same digest across environments.
- Make a signed, versioned runtime registry the audited release-control plane.
- Prevent incompatible, insecure, mutable, or unverified artifacts from being activated.
- Define correct static delivery, cache, origin, and rollback behavior for Module Federation assets.
- Correlate user-visible health to exact host, remote, and registry revisions.
- Support deterministic canaries, rapid registry rollback, disaster recovery, and expiring previews.
- Migrate bounded routes/cohorts while preserving a safe legacy fallback and measurable retirement gates.
- Validate the approach first with one Cashflow artifact promoted through two non-production environments.

**Non-Goals:**

- Migrating production authentication, FDC3, chatbot, or the complete Cashflow product in the first DevOps POC.
- Rebuilding applications separately per environment.
- Hot-swapping a remote already loaded into an active Module Federation share scope.
- Deploying each primitive Ratan component as an independent runtime service.
- Embedding the entire legacy Single-SPA runtime permanently inside the new host.
- Selecting a specific enterprise vendor for CDN, signing, SBOM, or monitoring before the decision gates are resolved.

## Decisions

### Build once and identify releases by version plus digest

Each host/application release is a content-immutable static tree identified by application name, SemVer, source revision/build ID, and SHA-256 digest. Environment promotion references the same artifact digest and cannot mutate or rebuild it.

Alternative: build environment-specific bundles. Rejected because it makes test evidence non-transferable, complicates rollback, and encourages secret-bearing frontend configuration.

### Use CDN/object storage for browser delivery and OCI optionally for transport

Object storage plus CDN is the preferred runtime. OCI artifacts or minimal non-root static-server images may be used when enterprise retention, signing, or EKS policy requires them. An OCI transport must still result in exact immutable browser assets.

Alternative: a Node server per remote. Rejected because static Module Federation assets do not require an application runtime and runtime dependency installation expands the attack surface.

### Use immutable registry revisions plus a small active pointer

The platform owns immutable registry revision documents for every environment and a separately cached active pointer. Promotion creates, validates, signs, and atomically activates a new revision. Rollback reactivates a previous known-good revision.

Alternative: bake remote URLs into the host or edit one mutable registry in place. Rejected because host rebuilds couple releases and in-place edits erase audit/rollback history.

### Begin with GitOps registry ownership

The first control plane is a dedicated reviewed registry repository/pipeline. A service-backed or edge-selected registry is introduced only when per-user or percentage cohort selection requires it. A separate canary registry endpoint is sufficient for the initial POC.

Alternative: build a registry service immediately. Rejected because it adds availability, authorization, and state-management complexity before immutable promotion is proven.

### Separate publication from activation

Application pipelines build, attest, sign, and publish artifacts but cannot activate production directly. The registry promotion pipeline independently verifies evidence, runs deployed tests, collects approval, and activates the release.

Alternative: deploy automatically after application build. Rejected because artifact production and production release authorization have different ownership and risk.

### Version application protocol and capabilities independently

Application SemVer, host/application protocol major, and individual capability versions are separate. Applications declare required/optional capabilities. During migration the host supports the current and previous protocol major, subject to measured support cost. Compatibility is checked before rendering and again in promotion tests.

Alternative: preserve exact string equality forever. Rejected because it forces lockstep releases and makes additive evolution unnecessarily breaking.

### Cache immutable assets indefinitely and revalidate only pointers

Hashed chunks, versioned federation manifests/entries, and immutable registry revisions receive long immutable caching. Host HTML and the active registry pointer revalidate. Rollback changes only the pointer; immutable assets are never overwritten or purged.

Alternative: use short caching for all assets. Rejected because it sacrifices CDN performance without improving correctness when versioned paths are immutable.

### Sign evidence and authorize through workload identity

Every releasable artifact has an SBOM, vulnerability/license result, provenance statement, and signature bound to a trusted workload identity. The promotion pipeline rejects missing, invalid, or policy-failing evidence. Frontend bundles contain no secrets.

Alternative: rely on repository access and checksums alone. Rejected because it does not prove which trusted build produced the published bytes.

### Correlate health with the complete release tuple

Telemetry carries application ID/version/digest, host version, registry revision, environment, route, instance ID, and trace/correlation ID. Synthetics exercise registry fetch, remote loading, rendering, and one platform capability.

Alternative: monitor CDN/service availability alone. Rejected because healthy infrastructure can still serve an incompatible or broken remote.

### Canary and roll back through registry selection

Rollout proceeds through internal, 1%, 10%, 50%, and 100% cohorts with explicit soak gates. Initial cohorts may use distinct registry endpoints; later personalized cohorts may use an authorized edge/control-plane service. Rollback selects the previous registry revision and affects new page loads; critical incidents may request a controlled refresh.

Alternative: force Module Federation runtime replacement in active sessions. Rejected because loaded share-scope replacement can violate singleton and application-state assumptions.

### Coexist above both platforms

Ingress/gateway or cohort routing sends a route/user to either the legacy platform or the new host. Migrated applications move as bounded vertical slices. The new host does not become a permanent wrapper around the legacy runtime.

Alternative: indefinitely nest legacy applications in the new host. Rejected because it retains three runtime layers, shared failure boundaries, and unclear retirement ownership.

## Risks / Trade-offs

- [Registry compromise or outage has broad impact] → Signed immutable revisions, strict RBAC, separation of duties, replicated history, and a known-good fallback.
- [Host/application contract drift] → Published contracts, capability negotiation, current/previous-major policy, compatibility fixtures, and promotion matrix tests.
- [CDN serves stale or mutable content] → Digest-addressed paths, cache-header tests, prohibition on overwrites, and pointer-only invalidation.
- [Dynamic chunks lack simple browser-native integrity enforcement] → Trusted immutable origins, promotion-time digest/signature verification, strict CSP/CORS, and a later browser-integrity decision based on threat modeling.
- [Shared singleton conflicts] → Share only provider-sensitive dependencies, declare ranges, and test host/remote combinations.
- [Canary metrics are too sparse or noisy] → Minimum sample/soak gates, synthetic signals, business telemetry, and manual release-owner review.
- [Rollback cannot replace an already loaded remote] → Treat rollback as new-load behavior and use controlled refresh only for critical incidents.
- [Hybrid migration becomes permanent] → Per-route owners, dates, measurable exit criteria, legacy change freeze, and explicit decommission tasks.
- [Many independent artifacts increase operational load] → Reusable templates, application tiers, ownership registry, self-service previews, and standard runbooks.
- [OCI/EKS policy adds cost to static content] → Keep the static artifact model independent of transport and prefer CDN delivery where approved.

## Migration Plan

1. **DevOps POC:** Build the existing Cashflow remote once; publish it immutably with SBOM, provenance, and signature; create DEV and test registry revisions; promote the same digest; verify headers and deployed Playwright; inject a canary failure; roll back through the registry.
2. **Delivery foundation:** Productize reusable Azure DevOps templates, artifact catalog, registry repository/pipeline, security policies, preview lifecycle, dashboards, and rollback automation.
3. **Platform capabilities:** Add production authentication/entitlement, telemetry, FDC3, and workspace capability contracts with version negotiation.
4. **First production slice:** Route a bounded Cashflow cohort to the new host, perform staged canaries, compare SLOs to legacy, and execute a rollback drill.
5. **Migration factory:** Provide standard onboarding, conformance tests, RACI registration, runbooks, and self-service releases for application teams.
6. **Cutover and retirement:** Make the new host default, freeze legacy feature growth, remove migrated import-map/container dependencies, and decommission legacy components after rollback windows expire.

At every wave, rollback consists of reactivating a known-good registry revision or routing the bounded cohort back to the legacy platform. Artifacts remain retained for the defined rollback period.

## Open Questions

- Does enterprise policy permit object storage/CDN delivery, or must all artifacts run through EKS?
- Which signing, SBOM, provenance, vulnerability, and license-policy services are approved?
- What host/application protocol-major support window is sustainable?
- Are separate canary registry URLs sufficient for the first production slice?
- Will host and remotes share one origin, or which cross-origin/CSP policy is approved?
- What are the production source-map access and retention requirements?
- Which Cashflow vertical slice and user cohort migrate first?
- In what order must authentication, entitlement, telemetry, FDC3, workspace, and chatbot capabilities reach production readiness?
- What are the required artifact retention, RPO, RTO, and regional replication targets?
