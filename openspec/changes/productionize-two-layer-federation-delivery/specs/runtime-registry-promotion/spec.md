## ADDED Requirements

### Requirement: Immutable registry revisions
The registry control plane SHALL create immutable, uniquely identified revisions for every candidate and activated environment configuration.

#### Scenario: Activate a production revision
- **WHEN** an approved candidate becomes active
- **THEN** the active environment pointer references its immutable revision and the prior revision remains available

### Requirement: Validated registry content
The control plane MUST validate schema, unique identities/routes, immutable URLs, artifact digests, application contracts, required capabilities, and trusted origins before activation.

#### Scenario: Candidate has an incompatible contract
- **WHEN** a registry candidate selects an application unsupported by the target host
- **THEN** validation fails and the candidate is not activated

#### Scenario: Candidate has duplicate base paths
- **WHEN** two applications claim the same base path
- **THEN** validation fails with an actionable conflict diagnostic

### Requirement: Separation of publication and activation
Application release publication and production registry activation SHALL be separately authorized operations.

#### Scenario: Application team publishes an artifact
- **WHEN** an application pipeline successfully publishes a signed release
- **THEN** the release becomes eligible for promotion but production registry state does not change

### Requirement: Audited environment promotion
Every registry promotion MUST record requester, approver, environment, source and target revisions, application versions/digests, policy evidence, timestamp, and outcome.

#### Scenario: Audit a completed promotion
- **WHEN** an operator inspects a production revision
- **THEN** the system identifies who requested and approved every artifact selection in that revision

### Requirement: Atomic activation and rollback
Registry activation and rollback SHALL be atomic from the client perspective and SHALL never expose a partially updated application set.

#### Scenario: Activation fails before pointer update
- **WHEN** candidate verification fails or publication is interrupted
- **THEN** clients continue receiving the previous complete registry revision

#### Scenario: Roll back a bad release
- **WHEN** a release owner selects the previous known-good revision
- **THEN** new host loads resolve the earlier application set without rebuilding or redeploying applications

### Requirement: Registry resilience
Production registry revisions and active-pointer state MUST be retained and replicated according to defined RPO/RTO policy, with a tested known-good fallback.

#### Scenario: Primary registry origin is unavailable
- **WHEN** the primary registry delivery path fails
- **THEN** the documented recovery procedure restores a validated known-good revision within the target RTO
