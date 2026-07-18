## ADDED Requirements

### Requirement: Direct application composition
The production pilot host SHALL load registered applications directly through Module Federation without Single-SPA, SystemJS, `@fm/base`, or `mfe-ratan-container` runtime participation.

#### Scenario: Open Cashflow from the host
- **WHEN** a user opens the registered Cashflow application
- **THEN** the host validates and renders the remote as the second and final runtime layer

### Requirement: Validated registry bootstrap
The host MUST fetch and runtime-validate its application registry before exposing launch actions.

#### Scenario: Registry is invalid
- **WHEN** the registry violates the production schema
- **THEN** the host shows a contained bootstrap error and does not attempt remote loading

### Requirement: Compatibility before render
The host MUST validate the loaded application identity and application/appearance protocol versions before rendering its React component.

#### Scenario: Remote identity differs from registry
- **WHEN** a remote manifest declares a different application ID
- **THEN** the host shows an actionable contained error and leaves the launcher usable

### Requirement: Host-owned platform capabilities
The host SHALL provide stable typed navigation, notification, telemetry, workspace, and appearance capabilities to each application instance.

#### Scenario: Application invokes host behavior
- **WHEN** Cashflow navigates, notifies, tracks, or closes its workspace
- **THEN** the host performs that behavior without the application importing host implementation code

### Requirement: Host-owned appearance bootstrap
The host SHALL own validated appearance persistence and SHALL publish live appearance changes through the versioned appearance capability.

#### Scenario: User changes density
- **WHEN** the user changes density in the host
- **THEN** host and loaded application provider roots update without remounting application state

### Requirement: Route and failure isolation
The host SHALL support nested-route refresh and SHALL contain registry, loading, compatibility, and render failures with retry or recovery actions.

#### Scenario: Remote loading fails
- **WHEN** the Cashflow remote cannot load
- **THEN** the affected workspace shows retry while the host shell and launcher remain operable

