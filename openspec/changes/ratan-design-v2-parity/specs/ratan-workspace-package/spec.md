## ADDED Requirements

### Requirement: Enforce the workspace hierarchy
The repository MUST separate runnable apps, private implementation/configuration packages, the public React facade, migration artifacts, manifests, and tooling according to the approved dependency hierarchy.

#### Scenario: A private package imports an app or public facade
- **WHEN** dependency-boundary validation detects a reverse import or cycle
- **THEN** the build SHALL fail

### Requirement: Publish one package
`packages/react` SHALL be the only published workspace and SHALL release as `@fm/ratan-design`; every other Ratan workspace MUST be private and have no independent semantic version.

#### Scenario: A packed release is inspected
- **WHEN** the `@fm/ratan-design` tarball is built
- **THEN** it SHALL contain no unresolved private workspace dependency

### Requirement: Provide explicit tree-shakable exports
The package SHALL provide ESM, TypeScript declarations, common root exports, per-component subpaths, `/data-grid`, `/icons`, `/tokens`, `/testing`, CSS/theme/mode subpaths, and parity/migration JSON subpaths with correct CSS side-effect metadata.

#### Scenario: A consumer imports Button only
- **WHEN** a packed consumer imports `@fm/ratan-design/button`
- **THEN** unrelated component code and DataGrid SHALL NOT enter the consumer bundle

### Requirement: Support the React peer range
React and ReactDOM MUST be peer dependencies supporting versions 18.2 through 19 and MUST be the only shared federation singletons required by Ratan.

#### Scenario: Independent micro-frontends use compatible Ratan versions
- **WHEN** they mount in the same document with shared React peers
- **THEN** one micro-frontend SHALL NOT substitute another's Ratan implementation

### Requirement: Exclude prohibited production dependencies
The public package MUST NOT depend at runtime on WebKit, Lit, Shoelace, Emotion, MUI, Ant Design, a Ratan provider/runtime, or external asset services.

#### Scenario: Dependency validation finds a prohibited package
- **WHEN** a prohibited dependency enters the production graph
- **THEN** package promotion SHALL fail

