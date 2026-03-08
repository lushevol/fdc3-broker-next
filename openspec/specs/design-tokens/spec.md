# Spec: Design Tokens

## ADDED Requirements

### Requirement: Extract CSS custom properties

The extracted tokens CSS file SHALL contain all CSS custom properties (variables) from the source HTML.

#### Scenario: Extract root-level custom properties

- **WHEN** the source CSS contains `:root { --property: value; }` declarations
- **THEN** the tokens.css file SHALL include all custom property definitions
- **AND** the `:root` selector SHALL be preserved

#### Scenario: Preserve custom property values

- **WHEN** custom properties are extracted
- **THEN** all values (colors, spacing, typography) SHALL be preserved exactly as defined
- **AND** no value transformation SHALL occur

### Requirement: Extract animation keyframes

The extracted tokens CSS file SHALL contain all `@keyframes` definitions.

#### Scenario: Extract keyframe animations

- **WHEN** the source CSS contains `@keyframes <name> { ... }` declarations
- **THEN** the tokens.css file SHALL include all keyframe definitions
- **AND** animation names SHALL be preserved unchanged

### Requirement: Extract base CSS resets and charset

The extracted tokens CSS file SHALL contain base CSS definitions.

#### Scenario: Extract charset declarations

- **WHEN** the source CSS contains `@charset "utf-8";`
- **THEN** the tokens.css file SHALL include the charset declaration at the top

#### Scenario: Extract global resets

- **WHEN** the source CSS contains global reset rules (e.g., `* { box-sizing: border-box; }`)
- **THEN** the tokens.css file SHALL include these rules
- **AND** the cascade order SHALL be preserved

### Requirement: Document extracted tokens

The tokens.css file SHALL be structured for readability.

#### Scenario: Organize tokens by type

- **WHEN** the tokens.css file is generated
- **THEN** custom properties SHALL be grouped by type where identifiable:
  - Colors
  - Typography
  - Spacing
  - Transitions/animations
- **AND** comments SHALL separate major sections

### Requirement: Maintain zero runtime dependencies

The generated tokens.css file SHALL be usable without any build step or dependencies.

#### Scenario: Use tokens directly in browser

- **WHEN** a browser loads tokens.css
- **THEN** all CSS custom properties SHALL be available for use in other stylesheets
- **AND** no preprocessing or compilation SHALL be required
