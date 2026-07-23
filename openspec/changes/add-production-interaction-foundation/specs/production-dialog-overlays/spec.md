## ADDED Requirements

### Requirement: Accessible modal composition
Dialog SHALL expose an accessible title, optional description, content, bounded actions, and configurable small/medium/large width.

#### Scenario: Mutation dialog opens
- **WHEN** an application opens a titled dialog
- **THEN** focus enters a modal dialog whose accessible name is the title

### Requirement: Keyboard and focus behavior
Dialog MUST trap focus while open, close on Escape or backdrop only when dismissible, and restore focus to the invoking control after close.

#### Scenario: Non-dismissible operation is pending
- **WHEN** a dialog is marked non-dismissible
- **THEN** Escape and backdrop do not invoke close while its explicit actions remain controlled by the application

### Requirement: Confirmation interaction
ConfirmationDialog SHALL provide confirm/cancel actions, default or danger confirmation tone, disabled/loading state, and application-owned callbacks.

#### Scenario: Confirm record deletion
- **WHEN** the user activates a danger confirmation
- **THEN** the application callback runs once and the dialog stays open or closes according to application state

### Requirement: Loading safety
ConfirmationDialog MUST disable both confirm and cancel dismissal while loading and MUST expose progress in the confirm label.

#### Scenario: Delete request is pending
- **WHEN** loading becomes true
- **THEN** repeat confirmation, cancel, Escape, and backdrop dismissal are unavailable

### Requirement: Presentation is not authorization
Dialog and ConfirmationDialog MUST NOT implement roles, entitlements, maker/checker rules, service calls, or global overlay state.

#### Scenario: Checker action is unavailable
- **WHEN** application policy denies an approval
- **THEN** the application omits or disables the trigger before any confirmation dialog is opened

