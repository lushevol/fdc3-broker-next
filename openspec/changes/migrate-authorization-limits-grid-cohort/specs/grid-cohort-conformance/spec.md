## ADDED Requirements

### Requirement: Forbidden legacy imports
The adapter and migrated cohort MUST NOT import Ant, legacy Ratan wrappers/utilities, `src/Root`, `@fm/base`, or `mfe-ratan-container`.

#### Scenario: Scan cohort dependencies
- **WHEN** the grid conformance gate runs
- **THEN** any forbidden package, source alias, or runtime reference fails acceptance

### Requirement: Community feature and license boundary
The first cohort SHALL use AG Grid Community only and MUST record its version, license classification, feature set, and absence of enterprise modules.

#### Scenario: Inspect production dependencies
- **WHEN** release evidence is generated
- **THEN** community/react versions are compatible and no enterprise package is present

### Requirement: Cohort behavior evidence
Acceptance MUST include unit/component and browser evidence for loading, empty, error/retry, filtering, sorting, pagination, keyboard/pointer activation, details/back, appearance, and standalone/federated modes.

#### Scenario: Run the cohort acceptance command
- **WHEN** all grid and application gates execute
- **THEN** the bounded behavior matrix passes against independently built host and application artifacts

### Requirement: Measured bundle impact
The release evidence SHALL compare application build size before and after the grid cohort and identify grid-specific chunks where available.

#### Scenario: Grid increases application bytes
- **WHEN** the production build completes
- **THEN** the size delta is recorded and reviewed before expanding to more cohorts

### Requirement: Legacy fallback remains available
The legacy Authorization Limits implementation SHALL remain unchanged until production service integration, parity, canary, and rollback gates are approved.

#### Scenario: Cohort fails an exit gate
- **WHEN** behavior or operational evidence is incomplete
- **THEN** traffic remains on or returns to the legacy route

