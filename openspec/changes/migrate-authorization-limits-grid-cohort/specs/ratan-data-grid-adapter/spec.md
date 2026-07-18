## ADDED Requirements

### Requirement: Separate versioned grid adapter
The platform SHALL deliver AG Grid integration through `@fm/ratan-data-grid` and MUST keep it out of `@fm/ratan-design` and the runtime federation registry.

#### Scenario: Application installs data-grid support
- **WHEN** Cashflow adds a data-intensive cohort
- **THEN** it consumes the versioned adapter as a build-time package with compatible community/react peers

### Requirement: Bounded public API
The adapter MUST expose typed rows, bounded columns, stable row identity, pagination, selection, and activation callbacks without exporting raw grid configuration or API handles as its default contract.

#### Scenario: Define Authorization Limit columns
- **WHEN** Cashflow describes profile, currency, limitation, and status columns
- **THEN** the adapter maps the bounded model to AG Grid internally

### Requirement: Accessible interaction
The adapter SHALL support keyboard focus/navigation, sortable headers, pagination controls, selected-row semantics, and keyboard or pointer row activation.

#### Scenario: Open details by keyboard
- **WHEN** a focused row is activated with Enter
- **THEN** the application receives the same record activation callback as pointer double-click

### Requirement: Semantic appearance
The adapter SHALL map production semantic tokens and density to scoped AG Grid theme variables in light/dark and compact/comfortable modes.

#### Scenario: Host changes appearance
- **WHEN** the application provider changes scheme or density
- **THEN** the grid updates colors, focus, row height, and spacing within its local root

### Requirement: Deterministic infrastructure states
The adapter MUST render accessible loading, empty, and error states without requiring a mounted grid canvas.

#### Scenario: Repository request fails
- **WHEN** the application supplies an error state and retry action
- **THEN** an alert and labeled retry control replace the grid

