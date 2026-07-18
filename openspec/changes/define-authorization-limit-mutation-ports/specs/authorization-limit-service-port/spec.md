## ADDED Requirements

### Requirement: Typed domain service boundary
The production application SHALL define list, create, edit, confirm, reject, and remove operations in domain terms without exposing transport URLs or client-library types.

#### Scenario: Edit command is prepared
- **WHEN** application composition submits a changed limit
- **THEN** the command retains profile/currency identity, numeric limitation, and expected version

### Requirement: Immutable commands and records
Service inputs and outputs SHALL be readonly typed values and SHALL preserve the fixed USD currency constraint.

#### Scenario: Create draft is constructed
- **WHEN** a create workflow prepares a draft
- **THEN** currency is typed as USD and no UI/form type enters the service port

### Requirement: Stable mutation failures
Mutation adapters MUST reject failures using stable categories and retryability rather than returning undefined or an empty success value.

#### Scenario: Backend reports version conflict
- **WHEN** an edit conflicts with a newer record version
- **THEN** application composition receives a non-retryable conflict error suitable for local feedback and refresh

### Requirement: Transport remains replaceable
The service port MUST NOT import fetch, axios, legacy Service, React, design-system, grid, or federation APIs.

#### Scenario: Fixture tests use a fake service
- **WHEN** tests implement the interface in memory
- **THEN** no browser transport or runtime container is required
