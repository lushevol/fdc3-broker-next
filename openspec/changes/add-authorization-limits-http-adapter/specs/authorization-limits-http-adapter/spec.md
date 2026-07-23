## ADDED Requirements

### Requirement: Transport-injected adapter
The Cashflow application SHALL adapt an injected status/body HTTP transport to `AuthorizationLimitsService` without owning credentials or importing a concrete HTTP client.

#### Scenario: Tests construct adapter
- **WHEN** a fake transport is supplied
- **THEN** all service operations run without browser globals, host runtime, or network access

### Requirement: Deterministic endpoint mapping
List, create, edit, confirm, reject, and remove SHALL use the characterized methods and encoded paths, mapping expected version to backend version payloads.

#### Scenario: Profile contains path-sensitive characters
- **WHEN** a transition command is sent
- **THEN** profile, currency, and status path segments are URI encoded

### Requirement: Runtime success validation
The adapter MUST validate all record fields, supported statuses, fixed USD currency, finite numeric limitation/version, and list shape before returning domain values.

#### Scenario: Backend returns EUR record
- **WHEN** a success response contains unsupported currency
- **THEN** the adapter rejects an unexpected categorized error

### Requirement: Categorized failures
The adapter SHALL map authorization, forbidden, validation, conflict, unavailable, unexpected, transport, and malformed-body failures to `AuthorizationLimitsMutationError` with deterministic retryability.

#### Scenario: Backend returns 409
- **WHEN** edit receives conflict
- **THEN** the adapter rejects category conflict with retryable false

### Requirement: No swallowed failures
The adapter MUST NOT return empty lists, undefined, or fabricated records for failed requests.

#### Scenario: List transport throws
- **WHEN** the request fails before a response
- **THEN** list rejects unavailable/retryable rather than resolving an empty list
