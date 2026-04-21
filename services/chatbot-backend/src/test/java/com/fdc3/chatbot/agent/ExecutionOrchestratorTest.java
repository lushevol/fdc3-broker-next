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

import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.List;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.CopyOnWriteArrayList;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class ExecutionOrchestratorTest {

    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    @Test
    void shouldExecuteVisitedUserCountByApplicationAndReturnExecutionTranscript() throws Exception {
        ExecutionOrchestrator orchestrator = new ExecutionOrchestrator(new FakeMcpExecutor("""
                {
                  "application": "cashflow blotter",
                  "startTime": "2026-04-01T00:00:00Z",
                  "endTime": "2026-04-08T00:00:00Z",
                  "uv": 30
                }
                """));

        List<ToolCall> toolCalls = new CopyOnWriteArrayList<>();
        List<ToolResult> toolResults = new CopyOnWriteArrayList<>();
        ValidatedExecutionPlan validatedPlan = analyticsReadPlan();

        ExecutionTranscript transcript = orchestrator.execute(validatedPlan, toolCalls::add, toolResults::add);

        assertThat(toolCalls).hasSize(1);
        assertThat(toolCalls.get(0).getName()).isEqualTo("visited_user_count_by_application");
        assertThat(toolCalls.get(0).getExecutionTarget()).isEqualTo(ToolCall.ExecutionTarget.BACKEND);
        assertThat(toolCalls.get(0).getArguments()).containsEntry("application", "cashflow blotter");
        assertThat(toolCalls.get(0).getStatus()).isEqualTo(ToolCall.ToolStatus.RUNNING);

        assertThat(toolResults).hasSize(1);
        assertThat(toolResults.get(0).getToolCallId()).isEqualTo(toolCalls.get(0).getId());
        assertThat(toolResults.get(0).getToolName()).isEqualTo("visited_user_count_by_application");
        assertThat(toolResults.get(0).getResult()).isEqualTo(Map.of(
                "application", "cashflow blotter",
                "startTime", "2026-04-01T00:00:00Z",
                "endTime", "2026-04-08T00:00:00Z",
                "uv", 30
        ));

        assertThat(transcript.plan()).isEqualTo(validatedPlan);
        assertThat(transcript.toolCalls()).hasSize(1);
        assertThat(transcript.toolCalls().get(0).getId()).isEqualTo(toolCalls.get(0).getId());
        assertThat(transcript.toolCalls().get(0).getName()).isEqualTo(toolCalls.get(0).getName());
        assertThat(transcript.toolResults()).containsExactlyElementsOf(toolResults);
        assertThat(transcript.toolCalls().get(0).getStatus()).isEqualTo(ToolCall.ToolStatus.COMPLETED);
    }

    @Test
    void shouldNormalizeDateOnlyTimeArgumentsBeforeExecution() {
        CapturingExecutionDependency executionDependency = new CapturingExecutionDependency();
        ExecutionOrchestrator orchestrator = new ExecutionOrchestrator(executionDependency);
        ValidatedExecutionPlan validatedPlan = analyticsReadPlanWithIsoTimeInputs();

        orchestrator.execute(validatedPlan, null, null);

        assertThat(executionDependency.arguments()).containsEntry(
                "startTime",
                LocalDate.parse("2026-04-01").atStartOfDay().toInstant(ZoneOffset.UTC).toString()
        );
        assertThat(executionDependency.arguments()).containsEntry(
                "endTime",
                LocalDate.parse("2026-04-08").plusDays(1).atStartOfDay().toInstant(ZoneOffset.UTC).toString()
        );
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
        assertThat(transcript.toolCalls().get(0).getStatus()).isEqualTo(ToolCall.ToolStatus.FAILED);
    }

    @Test
    void shouldPreserveMapResultsContainingNullFields() {
        Map<String, Object> rawResult = new LinkedHashMap<>();
        rawResult.put("application", "cashflow blotter");
        rawResult.put("startTime", "2026-04-01T00:00:00Z");
        rawResult.put("endTime", "2026-04-08T00:00:00Z");
        rawResult.put("uv", 30);
        rawResult.put("points", null);

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
        assertThat(transcript.toolCalls().get(0).getStatus()).isEqualTo(ToolCall.ToolStatus.FAILED);
    }

    @Test
    void shouldEmitFallbackErrorWhenExceptionMessageIsBlank() {
        ExecutionOrchestrator orchestrator = new ExecutionOrchestrator((capability, arguments) -> {
            throw new IllegalStateException();
        });

        ExecutionTranscript transcript = orchestrator.execute(analyticsReadPlan(), null, null);

        assertThat(transcript.toolResults()).hasSize(1);
        assertThat(transcript.toolResults().get(0).getError()).isNotBlank();
        assertThat(transcript.toolCalls().get(0).getStatus()).isEqualTo(ToolCall.ToolStatus.FAILED);
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
                .targetName("visited_user_count_by_application")
                .executionType("mcp")
                .accessType("read")
                .tenantScope("global")
                .requiredInputs(List.of("application", "startTime", "endTime"))
                .availableToolNames(List.of("visited_user_count_by_application"))
                .build();

        ValidatedExecutionStep step = new ValidatedExecutionStep(
                capability.getCapabilityId(),
                capability,
                Map.of(
                        "application", "cashflow blotter",
                        "startTime", "2026-04-01T00:00:00Z",
                        "endTime", "2026-04-08T00:00:00Z"
                ),
                PolicyDecision.builder()
                        .decisionType(PolicyDecisionType.ALLOW)
                        .build()
        );

        return new ValidatedExecutionPlan(List.of(step));
    }

    private static ValidatedExecutionPlan analyticsReadPlanWithIsoTimeInputs() {
        ResolvedCapability capability = ResolvedCapability.builder()
                .capabilityId("app-usage-statistics")
                .providerId("elasticsearch-analytics")
                .targetName("visited_user_count_by_application")
                .executionType("mcp")
                .accessType("read")
                .tenantScope("global")
                .requiredInputs(List.of("startTime", "endTime"))
                .optionalInputs(List.of("application"))
                .availableToolNames(List.of("visited_user_count_by_application"))
                .build();

        ValidatedExecutionStep step = new ValidatedExecutionStep(
                capability.getCapabilityId(),
                capability,
                Map.of(
                        "application", "cashflow blotter",
                        "startTime", "2026-04-01",
                        "endTime", "2026-04-08"
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

    private static final class CapturingExecutionDependency implements ExecutionOrchestrator.ExecutionDependency {
        private Map<String, Object> arguments;

        @Override
        public Object execute(ResolvedCapability capability, Map<String, Object> arguments) {
            this.arguments = arguments;
            return Map.of("ok", true);
        }

        private Map<String, Object> arguments() {
            return arguments;
        }
    }
}
