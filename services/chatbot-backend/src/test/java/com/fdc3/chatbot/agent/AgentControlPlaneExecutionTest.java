package com.fdc3.chatbot.agent;

import com.fdc3.chatbot.agent.model.AgentDecision;
import com.fdc3.chatbot.agent.model.AgentDecisionType;
import com.fdc3.chatbot.agent.model.AgentPlan;
import com.fdc3.chatbot.agent.model.AgentPlanStep;
import com.fdc3.chatbot.agent.model.ExecutionTranscript;
import com.fdc3.chatbot.agent.prompt.AgentDecisionPromptFactory;
import com.fdc3.chatbot.controlplane.CapabilityRegistryService;
import com.fdc3.chatbot.controlplane.CapabilityResolver;
import com.fdc3.chatbot.controlplane.model.ResolvedCapability;
import com.fdc3.chatbot.controlplane.planning.ExecutionPlanner;
import com.fdc3.chatbot.controlplane.policy.PolicyEvaluator;
import com.fdc3.chatbot.model.ChatMessage;
import com.fdc3.chatbot.model.ExecutionPlanEvent;
import com.fdc3.chatbot.model.ExecutionStepEvent;
import com.fdc3.chatbot.model.ToolCall;
import com.fdc3.chatbot.model.ToolResult;
import com.fdc3.chatbot.model.UserCapabilityContext;
import com.fdc3.chatbot.tool.ToolDefinition;
import com.fdc3.chatbot.tool.ToolRegistry;
import com.fasterxml.jackson.databind.ObjectMapper;
import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.model.chat.request.ChatRequest;
import dev.langchain4j.model.chat.response.ChatResponse;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class AgentControlPlaneExecutionTest {

    @Test
    void processMessageStreamingEmitsDirectAssistantResponseWithoutToolExecution() throws Exception {
        ToolRegistry toolRegistry = analyticsToolRegistry();
        UserCapabilityContext capabilityContext = advisorContext();
        AgentService agentService = createAgentService(
                toolRegistry,
                capabilityContext,
                new AgentDecision(
                        AgentDecisionType.RESPOND,
                        "You have access to analytics for cashflow.",
                        null,
                        null
                ),
                null
        );

        List<ToolCall> toolCalls = new CopyOnWriteArrayList<>();
        List<ToolResult> toolResults = new CopyOnWriteArrayList<>();
        List<ExecutionPlanEvent> executionPlans = new CopyOnWriteArrayList<>();
        List<ExecutionStepEvent> executionSteps = new CopyOnWriteArrayList<>();
        StringBuilder streamedText = new StringBuilder();
        CountDownLatch completed = new CountDownLatch(1);

        agentService.processMessageStreaming(
                "conversation-respond",
                "Do I have analytics access?",
                capabilityContext,
                null,
                null,
                null,
                List.<ChatMessage>of(),
                streamedText::append,
                error -> {
                    throw new AssertionError(error);
                },
                completed::countDown,
                executionPlans::add,
                executionSteps::add,
                toolCalls::add,
                toolResults::add
        );

        assertTrue(completed.await(1, TimeUnit.SECONDS));
        assertEquals("You have access to analytics for cashflow.", streamedText.toString());
        assertTrue(executionPlans.isEmpty());
        assertTrue(executionSteps.isEmpty());
        assertTrue(toolCalls.isEmpty());
        assertTrue(toolResults.isEmpty());
    }

    @Test
    void processMessageStreamingEmitsClarificationQuestionWithoutToolExecution() throws Exception {
        ToolRegistry toolRegistry = analyticsToolRegistry();
        UserCapabilityContext capabilityContext = advisorContext();
        AgentService agentService = createAgentService(
                toolRegistry,
                capabilityContext,
                new AgentDecision(
                        AgentDecisionType.CLARIFY,
                        null,
                        "Which app should I check?",
                        null
                ),
                null
        );

        List<ToolCall> toolCalls = new CopyOnWriteArrayList<>();
        List<ToolResult> toolResults = new CopyOnWriteArrayList<>();
        StringBuilder streamedText = new StringBuilder();
        CountDownLatch completed = new CountDownLatch(1);

        agentService.processMessageStreaming(
                "conversation-clarify",
                "Get app usage count.",
                capabilityContext,
                null,
                null,
                null,
                List.<ChatMessage>of(),
                streamedText::append,
                error -> {
                    throw new AssertionError(error);
                },
                completed::countDown,
                executionPlanEvent -> {
                },
                executionStepEvent -> {
                },
                toolCalls::add,
                toolResults::add
        );

        assertTrue(completed.await(1, TimeUnit.SECONDS));
        assertEquals("Which app should I check?", streamedText.toString());
        assertTrue(toolCalls.isEmpty());
        assertTrue(toolResults.isEmpty());
    }

    @Test
    void processMessageStreamingExecutesValidatedPlanAndEmitsFinalSummary() throws Exception {
        ToolRegistry toolRegistry = analyticsToolRegistry();
        UserCapabilityContext capabilityContext = advisorContext();
        AgentService agentService = createAgentService(
                toolRegistry,
                capabilityContext,
                new AgentDecision(
                        AgentDecisionType.PLAN,
                        null,
                        null,
                        new AgentPlan(List.of(new AgentPlanStep(
                                "app-usage-statistics",
                                Map.of(
                                        "appName", "cashflow",
                                        "startTime", "2026-04-01",
                                        "endTime", "2026-04-08"
                                )
                        )))
                ),
                "cashflow usage from 2026-04-01 to 2026-04-08: PV 120, UV 30."
        );

        List<ToolCall> toolCalls = new CopyOnWriteArrayList<>();
        List<ToolResult> toolResults = new CopyOnWriteArrayList<>();
        List<ExecutionPlanEvent> executionPlans = new CopyOnWriteArrayList<>();
        List<ExecutionStepEvent> executionSteps = new CopyOnWriteArrayList<>();
        StringBuilder streamedText = new StringBuilder();
        CountDownLatch completed = new CountDownLatch(1);

        agentService.processMessageStreaming(
                "conversation-plan",
                "Get app usage count for cashflow from 2026-04-01 to 2026-04-08",
                capabilityContext,
                null,
                null,
                null,
                List.<ChatMessage>of(),
                streamedText::append,
                error -> {
                    throw new AssertionError(error);
                },
                completed::countDown,
                executionPlans::add,
                executionSteps::add,
                toolCalls::add,
                toolResults::add
        );

        assertTrue(completed.await(1, TimeUnit.SECONDS));
        assertEquals(2, executionPlans.size());
        assertEquals("running", executionPlans.get(0).getStatus());
        assertEquals("completed", executionPlans.get(1).getStatus());
        assertEquals(2, executionSteps.size());
        assertEquals("running", executionSteps.get(0).getStatus());
        assertEquals("completed", executionSteps.get(1).getStatus());
        assertEquals(1, toolCalls.size());
        assertEquals("statistic_count_by_app", toolCalls.get(0).getName());
        assertEquals(ToolCall.ToolStatus.RUNNING, toolCalls.get(0).getStatus());
        assertFalse(toolCalls.get(0).isRequiresConfirmation());
        assertEquals("cashflow", toolCalls.get(0).getArguments().get("appName"));
        assertEquals("2026-04-01", toolCalls.get(0).getArguments().get("startTime"));
        assertEquals("2026-04-08", toolCalls.get(0).getArguments().get("endTime"));
        assertEquals(1, toolResults.size());
        assertEquals(toolCalls.get(0).getId(), toolResults.get(0).getToolCallId());
        assertEquals("statistic_count_by_app", toolResults.get(0).getToolName());
        assertEquals(120, ((Map<?, ?>) toolResults.get(0).getResult()).get("pv"));
        assertEquals(30, ((Map<?, ?>) toolResults.get(0).getResult()).get("uv"));
        assertEquals(
                List.of(
                        Map.of("timestamp", "2026-04-01T00:00:00Z", "pv", 50, "uv", 12),
                        Map.of("timestamp", "2026-04-08T00:00:00Z", "pv", 70, "uv", 18)
                ),
                ((Map<?, ?>) toolResults.get(0).getResult()).get("trendPoints")
        );
        assertEquals("cashflow usage from 2026-04-01 to 2026-04-08: PV 120, UV 30.", streamedText.toString());
    }

    private static AgentService createAgentService(
            ToolRegistry toolRegistry,
            UserCapabilityContext capabilityContext,
            AgentDecision decision,
            String synthesizedSummary
    ) {
        CapabilityResolver capabilityResolver = new CapabilityResolver(
                new CapabilityRegistryService(new ObjectMapper()),
                toolRegistry
        );
        PolicyEvaluator policyEvaluator = new PolicyEvaluator();
        return new AgentService(
                toolRegistry,
                capabilityResolver,
                policyEvaluator,
                new ExecutionPlanner(),
                new StubAgentDecisionService(decision),
                new PlanValidationService(policyEvaluator),
                new ExecutionOrchestrator((capability, arguments) -> toolRegistry.resolveTools(capabilityContext)
                        .get(capability.getTargetName())
                        .execute(arguments)
                        .join()),
                new StubResultSynthesisService(synthesizedSummary)
        );
    }

    private static ToolRegistry analyticsToolRegistry() {
        ToolRegistry toolRegistry = new ToolRegistry(List.of());
        toolRegistry.registerMcpProvider(
                "elasticsearch-analytics",
                List.of("advisor"),
                Map.of(
                        "statistic_count_by_app",
                        new TestToolDefinition(
                                "statistic_count_by_app",
                                "Return PV and UV counts for an app within a time window",
                                Map.of("type", "object"),
                                arguments -> Map.of(
                                        "appName", arguments.get("appName"),
                                        "startTime", arguments.get("startTime"),
                                        "endTime", arguments.get("endTime"),
                                        "pv", 120,
                                        "uv", 30,
                                        "trendPoints", List.of(
                                                Map.of("timestamp", "2026-04-01T00:00:00Z", "pv", 50, "uv", 12),
                                                Map.of("timestamp", "2026-04-08T00:00:00Z", "pv", 70, "uv", 18)
                                        )
                                )
                        )
                )
        );
        return toolRegistry;
    }

    private static UserCapabilityContext advisorContext() {
        return UserCapabilityContext.builder()
                .userId("user-1")
                .profiles(Set.of("advisor"))
                .profileVersion("1")
                .profileFingerprint("user-1|advisor|1")
                .build();
    }

    private static final class StubAgentDecisionService extends AgentDecisionService {

        private final AgentDecision decision;

        private StubAgentDecisionService(AgentDecision decision) {
            super(new NoOpChatModel(), new AgentDecisionPromptFactory());
            this.decision = decision;
        }

        @Override
        public AgentDecision decide(
                String userMessage,
                List<ChatMessage> history,
                List<ResolvedCapability> capabilities,
                com.fdc3.chatbot.controlplane.model.WorkspaceContextSnapshot workspaceContextSnapshot
        ) {
            return decision;
        }
    }

    private static final class StubResultSynthesisService extends ResultSynthesisService {

        private final String summary;

        private StubResultSynthesisService(String summary) {
            this.summary = summary;
        }

        @Override
        public String synthesize(
                String userMessage,
                AgentDecision decision,
                ExecutionTranscript transcript
        ) {
            return summary;
        }
    }

    private static final class NoOpChatModel implements ChatModel {

        @Override
        public ChatResponse doChat(ChatRequest chatRequest) {
            return ChatResponse.builder()
                    .aiMessage(AiMessage.from("{}"))
                    .build();
        }
    }

    private static final class TestToolDefinition implements ToolDefinition {

        private final String name;
        private final String description;
        private final Map<String, Object> parameters;
        private final java.util.function.Function<Map<String, Object>, Object> executor;

        private TestToolDefinition(
                String name,
                String description,
                Map<String, Object> parameters,
                java.util.function.Function<Map<String, Object>, Object> executor
        ) {
            this.name = name;
            this.description = description;
            this.parameters = parameters;
            this.executor = executor;
        }

        @Override
        public String getName() {
            return name;
        }

        @Override
        public String getDescription() {
            return description;
        }

        @Override
        public Map<String, Object> getParameters() {
            return parameters;
        }

        @Override
        public CompletableFuture<Object> execute(Map<String, Object> arguments) {
            return CompletableFuture.completedFuture(executor.apply(arguments));
        }
    }
}
