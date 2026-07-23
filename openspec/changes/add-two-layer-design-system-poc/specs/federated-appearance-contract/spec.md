## ADDED Requirements

### Requirement: Versioned appearance snapshot
The platform contract SHALL define a versioned appearance snapshot containing scheme, preference, density, locale, direction, and appearance contract version.

#### Scenario: Valid appearance snapshot
- **WHEN** a snapshot contains supported appearance values and the current contract version
- **THEN** the contract SHALL accept it and expose a strongly typed snapshot

#### Scenario: Invalid appearance snapshot
- **WHEN** a snapshot contains an unsupported scheme, density, direction, or missing contract version
- **THEN** runtime validation SHALL reject it with a controlled diagnostic

### Requirement: Host-owned appearance capability
The platform SHALL expose appearance through `getSnapshot` and `subscribe`, and the host SHALL remain the authority for changing appearance state.

#### Scenario: Application subscribes to appearance
- **WHEN** the host changes scheme or density
- **THEN** each subscribed application listener SHALL receive the new complete snapshot

#### Scenario: Application unsubscribes
- **WHEN** an application removes its appearance subscription
- **THEN** it SHALL receive no further appearance notifications

### Requirement: Appearance contract compatibility
The application manifest and registry SHALL declare the required appearance contract version, and the host SHALL reject incompatible applications before rendering them.

#### Scenario: Compatible appearance contract
- **WHEN** registry, remote manifest, and host use the supported appearance contract version
- **THEN** the application SHALL render with the host appearance capability

#### Scenario: Incompatible appearance contract
- **WHEN** a remote manifest declares an unsupported appearance contract version
- **THEN** the host SHALL display a controlled compatibility error without crashing the shell

### Requirement: Stable capability identity
The host SHALL provide a stable appearance capability identity while its current application instance remains mounted.

#### Scenario: Host appearance changes
- **WHEN** scheme or density changes without changing the active application instance
- **THEN** the capability object SHALL remain stable and publish the new snapshot through its subscribers
