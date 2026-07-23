## ADDED Requirements

### Requirement: Independently versioned production contracts

The production contract package SHALL expose independent semantic versions for the application protocol and appearance protocol.

#### Scenario: Validate registry and remote manifest
- **WHEN** a registry entry and loaded remote manifest declare supported application and appearance majors
- **THEN** compatibility validation returns the typed federated application module

#### Scenario: Reject unsupported major
- **WHEN** either declared contract major is unsupported
- **THEN** validation fails before application rendering with a stable incompatibility code and diagnostic versions

### Requirement: Runtime-validated appearance snapshot

The appearance contract SHALL validate preference, resolved scheme, density, locale, direction, and contract version at runtime.

#### Scenario: Accept valid snapshot
- **WHEN** all required appearance fields conform to the supported schema
- **THEN** parsing returns a typed immutable snapshot

#### Scenario: Reject malformed snapshot
- **WHEN** a field is missing, invalid, or declares an unsupported version
- **THEN** parsing returns a structured validation failure

### Requirement: Stable host capability

The platform capability SHALL provide `getSnapshot` and `subscribe` with stable identity across appearance changes.

#### Scenario: Subscribe to host appearance
- **WHEN** the host publishes a new valid snapshot
- **THEN** active subscribers receive it and subsequent `getSnapshot` calls return it

#### Scenario: Unsubscribe from host appearance
- **WHEN** a subscriber invokes its unsubscribe function
- **THEN** it receives no later snapshots

### Requirement: Standalone application controller

The production SDK SHALL provide a local appearance controller using the same capability interface for standalone applications, tests, and Storybook.

#### Scenario: Render without host
- **WHEN** an application constructs a controller from deterministic defaults
- **THEN** it can read and subscribe to appearance without federation or browser-global host state
