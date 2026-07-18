## ADDED Requirements

### Requirement: Platform-exclusive route assignment
During coexistence, each migrated route or deterministic user cohort SHALL resolve to either the legacy platform or the new host, not both runtime composition roots in the same application path.

#### Scenario: Canary a Cashflow route
- **WHEN** an approved cohort is assigned to the new Cashflow slice
- **THEN** that cohort enters the new host while the remaining cohort continues on the legacy route

### Requirement: Vertical-slice migration
Each migration wave MUST define a bounded business journey, required platform capabilities, owner, SLO, canary plan, rollback route, stabilization period, and exit criteria.

#### Scenario: Slice lacks production FDC3 capability
- **WHEN** the selected workflow requires FDC3 behavior not yet supplied by the new host
- **THEN** production cutover is blocked until the capability and conformance evidence exist

### Requirement: No dual runtime dependency after cutover
A migrated application MUST NOT depend on both legacy `@fm/base`/Ratan-container runtime APIs and the new host capability contract after its cutover is accepted.

#### Scenario: Application still imports a legacy runtime API
- **WHEN** cutover conformance scans detect a forbidden legacy runtime dependency
- **THEN** the slice cannot satisfy migration exit criteria

### Requirement: Measured legacy fallback
The gateway or cohort-control layer SHALL retain a tested legacy fallback for the defined stabilization and rollback window.

#### Scenario: New-host SLO breach during stabilization
- **WHEN** the migrated cohort exceeds its rollback threshold
- **THEN** authorized rollback routes that cohort to the known-good legacy platform and records the outcome

### Requirement: Application ownership registration
Before production registration, every application MUST identify its accountable team, support rota, criticality tier, data classification, SLO, release approver, and rollback contact.

#### Scenario: Unowned application requests production promotion
- **WHEN** ownership or support metadata is incomplete
- **THEN** production registry promotion is rejected

### Requirement: Legacy retirement gates
Legacy routes, import-map entries, containers, and infrastructure SHALL be removed only after all consumers are migrated, the stabilization/rollback window expires, operational evidence meets exit criteria, and an accountable owner approves retirement.

#### Scenario: Last consumer exits legacy runtime
- **WHEN** dependency scans, traffic evidence, and ownership review confirm no remaining consumers
- **THEN** the retirement plan becomes eligible to remove the associated Single-SPA/SystemJS assets

### Requirement: Wave-level measurable exits
The migration program MUST record entry and exit criteria for delivery foundation, platform capability readiness, first production slice, migration factory, and default-host retirement waves.

#### Scenario: Advance to migration factory
- **WHEN** the first production slice meets its stabilization SLO and rollback drill criteria
- **THEN** standardized onboarding for additional application teams may become the active wave
