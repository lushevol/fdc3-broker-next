package com.fdc3.chatbot.agent;

import com.fdc3.chatbot.agent.model.AgentDecision;
import com.fdc3.chatbot.agent.model.AgentDecisionType;
import com.fdc3.chatbot.agent.model.AgentPlan;
import com.fdc3.chatbot.agent.model.AgentPlanStep;
import com.fdc3.chatbot.agent.model.ExecutionTranscript;
import com.fdc3.chatbot.agent.prompt.AgentDecisionPromptFactory;
import com.fdc3.chatbot.agent.prompt.ResultSynthesisPromptFactory;
import com.fdc3.chatbot.controlplane.CapabilityResolver;
import com.fdc3.chatbot.controlplane.model.ResolvedCapability;
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
import org.junit.jupiter.api.Test;
import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.model.Generation;
import org.springframework.ai.chat.model.StreamingChatModel;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.test.util.ReflectionTestUtils;
import reactor.core.publisher.Flux;

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
    private static final String FRONTEND_TOOL_MANIFEST = "[{\"name\":\"report_workspace_status\"}]";

    private static ChatResponse chatResponse(String text) {
        return ChatResponse.builder()
                .generations(List.of(new Generation(new AssistantMessage(text == null ? "" : text))))
                .build();
    }


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
    void processMessageStreamingStreamsDirectAssistantResponseInMultipleChunks() throws Exception {
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
        ReflectionTestUtils.setField(agentService, "streamingChatModel", new FixedStreamingChatModel(
                List.of("You have access ", "to analytics for cashflow.")
        ));

        List<String> streamedChunks = new CopyOnWriteArrayList<>();
        CountDownLatch completed = new CountDownLatch(1);

        agentService.processMessageStreaming(
                "conversation-respond-streaming",
                "Do I have analytics access?",
                capabilityContext,
                null,
                null,
                null,
                List.<ChatMessage>of(),
                streamedChunks::add,
                error -> {
                    throw new AssertionError(error);
                },
                completed::countDown,
                executionPlanEvent -> {
                },
                executionStepEvent -> {
                },
                toolCall -> {
                },
                toolResult -> {
                }
        );

        assertTrue(completed.await(1, TimeUnit.SECONDS));
        assertEquals(List.of("You have access ", "to analytics for cashflow."), streamedChunks);
    }

    @Test
    void shouldClarifyWhenAppAndWorkspaceContextAreMissing() throws Exception {
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
                "Get app usage count",
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
    void shouldPlanExecuteAndSummarizeForExplicitApp() throws Exception {
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
                                "visited_user_count_by_application",
                                Map.of(
                                        "application", "cashflow",
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
                FRONTEND_TOOL_MANIFEST,
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
        assertEquals("visited_user_count_by_application", toolCalls.get(0).getName());
        assertEquals(ToolCall.ToolStatus.RUNNING, toolCalls.get(0).getStatus());
        assertFalse(toolCalls.get(0).isRequiresConfirmation());
        assertEquals("cashflow", toolCalls.get(0).getArguments().get("application"));
        assertEquals("2026-04-01T00:00:00Z", toolCalls.get(0).getArguments().get("startTime"));
        assertEquals("2026-04-09T00:00:00Z", toolCalls.get(0).getArguments().get("endTime"));
        assertEquals(1, toolResults.size());
        assertEquals(toolCalls.get(0).getId(), toolResults.get(0).getToolCallId());
        assertEquals("visited_user_count_by_application", toolResults.get(0).getToolName());
        assertEquals("application", ((Map<?, ?>) toolResults.get(0).getResult()).get("appFilterType"));
        assertEquals("cashflow", ((Map<?, ?>) toolResults.get(0).getResult()).get("appFilterValue"));
        assertEquals("2026-04-01T00:00:00Z", ((Map<?, ?>) toolResults.get(0).getResult()).get("startTime"));
        assertEquals("2026-04-09T00:00:00Z", ((Map<?, ?>) toolResults.get(0).getResult()).get("endTime"));
        assertEquals(120, ((Map<?, ?>) toolResults.get(0).getResult()).get("pv"));
        assertEquals(30, ((Map<?, ?>) toolResults.get(0).getResult()).get("uv"));
        assertEquals(
                "cashflow usage from 2026-04-01 to 2026-04-08: PV 120, UV 30.",
                streamedText.toString()
        );
    }

    @Test
    void shouldStreamSynthesizedSummaryAfterPlanExecution() throws Exception {
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
                                "visited_user_count_by_application",
                                Map.of(
                                        "application", "cashflow",
                                        "startTime", "2026-04-01",
                                        "endTime", "2026-04-08"
                                )
                        )))
                ),
                null,
                null,
                new ResultSynthesisService(
                        null,
                        new FixedStreamingChatModel(List.of(
                                "cashflow usage from ",
                                "2026-04-01 to 2026-04-08: PV 120, UV 30."
                        )),
                        new ResultSynthesisPromptFactory()
                )
        );

        List<String> streamedChunks = new CopyOnWriteArrayList<>();
        CountDownLatch completed = new CountDownLatch(1);

        agentService.processMessageStreaming(
                "conversation-plan-streaming",
                "Get app usage count for cashflow from 2026-04-01 to 2026-04-08",
                capabilityContext,
                null,
                FRONTEND_TOOL_MANIFEST,
                null,
                List.<ChatMessage>of(),
                streamedChunks::add,
                error -> {
                    throw new AssertionError(error);
                },
                completed::countDown,
                executionPlanEvent -> {
                },
                executionStepEvent -> {
                },
                toolCall -> {
                },
                toolResult -> {
                }
        );

        assertTrue(completed.await(1, TimeUnit.SECONDS));
        assertEquals(
                List.of("cashflow usage from ", "2026-04-01 to 2026-04-08: PV 120, UV 30."),
                streamedChunks
        );
    }

    @Test
    void shouldFallBackToWorkspaceActiveAppWhenExplicitAppIsMissing() throws Exception {
        ToolRegistry toolRegistry = analyticsToolRegistry();
        UserCapabilityContext capabilityContext = advisorContext();
        com.fdc3.chatbot.controlplane.model.WorkspaceContextSnapshot workspaceContext =
                com.fdc3.chatbot.controlplane.model.WorkspaceContextSnapshot.builder()
                        .workspaceId("workspace-1")
                        .activeTileId("tile-2")
                        .activeAppId("template_tile_fdc3_2")
                        .build();
        AgentService agentService = createAgentService(
                toolRegistry,
                capabilityContext,
                new AgentDecision(
                        AgentDecisionType.PLAN,
                        null,
                        null,
                        new AgentPlan(List.of(new AgentPlanStep(
                                "visited_user_count_by_application",
                                Map.of(
                                        "application", "template_tile_fdc3_2",
                                        "startTime", "2026-04-01",
                                        "endTime", "2026-04-08"
                                )
                        )))
                ),
                "template_tile_fdc3_2 usage from 2026-04-01 to 2026-04-08: PV 80, UV 24."
        );

        List<ToolCall> toolCalls = new CopyOnWriteArrayList<>();
        List<ToolResult> toolResults = new CopyOnWriteArrayList<>();
        List<ExecutionPlanEvent> executionPlans = new CopyOnWriteArrayList<>();
        List<ExecutionStepEvent> executionSteps = new CopyOnWriteArrayList<>();
        StringBuilder streamedText = new StringBuilder();
        CountDownLatch completed = new CountDownLatch(1);

        agentService.processMessageStreaming(
                "conversation-plan",
                "Get app usage count from 2026-04-01 to 2026-04-08",
                capabilityContext,
                null,
                FRONTEND_TOOL_MANIFEST,
                workspaceContext,
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
        assertEquals("visited_user_count_by_application", toolCalls.get(0).getName());
        assertEquals(ToolCall.ToolStatus.RUNNING, toolCalls.get(0).getStatus());
        assertFalse(toolCalls.get(0).isRequiresConfirmation());
        assertEquals("template_tile_fdc3_2", toolCalls.get(0).getArguments().get("application"));
        assertEquals("2026-04-01T00:00:00Z", toolCalls.get(0).getArguments().get("startTime"));
        assertEquals("2026-04-09T00:00:00Z", toolCalls.get(0).getArguments().get("endTime"));
        assertEquals(1, toolResults.size());
        assertEquals(toolCalls.get(0).getId(), toolResults.get(0).getToolCallId());
        assertEquals("visited_user_count_by_application", toolResults.get(0).getToolName());
        assertEquals("application", ((Map<?, ?>) toolResults.get(0).getResult()).get("appFilterType"));
        assertEquals("template_tile_fdc3_2", ((Map<?, ?>) toolResults.get(0).getResult()).get("appFilterValue"));
        assertEquals("2026-04-01T00:00:00Z", ((Map<?, ?>) toolResults.get(0).getResult()).get("startTime"));
        assertEquals("2026-04-09T00:00:00Z", ((Map<?, ?>) toolResults.get(0).getResult()).get("endTime"));
        assertEquals(80, ((Map<?, ?>) toolResults.get(0).getResult()).get("pv"));
        assertEquals(24, ((Map<?, ?>) toolResults.get(0).getResult()).get("uv"));
        assertEquals(
                "template_tile_fdc3_2 usage from 2026-04-01 to 2026-04-08: PV 80, UV 24.",
                streamedText.toString()
        );
    }

    @Test
    void processMessageStreamingSynthesizesFailureTranscriptInsteadOfShortCircuitingToError() throws Exception {
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
                                "visited_user_count_by_application",
                                Map.of(
                                        "application", "cashflow",
                                        "startTime", "2026-04-01",
                                        "endTime", "2026-04-08"
                                )
                        )))
                ),
                "LLM failure summary: the analytics provider timed out, so no usage totals are available.",
                new ExecutionOrchestrator((capability, arguments) -> {
                    throw new IllegalStateException("analytics provider timed out");
                })
        );

        List<ToolCall> toolCalls = new CopyOnWriteArrayList<>();
        List<ToolResult> toolResults = new CopyOnWriteArrayList<>();
        List<ExecutionPlanEvent> executionPlans = new CopyOnWriteArrayList<>();
        List<ExecutionStepEvent> executionSteps = new CopyOnWriteArrayList<>();
        List<Throwable> errors = new CopyOnWriteArrayList<>();
        StringBuilder streamedText = new StringBuilder();
        CountDownLatch completed = new CountDownLatch(1);

        agentService.processMessageStreaming(
                "conversation-plan-failure",
                "Get app usage count for cashflow from 2026-04-01 to 2026-04-08",
                capabilityContext,
                null,
                null,
                null,
                List.<ChatMessage>of(),
                streamedText::append,
                errors::add,
                completed::countDown,
                executionPlans::add,
                executionSteps::add,
                toolCalls::add,
                toolResults::add
        );

        assertTrue(completed.await(1, TimeUnit.SECONDS));
        assertTrue(errors.isEmpty());
        assertEquals(2, executionPlans.size());
        assertEquals("running", executionPlans.get(0).getStatus());
        assertEquals("failed", executionPlans.get(1).getStatus());
        assertEquals(2, executionSteps.size());
        assertEquals("running", executionSteps.get(0).getStatus());
        assertEquals("failed", executionSteps.get(1).getStatus());
        assertEquals(1, toolCalls.size());
        assertEquals(1, toolResults.size());
        assertEquals("analytics provider timed out", toolResults.get(0).getError());
        assertEquals(
                "LLM failure summary: the analytics provider timed out, so no usage totals are available.",
                streamedText.toString()
        );
    }

    private static AgentService createAgentService(
            ToolRegistry toolRegistry,
            UserCapabilityContext capabilityContext,
            AgentDecision decision,
            String synthesizedSummary
    ) {
        return createAgentService(
                toolRegistry,
                capabilityContext,
                decision,
                synthesizedSummary,
                null,
                null
        );
    }

    private static AgentService createAgentService(
            ToolRegistry toolRegistry,
            UserCapabilityContext capabilityContext,
            AgentDecision decision,
            String synthesizedSummary,
            StreamingChatModel streamingChatModel,
            ResultSynthesisService resultSynthesisService
    ) {
        CapabilityResolver capabilityResolver = new CapabilityResolver(
                toolRegistry
        );
        PolicyEvaluator policyEvaluator = new PolicyEvaluator();
        AgentService agentService = new AgentService(
                toolRegistry,
                capabilityResolver,
                policyEvaluator,
                new StubAgentDecisionService(decision),
                new PlanValidationService(policyEvaluator),
                null,
                resultSynthesisService == null
                        ? new ResultSynthesisService(
                        new FixedResponseChatModel(synthesizedSummary),
                        new ResultSynthesisPromptFactory()
                )
                        : resultSynthesisService
        );
        if (streamingChatModel != null) {
            ReflectionTestUtils.setField(agentService, "streamingChatModel", streamingChatModel);
        }
        return agentService;
    }

    private static AgentService createAgentService(
            ToolRegistry toolRegistry,
            UserCapabilityContext capabilityContext,
            AgentDecision decision,
            String synthesizedSummary,
            ExecutionOrchestrator executionOrchestrator
    ) {
        CapabilityResolver capabilityResolver = new CapabilityResolver(
                toolRegistry
        );
        PolicyEvaluator policyEvaluator = new PolicyEvaluator();
        return new AgentService(
                toolRegistry,
                capabilityResolver,
                policyEvaluator,
                new StubAgentDecisionService(decision),
                new PlanValidationService(policyEvaluator),
                executionOrchestrator,
                new ResultSynthesisService(
                        new FixedResponseChatModel(synthesizedSummary),
                        new ResultSynthesisPromptFactory()
                )
        );
    }

    private static ToolRegistry analyticsToolRegistry() {
        ToolRegistry toolRegistry = new ToolRegistry(List.of());
        toolRegistry.registerMcpProvider(
                        "elasticsearch-analytics",
                        List.of("advisor"),
                        Map.of(
                        "visited_user_count_by_application",
                        new TestToolDefinition(
                                "visited_user_count_by_application",
                                "Return PV and UV counts for an app within a time window",
                                Map.of("type", "object"),
                                arguments -> {
                                    Object appFilterValue = arguments.get("application");
                                    boolean workspaceFallback = "template_tile_fdc3_2".equals(appFilterValue);
                                    int pv = workspaceFallback ? 80 : 120;
                                    int uv = workspaceFallback ? 24 : 30;
                                    Map<String, Object> result = new java.util.LinkedHashMap<>();
                                    result.put("appFilterType", "application");
                                    result.put("appFilterValue", appFilterValue);
                                    result.put("startTime", arguments.get("startTime"));
                                    result.put("endTime", arguments.get("endTime"));
                                    result.put("pv", pv);
                                    result.put("uv", uv);
                                    return result;
                                }
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


    private static class NoOpChatModel implements ChatModel {

        @Override
        public ChatResponse call(Prompt prompt) {
            return chatResponse("{}");
        }

        @Override
        public Flux<ChatResponse> stream(Prompt prompt) {
            return Flux.just(chatResponse("{}"));
        }
    }

    private static final class FixedResponseChatModel extends NoOpChatModel {

        private final String responseText;

        private FixedResponseChatModel(String responseText) {
            this.responseText = responseText;
        }

        @Override
        public ChatResponse call(Prompt prompt) {
            return chatResponse(responseText);
        }
    }

    private static final class FixedStreamingChatModel implements StreamingChatModel {

        private final List<String> partialTokens;

        private FixedStreamingChatModel(List<String> partialTokens) {
            this.partialTokens = partialTokens;
        }

        @Override
        public Flux<ChatResponse> stream(Prompt prompt) {
            return Flux.fromIterable(partialTokens).map(AgentControlPlaneExecutionTest::chatResponse);
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
