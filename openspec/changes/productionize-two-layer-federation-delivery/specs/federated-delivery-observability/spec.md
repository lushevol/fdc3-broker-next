## ADDED Requirements

### Requirement: Release-correlated telemetry
Host and application telemetry MUST include application ID/version/digest, host version, registry revision, environment, route, instance ID, and correlation or trace ID.

#### Scenario: Remote render fails
- **WHEN** an application throws during initial rendering
- **THEN** the error signal identifies the exact host, remote artifact, and registry revision involved

### Requirement: Remote delivery measurements
The platform SHALL measure registry fetches, manifest/chunk fetches, remote initialization, initial render, contract rejection, retry, and capability-call latency.

#### Scenario: Chunk loading degrades after promotion
- **WHEN** a promoted remote produces elevated chunk-load latency or failures
- **THEN** dashboards and alerts isolate the affected application version and environment

### Requirement: User-experience measurements
The platform SHALL collect Web Vitals and user-visible application availability by host, application version, route, and rollout cohort.

#### Scenario: New version regresses cold activation
- **WHEN** the candidate exceeds its cold-activation performance threshold
- **THEN** the rollout gate fails or pauses for release-owner review

### Requirement: Synthetic application journeys
Every critical environment SHALL continuously execute a synthetic journey that loads the active registry, opens the host, loads each critical remote, renders it, and exercises at least one platform capability.

#### Scenario: Infrastructure is healthy but remote is incompatible
- **WHEN** CDN health checks pass but a remote fails host compatibility or rendering
- **THEN** the synthetic journey fails and reports the active registry revision

### Requirement: Defined SLO and error-budget policy
The platform MUST define measurable SLOs and release-stop thresholds for registry availability, remote load/render success, activation latency, and rollback decision time.

#### Scenario: Canary exceeds error budget
- **WHEN** canary load/render failures exceed the configured threshold after the minimum sample gate
- **THEN** further rollout is stopped and rollback policy is invoked
