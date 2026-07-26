## ADDED Requirements

### Requirement: Workflow process view
The orchestrator UI SHALL display the sample workflow as connected ordered nodes and SHALL distinguish pending, running, completed, and failed states.

#### Scenario: Initial process view
- **WHEN** the orchestrator tile opens before a run
- **THEN** all three capability nodes are visible in pending state with their connection order

#### Scenario: Live execution
- **WHEN** node lifecycle events arrive
- **THEN** the corresponding mini processor updates its status, elapsed activity, and latest message without replacing the canvas

### Requirement: User-controlled execution
The orchestrator UI SHALL let a user start the declared sample workflow and prevent duplicate starts while a run is active.

#### Scenario: Start workflow
- **WHEN** the user activates `Run workflow`
- **THEN** the UI invokes the declared workflow with the configured trade input and presents live progress

#### Scenario: Active workflow
- **WHEN** a workflow is running
- **THEN** the run control is disabled until the run reaches a terminal state

### Requirement: Result inspection
The orchestrator UI SHALL expose structured node outputs and a consolidated final result.

#### Scenario: Select completed node
- **WHEN** the user selects a completed mini processor
- **THEN** the detail panel displays that node's output and an action to open its full tile

#### Scenario: Workflow completes
- **WHEN** the final node completes
- **THEN** the UI displays a successful run summary including the discovered trade, price, and risk classification

### Requirement: Accessible responsive presentation
The orchestrator UI SHALL remain usable in constrained tile dimensions, support keyboard interaction, expose accessible names, and honor reduced-motion preferences.

#### Scenario: Narrow tile
- **WHEN** the orchestrator is rendered below the wide canvas breakpoint
- **THEN** the process rail becomes vertically scrollable without overlapping node content

#### Scenario: Keyboard operation
- **WHEN** a keyboard user navigates the process
- **THEN** run controls and processor selection expose visible focus and descriptive accessible names
