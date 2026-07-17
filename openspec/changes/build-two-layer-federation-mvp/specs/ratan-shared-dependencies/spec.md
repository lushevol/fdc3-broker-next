## ADDED Requirements

### Requirement: Ratan domain logic package
Reusable Ratan domain types and functions SHALL be available through a typed workspace package that does not import the host or any application.

#### Scenario: Cashflow calculates a summary
- **WHEN** Cashflow passes domain rows to the Ratan summary function
- **THEN** it receives the correctly aggregated amount and record count

### Requirement: Ratan UI package
Reusable Ratan UI compositions SHALL be available through a tested React package consumed at application build time rather than through a runtime container.

#### Scenario: Cashflow renders Ratan table
- **WHEN** the Cashflow application supplies domain rows and a selection callback
- **THEN** the shared Ratan table renders the rows and reports the selected record

### Requirement: No runtime Ratan composition layer
The MVP SHALL NOT register or load `mfe-ratan-container` when opening the Cashflow pilot.

#### Scenario: Cashflow network loading
- **WHEN** Cashflow is opened in the host
- **THEN** its shared Ratan behavior is already part of its build dependency graph and no Ratan container manifest is requested
