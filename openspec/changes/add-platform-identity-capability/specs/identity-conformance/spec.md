## ADDED Requirements

### Requirement: Host owns the identity capability

The host SHALL supply identity to applications and applications SHALL NOT source it from browser storage, URL state, legacy globals, or tokens.

#### Scenario: Current pilot runs without authentication integration
- **WHEN** the host mounts Cashflow
- **THEN** it supplies a truthful anonymous identity snapshot

### Requirement: Identity alone cannot activate mutations

Authenticated identity SHALL be necessary but insufficient to construct Cashflow mutation capability; approved authenticated transport configuration is also required.

#### Scenario: Current anonymous pilot runs
- **WHEN** Authorization Limits renders
- **THEN** create, edit, delete, approve-add, and reject-add controls remain absent

### Requirement: Two-layer boundary remains intact

Identity support MUST NOT add an intermediary runtime container or change host-to-application federation.

#### Scenario: Runtime boundary verifier runs
- **WHEN** the identity slice is accepted
- **THEN** only host and application runtime layers remain
