## ADDED Requirements

### Requirement: Federated entry uses the migrated Cashflow CN source
The Portal Host remote SHALL render a migrated copy of the actual `apps/mfe-cashflow-blotter/src/Cashflow_CN` component tree and SHALL NOT substitute a separately authored facsimile.

#### Scenario: Source provenance
- **WHEN** the federated entry and dependency graph are inspected
- **THEN** they include the migrated Cashflow CN entry, Redux store, Main application, search, grid, details, notifications, and workflow modules

#### Scenario: Facsimile exclusion
- **WHEN** the production remote is built
- **THEN** deterministic fixture records are not the production application implementation or data path

### Requirement: Cashflow CN behavior is preserved
The migrated application SHALL preserve Cashflow CN quick search, custom search/view, quick filters, server-paged grid, footer/export, details, notification refresh, and entitled workflow actions.

#### Scenario: Primary workflow
- **WHEN** initialized business fields and a successful Cashflow query are available
- **THEN** the existing search controls, result grid, paging/footer, and notification subscriber render and operate

#### Scenario: Cashflow details
- **WHEN** a user opens a Cashflow result
- **THEN** the migrated details composition displays trade, cashflow, party, accounting, history, and exception information according to the returned data and entitlements

#### Scenario: Entitled action
- **WHEN** an entitled user invokes a supported maker/checker, hold, netting, splitting, settlement, SWIFT, failure, or exception action
- **THEN** the migrated workflow uses the corresponding production service contract and preserves its confirmation, progress, success, and error behavior

### Requirement: Production data contracts remain active
The migrated application SHALL preserve the legacy GraphQL list/detail queries, REST action endpoints, business-field metadata, feature flags, identity, and permissions behind explicit adapters.

#### Scenario: Production mode
- **WHEN** the remote runs with production platform adapters
- **THEN** Cashflow CN uses production transports and does not read deterministic fixture records

#### Scenario: Local fixture mode
- **WHEN** the remote runs with the documented local adapter
- **THEN** captured contract-compatible responses travel through the same service and state boundaries as production responses

#### Scenario: Local parity data
- **WHEN** Portal Host runs its local development server and the actual Cashflow CN application requests business fields, saved filters, saved views, the Cashflow list, or Cashflow details
- **THEN** the host returns production-shaped responses from versioned local contract fixtures on the unchanged legacy API routes
- **AND** the application renders at least two grid rows, a saved custom filter, a saved custom view, and the selected Cashflow detail composition

#### Scenario: Production transport remains unchanged
- **WHEN** Portal Host is built for production
- **THEN** local Cashflow fixtures are not included in the production middleware path
- **AND** the migrated application continues to request the production GraphQL and REST routes

### Requirement: Legacy runtimes are absent
The built Cashflow CN remote MUST NOT import, request, or invoke Single-SPA, SystemJS, import maps, `@fm/base`, or `@fm/ratan_container`.

#### Scenario: Transitive boundary scan
- **WHEN** source and built assets for the complete migrated dependency graph are scanned
- **THEN** no forbidden runtime dependency or dynamic SystemJS call is present

#### Scenario: Hosted network boundary
- **WHEN** Portal Host loads and exercises Cashflow CN
- **THEN** no request is made for a base-shell, Ratan-container, SystemJS, or import-map asset

### Requirement: Host integration is explicit
The application SHALL receive appearance, identity, navigation, telemetry, notifications, workspace, configuration, and transport concerns through versioned contracts or Cashflow-owned adapters.

#### Scenario: Host appearance changes
- **WHEN** Portal Host changes scheme, density, or direction
- **THEN** the migrated Cashflow CN application updates without importing host components or context

#### Scenario: Optional host action is unavailable
- **WHEN** a typed trade/cashflow navigation action is unavailable
- **THEN** the application disables or reports that action without crashing the primary workflow

### Requirement: Only Cashflow CN is migrated
The remote SHALL contain the Cashflow CN route and SHALL exclude unrelated blotter applications.

#### Scenario: Scope inspection
- **WHEN** migrated source and navigation are inspected
- **THEN** group management, dashboard, BIC netting static, utilization static, authorization limits, splitting static, and OpenSearch-only route entries are absent

### Requirement: Migration acceptance proves parity
The system MUST verify source provenance, key workflow parity, service adapters, at least 90 percent coverage of new adapter code, lint/type checks, production builds, transitive boundary checks, and Portal Host browser acceptance.

#### Scenario: Automated verification
- **WHEN** migration verification runs
- **THEN** all provenance, parity, adapter, coverage, lint, type, build, and boundary checks pass

#### Scenario: Hosted browser acceptance
- **WHEN** Portal Host loads the actual migrated Cashflow CN remote
- **THEN** a user completes quick search, grid result selection, details inspection, and one representative entitled action without application errors or legacy runtime requests
