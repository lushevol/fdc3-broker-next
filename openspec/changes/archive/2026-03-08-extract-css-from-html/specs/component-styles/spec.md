# Spec: Component Styles

## ADDED Requirements

### Requirement: Extract Ant Design component styles

The extracted `antd.css` file SHALL contain all Ant Design component styles from the source HTML.

#### Scenario: Extract ant-prefixed selectors

- **WHEN** the source CSS contains selectors prefixed with `.ant-`
- **THEN** all matching rules SHALL be included in antd.css
- **AND** the full selector specificity SHALL be preserved

#### Scenario: Extract CSS hash scoped styles

- **WHEN** the source CSS contains `:where(.css-<hash>)` selectors
- **THEN** these rules SHALL be included in antd.css
- **AND** the hash values SHALL be preserved unchanged

#### Scenario: Preserve Ant Design component states

- **WHEN** Ant Design styles include pseudo-classes (`:hover`, `:focus`, `:disabled`)
- **THEN** all state styles SHALL be preserved
- **AND** pseudo-class order SHALL be maintained

### Requirement: Extract MUI component styles

The extracted `mui.css` file SHALL contain all MUI (Material-UI) component styles from the source HTML.

#### Scenario: Extract Mui-prefixed selectors

- **WHEN** the source CSS contains selectors prefixed with `.Mui`
- **THEN** all matching rules SHALL be included in mui.css
- **AND** the full selector specificity SHALL be preserved

#### Scenario: Extract emotion hash classes

- **WHEN** the source CSS contains emotion-generated hash classes (`.css-<hash>`)
- **THEN** these rules SHALL be analyzed to determine if they are MUI-related
- **AND** MUI-related hash classes SHALL be included in mui.css

#### Scenario: Preserve MUI component states

- **WHEN** MUI styles include pseudo-classes and animation states
- **THEN** all state and animation styles SHALL be preserved

### Requirement: Extract custom component styles

The extracted `components.css` file SHALL contain all custom MicroWebUI component styles from the source HTML.

#### Scenario: Extract MicroWebUI selectors

- **WHEN** the source CSS contains selectors matching `.MicroWebUI_*`
- **THEN** all matching rules SHALL be included in components.css

#### Scenario: Extract application-specific styles

- **WHEN** the source CSS contains styles for custom application components
- **THEN** these rules SHALL be included in components.css
- **AND** the component hierarchy SHALL be preserved in selector ordering

### Requirement: Preserve component style interactions

Component style files SHALL maintain correct cascade behavior.

#### Scenario: Maintain selector specificity

- **WHEN** multiple rules target the same element
- **THEN** the original specificity order SHALL be preserved
- **AND** no style conflicts SHALL be introduced by reorganization

#### Scenario: Maintain media query associations

- **WHEN** component styles include `@media` queries
- **THEN** the media queries SHALL be preserved with their associated rules
- **AND** the media query conditions SHALL remain unchanged

### Requirement: Generate utilities for uncategorized styles

The extracted `utilities.css` file SHALL contain all styles that do not fit other categories.

#### Scenario: Capture uncategorized selectors

- **WHEN** a CSS rule does not match any predefined category pattern
- **THEN** the rule SHALL be included in utilities.css

#### Scenario: Log uncategorized selectors for review

- **WHEN** rules are placed in utilities.css
- **THEN** the extraction tool SHALL log these selectors
- **AND** provide a count of uncategorized rules
