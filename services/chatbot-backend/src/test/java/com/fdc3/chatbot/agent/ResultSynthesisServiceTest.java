package com.fdc3.chatbot.agent;

import com.fdc3.chatbot.agent.model.AgentDecision;
import com.fdc3.chatbot.agent.model.AgentDecisionType;
import com.fdc3.chatbot.agent.model.AgentPlan;
import com.fdc3.chatbot.agent.model.AgentPlanStep;
import com.fdc3.chatbot.agent.model.ExecutionTranscript;
import com.fdc3.chatbot.agent.model.ValidatedExecutionPlan;
import com.fdc3.chatbot.agent.model.ValidatedExecutionStep;
import com.fdc3.chatbot.agent.prompt.ResultSynthesisPromptFactory;
import com.fdc3.chatbot.controlplane.model.ResolvedCapability;
import com.fdc3.chatbot.controlplane.policy.PolicyDecision;
import com.fdc3.chatbot.controlplane.policy.PolicyDecisionType;
import com.fdc3.chatbot.model.ToolCall;
import com.fdc3.chatbot.model.ToolResult;
import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.data.message.SystemMessage;
import dev.langchain4j.data.message.UserMessage;
import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.model.chat.request.ChatRequest;
import dev.langchain4j.model.chat.response.ChatResponse;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;
import java.util.Objects;

import static org.assertj.core.api.Assertions.assertThat;

class ResultSynthesisServiceTest {

    @Test
    void shouldUseModelOutputForSuccessfulTranscript() {
        CapturingChatModel chatModel = new CapturingChatModel(
                "LLM summary: cashflow produced 120 PV and 30 UV."
        );
        ResultSynthesisService service = new ResultSynthesisService(
                chatModel,
                new ResultSynthesisPromptFactory()
        );

        String result = service.synthesize(
                "Get app usage count for cashflow from 2026-04-01 to 2026-04-08",
                analyticsPlanDecision(),
                successfulTranscript()
        );

        assertThat(result).isEqualTo("LLM summary: cashflow produced 120 PV and 30 UV.");
        ChatRequest request = chatModel.capturedRequest();
        assertThat(request.messages()).hasSize(2);
        assertThat(request.messages().get(0)).isInstanceOf(SystemMessage.class);
        assertThat(((SystemMessage) request.messages().get(0)).text())
                .contains("Get app usage count for cashflow from 2026-04-01 to 2026-04-08")
                .contains("app-usage-statistics")
                .contains("statistic_count_by_app")
                .contains("\"pv\":120")
                .contains("\"uv\":30");
        assertThat(request.messages().get(1)).isInstanceOf(UserMessage.class);
        assertThat(((UserMessage) request.messages().get(1)).singleText()).isEqualTo(
                "Write the final assistant response using only the executed results."
        );
    }

    @Test
    void shouldUseModelOutputForFailureTranscript() {
        CapturingChatModel chatModel = new CapturingChatModel(
                "LLM summary: I couldn't complete the analytics request because the provider timed out."
        );
        ResultSynthesisService service = new ResultSynthesisService(
                chatModel,
                new ResultSynthesisPromptFactory()
        );

        String result = service.synthesize(
                "Get app usage count for cashflow from 2026-04-01 to 2026-04-08",
                analyticsPlanDecision(),
                failedTranscript()
        );

        assertThat(result).isEqualTo(
                "LLM summary: I couldn't complete the analytics request because the provider timed out."
        );
        ChatRequest request = chatModel.capturedRequest();
        assertThat(((SystemMessage) request.messages().get(0)).text())
                .contains("provider timed out")
                .contains("\"error\":\"provider timed out\"");
    }

    private static AgentDecision analyticsPlanDecision() {
        return new AgentDecision(
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
        );
    }

    private static ExecutionTranscript successfulTranscript() {
        ToolCall toolCall = ToolCall.builder()
                .id("tool-1")
                .name("statistic_count_by_app")
                .arguments(Map.of(
                        "appName", "cashflow",
                        "startTime", "2026-04-01",
                        "endTime", "2026-04-08"
                ))
                .status(ToolCall.ToolStatus.COMPLETED)
                .executionTarget(ToolCall.ExecutionTarget.BACKEND)
                .build();
        ToolResult toolResult = ToolResult.builder()
                .toolCallId("tool-1")
                .toolName("statistic_count_by_app")
                .result(Map.of(
                        "appName", "cashflow",
                        "startTime", "2026-04-01",
                        "endTime", "2026-04-08",
                        "pv", 120,
                        "uv", 30
                ))
                .build();
        return new ExecutionTranscript(validatedPlan(), List.of(toolCall), List.of(toolResult));
    }

    private static ExecutionTranscript failedTranscript() {
        ToolCall toolCall = ToolCall.builder()
                .id("tool-1")
                .name("statistic_count_by_app")
                .arguments(Map.of(
                        "appName", "cashflow",
                        "startTime", "2026-04-01",
                        "endTime", "2026-04-08"
                ))
                .status(ToolCall.ToolStatus.FAILED)
                .executionTarget(ToolCall.ExecutionTarget.BACKEND)
                .build();
        ToolResult toolResult = ToolResult.builder()
                .toolCallId("tool-1")
                .toolName("statistic_count_by_app")
                .error("provider timed out")
                .build();
        return new ExecutionTranscript(validatedPlan(), List.of(toolCall), List.of(toolResult));
    }

    private static ValidatedExecutionPlan validatedPlan() {
        ResolvedCapability capability = ResolvedCapability.builder()
                .capabilityId("app-usage-statistics")
                .providerId("elasticsearch-analytics")
                .targetName("statistic_count_by_app")
                .executionType("mcp")
                .accessType("read")
                .tenantScope("global")
                .requiredInputs(List.of("startTime", "endTime"))
                .optionalInputs(List.of("appName"))
                .build();

        ValidatedExecutionStep step = new ValidatedExecutionStep(
                capability.getCapabilityId(),
                capability,
                Map.of(
                        "appName", "cashflow",
                        "startTime", "2026-04-01",
                        "endTime", "2026-04-08"
                ),
                PolicyDecision.builder()
                        .decisionType(PolicyDecisionType.ALLOW)
                        .build()
        );

        return new ValidatedExecutionPlan(List.of(step));
    }

    private static final class CapturingChatModel implements ChatModel {

        private final String responseText;
        private ChatRequest capturedRequest;

        private CapturingChatModel(String responseText) {
            this.responseText = responseText;
        }

        @Override
        public ChatResponse doChat(ChatRequest chatRequest) {
            this.capturedRequest = chatRequest;
            return ChatResponse.builder()
                    .aiMessage(AiMessage.from(responseText))
                    .build();
        }

        private ChatRequest capturedRequest() {
            return Objects.requireNonNull(capturedRequest, "Chat request was not captured");
        }
    }
}
