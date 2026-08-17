## ADDED Requirements

### Requirement: Kubernetes preserves the platform edge boundary
The Kubernetes deployment SHALL forward external ingress traffic only to `scb-next-edge`, and all application upstream Services SHALL use private `ClusterIP` exposure.

#### Scenario: Kubernetes resources are rendered
- **WHEN** the base or production overlay is rendered
- **THEN** no platform or tenant application is exposed by `NodePort` or `LoadBalancer`

### Requirement: Platform and tenant workloads are independent
Kubernetes SHALL deploy the edge, `mfe-base`, `single-ui-bff`, `mfe-ratan-container`, and `mfe-cashflow-blotter` as independent workload and Service units with ownership labels.

#### Scenario: Tenant UI is upgraded
- **WHEN** a tenant image tag changes
- **THEN** Kubernetes rolls out only the selected tenant workload

### Requirement: Workloads are secure by default
Kubernetes workloads SHALL run as non-root with privilege escalation disabled, a read-only root filesystem where supported, dropped Linux capabilities, bounded resources, and no automatically mounted service-account token unless required.

#### Scenario: Pod security is inspected
- **WHEN** a deployment manifest is reviewed or tested
- **THEN** the required pod and container security controls are present and no production secret value is committed

### Requirement: Workloads expose reliable health and availability controls
Every HTTP workload SHALL define readiness and liveness probes and resource requests/limits; the edge SHALL define disruption and replica controls suitable for avoiding a voluntary single-pod outage.

#### Scenario: Edge pod becomes unready
- **WHEN** the edge health probe fails
- **THEN** Kubernetes removes that pod from Service endpoints while another eligible replica can continue serving traffic

### Requirement: Network access follows ownership boundaries
The Kubernetes deployment SHALL include a default-deny posture and explicit policies allowing ingress to the edge and edge egress only to declared platform and tenant upstreams, subject to required DNS and approved external dependencies.

#### Scenario: Tenant service is addressed directly by another workload
- **WHEN** a pod outside an allowed path attempts to connect to a tenant Service
- **THEN** network policy denies the connection

### Requirement: Minikube provides repeatable conformance evidence
The repository SHALL provide scripts and documentation to create or reuse a Minikube profile, build or load local images, apply the overlay, wait for readiness, expose the edge, run route probes, and clean up only resources owned by the proof.

#### Scenario: Developer verifies the proof
- **WHEN** Docker, Minikube, and `kubectl` are available and the verification command is run
- **THEN** the command verifies rendered manifests, workload readiness, edge routing, static remotes, platform and tenant APIs, and the supported Playwright journey

### Requirement: Minikube evidence is correctly scoped
Minikube output SHALL identify mock-backed tests as routing and frontend evidence and SHALL NOT claim certification of unavailable corporate identity, database, messaging, or downstream integrations.

#### Scenario: Verification report is produced
- **WHEN** the Minikube proof completes with local mocks
- **THEN** the report distinguishes passed deployment/routing checks from the remaining real-BFF production certification gate
