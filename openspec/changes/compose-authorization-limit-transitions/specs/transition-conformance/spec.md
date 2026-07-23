## ADDED Requirements

### Requirement: Omitted capability rollback
The current production bootstrap MUST remain read-only with no delete, approve, or reject triggers.

#### Scenario: Browser pilot runs without mutation capability
- **WHEN** confirmed and pending details are visited
- **THEN** no transition trigger is rendered and legacy deferral guidance remains visible

### Requirement: Bounded production dependencies
Transition composition MUST use production design, policy, and service APIs without Ant, raw MUI dialogs, legacy globals, or global mutation managers.

#### Scenario: Boundary verification runs
- **WHEN** transition source is scanned
- **THEN** forbidden runtime/UI references fail acceptance

### Requirement: Transition acceptance evidence
Acceptance SHALL cover every status/action mapping, Maker/Checker/Visitor and self-verification, cancel safety, commands, refresh removal, loading, errors/retry, full pilot regression, browser rollback, and strict OpenSpec validation.

#### Scenario: Cohort is accepted
- **WHEN** all gates pass
- **THEN** composition is ready for a future authenticated adapter without being runtime activated
