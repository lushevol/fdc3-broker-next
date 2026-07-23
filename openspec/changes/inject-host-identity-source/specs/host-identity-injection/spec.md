## ADDED Requirements

### Requirement: Optional bootstrap identity source

The portal host SHALL accept an optional versioned `IdentityCapability` at its bootstrap/application boundary and deliver it directly to federated applications.

#### Scenario: Approved source is supplied
- **WHEN** the registry loads and an application mounts
- **THEN** the application receives the exact supplied capability without any domain service or credential fields

### Requirement: Stable anonymous fallback

The host MUST use one frozen anonymous identity capability when no source is supplied.

#### Scenario: Default production bootstrap runs
- **WHEN** Cashflow reads identity repeatedly
- **THEN** it receives the same anonymous snapshot reference and no mutation activation occurs

### Requirement: Live source propagation

The host SHALL preserve the supplied capability subscription so identity changes reach a mounted application without remounting it.

#### Scenario: Source changes from authenticated to anonymous
- **WHEN** the capability publishes logout
- **THEN** the mounted application observes anonymous state through the same capability instance

### Requirement: Shared generic host capability

The host SHALL provide the same generic identity capability to every application instance and MUST NOT translate it to application-domain roles.

#### Scenario: Cashflow is mounted
- **WHEN** the host builds application props
- **THEN** no Authorization Limits role, principal, service, or permission decision exists in host code
