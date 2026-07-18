## ADDED Requirements

### Requirement: Production API-only presentation
The cohort MUST use `@fm/ratan-design` interaction APIs and MUST NOT import Ant, raw MUI form/dialog APIs, legacy Ratan globals, or application-global mutation managers.

#### Scenario: Boundary scan runs
- **WHEN** create/edit source is evaluated
- **THEN** forbidden UI/runtime dependencies fail acceptance

### Requirement: Regression and rollback evidence
Acceptance SHALL cover absent capability, Visitor denial, create/edit success, validation, loading repeat prevention, error retention/retry, local reconciliation, deferred actions, full pilot regression, and two-layer boundaries.

#### Scenario: Capability is omitted after rollback
- **WHEN** the accepted component renders in current production bootstrap
- **THEN** prior read-only behavior and bundle/runtime architecture remain supported
