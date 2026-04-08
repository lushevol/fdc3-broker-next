package com.fdc3.chatbot.agent;

import com.fdc3.chatbot.controlplane.CapabilityRegistryService;
import com.fdc3.chatbot.controlplane.CapabilityResolver;
import com.fdc3.chatbot.controlplane.model.ResolvedCapability;
import com.fdc3.chatbot.controlplane.model.WorkspaceContextSnapshot;
import com.fdc3.chatbot.controlplane.planning.ExecutionPlanner;
import com.fdc3.chatbot.controlplane.policy.PolicyEvaluator;
import com.fdc3.chatbot.model.ExecutionPlanEvent;
import com.fdc3.chatbot.model.ExecutionStepEvent;
import com.fdc3.chatbot.model.ToolCall;
import com.fdc3.chatbot.model.ToolResult;
import com.fdc3.chatbot.model.UserCapabilityContext;
import com.fdc3.chatbot.tool.ToolDefinition;
import com.fdc3.chatbot.tool.ToolRegistry;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class AgentControlPlaneExecutionTest {

    @Test
    void processMessageStreamingExecutesPlannedReadOnlyMcpFlowBeforeLlmPath() throws Exception {
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
                                        "pv", 120,
                                        "uv", 30
                                )
                        ),
                        "chart_by_app",
                        new TestToolDefinition(
                                "chart_by_app",
                                "Return PV and UV trend points for an app within a time window",
                                Map.of("type", "object"),
                                arguments -> Map.of(
                                        "points", List.of(
                                                Map.of("timestamp", "2026-04-01T00:00:00Z", "pv", 50, "uv", 12),
                                                Map.of("timestamp", "2026-04-08T00:00:00Z", "pv", 70, "uv", 18)
                                        )
                                )
                        )
                )
        );

        CapabilityResolver capabilityResolver = new CapabilityResolver(
                new CapabilityRegistryService(new ObjectMapper()),
                toolRegistry
        );
        AgentService agentService = new AgentService(
                toolRegistry,
                capabilityResolver,
                new PolicyEvaluator(),
                new ExecutionPlanner()
        );

        List<ToolCall> toolCalls = new CopyOnWriteArrayList<>();
        List<ToolResult> toolResults = new CopyOnWriteArrayList<>();
        List<ExecutionPlanEvent> executionPlans = new CopyOnWriteArrayList<>();
        List<ExecutionStepEvent> executionSteps = new CopyOnWriteArrayList<>();
        StringBuilder streamedText = new StringBuilder();
        CountDownLatch completed = new CountDownLatch(1);

        agentService.processMessageStreaming(
                "conversation-mcp-read-1",
                "Get app usage count for cashflow from 2026-04-01 to 2026-04-08",
                UserCapabilityContext.builder()
                        .userId("user-1")
                        .profiles(Set.of("advisor"))
                        .profileVersion("1")
                        .profileFingerprint("user-1|advisor|1")
                        .build(),
                null,
                null,
                null,
                List.of(),
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

        assertEquals(1, toolResults.size());
        assertEquals(toolCalls.get(0).getId(), toolResults.get(0).getToolCallId());
        assertEquals(120, ((Map<?, ?>) toolResults.get(0).getResult()).get("pv"));
        assertEquals(30, ((Map<?, ?>) toolResults.get(0).getResult()).get("uv"));
        assertEquals(
                List.of(
                        Map.of("timestamp", "2026-04-01T00:00:00Z", "pv", 50, "uv", 12),
                        Map.of("timestamp", "2026-04-08T00:00:00Z", "pv", 70, "uv", 18)
                ),
                ((Map<?, ?>) toolResults.get(0).getResult()).get("trendPoints")
        );
        assertTrue(streamedText.toString().contains("cashflow"));
        assertTrue(streamedText.toString().contains("PV 120"));
        assertTrue(streamedText.toString().contains("UV 30"));
    }

    @Test
    void processMessageStreamingFallsBackToWorkspaceActiveAppForReadOnlyMcpFlow() throws Exception {
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
                                        "appId", arguments.get("appId"),
                                        "pv", 80,
                                        "uv", 24
                                )
                        ),
                        "chart_by_app",
                        new TestToolDefinition(
                                "chart_by_app",
                                "Return PV and UV trend points for an app within a time window",
                                Map.of("type", "object"),
                                arguments -> Map.of(
                                        "points", List.of(
                                                Map.of("timestamp", "2026-04-01T00:00:00Z", "pv", 32, "uv", 9),
                                                Map.of("timestamp", "2026-04-08T00:00:00Z", "pv", 48, "uv", 15)
                                        )
                                )
                        )
                )
        );

        CapabilityResolver capabilityResolver = new CapabilityResolver(
                new CapabilityRegistryService(new ObjectMapper()),
                toolRegistry
        );
        AgentService agentService = new AgentService(
                toolRegistry,
                capabilityResolver,
                new PolicyEvaluator(),
                new ExecutionPlanner()
        );

        List<ToolCall> toolCalls = new CopyOnWriteArrayList<>();
        List<ToolResult> toolResults = new CopyOnWriteArrayList<>();
        List<ExecutionPlanEvent> executionPlans = new CopyOnWriteArrayList<>();
        List<ExecutionStepEvent> executionSteps = new CopyOnWriteArrayList<>();
        StringBuilder streamedText = new StringBuilder();
        CountDownLatch completed = new CountDownLatch(1);

        agentService.processMessageStreaming(
                "conversation-mcp-read-2",
                "Get app usage count from 2026-04-01 to 2026-04-08",
                UserCapabilityContext.builder()
                        .userId("user-1")
                        .profiles(Set.of("advisor"))
                        .profileVersion("1")
                        .profileFingerprint("user-1|advisor|1")
                        .build(),
                null,
                null,
                WorkspaceContextSnapshot.builder()
                        .workspaceId("workspace-1")
                        .activeTileId("tile-2")
                        .activeAppId("template_tile_fdc3_2")
                        .build(),
                List.of(),
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
        assertEquals("template_tile_fdc3_2", toolCalls.get(0).getArguments().get("appId"));

        assertEquals(1, toolResults.size());
        assertEquals(80, ((Map<?, ?>) toolResults.get(0).getResult()).get("pv"));
        assertEquals(24, ((Map<?, ?>) toolResults.get(0).getResult()).get("uv"));
        assertEquals(
                List.of(
                        Map.of("timestamp", "2026-04-01T00:00:00Z", "pv", 32, "uv", 9),
                        Map.of("timestamp", "2026-04-08T00:00:00Z", "pv", 48, "uv", 15)
                ),
                ((Map<?, ?>) toolResults.get(0).getResult()).get("trendPoints")
        );
        assertTrue(streamedText.toString().contains("template_tile_fdc3_2"));
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
        public java.util.concurrent.CompletableFuture<Object> execute(Map<String, Object> arguments) {
            return java.util.concurrent.CompletableFuture.completedFuture(executor.apply(arguments));
        }
    }
}
