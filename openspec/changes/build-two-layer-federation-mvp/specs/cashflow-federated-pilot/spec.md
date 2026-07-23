## ADDED Requirements

### Requirement: Representative Cashflow workflow
The pilot application SHALL render a representative cashflow table with filtering, summary information, record selection, and an application-local details route.

#### Scenario: Filter cashflows
- **WHEN** the user enters a currency filter
- **THEN** the table and summary show only matching cashflows

#### Scenario: View cashflow details
- **WHEN** the user selects a cashflow and opens its details
- **THEN** the browser navigates to the nested Cashflow details path and the selected record is displayed

### Requirement: Host capability communication
The Cashflow pilot SHALL communicate with the host through declared platform capabilities and SHALL NOT import `@fm/base`.

#### Scenario: Notify host
- **WHEN** the user requests a notification from Cashflow
- **THEN** the host displays a message identifying the selected cashflow

### Requirement: Application-owned state
Cashflow filtering and selection state SHALL be owned by the Cashflow application rather than the host.

#### Scenario: Close and reopen application
- **WHEN** the user closes and reopens the Cashflow workspace
- **THEN** a fresh application instance renders with its defined initial state
