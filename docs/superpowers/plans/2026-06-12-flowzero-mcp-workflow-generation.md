# FlowZero MCP Workflow Generation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expose FlowZero workflow draft generation through an MCP tool without adding any LLM dependency to FlowZero.

**Architecture:** Add a deterministic workflow generator inside `services/flowzero-designer-service`, then expose it with Spring AI MCP annotations. The generator converts natural-language prompts into a simple FlowZero draft containing nodes, edges, BPMN XML, summary, and warnings.

**Tech Stack:** Java 17, Spring Boot 3.3.7, Spring AI MCP server WebMVC, JUnit 5, AssertJ.

---

### Task 1: Deterministic Workflow Draft Model and Generator

**Files:**
- Create: `services/flowzero-designer-service/src/main/java/com/scb/ratan/flowzero/designer/ai/model/FlowzeroWorkflowDraftRequest.java`
- Create: `services/flowzero-designer-service/src/main/java/com/scb/ratan/flowzero/designer/ai/model/FlowzeroWorkflowDraftResponse.java`
- Create: `services/flowzero-designer-service/src/main/java/com/scb/ratan/flowzero/designer/ai/service/FlowzeroWorkflowDraftGenerator.java`
- Test: `services/flowzero-designer-service/src/test/java/com/scb/ratan/flowzero/designer/ai/service/FlowzeroWorkflowDraftGeneratorTest.java`

- [x] **Step 1: Write failing tests**

Create tests for linear approval workflow generation, blank prompt rejection, and unsupported prompt warnings.

- [x] **Step 2: Run tests to verify RED**

Run: `cd services/flowzero-designer-service && mvn test -Dtest=FlowzeroWorkflowDraftGeneratorTest`

Expected: compile failure because the model and generator do not exist. Actual local result: blocked before compile because `mvn` is unavailable on PATH.

- [x] **Step 3: Implement minimal generator**

Create immutable request/response records and a generator that:
- normalizes the prompt
- extracts task names from comma/arrow/then-separated phrases
- maps start/end phrases to start and end event nodes
- maps all other phrases to user task nodes
- creates sequential edges
- emits BPMN XML with process, start event, user tasks, end event, sequence flows, and diagram bounds
- returns a warning when the prompt has too little structure

- [x] **Step 4: Run tests to verify GREEN**

Run: `cd services/flowzero-designer-service && mvn test -Dtest=FlowzeroWorkflowDraftGeneratorTest`

Expected: all tests pass. Actual E2E harness result: copied the FlowZero AI package into `/tmp/flowzero-mcp-e2e`, compiled with Java 17 and Spring AI 1.0.3, and passed 4 tests with 0 failures.

### Task 2: MCP Tool Exposure

**Files:**
- Modify: `services/flowzero-designer-service/pom.xml`
- Modify: `services/flowzero-designer-service/src/main/resources/application.yml`
- Create: `services/flowzero-designer-service/src/main/java/com/scb/ratan/flowzero/designer/ai/tool/FlowzeroWorkflowMcpTools.java`
- Test: `services/flowzero-designer-service/src/test/java/com/scb/ratan/flowzero/designer/ai/tool/FlowzeroWorkflowMcpToolsTest.java`

- [x] **Step 1: Write failing tool tests**

Create tests that call `generateFlowzeroWorkflow` and assert the response delegates to the generator and includes nodes, edges, BPMN XML, summary, and warnings.

- [x] **Step 2: Run tests to verify RED**

Run: `cd services/flowzero-designer-service && mvn test -Dtest=FlowzeroWorkflowMcpToolsTest`

Expected: compile failure because the MCP tool class does not exist. Actual local result: blocked before compile because `mvn` is unavailable on PATH.

- [x] **Step 3: Add MCP dependency and tool**

Import the Spring AI 1.0.3 BOM, add `spring-ai-starter-mcp-server-webmvc`, configure `spring.ai.mcp.server`, and create `FlowzeroWorkflowMcpTools` with `@Tool(name = "generate_flowzero_workflow")` plus `MethodToolCallbackProvider`.

- [x] **Step 4: Run targeted tests**

Run: `cd services/flowzero-designer-service && mvn test -Dtest=FlowzeroWorkflowDraftGeneratorTest,FlowzeroWorkflowMcpToolsTest`

Expected: all targeted tests pass. Actual E2E harness result: `generate_flowzero_workflow` registered as one MCP tool and returned workflow nodes, edges, BPMN XML, summary, and warnings over the live MCP SSE transport.

### Task 3: Verification

**Files:**
- No new files.

- [ ] **Step 1: Run service test suite**

Run: `cd services/flowzero-designer-service && mvn test`

Expected: tests pass. Actual local result: blocked because `com.scb.ratan:ratanone-dependencies:6.7.2` is private and not resolvable from Maven Central in this environment.

- [ ] **Step 2: Inspect git diff**

Run: `git diff -- services/flowzero-designer-service docs/superpowers/plans/2026-06-12-flowzero-mcp-workflow-generation.md`

Expected: only FlowZero MCP generation files and the plan are changed.
