## ADDED Requirements

### Requirement: Semantic appearance tokens
The design-system POC SHALL expose prefixed semantic CSS custom properties for light and dark schemes and compact and comfortable density without requiring host-specific selectors.

#### Scenario: Light scheme tokens
- **WHEN** a design provider renders with the light scheme
- **THEN** its subtree SHALL receive the light semantic surface, content, action, border, status, and focus values

#### Scenario: Density tokens
- **WHEN** a design provider changes from compact to comfortable density
- **THEN** shared interactive controls SHALL use the corresponding control-size and spacing values

### Requirement: Local MUI and Emotion provider
The design-system POC SHALL create a local MUI theme from an appearance snapshot and SHALL NOT require a React context supplied by the portal host.

#### Scenario: Independently rendered provider
- **WHEN** an application renders the provider with a valid appearance snapshot outside the portal host
- **THEN** shared components SHALL render with the requested scheme and density

### Requirement: Shared foundational components
The design-system POC SHALL provide bounded `Button`, `TextField`, and `StatusBadge` APIs implemented with MUI and semantic tokens.

#### Scenario: Shared form and action controls
- **WHEN** a consumer renders a labelled text field and primary button
- **THEN** both controls SHALL use the active design scheme and density and preserve accessible labels and native interaction behavior

#### Scenario: Shared semantic status
- **WHEN** a consumer renders ready, review, or blocked status
- **THEN** the badge SHALL expose readable status text and the corresponding semantic status treatment

### Requirement: Visible keyboard focus
All interactive POC design components SHALL provide a visible `:focus-visible` treatment derived from the semantic focus token.

#### Scenario: Keyboard focuses a shared button
- **WHEN** a keyboard user moves focus to a shared button
- **THEN** a visible focus indicator SHALL be rendered without relying on the browser outline being globally suppressed

### Requirement: Build-time-only delivery
The design-system POC SHALL be consumed as a normal workspace package bundled into host and application builds and SHALL NOT be registered as a Module Federation remote.

#### Scenario: Cashflow application loads
- **WHEN** the host loads the Cashflow remote
- **THEN** no design-system or Ratan container remote manifest SHALL be requested
