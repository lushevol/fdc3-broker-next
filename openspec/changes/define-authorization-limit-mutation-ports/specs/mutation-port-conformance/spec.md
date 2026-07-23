## ADDED Requirements

### Requirement: Read-only cohort compatibility
Adding mutation ports MUST NOT expose mutation controls, alter read-only fixture behavior, or change host/application runtime boundaries.

#### Scenario: Production pilot regresses
- **WHEN** existing Cashflow, host, grid, or boundary tests run
- **THEN** their established behavior remains green without supplying a principal or mutation service

### Requirement: Exhaustive contract evidence
Acceptance SHALL test permission precedence, access/create decisions, every supported record status, self-verification, command shapes, error categories, and forbidden imports.

#### Scenario: Port change is accepted
- **WHEN** the full Cashflow and production-pilot gates run
- **THEN** policy and service contracts are proven before any mutation UI is enabled
