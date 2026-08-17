## ADDED Requirements

### Requirement: Platform route families have explicit service owners

The platform edge SHALL route portal authentication, tile administration, and telemetry requests to separate service owners while preserving `single-ui-bff` as the unmatched platform API fallback.

#### Scenario: Tile administration uses its specific owner

- **WHEN** a request targets `/api/auth/v1/fmo/admin/*`
- **THEN** the edge routes it to `portal-tile-management-service`
- **AND** removes only the `/api/auth/` prefix

#### Scenario: Authentication and SSO use the auth owner

- **WHEN** a request targets `/api/auth/*` outside the tile-administration prefix or targets `/api/sso/*`
- **THEN** the edge routes it to `portal-auth-service` with the existing prefix rewrite

#### Scenario: Analytics uses the telemetry owner

- **WHEN** a request targets `/api/analytics/*`
- **THEN** the edge routes it to `portal-telemetry-service` with the existing prefix rewrite

#### Scenario: Legacy fallback remains available

- **WHEN** a platform request targets an unmatched `/api/*` path
- **THEN** the edge routes it to the still-deployed `single-ui-bff`

### Requirement: New portal services are independent runtime modules

The Kubernetes solution SHALL add `portal-auth-service`, `portal-tile-management-service`, and `portal-telemetry-service` without replacing `single-ui-bff`. Each new service SHALL have its own Deployment, ClusterIP Service, health probes, resources, restricted security, replica controls, ownership labels, and PodDisruptionBudget.

#### Scenario: Portal service inventory is rendered

- **WHEN** the Kubernetes base is rendered
- **THEN** all three new Deployments and Services exist alongside `single-ui-bff`
- **AND** no platform backend Service is publicly exposed

#### Scenario: Services can roll out independently

- **WHEN** one new portal Deployment is restarted
- **THEN** the other portal Deployments, `single-ui-bff`, platform UI, and tenant workloads are not restarted

### Requirement: VM deployment supports additive service routing

The VM Nginx template and rendering scripts SHALL accept separate upstreams for all three new services while retaining the `SINGLE_UI_BFF_UPSTREAM` fallback.

#### Scenario: VM configuration renders all service owners

- **WHEN** operators render the VM Nginx template with the documented environment variables
- **THEN** the configuration contains distinct auth, tile-management, telemetry, and fallback upstreams
- **AND** `nginx -t` accepts the rendered configuration

### Requirement: Platform service network access remains private

Kubernetes NetworkPolicies SHALL allow the platform edge to reach the new platform services and SHALL allow those services to accept application traffic only from the platform edge.

#### Scenario: New services are covered by platform API policy

- **WHEN** NetworkPolicies are rendered
- **THEN** every new service pod is selected as a platform API
- **AND** its allowed application-traffic source is `scb-next-edge`

#### Scenario: Tenant isolation remains unchanged

- **WHEN** the platform edge egress policy is rendered
- **THEN** it still excludes tenant UI and tenant API pods
- **AND** Ratan workloads still accept traffic only from `ratan-edge`

### Requirement: Portal service failures are contained and recoverable

Failure of one new portal service SHALL affect only its owned path families and SHALL NOT make the platform edge, other portal services, the legacy fallback, or tenant routes unready.

#### Scenario: One portal service is unavailable

- **WHEN** all replicas of one new portal service are unavailable
- **THEN** its owned route probe fails
- **AND** platform UI, other portal route probes, legacy fallback, and Ratan route probes continue to succeed

#### Scenario: One portal service recovers

- **WHEN** its original replica count is restored and rollout completes
- **THEN** its owned route succeeds again without restarting the platform edge or other services

### Requirement: Minikube identifies the selected service runtime

The Minikube proof SHALL expose non-production response evidence that distinguishes auth, tile-management, telemetry, and fallback mock instances without changing production payload contracts.

#### Scenario: Route identity is verified

- **WHEN** the verifier probes one representative path for each platform route family
- **THEN** each response identifies the expected mock service instance

#### Scenario: Evidence limitations are documented

- **WHEN** verification results are recorded
- **THEN** runtime deployment isolation is distinguished from future Spring code extraction and from real corporate integration certification
