## ADDED Requirements

### Requirement: Host design adoption
The POC host SHALL use the design-system provider and shared controls for representative host actions while owning appearance preference and persistence.

#### Scenario: User changes scheme
- **WHEN** the user activates the host theme control
- **THEN** the host shell and mounted application SHALL update to the new scheme without page reload

#### Scenario: User changes density
- **WHEN** the user activates the host density control
- **THEN** host and application shared controls SHALL update to the new density without remounting the application

### Requirement: Federated application design adoption
The Cashflow POC SHALL render through its own local design provider driven by the appearance capability and SHALL use shared components for its filter, primary actions, and status values.

#### Scenario: Cashflow renders under host
- **WHEN** the host mounts Cashflow with an appearance capability
- **THEN** Cashflow SHALL render its migrated controls using the host appearance snapshot

### Requirement: Standalone application appearance
The Cashflow POC SHALL support a local appearance controller when rendered outside the host for development and testing.

#### Scenario: Standalone Cashflow render
- **WHEN** Cashflow is started without a host-provided appearance capability
- **THEN** it SHALL render with a deterministic default appearance and retain working local navigation and interactions

### Requirement: Two-layer runtime isolation
Design-system adoption SHALL preserve direct host-to-application runtime composition and independent application failure isolation.

#### Scenario: Inspect application network loading
- **WHEN** Cashflow is opened and exercised in the host
- **THEN** the browser SHALL load the host and Cashflow remote without loading Single-SPA, SystemJS, import maps, `mfe-ratan-container`, or a design-system remote

### Requirement: End-to-end accessibility fundamentals
The integrated POC SHALL expose labelled appearance controls, labelled Cashflow filtering, readable status text, and visible keyboard focus.

#### Scenario: Keyboard navigation across runtime layers
- **WHEN** a user tabs through host controls and Cashflow controls
- **THEN** each focused shared control SHALL have an observable visible focus indicator and an accessible name
