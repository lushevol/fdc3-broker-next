## ADDED Requirements

### Requirement: Application-owned dependency factory

Cashflow SHALL export a factory that accepts optional domain runtime dependencies and returns a federated component accepting only standard `ApplicationProps`.

#### Scenario: Host mounts the generated application
- **WHEN** the host supplies platform application props
- **THEN** no Authorization Limits service or domain principal is required from the host

### Requirement: Authenticated service composition

Cashflow SHALL create Authorization Limits mutation capability only when an injected service and an authenticated identity snapshot are both present.

#### Scenario: Authenticated maker and service are available
- **WHEN** Cashflow renders Authorization Limits
- **THEN** the domain principal contains the identity user id and cloned permissions and the injected service owns reads and mutations

### Requirement: Missing-input read-only behavior

Cashflow MUST omit mutation capability when identity is anonymous or absent, or when the service is absent.

#### Scenario: Service exists but identity is anonymous
- **WHEN** Authorization Limits renders
- **THEN** reads may use the service but all mutation controls remain absent

#### Scenario: Identity is authenticated but service is absent
- **WHEN** Authorization Limits renders
- **THEN** the existing read-only repository remains active and all mutation controls remain absent

### Requirement: Domain isolation

The composition layer MUST translate platform identity to an application-domain principal without adding Authorization Limits types or services to platform contracts, SDK, registry, or host.

#### Scenario: Boundary scan runs
- **WHEN** production boundaries are inspected
- **THEN** Authorization Limits service imports remain inside Cashflow and the runtime still has only host and application layers
