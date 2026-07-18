## ADDED Requirements

### Requirement: Independent application artifact
The Cashflow pilot SHALL build and run independently from the host and SHALL expose only its manifest and application component through Module Federation.

#### Scenario: Build Cashflow alone
- **WHEN** the Cashflow workspace build runs without a host build
- **THEN** it produces a loadable remote artifact using production package APIs

### Requirement: Application-owned domain composition
Cashflow SHALL own its records, filters, selection, detail routing, summaries, and domain layout while using the design system only for reusable primitives and semantics.

#### Scenario: Filter cashflows
- **WHEN** a user enters a currency or identifier filter
- **THEN** Cashflow updates its own record view without delegating domain state to the host or design package

### Requirement: Local design provider
Cashflow MUST install its own `DesignSystemProvider` and derive its local appearance from the supplied versioned capability.

#### Scenario: Host appearance changes
- **WHEN** the host publishes a compatible light or density snapshot
- **THEN** Cashflow updates its scoped tokens and MUI adapter without a cross-MFE context

### Requirement: Standalone execution
Cashflow SHALL run with deterministic local platform capabilities when launched outside the host.

#### Scenario: Start the application standalone
- **WHEN** a developer opens the Cashflow development entry directly
- **THEN** domain UI renders with valid default appearance and local capability behavior

### Requirement: Accessible foundation usage
Cashflow MUST use the public Button, TextField, and StatusBadge APIs for the pilot controls and statuses.

#### Scenario: Operate the record workflow by role and label
- **WHEN** tests or assistive technology query the filter, rows, actions, and statuses
- **THEN** controls have deterministic accessible roles, labels, focus behavior, and states

