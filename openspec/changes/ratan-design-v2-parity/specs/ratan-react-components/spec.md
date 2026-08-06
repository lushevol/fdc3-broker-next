## ADDED Requirements

### Requirement: Use React Aria interaction primitives
Every interactive component MUST use the applicable React Aria Component or hook for interaction behavior. A hand-written alternative MUST have an approved ADR, manifest rationale, and dedicated keyboard/focus tests.

#### Scenario: An applicable component lacks React Aria usage
- **WHEN** boundary validation finds custom press, focus, collection, selection, overlay, date, or keyboard-navigation infrastructure without an exception
- **THEN** the component SHALL fail promotion

### Requirement: Expose idiomatic complete React APIs
Public components SHALL use native attributes, forwarded refs, controlled/uncontrolled state, React callbacks, Ratan-owned reason details, compound composition where necessary, and complete legacy mappings without leaking Web Component or foundation types.

#### Scenario: A consumer controls component state
- **WHEN** the value/open/selection prop and callback are supplied
- **THEN** the component SHALL render the controlled state and report changes without mutating it internally

### Requirement: Preserve variants and defaults
Every manifest-recorded variant, tone, size, compact flag, state, and default MUST be implemented or linked to an approved deviation; reduced or invented variant sets are prohibited.

#### Scenario: A legacy default is omitted by the consumer
- **WHEN** the React component renders without the mapped prop
- **THEN** its behavior and appearance SHALL match the frozen legacy default

### Requirement: Participate in native forms
Applicable controls SHALL support native submission, reset, required validation, disabled exclusion, read-only behavior, accessible validation relationships, and controlled/uncontrolled operation without requiring a form library.

#### Scenario: An uncontrolled form is reset
- **WHEN** the owner form resets
- **THEN** the control SHALL return to its default value and update its accessible state

### Requirement: Preserve accessible loading behavior
Button and other applicable actions SHALL remain mounted while loading, preserve layout, prevent repeated activation, retain focus where possible, show progress, and announce a localized `loadingLabel`.

#### Scenario: A button enters loading state
- **WHEN** `loading` changes from false to true
- **THEN** activation SHALL be blocked and the loading label SHALL be announced without removing focus

### Requirement: Meet component accessibility contracts
Applicable components MUST pass keyboard, focus-visible, focus restoration, screen-reader, high-contrast, 200-percent zoom, reduced-motion, disabled/read-only/loading, and native-form tests.

#### Scenario: A component cohort is promoted
- **WHEN** automated or required manual accessibility evidence is missing
- **THEN** promotion SHALL be blocked
