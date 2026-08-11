## ADDED Requirements

### Requirement: Generate source-library mappings and codemods
Migration artifacts MUST cover WebKit, legacy Ratan, MUI, and Ant Design imports, props, callbacks/events, slots/composition, forms, icons, providers, and documented semantic differences.

#### Scenario: A legacy Ratan component is migrated
- **WHEN** its Ant Design-backed API has a supported Ratan replacement
- **THEN** the migration map and applicable codemod SHALL identify the target import and required API changes

### Requirement: Publish a tenant migration playbook
The playbook SHALL define inventory, cohort selection, coexistence, codemod/manual steps, packed-package verification, rollout, rollback, measurement, observation, cleanup, ownership, and committed completion dates.

#### Scenario: A tenant uses mixed UI libraries
- **WHEN** migration cannot complete in one release
- **THEN** an approved plan SHALL record the owner, supported coexistence combination, rollback route, and endpoint

### Requirement: Provide an adoption dashboard
Private CI tooling SHALL report parity/workbench completion, source-library imports by application, mapping/codemod coverage, unresolved manual migrations, coexistence endpoints, pilot status, and retirement blockers without collecting end-user interaction data.

#### Scenario: A deprecated library remains in an application
- **WHEN** the dashboard scans repository dependencies
- **THEN** it SHALL show the owning application, remaining surface, and approved migration endpoint

### Requirement: Verify migration pilots
Portal Host MUST pass login, navigation, application/tile opening and rendering, overlays, feedback, workspace tabs, and tile removal after migration. A representative tenant MUST adopt without design-system maintainers patching tenant business source.

#### Scenario: The pilot requires an undocumented source patch
- **WHEN** migration cannot be completed through public APIs, tokens, slots, mappings, or codemods
- **THEN** Ratan SHALL treat the gap as an incomplete contract rather than modifying tenant source as a hidden workaround

### Requirement: Retire legacy implementation safely
The legacy `@fm/ratan-design@1.1.0` workspace and obsolete dependencies MUST NOT be removed until both remaining consumers pass migration, packed-consumer, application, observation, and rollback gates.

#### Scenario: A consumer has not passed its observation window
- **WHEN** retirement is proposed
- **THEN** legacy package deletion SHALL be blocked

### Requirement: Gate release promotion
Cohorts SHALL publish as `2.0.0-alpha.*`; stable `2.0.0` MUST require 100 percent in-scope manifest completion, all workbench and quality gates, no critical accessibility findings, no unexplained visual differences, migrated pilots/legacy consumers, and no dependency on the removed implementation.

#### Scenario: Stable release is requested early
- **WHEN** any stable criterion is incomplete
- **THEN** the release SHALL remain an alpha and the dashboard SHALL report the blockers
