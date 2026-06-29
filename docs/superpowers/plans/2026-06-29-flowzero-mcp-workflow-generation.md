# Flowzero MCP Workflow Generation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan. Track progress by updating these checkboxes.

**Goal:** Natural-language workflow creation creates real Flowzero-owned workflow drafts through MCP, renders an actionable chatbot card, and opens the created workflow in Flowzero UI.

**Architecture:** Add a Flowzero service boundary at `services/flowzero-mcp-service`. The service owns workflow generation, persistence, REST endpoints for Flowzero UI, and MCP tools for AI integration. `chatbot-backend` discovers `flowzero-mcp` and invokes `generate_flowzero_workflow` through MCP only; chatbot must not call Flowzero REST endpoints directly.

**Ports and routes:**
- Flowzero MCP/REST service: `http://127.0.0.1:8092`
- MCP endpoint: `http://127.0.0.1:8092/api/mcp`
- Flowzero REST API proxied by root-config: `/api/flowzero/v1/** -> http://127.0.0.1:8092/api/flowzero/v1/**`
- Flowzero open route: `/flowzero/workflow-management/NewWorkflow/?workflowDetail=<encoded-json>&from=detail`

**Acceptance:** Five Chrome-verified chatbot prompts must create five workflows through live services, show five cards with `Open in Flowzero`, open a created workflow designer, and show the created workflows in Workflow Management.

## Global Constraints

- Chatbot code must not call `/api/flowzero/**` directly.
- Workflow creation result frames must include `source: "mcp"` and `providerId: "flowzero-mcp"`.
- The Flowzero card contract lives in `packages/chat-protocol-contract`.
- Use TDD for implementation tasks: write the failing test, run it red, implement, run green.
- Do not touch unrelated untracked artifacts.

## Task 1: Add Flowzero MCP Contract

**Files:**
- `packages/chat-protocol-contract/src/types.ts`
- `packages/chat-protocol-contract/src/schemas.ts`
- `packages/chat-protocol-contract/src/fixtures.ts`
- `packages/chat-protocol-contract/src/index.ts`
- `packages/chat-protocol-contract/test/validation.test.ts`

- [ ] Add failing tests in `validation.test.ts` for:
  - `flowzeroGeneratedWorkflowResultSchema` accepts a result with `workflowId`, `workflowName`, `summary`, `steps`, `workflowDetail`, and `open.route`.
  - schema rejects a result without `open.route`.
  - a tool-output frame fixture uses `source: "mcp"` and `providerId: "flowzero-mcp"`.
- [ ] Run red:
  ```bash
  cd packages/chat-protocol-contract && npm run test -- validation.test.ts
  ```
- [ ] Add constants in `types.ts`:
  ```ts
  export const FLOWZERO_MCP_PROVIDER_ID = 'flowzero-mcp' as const;
  export const FLOWZERO_GENERATE_WORKFLOW_TOOL = 'generate_flowzero_workflow' as const;
  ```
- [ ] Add `FlowzeroGeneratedWorkflowResult`:
  ```ts
  export type FlowzeroGeneratedWorkflowResult = {
    workflowId: string;
    workflowName: string;
    status?: string;
    version?: number;
    displayVersion?: number;
    businessArea?: string;
    countryCodes?: string[];
    ownerIds?: string[];
    description?: string;
    summary: string;
    steps: string[];
    workflowDetail: Record<string, unknown>;
    open: { label: string; route: string };
  };
  ```
- [ ] Add matching strict Zod schemas in `schemas.ts`; `steps` must have at least two items and `open.route` must be non-empty.
- [ ] Add `flowzeroGeneratedWorkflowFixture` and `flowzeroMcpToolFrameFixture` in `fixtures.ts`.
- [ ] Ensure `index.ts` exports the new types, schemas, and fixtures.
- [ ] Run green:
  ```bash
  cd packages/chat-protocol-contract && npm run test -- validation.test.ts && npm run build
  ```
- [ ] Commit:
  ```bash
  git add packages/chat-protocol-contract
  git commit -m "feat: add Flowzero MCP workflow contract"
  ```

## Task 2: Create Flowzero MCP Service With In-Memory Workflow Store

**Files to create:**
- `services/flowzero-mcp-service/package.json`
- `services/flowzero-mcp-service/pom.xml`
- `services/flowzero-mcp-service/src/main/resources/application.yml`
- `services/flowzero-mcp-service/src/main/java/com/fdc3/flowzeromcp/FlowzeroMcpApplication.java`
- `services/flowzero-mcp-service/src/main/java/com/fdc3/flowzeromcp/model/*.java`
- `services/flowzero-mcp-service/src/main/java/com/fdc3/flowzeromcp/repository/InMemoryWorkflowRepository.java`
- `services/flowzero-mcp-service/src/main/java/com/fdc3/flowzeromcp/service/FlowzeroBpmnBuilder.java`
- `services/flowzero-mcp-service/src/main/java/com/fdc3/flowzeromcp/service/FlowzeroWorkflowGenerationService.java`
- `services/flowzero-mcp-service/src/test/java/com/fdc3/flowzeromcp/service/FlowzeroWorkflowGenerationServiceTest.java`

- [ ] Write failing service tests proving:
  - a prompt with named workflow and steps creates a persisted workflow.
  - generated result contains encoded `open.route` for `NewWorkflow`.
  - repository page query returns the created workflow.
  - generated BPMN contains the requested step names.
- [ ] Run red:
  ```bash
  cd services/flowzero-mcp-service
  JAVA_HOME=/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home PATH=/opt/homebrew/opt/openjdk@21/bin:$PATH mvn test
  ```
- [ ] Implement the service following the existing `services/elasticsearch-mcp-service` Spring Boot 4 / Spring AI structure.
- [ ] Use Java records for request/result models:
  - `GenerateWorkflowRequest(String prompt, String workflowName, List<String> steps, String businessArea, List<String> countryCodes, List<String> ownerIds, String requestedBy)`
  - `WorkflowDetail(String id, String name, String status, int displayVersion, String description, String content)`
  - `GeneratedWorkflowResult(String workflowId, String workflowName, String status, int displayVersion, String businessArea, List<String> countryCodes, List<String> ownerIds, String description, String summary, List<String> steps, WorkflowDetail workflowDetail, OpenAction open)`
  - `WorkflowPageResult(List<WorkflowSummary> records, long total, int page, int size)`
- [ ] Generate ids with a deterministic local counter or ULID-like timestamp string; do not use a hard-coded id.
- [ ] Keep persistence in the service repository, not in chatbot or root-config mocks.
- [ ] Configure `application.yml`:
  ```yaml
  server:
    port: 8092
  spring:
    application:
      name: flowzero-mcp-service
    ai:
      mcp:
        server:
          name: flowzero-mcp-service
          version: 0.0.1
          type: SYNC
          protocol: STREAMABLE
          instructions: 'Creates and retrieves Flowzero workflow drafts'
          capabilities:
            tool: true
          streamable-http:
            mcp-endpoint: /api/mcp
  ```
- [ ] Add `package.json` scripts:
  ```json
  {
    "name": "flowzero-mcp-service",
    "version": "1.0.0",
    "scripts": {
      "build": "mvn -DskipTests clean package",
      "test": "mvn test",
      "dev": "env-cmd -f ../../.env.profile.${ACTIVE_ENV:-dev} mvn spring-boot:run -Dspring-boot.run.jvmArguments='-Dserver.port=8092'"
    }
  }
  ```
- [ ] Run green:
  ```bash
  cd services/flowzero-mcp-service
  JAVA_HOME=/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home PATH=/opt/homebrew/opt/openjdk@21/bin:$PATH mvn test
  ```
- [ ] Commit:
  ```bash
  git add services/flowzero-mcp-service
  git commit -m "feat: add Flowzero MCP workflow service"
  ```

## Task 3: Expose Flowzero MCP Tool and REST API

**Files:**
- `services/flowzero-mcp-service/src/main/java/com/fdc3/flowzeromcp/tool/FlowzeroWorkflowMcpTools.java`
- `services/flowzero-mcp-service/src/main/java/com/fdc3/flowzeromcp/controller/FlowzeroWorkflowController.java`
- `services/flowzero-mcp-service/src/test/java/com/fdc3/flowzeromcp/tool/FlowzeroWorkflowMcpToolsTest.java`
- `services/flowzero-mcp-service/src/test/java/com/fdc3/flowzeromcp/controller/FlowzeroWorkflowControllerTest.java`

- [ ] Write failing tests for:
  - MCP tool `generate_flowzero_workflow` returns the same contract shape as Task 1.
  - `POST /api/flowzero/v1/workflow/create` creates and returns the existing Flowzero response envelope: `{ code, message, data }`.
  - `GET /api/flowzero/v1/workflow/page` returns created workflows.
  - `GET /api/flowzero/v1/workflow/detail/{workflowId}` returns the created workflow detail.
- [ ] Run red:
  ```bash
  cd services/flowzero-mcp-service
  JAVA_HOME=/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home PATH=/opt/homebrew/opt/openjdk@21/bin:$PATH mvn -Dtest=FlowzeroWorkflowMcpToolsTest,FlowzeroWorkflowControllerTest test
  ```
- [ ] Implement `FlowzeroWorkflowMcpTools`:
  ```java
  @Service
  public class FlowzeroWorkflowMcpTools {
      private final FlowzeroWorkflowGenerationService service;

      public FlowzeroWorkflowMcpTools(FlowzeroWorkflowGenerationService service) {
          this.service = service;
      }

      @McpTool(name = "generate_flowzero_workflow", description = "Create a Flowzero workflow draft from natural-language workflow requirements.")
      public GeneratedWorkflowResult generateWorkflow(
          @McpToolParam(description = "Natural-language workflow requirements") String prompt,
          @McpToolParam(description = "Optional workflow name") String workflowName,
          @McpToolParam(description = "Optional ordered workflow steps") List<String> steps,
          @McpToolParam(description = "Optional requesting user id") String requestedBy
      ) {
          return service.generate(new GenerateWorkflowRequest(prompt, workflowName, steps, null, List.of(), List.of(), requestedBy));
      }
  }
  ```
- [ ] Implement `FlowzeroWorkflowController` with the three REST endpoints listed above.
- [ ] Run green:
  ```bash
  cd services/flowzero-mcp-service
  JAVA_HOME=/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home PATH=/opt/homebrew/opt/openjdk@21/bin:$PATH mvn test
  ```
- [ ] Commit:
  ```bash
  git add services/flowzero-mcp-service
  git commit -m "feat: expose Flowzero workflow MCP and REST APIs"
  ```

## Task 4: Wire Chatbot Backend to Flowzero MCP Provider

**Files:**
- `services/chatbot-backend/src/main/resources/application.yml`
- `services/chatbot-backend/src/main/java/com/fdc3/chatbot/tools/ToolRegistry.java`
- `services/chatbot-backend/src/main/java/com/fdc3/chatbot/agent/AgentService.java`
- Existing focused tests under `services/chatbot-backend/src/test/java/com/fdc3/chatbot/**`

- [ ] Write failing tests proving:
  - provider `flowzero-mcp` is loaded from config with `url=http://127.0.0.1:8092/api/mcp`.
  - when MCP exposes `generate_flowzero_workflow`, the MCP tool wins over the local duplicate.
  - Flowzero NL route produces a `ToolCall` using provider `flowzero-mcp` and source `mcp`.
  - no chatbot component invokes `/api/flowzero`.
- [ ] Run red with focused Maven tests.
- [ ] Add provider config:
  ```yaml
      - enabled: ${CHATBOT_MCP_FLOWZERO_ENABLED:false}
        provider-id: flowzero-mcp
        service-name: Flowzero MCP
        transport-type: STREAMABLE_HTTP
        url: ${CHATBOT_MCP_FLOWZERO_URL:http://127.0.0.1:8092/api/mcp}
        enabled-profiles:
          - default
          - advisor
        description: Creates and retrieves Flowzero workflow drafts through MCP.
  ```
- [ ] Add `CHATBOT_MCP_FLOWZERO_ENABLED` and `CHATBOT_MCP_FLOWZERO_URL` to `turbo.json` `globalEnv`.
- [ ] Update `ToolRegistry.resolveTools` so MCP provider `flowzero-mcp` overrides the local `generate_flowzero_workflow` descriptor. Keep existing local-first behavior for other duplicate tools.
- [ ] Update deterministic Flowzero routing in `AgentService` to call the registered MCP tool metadata and preserve `providerId`/`source` in streamed frames.
- [ ] Remove any direct Flowzero REST client usage from chatbot-backend if present.
- [ ] Run green:
  ```bash
  cd services/chatbot-backend
  JAVA_HOME=/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home PATH=/opt/homebrew/opt/openjdk@21/bin:$PATH mvn -Dtest=AgentServiceTest,ToolRegistryTest,McpBootstrapRegistrarTest,McpProviderRegistryServiceTest test
  ```
- [ ] Commit:
  ```bash
  git add services/chatbot-backend turbo.json
  git commit -m "feat: route Flowzero chatbot generation through MCP"
  ```

## Task 5: Render Flowzero Chatbot Tool Card

**Files:**
- `apps/base/src/components/ChatbotSidebarV2/toolkit/flowzero/workflow-generation/ui.tsx`
- `apps/base/src/components/ChatbotSidebarV2/toolkit/flowzero/workflow-generation/index.ts`
- `apps/base/src/components/ChatbotSidebarV2/toolkit/index.ts`
- `apps/base/src/components/ChatbotSidebarV2/index.tsx`
- `apps/base/src/components/ChatbotSidebarV2/toolkit/tests/tools.flowzero.test.tsx`

- [ ] Write failing UI tests proving:
  - `generate_flowzero_workflow` output renders a Flowzero-specific card.
  - the card displays workflow name, status, summary, and step count.
  - clicking `Open in Flowzero` calls the supplied open handler with `open.route`.
- [ ] Run red:
  ```bash
  cd apps/base
  npm test -- ChatbotSidebarV2/toolkit/tests/tools.flowzero.test.tsx
  ```
- [ ] Implement card using existing toolkit card helpers from `toolkit/compositor/ui-helpers.tsx`.
- [ ] Register the renderer for tool name `generate_flowzero_workflow`.
- [ ] In `ChatbotSidebarV2/index.tsx`, create `openFlowzeroWorkflow(route: string)` that:
  - calls `useFDC3WorkspaceHelper().workspaceOpenTile({ container: 'mfe-flowzero', module: 'flowzero', tile: 'workflow-management' })`;
  - dispatches `window.dispatchEvent(new CustomEvent('flowzero:navigate', { detail: { route } }))` after the tile opens.
- [ ] Pass `openFlowzeroWorkflow` into the runtime toolkit/card render context.
- [ ] Run green:
  ```bash
  cd apps/base
  npm test -- ChatbotSidebarV2/toolkit/tests/tools.flowzero.test.tsx
  ```
- [ ] Commit:
  ```bash
  git add apps/base
  git commit -m "feat: add Flowzero workflow chatbot card"
  ```

## Task 6: Let Flowzero UI Open Card Routes and Use the Service API

**Files:**
- `apps/mfe-flowzero/src/Root/routing/common/useController.ts`
- `apps/mfe-flowzero/src/api/index.ts`
- `apps/root-config/dev-server.ts`
- `package.json`

- [ ] Write failing tests or focused assertions for:
  - Flowzero root routing listens for `flowzero:navigate` and calls React Router `navigate(route)`.
  - Flowzero API base stays `/api/flowzero/v1`.
  - root-config proxy includes `/api/flowzero/v1`.
- [ ] Run red for the relevant base/flowzero tests.
- [ ] Update `apps/mfe-flowzero/src/Root/routing/common/useController.ts` to register:
  ```ts
  React.useEffect(() => {
    const handler = (event: Event) => {
      const route = (event as CustomEvent<{ route?: string }>).detail?.route;
      if (route?.startsWith('/flowzero/')) {
        navigate(route);
      }
    };
    window.addEventListener('flowzero:navigate', handler);
    return () => window.removeEventListener('flowzero:navigate', handler);
  }, [navigate]);
  ```
- [ ] Add root-config proxy entry:
  ```ts
  {
    context: ['/api/flowzero/v1'],
    target: 'http://127.0.0.1:8092',
    secure: false,
    changeOrigin: true,
  }
  ```
- [ ] Add root script:
  ```json
  "dev:flowzero-mcp": "npm --workspace services/flowzero-mcp-service run dev"
  ```
- [ ] Include `npm --workspace services/flowzero-mcp-service run dev` in `dev:services` and `dev:services:stub`.
- [ ] Run green for focused tests.
- [ ] Commit:
  ```bash
  git add apps/mfe-flowzero apps/root-config package.json
  git commit -m "feat: connect Flowzero UI to workflow service"
  ```

## Task 7: Add Live E2E Coverage for Five Use Cases

**Files:**
- `tests/e2e/flowzero-chatbot-workflow-generation.spec.ts`

- [ ] Write an E2E spec that:
  - logs in at `http://127.0.0.1:8001/?show_normal_login=Y`;
  - sends five unique prompts to the chatbot;
  - waits for five `generate_flowzero_workflow` cards;
  - clicks `Open in Flowzero` for the first result;
  - asserts the Flowzero designer route contains `/flowzero/workflow-management/NewWorkflow`;
  - returns to Workflow Management and asserts all five workflow names are visible.
- [ ] Prompts:
  - `Generate a Flowzero workflow named MCP Expense Approval <timestamp>: start, employee submits expense, manager approval, finance audit, payment release, end`
  - `Generate a Flowzero workflow named MCP Vendor Onboarding <timestamp>: start, collect vendor documents, sanctions screening, procurement approval, vendor setup, end`
  - `Generate a Flowzero workflow named MCP Access Request <timestamp>: start, requester submits access, line manager approval, application owner approval, provision access, end`
  - `Generate a Flowzero workflow named MCP Policy Exception <timestamp>: start, submit exception, compliance review, risk signoff, exception register update, end`
  - `Generate a Flowzero workflow named MCP Trade Break Review <timestamp>: start, identify trade break, operations investigation, front office review, resolution confirmation, end`
- [ ] Start live services:
  ```bash
  npm run stop
  npm run dev:ui
  npm run dev:flowzero-mcp
  CHATBOT_MCP_FLOWZERO_ENABLED=true CHATBOT_MCP_FLOWZERO_URL=http://127.0.0.1:8092/api/mcp npm --workspace services/chatbot-backend run dev
  ```
- [ ] Run red before the implementation is complete, then green after Tasks 1-6:
  ```bash
  npm run test:e2e -- tests/e2e/flowzero-chatbot-workflow-generation.spec.ts --headed
  ```
- [ ] Commit:
  ```bash
  git add tests/e2e/flowzero-chatbot-workflow-generation.spec.ts
  git commit -m "test: verify Flowzero MCP workflow generation e2e"
  ```

## Task 8: Final Live Chrome Verification and Push

- [ ] Run full focused verification:
  ```bash
  cd packages/chat-protocol-contract && npm run test && npm run build
  cd services/flowzero-mcp-service && JAVA_HOME=/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home PATH=/opt/homebrew/opt/openjdk@21/bin:$PATH mvn test
  cd services/chatbot-backend && JAVA_HOME=/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home PATH=/opt/homebrew/opt/openjdk@21/bin:$PATH mvn -Dtest=AgentServiceTest,ToolRegistryTest,McpBootstrapRegistrarTest,McpProviderRegistryServiceTest test
  cd apps/base && npm test -- ChatbotSidebarV2/toolkit/tests/tools.flowzero.test.tsx
  ```
- [ ] Use Chrome DevTools MCP against live services, not mocked responses:
  - confirm root-config, Flowzero MCP service, and chatbot-backend are running;
  - submit all five prompts;
  - confirm five cards;
  - open one workflow through the card;
  - confirm created workflows in Workflow Management grid;
  - confirm network/tool output shows `providerId: "flowzero-mcp"` and `source: "mcp"`.
- [ ] Search for forbidden direct calls:
  ```bash
  rg "/api/flowzero|flowzero/v1" services/chatbot-backend
  ```
  Expected: no chatbot-backend REST client usage.
- [ ] Check status, push:
  ```bash
  git status --short
  git log --oneline -5
  git push origin HEAD
  ```
