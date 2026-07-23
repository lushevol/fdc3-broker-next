## ADDED Requirements

### Requirement: Explicit identity states

The platform SHALL represent identity as an anonymous/authenticated discriminated union with an independent contract version.

#### Scenario: Host has no authenticated session
- **WHEN** an application reads identity
- **THEN** it receives anonymous state with no user id, permissions, credentials, or tokens

### Requirement: Minimal authenticated principal

Authenticated identity MUST contain a non-empty user id and unique, non-empty permission identifiers only.

#### Scenario: Authenticated snapshot is malformed
- **WHEN** user id is blank or permissions are duplicated
- **THEN** runtime validation rejects the snapshot

### Requirement: Observable immutable snapshot

Identity capability SHALL expose synchronous snapshot reads and subscriptions using cloned, frozen, runtime-validated values.

#### Scenario: Caller mutates its source object
- **WHEN** a controller has accepted the snapshot
- **THEN** the published identity remains unchanged

### Requirement: No authentication mechanics

The identity contract MUST NOT expose tokens, credentials, login/logout, refresh, cookies, or provider-specific claims.

#### Scenario: Contract boundary is scanned
- **WHEN** identity public types are inspected
- **THEN** only state, user id, permissions, version, read, and subscribe surfaces are present
