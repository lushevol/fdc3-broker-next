# AI Chatbot Control Plane Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the current chatbot into a simple governed control plane that can understand workspace context, plan a read-only MCP action, present reviewable execution steps, and execute approved actions front to back.

**Architecture:** Implement the control-plane model incrementally inside the existing chatbot stack rather than introducing several new deployables at once. Keep `apps/base` as the chat presentation and workspace-context producer, keep `services/chatbot-backend` as the initial in-process agent, file-backed capability registry, policy boundary, and execution orchestrator, and integrate existing FDC3 and MCP seams before extracting separate services only if scale or ownership pressure justifies it.

**Tech Stack:** React 18, TypeScript, assistant-ui, Jest, Spring Boot, Java, LangChain4j, SSE, FDC3, MCP

---

## Scope Recommendation

Start with an MVP vertical slice instead of the whole PRD in one pass.

Recommended MVP:

- attach bounded workspace context to chat requests
- resolve a unified capability view per request from a static JSON capability file
- generate minimal ordered `fdc3` and `mcp` execution plans
- apply in-process policy decisions: `allow`, `review_required`, `deny`
- render governed execution plans and status updates in the assistant thread
- execute one real MCP-backed read-only service path

Defer until proven necessary:

- a separately deployed Policy Service
- a capability registry endpoint
- a generic workflow DSL
- autonomous multi-step background agents
- dynamic capability registration
- governed FDC3 execution in the first slice
- app-provided UX hints beyond bounded structured context

## Delivery Phases

### Phase 0: Lock The Contract

**Outcome:** The PRD is translated into repo-owned contracts and bounded MVP decisions.

**Files:**

- Review: `docs/prd/ai-chatbot-agent.md`
- Review: `openspec/changes/align-chatbot-control-plane-architecture/specs/chatbot-control-plane/spec.md`
- Review: `openspec/changes/align-chatbot-control-plane-architecture/specs/chatbot-backend/spec.md`
- Review: `openspec/changes/align-chatbot-control-plane-architecture/specs/chatbot-sidebar/spec.md`
- Modify: `openspec/changes/align-chatbot-control-plane-architecture/tasks.md`

- [ ] Confirm the MVP excludes standalone policy and registry services for the first cut.
- [ ] Confirm the first governed flow is read-only MCP.
- [ ] Confirm which tenant app and which MCP provider are the first production participants.
- [ ] Record that every MCP mutation requires approval, even though mutations are out of the first slice.
- [ ] Update OpenSpec tasks so they reflect the chosen MVP slice and explicit deferrals.

### Phase 1: Define Shared Control-Plane Models

**Outcome:** Frontend and backend share a stable vocabulary for planning and execution status.

**Files:**

- Create: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/controlplane/model/ResolvedCapability.java`
- Create: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/controlplane/model/ExecutionPlan.java`
- Create: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/controlplane/model/ExecutionStep.java`
- Create: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/controlplane/model/PolicyDecision.java`
- Create: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/controlplane/model/WorkspaceContextSnapshot.java`
- Create: `apps/base/src/components/ChatbotSidebar/controlPlane/types.ts`
- Modify: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/model/ChatRequest.java`
- Test: `services/chatbot-backend/src/test/java/com/fdc3/chatbot/controller/ChatControllerTest.java`
- Test: `apps/base/src/components/ChatbotSidebar/__tests__/common.interface.test.ts`

- [ ] Add backend request models for workspace snapshot, plan steps, and policy outcomes.
- [ ] Add frontend TypeScript types that mirror the governed SSE payloads.
- [ ] Extend `ChatRequest` with explicit workspace context rather than overloading `toolContext`.
- [ ] Add tests that reject malformed control-plane payloads and preserve backward compatibility.

### Phase 2: Build File-Backed Request-Scoped Capability Resolution

**Outcome:** Each chat turn gets one normalized capability view combining static JSON capability declarations, local tools, frontend tool manifests, FDC3 affordances, and allowed MCP providers.

**Files:**

- Create: `services/chatbot-backend/src/main/resources/capabilities/control-plane-capabilities.json`
- Create: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/controlplane/CapabilityRegistryService.java`
- Create: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/controlplane/CapabilityResolver.java`
- Modify: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/tool/ToolRegistry.java`
- Modify: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/mcp/McpProviderRegistryService.java`
- Modify: `services/chatbot-backend/src/main/resources/application.yml`
- Modify: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/security/UserCapabilityContextResolver.java`
- Test: `services/chatbot-backend/src/test/java/com/fdc3/chatbot/tool/McpProviderRegistryServiceTest.java`
- Test: `services/chatbot-backend/src/test/java/com/fdc3/chatbot/controlplane/CapabilityRegistryServiceTest.java`
- Test: `services/chatbot-backend/src/test/java/com/fdc3/chatbot/service/ChatServiceTest.java`

- [ ] Define one static JSON file for capability metadata, including FDC3 navigation targets, MCP read capabilities, tenant scope, required inputs, and risk class.
- [ ] Normalize local backend tools, MCP tools, and FDC3 navigation targets into one resolved capability structure.
- [ ] Make resolution request-scoped so user claims, tenant context, workspace context, and runtime registrations can affect the result.
- [ ] Add cache keys and invalidation for user profile changes and static capability-file reloads.
- [ ] Keep the first implementation in process inside `chatbot-backend`; do not build a separate registry endpoint yet.

### Phase 3: Introduce An In-Process Policy Boundary

**Outcome:** Planning is separated from authorization, but still lives in one deployable for the MVP.

**Files:**

- Create: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/controlplane/policy/PolicyEvaluator.java`
- Create: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/controlplane/policy/PolicyRuleSet.java`
- Modify: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/security/UserCapabilityContextResolver.java`
- Modify: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/agent/AgentService.java`
- Test: `services/chatbot-backend/src/test/java/com/fdc3/chatbot/agent/AgentServiceTest.java`

- [ ] Return `allow`, `review_required`, or `deny` per step.
- [ ] Enforce tenant scope and user entitlement checks before execution.
- [ ] Mark every MCP mutation as `review_required` regardless of other risk classification.
- [ ] Allow navigation-only FDC3 and MCP read actions to execute without approval unless denied by tenant or entitlement checks.
- [ ] Surface explicit denial reasons so the UI can explain blocked execution.

### Phase 4: Teach The Agent To Produce Minimal Ordered Plans

**Outcome:** The assistant can decide when a turn needs no execution or a single read-only MCP plan.

**Files:**

- Create: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/controlplane/planning/ExecutionPlanner.java`
- Create: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/controlplane/planning/PlanExplanationBuilder.java`
- Modify: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/agent/AgentService.java`
- Modify: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/service/ChatService.java`
- Test: `services/chatbot-backend/src/test/java/com/fdc3/chatbot/agent/AgentServiceTest.java`
- Test: `services/chatbot-backend/src/test/java/com/fdc3/chatbot/service/ChatServiceTest.java`

- [ ] Preserve plain conversational turns without forcing plan creation.
- [ ] For action turns in the first slice, produce ordered `mcp` steps with summaries, targets, inputs, and current status.
- [ ] Feed the resolved capability view and policy metadata into the planner rather than letting the LLM invent arbitrary actions.
- [ ] Restrict the first slice to read-only MCP capabilities.
- [ ] Keep the planner minimal; avoid introducing a generic workflow language.

### Phase 5: Extend The SSE Contract For Governed Execution

**Outcome:** The UI can show plan, review, and execution status inline in the assistant thread.

**Files:**

- Create: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/model/ExecutionPlanEvent.java`
- Modify: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/controller/ChatController.java`
- Modify: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/service/ChatService.java`
- Modify: `apps/base/src/components/ChatbotSidebar/adapters/types.ts`
- Modify: `apps/base/src/components/ChatbotSidebar/adapters/sseToAssistantUi.ts`
- Test: `services/chatbot-backend/src/test/java/com/fdc3/chatbot/controller/ChatControllerTest.java`
- Test: `apps/base/src/components/ChatbotSidebar/__tests__/sseAdapter.types.test.ts`
- Test: `apps/base/src/components/ChatbotSidebar/__tests__/fetchSSE.test.ts`

- [ ] Emit plan review and step lifecycle payloads without breaking existing `message`, `tool_call`, `tool_result`, `generative_ui`, and `done` events.
- [ ] Correlate all plan events to the assistant turn that produced them.
- [ ] Preserve cancellation and disconnect behavior for in-flight streams.
- [ ] Keep backward compatibility for older clients where possible.

### Phase 6: Send Workspace Context From The Frontend

**Outcome:** The backend can reason about the active workspace and tile state at request time.

**Files:**

- Modify: `apps/base/src/components/ChatbotSidebar/AssistantUIRuntimeProvider.tsx`
- Create: `apps/base/src/components/ChatbotSidebar/controlPlane/buildWorkspaceContextSnapshot.ts`
- Modify: `apps/base/src/hooks/workspace/useWorkspace.ts`
- Modify: `apps/base/src/hooks/model/workspaces.ts`
- Test: `apps/base/src/components/ChatbotSidebar/__tests__/AssistantUIRuntimeProvider.test.tsx`

- [ ] Build a bounded workspace snapshot from current workspace, active tile, and relevant app identifiers.
- [ ] Attach that snapshot to every chat request, including explicit empty-state context when no workspace is active.
- [ ] Avoid sending raw UI state dumps; only include fields needed for planning and review.
- [ ] Preserve existing frontend tool manifest and tool continuation behavior.

### Phase 7: Render Reviewable Execution UI

**Outcome:** Users can inspect, approve, and track governed steps from the assistant thread.

**Files:**

- Create: `apps/base/src/components/ChatbotSidebar/components/ExecutionPlanCard.tsx`
- Create: `apps/base/src/components/ChatbotSidebar/components/ExecutionStepStatus.tsx`
- Modify: `apps/base/src/components/ChatbotSidebar/common/ToolExecutionCard.tsx`
- Modify: `apps/base/src/components/ChatbotSidebar/adapters/sseToAssistantUi.ts`
- Modify: `apps/base/src/next-packages/components/assistant-ui/thread.tsx`
- Test: `apps/base/src/components/ChatbotSidebar/__tests__/GenerativeUIRenderer.test.tsx`
- Test: `apps/base/src/components/ChatbotSidebar/__tests__/backendToolUiToolkit.test.tsx`

- [ ] Render governed plans inline with step type, target, summary, and policy status.
- [ ] Show per-step statuses: `pending_review`, `approved`, `running`, `completed`, `failed`, `denied`.
- [ ] Add approval and rejection affordances only when the backend marks a step as review required.
- [ ] Keep plain chat and legacy tool rendering working alongside the new execution UI.

### Phase 8: Execute First Real End-To-End Governed Flow

**Outcome:** The system proves the architecture with one read-only MCP flow.

**Files:**

- Modify: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/controller/ChatController.java`
- Modify: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/mcp/McpProviderRegistryService.java`
- Modify: chosen tenant service adapter and/or provider registration path
- Test: `services/chatbot-backend/src/test/java/com/fdc3/chatbot/controller/McpProviderControllerTest.java`

- [ ] Pick one flow that performs a read-only MCP call and returns typed results into the thread.
- [ ] Ensure MCP steps route through registered providers and typed results.
- [ ] Use this first flow to validate whether the current plan model is sufficient before broadening adoption.

### Phase 9: Verification And Rollout Readiness

**Outcome:** The MVP is verifiably safe to demo and iterate on.

**Files:**

- Modify: affected frontend and backend tests
- Review: `services/chatbot-backend/docs/API.md`
- Review: `services/chatbot-backend/docs/MFE_INTEGRATION.md`

- [ ] Run targeted frontend chatbot tests.
- [ ] Run targeted backend chatbot tests.
- [ ] Run lint and type-check for touched frontend modules.
- [ ] Run backend test suites for control-plane planning, policy, and SSE contract changes.
- [ ] Start the app and verify login, chatbot open, workspace-context submission, review-required state, and execution-status updates in the browser.
- [ ] Update developer docs with the new control-plane request and SSE event contracts.

## Execution Sequence

Use this exact sequence when implementing:

1. Phase 1 models and request contract
2. Phase 2 static capability file and resolver
3. Phase 3 in-process policy evaluator
4. Phase 4 minimal planner
5. Phase 5 SSE governed events
6. Phase 6 workspace context submission
7. Phase 7 execution review UI
8. Phase 8 first read-only MCP flow
9. Phase 9 verification and docs

## Chosen First Flow

Use the Elasticsearch MCP service and implement `statistic_count_by_app` first.

User story:

- user asks for app usage statistics in natural language
- chatbot resolves the static capability entry for `statistic_count_by_app`
- backend builds a single read-only `mcp` execution step
- policy allows execution without approval because the step is read-only
- chatbot executes the MCP tool and streams typed results back into the assistant thread
- UI renders the governed step state and the final result summary

Example prompts:

- "Show me PV and UV for app cashflow over the last 7 days"
- "Get app usage count for template_tile_fdc3_2 from 2026-04-01 to 2026-04-08"

Chosen MCP tool:

- `statistic_count_by_app`

Deferred until later:

- `chart_by_app`
- FDC3 governed execution
- MCP mutations and approval UX

## Concrete Implementation Checklist

### Task 1: Add Static Capability File For The First MCP Flow

**Files:**

- Create: `services/chatbot-backend/src/main/resources/capabilities/control-plane-capabilities.json`
- Modify: `services/chatbot-backend/src/main/resources/application.yml`
- Test: `services/chatbot-backend/src/test/java/com/fdc3/chatbot/controlplane/CapabilityRegistryServiceTest.java`

- [ ] Write a failing backend test that expects the capability file to load `statistic_count_by_app` as a read-only MCP capability.
- [ ] Create `control-plane-capabilities.json` with one entry for `statistic_count_by_app`.
- [ ] Include in that entry: capability ID, provider ID, tool name, execution type `mcp`, access type `read`, supported prompt hints, required inputs, optional inputs, tenant scope, and default policy classification.
- [ ] Add backend configuration for the capability file location if needed.
- [ ] Run: `./mvnw -f services/chatbot-backend/pom.xml test -Dtest=CapabilityRegistryServiceTest`

### Task 2: Extend Chat Request Contract With Workspace Context

**Files:**

- Modify: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/model/ChatRequest.java`
- Create: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/controlplane/model/WorkspaceContextSnapshot.java`
- Create: `apps/base/src/components/ChatbotSidebar/controlPlane/types.ts`
- Test: `services/chatbot-backend/src/test/java/com/fdc3/chatbot/controller/ChatControllerTest.java`
- Test: `apps/base/src/components/ChatbotSidebar/__tests__/common.interface.test.ts`

- [ ] Write failing tests for request parsing with and without workspace context.
- [ ] Add a bounded workspace snapshot type to backend and frontend.
- [ ] Extend `ChatRequest` to include `workspaceContext`.
- [ ] Keep older requests without `workspaceContext` valid.
- [ ] Run backend and frontend targeted tests.

### Task 3: Send Workspace Context From The Frontend Runtime

**Files:**

- Create: `apps/base/src/components/ChatbotSidebar/controlPlane/buildWorkspaceContextSnapshot.ts`
- Modify: `apps/base/src/components/ChatbotSidebar/AssistantUIRuntimeProvider.tsx`
- Modify: `apps/base/src/hooks/workspace/useWorkspace.ts`
- Modify: `apps/base/src/hooks/model/workspaces.ts`
- Test: `apps/base/src/components/ChatbotSidebar/__tests__/AssistantUIRuntimeProvider.test.tsx`

- [ ] Write a failing frontend test that expects chat requests to include a bounded workspace snapshot.
- [ ] Build a helper that extracts current workspace ID, active tile ID, app ID, and minimal app metadata.
- [ ] Attach the snapshot to POST `/api/chat/stream` requests.
- [ ] Send explicit `null` or empty workspace context when no workspace is active.
- [ ] Run: `npm test -- --runInBand apps/base/src/components/ChatbotSidebar/__tests__/AssistantUIRuntimeProvider.test.tsx`

### Task 4: Build File-Backed Capability Resolution

**Files:**

- Create: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/controlplane/CapabilityRegistryService.java`
- Create: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/controlplane/CapabilityResolver.java`
- Create: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/controlplane/model/ResolvedCapability.java`
- Modify: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/mcp/McpProviderRegistryService.java`
- Test: `services/chatbot-backend/src/test/java/com/fdc3/chatbot/controlplane/CapabilityRegistryServiceTest.java`
- Test: `services/chatbot-backend/src/test/java/com/fdc3/chatbot/service/ChatServiceTest.java`

- [ ] Write failing tests that resolve the static capability entry and combine it with available MCP provider metadata.
- [ ] Load capability declarations from the JSON file at application startup or lazily on first use.
- [ ] Resolve only capabilities whose provider and tool are actually available.
- [ ] Keep the resolver request-scoped so user claims and workspace context can filter capabilities later.
- [ ] Run backend targeted tests.

### Task 5: Add An In-Process Policy Evaluator

**Files:**

- Create: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/controlplane/policy/PolicyEvaluator.java`
- Create: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/controlplane/model/PolicyDecision.java`
- Test: `services/chatbot-backend/src/test/java/com/fdc3/chatbot/agent/AgentServiceTest.java`

- [ ] Write failing tests for `allow`, `review_required`, and `deny`.
- [ ] Implement policy rules so MCP read actions are allowed by default if tenant scope and entitlements match.
- [ ] Implement policy rules so all future MCP mutations become `review_required`.
- [ ] Return structured denial reasons for blocked capabilities.
- [ ] Run backend targeted tests.

### Task 6: Add A Minimal MCP Planner

**Files:**

- Create: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/controlplane/model/ExecutionPlan.java`
- Create: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/controlplane/model/ExecutionStep.java`
- Create: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/controlplane/planning/ExecutionPlanner.java`
- Modify: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/agent/AgentService.java`
- Test: `services/chatbot-backend/src/test/java/com/fdc3/chatbot/agent/AgentServiceTest.java`

- [ ] Write a failing test that turns a prompt about app usage statistics into one `mcp` execution step for `statistic_count_by_app`.
- [ ] Keep the planner deterministic for the first slice: only create plans for prompts that match the static capability and extractable arguments.
- [ ] Parse or normalize inputs for `appId` or `appName`, `startTime`, and `endTime`.
- [ ] Keep non-matching prompts as plain conversational responses.
- [ ] Run: `./mvnw -f services/chatbot-backend/pom.xml test -Dtest=AgentServiceTest`

### Task 7: Stream Governed Execution Events

**Files:**

- Create: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/model/ExecutionPlanEvent.java`
- Modify: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/service/ChatService.java`
- Modify: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/controller/ChatController.java`
- Modify: `apps/base/src/components/ChatbotSidebar/adapters/types.ts`
- Modify: `apps/base/src/components/ChatbotSidebar/adapters/sseToAssistantUi.ts`
- Test: `services/chatbot-backend/src/test/java/com/fdc3/chatbot/controller/ChatControllerTest.java`
- Test: `apps/base/src/components/ChatbotSidebar/__tests__/fetchSSE.test.ts`
- Test: `apps/base/src/components/ChatbotSidebar/__tests__/sseAdapter.types.test.ts`

- [ ] Write failing tests for new SSE events carrying execution-plan and step-status payloads.
- [ ] Emit step lifecycle states in order: `planned`, `allowed`, `running`, `completed` or `failed`.
- [ ] Correlate those events to the assistant turn that produced them.
- [ ] Preserve existing text and tool event behavior.
- [ ] Run backend and frontend targeted SSE tests.

### Task 8: Render Governed MCP Step UI

**Files:**

- Create: `apps/base/src/components/ChatbotSidebar/components/ExecutionPlanCard.tsx`
- Create: `apps/base/src/components/ChatbotSidebar/components/ExecutionStepStatus.tsx`
- Modify: `apps/base/src/components/ChatbotSidebar/common/ToolExecutionCard.tsx`
- Modify: `apps/base/src/next-packages/components/assistant-ui/thread.tsx`
- Test: `apps/base/src/components/ChatbotSidebar/__tests__/backendToolUiToolkit.test.tsx`
- Test: `apps/base/src/components/ChatbotSidebar/__tests__/GenerativeUIRenderer.test.tsx`

- [ ] Write failing tests for rendering one governed read-only MCP step inside the assistant thread.
- [ ] Show capability summary, provider name, status badge, and final result summary.
- [ ] Do not add approval controls yet because the first flow is read-only.
- [ ] Keep the UI compatible with legacy tool rendering.
- [ ] Run frontend targeted tests.

### Task 9: Wire The Elasticsearch MCP Provider For Local Verification

**Files:**

- Modify: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/mcp/McpProviderRegistryService.java`
- Modify: `services/chatbot-backend/src/test/java/com/fdc3/chatbot/controller/McpProviderControllerTest.java`
- Review: `services/elasticsearch-mcp-service/README.md`

- [ ] Confirm the chatbot backend can register the Elasticsearch MCP provider and see `statistic_count_by_app`.
- [ ] Add or update tests covering provider registration and tool discovery.
- [ ] Document the expected local provider registration payload for manual verification.
- [ ] Run backend MCP provider tests.

### Task 10: End-To-End Verification

**Files:**

- Review: `services/chatbot-backend/docs/API.md`
- Review: `services/chatbot-backend/docs/MFE_INTEGRATION.md`

- [ ] Start the Elasticsearch MCP service.
- [ ] Start the chatbot backend and frontend app.
- [ ] Register the MCP provider if static boot registration is not added yet.
- [ ] Open the app, log in, open the chatbot, and submit a prompt for app usage statistics.
- [ ] Verify the thread shows planned, running, and completed step states plus typed MCP results.
- [ ] Update docs with the new request body and SSE event contract.

## TDD Command Checklist

Run these commands as the default verification loop while implementing:

- Frontend targeted tests: `npm test -- --runInBand apps/base/src/components/ChatbotSidebar/__tests__/AssistantUIRuntimeProvider.test.tsx apps/base/src/components/ChatbotSidebar/__tests__/fetchSSE.test.ts`
- Backend targeted tests: `./mvnw -f services/chatbot-backend/pom.xml test -Dtest=ChatControllerTest,ChatServiceTest,AgentServiceTest,McpProviderControllerTest,CapabilityRegistryServiceTest`
- Frontend lint: `npx eslint apps/base/src/components/ChatbotSidebar apps/base/src/hooks/workspace apps/base/src/hooks/model/workspaces.ts`
- Frontend type-check: `npx tsc -p apps/base/tsconfig.json --noEmit`

If `./mvnw` is not present in this repo, replace the backend command with the project-standard Maven invocation for `services/chatbot-backend`.

## Risks To Manage

- The biggest product risk is trying to implement the full distributed architecture before proving one governed flow. Keep the first iteration in process.
- The biggest technical risk is letting the LLM plan against unbounded tools. Cap the planner to resolved capabilities only.
- The biggest UX risk is overloading the thread with raw plan metadata. Treat review cards as first-class UI, not JSON dumps.
- The biggest delivery risk is mixing frontend-only tool patterns with backend-governed execution. Pick one canonical path for governed steps and migrate incrementally.
- The biggest maintainability risk is letting static JSON capability definitions drift from actual FDC3 declarations and MCP providers. Keep the file small and only describe supported governed flows.

## Decision Gates

- Gate 1: Do we only need an in-process policy boundary for now, or is an external Policy Service required immediately?
- Gate 2: Which concrete read-only MCP flow should ship first?
- Gate 3: Should tenant apps onboard capability metadata statically from declarations first, or do we need dynamic runtime registration in phase one?
- Gate 4: Do we require explicit user approval for every MCP mutation? Yes, lock this as a policy rule now.

## Recommended First Slice

If you want the shortest path to value, implement this order:

1. Workspace context snapshot in `apps/base`
2. Static capability JSON plus request-scoped capability resolution in `chatbot-backend`
3. In-process policy evaluator
4. Minimal plan model and SSE plan events
5. Thread review UI
6. One read-only MCP flow

This keeps the work aligned with the PRD while avoiding an expensive rewrite before the product shape is proven.
