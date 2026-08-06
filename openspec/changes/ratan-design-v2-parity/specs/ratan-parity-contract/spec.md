## ADDED Requirements

### Requirement: Freeze the parity baseline
The system SHALL use `@scdevkit/webkit@2.0.5` at commit `a8398ea6df30e4843e22fcb5a1d3343107463c60` as a one-time visual and behavioral baseline.

#### Scenario: Later WebKit changes are published
- **WHEN** WebKit changes after the pinned commit
- **THEN** the Ratan contract SHALL remain unchanged until a separately approved change updates it

### Requirement: Classify the complete catalogue
The parity manifest MUST classify every public WebKit export and registered element as included, supporting-only, or excluded with rationale, and MUST contain no unresolved entries before component implementation scales.

#### Scenario: An export lacks a classification
- **WHEN** manifest validation finds an unclassified or unresolved public export
- **THEN** the foundation gate SHALL fail

### Requirement: Map every legacy capability
Every included component MUST map observed properties, attributes, defaults, variants, states, events, slots, methods, tokens, themes, modes, fixtures, and imperative behavior to a React API or approved deviation.

#### Scenario: A legacy event has no React mapping
- **WHEN** contract validation finds an included custom event without a callback or approved deviation
- **THEN** the component SHALL remain incomplete

### Requirement: Resolve conflicting evidence deterministically
Conflicting evidence SHALL be resolved in the order runtime behavior, tests/converters/defaults/source, current application usage, Storybook, then written documentation.

#### Scenario: Storybook differs from runtime
- **WHEN** a Storybook example conflicts with the pinned runtime fixture
- **THEN** the runtime behavior SHALL define parity and the resolution SHALL be recorded

### Requirement: Govern intentional deviations
Any correction to an accessibility, performance, security, or interaction defect MUST be recorded in the deviation manifest with its evidence, rationale, approval, and tests.

#### Scenario: A legacy defect is corrected
- **WHEN** Ratan intentionally behaves differently from WebKit
- **THEN** the parity result SHALL link to an approved deviation record and dedicated regression tests
