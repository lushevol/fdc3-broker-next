## ADDED Requirements

### Requirement: Platform edge exposes only tenant path-family interfaces

The Kubernetes platform edge SHALL route platform UI and platform API traffic directly to platform-owned upstreams and SHALL delegate Ratan traffic only through the `ratan-edge` Service. Its configuration SHALL NOT contain Ratan application or backend upstream names.

#### Scenario: Platform traffic remains direct

- **WHEN** a request targets `/`, `/healthz`, or a non-Ratan `/api/*` path
- **THEN** the platform edge routes or serves it without depending on `ratan-edge`

#### Scenario: Ratan traffic is delegated with its original path

- **WHEN** a request targets `/api/ratan/*`, `/static/ratan/*`, `/remotes/ratan/*`, or `/remotes/cashflow/*`
- **THEN** the platform edge proxies the unchanged request path to the `ratan-edge` Service

#### Scenario: Platform configuration hides tenant internals

- **WHEN** the platform edge ConfigMap and Deployment are inspected
- **THEN** they name `ratan-edge` but do not name Ratan container, Cashflow, BFF, notification, data-ambassador, or API-gateway upstreams

### Requirement: Ratan edge owns all Ratan routing behavior

The Kubernetes solution SHALL provide a Ratan-owned Nginx edge whose configuration exclusively defines the internal Ratan UI and backend routes, rewrites, WebSocket handling, and remote-entry cache behavior.

#### Scenario: Tenant static assets route through tenant edge

- **WHEN** a request targets the canonical or compatibility path for the Ratan container or Cashflow remote
- **THEN** `ratan-edge` routes it to the correct tenant UI Service
- **AND** remote entry responses retain the `Cache-Control: no-store` behavior

#### Scenario: Tenant API precedence is preserved

- **WHEN** requests target Ratan BFF, socket, notification, data-ambassador, or fallback API paths
- **THEN** `ratan-edge` selects the specific upstream before the fallback and applies the existing prefix rewrite

#### Scenario: Tenant WebSockets are preserved

- **WHEN** a Ratan socket or notification request includes a WebSocket upgrade
- **THEN** `ratan-edge` forwards the upgrade and connection headers with the configured long-lived timeouts

### Requirement: Tenant edge has an independent operational lifecycle

The Kubernetes solution SHALL model `ratan-edge` as a separate Deployment, ClusterIP Service, ConfigMap, and PodDisruptionBudget with Ratan ownership labels, independent replicas, local health probes, resource controls, and restricted pod/container security.

#### Scenario: Ratan team deploys its edge independently

- **WHEN** the `ratan-edge` ConfigMap or Deployment changes
- **THEN** the Ratan edge can roll out without restarting or changing the platform edge Deployment

#### Scenario: Resource ownership is discoverable

- **WHEN** operators query the Ratan edge resources
- **THEN** each resource identifies Ratan ownership and tenant association through labels

### Requirement: Network access follows the chained-edge topology

The Kubernetes NetworkPolicies SHALL prevent the platform edge from directly reaching Ratan application workloads and SHALL prevent Ratan workloads from accepting platform-edge traffic directly.

#### Scenario: Platform edge allowed destinations are bounded

- **WHEN** platform-edge egress policies are rendered
- **THEN** application traffic is allowed only to platform UI, platform BFF, and tenant-edge pods, plus DNS required for service discovery

#### Scenario: Tenant edge allowed destinations are bounded

- **WHEN** Ratan-edge ingress and egress policies are rendered
- **THEN** it accepts application traffic only from the platform edge and sends application traffic only to Ratan-owned UI and API workloads, plus DNS

#### Scenario: Tenant workloads reject direct platform access

- **WHEN** ingress policies for Ratan UI and API pods are rendered
- **THEN** only `ratan-edge` is an allowed application-traffic source

### Requirement: Tenant edge failure is contained

The platform edge readiness SHALL NOT depend on Ratan edge readiness. A Ratan edge outage SHALL affect Ratan paths only and recovery SHALL NOT require a platform-edge restart.

#### Scenario: Ratan edge becomes unavailable

- **WHEN** all `ratan-edge` replicas are unavailable
- **THEN** platform `/healthz`, UI, and platform API probes continue to succeed
- **AND** Ratan API and static probes fail through the platform edge

#### Scenario: Ratan edge recovers independently

- **WHEN** the original `ratan-edge` replica count is restored and its rollout becomes ready
- **THEN** Ratan API and static probes succeed again
- **AND** the platform edge has not been restarted

### Requirement: Minikube proof reports its evidence boundary

The Minikube automation SHALL deploy and verify both edge tiers, record the rendered topology and HTTP routing evidence, exercise Ratan outage and recovery, and state verification limitations.

#### Scenario: Local topology is rendered

- **WHEN** the Minikube overlay is built and applied
- **THEN** it contains seven Deployments and ten ClusterIP Services including independent `scb-next-edge` and `ratan-edge` resources

#### Scenario: Evidence is interpreted correctly

- **WHEN** verification results are documented
- **THEN** fixture-backed application behavior, external corporate integrations, and runtime NetworkPolicy enforcement are clearly distinguished
