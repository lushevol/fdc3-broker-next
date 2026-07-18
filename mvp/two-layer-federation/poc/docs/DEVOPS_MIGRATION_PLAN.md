# Two-Layer Module Federation DevOps and System Migration Plan

## Status and scope

- **Status:** Proposed next-phase plan
- **Scope:** Production delivery and phased migration from Single-SPA/SystemJS to the two-layer `Host -> Application` architecture
- **Implementation:** Out of scope for this document
- **POC location:** `mvp/two-layer-federation/poc/`
- **Realworld migration location:** `mvp/two-layer-federation/realworld/`

The central production principle is **build once, publish immutably, and promote by registry update**. The host and each application must have independent release pipelines. Environment promotion must not rebuild the host or application.

```text
Source -> Independent CI -> Immutable signed artifact -> Artifact store/CDN
                                                           |
                                              Environment registry revision
                                                           |
                                     DEV -> SIT/UAT -> canary -> production
```

## 1. Current position

The MVP proves:

- Direct `host -> application` runtime composition.
- Runtime registry discovery and Zod validation.
- Dynamic Module Federation registration.
- Application identity and contract checking.
- React and ReactDOM singleton sharing.
- Application-local routing and state.
- Remote load/render failure isolation and retry.
- Registry URL changes without rebuilding the host.
- No Single-SPA, SystemJS, import maps, `@fm/base`, or Ratan runtime container.

It does not yet prove a production delivery control plane.

| MVP shortcut | Production requirement |
|---|---|
| Local static servers | Highly available CDN/object storage or hardened static-serving workload |
| Registry file beside host | Independently governed, versioned, signed registry control plane |
| Mutable development URL | Exact immutable version and digest URL |
| Exact `1.0.0` contract equality | Compatibility ranges, capability versions, and support policy |
| Module Federation DTS disabled | Published contracts and producer/consumer compatibility tests |
| No artifact signing or SBOM | Provenance, SBOM, vulnerability/license gates, and signatures |
| Single local environment | DEV, SIT/UAT, canary, and production promotion |
| Manual recovery | Audited atomic registry rollback |
| Minimal telemetry | Central logs, metrics, traces, synthetics, and SLOs |
| No production auth/FDC3 | Versioned host-owned production capabilities |

## 2. Artifact and delivery model

### 2.1 Immutable artifacts

Each independently deployed application is an immutable static artifact:

```text
/mfe/
  portal-host/2.3.0+4f86c1d/
    index.html
    static/...
  cashflow/1.7.2+a19e843/
    mf-manifest.json
    remoteEntry.js
    static/...
```

Each release records:

- Application name and semantic version.
- Git commit SHA and CI build ID.
- SHA-256 artifact digest.
- Contract range and capability requirements.
- Shared runtime requirements.
- SBOM, provenance, vulnerability report, and signature references.

Mutable tags such as `latest` and reused production remote URLs are prohibited.

### 2.2 CDN, static hosting, and OCI

Object storage plus CDN is the recommended browser delivery layer. OCI can be used for artifact transport and retention.

| Option | Recommended use | Trade-off |
|---|---|---|
| Object storage + CDN | Primary browser delivery | Simplest operation and strongest caching |
| OCI image + static server | Where EKS/Helm is mandatory | More overhead per application |
| OCI static-bundle artifact | Signing, retention, and promotion | Requires extraction/CDN publication |
| Node server per remote | Avoid for static assets | Unnecessary runtime and attack surface |

If Kubernetes is mandatory, the image contains only prebuilt static output and a minimal non-root static server. It must not install dependencies at image runtime. Health probes verify `mf-manifest.json` and a representative hashed chunk.

Shared Ratan primitives remain versioned packages. “Containerized UI” means independently deliverable application bundles or OCI-packaged static artifacts, not a service per primitive component.

## 3. Runtime registry control plane

The registry is released independently of the host and becomes the deployment control plane.

### 3.1 Production entry

```json
{
  "id": "cashflow",
  "version": "1.7.2",
  "artifactDigest": "sha256:...",
  "manifestUrl": "https://cdn.example/mfe/cashflow/1.7.2+a19e843/mf-manifest.json",
  "contract": {
    "application": "1.x",
    "minimumHost": "2.2.0"
  },
  "basePath": "/cashflow",
  "capabilities": ["navigation", "notifications", "telemetry", "workspace"],
  "release": {
    "commit": "a19e843",
    "build": "2841",
    "sbom": "...",
    "provenance": "..."
  }
}
```

### 3.2 Ownership and promotion

Start with a platform-owned GitOps registry repository. Add a service-backed control plane later if personalized cohorts are needed.

```text
registry/releases/prod/2026-07-18T120300Z.json  # immutable revision
registry/environments/prod.json                 # active pointer
```

Required controls:

- Immutable environment histories.
- Schema and compatibility validation.
- Signature and artifact-digest verification.
- Approval and audit history.
- Atomic activation and rollback.
- Application-team promotion requests with platform policy enforcement.

Promotion changes only the active registry revision. The exact artifact bytes and digest move through every environment.

## 4. CI/CD topology

### 4.1 Pull-request validation

1. Reproducible `npm ci` with pinned Node/npm.
2. Formatting, lint, and TypeScript checks.
3. Unit/component tests and coverage gates.
4. Contract schema and compatibility checks.
5. Production build.
6. Artifact inventory and forbidden legacy-runtime scan.
7. Dependency, vulnerability, secret, and license scans.
8. SBOM generation.
9. Bundle-size and performance budgets.
10. Host/application integration matrix.
11. Dedicated Playwright journeys.
12. Optional authenticated preview publication.

A contract or shared-package change must test all affected consumers.

### 4.2 Independent release pipelines

Maintain separate logical pipelines for the portal host, each application, shared packages, and registry promotion.

An application release pipeline must:

1. Check out an exact commit.
2. Build and test once.
3. Produce metadata, SBOM, and provenance.
4. Scan the final output.
5. Sign the artifact/attestation.
6. Publish to an immutable location.
7. Re-fetch and verify the digest and signature.
8. Register the release in the artifact catalog.
9. Optionally open a DEV promotion request.

Publishing an artifact does not make it live.

### 4.3 Registry promotion pipeline

1. Resolve an exact version and digest.
2. Verify signature, provenance, SBOM, and policy results.
3. Check host/application compatibility.
4. Validate required platform capabilities.
5. Verify URLs, CORS/CSP compatibility, and cache headers.
6. Generate an immutable candidate registry revision.
7. Run smoke, synthetic, and Playwright tests.
8. Require environment-specific approval.
9. Atomically activate the revision.
10. Observe the release window and error budget.
11. Roll back automatically when thresholds are exceeded.

## 5. Contracts and versioning

Use three independent versions:

- Application release version, for example Cashflow `1.7.2`.
- Host/application protocol version, for example application contract `1.x`.
- Capability versions, for example `navigation@1` and `fdc3@2`.

Policy:

- Support the current contract major and previous major during migration.
- Additive optional fields are minor changes.
- Removed fields or changed behavior require a major.
- Applications declare required and optional capabilities.
- The host rejects incompatible applications before rendering.
- Promotion tests the target host/application matrix.
- Shared packages use Changesets/SemVer and rebuild consumers normally.
- Contract packages are published rather than relying only on monorepo source resolution.

Compatibility fixtures cover old app/new host, new app/oldest supported host, missing capabilities, malformed manifests, unsupported shared-runtime ranges, and rollback.

## 6. Cache and invalidation

| Resource | Cache policy |
|---|---|
| Hashed JS/CSS/assets | `public, max-age=31536000, immutable` |
| Versioned `remoteEntry.js` and `mf-manifest.json` | Long-lived immutable caching |
| Immutable registry revision | Long-lived immutable caching |
| Active registry pointer | `no-store` or `max-age=0, must-revalidate`, with ETag |
| Host `index.html` | Revalidate/no-cache |
| Source maps | Restricted authenticated storage |

Rules:

- Never overwrite a versioned artifact directory.
- Roll back by switching registry revision.
- Never purge immutable chunks.
- Invalidate only the active pointer or host HTML.
- Test cache headers automatically.
- Enforce TLS, strict CORS allow-lists, and an approved-origin CSP.

Promotion must verify signed artifact digests and restrict registry URLs to trusted immutable paths. Browser-side dynamic-chunk integrity remains an explicit threat-model decision.

## 7. Supply-chain security and configuration

Required security controls:

- Locked dependencies and reproducible builds.
- Pinned CI templates and base images.
- CycloneDX or SPDX SBOM.
- SLSA-style provenance/attestation.
- Artifact/OCI signing through workload identity.
- Vulnerability, license, and secret gates.
- Scoped registries and dependency-confusion defenses.
- Rejection of unsigned artifacts at promotion.
- Retention of source, logs, SBOM, signature, and output digest.

Frontend bundles contain no secrets. CI uses workload identity or managed service connections. Backend tokens come through host authentication capabilities. Public environment URLs and feature policy live in runtime configuration or the registry. Environment-specific builds and secret-bearing frontend `.env` bundles are prohibited.

## 8. Observability and SLOs

Every signal includes application ID/version/digest, host version, registry revision, environment, route, instance ID, and correlation ID.

Measure registry and manifest fetches, remote initialization/rendering, contract rejection, chunk errors, render failures, retries, Web Vitals, capability latency, canary health, and rollback outcomes.

Initial targets:

- Registry availability: 99.95%.
- Remote load and initial-render success: 99.9%.
- P95 registry fetch: below 300 ms in target regions.
- P95 warm activation: below 1 second.
- P95 cold activation: below 2.5 seconds.
- Automatic rollback decision: below 5 minutes.
- Manual registry rollback: below 10 minutes.

Production synthetics continuously open the host, load critical remotes, exercise a platform capability, and report the registry revision.

## 9. Canary, rollback, and disaster recovery

Support internal, named-user, percentage, business-unit, and regional cohorts. Begin with a separate canary registry endpoint; add a registry/edge service only when personalized selection is required.

```text
internal -> 1% -> 10% -> 50% -> 100%
```

Each step has a soak time and stop conditions based on load/render errors, Web Vitals, and business telemetry.

Rollback atomically selects the previous registry revision. It primarily affects new loads because an active Module Federation share scope should not be hot-swapped. Critical rollback may request a controlled refresh after protecting user state.

Disaster recovery requirements:

- Replicated artifacts and registry history across regions/accounts.
- Known-good registry fallback for critical applications.
- CDN/object-store failover.
- Registry RPO near zero and RTO below 30 minutes.
- Artifact retention through the complete rollback period.
- Quarterly regional-failover and registry-recovery exercises.

## 10. Developer previews

Application PR previews provide an immutable commit-keyed artifact, generated registry, authenticated URL, Playwright/accessibility checks, approved test APIs, automatic expiry, and PR metadata containing the artifact version and registry revision.

Host PRs run against representative applications. Contract PRs run against every affected consumer.

## 11. Legacy coexistence and cutover

Coexistence occurs above the platforms rather than permanently embedding the legacy runtime in the new host.

```text
                    +-- Legacy route/cohort -> root-config + Single-SPA
Gateway/cohort -----+
                    +-- Migrated route/cohort -> new Portal Host
```

Rules:

- A route or cohort uses exactly one platform.
- Move bounded vertical application slices.
- Deliver auth, entitlement, telemetry, and FDC3 capabilities before critical migrations.
- Leave existing applications unchanged until their migration wave.
- After cutover, an application cannot depend on both `@fm/base` and the new contracts.
- Retain legacy fallback for a defined stabilization window.
- Remove import-map entries only after adoption and rollback expiry.

## 12. Ownership and RACI

| Concern | Platform | Application | DevOps/SRE | Security | Release owner |
|---|---|---|---|---|---|
| Host and capability contracts | A/R | C | C | C | I |
| Application source/tests | C | A/R | C | C | I |
| Registry/control plane | A/R | C | R | C | C |
| Pipeline templates | C | C | A/R | C | I |
| Signing/policy | C | C | R | A | I |
| Promotion request | C | R | C | C | A |
| Production activation | C | C | R | C | A |
| Incident response | R | R | A | C | I |
| Legacy decommission | A | R | C | C | A |

Every application requires an owner, support rota, data classification, criticality, SLO, and rollback contact.

## 13. Decisions required

1. CDN/object storage versus EKS-only delivery.
2. GitOps registry revisions as the first control plane.
3. Artifact identity format: SemVer plus commit/build suffix and digest.
4. Signing standard and workload identity.
5. Supported contract-major window.
6. Initial canary mechanism.
7. Origin, CORS, and CSP policy.
8. Source-map access and retention.
9. Shared versus separate host/remote origins.
10. First production Cashflow slice.
11. Capability sequence: auth, entitlement, telemetry, FDC3, workspace, chatbot.
12. Artifact and rollback retention periods.

## 14. Key risks

| Risk | Mitigation |
|---|---|
| Registry is a high-impact control point | Signed history, atomic activation, fallback, and strict RBAC |
| Contract drift | Published contracts, matrix tests, negotiation, and support windows |
| Stale/mutable CDN content | Immutable paths, tested headers, and registry rollback |
| Shared dependency conflicts | Share only provider-sensitive singletons and test ranges |
| Compromised supply chain | Identity, provenance, SBOM, scanning, signing, and verification |
| Remote outage | Isolation, retries, synthetics, canary, and rapid rollback |
| Permanent hybrid architecture | Migration deadlines and explicit retirement criteria |
| Environment drift | Build once and promote identical digests |

## 15. Wave-by-wave roadmap

### Wave 0 — Smallest DevOps POC

Use the completed MVP without expanding functional scope:

1. Build Cashflow once in CI.
2. Publish it immutably.
3. Generate SBOM, provenance, and signature.
4. Publish immutable DEV and test registry revisions.
5. Promote the same digest without rebuilding.
6. Verify cache headers.
7. Run the existing three Playwright journeys against deployed URLs.
8. Promote a deliberately broken remote to canary.
9. Detect it through synthetic monitoring.
10. Roll back through the registry.

Exit criteria:

- Identical digest across environments.
- No mutable remote URL.
- Unsigned promotion is rejected.
- Rollback completes within 10 minutes.
- Playwright passes before and after rollback.
- Cache headers match policy.
- Audit history identifies who promoted which digest.

### Wave 1 — Production delivery foundation

Harden Azure DevOps templates; establish artifact catalog and registry ownership; add signing, policy gates, previews, dashboards, and rollback automation; upgrade build/runtime images; decide CDN versus OCI/EKS.

**Exit:** host and representative remote promote through all non-production environments by registry revision only.

### Wave 2 — Platform capability foundation

Deliver production auth/entitlement, telemetry, FDC3, workspace lifecycle, capability negotiation, and operational diagnostics.

**Exit:** a production-shaped remote uses only versioned platform capabilities and no `@fm/base` dependency.

### Wave 3 — First production vertical slice

Select a bounded Cashflow workflow, run canaries, compare reliability/performance with legacy, and perform a rollback drill.

**Exit:** the cohort remains on the new host through the stabilization period without exceeding error budgets.

### Wave 4 — Migration factory

Provide standard application templates, reusable pipelines, dashboards, runbooks, conformance tests, training, and ownership registration.

**Exit:** an application team onboards and deploys without custom platform pipeline work.

### Wave 5 — Default host and legacy retirement

Make the new host default, freeze legacy features, remove migrated import-map entries and Ratan-container dependencies, and decommission root-config/base after consumers and rollback windows expire.

**Exit:** no production route depends on Single-SPA, SystemJS, or `mfe-ratan-container`.

## 16. Recommendation

Proceed with Wave 0 before expanding application scope. The application architecture is demonstrated; the highest remaining risk is the release and registry control plane. The decisive next POC is immutable Cashflow publication, signed promotion, realistic cache behavior, canary failure detection, and registry-only rollback.
