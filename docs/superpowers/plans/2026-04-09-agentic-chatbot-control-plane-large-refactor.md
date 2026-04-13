# Agentic Chatbot Control Plane Large Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current regex-driven governed chatbot path with a true LLM-first agent loop that decides whether to respond, clarify, or execute a validated capability plan, while keeping the system as one deployable.

**Architecture:** Keep `services/chatbot-backend` as the single runtime for capability resolution, policy, agent decisioning, plan validation, execution orchestration, and final synthesis. Keep `apps/base` presentation-only: it renders backend-authored assistant text, generic tool receipts, and structured cards derived from live Elasticsearch MCP results, but it does not invent narration or business summaries.

**Tech Stack:** Spring Boot, Java 17, LangChain4j, Jackson, SSE, React 18, TypeScript, assistant-ui, Jest, Playwright, Elasticsearch MCP

---

## File Structure

### Backend

- Modify: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/agent/AgentService.java`
  - Shrink orchestration logic and delegate to explicit collaborators.
- Create: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/agent/AgentDecisionService.java`
  - First LLM pass for `respond | clarify | plan`.
- Create: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/agent/PlanValidationService.java`
  - Validates proposed plan steps against resolved capabilities, schemas, and policy.
- Create: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/agent/ExecutionOrchestrator.java`
  - Executes validated steps through MCP and emits tool events.
- Create: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/agent/ResultSynthesisService.java`
  - Second LLM pass for the final conclusion.
- Create: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/agent/model/AgentDecision.java`
- Create: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/agent/model/AgentDecisionType.java`
- Create: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/agent/model/AgentPlan.java`
- Create: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/agent/model/AgentPlanStep.java`
- Create: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/agent/model/ValidatedExecutionPlan.java`
- Create: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/agent/model/ValidatedExecutionStep.java`
- Create: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/agent/model/ExecutionTranscript.java`
- Create: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/agent/prompt/AgentDecisionPromptFactory.java`
- Create: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/agent/prompt/ResultSynthesisPromptFactory.java`
- Modify: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/controlplane/CapabilityResolver.java`
  - Provide compact capability summaries for LLM prompting and validation.
- Modify: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/controlplane/planning/ExecutionPlanner.java`
  - Demote from primary path to temporary compatibility fallback only.
- Modify: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/controller/ChatController.java`
- Modify: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/service/ChatService.java`
- Modify: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/model/ToolResult.java`
  - Keep MCP card payload normalized and explicit.

### Backend tests

- Create: `services/chatbot-backend/src/test/java/com/fdc3/chatbot/agent/AgentDecisionServiceTest.java`
- Create: `services/chatbot-backend/src/test/java/com/fdc3/chatbot/agent/PlanValidationServiceTest.java`
- Create: `services/chatbot-backend/src/test/java/com/fdc3/chatbot/agent/ExecutionOrchestratorTest.java`
- Create: `services/chatbot-backend/src/test/java/com/fdc3/chatbot/agent/ResultSynthesisServiceTest.java`
- Modify: `services/chatbot-backend/src/test/java/com/fdc3/chatbot/agent/AgentControlPlaneExecutionTest.java`
- Modify: `services/chatbot-backend/src/test/java/com/fdc3/chatbot/controller/ChatControllerTest.java`
- Modify: `services/chatbot-backend/src/test/java/com/fdc3/chatbot/service/ChatServiceTest.java`

### Frontend

- Modify: `apps/base/src/components/ChatbotSidebar/adapters/sseToAssistantUi.ts`
  - Ensure only backend-authored message text becomes assistant narration.
- Modify: `apps/base/src/next-packages/components/assistant-ui/tool-fallback.tsx`
  - Keep generic receipt rendering only.
- Modify: `apps/base/src/components/ChatbotSidebar/common/GenerativeUI.tsx`
  - Keep analytics card as a structural renderer of tool result data.
- Modify: `apps/base/src/components/ChatbotSidebar/adapters/types.ts`
  - Tighten event typing where the backend contract changes.

### Frontend tests

- Modify: `apps/base/src/components/ChatbotSidebar/__tests__/sseAdapter.types.test.ts`
- Modify: `apps/base/src/next-packages/components/assistant-ui/tool-fallback.test.tsx`
- Modify: `apps/base/src/components/ChatbotSidebar/__tests__/GenerativeUI.test.tsx`
- Modify: `tests/e2e/chatbot-mcp-flow.spec.ts`

## Task 1: Lock The Agent Decision Contract

**Files:**

- Create: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/agent/model/AgentDecision.java`
- Create: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/agent/model/AgentDecisionType.java`
- Create: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/agent/model/AgentPlan.java`
- Create: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/agent/model/AgentPlanStep.java`
- Create: `services/chatbot-backend/src/test/java/com/fdc3/chatbot/agent/AgentDecisionServiceTest.java`

- [ ] **Step 1: Write the failing contract tests**

```java
package com.fdc3.chatbot.agent;

import com.fdc3.chatbot.agent.model.AgentDecision;
import com.fdc3.chatbot.agent.model.AgentDecisionType;
import org.junit.jupiter.api.Test;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

class AgentDecisionServiceTest {

    @Test
    void shouldDeserializePlanDecision() {
        String json = """
                {
                  "decisionType": "plan",
                  "assistantText": "I can pull that data.",
                  "plan": {
                    "steps": [
                      {
                        "capabilityId": "analytics.app-usage.read",
                        "arguments": {
                          "appName": "cashflow",
                          "from": "2026-04-01",
                          "to": "2026-04-08"
                        }
                      }
                    ]
                  }
                }
                """;

        AgentDecision decision = AgentDecisionService.parseDecision(json);

        assertThat(decision.decisionType()).isEqualTo(AgentDecisionType.PLAN);
        assertThat(decision.assistantText()).isEqualTo("I can pull that data.");
        assertThat(decision.plan().steps()).hasSize(1);
        assertThat(decision.plan().steps().get(0).capabilityId()).isEqualTo("analytics.app-usage.read");
        assertThat(decision.plan().steps().get(0).arguments())
                .containsEntry("appName", "cashflow")
                .containsEntry("from", "2026-04-01")
                .containsEntry("to", "2026-04-08");
    }

    @Test
    void shouldRejectDecisionWithoutDecisionType() {
        String json = "{\"assistantText\":\"missing type\"}";

        AgentDecision decision = AgentDecisionService.parseDecision(json);

        assertThat(decision.decisionType()).isEqualTo(AgentDecisionType.RESPOND);
        assertThat(decision.assistantText()).contains("missing type");
    }
}
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `mvn -f services/chatbot-backend/pom.xml -Dtest=AgentDecisionServiceTest test`

Expected: FAIL because `AgentDecision`, `AgentDecisionType`, and `AgentDecisionService.parseDecision(...)` do not exist.

- [ ] **Step 3: Write the minimal contract models**

```java
package com.fdc3.chatbot.agent.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;
import java.util.Map;

@JsonIgnoreProperties(ignoreUnknown = true)
public record AgentDecision(
        AgentDecisionType decisionType,
        String assistantText,
        String clarificationQuestion,
        AgentPlan plan
) {
}

public enum AgentDecisionType {
    RESPOND,
    CLARIFY,
    PLAN
}

@JsonIgnoreProperties(ignoreUnknown = true)
public record AgentPlan(List<AgentPlanStep> steps) {
}

@JsonIgnoreProperties(ignoreUnknown = true)
public record AgentPlanStep(
        String capabilityId,
        Map<String, Object> arguments
) {
}
```

- [ ] **Step 4: Add the parsing helper to the new decision service**

```java
package com.fdc3.chatbot.agent;

import com.fasterxml.jackson.databind.MapperFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fdc3.chatbot.agent.model.AgentDecision;
import com.fdc3.chatbot.agent.model.AgentDecisionType;
import org.springframework.stereotype.Service;

@Service
public class AgentDecisionService {
    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper()
            .configure(MapperFeature.ACCEPT_CASE_INSENSITIVE_ENUMS, true);

    static AgentDecision parseDecision(String json) {
        try {
            AgentDecision parsed = OBJECT_MAPPER.readValue(json, AgentDecision.class);
            if (parsed.decisionType() != null) {
                return parsed;
            }
            return new AgentDecision(AgentDecisionType.RESPOND, parsed.assistantText(), null, null);
        } catch (Exception ignored) {
            return new AgentDecision(AgentDecisionType.RESPOND, json, null, null);
        }
    }
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `mvn -f services/chatbot-backend/pom.xml -Dtest=AgentDecisionServiceTest test`

Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add services/chatbot-backend/src/main/java/com/fdc3/chatbot/agent/model/AgentDecision.java \
  services/chatbot-backend/src/main/java/com/fdc3/chatbot/agent/model/AgentDecisionType.java \
  services/chatbot-backend/src/main/java/com/fdc3/chatbot/agent/model/AgentPlan.java \
  services/chatbot-backend/src/main/java/com/fdc3/chatbot/agent/model/AgentPlanStep.java \
  services/chatbot-backend/src/main/java/com/fdc3/chatbot/agent/AgentDecisionService.java \
  services/chatbot-backend/src/test/java/com/fdc3/chatbot/agent/AgentDecisionServiceTest.java
git commit -m "feat: define agent decision contract"
```

## Task 2: Add The First LLM Decision Pass

**Files:**

- Create: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/agent/prompt/AgentDecisionPromptFactory.java`
- Modify: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/agent/AgentDecisionService.java`
- Modify: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/controlplane/CapabilityResolver.java`
- Create: `services/chatbot-backend/src/test/java/com/fdc3/chatbot/agent/AgentDecisionServiceTest.java`

- [ ] **Step 1: Extend the tests to cover respond, clarify, and plan behavior**

```java
@Test
void shouldReturnClarifyWhenModelRequestsMissingInput() {
    FakeChatModel model = new FakeChatModel("""
            {
              "decisionType": "clarify",
              "clarificationQuestion": "Which app should I check?"
            }
            """);
    AgentDecisionService service = new AgentDecisionService(model, new AgentDecisionPromptFactory());

    AgentDecision decision = service.decide(
            "Get app usage count",
            List.of(),
            List.of(new ResolvedCapability("analytics.app-usage.read", "mcp", "elasticsearch-analytics", "statistic_count_by_app", null, List.of("appName", "from", "to"), "read_only"))
    );

    assertThat(decision.decisionType()).isEqualTo(AgentDecisionType.CLARIFY);
    assertThat(decision.clarificationQuestion()).isEqualTo("Which app should I check?");
}

@Test
void shouldIncludeOnlyAllowedCapabilitiesInPrompt() {
    CapturingChatModel model = new CapturingChatModel("""
            {"decisionType":"respond","assistantText":"No action needed."}
            """);
    AgentDecisionService service = new AgentDecisionService(model, new AgentDecisionPromptFactory());

    service.decide("hello", List.of(), List.of(
            new ResolvedCapability("analytics.app-usage.read", "mcp", "elasticsearch-analytics", "statistic_count_by_app", null, List.of("appName"), "read_only")
    ));

    assertThat(model.capturedPrompt()).contains("analytics.app-usage.read");
    assertThat(model.capturedPrompt()).doesNotContain("internal-only-capability");
}
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `mvn -f services/chatbot-backend/pom.xml -Dtest=AgentDecisionServiceTest test`

Expected: FAIL because `decide(...)`, prompt generation, and a chat-model-backed constructor do not exist.

- [ ] **Step 3: Implement the prompt factory**

```java
package com.fdc3.chatbot.agent.prompt;

import com.fdc3.chatbot.controlplane.model.ResolvedCapability;

import java.util.List;

public class AgentDecisionPromptFactory {

    public String build(String userMessage, String workspaceContextJson, List<ResolvedCapability> capabilities) {
        String capabilityBlock = capabilities.stream()
                .map(capability -> "- " + capability.getId() + " -> " + capability.getTargetName())
                .reduce("", (left, right) -> left + right + "\n");

        return """
                You are an execution-aware assistant.
                Return JSON only.
                Allowed decisionType values: respond, clarify, plan.
                Allowed capabilities:
                %s
                Workspace context:
                %s
                User request:
                %s
                """.formatted(capabilityBlock.trim(), workspaceContextJson, userMessage);
    }
}
```

- [ ] **Step 4: Implement the model-backed `decide(...)` method**

```java
public AgentDecision decide(
        String userMessage,
        List<ChatMessage> history,
        List<ResolvedCapability> capabilities,
        WorkspaceContextSnapshot workspaceContextSnapshot
) {
    String prompt = promptFactory.build(
            userMessage,
            workspaceContextSnapshot == null ? "{}" : OBJECT_MAPPER.valueToTree(workspaceContextSnapshot).toString(),
            capabilities
    );

    ChatResponse response = chatModel.chat(ChatRequest.builder()
            .messages(List.of(SystemMessage.from(prompt), UserMessage.from(userMessage)))
            .build());

    return parseDecision(response.aiMessage().text());
}
```

- [ ] **Step 5: Run the tests**

Run: `mvn -f services/chatbot-backend/pom.xml -Dtest=AgentDecisionServiceTest test`

Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add services/chatbot-backend/src/main/java/com/fdc3/chatbot/agent/AgentDecisionService.java \
  services/chatbot-backend/src/main/java/com/fdc3/chatbot/agent/prompt/AgentDecisionPromptFactory.java \
  services/chatbot-backend/src/main/java/com/fdc3/chatbot/controlplane/CapabilityResolver.java \
  services/chatbot-backend/src/test/java/com/fdc3/chatbot/agent/AgentDecisionServiceTest.java
git commit -m "feat: add llm-backed agent decision pass"
```

## Task 3: Validate LLM Plans Against Capability And Policy Boundaries

**Files:**

- Create: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/agent/PlanValidationService.java`
- Create: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/agent/model/ValidatedExecutionPlan.java`
- Create: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/agent/model/ValidatedExecutionStep.java`
- Create: `services/chatbot-backend/src/test/java/com/fdc3/chatbot/agent/PlanValidationServiceTest.java`
- Modify: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/controlplane/policy/PolicyEvaluator.java`

- [ ] **Step 1: Write the failing validation tests**

```java
package com.fdc3.chatbot.agent;

import com.fdc3.chatbot.agent.model.AgentDecision;
import com.fdc3.chatbot.agent.model.AgentDecisionType;
import com.fdc3.chatbot.agent.model.AgentPlan;
import com.fdc3.chatbot.agent.model.AgentPlanStep;
import com.fdc3.chatbot.controlplane.model.ResolvedCapability;
import com.fdc3.chatbot.controlplane.policy.PolicyDecisionType;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

class PlanValidationServiceTest {

    @Test
    void shouldRejectUnknownCapabilityId() {
        PlanValidationService service = new PlanValidationService(new PolicyEvaluator());

        AgentDecision decision = new AgentDecision(
                AgentDecisionType.PLAN,
                "I can pull that data.",
                null,
                new AgentPlan(List.of(new AgentPlanStep("missing.capability", Map.of("appName", "cashflow"))))
        );

        PlanValidationResult result = service.validate(decision, List.of(), UserCapabilityContext.anonymous());

        assertThat(result.valid()).isFalse();
        assertThat(result.assistantMessage()).contains("can't use that action");
    }

    @Test
    void shouldRejectMissingRequiredArguments() {
        ResolvedCapability capability = TestResolvedCapabilities.analyticsReadCapability();
        PlanValidationService service = new PlanValidationService(new PolicyEvaluator());

        AgentDecision decision = new AgentDecision(
                AgentDecisionType.PLAN,
                "I can pull that data.",
                null,
                new AgentPlan(List.of(new AgentPlanStep(capability.getId(), Map.of("appName", "cashflow"))))
        );

        PlanValidationResult result = service.validate(decision, List.of(capability), UserCapabilityContext.anonymous());

        assertThat(result.valid()).isFalse();
        assertThat(result.assistantMessage()).contains("need more detail");
    }

    @Test
    void shouldMarkReadOnlyMcpStepAsAllowed() {
        ResolvedCapability capability = TestResolvedCapabilities.analyticsReadCapability();
        PlanValidationService service = new PlanValidationService(new PolicyEvaluator());

        AgentDecision decision = new AgentDecision(
                AgentDecisionType.PLAN,
                "I can pull that data.",
                null,
                new AgentPlan(List.of(new AgentPlanStep(
                        capability.getId(),
                        Map.of("appName", "cashflow", "from", "2026-04-01", "to", "2026-04-08")
                )))
        );

        PlanValidationResult result = service.validate(decision, List.of(capability), UserCapabilityContext.anonymous());

        assertThat(result.valid()).isTrue();
        assertThat(result.plan().steps()).hasSize(1);
        assertThat(result.plan().steps().get(0).policyDecision().decisionType()).isEqualTo(PolicyDecisionType.ALLOW);
    }
}
```

- [ ] **Step 2: Run the validation test**

Run: `mvn -f services/chatbot-backend/pom.xml -Dtest=PlanValidationServiceTest test`

Expected: FAIL because validation service and validated-plan models do not exist.

- [ ] **Step 3: Implement the validated plan models**

```java
public record ValidatedExecutionPlan(List<ValidatedExecutionStep> steps) {
}

public record ValidatedExecutionStep(
        String capabilityId,
        ResolvedCapability capability,
        Map<String, Object> arguments,
        PolicyDecision policyDecision
) {
}
```

- [ ] **Step 4: Implement plan validation**

```java
public PlanValidationResult validate(
        AgentDecision decision,
        List<ResolvedCapability> capabilities,
        UserCapabilityContext userCapabilityContext
) {
    Map<String, ResolvedCapability> byId = capabilities.stream()
            .collect(Collectors.toMap(ResolvedCapability::getId, Function.identity()));

    List<ValidatedExecutionStep> validatedSteps = new ArrayList<>();
    for (AgentPlanStep step : decision.plan().steps()) {
        ResolvedCapability capability = byId.get(step.capabilityId());
        if (capability == null) {
            return PlanValidationResult.invalid("I can't use that action for this request.");
        }
        if (!capability.requiredInputsSatisfied(step.arguments())) {
            return PlanValidationResult.invalid("I need more detail before I can run that action.");
        }
        PolicyDecision policyDecision = policyEvaluator.evaluate(capability, step.arguments(), userCapabilityContext);
        if (policyDecision.decisionType() == PolicyDecisionType.DENY) {
            return PlanValidationResult.invalid(policyDecision.reason());
        }
        validatedSteps.add(new ValidatedExecutionStep(step.capabilityId(), capability, step.arguments(), policyDecision));
    }

    return PlanValidationResult.valid(new ValidatedExecutionPlan(validatedSteps));
}
```

- [ ] **Step 5: Run the tests**

Run: `mvn -f services/chatbot-backend/pom.xml -Dtest=PlanValidationServiceTest test`

Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add services/chatbot-backend/src/main/java/com/fdc3/chatbot/agent/PlanValidationService.java \
  services/chatbot-backend/src/main/java/com/fdc3/chatbot/agent/model/ValidatedExecutionPlan.java \
  services/chatbot-backend/src/main/java/com/fdc3/chatbot/agent/model/ValidatedExecutionStep.java \
  services/chatbot-backend/src/test/java/com/fdc3/chatbot/agent/PlanValidationServiceTest.java \
  services/chatbot-backend/src/main/java/com/fdc3/chatbot/controlplane/policy/PolicyEvaluator.java
git commit -m "feat: validate agent plans against capability policy"
```

## Task 4: Extract MCP Execution Into An Execution Orchestrator

**Files:**

- Create: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/agent/ExecutionOrchestrator.java`
- Create: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/agent/model/ExecutionTranscript.java`
- Create: `services/chatbot-backend/src/test/java/com/fdc3/chatbot/agent/ExecutionOrchestratorTest.java`
- Modify: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/agent/AgentService.java`
- Modify: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/model/ToolResult.java`

- [ ] **Step 1: Write the failing orchestration test**

```java
package com.fdc3.chatbot.agent;

import com.fdc3.chatbot.agent.model.ExecutionTranscript;
import com.fdc3.chatbot.agent.model.ValidatedExecutionPlan;
import org.junit.jupiter.api.Test;

import java.util.concurrent.atomic.AtomicReference;

import static org.assertj.core.api.Assertions.assertThat;

class ExecutionOrchestratorTest {

    @Test
    void shouldExecuteStatisticCountByAppAndReturnNormalizedToolResult() {
        FakeMcpExecutor mcpExecutor = new FakeMcpExecutor("""
                {
                  "appName": "cashflow",
                  "from": "2026-04-01",
                  "to": "2026-04-08",
                  "pvTotal": 120,
                  "uvTotal": 30,
                  "trend": [
                    {"date":"2026-04-01","pv":40,"uv":10},
                    {"date":"2026-04-08","pv":80,"uv":20}
                  ]
                }
                """);
        AtomicReference<ToolResult> resultRef = new AtomicReference<>();
        ExecutionOrchestrator orchestrator = new ExecutionOrchestrator(mcpExecutor);

        ExecutionTranscript transcript = orchestrator.execute(
                TestValidatedPlans.analyticsReadPlan(),
                toolCall -> {},
                resultRef::set
        );

        assertThat(resultRef.get().getToolName()).isEqualTo("statistic_count_by_app");
        assertThat(resultRef.get().getResult()).containsEntry("pvTotal", 120);
        assertThat(resultRef.get().getResult()).containsKey("trend");
        assertThat(transcript.executedSteps()).hasSize(1);
    }
}
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `mvn -f services/chatbot-backend/pom.xml -Dtest=ExecutionOrchestratorTest test`

Expected: FAIL because `ExecutionOrchestrator` and `ExecutionTranscript` do not exist.

- [ ] **Step 3: Implement the execution transcript**

```java
public record ExecutionTranscript(
        ValidatedExecutionPlan plan,
        List<ToolCall> toolCalls,
        List<ToolResult> toolResults
) {
}
```

- [ ] **Step 4: Implement the orchestrator**

```java
public ExecutionTranscript execute(
        ValidatedExecutionPlan plan,
        Consumer<ToolCall> onToolCall,
        Consumer<ToolResult> onToolResult
) {
    List<ToolCall> toolCalls = new ArrayList<>();
    List<ToolResult> toolResults = new ArrayList<>();

    for (ValidatedExecutionStep step : plan.steps()) {
        ToolCall toolCall = ToolCall.running(step.capability().getTargetName(), step.arguments(), "backend");
        onToolCall.accept(toolCall);
        toolCalls.add(toolCall);

        Map<String, Object> rawResult = mcpExecutor.execute(step.capability(), step.arguments());
        ToolResult normalized = ToolResult.completed(toolCall.getId(), toolCall.getName(), rawResult);
        onToolResult.accept(normalized);
        toolResults.add(normalized);
    }

    return new ExecutionTranscript(plan, toolCalls, toolResults);
}
```

- [ ] **Step 5: Run the tests**

Run: `mvn -f services/chatbot-backend/pom.xml -Dtest=ExecutionOrchestratorTest,AgentControlPlaneExecutionTest test`

Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add services/chatbot-backend/src/main/java/com/fdc3/chatbot/agent/ExecutionOrchestrator.java \
  services/chatbot-backend/src/main/java/com/fdc3/chatbot/agent/model/ExecutionTranscript.java \
  services/chatbot-backend/src/main/java/com/fdc3/chatbot/model/ToolResult.java \
  services/chatbot-backend/src/main/java/com/fdc3/chatbot/agent/AgentService.java \
  services/chatbot-backend/src/test/java/com/fdc3/chatbot/agent/ExecutionOrchestratorTest.java \
  services/chatbot-backend/src/test/java/com/fdc3/chatbot/agent/AgentControlPlaneExecutionTest.java
git commit -m "feat: extract governed execution orchestrator"
```

## Task 5: Add The Final LLM Synthesis Pass

**Files:**

- Create: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/agent/ResultSynthesisService.java`
- Create: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/agent/prompt/ResultSynthesisPromptFactory.java`
- Create: `services/chatbot-backend/src/test/java/com/fdc3/chatbot/agent/ResultSynthesisServiceTest.java`
- Modify: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/agent/AgentService.java`

- [ ] **Step 1: Write the failing synthesis tests**

```java
package com.fdc3.chatbot.agent;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class ResultSynthesisServiceTest {

    @Test
    void shouldUseToolResultsToGenerateFinalConclusion() {
        FakeChatModel model = new FakeChatModel("cashflow usage from 2026-04-01 to 2026-04-08: PV 120, UV 30.");
        ResultSynthesisService service = new ResultSynthesisService(model, new ResultSynthesisPromptFactory());

        String summary = service.summarize(
                "Get app usage count for cashflow from 2026-04-01 to 2026-04-08",
                TestExecutionTranscripts.analyticsReadTranscript()
        );

        assertThat(summary).isEqualTo("cashflow usage from 2026-04-01 to 2026-04-08: PV 120, UV 30.");
    }

    @Test
    void shouldExplainToolFailureInPlainLanguage() {
        FakeChatModel model = new FakeChatModel("I couldn't fetch usage data because the analytics provider failed.");
        ResultSynthesisService service = new ResultSynthesisService(model, new ResultSynthesisPromptFactory());

        String summary = service.summarize(
                "Get app usage count",
                TestExecutionTranscripts.failedAnalyticsTranscript()
        );

        assertThat(summary).contains("couldn't fetch usage data");
    }
}
```

- [ ] **Step 2: Run the test**

Run: `mvn -f services/chatbot-backend/pom.xml -Dtest=ResultSynthesisServiceTest test`

Expected: FAIL because synthesis service and prompt factory do not exist.

- [ ] **Step 3: Implement the prompt factory**

```java
public class ResultSynthesisPromptFactory {

    public String build(String userMessage, ExecutionTranscript transcript) {
        return """
                Write one concise assistant response.
                Use the executed tool results only.
                Do not invent numbers.
                User request: %s
                Executed results: %s
                """.formatted(userMessage, transcript.toolResults());
    }
}
```

- [ ] **Step 4: Implement result synthesis**

```java
public String summarize(String userMessage, ExecutionTranscript transcript) {
    ChatResponse response = chatModel.chat(ChatRequest.builder()
            .messages(List.of(
                    SystemMessage.from(promptFactory.build(userMessage, transcript)),
                    UserMessage.from(userMessage)
            ))
            .build());
    return response.aiMessage().text();
}
```

- [ ] **Step 5: Run the tests**

Run: `mvn -f services/chatbot-backend/pom.xml -Dtest=ResultSynthesisServiceTest test`

Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add services/chatbot-backend/src/main/java/com/fdc3/chatbot/agent/ResultSynthesisService.java \
  services/chatbot-backend/src/main/java/com/fdc3/chatbot/agent/prompt/ResultSynthesisPromptFactory.java \
  services/chatbot-backend/src/test/java/com/fdc3/chatbot/agent/ResultSynthesisServiceTest.java \
  services/chatbot-backend/src/main/java/com/fdc3/chatbot/agent/AgentService.java
git commit -m "feat: add result synthesis pass"
```

## Task 6: Refactor AgentService To Use The New Loop

**Files:**

- Modify: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/agent/AgentService.java`
- Modify: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/service/ChatService.java`
- Modify: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/controller/ChatController.java`
- Modify: `services/chatbot-backend/src/test/java/com/fdc3/chatbot/agent/AgentControlPlaneExecutionTest.java`
- Modify: `services/chatbot-backend/src/test/java/com/fdc3/chatbot/service/ChatServiceTest.java`
- Modify: `services/chatbot-backend/src/test/java/com/fdc3/chatbot/controller/ChatControllerTest.java`

- [ ] **Step 1: Write the high-level integration tests first**

```java
@Test
void shouldRespondDirectlyWhenNoToolIsNeeded() {
    FakeAgentDecisionService decisionService = FakeAgentDecisionService.respond("Here is the answer.");
    AgentService service = TestAgentServiceFactory.create(decisionService);

    TestStream stream = service.stream("What is FDC3?");

    assertThat(stream.messages()).containsExactly("Here is the answer.");
    assertThat(stream.toolCalls()).isEmpty();
}

@Test
void shouldAskClarificationWhenAppIsMissing() {
    FakeAgentDecisionService decisionService = FakeAgentDecisionService.clarify("Which app should I check?");
    AgentService service = TestAgentServiceFactory.create(decisionService);

    TestStream stream = service.stream("Get app usage count");

    assertThat(stream.messages()).containsExactly("Which app should I check?");
    assertThat(stream.toolCalls()).isEmpty();
}

@Test
void shouldExecuteValidatedPlanAndThenSummarize() {
    AgentService service = TestAgentServiceFactory.analyticsReadHappyPath();

    TestStream stream = service.stream("Get app usage count for cashflow from 2026-04-01 to 2026-04-08");

    assertThat(stream.toolCalls()).hasSize(1);
    assertThat(stream.toolResults()).hasSize(1);
    assertThat(stream.messages()).contains("cashflow usage from 2026-04-01 to 2026-04-08: PV 120, UV 30.");
}
```

- [ ] **Step 2: Run the integration tests**

Run: `mvn -f services/chatbot-backend/pom.xml -Dtest=AgentControlPlaneExecutionTest,ChatServiceTest,ChatControllerTest test`

Expected: FAIL because `AgentService` still uses `ExecutionPlanner` as the primary governed path.

- [ ] **Step 3: Refactor `AgentService` into the explicit loop**

```java
List<ResolvedCapability> capabilities = capabilityResolver.resolve(...);
AgentDecision decision = agentDecisionService.decide(userMessage, history, capabilities, workspaceContextSnapshot);

switch (decision.decisionType()) {
    case RESPOND -> onNext.accept(decision.assistantText());
    case CLARIFY -> onNext.accept(decision.clarificationQuestion());
    case PLAN -> {
        if (decision.assistantText() != null && !decision.assistantText().isBlank()) {
            onNext.accept(decision.assistantText());
        }
        PlanValidationResult validation = planValidationService.validate(decision, capabilities, userCapabilityContext);
        if (!validation.valid()) {
            onNext.accept(validation.assistantMessage());
            return;
        }
        ExecutionTranscript transcript = executionOrchestrator.execute(validation.plan(), onToolCall, onToolResult);
        onNext.accept(resultSynthesisService.summarize(userMessage, transcript));
    }
}
```

- [ ] **Step 4: Keep `ExecutionPlanner` only as a temporary fallback behind a flag**

```java
@Value("${chatbot.agent.legacy-planner-enabled:false}")
private boolean legacyPlannerEnabled;
```

Use the legacy planner only when the LLM decision path is disabled for emergency rollback. Do not call it on the normal path.

- [ ] **Step 5: Run the tests**

Run: `mvn -f services/chatbot-backend/pom.xml -Dtest=AgentControlPlaneExecutionTest,ChatServiceTest,ChatControllerTest test`

Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add services/chatbot-backend/src/main/java/com/fdc3/chatbot/agent/AgentService.java \
  services/chatbot-backend/src/main/java/com/fdc3/chatbot/service/ChatService.java \
  services/chatbot-backend/src/main/java/com/fdc3/chatbot/controller/ChatController.java \
  services/chatbot-backend/src/test/java/com/fdc3/chatbot/agent/AgentControlPlaneExecutionTest.java \
  services/chatbot-backend/src/test/java/com/fdc3/chatbot/service/ChatServiceTest.java \
  services/chatbot-backend/src/test/java/com/fdc3/chatbot/controller/ChatControllerTest.java
git commit -m "refactor: route chatbot through agentic control loop"
```

## Task 7: Keep The Frontend Generic And Data-Driven

**Files:**

- Modify: `apps/base/src/components/ChatbotSidebar/adapters/sseToAssistantUi.ts`
- Modify: `apps/base/src/next-packages/components/assistant-ui/tool-fallback.tsx`
- Modify: `apps/base/src/components/ChatbotSidebar/common/GenerativeUI.tsx`
- Modify: `apps/base/src/components/ChatbotSidebar/__tests__/sseAdapter.types.test.ts`
- Modify: `apps/base/src/next-packages/components/assistant-ui/tool-fallback.test.tsx`
- Modify: `apps/base/src/components/ChatbotSidebar/__tests__/GenerativeUI.test.tsx`

- [ ] **Step 1: Write the failing frontend assertions**

```tsx
it('renders only backend-authored assistant text and generic tool receipts', () => {
  const state = reduceSSEEvents([
    ['message', '{"text":"I can pull that data."}'],
    [
      'tool_call',
      '{"id":"1","name":"statistic_count_by_app","arguments":{"appName":"cashflow","from":"2026-04-01","to":"2026-04-08"},"status":"running"}',
    ],
    [
      'tool_result',
      '{"toolCallId":"1","toolName":"statistic_count_by_app","result":{"appName":"cashflow","from":"2026-04-01","to":"2026-04-08","pvTotal":120,"uvTotal":30,"trend":[{"date":"2026-04-01","pv":40,"uv":10}]}}',
    ],
    ['message', '{"text":"cashflow usage from 2026-04-01 to 2026-04-08: PV 120, UV 30."}'],
  ]);

  expect(extractAssistantTexts(state)).toEqual([
    'I can pull that data.',
    'cashflow usage from 2026-04-01 to 2026-04-08: PV 120, UV 30.',
  ]);
  expect(extractToolCallNames(state)).toEqual(['statistic_count_by_app']);
  expect(extractComponentNames(state)).toContain('UsageStatisticsCard');
});
```

- [ ] **Step 2: Run the frontend tests**

Run: `npm --workspace apps/base test -- --runInBand src/components/ChatbotSidebar/__tests__/sseAdapter.types.test.ts src/next-packages/components/assistant-ui/tool-fallback.test.tsx src/components/ChatbotSidebar/__tests__/GenerativeUI.test.tsx`

Expected: FAIL if any residual frontend-authored narration or capability-specific business sentence remains.

- [ ] **Step 3: Remove any remaining frontend-authored narration**

```ts
function reduceMessageEvent(state: StreamingState, text: string): StreamingState {
  return appendAssistantText(state, text);
}

function reduceToolResultEvent(state: StreamingState, payload: ToolResult): StreamingState {
  if (payload.toolName === 'statistic_count_by_app') {
    return appendGenerativeCard(state, buildUsageStatisticsCard(payload.result));
  }
  return state;
}
```

- [ ] **Step 4: Keep tool receipts generic**

```tsx
<span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
  Used tool
</span>
<p className="font-medium text-foreground">{toolName}</p>
```

Do not add business narration such as “Fetching usage data” or “Looking up PV and UV”.

- [ ] **Step 5: Run tests and type-check**

Run: `npm --workspace apps/base test -- --runInBand src/components/ChatbotSidebar/__tests__/sseAdapter.types.test.ts src/next-packages/components/assistant-ui/tool-fallback.test.tsx src/components/ChatbotSidebar/__tests__/GenerativeUI.test.tsx`

Expected: PASS

Run: `npx tsc -p apps/base/tsconfig.json --noEmit`

Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add apps/base/src/components/ChatbotSidebar/adapters/sseToAssistantUi.ts \
  apps/base/src/next-packages/components/assistant-ui/tool-fallback.tsx \
  apps/base/src/components/ChatbotSidebar/common/GenerativeUI.tsx \
  apps/base/src/components/ChatbotSidebar/__tests__/sseAdapter.types.test.ts \
  apps/base/src/next-packages/components/assistant-ui/tool-fallback.test.tsx \
  apps/base/src/components/ChatbotSidebar/__tests__/GenerativeUI.test.tsx
git commit -m "refactor: keep chatbot ui generic and data driven"
```

## Task 8: Prove The First True-Agentic Elasticsearch MCP Flow

**Files:**

- Modify: `tests/e2e/chatbot-mcp-flow.spec.ts`
- Modify: `services/chatbot-backend/src/test/java/com/fdc3/chatbot/agent/AgentControlPlaneExecutionTest.java`
- Modify: `services/chatbot-backend/src/test/java/com/fdc3/chatbot/controller/ChatControllerTest.java`
- Review: `services/elasticsearch-mcp-service/src/main/java/com/fdc3/elasticsearchmcp/tool/AppAnalyticsMcpTools.java`

- [ ] **Step 1: Add the backend acceptance tests**

```java
@Test
void shouldPlanExecuteAndSummarizeForExplicitApp() {
    TestStream stream = agentService.stream("Get app usage count for cashflow from 2026-04-01 to 2026-04-08");

    assertThat(stream.toolCalls()).hasSize(1);
    assertThat(stream.toolCalls().get(0).getName()).isEqualTo("statistic_count_by_app");
    assertThat(stream.toolResults().get(0).getResult()).containsEntry("pvTotal", 120);
    assertThat(stream.messages()).contains("cashflow usage from 2026-04-01 to 2026-04-08: PV 120, UV 30.");
}

@Test
void shouldClarifyWhenAppAndWorkspaceContextAreMissing() {
    TestStream stream = agentService.stream("Get app usage count");

    assertThat(stream.toolCalls()).isEmpty();
    assertThat(stream.messages()).containsExactly("Which app should I check?");
}
```

- [ ] **Step 2: Add or update the browser E2E cases**

```ts
test('explicit app query uses real elasticsearch mcp data', async ({ page }) => {
  await loginAndOpenAssistant(page);
  await sendAssistantMessage(
    page,
    'Get app usage count for cashflow from 2026-04-01 to 2026-04-08',
  );

  await expect(page.getByText('Used tool')).toBeVisible();
  await expect(page.getByText('statistic_count_by_app')).toBeVisible();
  await expect(page.getByText('PV')).toBeVisible();
  await expect(page.getByText('UV')).toBeVisible();
  await expect(page.getByText(/cashflow usage from 2026-04-01 to 2026-04-08/)).toBeVisible();
});

test('missing app with active workspace app uses workspace context', async ({ page }) => {
  await loginOpenTileAndAssistant(page, 'FDC3 Tile 2');
  await sendAssistantMessage(page, 'Get app usage count from 2026-04-01 to 2026-04-08');

  await expect(page.getByText('statistic_count_by_app')).toBeVisible();
  await expect(
    page.getByText(/template_tile_fdc3_2 usage from 2026-04-01 to 2026-04-08/),
  ).toBeVisible();
});
```

- [ ] **Step 3: Run targeted backend verification**

Run: `mvn -f services/chatbot-backend/pom.xml -Dtest=AgentControlPlaneExecutionTest,ChatControllerTest test`

Expected: PASS

- [ ] **Step 4: Run targeted frontend verification**

Run: `npm --workspace apps/base test -- --runInBand src/components/ChatbotSidebar/__tests__/sseAdapter.types.test.ts src/components/ChatbotSidebar/__tests__/GenerativeUI.test.tsx`

Expected: PASS

- [ ] **Step 5: Run the live stack verification**

Run: `npm run dev:chatbot-mcp-stack`

Expected: app on `http://localhost:8001`, backend health on `http://127.0.0.1:8080/api/chat/health`, MCP health on `http://127.0.0.1:8090/actuator/health`

Run: `curl -sS -D- http://127.0.0.1:8080/api/chat/health`

Expected: `HTTP/1.1 200`

Run: `curl -sS -D- http://127.0.0.1:8090/actuator/health`

Expected: `HTTP/1.1 200`

Then verify in browser:

- Login at `http://localhost:8001/?show_normal_login=Y`
- Open assistant
- Send explicit app query
- Send workspace fallback query
- Confirm the visible sequence is:
  - backend-authored assistant text
  - generic tool receipt
  - PV/UV chart card
  - backend-authored summary

- [ ] **Step 6: Commit**

```bash
git add tests/e2e/chatbot-mcp-flow.spec.ts \
  services/chatbot-backend/src/test/java/com/fdc3/chatbot/agent/AgentControlPlaneExecutionTest.java \
  services/chatbot-backend/src/test/java/com/fdc3/chatbot/controller/ChatControllerTest.java
git commit -m "test: verify first true-agentic mcp flow"
```

## Task 9: Remove The Primary Deterministic Planner Path

**Files:**

- Modify: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/controlplane/planning/ExecutionPlanner.java`
- Modify: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/agent/AgentService.java`
- Modify: `services/chatbot-backend/src/test/java/com/fdc3/chatbot/agent/AgentControlPlaneExecutionTest.java`

- [ ] **Step 1: Write the regression test**

```java
@Test
void shouldNotUseLegacyExecutionPlannerWhenAgentLoopIsEnabled() {
    CountingExecutionPlanner legacyPlanner = new CountingExecutionPlanner();
    AgentService service = TestAgentServiceFactory.createWithLegacyPlanner(legacyPlanner, true);

    service.stream("Get app usage count for cashflow from 2026-04-01 to 2026-04-08");

    assertThat(legacyPlanner.invocationCount()).isZero();
}
```

- [ ] **Step 2: Run the test**

Run: `mvn -f services/chatbot-backend/pom.xml -Dtest=AgentControlPlaneExecutionTest test`

Expected: FAIL because the legacy planner is still on the main path.

- [ ] **Step 3: Gate or remove the legacy planner**

```java
if (legacyPlannerEnabled) {
    log.warn("Using legacy execution planner fallback");
    return executeLegacyPlan(...);
}

return executeAgenticFlow(...);
```

Target state: `legacyPlannerEnabled=false` by default and the agentic path is the only normal path.

- [ ] **Step 4: Run the regression suite**

Run: `mvn -f services/chatbot-backend/pom.xml -Dtest=AgentDecisionServiceTest,PlanValidationServiceTest,ExecutionOrchestratorTest,ResultSynthesisServiceTest,AgentControlPlaneExecutionTest,ChatServiceTest,ChatControllerTest test`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add services/chatbot-backend/src/main/java/com/fdc3/chatbot/controlplane/planning/ExecutionPlanner.java \
  services/chatbot-backend/src/main/java/com/fdc3/chatbot/agent/AgentService.java \
  services/chatbot-backend/src/test/java/com/fdc3/chatbot/agent/AgentControlPlaneExecutionTest.java
git commit -m "refactor: demote deterministic planner to fallback"
```

## Final Verification Checklist

- [ ] Run backend decision and validation tests:
  - `mvn -f services/chatbot-backend/pom.xml -Dtest=AgentDecisionServiceTest,PlanValidationServiceTest,ExecutionOrchestratorTest,ResultSynthesisServiceTest test`
- [ ] Run backend integration tests:
  - `mvn -f services/chatbot-backend/pom.xml -Dtest=AgentControlPlaneExecutionTest,ChatServiceTest,ChatControllerTest test`
- [ ] Run frontend tests:
  - `npm --workspace apps/base test -- --runInBand src/components/ChatbotSidebar/__tests__/sseAdapter.types.test.ts src/next-packages/components/assistant-ui/tool-fallback.test.tsx src/components/ChatbotSidebar/__tests__/GenerativeUI.test.tsx`
- [ ] Run frontend type-check:
  - `npx tsc -p apps/base/tsconfig.json --noEmit`
- [ ] Start the live stack:
  - `npm run dev:chatbot-mcp-stack`
- [ ] Verify browser flow at `http://localhost:8001/?show_normal_login=Y`
- [ ] Confirm Elasticsearch MCP data is live:
  - `curl -sS -D- http://127.0.0.1:8090/actuator/health`
- [ ] Confirm chatbot backend is live:
  - `curl -sS -D- http://127.0.0.1:8080/api/chat/health`

## Self-Review

- Spec coverage:
  - LLM-first `respond | clarify | plan` decision: covered by Tasks 1-2.
  - Backend validation against capability/schema/policy: covered by Task 3.
  - MCP execution and tool-result-backed card flow: covered by Tasks 4, 7, and 8.
  - Final LLM conclusion from actual tool results: covered by Task 5.
  - No frontend-authored narration: covered by Task 7.
  - Legacy deterministic planner removed from the main path: covered by Task 9.
- Placeholder scan:
  - No `TODO`, `TBD`, or “implement later” placeholders remain.
- Type consistency:
  - The plan uses `AgentDecision`, `AgentPlanStep`, `ValidatedExecutionPlan`, and `ExecutionTranscript` consistently across tasks.

Plan complete and saved to `docs/superpowers/plans/2026-04-09-agentic-chatbot-control-plane-large-refactor.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?
