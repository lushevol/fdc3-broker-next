# Specification: Layout Analysis

## ADDED Requirements

### Requirement: Identify grid system

The system SHALL analyze the HTML structure to identify the grid system used and document its configuration.

#### Scenario: AntD grid detection

- **WHEN** the HTML contains `ant-row` and `ant-col-*` classes
- **THEN** the grid system is identified as AntD 24-column grid with documented column spans

#### Scenario: MUI Grid detection

- **WHEN** the HTML contains `MuiGrid-*` classes
- **THEN** the grid system is identified as MUI Grid with documented breakpoints

#### Scenario: Responsive breakpoint documentation

- **WHEN** grid classes include responsive variants (e.g., `ant-col-md-6`)
- **THEN** all breakpoints are documented with their pixel values

### Requirement: Extract typography hierarchy

The system SHALL identify and document the typography hierarchy used in the application.

#### Scenario: MUI typography detection

- **WHEN** the HTML contains `MuiTypography-h1` through `MuiTypography-h6` classes
- **THEN** the typography hierarchy is documented with heading levels

#### Scenario: AntD typography detection

- **WHEN** the HTML contains AntD typography classes
- **THEN** the typography patterns are documented

#### Scenario: Font size documentation

- **WHEN** typography classes are identified
- **THEN** corresponding font sizes and weights are extracted from associated styles

### Requirement: Identify spacing patterns

The system SHALL identify and document the spacing rhythm used throughout the application.

#### Scenario: MuiBox spacing detection

- **WHEN** the HTML contains `MuiBox-root` with padding/margin classes
- **THEN** spacing increments (e.g., 8px, 16px) are documented

#### Scenario: AntD spacing detection

- **WHEN** the HTML contains AntD spacing classes
- **THEN** spacing patterns are documented

#### Scenario: Consistent spacing identification

- **WHEN** multiple elements use consistent spacing values
- **THEN** the base spacing unit is identified (e.g., "8px base unit")

### Requirement: Output layout intent document

The system SHALL generate a technical summary document describing the layout logic.

#### Scenario: Layout intent generation

- **WHEN** the layout analysis completes
- **THEN** a `layout_intent.md` file is created with the technical summary

#### Scenario: Grid system documentation

- **WHEN** the layout intent document is generated
- **THEN** it includes the grid system type, columns, and breakpoints

#### Scenario: Typography documentation

- **WHEN** the layout intent document is generated
- **THEN** it includes the typography hierarchy from H1 to H6

#### Scenario: Spacing documentation

- **WHEN** the layout intent document is generated
- **THEN** it includes the identified spacing rhythm and base units

### Requirement: Provide migration guidance

The system SHALL include guidance for mapping the identified patterns to a target design system.

#### Scenario: Component mapping suggestions

- **WHEN** a component pattern is identified
- **THEN** the output includes suggested target component names

#### Scenario: Class translation table

- **WHEN** the analysis identifies source classes
- **THEN** a translation table maps source classes to target design system equivalents
