## ADDED Requirements

### Requirement: Application-owned principal policy
The Cashflow application SHALL derive Authorization Limits decisions from an injected user identifier and permission set without importing legacy Ratan globals or UI libraries.

#### Scenario: Checker and maker permissions are both present
- **WHEN** a principal has both initiate and verify permissions
- **THEN** the compatibility role is Checker and decisions remain deterministic

### Requirement: Access and initiate decisions
View SHALL require the Authorization Limits access permission, while create SHALL require a non-Visitor initiate/verify role.

#### Scenario: Visitor has access only
- **WHEN** a principal has view access but neither initiate nor verify permission
- **THEN** they may view but cannot create, edit, or delete

### Requirement: Status-specific record actions
Confirmed records SHALL expose edit/delete to Maker or Checker; add/edit/delete pending records SHALL expose their matching confirm/reject pair only to Checker.

#### Scenario: Checker evaluates edit pending
- **WHEN** a Checker evaluates an `EDIT_PENDING` record updated by another user
- **THEN** approve-edit and reject-edit are allowed while unrelated actions are unavailable

### Requirement: Self-verification prevention
Checker verification actions MUST be denied when the principal user identifier equals record `updatedBy`.

#### Scenario: Checker submitted pending change
- **WHEN** the current Checker is the record's latest updater
- **THEN** both status-specific confirm and reject decisions are denied with self-verification reason

### Requirement: Explainable denial
Policy decisions SHALL carry stable reason codes for UI/tooltips and tests without containing presentation copy.

#### Scenario: Visitor evaluates confirmed edit
- **WHEN** a Visitor evaluates edit
- **THEN** the decision is denied with a missing-initiate reason
