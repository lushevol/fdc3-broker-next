## ADDED Requirements

### Requirement: Authoritative semantic tokens

The production design package SHALL define one typed semantic token source and SHALL generate scoped `--ratan-*` CSS variables for light and dark schemes and compact and comfortable density.

#### Scenario: Generate token artifacts
- **WHEN** the token generator runs against the authoritative source
- **THEN** it produces deterministic CSS grouped by semantic role
- **AND** a drift test fails when the checked-in artifact differs

#### Scenario: Render independent schemes
- **WHEN** separate provider roots use light and dark schemes
- **THEN** each root resolves its own semantic surface, content, border, action, status, and focus tokens
- **AND** neither root requires document-global theme attributes

### Requirement: Local provider contract

The package SHALL expose a local MUI/Emotion provider accepting resolved scheme, density, and direction without requiring a host React context.

#### Scenario: Render independent application root
- **WHEN** an application renders the provider with a valid appearance
- **THEN** the provider applies scoped theme/density attributes, direction, semantic variables, and a matching MUI theme

#### Scenario: Update provider appearance
- **WHEN** a consumer changes scheme or density
- **THEN** the same provider root updates its attributes and component defaults without remounting application state

### Requirement: Bounded foundational components

The package SHALL expose Button, TextField, and StatusBadge through domain-neutral semantic APIs and SHALL NOT re-export raw MUI components or arbitrary styling escape hatches.

#### Scenario: Render shared controls
- **WHEN** a consumer uses the production Button and TextField
- **THEN** the controls provide labels, variants, disabled behavior, density, and change events through the bounded API

#### Scenario: Render financial status semantics
- **WHEN** a consumer renders ready, review, blocked, or neutral status
- **THEN** StatusBadge uses semantic content and surface tokens in both schemes

### Requirement: Accessibility foundations

All foundational interactive components SHALL expose visible keyboard focus and SHALL preserve accessible names and control semantics.

#### Scenario: Keyboard focus shared button
- **WHEN** keyboard navigation focuses a shared button
- **THEN** a non-transparent focus indicator with at least two CSS pixels of width is visible

#### Scenario: Label shared text field
- **WHEN** a TextField is rendered with an id and label
- **THEN** assistive technology resolves the label to its input

### Requirement: Build-time-only production delivery

The production design package SHALL be consumed as a versioned build dependency and SHALL contain no federation, legacy loader, domain, Ant Design, or AG Grid dependency.

#### Scenario: Inspect production package
- **WHEN** dependency and packed-artifact checks run
- **THEN** no Module Federation, Single-SPA, SystemJS, import-map loader, Ant Design, AG Grid, or Ratan domain package is present
- **AND** the package resolves JavaScript, declarations, and CSS from its declared exports
