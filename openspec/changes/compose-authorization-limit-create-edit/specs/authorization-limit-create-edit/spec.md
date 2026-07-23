## ADDED Requirements

### Requirement: Explicit mutation capability
Create/edit UI SHALL render only when both principal and mutation service are supplied through one application-owned capability.

#### Scenario: Production bootstrap remains unconfigured
- **WHEN** Authorization Limits renders without the capability
- **THEN** list/details remain read-only and no mutation trigger is present

### Requirement: Entitled create composition
The list SHALL expose create only when policy allows it and SHALL submit validated profile, fixed USD currency, and bounded numeric limitation through the service port.

#### Scenario: Maker creates a limit
- **WHEN** an entitled user submits valid create values
- **THEN** one create command runs, the returned record is appended, the dialog closes, and local success feedback appears

### Requirement: Confirmed edit composition
Details SHALL expose edit only for a confirmed record when policy allows it and SHALL submit identity, changed limitation, and expected version.

#### Scenario: Maker edits confirmed limit
- **WHEN** an entitled user submits a changed limitation
- **THEN** one edit command runs and the returned record replaces the local detail/list record

### Requirement: Controlled validation
Profile and limitation SHALL be required, limitation SHALL remain between zero and 99,999,999,999, and invalid forms MUST NOT call the service.

#### Scenario: Create profile is blank
- **WHEN** submit is activated
- **THEN** associated inline validation is shown and no create command runs

### Requirement: Safe asynchronous lifecycle
While a request is pending, submission and dialog dismissal MUST be unavailable; a rejected request SHALL retain the form and show local categorized error feedback.

#### Scenario: Create service is unavailable
- **WHEN** the request rejects
- **THEN** the dialog remains open with an error alert and can be retried after loading ends

### Requirement: Deferred actions remain absent
Delete and all approve/reject actions MUST remain unavailable in this cohort.

#### Scenario: Checker views pending record
- **WHEN** mutation capability is present
- **THEN** no approve, reject, or delete trigger is rendered
