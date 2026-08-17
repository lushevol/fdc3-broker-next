## ADDED Requirements

### Requirement: VM deployment is the current production method
SCB Next release documentation and pipeline configuration SHALL identify VM/Ansible as the supported production deployment method until a separate infrastructure decision approves another substrate.

#### Scenario: Production release is initiated
- **WHEN** a release owner follows the SCB Next production procedure
- **THEN** the procedure deploys independently versioned edge, platform, and tenant artifacts to the VM estate through the approved Ansible workflow

### Requirement: VM workloads are independently deployable
The VM topology SHALL allow `mfe-base`, `single-ui-bff`, `mfe-ratan-container`, and `mfe-cashflow-blotter` to be deployed and rolled back without rebuilding unrelated ownership units.

#### Scenario: Cashflow is rolled back
- **WHEN** the Cashflow release fails verification
- **THEN** operators can restore the previous Cashflow artifact while retaining the current platform and Ratan container artifacts

### Requirement: VM edge configuration is environment-driven
The VM edge SHALL resolve upstream addresses from deployment configuration and SHALL NOT embed production credentials, private keys, or environment-specific secrets in source-controlled Nginx files.

#### Scenario: Environment topology changes
- **WHEN** an upstream VM or service address changes
- **THEN** operators update deployment configuration without rebuilding frontend artifacts

### Requirement: VM releases have operational gates
The VM release procedure SHALL verify edge health, platform UI, platform APIs, tenant static artifacts, tenant APIs, WebSocket forwarding, security headers, and the accepted browser journey before completion.

#### Scenario: Route verification fails
- **WHEN** any required route reaches the wrong upstream or returns an unhealthy response
- **THEN** the release is stopped and the documented independent rollback procedure is available

### Requirement: Compose is not represented as production deployment
The repository SHALL label the Docker Compose stack as local production-style acceptance and SHALL NOT present its mock BFF or bundled edge image as a production topology.

#### Scenario: Developer runs production-style acceptance
- **WHEN** the local Compose command is used
- **THEN** documentation clearly distinguishes its fixture-backed result from VM production certification
