## ADDED Requirements

### Requirement: Greenfield host runtime
The MVP host SHALL bootstrap without single-spa, SystemJS, or import maps and SHALL remain independently runnable beside the existing platform.

#### Scenario: Host bootstrap
- **WHEN** the POC host is opened
- **THEN** it renders its launcher and workspace without requesting legacy runtime scripts

### Requirement: Direct runtime remote loading
The host SHALL register and load applications directly from runtime registry manifest URLs without a Ratan runtime container or host rebuild.

#### Scenario: Open registered application
- **WHEN** the user opens Cashflow from the launcher
- **THEN** the host loads the configured exposed module directly and mounts it in a workspace tab

#### Scenario: Registry selects another remote build
- **WHEN** the served registry points to another compatible remote manifest and the host reloads
- **THEN** the host loads that remote without its own source being rebuilt

### Requirement: Application failure isolation
The host SHALL contain remote download and render failures inside the affected workspace and SHALL provide a retry action.

#### Scenario: Remote unavailable
- **WHEN** the remote manifest or entry cannot be loaded
- **THEN** the workspace displays a controlled error and the host launcher remains usable

#### Scenario: Retry after transient failure
- **WHEN** the user retries after the remote becomes available
- **THEN** the host attempts a fresh load without reloading the entire shell

### Requirement: Host route ownership
The host SHALL select applications by their registered base paths and SHALL support direct browser refresh on nested application paths.

#### Scenario: Nested Cashflow refresh
- **WHEN** the browser opens or refreshes `/cashflow/details`
- **THEN** the host loads Cashflow and Cashflow renders its details route
