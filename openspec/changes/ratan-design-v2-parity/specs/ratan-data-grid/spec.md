## ADDED Requirements

### Requirement: Implement the complete manifest-recorded data surface
Ratan SHALL implement Table, DataView, and every DataGrid feature recorded by the frozen manifest, including sorting, filtering, pagination, selection, editing, column operations, row operations, grouping, expansion, dragging, export, master/detail, overlapping views, and required virtualization.

#### Scenario: Stable release completeness is evaluated
- **WHEN** any in-scope DataGrid feature lacks contract and behavior evidence
- **THEN** stable `2.0.0` promotion SHALL be blocked

### Requirement: Own the public DataGrid contract
Public row, column, state, callback, trigger, and change-detail types MUST be Ratan-owned; TanStack Table and TanStack Virtual types and state shapes MUST remain private.

#### Scenario: A consumer imports DataGrid types
- **WHEN** TypeScript resolves the public subpath
- **THEN** no TanStack type SHALL be required in the consumer's source contract

### Requirement: Support controlled client and server modes
Every stateful feature SHALL support applicable controlled/uncontrolled forms, and server sorting, filtering, or pagination modes MUST NOT apply corresponding client transformations implicitly.

#### Scenario: Server sorting is enabled
- **WHEN** the user requests a new sort order
- **THEN** Ratan SHALL report the requested state and SHALL keep row transformation under application control

### Requirement: Distinguish loading and refreshing
`loading` SHALL represent no usable primary data, while `refreshing` SHALL retain stale data, communicate busy state, and remain visually and semantically distinct. The root API SHALL provide `loadingState`, `errorState`, and `emptyState` ReactNode surfaces.

#### Scenario: Existing rows refresh
- **WHEN** `refreshing` becomes true with existing data
- **THEN** rows SHALL remain visible and the grid SHALL expose the appropriate busy state

### Requirement: Bound large-data rendering
The agreed large-data fixture MUST use bounded row/column DOM rendering, sustain at least 55 FPS during scripted scrolling, keep p95 synchronous interaction work below 10 ms, and release observers/listeners after unmount.

#### Scenario: The benchmark grid unmounts
- **WHEN** the benchmark completes and the grid is removed
- **THEN** no grid-owned observer, listener, or scheduled work SHALL remain active

### Requirement: Exclude non-manifest spreadsheet features
Spreadsheet formulas, arbitrary merged cells beyond recorded spanning, pivot tables, full grid personalization, and complex cross-row validation MUST remain out of scope unless the frozen manifest proves support.

#### Scenario: A requested feature is absent from the manifest
- **WHEN** a feature request has no frozen parity evidence
- **THEN** it SHALL require a separate post-parity proposal rather than entering v2 scope

