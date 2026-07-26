## ADDED Requirements

### Requirement: Distributable orchestration runtime
The platform SHALL provide a framework-neutral package that executes validated, declarative FDC3 workflows through an injected FDC3 intent client without requiring React or a specific desktop container.

#### Scenario: Execute a declared workflow
- **WHEN** a consumer creates an orchestrator with workflow definitions and an FDC3 intent client
- **THEN** it can list, inspect, preflight, and execute those workflows while receiving ordered lifecycle events and a typed transcript

#### Scenario: Invalid workflow definition
- **WHEN** a definition has duplicate step identifiers, an invalid binding, or no steps
- **THEN** orchestrator construction fails with a precise validation error before any intent is raised

### Requirement: Capability readiness preflight
The orchestrator SHALL distinguish app-directory declaration from live handler readiness when a runtime capability inspector is supplied.

#### Scenario: Intent declared without a live handler
- **WHEN** a target tile advertises a step intent but the inspector reports that no runtime listener is registered
- **THEN** preflight and execution return `HANDLER_NOT_REGISTERED` without raising that intent

#### Scenario: No inspector is available
- **WHEN** a consumer uses a standard FDC3 agent that cannot inspect listeners
- **THEN** execution proceeds portably and classifies an empty intent result as `HANDLER_NO_RESULT`

### Requirement: Bounded and recoverable execution
Every workflow step SHALL support bounded result waiting, optional retry policy, cancellation, and explicit continue-on-error behavior.

#### Scenario: Handler never resolves
- **WHEN** a handler exceeds its step or run timeout
- **THEN** the node fails with `RESULT_TIMEOUT`, pending work is stopped, and the workflow reaches a terminal state

#### Scenario: Transient delivery failure
- **WHEN** a configured retryable failure occurs and attempts remain
- **THEN** the runtime emits `node.retrying` and retries without duplicating completed downstream work

#### Scenario: Caller cancels
- **WHEN** the execution abort signal is triggered
- **THEN** the runtime emits `workflow.cancelled` and returns a cancelled transcript without starting another node

#### Scenario: Event observer fails
- **WHEN** one progress observer throws
- **THEN** workflow execution and other observers continue, and the observer failure is sent to the diagnostic hook

### Requirement: Structured exception model
Expected routing, handler, binding, result, timeout, cancellation, and validation failures SHALL be represented by stable machine-readable codes, safe messages, workflow and step identifiers, and recovery hints.

#### Scenario: Handler throws
- **WHEN** an intent handler rejects
- **THEN** the transcript contains `INTENT_EXECUTION_FAILED` and does not expose an unsafe raw object or stack trace

#### Scenario: Result is invalid
- **WHEN** a step result is missing or fails its configured validator
- **THEN** the runtime returns `HANDLER_NO_RESULT` or `RESULT_INVALID` and identifies the failed step

### Requirement: AI-agent toolkit
The package SHALL expose framework-neutral JSON-schema tools for listing workflows, inspecting readiness, and running a workflow.

#### Scenario: Agent discovers workflows
- **WHEN** an agent invokes the list or inspect tool
- **THEN** it receives deterministic, JSON-serializable workflow metadata, input schemas, step capabilities, and readiness information

#### Scenario: Agent runs a workflow
- **WHEN** an agent invokes the run tool with a workflow identifier and input
- **THEN** it receives a non-throwing result envelope containing success state, transcript, structured failures, and suggested recovery actions

#### Scenario: Agent consumes progress
- **WHEN** the host supplies an agent progress callback
- **THEN** ordered workflow events are forwarded as JSON-serializable progress updates
