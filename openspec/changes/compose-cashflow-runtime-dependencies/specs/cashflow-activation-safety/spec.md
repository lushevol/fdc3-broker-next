## ADDED Requirements

### Requirement: Live identity downgrade

The generated Cashflow application SHALL subscribe to identity changes and immediately remove mutation affordances when identity becomes anonymous or unavailable.

#### Scenario: User logs out with an editor open
- **WHEN** the host publishes anonymous identity
- **THEN** the editor closes and mutation controls disappear without remounting the application

### Requirement: Immutable principal translation

The composed domain principal MUST clone and freeze identity permissions so external mutation cannot change authorization decisions.

#### Scenario: Source permissions are changed
- **WHEN** composition has completed
- **THEN** the domain principal retains the accepted user id and permission set

### Requirement: Dormant default export

The default federated export and standalone preview MUST omit the Authorization Limits service until an approved application bootstrap explicitly supplies it.

#### Scenario: Production rollback browser journey runs
- **WHEN** the current host loads the default Cashflow remote
- **THEN** Create, Edit, Delete, Approve Add, and Reject Add remain absent

### Requirement: No concrete transport ownership

This composition slice MUST NOT choose environment URLs, credentials, CSRF, request timeouts, concrete HTTP clients, or authentication mechanisms.

#### Scenario: Dependency boundary is scanned
- **WHEN** the factory and composer sources are inspected
- **THEN** they depend only on platform identity and Cashflow-owned ports
