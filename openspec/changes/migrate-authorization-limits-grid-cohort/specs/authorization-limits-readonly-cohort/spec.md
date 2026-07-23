## ADDED Requirements

### Requirement: Read-only Authorization Limits route
Cashflow SHALL expose an Authorization Limits list route and nested details route using application-owned records and repository state.

#### Scenario: Open Authorization Limits
- **WHEN** a user selects Authorization Limits in Cashflow
- **THEN** the application loads and displays profile, USD currency, formatted limitation, and status records

### Requirement: List interaction parity
The list SHALL support text filtering, sorting, client pagination, stable row identity, selection, and double-click or Enter details activation.

#### Scenario: Sort by limitation
- **WHEN** a user activates the limitation column sort
- **THEN** visible rows are ordered numerically and maintain stable identities

### Requirement: Details composition
The details route SHALL display record identity, profile, currency, limitation, status, version, and audit metadata with a back action.

#### Scenario: Activate a limit row
- **WHEN** a user activates an Authorization Limit row
- **THEN** Cashflow navigates to its details route through the platform client

### Requirement: Repository states
Cashflow MUST distinguish loading, empty, error/retry, and ready repository outcomes.

#### Scenario: Retry failed load
- **WHEN** the initial repository request fails and the user retries
- **THEN** Cashflow requests records again and renders the ready grid without remounting the host

### Requirement: Explicit mutation deferral
The cohort MUST NOT expose create, edit, delete, approve, or reject actions and SHALL identify them as remaining in the legacy workflow.

#### Scenario: Read-only list is rendered
- **WHEN** a user inspects list and details actions
- **THEN** no mutation or approval control is available in the new cohort

