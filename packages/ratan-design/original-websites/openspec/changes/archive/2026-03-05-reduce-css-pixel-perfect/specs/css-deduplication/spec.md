## ADDED Requirements

### Requirement: Duplicate CSS rule detection

The system SHALL identify duplicate CSS rules across all `<style>` blocks in the HTML file.

#### Scenario: Detect identical CSS rules

- **WHEN** the system parses all `<style>` blocks
- **THEN** it SHALL identify rules with identical selector and declaration combinations

#### Scenario: Normalize whitespace before comparison

- **WHEN** comparing CSS rules for duplication
- **THEN** the system SHALL normalize whitespace to ensure `color:red` and `color: red` are treated as identical

### Requirement: CSS rule deduplication

The system SHALL remove duplicate CSS rules while preserving the first occurrence.

#### Scenario: Keep first occurrence

- **WHEN** duplicate CSS rules are found
- **THEN** the system SHALL retain the first occurrence and remove all subsequent duplicates

#### Scenario: Preserve cascade order

- **WHEN** deduplicating CSS rules
- **THEN** the system SHALL NOT change the order of remaining rules

### Requirement: CSS variable preservation

The system SHALL preserve all CSS custom property definitions.

#### Scenario: Never remove CSS variables

- **WHEN** a CSS rule defines a custom property (e.g., `--base-color-blue: #39a1cd`)
- **THEN** the system SHALL NOT remove it even if it appears duplicated

### Requirement: Keyframes deduplication

The system SHALL deduplicate `@keyframes` rules by name.

#### Scenario: Handle keyframes by name

- **WHEN** multiple `@keyframes` rules have the same name
- **THEN** the system SHALL keep the first occurrence and remove duplicates

### Requirement: Computed style verification

The system SHALL verify that all DOM elements retain identical computed styles after deduplication.

#### Scenario: Verify computed styles match

- **WHEN** CSS deduplication is complete
- **THEN** the system SHALL compare computed styles of all elements between original and reduced HTML
- **AND** all computed styles MUST be 100% identical

#### Scenario: Verification failure handling

- **WHEN** any computed style differs from the baseline
- **THEN** the system SHALL report the specific element and property that differs
- **AND** the system SHALL NOT output the reduced file
