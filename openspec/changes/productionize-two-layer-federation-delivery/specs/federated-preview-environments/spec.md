## ADDED Requirements

### Requirement: Commit-addressed preview
An eligible pull request SHALL be able to publish a short-lived immutable artifact keyed by source commit and a generated preview registry that selects the candidate with otherwise stable dependencies.

#### Scenario: Preview an application change
- **WHEN** an application pull request requests a preview
- **THEN** the system publishes a unique registry/URL that loads the candidate application without changing shared DEV state

### Requirement: Preview validation
Preview creation MUST run compatibility, deployed smoke, Playwright, and applicable accessibility checks and expose their results with the preview metadata.

#### Scenario: Candidate cannot load in the stable host
- **WHEN** preview validation detects a contract or loading failure
- **THEN** the pull request reports the failed check and the candidate is not considered promotable

### Requirement: Preview access control
Preview environments SHALL use approved authentication and test data/API boundaries and MUST NOT expose production secrets or unrestricted production services.

#### Scenario: Unauthorized user requests a preview URL
- **WHEN** a user without preview access opens the URL
- **THEN** access is denied before serving protected application context

### Requirement: Automatic preview cleanup
Preview registries, routes, and artifacts SHALL have an owner and expiration and SHALL be removed automatically after closure or TTL while retaining required audit evidence.

#### Scenario: Pull request closes
- **WHEN** the cleanup grace period expires
- **THEN** the preview URL and active resources are removed without affecting immutable promoted releases

### Requirement: Consumer-aware previews
Host changes SHALL be tested with representative applications, and contract changes MUST test all affected consumers in the preview/compatibility matrix.

#### Scenario: Platform contract changes
- **WHEN** a pull request changes the application protocol contract
- **THEN** CI evaluates every supported host/application consumer combination affected by that contract
