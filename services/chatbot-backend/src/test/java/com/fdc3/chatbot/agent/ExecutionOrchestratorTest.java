package com.fdc3.chatbot.agent;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fdc3.chatbot.agent.model.ExecutionTranscript;
import com.fdc3.chatbot.agent.model.ValidatedExecutionPlan;
import com.fdc3.chatbot.agent.model.ValidatedExecutionStep;
import com.fdc3.chatbot.controlplane.model.ResolvedCapability;
import com.fdc3.chatbot.controlplane.policy.PolicyDecision;
import com.fdc3.chatbot.controlplane.policy.PolicyDecisionType;
import com.fdc3.chatbot.model.ToolCall;
import com.fdc3.chatbot.model.ToolResult;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.CopyOnWriteArrayList;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class ExecutionOrchestratorTest {

    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    @Test
    void shouldExecuteStatisticCountByAppAndReturnExecutionTranscript() throws Exception {
        ExecutionOrchestrator orchestrator = new ExecutionOrchestrator(new FakeMcpExecutor("""
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
                """));

        List<ToolCall> toolCalls = new CopyOnWriteArrayList<>();
        List<ToolResult> toolResults = new CopyOnWriteArrayList<>();
        ValidatedExecutionPlan validatedPlan = analyticsReadPlan();

        ExecutionTranscript transcript = orchestrator.execute(validatedPlan, toolCalls::add, toolResults::add);

        assertThat(toolCalls).hasSize(1);
        assertThat(toolCalls.get(0).getName()).isEqualTo("statistic_count_by_app");
        assertThat(toolCalls.get(0).getExecutionTarget()).isEqualTo(ToolCall.ExecutionTarget.BACKEND);
        assertThat(toolCalls.get(0).getArguments()).containsEntry("appName", "cashflow");

        assertThat(toolResults).hasSize(1);
        assertThat(toolResults.get(0).getToolCallId()).isEqualTo(toolCalls.get(0).getId());
        assertThat(toolResults.get(0).getToolName()).isEqualTo("statistic_count_by_app");
        assertThat(toolResults.get(0).getResult()).isEqualTo(Map.of(
                "appName", "cashflow",
                "from", "2026-04-01",
                "to", "2026-04-08",
                "pvTotal", 120,
                "uvTotal", 30,
                "trend", List.of(
                        Map.of("date", "2026-04-01", "pv", 40, "uv", 10),
                        Map.of("date", "2026-04-08", "pv", 80, "uv", 20)
                )
        ));

        assertThat(transcript.plan()).isEqualTo(validatedPlan);
        assertThat(transcript.toolCalls()).containsExactlyElementsOf(toolCalls);
        assertThat(transcript.toolResults()).containsExactlyElementsOf(toolResults);
    }

    @Test
    void shouldEmitTerminalToolResultWhenExecutorThrows() {
        ExecutionOrchestrator orchestrator = new ExecutionOrchestrator((capability, arguments) -> {
            throw new IllegalStateException("mcp execution failed");
        });

        List<ToolCall> toolCalls = new CopyOnWriteArrayList<>();
        List<ToolResult> toolResults = new CopyOnWriteArrayList<>();

        ExecutionTranscript transcript = orchestrator.execute(analyticsReadPlan(), toolCalls::add, toolResults::add);

        assertThat(toolCalls).hasSize(1);
        assertThat(toolResults).hasSize(1);
        assertThat(toolResults.get(0).getToolCallId()).isEqualTo(toolCalls.get(0).getId());
        assertThat(toolResults.get(0).getToolName()).isEqualTo(toolCalls.get(0).getName());
        assertThat(toolResults.get(0).getError()).isEqualTo("mcp execution failed");
        assertThat(toolResults.get(0).getResult()).isNull();
        assertThat(transcript.toolResults()).containsExactlyElementsOf(toolResults);
    }

    @Test
    void shouldPreserveMapResultsContainingNullFields() {
        Map<String, Object> rawResult = new LinkedHashMap<>();
        rawResult.put("appName", "cashflow");
        rawResult.put("from", "2026-04-01");
        rawResult.put("to", "2026-04-08");
        rawResult.put("pvTotal", null);
        rawResult.put("uvTotal", 30);
        rawResult.put("trend", null);

        ExecutionOrchestrator orchestrator = new ExecutionOrchestrator((capability, arguments) -> rawResult);

        ExecutionTranscript transcript = orchestrator.execute(analyticsReadPlan(), null, null);

        assertThat(transcript.toolCalls()).hasSize(1);
        assertThat(transcript.toolResults()).hasSize(1);
        assertThat(transcript.toolResults().get(0).getError()).isNull();
        assertThat(transcript.toolResults().get(0).getResult()).isEqualTo(rawResult);
    }

    @Test
    void shouldEmitTerminalToolResultWhenNormalizationFails() {
        ExecutionOrchestrator orchestrator = new ExecutionOrchestrator((capability, arguments) -> Map.of(1, "value"));

        List<ToolCall> toolCalls = new CopyOnWriteArrayList<>();
        List<ToolResult> toolResults = new CopyOnWriteArrayList<>();

        ExecutionTranscript transcript = orchestrator.execute(analyticsReadPlan(), toolCalls::add, toolResults::add);

        assertThat(toolCalls).hasSize(1);
        assertThat(toolResults).hasSize(1);
        assertThat(toolResults.get(0).getToolCallId()).isEqualTo(toolCalls.get(0).getId());
        assertThat(toolResults.get(0).getToolName()).isEqualTo(toolCalls.get(0).getName());
        assertThat(toolResults.get(0).getError()).contains("Cannot normalize");
        assertThat(transcript.toolResults()).containsExactlyElementsOf(toolResults);
    }

    @Test
    void shouldRejectNullExecutionDependency() {
        assertThatThrownBy(() -> new ExecutionOrchestrator(null))
                .isInstanceOf(NullPointerException.class)
                .hasMessage("executionDependency");
    }

    private static ValidatedExecutionPlan analyticsReadPlan() {
        ResolvedCapability capability = ResolvedCapability.builder()
                .capabilityId("analytics.app-usage.read")
                .providerId("elasticsearch-analytics")
                .targetName("statistic_count_by_app")
                .executionType("mcp")
                .accessType("read")
                .tenantScope("global")
                .requiredInputs(List.of("appName", "from", "to"))
                .availableToolNames(List.of("statistic_count_by_app"))
                .build();

        ValidatedExecutionStep step = new ValidatedExecutionStep(
                capability.getCapabilityId(),
                capability,
                Map.of(
                        "appName", "cashflow",
                        "from", "2026-04-01",
                        "to", "2026-04-08"
                ),
                PolicyDecision.builder()
                        .decisionType(PolicyDecisionType.ALLOW)
                        .build()
        );

        return new ValidatedExecutionPlan(List.of(step));
    }

    private static final class FakeMcpExecutor implements ExecutionOrchestrator.ExecutionDependency {

        private final String json;

        private FakeMcpExecutor(String json) {
            this.json = json;
        }

        @Override
        public Object execute(ResolvedCapability capability, Map<String, Object> arguments) {
            try {
                return OBJECT_MAPPER.readValue(json, new TypeReference<Map<String, Object>>() {
                });
            } catch (Exception exception) {
                throw new IllegalStateException(exception);
            }
        }
    }
}
