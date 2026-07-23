## ADDED Requirements

### Requirement: Additive capability negotiation

Identity fields SHALL remain optional for registry entries and manifests that do not request identity.

#### Scenario: Existing application omits identity
- **WHEN** it satisfies application and appearance contracts
- **THEN** compatibility validation continues to accept it

### Requirement: Conditional exact version compatibility

When a registry entry requests identity, both registry and application manifest MUST declare the host-supported identity contract version.

#### Scenario: Identity version is missing or unsupported
- **WHEN** compatibility validation runs
- **THEN** it fails with stable `IDENTITY_CONTRACT_UNSUPPORTED` code and version details

### Requirement: Independent package and runtime versions

Platform package and runtime contract versions SHALL remain independently declared so package minor releases do not implicitly change application, appearance, or identity protocol versions.

#### Scenario: Identity support is released
- **WHEN** platform packages advance to 1.1
- **THEN** all three runtime dimensions retain independent explicit versions
