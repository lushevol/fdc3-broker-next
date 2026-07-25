## ADDED Requirements

### Requirement: Correlated workflow lifecycle
The workflow runtime SHALL emit an ordered lifecycle stream for each resolution with a stable run identifier, workflow identifier, sequence number, and timestamp.

#### Scenario: Successful workflow lifecycle
- **WHEN** a declared workflow executes successfully
- **THEN** the stream begins with `workflow.started`, includes lifecycle events for every node, and ends with `workflow.completed`

#### Scenario: Failed workflow lifecycle
- **WHEN** a non-continuable node fails
- **THEN** the stream includes `node.failed` followed by `workflow.failed` for the same run

### Requirement: Node observability
The workflow runtime SHALL identify the active workflow step and expose its input context and terminal result or error through node lifecycle events.

#### Scenario: Node succeeds
- **WHEN** an FDC3 intent handler returns a result
- **THEN** the runtime emits `node.completed` containing the step identifier and result

#### Scenario: Node fails
- **WHEN** intent routing, binding, or execution fails
- **THEN** the runtime emits `node.failed` containing the step identifier and a safe error message

### Requirement: Backward-compatible result access
The resolution SHALL execute a workflow at most once and SHALL return the same final transcript promise to all `getResult` callers while allowing event subscribers.

#### Scenario: Multiple result readers
- **WHEN** `getResult` is called more than once on one resolution
- **THEN** the underlying workflow steps execute once and every caller receives the same transcript

#### Scenario: Event subscriber
- **WHEN** a caller subscribes before execution events are dispatched
- **THEN** the caller receives the ordered lifecycle without changing the final transcript
