## 1. Deployment Contract Tests

- [x] 1.1 Add failing architecture tests for platform and tenant Nginx route ownership, precedence, WebSocket behavior, and remote compatibility aliases
- [x] 1.2 Add failing architecture tests for independent Kubernetes workloads, edge-only ingress, ClusterIP exposure, health/resources/security controls, and network policy
- [x] 1.3 Add render and shell-validation tests for VM and Minikube deployment commands

## 2. Shared Edge And VM Production Delivery

- [x] 2.1 Add the configurable VM Nginx edge configuration with independent platform and Ratan upstreams
- [x] 2.2 Add VM environment/inventory examples, route smoke verification, and independent rollback commands without production secrets
- [x] 2.3 Update SCB Next commands and documentation to make VM/Ansible authoritative and label Compose as local production-style acceptance
- [x] 2.4 Document route ownership, health gates, WebSocket checks, artifact identity, and real-BFF certification for VM releases

## 3. Kubernetes Base

- [x] 3.1 Add portable static UI and edge container definitions that run non-root and do not bundle independently owned UI artifacts together
- [x] 3.2 Add Kustomize base Deployments and ClusterIP Services for edge, Base, single-ui-bff, Ratan container, and Cashflow
- [x] 3.3 Add edge route ConfigMap, probes, resources, security contexts, labels, replica/disruption controls, and topology spread
- [x] 3.4 Add default-deny and explicit edge/upstream NetworkPolicies plus a catch-all ingress to the edge only

## 4. Minikube Proof

- [x] 4.1 Add a Minikube overlay with local image tags and explicit mock-backed platform/tenant backend configuration
- [x] 4.2 Add idempotent Minikube start, image build/load, deploy, wait, expose, verify, and scoped cleanup scripts
- [x] 4.3 Add HTTP route probes for platform UI/API, tenant static/API routes, compatibility aliases, cache headers, health, and WebSocket upgrade handling
- [x] 4.4 Run the existing SCB Next Playwright production journey through the Minikube edge and label its evidence frontend/routing-only

## 5. Verification And Handoff

- [x] 5.1 Run OpenSpec validation, SCB Next architecture tests, Nginx validation, Kustomize rendering, and shell lint/syntax checks
- [x] 5.2 Run Minikube workload, HTTP, and Playwright verification where local prerequisites permit and record any real-service gaps
- [x] 5.3 Publish the Kubernetes adoption decision checklist covering ingress, registry, secrets, egress, observability, capacity, availability, and rollback
- [x] 5.4 Run GitNexus change detection, confirm only expected deployment scope is affected, and commit the completed stage without unrelated changes
