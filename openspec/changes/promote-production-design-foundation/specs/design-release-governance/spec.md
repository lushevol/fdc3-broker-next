## ADDED Requirements

### Requirement: Production package identity and public surface

The design foundation SHALL use the `@fm/ratan-design` identity with semantic version `1.0.0` and SHALL publish only documented root and stylesheet exports.

#### Scenario: Consume packed package
- **WHEN** a temporary React/TypeScript project installs the packed artifact
- **THEN** documented components, provider, types, token metadata, and stylesheet imports resolve without source aliases

#### Scenario: Attempt undocumented import
- **WHEN** a consumer imports an internal source path
- **THEN** package exports prevent resolution

### Requirement: Semantic version governance

The production packages SHALL classify changes by contract impact and SHALL document migration requirements.

#### Scenario: Add optional component capability
- **WHEN** a release adds an optional prop, component, or token without changing existing semantics
- **THEN** it is eligible for a minor version

#### Scenario: Change semantic meaning
- **WHEN** a release removes or renames a public API/token or changes a token's semantic meaning
- **THEN** it requires a major version and migration guidance

### Requirement: Rolling contract compatibility

Hosts and independently deployed applications SHALL negotiate application and appearance contract versions rather than design package versions.

#### Scenario: Deploy different package minors
- **WHEN** host and application bundle different compatible design-package minor versions but share supported contract majors
- **THEN** the host may load the application

#### Scenario: Support previous contract major
- **WHEN** a future host claims support for the immediately previous contract major
- **THEN** an explicit adapter and automated compatibility suite MUST exist

### Requirement: Production verification gates

Every design-foundation release SHALL pass unit coverage, accessibility behavior, lint, type declarations, deterministic build, forbidden-dependency scan, and packed-consumer verification.

#### Scenario: Release candidate passes
- **WHEN** all required gates succeed against a clean build
- **THEN** the package is eligible for the host/application pilot

#### Scenario: Gate fails
- **WHEN** any required gate fails or generated artifacts drift
- **THEN** release promotion is blocked
