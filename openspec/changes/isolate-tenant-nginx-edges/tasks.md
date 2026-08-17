## 1. Routing Contract Tests

- [x] 1.1 Add failing rendered-manifest tests for separate platform and Ratan edge resources, ownership, security, and availability controls
- [x] 1.2 Add failing configuration tests proving platform delegation and exclusive Ratan ownership of tenant upstreams and route behavior
- [x] 1.3 Add failing NetworkPolicy graph and Minikube outage-verification contract tests

## 2. Kubernetes Edge Isolation

- [x] 2.1 Restrict the platform edge ConfigMap and Deployment to platform upstreams plus the Ratan edge interface
- [x] 2.2 Add the Ratan-owned edge ConfigMap, Deployment, ClusterIP Service, health probes, resources, security, topology controls, and ownership labels
- [x] 2.3 Add the Ratan edge PodDisruptionBudget and replace broad network permissions with explicit chained-edge policies
- [x] 2.4 Update the base and Minikube Kustomize resources, image substitutions, and replica configuration for both edges

## 3. Automated Verification

- [x] 3.1 Update Minikube build and deployment automation for the additional edge workload
- [x] 3.2 Update HTTP and WebSocket probes to exercise every Ratan path through both edges
- [x] 3.3 Add a self-restoring Ratan edge outage and recovery proof that confirms platform traffic remains healthy
- [x] 3.4 Run architecture tests, shell syntax checks, strict OpenSpec validation, and rendered-manifest validation

## 4. End-to-End Evidence and Documentation

- [x] 4.1 Deploy the Minikube proof with the existing verified local images and capture workload, service, routing, WebSocket, outage, and recovery evidence
- [x] 4.2 Run fixture-backed Playwright verification and distinguish application failures from unavailable external integrations
- [x] 4.3 Update Kubernetes architecture, deployment, evidence, and manual verification documents for tenant-owned edge operation
- [x] 4.4 Record what was verified, what was not verified, and what cannot be verified in the local environment

## 5. Delivery

- [x] 5.1 Format changed files and check documentation links and commands
- [x] 5.2 Run GitNexus change detection and review the final diff for expected scope
- [x] 5.3 Commit only the completed tenant-edge isolation stage without unrelated workspace changes
