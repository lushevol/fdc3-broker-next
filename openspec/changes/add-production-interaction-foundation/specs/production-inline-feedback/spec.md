## ADDED Requirements

### Requirement: Semantic feedback tones
InlineAlert SHALL support information, success, warning, and error tones with consistent semantic styling and live-region roles appropriate to urgency.

#### Scenario: Repository load fails
- **WHEN** an error InlineAlert renders
- **THEN** it is announced as an alert with semantic error colors

### Requirement: Structured feedback content
InlineAlert SHALL support an optional title, message content, and one optional labeled action callback.

#### Scenario: Failed request can retry
- **WHEN** an application supplies a Retry action
- **THEN** the labeled control invokes the callback without the design component owning request state

### Requirement: Local ownership
InlineAlert MUST remain an application-composed local component and MUST NOT create a global singleton, queue, portal manager, or cross-MFE event bus.

#### Scenario: Two applications render feedback
- **WHEN** independent application roots each render InlineAlert
- **THEN** their state and lifecycle remain isolated

