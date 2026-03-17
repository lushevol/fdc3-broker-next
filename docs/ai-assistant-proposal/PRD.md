User Requirements Document: AI Assistant & Tile Interoperability

## 1. Purpose

This platform is a centralized hub that hosts multiple tenant-owned web applications ("tiles").
The purpose of this initiative is to introduce an AI Assistant and workflow orchestration capability
that allows users to execute approved cross-tile business processes from natural language requests.

This product is intended for a financial platform used by bank operators. As a result:

- Security boundaries are strict.
- The assistant must operate only within registered, approved capabilities.
- Platform data must not be sent to the AI model.
- Auditability and PII controls are mandatory.

## 2. Product Goal

Enable an end user to describe a business task in natural language, have the platform translate that
request into a linear workflow of pre-registered tile actions, allow the user to review and amend the
workflow, and then execute the workflow with visible status and auditable results.

## 3. Users and Roles

### 3.1 End User

A bank operator or client user who signs into the platform and performs business operations across one
or more tiles.

### 3.2 Tile Manager

The owner or developer of a specific tenant tile who registers supported actions and integrates the
tile with the platform orchestration model.

### 3.3 Platform Administrator

An internal platform operator who manages the platform-level registry, governance, compliance controls,
and operational visibility.

## 4. Current State (As-Is)

The current platform supports manual execution only:

1. The end user signs in through SSO using OpenID-based authentication.
2. The platform shows tiles based on the user’s RBAC permissions.
3. The user opens a tile manually.
4. The user navigates that tile manually to complete their task.

There is currently no supported mechanism for AI-driven workflow planning or cross-tile orchestration.

## 5. In Scope and Out of Scope

### 5.1 In Scope for V1

- A collapsible AI chatbot side panel within the platform.
- Natural language requests for business tasks.
- AI-generated linear workflows only.
- Workflow generation using only registered tile actions.
- User review, parameter editing, and workflow regeneration before execution.
- Sequential execution of approved workflow nodes.
- Retry behavior only for actions marked as retryable.
- Real-time execution state visibility in the chatbot.
- Final result presentation in the chatbot.
- Audit logging of workflow planning, approval, execution state, and node input/output metadata.
- Strict RBAC enforcement during planning and execution.

### 5.2 Explicitly Out of Scope for V1

- Branching workflows
- Conditional logic
- Parallel execution
- Loops or repeated iteration
- Free-form access to tile UI content
- Free-form AI action generation outside the registry

### 5.3 Candidate Scope for V2

The following may be considered in a future phase:

- Branching workflows
- Conditional decision nodes
- Parallel execution
- More advanced recovery and compensation patterns

## 6. Core Product Principles

The product must follow these principles:

1. Registered actions only. The assistant may plan and execute only actions that were explicitly
   registered by tile managers.
2. No unrestricted tile access. The assistant must not freely inspect, scrape, infer from, or
   operate on arbitrary tile content.
3. Human approval required. No workflow may execute until the user explicitly approves it.
4. Clarify before acting. If user intent or required parameters are unclear, the assistant must ask
   follow-up questions before generating an executable workflow.
5. Security first. Planning and execution must remain within the user’s RBAC permissions.
6. No system data to AI. Platform or tile business data must not be sent to the AI model.
7. Full auditability. Workflow lifecycle events and relevant node input/output records must be
   auditable with PII-safe controls.

## 7. High-Level Future State (To-Be)

The desired future state is shown below:

```text
User Request
    |
    v
Chatbot Side Panel
    |
    v
Intent Analysis + Clarification Loop
    |
    v
Linear Workflow Plan
    |
    v
User Review / Edit / Regenerate / Approve
    |
    v
Platform Orchestrator
    |
    v
Platform APIs -> Registered Tile Actions
    |
    v
Node Results + State Updates + Audit Trail
    |
    v
Final Outcome in Chatbot
```

## 8. Functional Requirements

### 8.1 Tile Onboarding and Capability Registration

#### REQ-1.1 Capability Registry

The platform shall provide a centralized capability registry for tile managers to define and maintain
tile actions that can be used by the assistant and orchestration engine.

Acceptance criteria:

- Tile managers can create, update, and publish registered actions.
- The platform stores action metadata in a consistent machine-readable format.
- Only published actions are available for workflow generation and execution.

#### REQ-1.2 Registered Action Contract

Each registered action shall include, at minimum, the following metadata:

- Action name
- Human-readable description
- Owning tile identifier
- Version
- Input parameter schema
- Output schema
- Permission requirements
- Retryable flag
- Error response contract
- Timeout or execution expectation
- Action type classification indicating whether the action is read-only or mutating

Acceptance criteria:

- The assistant can discover and reason only over registered action contracts.
- The platform can validate workflow node inputs against the action schema before execution.
- The platform can determine whether retry behavior is allowed for a failed action.

#### REQ-1.3 Invocation Mechanism

The platform shall invoke registered tile actions through platform-exposed APIs.

Acceptance criteria:

- Tiles do not require free-form UI automation in order to participate in V1 workflows.
- The invocation contract is standardized across tiles.
- Tiles return a structured response payload defined by the registered output schema.

#### REQ-1.4 Onboarding Process

Tile managers shall be able to onboard a tile and publish its registered capabilities to the live
platform.

Acceptance criteria:

- A tile cannot participate in assistant workflows until onboarding is completed.
- Capability publication follows a controlled platform process.
- Published capabilities become discoverable to the assistant subject to RBAC.

### 8.2 AI Assistant Experience

#### REQ-2.1 Chatbot Placement and Visibility

The platform shall provide the AI Assistant as a side-panel chatbot UI that the user can open and hide.

Acceptance criteria:

- The side panel is available from the main platform shell.
- The user can expand, collapse, open, and close the assistant without leaving the current page.
- The assistant remains usable while the user is navigating the platform.

#### REQ-2.2 Natural Language Requests

The assistant shall accept natural language requests for business tasks.

Acceptance criteria:

- The user can submit a task request in plain language.
- The assistant can respond conversationally to gather missing information.

#### REQ-2.3 Clarification Before Planning

If the request is ambiguous, incomplete, or missing required inputs, the assistant shall ask follow-up
questions before producing an executable workflow.

Acceptance criteria:

- The assistant does not generate an executable workflow when required parameters are missing.
- The assistant can continue the conversation until required fields are resolved.
- The assistant can explain what information is still needed.

#### REQ-2.4 Registered-Action Planning Only

The assistant shall generate workflows only from registered actions that are accessible to the current
user under RBAC policy.

Acceptance criteria:

- The assistant cannot propose actions that are not registered.
- The assistant cannot propose actions the current user is not authorized to execute.
- The assistant cannot access tile content freely in order to invent actions.

#### REQ-2.5 Linear Workflow Generation

The assistant shall translate an eligible user request into a linear workflow made up of ordered nodes.

Each workflow node shall represent:

- One specific tile
- One specific registered action
- The node input parameters
- Expected output mapping

Acceptance criteria:

- V1 workflows are strictly sequential.
- The platform supports single-node and multi-node workflows.
- Output from one node can be mapped to input of the next node.

### 8.3 User Review, Editing, and Approval

#### REQ-3.1 Embedded Workflow Presentation

The assistant shall present the generated workflow inside the chatbot using an embedded workflow widget
implemented as a BPMN 2.0 visualization rendered with React Flow.

Acceptance criteria:

- The user can view the full workflow without leaving the chatbot panel.
- The workflow presentation shows node order and status-relevant details.
- The embedded workflow view uses BPMN 2.0 semantics for the supported V1 linear workflow model.
- The rendering implementation uses React Flow.

#### REQ-3.2 Node Inspection

The user shall be able to inspect each workflow node before approval.

Each node view shall show:

- Target tile
- Registered action
- Input parameters
- Expected output or downstream mapping
- Retryable status

Acceptance criteria:

- The user can open node details from the embedded workflow view.
- Node-level details are readable before execution starts.

#### REQ-3.3 User Editing and Regeneration

Before approval, the user shall be able to amend the workflow by editing parameters directly or by
asking the assistant to regenerate the workflow based on updated instructions.

Acceptance criteria:

- The user can modify parameters before execution.
- The user cannot add, remove, or reorder workflow nodes in V1.
- The assistant can regenerate the workflow after an amendment request.
- Regenerated workflows still obey registry and RBAC constraints.

#### REQ-3.4 Explicit Approval

The platform shall require explicit user approval before execution begins.

Acceptance criteria:

- No workflow execution starts without a user approval action in the UI.
- Approval is recorded in the audit trail.

### 8.4 Workflow Orchestration and Execution

#### REQ-4.1 Sequential Execution

The platform shall execute approved workflow nodes in the defined order.

Acceptance criteria:

- Node N+1 does not begin until node N has completed successfully or been handled according to policy.
- The execution engine preserves the approved order of operations.

#### REQ-4.2 Action Invocation

For each node, the platform shall invoke the corresponding registered tile action through the platform
API contract.

Acceptance criteria:

- Execution uses the published registered action definition.
- The platform validates node inputs before invocation.

#### REQ-4.3 Data Pass-Through

The platform shall capture the response from each completed node and pass mapped outputs into subsequent
node inputs when required by the workflow definition.

Acceptance criteria:

- Output-to-input mappings follow the registered schemas.
- Invalid mappings are detected before execution or at the relevant failure point.

#### REQ-4.4 Retry and Failure Handling

If a node fails, the platform shall retry only when that action is marked retryable. If the action is
not retryable, the platform shall stop the workflow and hand control back to the user.

Acceptance criteria:

- Retry is not attempted for non-retryable actions.
- Retryable actions are retried at most 3 times.
- Failed non-retryable nodes result in a stopped workflow state.
- The user is informed that manual intervention is required.

Note: Retry backoff strategy remains to be defined by engineering.

#### REQ-4.5 State Visibility

The platform shall provide real-time execution state visibility in the chatbot interface.

The system shall support, at minimum, these node states:

- Pending
- Running
- Completed
- Failed

Acceptance criteria:

- The user can see status changes as execution progresses.
- Node-level failures are identifiable.

#### REQ-4.6 Final Result

When the workflow completes or stops, the platform shall present the final outcome in the chatbot.

Acceptance criteria:

- Successful workflows display a completion result.
- Failed workflows display the failure point and current workflow outcome.

## 9. Security, Compliance, and Privacy Requirements

### REQ-5.1 RBAC Enforcement

The assistant shall enforce the same RBAC permissions used by the platform for manual tile access during
both planning and execution.

Acceptance criteria:

- Unauthorized actions are not proposed.
- Unauthorized actions are not executed even if referenced in user input.

### REQ-5.2 Registered Capability Boundary

The assistant shall be strictly limited to registered capabilities and shall not have unrestricted access
to tile content or controls.

Acceptance criteria:

- The assistant cannot inspect arbitrary tile content to discover capabilities.
- The assistant cannot operate outside the published action contract.

### REQ-5.3 Data Isolation from AI

No platform or tile business data shall be sent to the AI model.

Acceptance criteria:

- Workflow planning uses only allowed non-sensitive metadata and approved request context.
- Sensitive operational or customer data is excluded from model input.

### REQ-5.4 Logging and Audit Policy

Audit and logging mechanisms shall enforce the approved platform logging policy appropriate for a banking
environment.

Acceptance criteria:

- Logs are stored without redaction when captured as platform logs.
- Audit records are retained in a controlled and reviewable format.

## 10. Audit Requirements

Each workflow run shall capture, at minimum:

- Original user request
- Clarification exchanges relevant to workflow construction
- Generated workflow definition
- User approval event
- Node state transitions
- Node input metadata
- Node output metadata
- Final workflow result

Note: Logging and audit field policy must align with approved platform compliance controls.

## 11. Non-Functional Requirements

The product shall also meet the following non-functional expectations:

- Usability: the assistant must be understandable and operable within the existing platform shell.
- Accessibility: the chatbot side panel must meet platform accessibility standards.
- Reliability: the platform must clearly surface execution and failure state.
- Governance: only controlled, published capabilities may participate in orchestration.
- Observability: platform operators must be able to review workflow outcomes and failures.

## 12. Remaining Design Detail

The following items still require engineering definition, but not additional product-scope decisions:

1. What retry backoff strategy should be used across the maximum 3 retries for retryable actions?
2. What exact BPMN 2.0 element subset will be supported in V1 for linear workflows?
3. What React Flow component and styling standards will be used for the embedded workflow viewer?
