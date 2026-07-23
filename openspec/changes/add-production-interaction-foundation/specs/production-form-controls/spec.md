## ADDED Requirements

### Requirement: Controlled numeric value
NumberField SHALL accept a controlled `number | null` value and SHALL emit `number | null` changes without owning application form state.

#### Scenario: User clears a numeric field
- **WHEN** the user removes the complete input value
- **THEN** NumberField emits null and preserves its accessible label

### Requirement: Numeric constraints
NumberField SHALL support disabled, required, minimum, maximum, and step constraints using deterministic browser-accessible input semantics.

#### Scenario: Authorization limit has an upper bound
- **WHEN** an application supplies minimum zero and a maximum limit
- **THEN** the rendered numeric input exposes those constraints without embedding domain policy in the component

### Requirement: Validation feedback
NumberField MUST associate error or helper text with the input and MUST expose invalid state when application validation fails.

#### Scenario: Required amount is invalid
- **WHEN** the application supplies error state and explanatory copy
- **THEN** assistive technology can resolve the invalid input and its message

### Requirement: Restricted styling and formatting
NumberField MUST NOT expose `sx`, raw MUI slots, or domain currency/precision formatting as public API.

#### Scenario: Application needs currency display
- **WHEN** a domain requires USD formatting or decimal rounding
- **THEN** application/domain code transforms the controlled value outside NumberField

