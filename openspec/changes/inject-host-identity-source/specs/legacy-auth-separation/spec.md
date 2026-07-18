## ADDED Requirements

### Requirement: No legacy identity dependency

The new host identity path MUST NOT import or read `apps/base`, `mfe-ratan-container`, `getUser`, `hasPermission`, legacy hooks/store, or `SET_TOKEN` storage.

#### Scenario: Host boundary scan runs
- **WHEN** host identity and bootstrap sources are inspected
- **THEN** all legacy identity dependencies and storage keys are absent

### Requirement: Identity is not a credential bus

The host identity injection MUST NOT add authorization/refresh tokens, cookies, CSRF values, request headers, login operations, or credential storage to the identity contract.

#### Scenario: Authenticated capability is injected
- **WHEN** an application reads its snapshot
- **THEN** only state, user id, permissions, and identity contract version are available

### Requirement: Legacy behavior is characterized, not copied

Migration documentation SHALL record the legacy user, entitlement, persistence, and request-header behavior and identify the production replacement owner for each concern.

#### Scenario: Authentication implementation is planned
- **WHEN** engineers consult the migration acceptance document
- **THEN** they can distinguish identity delivery from secure credential transport and avoid reviving the container runtime

### Requirement: Dormant activation

Adding the injection seam MUST leave the default host anonymous and current Cashflow mutation controls absent.

#### Scenario: Browser rollback suite runs
- **WHEN** the default host loads Cashflow
- **THEN** Create, Edit, Delete, Approve Add, and Reject Add remain absent
