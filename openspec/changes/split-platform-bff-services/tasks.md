## 1. Contract Tests

- [x] 1.1 Add failing VM and Kubernetes edge tests for tile, auth, SSO, telemetry, and legacy fallback route ownership and precedence
- [x] 1.2 Add failing rendered-topology tests for three new independent Deployments, Services, PDBs, security controls, and private network access
- [x] 1.3 Add failing Minikube tests for per-service response identity and self-restoring failure-containment verification

## 2. Deployment Implementation

- [x] 2.1 Add VM upstream variables, renderer support, example configuration, and most-specific platform routes while retaining the fallback
- [x] 2.2 Add the three Kubernetes Deployments and ClusterIP Services with independent images, probes, resources, security, labels, and replica controls
- [x] 2.3 Add per-service PodDisruptionBudgets and preserve platform/tenant NetworkPolicy isolation
- [x] 2.4 Update the Minikube overlay, patches, image mapping, and deployment lifecycle for all new services

## 3. Verification Adapter and Automation

- [x] 3.1 Add a configurable mock-service identity header and focused adapter tests
- [x] 3.2 Verify representative auth, tile, telemetry, fallback, and Ratan routes against their expected runtime identities
- [x] 3.3 Add self-restoring outage/recovery checks for each new portal service while probing unaffected routes
- [x] 3.4 Run architecture, adapter, shell, Kustomize, VM Nginx, and strict OpenSpec verification

## 4. End-to-End Evidence and Documentation

- [x] 4.1 Deploy the expanded Minikube topology and capture inventory, route identity, outage, recovery, and independent lifecycle evidence
- [x] 4.2 Run production-edge Playwright and classify skipped, failed, external, and unverified behavior explicitly
- [x] 4.3 Update VM, Kubernetes, migration, evidence, and manual verification documents with service ownership and rollback procedures
- [x] 4.4 Record what was verified, what was not done, and what cannot be certified locally

## 5. Delivery

- [x] 5.1 Format changed files, validate links and commands, and review the final diff
- [x] 5.2 Run GitNexus staged change detection and confirm expected scope
- [x] 5.3 Commit only the completed portal-service decomposition stage without unrelated workspace changes
