## ADDED Requirements

### Requirement: Runtime-validated application registry
The platform SHALL define a typed and runtime-validated registry schema containing an application identifier, display name, remote name, manifest URL, exposed module, base path, contract version, and declared capabilities.

#### Scenario: Valid registry
- **WHEN** the host receives a registry containing all required valid fields
- **THEN** the registry is accepted and its applications are available to the launcher

#### Scenario: Invalid registry
- **WHEN** the host receives a registry with an invalid URL, route, or missing required field
- **THEN** validation fails with a controlled diagnostic and no invalid application is loaded

### Requirement: Stable application module contract
Each federated application SHALL expose metadata and a React application component conforming to the shared contract, and the host SHALL reject unsupported contract versions.

#### Scenario: Compatible application
- **WHEN** an application declares the supported contract version
- **THEN** the host renders the application with its assigned instance, base path, and capabilities

#### Scenario: Incompatible application
- **WHEN** an application declares an unsupported contract version
- **THEN** the host displays a compatibility error without crashing the shell

### Requirement: Narrow platform capabilities
The host SHALL expose platform behavior to applications through typed capabilities and SHALL NOT expose its internal reducer, state container, or token storage.

#### Scenario: Application sends notification
- **WHEN** the application calls its declared notification capability
- **THEN** the host displays the notification without exposing host state internals
