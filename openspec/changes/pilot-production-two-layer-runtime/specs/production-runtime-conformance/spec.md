## ADDED Requirements

### Requirement: Production package-only consumption
The pilot host and application MUST consume `@fm/platform-contracts`, `@fm/platform-sdk`, and `@fm/ratan-design` through public package exports and MUST NOT import any `*-poc` source or package.

#### Scenario: Scan workspace dependencies and imports
- **WHEN** conformance tests inspect both workspaces
- **THEN** every shared contract, SDK, and UI import resolves to a production package public API

### Requirement: Forbidden legacy runtime boundary
The pilot MUST reject Single-SPA, SystemJS, import-map loaders, `@fm/base`, `mfe-ratan-container`, and legacy Ratan runtime dependencies.

#### Scenario: Legacy dependency is introduced
- **WHEN** a forbidden dependency or import appears in either pilot workspace
- **THEN** the conformance gate fails before build acceptance

### Requirement: Minimal federation singleton policy
The federation configuration SHALL share React and ReactDOM as strict singletons and SHALL NOT register the design system, MUI, or Emotion as federation runtime services.

#### Scenario: Inspect federation sharing
- **WHEN** conformance tests evaluate host and remote configuration
- **THEN** only the approved React runtime singleton boundary is present

### Requirement: Scoped styling boundary
Application and design-system styles MUST remain scoped to their owned provider/application roots, while document reset and shell layout remain host-owned.

#### Scenario: Inspect application CSS
- **WHEN** conformance tests scan Cashflow and design-system styles
- **THEN** they contain no document-global `html`, `body`, or universal reset ownership

### Requirement: End-to-end production pilot gate
Acceptance SHALL require unit tests, lint, type/build output, forbidden-boundary scans, and a browser journey against independently served host and remote builds.

#### Scenario: Verify the two-layer journey
- **WHEN** the production pilot acceptance command runs
- **THEN** it proves registry bootstrap, remote open, domain interaction, live appearance, nested routing, close/reopen state, and failure containment

