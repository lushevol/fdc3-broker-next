## Why

The two-layer Module Federation MVP proves direct host-to-application composition, but its local static servers, colocated registry, exact-only contract check, and manual release process are not a safe production delivery system. The next phase must prove that independently released host and application artifacts can be built once, promoted immutably, observed, canaried, and rolled back while the existing Single-SPA/SystemJS platform remains available.

## What Changes

- Introduce independently versioned, immutable host and application artifacts identified by semantic version, source revision, and content digest.
- Establish a platform-owned runtime registry control plane with immutable revisions, environment promotion, policy validation, audit history, and atomic rollback.
- Add CI/CD assurance for contracts, shared runtime compatibility, SBOMs, provenance, signatures, vulnerability/license policy, cache behavior, and deployed browser journeys.
- Define production CDN/static/OCI delivery rules, including immutable asset paths, cache headers, trusted origins, and environment-independent builds.
- Add application-version-aware telemetry, synthetic monitoring, SLOs, canary cohorts, automatic release stops, rollback, and disaster-recovery exercises.
- Add expiring pull-request preview environments assembled through generated registry revisions.
- Define route/cohort-based coexistence with the legacy platform and measurable wave-by-wave cutover and retirement criteria.
- Keep Ratan UI primitives as versioned packages; independently deployed application bundles may also be packaged as OCI artifacts where infrastructure policy requires it.

## Capabilities

### New Capabilities

- `immutable-federated-artifacts`: Build-once host/application artifacts, immutable identity, static/OCI publication, cache policy, and environment-independent configuration.
- `runtime-registry-promotion`: Versioned registry revisions, environment ownership, promotion policy, auditability, and atomic activation/rollback.
- `federation-release-assurance`: CI/CD gates for contracts, compatibility, supply-chain evidence, signatures, security policy, and deployed verification.
- `federated-delivery-observability`: Release metadata correlation, remote-loading metrics, synthetic journeys, SLOs, and release-health decisions.
- `federated-release-rollout`: Deterministic canary cohorts, soak gates, rollback behavior, artifact retention, and disaster recovery.
- `federated-preview-environments`: Short-lived commit-addressed previews with generated registries, validation, access control, and cleanup.
- `legacy-platform-cutover`: Controlled coexistence, vertical-slice migration, ownership, exit gates, and retirement of Single-SPA/SystemJS routes.

### Modified Capabilities

None. This change adds production delivery and migration capabilities without changing existing main-spec requirements.

## Impact

- New production-delivery work will build on `mvp/two-layer-federation/` and its existing host, Cashflow remote, contracts, packages, and Playwright suite.
- Azure DevOps pipeline topology, artifact storage/CDN or OCI infrastructure, registry ownership, deployment policy, security tooling, and operational monitoring will be affected.
- The new delivery path will coexist with `apps/root-config`, `apps/base`, SystemJS import maps, and existing container deployments until route-level exit criteria are met.
- Application teams, platform engineering, DevOps/SRE, security, and release owners receive explicit release and incident responsibilities.
- The first implementation target is a bounded DevOps POC: publish one immutable Cashflow artifact, promote the same digest through two environments, detect a canary failure, and roll back through the registry without rebuilding.
