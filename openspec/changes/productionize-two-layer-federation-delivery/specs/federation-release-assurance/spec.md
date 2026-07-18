## ADDED Requirements

### Requirement: Reproducible release validation
Each releasable host or application change MUST pass pinned-toolchain installation, lint, type checking, unit/component tests, production build, and applicable browser integration tests.

#### Scenario: Application source changes
- **WHEN** a pull request changes a federated application
- **THEN** CI validates that application and its host integration before allowing merge

### Requirement: Contract compatibility gate
CI and promotion SHALL validate application protocol, required/optional capabilities, and shared singleton ranges against the target supported host matrix.

#### Scenario: New application requires an unavailable capability
- **WHEN** an application declares a required capability absent from the target host
- **THEN** the release is rejected before registry activation

#### Scenario: Additive optional capability is unavailable
- **WHEN** an application declares an optional capability absent from the host
- **THEN** compatibility succeeds and the application follows its specified degraded behavior

### Requirement: Supply-chain evidence
Every releasable artifact MUST have an SBOM, provenance statement, content digest, vulnerability/license policy result, and trusted signature bound to its release identity.

#### Scenario: Artifact lacks a valid signature
- **WHEN** promotion evaluates an unsigned artifact or an artifact signed by an untrusted identity
- **THEN** promotion is rejected

#### Scenario: Published bytes differ from attestation
- **WHEN** the retrieved artifact digest differs from its signed provenance
- **THEN** release verification fails and the artifact is quarantined

### Requirement: No frontend secrets
CI MUST scan frontend inputs and outputs for secrets and MUST prevent secret-bearing environment configuration from entering published browser artifacts.

#### Scenario: Secret is detected in build output
- **WHEN** a scanner detects a credential in the generated static tree
- **THEN** publication fails and the output is not retained as a promotable artifact

### Requirement: Deployed verification
Promotion MUST verify the published URLs, headers, registry selection, remote initialization, render behavior, and critical Playwright journey against the candidate environment.

#### Scenario: CDN serves a missing federated chunk
- **WHEN** deployed verification cannot fetch or render a selected remote
- **THEN** activation is blocked or the canary is automatically stopped

### Requirement: Evidence retention
The system SHALL retain source revision, build logs, test results, SBOM, provenance, signatures, policy results, and exact published digest for the audit and rollback retention period.

#### Scenario: Investigate a historical production incident
- **WHEN** an investigator selects the registry revision active during the incident
- **THEN** all release evidence for its host and applications can be resolved
