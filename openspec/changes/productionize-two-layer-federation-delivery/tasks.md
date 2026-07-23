## 1. Delivery decisions and ownership

- [ ] 1.1 Record the approved runtime delivery substrate (CDN/object storage or mandatory OCI/EKS) and trusted host/remote origin topology
- [ ] 1.2 Record approved signing, SBOM, provenance, vulnerability, license, and workload-identity services
- [ ] 1.3 Define application artifact identity, protocol-major support window, retention policy, RPO/RTO, source-map policy, and initial canary mechanism
- [ ] 1.4 Create the application ownership record schema covering team, support rota, criticality, data classification, SLO, approver, and rollback contact
- [ ] 1.5 Assign platform, application, DevOps/SRE, security, and release-owner responsibilities for the Cashflow DevOps POC

## 2. Immutable artifact foundation

- [ ] 2.1 Add tested release-metadata generation for application name/version, commit, build ID, digest, contract, capabilities, and shared runtime ranges
- [ ] 2.2 Add a reproducible production packaging command for the portal host and Cashflow remote that excludes environment secrets
- [ ] 2.3 Implement immutable version-path publication to the selected static/OCI artifact store and reject overwrite attempts
- [ ] 2.4 Implement post-publication digest verification and an artifact-catalog record linking source, output, and evidence
- [ ] 2.5 Configure and test cache headers for hashed assets, versioned federation entries/manifests, host HTML, registry revisions, and active pointers
- [ ] 2.6 Configure TLS, CORS, CSP, and trusted-origin policy for the deployed host and Cashflow remote
- [ ] 2.7 Prove the identical Cashflow artifact digest can be delivered in two non-production environments with runtime-only public configuration

## 3. Registry control plane

- [ ] 3.1 Define and test the production registry schema with artifact version/digest, immutable URL, protocol range, capabilities, ownership, and release evidence
- [ ] 3.2 Create immutable registry-revision storage and a separate environment active-pointer model
- [ ] 3.3 Implement candidate validation for schema, duplicate routes/IDs, trusted origins, artifact reachability/digest, contracts, capabilities, and signatures
- [ ] 3.4 Implement separate authorization for artifact publication, promotion request, approval, activation, and rollback
- [ ] 3.5 Record complete promotion audit events with requester, approver, revisions, selected digests, evidence, timestamps, and outcomes
- [ ] 3.6 Implement atomic candidate activation and previous-known-good revision rollback
- [ ] 3.7 Add registry backup/replication and a tested known-good recovery procedure matching agreed RPO/RTO

## 4. CI/CD and supply-chain assurance

- [ ] 4.1 Add affected-workspace PR validation for pinned install, lint, types, unit/component tests, production builds, and forbidden legacy-runtime scans
- [ ] 4.2 Add host/application protocol, required/optional capability, and React singleton compatibility matrix tests
- [ ] 4.3 Publish the platform contract package and verify supported consumers against published rather than source-only resolution
- [ ] 4.4 Generate an SBOM and provenance statement for each portal-host and Cashflow release
- [ ] 4.5 Add vulnerability, license, dependency-confusion, and secret/output scanning with documented blocking policy
- [ ] 4.6 Sign release artifacts or attestations with trusted workload identity and reject missing/invalid signatures during promotion
- [ ] 4.7 Retain build logs, tests, SBOM, provenance, signatures, policy results, and digests for the approved audit period
- [ ] 4.8 Separate application publication pipelines from the registry promotion/activation pipeline in Azure DevOps

## 5. Wave 0 deployed DevOps POC

- [ ] 5.1 Build Cashflow once in CI and publish its signed immutable artifact and evidence
- [ ] 5.2 Create DEV and test registry revisions selecting the same Cashflow digest
- [ ] 5.3 Promote the Cashflow digest from DEV to test without rebuilding the host or remote
- [ ] 5.4 Run deployed header, origin, manifest, compatibility, and artifact-digest checks in both environments
- [ ] 5.5 Adapt and run the existing three federation Playwright journeys against each deployed registry revision
- [ ] 5.6 Publish a deliberately broken canary revision and prove deployed/synthetic verification detects it
- [ ] 5.7 Roll back to the previous registry revision and verify recovery within ten minutes with no artifact overwrite or rebuild
- [ ] 5.8 Capture Wave 0 evidence proving identical digests, signature enforcement, cache policy, audit history, failure detection, and rollback

## 6. Observability, rollout, and disaster recovery

- [ ] 6.1 Instrument host and remote signals with application/version/digest, host version, registry revision, environment, route, instance, cohort, and correlation ID
- [ ] 6.2 Add dashboards for registry, manifest/chunk delivery, remote initialization/rendering, retries, contract rejection, Web Vitals, and capability latency
- [ ] 6.3 Implement continuous synthetic journeys that load the registry, host, critical remote, and one platform capability
- [ ] 6.4 Define SLOs, minimum canary samples/soak times, release-stop thresholds, and automatic rollback triggers
- [ ] 6.5 Implement deterministic internal and percentage canary registry selection with cohort/revision telemetry
- [ ] 6.6 Implement active-session notification and controlled-refresh behavior for critical rollbacks without hot share-scope replacement
- [ ] 6.7 Execute and document a regional artifact/registry failover exercise against approved RPO/RTO

## 7. Preview environment lifecycle

- [ ] 7.1 Publish commit-addressed pull-request artifacts and generate preview registries that combine candidates with stable dependencies
- [ ] 7.2 Protect preview URLs with approved authentication and non-production API/data boundaries
- [ ] 7.3 Run compatibility, deployed smoke, Playwright, and accessibility checks and report results on the pull request
- [ ] 7.4 Run representative application matrices for host changes and all affected consumers for contract changes
- [ ] 7.5 Implement owner/TTL metadata and automatic cleanup of preview routes, registry pointers, and non-retained artifacts

## 8. Production capability and legacy cutover readiness

- [ ] 8.1 Version and productionize the host authentication/entitlement, telemetry, FDC3, navigation, notification, and workspace capability contracts required by the first slice
- [ ] 8.2 Add conformance checks that reject migrated applications retaining `@fm/base`, Single-SPA, SystemJS, import-map, or Ratan-container runtime dependencies
- [ ] 8.3 Define the first bounded Cashflow production journey, cohort, capability prerequisites, owner, SLO, rollback route, and stabilization window
- [ ] 8.4 Implement gateway/cohort routing that assigns the bounded journey exclusively to legacy or the new host
- [ ] 8.5 Run internal, 1%, 10%, 50%, and full cohort stages with documented soak and approval evidence
- [ ] 8.6 Execute a production-slice rollback drill and verify both registry rollback and legacy route fallback
- [ ] 8.7 Publish the reusable application onboarding template, pipeline, conformance suite, dashboard, runbook, and ownership registration process
- [ ] 8.8 Define and verify legacy retirement gates using dependency scans, traffic evidence, stabilization expiry, and accountable approval

## 9. Final verification and operational handoff

- [ ] 9.1 Run strict OpenSpec validation and map every requirement scenario to an automated test, policy check, exercise, or signed decision record
- [ ] 9.2 Verify Wave 0 exit criteria and obtain platform, DevOps/SRE, security, application, and release-owner sign-off before production-slice work
- [ ] 9.3 Complete incident, rollback, registry recovery, preview cleanup, and application onboarding runbooks
- [ ] 9.4 Record remaining vendor/enterprise decisions and split deferred production waves into separately approved implementation changes where required
