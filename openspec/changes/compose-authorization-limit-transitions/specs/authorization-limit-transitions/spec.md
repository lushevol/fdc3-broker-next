## ADDED Requirements

### Requirement: Policy-derived details actions
Details SHALL render only the actions allowed by the injected policy for the current status and principal.

#### Scenario: Other-user edit is pending for Checker
- **WHEN** a Checker views an `EDIT_PENDING` record last updated by another user
- **THEN** Approve Edit and Reject Edit are present while edit/delete/unrelated actions are absent

### Requirement: Confirmed delete
An entitled confirmed-record delete SHALL require danger confirmation and invoke remove with identity and expected version.

#### Scenario: Maker confirms delete
- **WHEN** a Maker confirms deletion of a confirmed record
- **THEN** one remove command runs and the application refreshes records from the service

### Requirement: Status-specific confirm and reject
Add/edit/delete pending actions SHALL invoke confirm or reject with identity, current pending status, and expected version.

#### Scenario: Checker rejects pending edit
- **WHEN** Reject Edit is confirmed
- **THEN** one reject command runs with `EDIT_PENDING` and the application refreshes records

### Requirement: Safe confirmation semantics
Reject/delete MUST require an explicit trigger and confirmation; dismissing a dialog MUST NOT execute an alternative domain operation.

#### Scenario: User cancels reject confirmation
- **WHEN** Cancel is activated
- **THEN** the dialog closes and neither confirm nor reject service method runs

### Requirement: Transition reconciliation and feedback
Successful operations SHALL replace local rows from service list and show local success feedback; failures SHALL retain the confirmation with local error feedback and allow retry.

#### Scenario: Approved delete removes record
- **WHEN** confirm succeeds and refreshed list omits the current record
- **THEN** details render the existing not-found recovery without stale data

### Requirement: Loading repeat prevention
While transition work is pending, confirm, cancel, close, Escape, and backdrop MUST be unavailable.

#### Scenario: Confirm request is pending
- **WHEN** the user attempts repeated confirmation
- **THEN** the service command executes once
