# Task 2 Report: Create Flowzero MCP Service With In-Memory Workflow Store

## Status

DONE

## Scope Delivered

Implemented `services/flowzero-mcp-service` as a new Spring Boot 4 / Spring AI MCP service boundary with:

- Maven and npm workspace scaffolding aligned to `services/elasticsearch-mcp-service`
- `application.yml` configured exactly per brief for port `8092` and MCP streamable HTTP endpoint `/api/mcp`
- Java record models for:
  - `GenerateWorkflowRequest`
  - `WorkflowDetail`
  - `GeneratedWorkflowResult`
  - `WorkflowPageResult`
- Supporting `OpenAction`, `WorkflowSummary`, and `StoredWorkflow` records
- `InMemoryWorkflowRepository` with deterministic local counter ids (`wf-000001`, etc.)
- `FlowzeroBpmnBuilder` that deterministically emits BPMN XML containing requested step names
- `FlowzeroWorkflowGenerationService` that:
  - persists generated workflows in-memory
  - returns Flowzero route payloads for `NewWorkflow`
  - exposes paged workflow summaries from the repository

Write scope stayed inside `services/flowzero-mcp-service`, plus this requested report file.

## TDD Evidence

### RED

Command:

```bash
cd services/flowzero-mcp-service
JAVA_HOME=/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home PATH=/opt/homebrew/opt/openjdk@21/bin:$PATH mvn test
```

Observed failure:

- test compile failed because `com.fdc3.flowzeromcp.model` and `com.fdc3.flowzeromcp.repository` classes did not exist yet
- this established the service boundary and model/repository behavior were not implemented before the tests

Representative errors:

```text
package com.fdc3.flowzeromcp.model does not exist
package com.fdc3.flowzeromcp.repository does not exist
```

### GREEN

Same command after implementation:

```bash
cd services/flowzero-mcp-service
JAVA_HOME=/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home PATH=/opt/homebrew/opt/openjdk@21/bin:$PATH mvn test
```

Observed success:

```text
Tests run: 2, Failures: 0, Errors: 0, Skipped: 0
BUILD SUCCESS
```

## Tests Implemented

`services/flowzero-mcp-service/src/test/java/com/fdc3/flowzeromcp/service/FlowzeroWorkflowGenerationServiceTest.java`

Verified:

1. A prompt with named workflow and explicit steps creates a persisted workflow draft
2. The generated result contains an encoded Flowzero `open.route` for `NewWorkflow`
3. Repository page query returns the created workflow
4. Generated BPMN contains the requested step names

## Files Created

- `services/flowzero-mcp-service/package.json`
- `services/flowzero-mcp-service/pom.xml`
- `services/flowzero-mcp-service/src/main/resources/application.yml`
- `services/flowzero-mcp-service/src/main/java/com/fdc3/flowzeromcp/FlowzeroMcpApplication.java`
- `services/flowzero-mcp-service/src/main/java/com/fdc3/flowzeromcp/model/GenerateWorkflowRequest.java`
- `services/flowzero-mcp-service/src/main/java/com/fdc3/flowzeromcp/model/WorkflowDetail.java`
- `services/flowzero-mcp-service/src/main/java/com/fdc3/flowzeromcp/model/OpenAction.java`
- `services/flowzero-mcp-service/src/main/java/com/fdc3/flowzeromcp/model/GeneratedWorkflowResult.java`
- `services/flowzero-mcp-service/src/main/java/com/fdc3/flowzeromcp/model/WorkflowSummary.java`
- `services/flowzero-mcp-service/src/main/java/com/fdc3/flowzeromcp/model/WorkflowPageResult.java`
- `services/flowzero-mcp-service/src/main/java/com/fdc3/flowzeromcp/model/StoredWorkflow.java`
- `services/flowzero-mcp-service/src/main/java/com/fdc3/flowzeromcp/repository/InMemoryWorkflowRepository.java`
- `services/flowzero-mcp-service/src/main/java/com/fdc3/flowzeromcp/service/FlowzeroBpmnBuilder.java`
- `services/flowzero-mcp-service/src/main/java/com/fdc3/flowzeromcp/service/FlowzeroWorkflowGenerationService.java`
- `services/flowzero-mcp-service/src/test/java/com/fdc3/flowzeromcp/service/FlowzeroWorkflowGenerationServiceTest.java`

## Notes

- The task brief’s requested service boundary is in place.
- Chatbot-side MCP frame metadata (`source: "mcp"`, `providerId: "flowzero-mcp"`) was intentionally not implemented here because that belongs outside the allowed write scope and is covered by later tasks.
- No unrelated files were modified.

## Task 2 Fix: MCP and REST Boundary Completion

### Reviewer Findings Addressed

1. Added `FlowzeroWorkflowMcpTools` with exported `@McpTool(name = "generate_flowzero_workflow")`
2. Added REST endpoints backed by the same in-memory repository:
   - `POST /api/flowzero/v1/workflow/create`
   - `GET /api/flowzero/v1/workflow/page`
   - `GET /api/flowzero/v1/workflow/detail/{workflowId}`

### Additional TDD Evidence

#### RED

Command:

```bash
cd services/flowzero-mcp-service
JAVA_HOME=/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home PATH=/opt/homebrew/opt/openjdk@21/bin:$PATH mvn -Dtest=FlowzeroWorkflowMcpToolsTest,FlowzeroWorkflowControllerTest test
```

Observed failure:

- test compile failed because the MCP tool class, REST controller, and create request DTO did not exist yet

Representative errors:

```text
cannot find symbol class FlowzeroWorkflowController
cannot find symbol class CreateWorkflowApiRequest
cannot find symbol class FlowzeroWorkflowMcpTools
```

#### GREEN

Targeted command after implementation:

```bash
cd services/flowzero-mcp-service
JAVA_HOME=/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home PATH=/opt/homebrew/opt/openjdk@21/bin:$PATH mvn -Dtest=FlowzeroWorkflowMcpToolsTest,FlowzeroWorkflowControllerTest test
```

Observed success:

```text
Tests run: 2, Failures: 0, Errors: 0, Skipped: 0
BUILD SUCCESS
```

Full verification command:

```bash
cd services/flowzero-mcp-service
JAVA_HOME=/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home PATH=/opt/homebrew/opt/openjdk@21/bin:$PATH mvn test
```

Observed success:

```text
Tests run: 4, Failures: 0, Errors: 0, Skipped: 0
BUILD SUCCESS
```

### Files Added For Fix

- `services/flowzero-mcp-service/src/main/java/com/fdc3/flowzeromcp/tool/FlowzeroWorkflowMcpTools.java`
- `services/flowzero-mcp-service/src/main/java/com/fdc3/flowzeromcp/controller/CreateWorkflowApiRequest.java`
- `services/flowzero-mcp-service/src/main/java/com/fdc3/flowzeromcp/controller/FlowzeroApiResponse.java`
- `services/flowzero-mcp-service/src/main/java/com/fdc3/flowzeromcp/controller/FlowzeroWorkflowController.java`
- `services/flowzero-mcp-service/src/main/java/com/fdc3/flowzeromcp/controller/FlowzeroWorkflowPageResponse.java`
- `services/flowzero-mcp-service/src/test/java/com/fdc3/flowzeromcp/tool/FlowzeroWorkflowMcpToolsTest.java`
- `services/flowzero-mcp-service/src/test/java/com/fdc3/flowzeromcp/controller/FlowzeroWorkflowControllerTest.java`

### Files Updated For Fix

- `services/flowzero-mcp-service/src/main/java/com/fdc3/flowzeromcp/repository/InMemoryWorkflowRepository.java`
- `services/flowzero-mcp-service/src/main/java/com/fdc3/flowzeromcp/service/FlowzeroWorkflowGenerationService.java`
