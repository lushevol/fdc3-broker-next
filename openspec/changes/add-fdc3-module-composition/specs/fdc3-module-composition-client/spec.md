## ADDED Requirements

### Requirement: Clearly non-FDC3 agent extension

The platform SHALL expose module composition as `modules` on `RatanDesktopAgent` while retaining the unmodified FDC3 `DesktopAgent` contract.

#### Scenario: Tile uses the extended agent

- **WHEN** a tile obtains a `RatanDesktopAgent` through the existing agent APIs
- **THEN** it can invoke `modules.load` without treating that method as an FDC3 API

### Requirement: Scoped agent delegation

A scoped desktop agent SHALL delegate its module-composition capability to the host broker without changing the FDC3 source identity for any standard operation.

#### Scenario: Provider creates a scoped agent

- **WHEN** a tile receives a scoped agent from `AgentProvider`
- **THEN** its `modules` capability resolves modules through the configured broker loader

### Requirement: Backward-compatible capability configuration

The broker SHALL accept configuration without a module loader and SHALL leave all standard FDC3 behavior available in that configuration.

#### Scenario: Existing host has not configured composition

- **WHEN** the broker is created without a module loader
- **THEN** standard FDC3 methods work unchanged and a module-load attempt reports an unavailable capability error
