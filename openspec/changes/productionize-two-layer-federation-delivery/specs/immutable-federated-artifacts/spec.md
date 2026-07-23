## ADDED Requirements

### Requirement: Build-once artifact identity
The delivery system SHALL produce each host or application release once and identify it by application name, semantic version, source revision, build ID, and content digest.

#### Scenario: Promote an identical application
- **WHEN** a tested application release is promoted from DEV to a later environment
- **THEN** the later environment references the same content digest without rebuilding the application

#### Scenario: Reject a mutated release path
- **WHEN** published bytes at an existing versioned path no longer match the recorded digest
- **THEN** release verification fails and the artifact cannot be promoted

### Requirement: Immutable static publication
The delivery system MUST publish host and application assets to version-specific immutable paths and MUST NOT use mutable aliases such as `latest` in an active registry entry.

#### Scenario: Publish two application versions
- **WHEN** a second Cashflow version is released
- **THEN** both versions remain independently addressable and the earlier version is not overwritten

### Requirement: Static and OCI delivery equivalence
The delivery system SHALL support CDN/object-storage publication and MAY use OCI for transport or mandatory static-serving deployment, while preserving the same immutable artifact identity and bytes.

#### Scenario: Deliver an OCI-packaged remote
- **WHEN** infrastructure policy requires an OCI image or artifact
- **THEN** the browser-served static tree matches the signed release digest and is served without runtime dependency installation

### Requirement: Environment-independent frontend output
Frontend artifacts MUST NOT contain secrets or require environment-specific rebuilds; public environment configuration SHALL be supplied through runtime host or registry configuration.

#### Scenario: Promote to a new environment
- **WHEN** a release is activated in an environment with different public endpoints
- **THEN** runtime configuration supplies those endpoints and the application artifact digest remains unchanged

### Requirement: Production cache behavior
The delivery system SHALL apply long immutable caching to hashed assets, versioned federation entries/manifests, and immutable registry revisions, while host HTML and active registry pointers SHALL revalidate.

#### Scenario: Verify immutable asset headers
- **WHEN** a client requests a versioned hashed application asset
- **THEN** the response includes a long-lived immutable cache policy

#### Scenario: Roll back without purging assets
- **WHEN** the active registry is rolled back
- **THEN** only the active pointer changes and no immutable application asset requires overwrite or purge

### Requirement: Trusted browser delivery
The production delivery layer MUST use TLS, approved origins, explicit CORS policy, and a CSP compatible only with authorized remote origins.

#### Scenario: Registry references an unauthorized origin
- **WHEN** a candidate registry includes a remote URL outside the approved origin policy
- **THEN** promotion is rejected before activation
